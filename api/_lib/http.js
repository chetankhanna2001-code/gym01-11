// Shared request/response helpers for /api functions (works on Vercel and the local Express server).

export class HttpError extends Error {
  constructor(status, message, code) {
    super(message)
    this.status = status
    this.code = code
  }
}

const DB_CONNECTION_CODES = new Set(['28P01', '28000', '3D000', '08000', '08001', '08003', '08004', '08006', '57P01', '53300'])
const NETWORK_PATTERN = /fetch failed|ENOTFOUND|ECONNREFUSED|ECONNRESET|ETIMEDOUT|EAI_AGAIN|getaddrinfo|socket|network|timed out|Error connecting/i

function toErrorResponse(err) {
  if (err instanceof HttpError) return [err.status, { error: err.message, code: err.code }]

  if (err?.code === '42P01') {
    return [500, { error: 'The database tables are missing. Run "npm run db:setup" and try again.', code: 'DB_NOT_SETUP' }]
  }
  if (DB_CONNECTION_CODES.has(err?.code) || NETWORK_PATTERN.test(String(err?.message || '')) || NETWORK_PATTERN.test(String(err?.cause?.message || ''))) {
    console.error('[api] database unreachable:', err.message)
    return [503, { error: 'We can’t reach the database right now. Check your internet connection and DATABASE_URL, then try again.', code: 'DB_UNREACHABLE' }]
  }

  console.error('[api] unexpected error:', err)
  return [500, { error: 'Something went wrong on our side. Please try again.', code: 'SERVER_ERROR' }]
}

/** Wraps per-method handlers: route({ GET: fn, POST: fn }). */
export function route(methods) {
  return async function handler(req, res) {
    const fn = methods[req.method]
    if (!fn) {
      res.setHeader('Allow', Object.keys(methods).join(', '))
      return res.status(405).json({ error: 'Method not allowed' })
    }
    try {
      res.setHeader('Cache-Control', 'no-store')
      await fn(req, res)
    } catch (err) {
      const [status, body] = toErrorResponse(err)
      if (!res.headersSent) res.status(status).json(body)
    }
  }
}

export function readBody(req) {
  if (!req.body) return {}
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body)
    } catch {
      throw new HttpError(400, 'Invalid JSON body.')
    }
  }
  return req.body
}

export function requireInt(value, name) {
  const n = Number(value)
  if (!Number.isInteger(n) || n <= 0) throw new HttpError(400, `${name} must be a positive whole number.`)
  return n
}

// ---- Dates: the client sends its local calendar date so "today" matches the user's timezone.

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

export function clientDate(req) {
  const raw = req.query?.date ?? readBody(req).date
  if (typeof raw === 'string' && DATE_RE.test(raw) && !Number.isNaN(Date.parse(`${raw}T00:00:00Z`))) return raw
  return new Date().toISOString().slice(0, 10)
}

export function addDays(date, n) {
  const d = new Date(`${date}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}

export function mondayOf(date) {
  const dow = (new Date(`${date}T00:00:00Z`).getUTCDay() + 6) % 7
  return addDays(date, -dow)
}

export function weekdayShort(date) {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' })
}
