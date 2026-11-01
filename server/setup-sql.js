// Runs db/schema.sql then db/seed.sql with any `sql` client that has .query(text). Safe to re-run.
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

// Split on semicolons that end a line. Our SQL files avoid semicolons inside strings.
const statements = (file) =>
  readFileSync(path.join(root, 'db', file), 'utf8')
    .split('\n')
    .filter((line) => !line.trim().startsWith('--'))
    .join('\n')
    .split(/;\s*(?:\n|$)/)
    .map((s) => s.trim())
    .filter(Boolean)

export async function setupDatabase(sql, log = console.log) {
  for (const file of ['schema.sql', 'seed.sql']) {
    const list = statements(file)
    for (const stmt of list) await sql.query(stmt)
    log(`✔ ${file} (${list.length} statements)`)
  }
  const [counts] = await sql.query(`
    SELECT (SELECT count(*) FROM exercises)::int AS exercises,
           (SELECT count(*) FROM classes)::int   AS classes,
           (SELECT count(*) FROM users)::int     AS users`)
  return counts
}
