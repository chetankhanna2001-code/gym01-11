import { jwtVerify, SignJWT } from 'jose'
import { HttpError } from './http.js'

const COOKIE = 'pf_session'
const MAX_AGE = 60 * 60 * 24 * 7 // 7 days

function secret() {
  if (!process.env.JWT_SECRET) throw new HttpError(500, 'JWT_SECRET is not set on the server.', 'NO_JWT_SECRET')
  return new TextEncoder().encode(process.env.JWT_SECRET)
}

function cookie(value, maxAge) {
  const secure = process.env.NODE_ENV === 'production' || process.env.VERCEL ? '; Secure' : ''
  return `${COOKIE}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`
}

function readCookie(req) {
  const header = req.headers.cookie || ''
  for (const part of header.split(';')) {
    const [k, ...v] = part.trim().split('=')
    if (k === COOKIE) return decodeURIComponent(v.join('='))
  }
  return null
}

export async function startSession(res, userId) {
  const token = await new SignJWT({})
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(String(userId))
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secret())
  res.setHeader('Set-Cookie', cookie(token, MAX_AGE))
}

export function endSession(res) {
  res.setHeader('Set-Cookie', cookie('', 0))
}

/** Returns the logged-in user id, or null. */
export async function sessionUserId(req) {
  const token = readCookie(req)
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, secret(), { algorithms: ['HS256'] })
    const id = Number(payload.sub)
    return Number.isInteger(id) ? id : null
  } catch {
    return null
  }
}

export async function requireUser(req) {
  const id = await sessionUserId(req)
  if (!id) throw new HttpError(401, 'Please log in to continue.', 'UNAUTHENTICATED')
  return id
}

export function publicUser(u) {
  const parts = u.full_name.trim().split(/\s+/)
  return {
    id: u.id,
    email: u.email,
    fullName: u.full_name,
    firstName: parts[0],
    initials: (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase(),
    weeklyGoalWorkouts: u.weekly_goal_workouts,
    weeklyGoalMinutes: u.weekly_goal_minutes,
    createdAt: u.created_at,
  }
}
