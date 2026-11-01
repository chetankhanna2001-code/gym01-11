import { neon } from '@neondatabase/serverless'
import { HttpError } from './http.js'

let sql

export function db() {
  // The local dev server (server/dev-api.js) injects a local Postgres when DATABASE_URL is empty.
  if (globalThis.__pulsefitLocalSql) return globalThis.__pulsefitLocalSql
  if (!process.env.DATABASE_URL) {
    throw new HttpError(503, 'The database isn’t connected yet. Add DATABASE_URL to your .env file and run "npm run db:setup".', 'DB_NOT_CONFIGURED')
  }
  sql ??= neon(process.env.DATABASE_URL)
  return sql
}
