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
 * 浏览器端的 pi Agent。
 *
 * - LLM 调用通过 streamProxy 走 /api/stream（服务端持 Key、拼系统提示）。
 * - set_code 工具在浏览器执行：写入编辑器并播放，失败时 throw，pi 会把错误作为
 *   tool result 交回模型，模型自行修正。
 * - read_doc / search_docs 工具读 skills/strudel/ 里的资料（服务端 /api/skill/*），
 *   让模型按需查语法、函数参考、示例曲和鼓型，而不是把整个资料库塞进系统提示。
 * - beforeToolCall 分别限制每次用户输入最多调几次 set_code / 查几次资料，避免无限循环。
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

/** 服务端过载、限流、网关超时这类错误值得自动重试 */
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
  path: Type.String({ description: '相对 skill 目录的文件路径，例如 learn/effects.md、reference/controls.md、examples/drums/funk.md' }),
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

/** 读 Strudel 资料（文件或文件里的一个标题段落） */
export function createReadDocTool(): AgentTool<typeof ReadDocParams, { path: string; heading?: string }> {
  return {
    name: READ_DOC_TOOL,
    label: '查阅资料',
    description:
      '读取 Strudel skill 资料库里的一个 markdown 文件，或只读其中一个标题下的段落。文件列表见系统提示里的"文件索引"。长文件不带 heading 时只返回大纲。',
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

/** 全文搜索 Strudel 资料 */
export function createSearchDocsTool(): AgentTool<typeof SearchDocsParams, { query: string; count: number }> {
  return {
    name: SEARCH_DOCS_TOOL,
    label: '搜索资料',
    description: '在 Strudel skill 资料库里全文搜索（函数名、曲风、采样名、关键词），返回命中的文件、标题和行，然后用 read_doc 读对应段落。',
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
  /** 更新工具执行用的宿主回调（React 里回调身份会变，agent 只创建一次） */
  setHost: (host: AgentHost) => void
  /** 订阅自动重试事件（上游过载 / 限流时），返回取消函数 */
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
      // 真正的系统提示在服务端拼装，这里只是占位
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

  // 上游偶发的过载 / 限流：把报错的 assistant 消息从历史里去掉，退避后自动续跑
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

  // 服务端根据环境变量决定实际模型（Anthropic / OpenAI 协议），同步到 Agent 状态里，
  // 这样消息记录里的 api / provider / model 字段与真实调用一致
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

/** 用户消息末尾附带的编辑器代码，用这两个标记包起来，UI 显示时去掉 */
export const CODE_OPEN = '\n\n<current_code>\n'
export const CODE_CLOSE = '\n</current_code>'

export function withCurrentCode(text: string, code: string) {
  return `${text}${CODE_OPEN}${code}${CODE_CLOSE}`
}

export function stripCurrentCode(text: string) {
  const i = text.indexOf(CODE_OPEN)
  return i >= 0 ? text.slice(0, i) : text
}
