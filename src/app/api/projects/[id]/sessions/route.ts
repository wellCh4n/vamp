import { createSession } from '@/db/queries'
import { handleError, isUuid, json, readJson } from '@/lib/api-utils'

export const runtime = 'nodejs'

type Ctx = { params: Promise<{ id: string }> }

export async function POST(req: Request, { params }: Ctx) {
  const { id } = await params
  if (!isUuid(id)) return json(404, { error: '工程不存在。' })
  const body = await readJson<{ title?: string }>(req)
  try {
    const session = await createSession(id, body?.title?.slice(0, 80))
    if (!session) return json(404, { error: '工程不存在。' })
    return json(201, { session })
  } catch (err) {
    return handleError(err)
  }
}
