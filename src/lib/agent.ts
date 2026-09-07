import { Agent, streamProxy, type AgentMessage, type AgentTool } from '@earendil-works/pi-agent-core'
import { Type } from '@earendil-works/pi-ai'

import {
  type AgentModel,
  createAgentModel,
  DOC_TOOLS,
  MAX_DOC_CALLS_PER_PROMPT,
  MAX_TOOL_CALLS_PER_PROMPT,
  READ_DOC_TOOL,
  SEARCH_DOCS_TOOL,
  SET_CODE_TOOL,
} from '@/lib/agent-model'

/**
 * The browser-side pi agent.
 *
 * - LLM calls go through streamProxy to /api/stream (the server holds the key and assembles the
 *   system prompt).
 * - The set_code tool runs in the browser: it writes to the editor and plays. On failure it throws,
 *   and pi hands the error back to the model as a tool result so the model can fix itself.
 * - The read_doc / search_docs tools read the docs of each skill under skills/ (via the server's
 *   /api/skill/*), letting the model look up syntax, the function reference, example tunes and drum
 *   patterns on demand instead of stuffing the whole library into the system prompt.
 * - beforeToolCall caps how many set_code calls and doc lookups a single user message may trigger,
 *   so it cannot loop forever.
 */

export interface ApplyResult {
  ok: boolean
  error?: string
}

export interface AgentHost {
  applyCode: (code: string, summary: string) => Promise<ApplyResult>
}

const MAX_TRANSIENT_RETRIES = 2
const RETRY_DELAYS_MS = [2000, 5000]

/** Upstream overload, rate limiting and gateway timeouts are worth retrying automatically */
export function isTransientError(message?: string) {
  if (!message) return false
  return /overloaded|rate.?limit|too many requests|\b(429|500|502|503|504)\b|timeout|ECONNRESET|socket hang up/i.test(message)
}

const SetCodeParams = Type.Object({
  code: Type.String({ description: '完整的 Strudel 代码（不是 diff）' }),
  summary: Type.String({ description: '一句话说明这次改了什么' }),
})

export function createSetCodeTool(host: AgentHost): AgentTool<typeof SetCodeParams, { summary: string }> {
  return {
    name: SET_CODE_TOOL,
    label: '写入并试听',
    description: '用完整的 Strudel 代码替换编辑器内容并立即播放。播放失败时会返回错误信息，请修正后重试。',
    parameters: SetCodeParams,
    executionMode: 'sequential',
    execute: async (_toolCallId, params) => {
      const result = await host.applyCode(params.code, params.summary)
      if (!result.ok) throw new Error(`播放失败：${result.error ?? '未知错误'}`)
      return {
        content: [{ type: 'text', text: 'OK：代码已写入编辑器并开始播放。' }],
        details: { summary: params.summary },
      }
    },
  }
}

const ReadDocParams = Type.Object({
  path: Type.String({ description: '文件路径。Strudel 资料相对 skills/strudel/，例如 learn/effects.md、reference/controls.md、examples/drums/funk.md；其他 skill 带目录前缀，例如 music-theory/melody.md' }),
  heading: Type.Optional(Type.String({ description: '只读这个标题下的段落（例如函数名 lpf 或曲名 swimming），省略则读整个文件' })),
})

const SearchDocsParams = Type.Object({
  query: Type.String({ description: '搜索词，空格分隔多个词时要求同一行全部出现；不区分大小写。适合搜函数名、曲风、采样名' }),
})

interface SkillReadResponse {
  path: string
  heading?: string
  content: string
  truncated?: boolean
}

interface SkillSearchResponse {
  hits: { path: string; heading: string; line: number; text: string }[]
}

async function fetchSkill<T>(url: string): Promise<T> {
  const res = await fetch(url)
  const data = (await res.json().catch(() => ({}))) as T & { error?: string }
  if (!res.ok) throw new Error(data.error ?? `请求失败（${res.status}）`)
  return data
}

/** Read Strudel docs (a whole file, or one heading section of it) */
export function createReadDocTool(): AgentTool<typeof ReadDocParams, { path: string; heading?: string }> {
  return {
    name: READ_DOC_TOOL,
    label: '查阅资料',
    description:
      '读取资料库（Strudel 文档、乐理）里的一个 markdown 文件，或只读其中一个标题下的段落。文件列表见系统提示里各 skill 的索引。长文件不带 heading 时只返回大纲。',
    parameters: ReadDocParams,
    executionMode: 'parallel',
    execute: async (_toolCallId, params) => {
      const search = new URLSearchParams({ path: params.path })
      if (params.heading) search.set('heading', params.heading)
      const data = await fetchSkill<SkillReadResponse>(`/api/skill/read?${search}`)
      const title = data.heading ? `${data.path} › ${data.heading}` : data.path
      return {
        content: [{ type: 'text', text: `# ${title}\n\n${data.content}` }],
        details: { path: data.path, heading: data.heading },
      }
    },
  }
}

/** Full-text search over the Strudel docs */
export function createSearchDocsTool(): AgentTool<typeof SearchDocsParams, { query: string; count: number }> {
  return {
    name: SEARCH_DOCS_TOOL,
    label: '搜索资料',
    description: '在资料库（Strudel 文档、乐理）里全文搜索（函数名、曲风、采样名、乐理关键词），返回命中的文件、标题和行，然后用 read_doc 读对应段落。',
    parameters: SearchDocsParams,
    executionMode: 'parallel',
    execute: async (_toolCallId, params) => {
      const data = await fetchSkill<SkillSearchResponse>(`/api/skill/search?q=${encodeURIComponent(params.query)}`)
      const text = data.hits.length
        ? data.hits.map((h) => `${h.path}${h.heading ? ` › ${h.heading}` : ''} (L${h.line}): ${h.text}`).join('\n')
        : '没有命中。试试更短的关键词、英文函数名，或读 reference/index.md。'
      return {
        content: [{ type: 'text', text }],
        details: { query: params.query, count: data.hits.length },
      }
    },
  }
}

export interface VibeAgent {
  agent: Agent
  /** Update the host callbacks used by tool execution (callback identities change in React, but the agent is created once) */
  setHost: (host: AgentHost) => void
  /** Subscribe to automatic retry events (upstream overload / rate limiting); returns an unsubscribe function */
  onRetry: (listener: (info: { attempt: number; delayMs: number; reason: string }) => void) => () => void
}

export function createVibeAgent(initialHost?: AgentHost, initialMessages: AgentMessage[] = []): VibeAgent {
  let codeCallsThisPrompt = 0
  let docCallsThisPrompt = 0
  const retryListeners = new Set<(info: { attempt: number; delayMs: number; reason: string }) => void>()
  let host: AgentHost = initialHost ?? {
    applyCode: async () => ({ ok: false, error: '编辑器尚未就绪' }),
  }

  const agent = new Agent({
    initialState: {
      // The real system prompt is assembled on the server; this is only a placeholder
      systemPrompt: 'Vamp agent',
      model: createAgentModel(),
      thinkingLevel: 'high',
      tools: [
        createSetCodeTool({ applyCode: (code, summary) => host.applyCode(code, summary) }),
        createReadDocTool(),
        createSearchDocsTool(),
      ],
      messages: initialMessages,
    },
    streamFn: (model, context, options) =>
      streamProxy(model, context, {
        ...options,
        authToken: 'same-origin',
        proxyUrl: '',
      }),
    beforeToolCall: async ({ toolCall }) => {
      if (DOC_TOOLS.includes(toolCall.name)) {
        docCallsThisPrompt += 1
        if (docCallsThisPrompt > MAX_DOC_CALLS_PER_PROMPT) {
          return { block: true, reason: '本轮查资料次数已达上限，请根据已有信息直接写代码或回答。' }
        }
        return undefined
      }
      codeCallsThisPrompt += 1
      if (codeCallsThisPrompt > MAX_TOOL_CALLS_PER_PROMPT) {
        return { block: true, reason: '已达到本轮自动修复次数上限，请直接告诉用户当前状况，不要再调用工具。' }
      }
      return undefined
    },
  })

  // Occasional upstream overload / rate limiting: drop the failed assistant message from history, back off, and resume
  let retries = 0
  agent.subscribe((event) => {
    if (event.type === 'agent_start') {
      codeCallsThisPrompt = 0
      docCallsThisPrompt = 0
    }
    if (event.type !== 'agent_end') return
    const messages = agent.state.messages
    const last = messages[messages.length - 1]
    if (!last || last.role !== 'assistant' || last.stopReason !== 'error') return
    if (retries >= MAX_TRANSIENT_RETRIES || !isTransientError(last.errorMessage)) {
      retries = 0
      return
    }
    retries += 1
    const delay = RETRY_DELAYS_MS[retries - 1] ?? 5000
    agent.state.messages = messages.slice(0, -1)
    retryListeners.forEach((l) => l({ attempt: retries, delayMs: delay, reason: last.errorMessage ?? '' }))
    setTimeout(() => {
      void agent.continue().catch(() => undefined)
    }, delay)
  })

  // The server picks the actual model from the environment (Anthropic / OpenAI protocol); mirror it
  // into the agent state so the api / provider / model fields recorded on messages match the real call
  void fetchServerModel().then((model) => {
    if (model && !agent.state.isStreaming) agent.state.model = model
  })

  return {
    agent,
    setHost: (next) => {
      host = next
    },
    onRetry: (listener) => {
      retryListeners.add(listener)
      return () => {
        retryListeners.delete(listener)
      }
    },
  }
}

async function fetchServerModel(): Promise<AgentModel | undefined> {
  try {
    const res = await fetch('/api/stream', { method: 'GET' })
    if (!res.ok) return undefined
    const data = (await res.json()) as { model?: AgentModel }
    return data.model
  } catch {
    return undefined
  }
}

/** The editor code appended to a user message is wrapped in these markers and stripped before display */
export const CODE_OPEN = '\n\n<current_code>\n'
export const CODE_CLOSE = '\n</current_code>'

export function withCurrentCode(text: string, code: string) {
  return `${text}${CODE_OPEN}${code}${CODE_CLOSE}`
}

export function stripCurrentCode(text: string) {
  const i = text.indexOf(CODE_OPEN)
  return i >= 0 ? text.slice(0, i) : text
}
