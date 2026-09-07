import { listProjectTree } from '@/db/queries'
import { handleError, json } from '@/lib/api-utils'

export const runtime = 'nodejs'

/** The project / session tree shown in the sidebar */
export async function GET() {
  try {
    return json(200, { projects: await listProjectTree() })
  } catch (err) {
    return handleError(err)
  }
}
