import 'server-only'

import { and, asc, count, desc, eq, sql } from 'drizzle-orm'

import { getDb } from '@/db'
import { messages, projects, projectVersions, sessions, type Project, type Session } from '@/db/schema'

/** 数据访问层：所有 API 路由和服务端页面都走这里 */

export interface ProjectSummary extends Project {
  sessionCount: number
}

export async function listProjects(): Promise<ProjectSummary[]> {
  const db = await getDb()
  const rows = await db
    .select({ project: projects, sessionCount: count(sessions.id) })
    .from(projects)
    .leftJoin(sessions, eq(sessions.projectId, projects.id))
    .groupBy(projects.id)
    .orderBy(desc(projects.updatedAt))
  return rows.map((r) => ({ ...r.project, sessionCount: Number(r.sessionCount) }))
}

export async function createProject(name: string, code = ''): Promise<Project> {
  const db = await getDb()
  const [project] = await db.insert(projects).values({ name, code }).returning()
  return project
}

export async function getProject(id: string): Promise<{ project: Project; sessions: Session[] } | null> {
  const db = await getDb()
  const project = await db.query.projects.findFirst({ where: eq(projects.id, id) })
  if (!project) return null
  const list = await db.select().from(sessions).where(eq(sessions.projectId, id)).orderBy(desc(sessions.updatedAt))
  return { project, sessions: list }
}

export async function renameProject(id: string, name: string): Promise<Project | null> {
  const db = await getDb()
  const [project] = await db.update(projects).set({ name, updatedAt: new Date() }).where(eq(projects.id, id)).returning()
  return project ?? null
}

/**
 * 更新工程代码并记一条版本。代码没变时不记版本（手动编辑的防抖保存会频繁调用）。
 */
export async function saveProjectCode(id: string, code: string, summary: string, sessionId: string | null): Promise<Project | null> {
  const db = await getDb()
  return db.transaction(async (tx) => {
    const current = await tx.query.projects.findFirst({ where: eq(projects.id, id) })
    if (!current) return null
    if (current.code === code) return current
    const [project] = await tx.update(projects).set({ code, updatedAt: new Date() }).where(eq(projects.id, id)).returning()
    await tx.insert(projectVersions).values({ projectId: id, sessionId, code, summary })
    return project
  })
}

export async function deleteProject(id: string): Promise<boolean> {
  const db = await getDb()
  const deleted = await db.delete(projects).where(eq(projects.id, id)).returning({ id: projects.id })
  return deleted.length > 0
}

export async function listVersions(projectId: string) {
  const db = await getDb()
  return db.select().from(projectVersions).where(eq(projectVersions.projectId, projectId)).orderBy(desc(projectVersions.createdAt)).limit(100)
}

export async function createSession(projectId: string, title?: string): Promise<Session | null> {
  const db = await getDb()
  const project = await db.query.projects.findFirst({ where: eq(projects.id, projectId), columns: { id: true } })
  if (!project) return null
  const [session] = await db
    .insert(sessions)
    .values({ projectId, title: title?.trim() || '新会话' })
    .returning()
  await db.update(projects).set({ updatedAt: new Date() }).where(eq(projects.id, projectId))
  return session
}

export async function getSession(id: string): Promise<{ session: Session; messages: unknown[] } | null> {
  const db = await getDb()
  const session = await db.query.sessions.findFirst({ where: eq(sessions.id, id) })
  if (!session) return null
  const rows = await db.select({ message: messages.message }).from(messages).where(eq(messages.sessionId, id)).orderBy(asc(messages.seq))
  return { session, messages: rows.map((r) => r.message) }
}

export async function renameSession(id: string, title: string): Promise<Session | null> {
  const db = await getDb()
  const [session] = await db.update(sessions).set({ title, updatedAt: new Date() }).where(eq(sessions.id, id)).returning()
  return session ?? null
}

export async function deleteSession(id: string): Promise<boolean> {
  const db = await getDb()
  const deleted = await db.delete(sessions).where(eq(sessions.id, id)).returning({ id: sessions.id })
  return deleted.length > 0
}

/** 追加消息，seq 接着已有的最大值往后排 */
export async function appendMessages(sessionId: string, items: unknown[]): Promise<number> {
  if (items.length === 0) return 0
  const db = await getDb()
  return db.transaction(async (tx) => {
    const session = await tx.query.sessions.findFirst({ where: eq(sessions.id, sessionId), columns: { id: true, projectId: true } })
    if (!session) return -1
    const [{ max }] = await tx
      .select({ max: sql<number>`coalesce(max(${messages.seq}), -1)`.mapWith(Number) })
      .from(messages)
      .where(eq(messages.sessionId, sessionId))
    await tx.insert(messages).values(items.map((message, i) => ({ sessionId, seq: max + 1 + i, message })))
    const now = new Date()
    await tx.update(sessions).set({ updatedAt: now }).where(eq(sessions.id, sessionId))
    await tx.update(projects).set({ updatedAt: now }).where(and(eq(projects.id, session.projectId)))
    return items.length
  })
}

export interface ProjectTreeNode extends Project {
  sessions: Session[]
}

/** 侧边栏用：所有工程及其会话（按更新时间倒序） */
export async function listProjectTree(): Promise<ProjectTreeNode[]> {
  const db = await getDb()
  const projectRows = await db.select().from(projects).orderBy(desc(projects.updatedAt))
  const sessionRows = await db.select().from(sessions).orderBy(desc(sessions.updatedAt))
  const byProject = new Map<string, Session[]>()
  for (const s of sessionRows) {
    const list = byProject.get(s.projectId) ?? []
    list.push(s)
    byProject.set(s.projectId, list)
  }
  return projectRows.map((p) => ({ ...p, sessions: byProject.get(p.id) ?? [] }))
}

/** 工程最近的会话；没有就建一个 */
export async function latestOrNewSession(projectId: string): Promise<Session | null> {
  const db = await getDb()
  const [latest] = await db.select().from(sessions).where(eq(sessions.projectId, projectId)).orderBy(desc(sessions.updatedAt)).limit(1)
  if (latest) return latest
  return createSession(projectId)
}
