import type { NextRequest } from 'next/server'

import { json } from '@/lib/api-utils'
import { searchDocs } from '@/lib/skill'

/** The agent's search_docs tool: GET /api/skill/search?q=lpf%20envelope */
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim()
  if (!q) return json(400, { error: '缺少 q 参数' })
  return json(200, { query: q, hits: searchDocs(q) })
}
