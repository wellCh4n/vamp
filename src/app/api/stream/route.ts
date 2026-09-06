import type { NextRequest } from 'next/server'
import type { AssistantMessageEvent, Context, Message, Usage } from '@earendil-works/pi-ai'
import type { ProxyAssistantMessageEvent } from '@earendil-works/pi-agent-core'

import { AGENT_INSTRUCTIONS } from '@/lib/agent-prompt'
import { getSkillPrompt } from '@/lib/skill'
import { type Effort, EFFORTS, getLlmConfig } from '@/lib/llm-config'

/**
 * pi-agent-core `streamProxy` 的服务端。
 *
 * 浏览器里的 Agent 把每次 LLM 调用 POST 到这里（{ model, context, options }），
 * 这里持有 API Key，按环境变量选择 Anthropic 或 OpenAI 协议（见 llm-config.ts）调模型，
 * 再把事件按 streamProxy 的 SSE 协议回传。服务端无状态：对话历史在浏览器，工具也在浏览器执行。
 *
 * GET 返回当前模型定义，浏览器用它初始化 Agent。
 */

export const runtime = 'nodejs'
export const maxDuration = 120

const MAX_BODY_BYTES = 2_000_000
const MAX_MESSAGES = 200

interface ProxyRequest {
  context?: Partial<Context>
  options?: { reasoning?: string; maxTokens?: number }
}

const EMPTY_USAGE: Usage = {
  input: 0,
  output: 0,
  cacheRead: 0,
  cacheWrite: 0,
  totalTokens: 0,
  cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 },
}

function json(status: number, body: unknown) {
  return Response.json(body, { status })
}

function isMessage(m: unknown): m is Message {
  return !!m && typeof m === 'object' && typeof (m as { role?: unknown }).role === 'string'
}

function missingKeyMessage(name: string) {
  return `服务端未配置 ${name}。请复制 .env.example 为 .env.local 并填入，然后重启 dev server。`
}

/** 去掉 partial 字段，只发浏览器重建消息所需的增量 */
function toProxyEvent(event: AssistantMessageEvent): ProxyAssistantMessageEvent | undefined {
  switch (event.type) {
    case 'start':
      return { type: 'start' }
    case 'text_start':
    case 'thinking_start':
      return { type: event.type, contentIndex: event.contentIndex }
    case 'text_delta':
    case 'thinking_delta':
    case 'toolcall_delta':
      return { type: event.type, contentIndex: event.contentIndex, delta: event.delta }
    case 'text_end': {
      const block = event.partial.content[event.contentIndex]
      return { type: 'text_end', contentIndex: event.contentIndex, contentSignature: block?.type === 'text' ? block.textSignature : undefined }
    }
    case 'thinking_end': {
      const block = event.partial.content[event.contentIndex]
      return {
        type: 'thinking_end',
        contentIndex: event.contentIndex,
        contentSignature: block?.type === 'thinking' ? block.thinkingSignature : undefined,
      }
    }
    case 'toolcall_start': {
      const block = event.partial.content[event.contentIndex]
      if (block?.type !== 'toolCall') return undefined
      return { type: 'toolcall_start', contentIndex: event.contentIndex, id: block.id, toolName: block.name }
    }
    case 'toolcall_end':
      return { type: 'toolcall_end', contentIndex: event.contentIndex, toolCall: event.toolCall }
    case 'done':
      // streamProxy 的协议里没有 deferred（延迟工具），归为普通结束
      return { type: 'done', reason: event.reason === 'deferred' ? 'stop' : event.reason, usage: event.message.usage }
    case 'error':
      return { type: 'error', reason: event.reason, errorMessage: event.error.errorMessage, usage: event.error.usage }
    default:
      return undefined
  }
}

/** 浏览器初始化 Agent 时取模型定义（不含任何密钥） */
export async function GET() {
  const config = getLlmConfig()
  return json(200, { provider: config.provider, model: config.model, missing: config.missing ?? null })
}

export async function POST(req: NextRequest) {
  const config = getLlmConfig()
  if (config.missing) return json(500, { error: missingKeyMessage(config.missing) })

  const raw = await req.text()
  if (raw.length > MAX_BODY_BYTES) return json(413, { error: '对话内容过长，请新建对话。' })
  let body: ProxyRequest
  try {
    body = JSON.parse(raw) as ProxyRequest
  } catch {
    return json(400, { error: '请求体不是合法 JSON。' })
  }
  const messages = body.context?.messages
  if (!Array.isArray(messages) || messages.length === 0 || !messages.every(isMessage)) {
    return json(400, { error: 'context.messages 不合法。' })
  }
  if (messages.length > MAX_MESSAGES) return json(413, { error: '对话轮数过多，请新建对话。' })

  // 系统提示由服务端拼装：指令 + Strudel skill 的 SKILL.md（速查 + 资料索引；走 prompt cache，不经过浏览器）
  const context: Context = {
    systemPrompt: `${AGENT_INSTRUCTIONS}\n\n${getSkillPrompt()}`,
    messages,
    tools: body.context?.tools,
  }
  const requested = body.options?.reasoning ?? ''
  const effort: Effort = EFFORTS.has(requested) ? (requested as Effort) : 'high'
  const maxTokens = Math.min(body.options?.maxTokens ?? 16000, 64000)

  const encoder = new TextEncoder()
  const readable = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: ProxyAssistantMessageEvent) => controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`))
      try {
        for await (const event of config.stream({ context, effort, maxTokens, signal: req.signal })) {
          const proxyEvent = toProxyEvent(event)
          if (proxyEvent) send(proxyEvent)
        }
      } catch (err) {
        // pi-ai 约定流内不抛错，这里兜底（例如缺少 auth 时会同步抛）
        send({
          type: 'error',
          reason: req.signal.aborted ? 'aborted' : 'error',
          errorMessage: err instanceof Error ? err.message : String(err),
          usage: EMPTY_USAGE,
        })
      } finally {
        controller.close()
      }
    },
  })

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'X-Accel-Buffering': 'no',
    },
  })
}
