import { relations, sql } from 'drizzle-orm'
import { bigserial, index, integer, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

/**
 * Project > session > message.
 *
 * - projects: one project is one piece of music; `code` is its current code.
 * - sessions: separate conversations about the same project, each with its own agent history.
 * - messages: pi AgentMessage stored verbatim as jsonb, ordered by seq.
 * - project_versions: a snapshot of every code change (the agent's set_code or a manual edit), so
 *   history can be walked back.
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
    /** pi-agent-core's AgentMessage (user / assistant / toolResult) */
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
    /** What this change was: the agent's summary, or the label for a manual edit */
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
