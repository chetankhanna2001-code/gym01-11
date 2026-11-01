// Makes sure .env exists, generates JWT_SECRET if empty, and checks DATABASE_URL.
// Usage: node scripts/ensure-env.js [--require-db]
import { randomBytes } from 'node:crypto'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const envPath = path.join(root, '.env')
const examplePath = path.join(root, '.env.example')
const requireDb = process.argv.includes('--require-db')

if (!existsSync(envPath)) {
  writeFileSync(envPath, existsSync(examplePath) ? readFileSync(examplePath, 'utf8') : 'DATABASE_URL=\nJWT_SECRET=\n')
  console.log('✔ Created .env')
}

let text = readFileSync(envPath, 'utf8')
const valueOf = (key) => {
  const m = text.match(new RegExp(`^\\s*${key}\\s*=(.*)$`, 'm'))
  return m ? m[1].trim().replace(/^["']|["']$/g, '') : ''
}

if (!valueOf('JWT_SECRET')) {
  const secret = randomBytes(48).toString('base64url')
  text = /^\s*JWT_SECRET\s*=.*$/m.test(text)
    ? text.replace(/^\s*JWT_SECRET\s*=.*$/m, `JWT_SECRET=${secret}`)
    : `${text.trimEnd()}\nJWT_SECRET=${secret}\n`
  writeFileSync(envPath, text)
  console.log('✔ Generated a strong JWT_SECRET in .env')
}

if (!valueOf('DATABASE_URL') && !requireDb) {
  console.log('ℹ DATABASE_URL is empty, so PulseFit uses the local database in .data/pglite (no setup needed).')
} else if (!valueOf('DATABASE_URL')) {
  const msg = `
  ⚠  DATABASE_URL is missing from .env

  Get your free Neon connection string:
    1. Go to https://console.neon.tech and sign in (free plan is fine)
    2. Create a project (any name, e.g. "pulsefit"), or open your existing one
    3. On the project dashboard, click the "Connect" button (top right)
    4. In the "Connect to your database" window, keep the defaults and
       copy the connection string. It starts with  postgresql://  and
       ends with  ?sslmode=require  (click "Show password" if it is hidden)
    5. Paste it into .env like this:
         DATABASE_URL=postgresql://user:password@ep-xxxx.region.aws.neon.tech/neondb?sslmode=require
    6. Run:  npm run db:setup
`
  if (requireDb) {
    console.error(msg)
    process.exit(1)
  }
  console.warn(msg)
}
