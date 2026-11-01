// Local stand-in for Vercel: serves every file in /api as a route, using the exact same handlers.
//   api/stats.js          → /api/stats
//   api/auth/login.js     → /api/auth/login
//   api/workouts/index.js → /api/workouts
// Files and folders starting with "_" are private helpers (Vercel ignores them too).
import express from 'express'
import { readdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
try {
  process.loadEnvFile(path.join(root, '.env'))
} catch {
  console.warn('[api] No .env file found. Run `npm run dev` to create one.')
}

const PORT = Number(process.env.API_PORT || 3001)
const apiDir = path.join(root, 'api')

function collectRoutes(dir, base = '/api') {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name.startsWith('_') || entry.name.startsWith('.')) return []
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return collectRoutes(full, `${base}/${entry.name}`)
    if (!entry.name.endsWith('.js')) return []
    const name = entry.name.slice(0, -3)
    return [{ url: name === 'index' ? base : `${base}/${name}`, file: full }]
  })
}

// No DATABASE_URL → use the local Postgres in .data/pglite and make sure tables + sample data exist.
let localSql = null
if (!process.env.DATABASE_URL) {
  const { openLocalDb } = await import('./local-db.js')
  const { setupDatabase } = await import('./setup-sql.js')
  localSql = await openLocalDb()
  const counts = await setupDatabase(localSql, () => {})
  globalThis.__pulsefitLocalSql = localSql
  console.log(`[api] Local database ready (.data/pglite): ${counts.exercises} exercises, ${counts.classes} classes, ${counts.users} users`)
}

const app = express()
app.disable('x-powered-by')
app.use(express.json({ limit: '100kb' }))

const routes = collectRoutes(apiDir)
for (const { url, file } of routes) {
  const { default: handler } = await import(pathToFileURL(file).href)
  app.all(url, (req, res) => handler(req, res))
}

app.use('/api', (req, res) => res.status(404).json({ error: `No API route for ${req.method} ${req.originalUrl}` }))
app.use((err, req, res, _next) => {
  const status = err.status || 500
  res.status(status).json({ error: status === 400 ? 'Invalid JSON body.' : 'Something went wrong on our side.' })
})

const server = app.listen(PORT, () => {
  console.log(`[api] ${routes.length} routes ready on http://localhost:${PORT} using ${localSql ? 'the local database' : 'Neon'}`)
})

// Close the local database cleanly so its files are never left half-written.
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, async () => {
    server.close()
    await localSql?.close()
    process.exit(0)
  })
}
