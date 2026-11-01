// Local development database: PGlite (real Postgres compiled to WASM), stored in .data/pglite.
// Exposes the same interface our /api code uses from the Neon driver:
//   await sql`SELECT ... WHERE id = ${id}`  → rows
//   await sql.query(text, params)           → rows
import { PGlite } from '@electric-sql/pglite'
import { mkdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
export const LOCAL_DB_DIR = path.join(root, '.data', 'pglite')

export async function openLocalDb() {
  mkdirSync(path.dirname(LOCAL_DB_DIR), { recursive: true })
  const pg = new PGlite(LOCAL_DB_DIR)
  await pg.waitReady

  const sql = async (strings, ...values) => {
    const text = strings.reduce((acc, part, i) => acc + `$${i}` + part)
    return (await pg.query(text, values)).rows
  }
  sql.query = async (text, params = []) => (await pg.query(text, params)).rows
  sql.close = () => pg.close()
  return sql
}
