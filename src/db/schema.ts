import { relations, sql } from 'drizzle-orm'
import { bigserial, index, integer, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

/**
 * 工程 > 会话 > 消息。
 *
 * - projects：一个工程就是一首音乐，code 是当前代码。
 * - sessions：对同一个工程的多次对话，每个会话有独立的 Agent 历史。
 * - messages：pi AgentMessage 原样存 jsonb，按 seq 排序。
 * - project_versions：每次代码变更（Agent 的 set_code 或手动编辑）的快照，可回溯。
 */

const timestamps = {
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}

export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  name: text('name').notNull(),
  code: text('code').notNull().default(''),
  ...timestamps,
})

export const sessions = pgTable(
  'sessions',
  {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    projectId: uuid('project_id')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
    title: text('title').notNull().default('新会话'),
    ...timestamps,
  },
  (t) => [index('sessions_project_idx').on(t.projectId, t.updatedAt)],
)

export const messages = pgTable(
  'messages',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    sessionId: uuid('session_id')
      .notNull()
      .references(() => sessions.id, { onDelete: 'cascade' }),
    seq: integer('seq').notNull(),
    /** pi-agent-core 的 AgentMessage（user / assistant / toolResult） */
    message: jsonb('message').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('messages_session_seq_idx').on(t.sessionId, t.seq)],
)

export const projectVersions = pgTable(
  'project_versions',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    projectId: uuid('project_id')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
    sessionId: uuid('session_id').references(() => sessions.id, { onDelete: 'set null' }),
    code: text('code').notNull(),
    /** 这次改动的说明：Agent 的 summary 或 "手动编辑" */
    summary: text('summary').notNull().default(''),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('project_versions_project_idx').on(t.projectId, t.createdAt)],
)

export const projectsRelations = relations(projects, ({ many }) => ({
  sessions: many(sessions),
  versions: many(projectVersions),
}))

export const sessionsRelations = relations(sessions, ({ one, many }) => ({
  project: one(projects, { fields: [sessions.projectId], references: [projects.id] }),
  messages: many(messages),
}))

export const messagesRelations = relations(messages, ({ one }) => ({
  session: one(sessions, { fields: [messages.sessionId], references: [sessions.id] }),
}))

export const projectVersionsRelations = relations(projectVersions, ({ one }) => ({
  project: one(projects, { fields: [projectVersions.projectId], references: [projects.id] }),
}))

export type Project = typeof projects.$inferSelect
export type Session = typeof sessions.$inferSelect
export type MessageRow = typeof messages.$inferSelect
export type ProjectVersion = typeof projectVersions.$inferSelect
