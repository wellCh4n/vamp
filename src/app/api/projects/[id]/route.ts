import { deleteProject, getProject, renameProject, saveProjectCode } from '@/db/queries'
import { handleError, isUuid, json, readJson } from '@/lib/api-utils'

export const runtime = 'nodejs'

type Ctx = { params: Promise<{ id: string }> }

export async function GET(_req: Request, { params }: Ctx) {
  const { id } = await params
  if (!isUuid(id)) return json(404, { error: '工程不存在。' })
  try {
    const data = await getProject(id)
    if (!data) return json(404, { error: '工程不存在。' })
    return json(200, data)
  } catch (err) {
    return handleError(err)
  }
}

interface PatchBody {
  name?: string
  code?: string
  summary?: string
  sessionId?: string | null
}

export async function PATCH(req: Request, { params }: Ctx) {
  const { id } = await params
  if (!isUuid(id)) return json(404, { error: '工程不存在。' })
  const body = await readJson<PatchBody>(req)
  if (!body) return json(400, { error: '请求体不是合法 JSON。' })
  try {
    let project = null
    if (typeof body.name === 'string') {
      const name = body.name.trim()
      if (!name || name.length > 80) return json(400, { error: '工程名不合法。' })
      project = await renameProject(id, name)
    }
    if (typeof body.code === 'string') {
      if (body.code.length > 200_000) return json(413, { error: '代码过长。' })
      const sessionId = body.sessionId && isUuid(body.sessionId) ? body.sessionId : null
      project = await saveProjectCode(id, body.code, (body.summary ?? '手动编辑').slice(0, 200), sessionId)
    }
    if (!project) return json(404, { error: '工程不存在。' })
    return json(200, { project })
  } catch (err) {
    return handleError(err)
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const { id } = await params
  if (!isUuid(id)) return json(404, { error: '工程不存在。' })
  try {
    return (await deleteProject(id)) ? json(200, { ok: true }) : json(404, { error: '工程不存在。' })
  } catch (err) {
    return handleError(err)
  }
}
