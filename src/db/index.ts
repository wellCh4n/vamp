import 'server-only'

import path from 'node:path'
import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { Pool } from 'pg'

import * as schema from './schema'

export type Db = NodePgDatabase<typeof schema>

/**
 * Database connection (a singleton kept on globalThis so dev hot reloads reuse it).
 * Migrations under drizzle/ run automatically on first use, so `db:migrate` is not needed by hand.
 */

const globalForDb = globalThis as unknown as { __vibeDb?: { db: Db; ready: Promise<void> } }

function connectionString() {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('未配置 DATABASE_URL。请在 .env.local 里设置，例如 postgres://vibe:vibe@localhost:5436/vibe（docker compose up -d 即可启动）。')
  return url
}

function create() {
  const pool = new Pool({ connectionString: connectionString(), max: 10 })
  const db = drizzle(pool, { schema })
  const ready = migrate(db, { migrationsFolder: path.join(process.cwd(), 'drizzle') })
  return { db, ready }
}

export async function getDb(): Promise<Db> {
  globalForDb.__vibeDb ??= create()
  try {
    await globalForDb.__vibeDb.ready
  } catch (err) {
    // Retry on the next call if the migration failed (the database not being up, for example)
    globalForDb.__vibeDb = undefined
    throw err
  }
  return globalForDb.__vibeDb.db
}

export { schema }
