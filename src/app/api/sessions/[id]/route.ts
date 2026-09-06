import { deleteSession, getSession, renameSession } from '@/db/queries'
import { handleError, isUuid, json, readJson } from '@/lib/api-utils'

export const runtime = 'nodejs'

type Ctx = { params: Promise<{ id: string }> }

export async function GET(_req: Request, { params }: Ctx) {
  const { id } = await params
  if (!isUuid(id)) return json(404, { error: '会话不存在。' })
  try {
    const data = await getSession(id)
    if (!data) return json(404, { error: '会话不存在。' })
    return json(200, data)
  } catch (err) {
    return handleError(err)
  }
}

export async function PATCH(req: Request, { params }: Ctx) {
  const { id } = await params
  if (!isUuid(id)) return json(404, { error: '会话不存在。' })
  const body = await readJson<{ title?: string }>(req)
  const title = body?.title?.trim()
  if (!title || title.length > 80) return json(400, { error: '标题不合法。' })
  try {
    const session = await renameSession(id, title)
    return session ? json(200, { session }) : json(404, { error: '会话不存在。' })
  } catch (err) {
    return handleError(err)
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const { id } = await params
  if (!isUuid(id)) return json(404, { error: '会话不存在。' })
  try {
    return (await deleteSession(id)) ? json(200, { ok: true }) : json(404, { error: '会话不存在。' })
  } catch (err) {
    return handleError(err)
  }
}
