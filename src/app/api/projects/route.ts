import { createProject, listProjects } from '@/db/queries'
import { handleError, json, readJson } from '@/lib/api-utils'

export const runtime = 'nodejs'

export async function GET() {
  try {
    return json(200, { projects: await listProjects() })
  } catch (err) {
    return handleError(err)
  }
}

export async function POST(req: Request) {
  const body = await readJson<{ name?: string; code?: string }>(req)
  const name = body?.name?.trim()
  if (!name) return json(400, { error: '工程名不能为空。' })
  if (name.length > 80) return json(400, { error: '工程名太长。' })
  try {
    return json(201, { project: await createProject(name, body?.code ?? '') })
  } catch (err) {
    return handleError(err)
  }
}
