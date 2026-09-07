// The @strudel/* packages ship no types; only the parts we use are declared here.

declare module '@strudel/core' {
  export interface Hap {
    value?: Record<string, unknown>
    whole?: { begin: { valueOf(): number }; end: { valueOf(): number } }
    context?: { locations?: { start: number; end: number }[] }
    duration: number
    isActive(time: number): boolean
    hasOnset(): boolean
    /** Wrap a non-object value into an object such as { note } or { s } */
    ensureObjectValue(): void
  }

  export interface Pattern {
    queryArc(begin: number, end: number, options?: unknown): Hap[]
    fmap(fn: (value: unknown) => unknown): Pattern
    [key: string]: unknown
  }

  export interface Scheduler {
    cps: number
    started: boolean
    pattern: Pattern
    now(): number
    start(): void
    stop(): void
    pause(): void
    toggle(): void
    setCps(cps: number): void
  }

  export interface ReplState {
    started: boolean
    pending: boolean
    code: string
    activeCode: string
    isDirty?: boolean
    error?: Error
    evalError?: Error
    schedulerError?: Error
    pattern?: Pattern
    miniLocations: [number, number][]
  }

  export interface EvalMeta {
    miniLocations?: [number, number][]
    widgets?: unknown[]
  }

  export interface ReplOptions {
    defaultOutput: (...args: unknown[]) => unknown
    getTime: () => number
    transpiler?: unknown
    onEvalError?: (err: Error) => void
    beforeEval?: (info: { code: string; blockBased?: boolean }) => void | Promise<void>
    beforeStart?: () => void | Promise<void>
    afterEval?: (info: { code: string; pattern: Pattern; meta?: EvalMeta }) => void
    onToggle?: (started: boolean) => void
    editPattern?: (pattern: Pattern) => Pattern
    onUpdateState?: (state: ReplState) => void
    sync?: boolean
    setInterval?: typeof globalThis.setInterval
    clearInterval?: typeof globalThis.clearInterval
    id?: string
  }

  export interface Repl {
    scheduler: Scheduler
    state: ReplState
    evaluate(code: string, autostart?: boolean): Promise<Pattern | undefined>
    start(): void
    stop(): void
    pause(): void
    toggle(): void
    setCps(cps: number): void
    setPattern(pattern: Pattern, autostart?: boolean): Promise<Pattern>
    setCode?(code: string): void
  }

  export function repl(options: ReplOptions): Repl
  export function evalScope(...modules: unknown[]): Promise<unknown>
  export const silence: Pattern
}

declare module '@strudel/webaudio' {
  export function webaudioOutput(...args: unknown[]): unknown
  export function getAudioContext(): AudioContext
  export function getAudioContextCurrentTime(): number
  export function initAudio(options?: Record<string, unknown>): Promise<void>
  export function setAudioContext(ctx: BaseAudioContext | null): void
  export function setSuperdoughAudioController(controller: unknown): void
  /** Clear the per-orbit cache of global effects and analysers (required after switching AudioContext) */
  export function resetGlobalEffects(): void
  /** Trigger one event: value is the control-parameter object, t is seconds on the AudioContext clock */
  export function superdough(value: Record<string, unknown>, t: number, hapDuration: number, cps?: number, cycle?: number): Promise<void>
  export function initAudioOnFirstClick(options?: Record<string, unknown>): Promise<void>
  export function registerSynthSounds(): Promise<void>
  export function samples(
    map: string | Record<string, unknown>,
    baseUrl?: string,
    options?: { prebake?: boolean; tag?: string },
  ): Promise<void>
  export function aliasBank(...args: unknown[]): Promise<void>
  /** superdough's analyser table, indexed by id */
  export const analysers: Record<string | number, AnalyserNode | undefined>
  export interface ScopeOptions {
    ctx: CanvasRenderingContext2D
    id?: number
    color?: string
    scale?: number
    pos?: number
  }
  export function drawTimeScope(analyser: AnalyserNode | undefined, options: ScopeOptions & { align?: boolean; thickness?: number; trigger?: number }): void
  export function drawFrequencyScope(analyser: AnalyserNode | undefined, options: ScopeOptions & { lean?: number; min?: number; max?: number }): void
}

declare module '@strudel/transpiler' {
  export function transpiler(input: string, options?: Record<string, unknown>): unknown
}

declare module '@strudel/draw' {
  import type { Hap, Scheduler } from '@strudel/core'
  export class Drawer {
    constructor(onDraw: (haps: Hap[], time: number, drawer: Drawer, painters: unknown[]) => void, drawTime: [number, number])
    visibleHaps: Hap[]
    start(scheduler: Scheduler): void
    stop(): void
    invalidate(scheduler?: Scheduler, time?: number): void
    setDrawTime(drawTime: [number, number]): void
  }
  export interface PianorollOptions {
    ctx: CanvasRenderingContext2D
    time: number
    haps: Hap[]
    drawTime: [number, number]
    labels?: boolean
    fold?: 0 | 1
    fill?: 0 | 1
    fillActive?: boolean
    strokeActive?: boolean
    hideInactive?: 0 | 1
    inactive?: string
    active?: string
    background?: string
    playheadColor?: string
    fontFamily?: string
    autorange?: 0 | 1
    minMidi?: number
    maxMidi?: number
    vertical?: 0 | 1
  }
  export function drawPianoroll(options: PianorollOptions): void
}

declare module '@strudel/codemirror' {
  import type { Extension } from '@codemirror/state'
  import type { EditorView } from '@codemirror/view'
  import type { Hap } from '@strudel/core'
  export const highlightExtension: Extension
  export const flashField: Extension
  export function flash(view: EditorView, ms?: number, range?: { from: number; to: number }): void
  export function updateMiniLocations(view: EditorView, locations: [number, number][], range?: unknown): void
  export function highlightMiniLocations(view: EditorView, atTime: number, haps: Hap[]): void
  export const themes: Record<string, Extension>
}

declare module '@strudel/mini' {}
declare module '@strudel/tonal' {}

declare module '@strudel/soundfonts' {
  export function registerSoundfonts(): void
  export function setSoundfontUrl(url: string): void
}
