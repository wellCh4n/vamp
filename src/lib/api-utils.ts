import 'server-only'

/** Shared route-handler helpers: JSON responses, body parsing, uniform error handling */

export function json(status: number, body: unknown) {
  return Response.json(body, { status })
}

export async function readJson<T>(req: Request): Promise<T | null> {
  try {
    return (await req.json()) as T
  } catch {
    return null
  }
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function isUuid(value: string) {
  return UUID.test(value)
}

/** Turn errors like an unreachable database into a readable 500 */
export function handleError(err: unknown) {
  const message = err instanceof Error ? err.message : String(err)
  console.error('[api]', message)
  const hint = /ECONNREFUSED|DATABASE_URL|connect/i.test(message) ? '数据库不可用：请先 docker compose up -d 并检查 DATABASE_URL。' : message
  return json(500, { error: hint })
}
