import { listProjectTree } from '@/db/queries'
import { handleError, json } from '@/lib/api-utils'

export const runtime = 'nodejs'

/** 侧边栏的工程 / 会话树 */
export async function GET() {
  try {
    return json(200, { projects: await listProjectTree() })
  } catch (err) {
    return handleError(err)
  }
}
