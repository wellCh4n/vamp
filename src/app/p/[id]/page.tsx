import { notFound, redirect } from 'next/navigation'

import { getProject, latestOrNewSession } from '@/db/queries'
import { isUuid } from '@/lib/api-utils'

export const dynamic = 'force-dynamic'

/** 点开工程 = 进入它最近的会话（没有就建一个） */
export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!isUuid(id)) notFound()
  const data = await getProject(id)
  if (!data) notFound()
  const session = await latestOrNewSession(id)
  if (!session) notFound()
  redirect(`/p/${id}/s/${session.id}`)
}
