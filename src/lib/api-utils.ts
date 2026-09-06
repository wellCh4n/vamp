import 'server-only'

/** Route Handler 公用：JSON 响应、请求体解析、错误统一处理 */

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

/** 把数据库不可用之类的错误转成可读的 500 */
export function handleError(err: unknown) {
  const message = err instanceof Error ? err.message : String(err)
  console.error('[api]', message)
  const hint = /ECONNREFUSED|DATABASE_URL|connect/i.test(message) ? '数据库不可用：请先 docker compose up -d 并检查 DATABASE_URL。' : message
  return json(500, { error: hint })
}
