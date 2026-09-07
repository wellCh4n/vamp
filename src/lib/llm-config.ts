import 'server-only'

import type { AssistantMessageEventStream, Context } from '@earendil-works/pi-ai'
import { stream as streamAnthropic } from '@earendil-works/pi-ai/api/anthropic-messages'
import { stream as streamOpenAICompletions } from '@earendil-works/pi-ai/api/openai-completions'
import { stream as streamOpenAIResponses } from '@earendil-works/pi-ai/api/openai-responses'

import { type AgentModel, createAnthropicModel, createOpenAIModel, guessOpenAIReasoning } from '@/lib/agent-model'

/**
 * Server-side LLM configuration: protocol, model, baseUrl and key, all from the environment.
 *
 *   LLM_PROVIDER=anthropic | openai            defaults to anthropic
 *   ANTHROPIC_API_KEY / ANTHROPIC_BASE_URL / ANTHROPIC_MODEL
 *   OPENAI_API_KEY / OPENAI_BASE_URL / OPENAI_MODEL / OPENAI_API=completions|responses / OPENAI_REASONING=auto|true|false
 */

export type Effort = 'low' | 'medium' | 'high' | 'xhigh' | 'max'
export const EFFORTS: ReadonlySet<string> = new Set<Effort>(['low', 'medium', 'high', 'xhigh', 'max'])

export interface StreamRequest {
  context: Context
  effort: Effort
  maxTokens: number
  signal: AbortSignal
}

export interface LlmConfig {
  provider: 'anthropic' | 'openai'
  model: AgentModel
  /** Which configuration is missing; empty means it is usable */
  missing?: string
  stream: (req: StreamRequest) => AssistantMessageEventStream
}

function env(name: string) {
  const v = process.env[name]?.trim()
  return v ? v : undefined
}

function parseReasoning(id: string) {
  const raw = (env('OPENAI_REASONING') ?? 'auto').toLowerCase()
  if (raw === 'true' || raw === '1') return true
  if (raw === 'false' || raw === '0') return false
  return guessOpenAIReasoning(id)
}

let cached: LlmConfig | undefined

export function getLlmConfig(): LlmConfig {
  if (cached) return cached
  const provider = (env('LLM_PROVIDER') ?? 'anthropic').toLowerCase()

  if (provider === 'openai') {
    const apiKey = env('OPENAI_API_KEY')
    const id = env('OPENAI_MODEL')
    const api = env('OPENAI_API') === 'responses' ? 'openai-responses' : 'openai-completions'
    const model = createOpenAIModel({ id, baseUrl: env('OPENAI_BASE_URL'), api, reasoning: parseReasoning(id ?? '') })
    cached = {
      provider: 'openai',
      model,
      missing: apiKey ? undefined : 'OPENAI_API_KEY',
      stream: ({ context, effort, maxTokens, signal }) => {
        // Local and third-party compatible services often do not support xhigh or max, so clamp to high
        const reasoningEffort = model.reasoning ? (effort === 'xhigh' || effort === 'max' ? 'high' : effort) : undefined
        const options = { apiKey: apiKey ?? '', maxTokens, reasoningEffort, signal }
        return model.api === 'openai-responses'
          ? streamOpenAIResponses(model, context, { ...options, reasoningSummary: 'auto' })
          : streamOpenAICompletions(model, context, options)
      },
    }
    return cached
  }

  const apiKey = env('ANTHROPIC_API_KEY')
  const model = createAnthropicModel({ id: env('ANTHROPIC_MODEL'), baseUrl: env('ANTHROPIC_BASE_URL') })
  cached = {
    provider: 'anthropic',
    model,
    missing: apiKey ? undefined : 'ANTHROPIC_API_KEY',
    stream: ({ context, effort, maxTokens, signal }) =>
      streamAnthropic(model, context, {
        apiKey: apiKey ?? '',
        maxTokens,
        thinkingEnabled: true,
        thinkingDisplay: 'summarized',
        effort,
        cacheRetention: 'short',
        signal,
      }),
  }
  return cached
}
