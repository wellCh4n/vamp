import { evalScope, repl, type Hap, type Pattern, type Repl } from '@strudel/core'
import {
  aliasBank,
  analysers,
  getAudioContext,
  drawFrequencyScope,
  drawTimeScope,
  getAudioContextCurrentTime,
  initAudio,
  registerSynthSounds,
  resetGlobalEffects,
  samples,
  setAudioContext,
  setSuperdoughAudioController,
  superdough,
  webaudioOutput,
} from '@strudel/webaudio'
import { transpiler } from '@strudel/transpiler'
import { Drawer, drawPianoroll } from '@strudel/draw'
import { flash, highlightMiniLocations, updateMiniLocations } from '@strudel/codemirror'
import type { EditorView } from '@codemirror/view'

/**
 * Strudel 引擎封装（对应官方 REPL 的 StrudelMirror，但不接管主题 / DOM）。
 *
 * - 只初始化一次（React StrictMode 下 effect 会跑两次）。
 * - 默认加载和官方 REPL 一样的音色：鼓机、钢琴、VCSL 乐器、Dirt-Samples 杂项、GM soundfonts，
 *   外加本项目自带的京剧锣鼓采样（public/samples/chinese-traditional）。
 * - 通过 attachEditor() 挂上 CodeMirror 视图后，会把 mini-notation 位置和
 *   当前播放的事件高亮同步到编辑器里。
 * - 监听 Strudel 的日志事件，把"触发时"的错误（例如音色不存在）也暴露出来。
 */

const CDN = 'https://strudel.b-cdn.net'
/** Strudel core 的 logger 会往 document 上派发这个事件 */
const STRUDEL_LOG_EVENT = 'strudel.log'

export type EngineStatus = 'idle' | 'loading' | 'ready' | 'error'

export interface EngineState {
  status: EngineStatus
  started: boolean
  /** 暂停中：位置保留，再按播放从原处继续；stop 才回到开头 */
  paused: boolean
  error?: string
}

type Listener = (state: EngineState) => void

/** 播放进度：当前 cycle 位置（小数部分就是 cycle 内的进度）、速度、本次播放开始的时间戳 */
export interface Transport {
  cycle: number
  cps: number
  startedAt: number
}
type TransportListener = (t: Transport) => void
const transportListeners = new Set<TransportListener>()
let startedAt = 0

let replInstance: Repl | undefined
let drawer: Drawer | undefined
let prebaked: Promise<unknown> | undefined
let audioReady: Promise<void> | undefined
let editorView: EditorView | null = null
let canvas: HTMLCanvasElement | null = null
let miniLocations: [number, number][] = []
/** 当前播放属于哪个工程（播放是工程级别的，切到别的工程要停） */
let playingOwner: string | null = null

/** 可视化窗口：播放头在最左，向前看 4 个 cycle（和官方文档的 punchcard 一致） */
const DRAW_TIME: [number, number] = [0, 4]
/** 未激活音符的填充色（浅灰 + 黑字，深浅色主题都能读） */
const ROLL_INACTIVE = '#cbd5e1'
/** 所有 pattern 的输出都接到这个分析器上，波形 / 频谱从这里取数据 */
const ANALYSER_ID = 1

export type Visualization = 'roll' | 'scope' | 'spectrum'
let visualization: Visualization = 'roll'
let state: EngineState = { status: 'idle', started: false, paused: false }
const listeners = new Set<Listener>()

/** 触发时错误（播放过程中由 scheduler 报出来的），按时间记录 */
interface RuntimeError {
  message: string
  at: number
}
let runtimeErrors: RuntimeError[] = []
let logListenerInstalled = false

function emit(patch: Partial<EngineState>) {
  state = { ...state, ...patch }
  listeners.forEach((l) => l(state))
}

export function subscribe(listener: Listener) {
  listeners.add(listener)
  listener(state)
  return () => {
    listeners.delete(listener)
  }
}

export function getState() {
  return state
}

/** 订阅播放进度（每帧一次，播放时才会触发）。返回取消函数。 */
export function subscribeTransport(listener: TransportListener) {
  transportListeners.add(listener)
  return () => {
    transportListeners.delete(listener)
  }
}

function installLogListener() {
  if (logListenerInstalled || typeof document === 'undefined') return
  logListenerInstalled = true
  document.addEventListener(STRUDEL_LOG_EVENT, (event) => {
    const detail = (event as CustomEvent<{ message?: string; type?: string }>).detail
    const message = detail?.message ?? ''
    // 求值错误已经由 onEvalError 处理；这里只关心播放过程中的错误，例如 "[getTrigger] error: sound xxx not found!"
    if (!message.includes('] error:') || message.startsWith('[eval]')) return
    const clean = message.replace(/^\[[^\]]*\]\s*error:\s*/, '')
    runtimeErrors.push({ message: clean, at: performance.now() })
    if (runtimeErrors.length > 50) runtimeErrors = runtimeErrors.slice(-50)
    emit({ error: clean })
  })
}

/** 取 since 之后出现的触发时错误（去重） */
export function getRuntimeErrors(since: number): string[] {
  return [...new Set(runtimeErrors.filter((e) => e.at >= since).map((e) => e.message))]
}

/** 等一小段时间，看播放过程中有没有冒出错误（音色不存在等只在触发时才会报） */
export async function waitForRuntimeErrors(since: number, ms = 1500): Promise<string[]> {
  await new Promise((resolve) => setTimeout(resolve, ms))
  return getRuntimeErrors(since)
}

async function loadDefaultSamples() {
  await Promise.all([
    samples(`${CDN}/tidal-drum-machines.json`, `${CDN}/tidal-drum-machines/machines/`, {
      prebake: true,
      tag: 'drum-machines',
    }),
    samples(`${CDN}/piano.json`, `${CDN}/piano/`, { prebake: true }),
    samples(`${CDN}/vcsl.json`, `${CDN}/VCSL/`, { prebake: true }),
    samples(`${CDN}/uzu-drumkit.json`, `${CDN}/uzu-drumkit/`, { prebake: true, tag: 'drum-machines' }),
    // workshop 里用到的 casio / jazz / metal / insect / wind / east / space / numbers 等
    samples('github:tidalcycles/dirt-samples'),
    // 中国传统乐器：京剧锣鼓，mp3 随项目发布
    samples('/samples/chinese-traditional/strudel.json', undefined, { prebake: true }),
  ])
  // 让 bank("tr909") 这种简写也能用
  await aliasBank(`${CDN}/tidal-drum-machines-alias.json`)
}

/** GM 音色（gm_piano、gm_synth_bass_1 …）来自 soundfonts，按需从 CDN 加载 */
async function loadSoundfonts() {
  const { registerSoundfonts } = await import('@strudel/soundfonts')
  registerSoundfonts()
}

/** 把 Strudel 的函数注册到全局作用域，并加载合成器和音色。只跑一次。 */
function prebake() {
  if (prebaked) return prebaked
  installLogListener()
  emit({ status: 'loading', error: undefined })
  prebaked = Promise.all([
    evalScope(
      import('@strudel/core'),
      import('@strudel/mini'),
      import('@strudel/tonal'),
      import('@strudel/webaudio'),
    ),
    registerSynthSounds(),
    loadSoundfonts(),
    loadDefaultSamples(),
  ])
    .then(() => emit({ status: 'ready' }))
    .catch((err: Error) => {
      prebaked = undefined
      emit({ status: 'error', error: err.message })
      throw err
    })
  return prebaked
}

function getRepl(): Repl {
  if (replInstance) return replInstance

  // Drawer 每帧从 scheduler 查询可见事件：高亮编辑器里对应的 mini-notation，并画 pianoroll
  drawer = new Drawer((haps: Hap[], time: number) => {
    if (editorView) {
      highlightMiniLocations(
        editorView,
        time,
        haps.filter((hap) => hap.isActive(time)),
      )
    }
    if (canvas) drawVisualization(haps, time)
    if (transportListeners.size) {
      const t: Transport = { cycle: time, cps: replInstance?.scheduler.cps ?? 0.5, startedAt }
      transportListeners.forEach((l) => l(t))
    }
  }, DRAW_TIME)

  replInstance = repl({
    defaultOutput: webaudioOutput,
    getTime: getAudioContextCurrentTime,
    transpiler,
    // 给没有自己指定分析器的事件挂上默认分析器，波形 / 频谱才有数据
    editPattern: (pattern) => withAnalyser(pattern),
    beforeEval: async () => {
      await prebake()
      await audioReady
    },
    afterEval: ({ meta }) => {
      miniLocations = meta?.miniLocations ?? []
      if (editorView) updateMiniLocations(editorView, miniLocations)
      drawer?.invalidate(replInstance!.scheduler)
      emit({ error: undefined })
    },
    onEvalError: (err) => emit({ error: err.message }),
    onToggle: (started) => {
      emit({ started })
      if (started) {
        startedAt = performance.now()
        drawer?.start(replInstance!.scheduler)
      } else {
        drawer?.stop()
        if (editorView) updateMiniLocations(editorView, [])
        clearRoll()
      }
    },
  })
  return replInstance
}

function withAnalyser(pattern: Pattern): Pattern {
  return pattern.fmap((value: unknown) => {
    if (!value || typeof value !== 'object') return value
    const v = value as { analyze?: unknown }
    return v.analyze === undefined ? { ...v, analyze: ANALYSER_ID } : v
  })
}

/** 切换编辑器下方的可视化：音符（pianoroll）、波形（示波器）、频谱 */
export function setVisualization(mode: Visualization) {
  visualization = mode
  if (!state.started) clearRoll()
}

export function getVisualization() {
  return visualization
}

function drawVisualization(haps: Hap[], time: number) {
  if (!canvas || canvas.width === 0) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  // canvas 继承页面的前景色
  const foreground = getComputedStyle(canvas).color || '#888'
  const dpr = window.devicePixelRatio || 1
  if (visualization === 'scope') {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawTimeScope(analysers[ANALYSER_ID], { ctx, id: ANALYSER_ID, color: foreground, thickness: 2 * dpr, scale: 0.45, pos: 0.5, align: true })
    return
  }
  if (visualization === 'spectrum') {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawFrequencyScope(analysers[ANALYSER_ID], { ctx, id: ANALYSER_ID, color: foreground, scale: 1, pos: 1, lean: 1 })
    return
  }
  drawRoll(haps, time, ctx, foreground)
}

function drawRoll(haps: Hap[], time: number, ctx: CanvasRenderingContext2D, foreground: string) {
  drawPianoroll({
    ctx,
    time,
    haps,
    drawTime: DRAW_TIME,
    labels: true,
    fill: 1,
    inactive: ROLL_INACTIVE,
    active: foreground,
    playheadColor: foreground,
    background: 'transparent',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  })
}

function clearRoll() {
  const ctx = canvas?.getContext('2d')
  if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height)
}

/** 挂上 pianoroll 用的 canvas（传 null 取消）。尺寸由调用方按 devicePixelRatio 设置。 */
export function attachCanvas(el: HTMLCanvasElement | null) {
  canvas = el
  if (!el) return
  if (!state.started) clearRoll()
}

/** 把 CodeMirror 视图挂到引擎上（传 null 取消）。 */
export function attachEditor(view: EditorView | null) {
  editorView = view
  if (view && miniLocations.length && state.started) {
    updateMiniLocations(view, miniLocations)
  }
}

/** 预热：提前加载模块和采样，这样第一次点播放时不用等太久。 */
export function warmup() {
  return prebake().catch(() => undefined)
}

/** 当前正在播放的工程 id（没在播放时为 null） */
export function getPlayingOwner() {
  return state.started ? playingOwner : null
}

/**
 * 执行一段 Strudel 代码并播放。返回 true 表示求值没有报错。必须在用户手势之后调用。
 * @param owner 发起播放的工程 id，用于切换工程时自动停止
 */
export async function play(code: string, owner: string | null = null): Promise<boolean> {
  playingOwner = owner
  emit({ paused: false })
  // AudioContext 只能在用户手势里恢复；这里正好在点击 / 快捷键的调用链中
  audioReady ??= initAudio().catch((err: Error) => {
    audioReady = undefined
    throw err
  })
  const r = getRepl()
  if (editorView) flash(editorView)
  emit({ error: undefined })
  const pattern = await r.evaluate(code, true)
  return pattern !== undefined
}

export interface ExportOptions {
  code: string
  /** 起始 cycle */
  begin: number
  /** 导出多少个 cycle */
  cycles: number
  sampleRate: number
  /** 文件名（不含扩展名） */
  name: string
}

export interface ExportResult {
  /** 渲染过程中的触发时错误（例如音色不存在），不影响文件生成 */
  warnings: string[]
  seconds: number
}

/**
 * 离线渲染并下载 WAV。思路和官方 REPL 的 renderPatternAudio 一样：把全局 AudioContext 换成
 * OfflineAudioContext，按时间顺序把区间内的事件交给 superdough 触发，渲染完编码成 WAV。
 * 不直接用 @strudel/webaudio 1.3.0 的 renderPatternAudio：它内部 new 的音频控制器带着一份
 * 私有的 AudioContext，导致 reverb / delay 发送时报 "different audio context"，导出的文件没有混响。
 * 这里只用 superdough 自己的 setAudioContext / 控制器懒创建，全程在同一个上下文里。
 */
export async function exportAudio({ code, begin, cycles, sampleRate, name }: ExportOptions): Promise<ExportResult> {
  await prebake()
  const r = getRepl()
  if (r.scheduler.started) stop()
  const pattern = await r.evaluate(code, false)
  if (!pattern) throw new Error(state.error ?? '代码没有产生可播放的 pattern')
  const cps = r.scheduler.cps
  const end = begin + cycles
  const seconds = cycles / cps
  const since = performance.now()

  // 已经排进实时上下文的事件让它们播完再关，否则会有一串 "context is closed" 警告
  await new Promise((resolve) => setTimeout(resolve, 200))
  const live = getAudioContext()
  await live.close()
  const offline = new OfflineAudioContext(2, Math.ceil(seconds * sampleRate), sampleRate)
  setAudioContext(offline)
  setSuperdoughAudioController(null)
  resetGlobalEffects()
  try {
    await initAudio({ multiChannelOrbits: false })
    // 按 onset 顺序触发很重要：cut 之类的控制依赖音频图的当前状态
    const haps = pattern
      .queryArc(begin, end, { _cps: cps })
      .filter((hap) => hap.hasOnset() && hap.whole)
      .sort((a, b) => a.whole!.begin.valueOf() - b.whole!.begin.valueOf())
    for (const hap of haps) {
      hap.ensureObjectValue()
      const t = (hap.whole!.begin.valueOf() - begin) / cps
      try {
        await superdough(hap.value as Record<string, unknown>, t, hap.duration / cps, cps, t)
      } catch (err) {
        runtimeErrors.push({ message: err instanceof Error ? err.message : String(err), at: performance.now() })
      }
    }
    const rendered = await offline.startRendering()
    downloadWav(rendered, `${name}.wav`)
  } finally {
    // 恢复实时上下文：superdough 下次 getAudioContext() 会新建，控制器和全局效果都要重来
    setAudioContext(null)
    setSuperdoughAudioController(null)
    resetGlobalEffects()
    audioReady = initAudio().catch((err: Error) => {
      audioReady = undefined
      throw err
    })
    await audioReady.catch(() => undefined)
  }
  return { warnings: getRuntimeErrors(since), seconds }
}

/** AudioBuffer → 16-bit PCM WAV，触发浏览器下载 */
function downloadWav(buffer: AudioBuffer, fileName: string) {
  const channels = buffer.numberOfChannels
  const frames = buffer.length
  const bytesPerSample = 2
  const blockAlign = channels * bytesPerSample
  const data = new ArrayBuffer(44 + frames * blockAlign)
  const view = new DataView(data)
  const writeString = (offset: number, text: string) => {
    for (let i = 0; i < text.length; i++) view.setUint8(offset + i, text.charCodeAt(i))
  }
  writeString(0, 'RIFF')
  view.setUint32(4, 36 + frames * blockAlign, true)
  writeString(8, 'WAVE')
  writeString(12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, channels, true)
  view.setUint32(24, buffer.sampleRate, true)
  view.setUint32(28, buffer.sampleRate * blockAlign, true)
  view.setUint16(32, blockAlign, true)
  view.setUint16(34, 16, true)
  writeString(36, 'data')
  view.setUint32(40, frames * blockAlign, true)
  const channelData = Array.from({ length: channels }, (_, c) => buffer.getChannelData(c))
  let offset = 44
  for (let i = 0; i < frames; i++) {
    for (let c = 0; c < channels; c++) {
      const sample = Math.max(-1, Math.min(1, channelData[c][i]))
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true)
      offset += 2
    }
  }
  const url = URL.createObjectURL(new Blob([data], { type: 'audio/wav' }))
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function stop() {
  replInstance?.stop()
  emit({ started: false, paused: false })
}

/** 暂停：时钟停在当前位置，编辑器高亮和可视化清空 */
export function pause() {
  if (!replInstance?.scheduler.started) return
  replInstance.scheduler.pause()
  emit({ started: false, paused: true })
}

/** 从暂停处继续（代码没改的情况下；改了应该走 play 重新求值） */
export async function resume() {
  if (!replInstance || !state.paused) return
  await audioReady
  emit({ paused: false })
  replInstance.start()
}

export function isStarted() {
  return replInstance?.scheduler.started ?? false
}
