import type { Model } from '@earendil-works/pi-ai'

/**
 * Agent 用的模型定义（纯数据，浏览器和服务端共用）。
 *
 * 服务端根据环境变量决定用哪个（见 src/lib/llm-config.ts），浏览器通过
 * GET /api/stream 取到同一份定义。服务端不信任浏览器传来的 model。
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
      // Claude 4.6+ / 5 系列：adaptive thinking + output_config.effort，而不是 budget_tokens
      forceAdaptiveThinking: true,
      supportsStrictTools: true,
    },
  }
}

export interface OpenAIModelConfig {
  id?: string
  baseUrl?: string
  /** chat/completions（兼容面最广）还是 responses */
  api?: 'openai-completions' | 'openai-responses'
  /** 模型是否支持 reasoning_effort；不传则按型号名猜 */
  reasoning?: boolean
}

/** o1/o3/o4/gpt-5 系列默认认为支持 reasoning_effort */
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
    // compat 留空：pi-ai 会根据 baseUrl 自动判断（api.openai.com / OpenRouter / DeepSeek / 本地服务等）
  }
}

/** 兼容旧调用：默认的 Anthropic 模型 */
export function createAgentModel(id?: string): Model<'anthropic-messages'> {
  return createAnthropicModel({ id })
}

/** set_code 工具名，浏览器定义、浏览器执行 */
export const SET_CODE_TOOL = 'set_code'

/** 读 Strudel skill 资料的工具名：按路径（可带标题）读一个文件 */
export const READ_DOC_TOOL = 'read_doc'
/** 全文搜索 Strudel skill 资料 */
export const SEARCH_DOCS_TOOL = 'search_docs'
export const DOC_TOOLS: readonly string[] = [READ_DOC_TOOL, SEARCH_DOCS_TOOL]

/** 单次用户输入最多让模型调几次 set_code（自动修复上限） */
export const MAX_TOOL_CALLS_PER_PROMPT = 4
/** 单次用户输入最多查几次资料（read_doc + search_docs 合计） */
export const MAX_DOC_CALLS_PER_PROMPT = 8
