import type { Model } from '@earendil-works/pi-ai'

/**
 * Model definitions used by the agent (pure data, shared by browser and server).
 *
 * The server picks which one from the environment (see src/lib/llm-config.ts), and the browser
 * fetches the same definition via GET /api/stream. The server never trusts a model sent by the browser.
 */

export const DEFAULT_ANTHROPIC_MODEL = 'claude-opus-5'
export const DEFAULT_ANTHROPIC_BASE_URL = 'https://api.anthropic.com'
export const DEFAULT_OPENAI_MODEL = 'gpt-5'
export const DEFAULT_OPENAI_BASE_URL = 'https://api.openai.com/v1'

export type AgentModel = Model<'anthropic-messages'> | Model<'openai-completions'> | Model<'openai-responses'>

export interface AnthropicModelConfig {
  id?: string
  baseUrl?: string
}

export function createAnthropicModel({ id = DEFAULT_ANTHROPIC_MODEL, baseUrl = DEFAULT_ANTHROPIC_BASE_URL }: AnthropicModelConfig = {}): Model<'anthropic-messages'> {
  return {
    id,
    name: id,
    api: 'anthropic-messages',
    provider: 'anthropic',
    baseUrl,
    reasoning: true,
    thinkingLevelMap: { xhigh: 'xhigh', max: 'max' },
    input: ['text', 'image'],
    cost: { input: 5, output: 25, cacheRead: 0.5, cacheWrite: 6.25 },
    contextWindow: 1_000_000,
    maxTokens: 128_000,
    compat: {
      // Claude 4.6+ / 5 family: adaptive thinking + output_config.effort instead of budget_tokens
      forceAdaptiveThinking: true,
      supportsStrictTools: true,
    },
  }
}

export interface OpenAIModelConfig {
  id?: string
  baseUrl?: string
  /** chat/completions (the most widely compatible) or responses */
  api?: 'openai-completions' | 'openai-responses'
  /** Whether the model supports reasoning_effort; inferred from the model name when omitted */
  reasoning?: boolean
}

/** The o1/o3/o4/gpt-5 families are assumed to support reasoning_effort */
export function guessOpenAIReasoning(id: string) {
  return /^(o\d|gpt-5)/i.test(id)
}

export function createOpenAIModel({
  id = DEFAULT_OPENAI_MODEL,
  baseUrl = DEFAULT_OPENAI_BASE_URL,
  api = 'openai-completions',
  reasoning = guessOpenAIReasoning(id),
}: OpenAIModelConfig = {}): Model<'openai-completions'> | Model<'openai-responses'> {
  return {
    id,
    name: id,
    api,
    provider: 'openai',
    baseUrl,
    reasoning,
    input: ['text', 'image'],
    cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
    contextWindow: 200_000,
    maxTokens: 32_000,
    // Leave compat empty: pi-ai infers it from the baseUrl (api.openai.com / OpenRouter / DeepSeek / a local service, …)
  }
}

/** Back-compat for older callers: the default Anthropic model */
export function createAgentModel(id?: string): Model<'anthropic-messages'> {
  return createAnthropicModel({ id })
}

/** Name of the set_code tool, defined and executed in the browser */
export const SET_CODE_TOOL = 'set_code'

/** Name of the tool that reads Strudel skill docs: one file by path, optionally a single heading */
export const READ_DOC_TOOL = 'read_doc'
/** Full-text search over the Strudel skill docs */
export const SEARCH_DOCS_TOOL = 'search_docs'
export const DOC_TOOLS: readonly string[] = [READ_DOC_TOOL, SEARCH_DOCS_TOOL]

/** How many set_code calls one user message may trigger (the self-repair ceiling) */
export const MAX_TOOL_CALLS_PER_PROMPT = 4
/** How many doc lookups one user message may trigger (read_doc + search_docs combined) */
export const MAX_DOC_CALLS_PER_PROMPT = 8
