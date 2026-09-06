import { appendMessages } from '@/db/queries'
import { handleError, isUuid, json, readJson } from '@/lib/api-utils'

export const runtime = 'nodejs'

type Ctx = { params: Promise<{ id: string }> }

const ROLES = new Set(['user', 'assistant', 'toolResult'])

export async function POST(req: Request, { params }: Ctx) {
  const { id } = await params
  if (!isUuid(id)) return json(404, { error: '会话不存在。' })
  const body = await readJson<{ messages?: unknown[] }>(req)
  const items = body?.messages
  if (!Array.isArray(items) || items.length === 0) return json(400, { error: 'messages 不能为空。' })
  if (items.length > 200) return json(413, { error: '一次追加的消息过多。' })
  const valid = items.every((m) => !!m && typeof m === 'object' && ROLES.has((m as { role?: string }).role ?? ''))
  if (!valid) return json(400, { error: '消息格式不合法。' })
  try {
    const count = await appendMessages(id, items)
    if (count < 0) return json(404, { error: '会话不存在。' })
    return json(201, { count })
  } catch (err) {
    return handleError(err)
  }
}
