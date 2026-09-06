import type { AgentMessage } from '@earendil-works/pi-agent-core'
import { notFound, redirect } from 'next/navigation'

import { StudioLoader } from '@/components/studio-loader'
import { getProject, getSession } from '@/db/queries'
import { isUuid } from '@/lib/api-utils'

export const dynamic = 'force-dynamic'

export default async function SessionPage({ params }: { params: Promise<{ id: string; sid: string }> }) {
  const { id, sid } = await params
  if (!isUuid(id) || !isUuid(sid)) notFound()
  const [projectData, sessionData] = await Promise.all([getProject(id), getSession(sid)])
  if (!projectData) notFound()
  // 会话不存在或不属于这个工程：回到工程默认会话
  if (!sessionData || sessionData.session.projectId !== id) redirect(`/p/${id}`)

  const project = {
    ...projectData.project,
    createdAt: projectData.project.createdAt.toISOString(),
    updatedAt: projectData.project.updatedAt.toISOString(),
  }
  const session = {
    ...sessionData.session,
    createdAt: sessionData.session.createdAt.toISOString(),
    updatedAt: sessionData.session.updatedAt.toISOString(),
  }

  return <StudioLoader project={project} session={session} messages={sessionData.messages as AgentMessage[]} />
}
