import { config } from 'dotenv'
import { defineConfig } from 'drizzle-kit'

// drizzle-kit does not read .env.local on its own
config({ path: '.env.local' })
config()

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? 'postgres://vibe:vibe@localhost:5436/vibe',
  },
})
