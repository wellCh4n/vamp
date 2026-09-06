'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Agent, AgentMessage } from '@earendil-works/pi-agent-core'
import type { AssistantMessage, ToolResultMessage } from '@earendil-works/pi-ai'
import { ArrowUpIcon, BookOpenIcon, BotIcon, BrainIcon, CheckIcon, Loader2Icon, SquareIcon, TriangleAlertIcon } from 'lucide-react'

import { Markdown } from '@/components/markdown'
import { Bubble, BubbleContent } from '@/components/ui/bubble'
import { Button } from '@/components/ui/button'
import { Message, MessageContent } from '@/components/ui/message'
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
  useMessageScroller,
} from '@/components/ui/message-scroller'
import { Textarea } from '@/components/ui/textarea'
import { type ApplyResult, createVibeAgent, stripCurrentCode, withCurrentCode } from '@/lib/agent'
import { DOC_TOOLS, READ_DOC_TOOL, SEARCH_DOCS_TOOL, SET_CODE_TOOL } from '@/lib/agent-model'
import { cn } from '@/lib/utils'

export type { ApplyResult }

interface AgentChatProps {
  /** 取当前编辑器代码 */
  getCode: () => string
  /** 把代码写入编辑器并播放，返回是否成功 */
  applyCode: (code: string, summary: string) => Promise<ApplyResult>
  /** 会话已有的历史消息（切换会话时父组件用 key 重新挂载本组件） */
  initialMessages: AgentMessage[]
  /** 第一次发消息前确保会话存在，返回会话 id */
  ensureSession: (firstText: string) => Promise<string>
  /** 把一轮新产生的消息写入数据库 */
  persist: (sessionId: string, messages: AgentMessage[]) => Promise<void>
}

const SUGGESTIONS = ['来一段 120 BPM 的 house', '加一条贝斯线', '鼓更有 swing 感一点', '整体更空灵、加点混响']

/** 发送消息后无条件滚到底部（autoScroll 只在本来就贴底时跟随，用户往上翻过或输入框变高后就不跟了） */
function ScrollToEndOnSend({ signal }: { signal: number }) {
  const { scrollToEnd } = useMessageScroller()
  useEffect(() => {
    if (!signal) return
    // 等新消息渲染进 DOM 再滚
    const id = requestAnimationFrame(() => scrollToEnd({ behavior: 'smooth' }))
    return () => cancelAnimationFrame(id)
  }, [signal, scrollToEnd])
  return null
}

/** 订阅 pi Agent 的事件，让 React 跟着重渲染 */
function useAgentState(agent: Agent) {
  const [, setTick] = useState(0)
  useEffect(() => agent.subscribe(() => setTick((t) => t + 1)), [agent])
  return agent.state
}

/** 运行中的阶段，用来显示状态条 */
type Phase =
  | { kind: 'connecting' }
  | { kind: 'thinking' }
  | { kind: 'writing' }
  | { kind: 'coding'; tracks: number }
  | { kind: 'reading'; what: string }
  | { kind: 'executing' }
  | { kind: 'waiting' }
  | { kind: 'retrying'; attempt: number; until: number }

function phaseLabel(phase: Phase, now: number) {
  switch (phase.kind) {
    case 'connecting':
    case 'thinking':
    case 'waiting':
      return '正在思考'
    case 'writing':
      return '正在回复'
    case 'coding':
      return phase.tracks > 0 ? `正在编曲（第 ${phase.tracks} 轨）` : '正在编曲'
    case 'reading':
      return phase.what ? `正在查资料（${phase.what}）` : '正在查资料'
    case 'executing':
      return '正在试听'
    case 'retrying':
      return `上游繁忙，${Math.max(0, Math.ceil((phase.until - now) / 1000))} 秒后重试`
  }
}

/** 从 pi 事件推导当前阶段 */
function usePhase(agent: Agent, onRetry: (listener: (info: { attempt: number; delayMs: number }) => void) => () => void) {
  const [phase, setPhase] = useState<Phase | null>(null)
  const [startedAt, setStartedAt] = useState<number | null>(null)

  useEffect(() => {
    const unsubscribe = agent.subscribe((event) => {
      switch (event.type) {
        case 'agent_start':
          setStartedAt((prev) => prev ?? Date.now())
          setPhase({ kind: 'connecting' })
          break
        case 'turn_start':
          setPhase((prev) => (prev?.kind === 'executing' ? { kind: 'waiting' } : prev ?? { kind: 'connecting' }))
          break
        case 'message_update': {
          const e = event.assistantMessageEvent
          if (e.type === 'start') setPhase({ kind: 'thinking' })
          else if (e.type === 'thinking_start' || e.type === 'thinking_delta') setPhase({ kind: 'thinking' })
          else if (e.type === 'text_start' || e.type === 'text_delta') setPhase({ kind: 'writing' })
          else if (e.type === 'toolcall_start' || e.type === 'toolcall_delta') {
            const block = e.partial.content[e.contentIndex]
            if (block?.type === 'toolCall' && DOC_TOOLS.includes(block.name)) {
              setPhase({ kind: 'reading', what: docCallLabel(block.name, block.arguments) })
            } else {
              const code = block?.type === 'toolCall' ? (block.arguments as { code?: string })?.code : undefined
              // 用已经写出的轨数（$: 开头的行）表示进度，比代码行数更贴近"在编曲"
              setPhase({ kind: 'coding', tracks: code ? (code.match(/^\s*_?\$:/gm)?.length ?? 0) : 0 })
            }
          }
          break
        }
        case 'tool_execution_start':
          setPhase(DOC_TOOLS.includes(event.toolName) ? { kind: 'reading', what: docCallLabel(event.toolName, event.args) } : { kind: 'executing' })
          break
        case 'tool_execution_end':
          setPhase({ kind: 'waiting' })
          break
        case 'agent_end':
          setPhase(null)
          setStartedAt(null)
          break
      }
    })
    const unsubscribeRetry = onRetry(({ attempt, delayMs }) => {
      setPhase({ kind: 'retrying', attempt, until: Date.now() + delayMs })
      setStartedAt((prev) => prev ?? Date.now())
    })
    return () => {
      unsubscribe()
      unsubscribeRetry()
    }
  }, [agent, onRetry])

  // 计时器：运行中每秒刷新一次（只依赖"是否在运行"，否则每个流式事件都会重建定时器）
  const running = phase !== null
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (!running) return
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [running])

  // 第一次 tick 之前 now 可能比 startedAt 旧，钳到 0
  return { phase, elapsed: startedAt ? Math.max(0, Math.floor((now - startedAt) / 1000)) : 0, now }
}

interface ToolCallView {
  id: string
  kind: 'code' | 'doc'
  summary: string
  status: 'pending' | 'ok' | 'error' | 'blocked'
  error?: string
}

/** read_doc / search_docs 调用的一句话描述（状态行和历史里都用） */
function docCallLabel(name: string, args: unknown): string {
  const a = (args ?? {}) as { path?: string; heading?: string; query?: string }
  if (name === SEARCH_DOCS_TOOL) return a.query ? `搜索「${a.query}」` : '搜索资料'
  if (name === READ_DOC_TOOL) return a.path ? `查阅 ${a.path.replace(/\.md$/, '')}${a.heading ? ` › ${a.heading}` : ''}` : '查阅资料'
  return name
}

/** 一条用户消息，或一轮 Agent 的合并回答（同一轮里的多段文字合成一条，工具调用列在底部） */
type ChatItem =
  | { key: number; kind: 'user'; text: string }
  | { key: number; kind: 'assistant'; text: string; thinking: string; toolCalls: ToolCallView[]; error?: string }

function isAssistant(m: AgentMessage): m is AssistantMessage {
  return m.role === 'assistant'
}

function isToolResult(m: AgentMessage): m is ToolResultMessage {
  return m.role === 'toolResult'
}

function textOf(content: ToolResultMessage['content']) {
  return content
    .filter((c): c is Extract<(typeof content)[number], { type: 'text' }> => c.type === 'text')
    .map((c) => c.text)
    .join('\n')
}

export function AgentChat({ getCode, applyCode, initialMessages, ensureSession, persist }: AgentChatProps) {
  // agent 只创建一次；回调身份会随父组件变化，通过 setHost 同步进去
  const [{ agent, setHost, onRetry }] = useState(() => createVibeAgent({ applyCode }, initialMessages))
  useEffect(() => {
    setHost({ applyCode })
  }, [setHost, applyCode])
  const state = useAgentState(agent)
  const { phase, elapsed, now } = usePhase(agent, onRetry)

  const [input, setInput] = useState('')
  const [sendError, setSendError] = useState<string | null>(null)
  const sessionIdRef = useRef<string | null>(null)
  const persistRef = useRef(persist)
  useEffect(() => {
    persistRef.current = persist
  }, [persist])
  const busy = state.isStreaming || phase !== null

  // 每轮结束后把新消息落库（被自动重试移除的报错消息不存）
  useEffect(
    () =>
      agent.subscribe((event) => {
        if (event.type !== 'agent_end') return
        const sessionId = sessionIdRef.current
        if (!sessionId) return
        const current = agent.state.messages
        const kept = event.messages.filter((m) => current.includes(m))
        if (kept.length) void persistRef.current(sessionId, kept).catch((err) => setSendError(err instanceof Error ? err.message : String(err)))
      }),
    [agent],
  )

  // 把 pi 的消息列表按"用户消息 → 一轮回答"分组：一轮里的多段 assistant 文字合并成一条，
  // toolResult 合并到对应的 toolCall 上。运行中的那一轮不渲染内容，只显示状态行。
  const items = useMemo(() => {
    const messages: AgentMessage[] = [...state.messages]
    if (state.streamingMessage) messages.push(state.streamingMessage)
    const results = new Map<string, ToolResultMessage>()
    for (const m of messages) if (isToolResult(m)) results.set(m.toolCallId, m)

    const out: ChatItem[] = []
    let current: Extract<ChatItem, { kind: 'assistant' }> | null = null
    messages.forEach((m, index) => {
      if (m.role === 'user') {
        const text = typeof m.content === 'string' ? m.content : textOf(m.content as ToolResultMessage['content'])
        out.push({ key: index, kind: 'user', text: stripCurrentCode(text) })
        current = null
        return
      }
      if (!isAssistant(m)) return
      if (!current) {
        current = { key: index, kind: 'assistant', text: '', thinking: '', toolCalls: [] }
        out.push(current)
      }
      const segments: string[] = []
      for (const block of m.content) {
        if (block.type === 'text') segments.push(block.text)
        else if (block.type === 'thinking') current.thinking += block.thinking
        else if (block.type === 'toolCall' && (block.name === SET_CODE_TOOL || DOC_TOOLS.includes(block.name))) {
          const isDoc = block.name !== SET_CODE_TOOL
          const args = block.arguments as { summary?: string } | undefined
          const result = results.get(block.id)
          let status: ToolCallView['status'] = 'pending'
          if (result) status = result.isError ? (textOf(result.content).includes('上限') ? 'blocked' : 'error') : 'ok'
          current.toolCalls.push({
            id: block.id,
            kind: isDoc ? 'doc' : 'code',
            summary: isDoc ? docCallLabel(block.name, block.arguments) : (args?.summary ?? '更新代码'),
            status,
            error: result?.isError ? textOf(result.content) : undefined,
          })
        }
      }
      const text = segments.join('').trim()
      if (text) current.text = current.text ? `${current.text}\n\n${text}` : text
      if (m.stopReason === 'error' || m.stopReason === 'aborted') {
        current.error = m.errorMessage || (m.stopReason === 'aborted' ? '已停止' : '出错了')
      }
    })
    return out
  }, [state.messages, state.streamingMessage])

  // 运行中：最后一轮回答还没完成，用一行状态代替它
  const inProgress = phase !== null
  const visibleItems = inProgress && items.length > 0 && items[items.length - 1].kind === 'assistant' ? items.slice(0, -1) : items

  const [sentCount, setSentCount] = useState(0)
  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim()
      if (!trimmed) return
      setInput('')
      setSendError(null)
      setSentCount((n) => n + 1)
      const message: AgentMessage = { role: 'user', content: withCurrentCode(trimmed, getCode()), timestamp: Date.now() }
      if (agent.state.isStreaming) {
        // 运行中：作为 steering 消息，在当前工具执行完后插入
        agent.steer(message)
        return
      }
      try {
        sessionIdRef.current ??= await ensureSession(trimmed)
      } catch (err) {
        setSendError(err instanceof Error ? err.message : String(err))
        setInput(text)
        return
      }
      void agent.prompt(message)
    },
    [agent, ensureSession, getCode],
  )

  const stop = useCallback(() => agent.abort(), [agent])

  return (
    <div className="flex h-full min-h-0 flex-col">
      <MessageScrollerProvider autoScroll>
        <ScrollToEndOnSend signal={sentCount} />
        <MessageScroller className="min-h-0 flex-1">
          {/* 内边距放在滚动内容里而不是外层：滚动时文字要能贴到面板边缘，只有滚到头才有留白 */}
          <MessageScrollerViewport className="pr-3 pl-4">
            <MessageScrollerContent className="gap-3 pt-4 pb-7">
              {items.length === 0 && (
                <MessageScrollerItem>
                  <div className="flex flex-col gap-3 text-sm text-muted-foreground">
                    <p className="flex items-center gap-2">
                      <BotIcon className="size-4" />
                      告诉我你想要什么样的音乐，我会直接写进编辑器并播放。
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {SUGGESTIONS.map((s) => (
                        <Button key={s} variant="outline" size="xs" onClick={() => void send(s)}>
                          {s}
                        </Button>
                      ))}
                    </div>
                  </div>
                </MessageScrollerItem>
              )}
              {visibleItems.map((item) => (
                <MessageScrollerItem key={item.key} messageId={String(item.key)}>
                  {item.kind === 'user' ? (
                    <Message align="end">
                      <MessageContent>
                        <Bubble align="end">
                          <BubbleContent className="whitespace-pre-wrap">{item.text}</BubbleContent>
                        </Bubble>
                      </MessageContent>
                    </Message>
                  ) : (
                    <Message>
                      <MessageContent className="gap-1.5">
                        {item.thinking && (
                          <details className="text-xs text-muted-foreground">
                            <summary className="flex cursor-pointer items-center gap-1.5 select-none">
                              <BrainIcon className="size-3.5" />
                              思考过程
                            </summary>
                            <p className="mt-1 max-h-48 overflow-y-auto whitespace-pre-wrap border-l-2 pl-2">{item.thinking}</p>
                          </details>
                        )}
                        {item.text && (
                          <Bubble variant="ghost">
                            <BubbleContent>
                              <Markdown>{item.text}</Markdown>
                            </BubbleContent>
                          </Bubble>
                        )}
                        {item.toolCalls.length > 0 && (
                          <ul className="flex flex-col gap-0.5 text-xs text-muted-foreground">
                            {item.toolCalls.map((call) => (
                              <li key={call.id} className={cn('flex items-start gap-1.5', call.status === 'error' && 'text-destructive')}>
                                {call.kind === 'doc' && call.status === 'ok' ? (
                                  <BookOpenIcon className="mt-0.5 size-3.5 shrink-0" />
                                ) : call.status === 'ok' ? (
                                  <CheckIcon className="mt-0.5 size-3.5 shrink-0" />
                                ) : call.status === 'pending' ? (
                                  <Loader2Icon className="mt-0.5 size-3.5 shrink-0 animate-spin" />
                                ) : (
                                  <TriangleAlertIcon className="mt-0.5 size-3.5 shrink-0" />
                                )}
                                <span className="min-w-0">
                                  {call.kind === 'code' && call.status === 'ok' ? '已更新：' : ''}
                                  {call.summary}
                                  {call.error && <span className="opacity-80"> — {call.error}</span>}
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                        {item.error && (
                          <Bubble variant="destructive">
                            <BubbleContent className="text-xs">{item.error}</BubbleContent>
                          </Bubble>
                        )}
                      </MessageContent>
                    </Message>
                  )}
                </MessageScrollerItem>
              ))}
              {phase && (
                <MessageScrollerItem>
                  <p className="typing flex items-center gap-1 px-1 text-sm text-muted-foreground" role="status" aria-live="polite">
                    {/* shimmer 是 shadcn/tailwind.css 自带的流光文字效果（background-clip: text），只加在文字上，省略号单独画 */}
                    <span className="shimmer">{phaseLabel(phase, now)}</span>
                    <span className="typing-dots" aria-hidden="true" />
                    {elapsed >= 5 && <span className="ml-1 text-xs tabular-nums opacity-70">{elapsed}s</span>}
                  </p>
                </MessageScrollerItem>
              )}
              {busy && agent.hasQueuedMessages() && (
                <MessageScrollerItem>
                  <p className="text-xs text-muted-foreground">消息已排队，等当前步骤完成后插入。</p>
                </MessageScrollerItem>
              )}
              {sendError && (
                <MessageScrollerItem>
                  <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">{sendError}</div>
                </MessageScrollerItem>
              )}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton />
        </MessageScroller>
      </MessageScrollerProvider>

      <form
        className="mx-4 mb-4"
        onSubmit={(e) => {
          e.preventDefault()
          void send(input)
        }}
      >
        {/* ChatGPT 式输入框：按钮放在框内右下角，聚焦环打在整个容器上 */}
        <div className="flex flex-col rounded-2xl border border-input bg-background transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 dark:bg-input/30">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault()
                void send(input)
              }
            }}
            placeholder={busy ? '运行中也可以继续说，会在当前步骤后插入…' : '描述你想要的音乐…'}
            aria-label="消息"
            className="max-h-40 min-h-12 resize-none rounded-none border-0 bg-transparent px-3.5 pt-3 pb-1 text-sm shadow-none focus-visible:border-0 focus-visible:ring-0 dark:bg-transparent"
          />
          <div className="flex items-center justify-end gap-1.5 px-2 pb-2">
            {busy && (
              <Button type="button" size="icon-sm" variant="outline" className="rounded-full" aria-label="停止" title="停止" onClick={stop}>
                <SquareIcon />
              </Button>
            )}
            <Button type="submit" size="icon-sm" className="rounded-full" aria-label={busy ? '插话' : '发送'} title={busy ? '插话（Enter）' : '发送（Enter，Shift+Enter 换行）'} disabled={!input.trim()}>
              <ArrowUpIcon />
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
