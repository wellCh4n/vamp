import type { NextRequest } from 'next/server'

import { json } from '@/lib/api-utils'
import { readDoc } from '@/lib/skill'

/** The agent's read_doc tool: GET /api/skill/read?path=learn/effects.md&heading=lpf */
export async function GET(req: NextRequest) {
  const path = req.nextUrl.searchParams.get('path')?.trim()
  const heading = req.nextUrl.searchParams.get('heading')?.trim() || undefined
  if (!path) return json(400, { error: '缺少 path 参数' })
  try {
    return json(200, readDoc(path, heading))
  } catch (err) {
    return json(404, { error: err instanceof Error ? err.message : String(err) })
  }
}
