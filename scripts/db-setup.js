// Creates tables and sample data. Uses Neon when DATABASE_URL is set, otherwise the local database.
import { neon } from '@neondatabase/serverless'
import { createConnection } from 'node:net'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { setupDatabase } from '../server/setup-sql.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
try {
  process.loadEnvFile(path.join(root, '.env'))
} catch {
  /* no .env: local database */
}

const apiPort = Number(process.env.API_PORT || 3001)
const portInUse = () =>
  new Promise((resolve) => {
    const socket = createConnection({ port: apiPort, host: '127.0.0.1' })
    socket.once('connect', () => (socket.destroy(), resolve(true)))
    socket.once('error', () => resolve(false))
  })

let sql
let target
if (process.env.DATABASE_URL) {
  sql = neon(process.env.DATABASE_URL)
  target = 'Neon (DATABASE_URL)'
} else {
  if (await portInUse()) {
    console.error(
      '\n✖ The local database is in use by the running app (npm run dev).\n' +
        '  You don’t need db:setup locally: npm run dev sets up the tables and sample data on every start.\n' +
        '  To run it anyway, stop npm run dev first (Ctrl+C), then run npm run db:setup again.\n',
    )
    process.exit(1)
  }
  const { openLocalDb } = await import('../server/local-db.js')
  sql = await openLocalDb()
  target = 'local database (.data/pglite)'
}

console.log(`Setting up ${target}…`)
try {
  const counts = await setupDatabase(sql)
  console.log('\nRow counts:')
  console.table(counts)
} catch (err) {
  console.error('\n✖ Database setup failed:', err.message)
  if (process.env.DATABASE_URL) console.error('  Check that DATABASE_URL in .env is correct and that you are online.')
  process.exitCode = 1
} finally {
  await sql.close?.()
}
