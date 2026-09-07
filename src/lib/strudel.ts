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
 * Wrapper around the Strudel engine (the counterpart of the official REPL's StrudelMirror, but it
 * does not take over the theme or the DOM).
 *
 * - Initializes exactly once (effects run twice under React StrictMode).
 * - Loads the same default sounds as the official REPL: drum machines, piano, VCSL instruments,
 *   Dirt-Samples miscellany and GM soundfonts, plus this project's own Beijing opera percussion
 *   samples (public/samples/chinese-traditional).
 * - Once a CodeMirror view is attached with attachEditor(), mini-notation positions and the events
 *   currently playing are highlighted in the editor.
 * - Listens to Strudel's log events so trigger-time errors (a missing sound, say) surface too.
 */

const CDN = 'https://strudel.b-cdn.net'
/** Strudel core's logger dispatches this event on document */
const STRUDEL_LOG_EVENT = 'strudel.log'

export type EngineStatus = 'idle' | 'loading' | 'ready' | 'error'

export interface EngineState {
  status: EngineStatus
  started: boolean
  /** Paused: the position is kept and playing again resumes in place; only stop rewinds to the start */
  paused: boolean
  error?: string
}

type Listener = (state: EngineState) => void

/** Playback progress: the current cycle position (the fraction is the progress within the cycle), the tempo, and the timestamp this playback started */
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
/** Which project the current playback belongs to (playback is per project and stops when switching) */
let playingOwner: string | null = null

/** Visualization window: the playhead sits at the far left, looking 4 cycles ahead (matching the punchcard in the official docs) */
const DRAW_TIME: [number, number] = [0, 4]
/** Fill color for inactive notes (light gray with black text, readable in both themes) */
const ROLL_INACTIVE = '#cbd5e1'
/** Every pattern's output feeds this analyser, which drives the scope and spectrum views */
const ANALYSER_ID = 1

export type Visualization = 'roll' | 'scope' | 'spectrum'
let visualization: Visualization = 'roll'
let state: EngineState = { status: 'idle', started: false, paused: false }
const listeners = new Set<Listener>()

/** Trigger-time errors (raised by the scheduler during playback), recorded with timestamps */
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

/** Subscribe to playback progress (once per frame, only while playing). Returns an unsubscribe function. */
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
    // Evaluation errors are handled by onEvalError; this only cares about errors during playback, e.g. "[getTrigger] error: sound xxx not found!"
    if (!message.includes('] error:') || message.startsWith('[eval]')) return
    const clean = message.replace(/^\[[^\]]*\]\s*error:\s*/, '')
    runtimeErrors.push({ message: clean, at: performance.now() })
    if (runtimeErrors.length > 50) runtimeErrors = runtimeErrors.slice(-50)
    emit({ error: clean })
  })
}

/** Trigger-time errors raised after `since`, deduplicated */
export function getRuntimeErrors(since: number): string[] {
  return [...new Set(runtimeErrors.filter((e) => e.at >= since).map((e) => e.message))]
}

/** Wait briefly to see whether playback raises an error (a missing sound and the like only report at trigger time) */
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
    // casio / jazz / metal / insect / wind / east / space / numbers and friends, used in the workshop
    samples('github:tidalcycles/dirt-samples'),
    // Traditional Chinese instruments: Beijing opera percussion, shipped as mp3 with the project
    samples('/samples/chinese-traditional/strudel.json', undefined, { prebake: true }),
    // AKWF single-cycle wavetables (wt_*). Only the manifest is fetched here; a waveform file is
    // downloaded on first trigger. Unlike a soundfont these drive the synth engine, so a filter
    // envelope shapes them as strongly as an oscillator (measured 7.1x attack/sustain centroid on
    // wt_flute, against 1.3x on gm_flute).
    samples('github:Bubobubobubobubo/Dough-Waveforms'),
  ])
  // Make shorthands like bank("tr909") work too
  await aliasBank(`${CDN}/tidal-drum-machines-alias.json`)
}

/** GM sounds (gm_piano, gm_synth_bass_1, …) come from soundfonts, loaded from the CDN on demand */
async function loadSoundfonts() {
  const { registerSoundfonts } = await import('@strudel/soundfonts')
  registerSoundfonts()
}

/** Register Strudel's functions in the global scope and load synths and sounds. Runs once. */
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

  // Each frame the drawer queries the scheduler for visible events: it highlights the matching mini-notation in the editor and draws the pianoroll
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
    // Attach the default analyser to events that do not name one, so the scope and spectrum have data
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

/** Switch the visualization below the editor: notes (pianoroll), waveform (scope) or spectrum */
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
  // The canvas inherits the page's foreground color
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

/** Attach the canvas used by the pianoroll (pass null to detach). The caller sizes it by devicePixelRatio. */
export function attachCanvas(el: HTMLCanvasElement | null) {
  canvas = el
  if (!el) return
  if (!state.started) clearRoll()
}

/** Attach a CodeMirror view to the engine (pass null to detach). */
export function attachEditor(view: EditorView | null) {
  editorView = view
  if (view && miniLocations.length && state.started) {
    updateMiniLocations(view, miniLocations)
  }
}

/** Warm up: load modules and samples ahead of time so the first play does not stall. */
export function warmup() {
  return prebake().catch(() => undefined)
}

/** Id of the project currently playing (null when nothing is playing) */
export function getPlayingOwner() {
  return state.started ? playingOwner : null
}

/**
 * Evaluate a piece of Strudel code and play it. Returns true when evaluation raised no error. Must
 * be called from a user gesture.
 * @param owner id of the project that started playback, used to stop automatically when switching projects
 */
export async function play(code: string, owner: string | null = null): Promise<boolean> {
  playingOwner = owner
  emit({ paused: false })
  // An AudioContext can only be resumed from a user gesture, and this sits in the click / shortcut call chain
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
  /** First cycle to render */
  begin: number
  /** How many cycles to export */
  cycles: number
  sampleRate: number
  /** File name (without the extension) */
  name: string
}

export interface ExportResult {
  /** Trigger-time errors during rendering (a missing sound, say); they do not prevent the file from being written */
  warnings: string[]
  seconds: number
}

/**
 * Render offline and download a WAV. The approach matches the official REPL's renderPatternAudio:
 * swap the global AudioContext for an OfflineAudioContext, hand the events in the range to
 * superdough in time order, then encode the result as WAV.
 * @strudel/webaudio 1.3.0's renderPatternAudio is not used directly: the audio controller it news up
 * carries its own private AudioContext, so reverb / delay sends fail with "different audio context"
 * and the exported file has no reverb.
 * This uses only superdough's own setAudioContext and lazy controller creation, staying in one
 * context throughout.
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

  // Let events already scheduled on the live context finish before closing it, or a stream of "context is closed" warnings follows
  await new Promise((resolve) => setTimeout(resolve, 200))
  const live = getAudioContext()
  await live.close()
  const offline = new OfflineAudioContext(2, Math.ceil(seconds * sampleRate), sampleRate)
  setAudioContext(offline)
  setSuperdoughAudioController(null)
  resetGlobalEffects()
  try {
    await initAudio({ multiChannelOrbits: false })
    // Triggering in onset order matters: controls like cut depend on the current state of the audio graph
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
    // Restore the live context: superdough's next getAudioContext() creates a new one, so the controller and global effects start over
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

/** AudioBuffer -> 16-bit PCM WAV, then trigger a browser download */
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

/** Pause: the clock stops in place, and editor highlights and visualizations are cleared */
export function pause() {
  if (!replInstance?.scheduler.started) return
  replInstance.scheduler.pause()
  emit({ started: false, paused: true })
}

/** Resume from a pause (only when the code is unchanged; otherwise go through play to re-evaluate) */
export async function resume() {
  if (!replInstance || !state.paused) return
  await audioReady
  emit({ paused: false })
  replInstance.start()
}

export function isStarted() {
  return replInstance?.scheduler.started ?? false
}
