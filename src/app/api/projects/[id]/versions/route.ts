import { listVersions } from '@/db/queries'
import { handleError, isUuid, json } from '@/lib/api-utils'

export const runtime = 'nodejs'

type Ctx = { params: Promise<{ id: string }> }

export async function GET(_req: Request, { params }: Ctx) {
  const { id } = await params
  if (!isUuid(id)) return json(404, { error: '工程不存在。' })
  try {
    return json(200, { versions: await listVersions(id) })
  } catch (err) {
    return handleError(err)
  }
}
