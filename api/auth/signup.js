import bcrypt from 'bcryptjs'
import { publicUser, startSession } from '../_lib/auth.js'
import { db } from '../_lib/db.js'
import { HttpError, readBody, route } from '../_lib/http.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default route({
  async POST(req, res) {
    const { fullName, email, password, weeklyGoalWorkouts, weeklyGoalMinutes } = readBody(req)
    const name = String(fullName ?? '').trim()
    const mail = String(email ?? '').trim().toLowerCase()
    const goalWorkouts = Number(weeklyGoalWorkouts ?? 4)
    const goalMinutes = Number(weeklyGoalMinutes ?? 150)

    if (name.length < 2 || name.length > 80) throw new HttpError(400, 'Please enter your name (2–80 characters).')
    if (!EMAIL_RE.test(mail) || mail.length > 254) throw new HttpError(400, 'Please enter a valid email address.')
    if (typeof password !== 'string' || password.length < 8 || password.length > 72) {
      throw new HttpError(400, 'Your password needs at least 8 characters.')
    }
    if (!Number.isInteger(goalWorkouts) || goalWorkouts < 1 || goalWorkouts > 14) {
      throw new HttpError(400, 'Weekly workouts goal must be between 1 and 14.')
    }
    if (!Number.isInteger(goalMinutes) || goalMinutes < 10 || goalMinutes > 2000) {
      throw new HttpError(400, 'Weekly minutes goal must be between 10 and 2000.')
    }

    const sql = db()
    const hash = await bcrypt.hash(password, 10)
    const [user] = await sql`
      INSERT INTO users (email, password_hash, full_name, weekly_goal_workouts, weekly_goal_minutes)
      VALUES (${mail}, ${hash}, ${name}, ${goalWorkouts}, ${goalMinutes})
      ON CONFLICT (email) DO NOTHING
      RETURNING id, email, full_name, weekly_goal_workouts, weekly_goal_minutes, created_at`
    if (!user) throw new HttpError(409, 'An account with this email already exists. Try logging in instead.', 'EMAIL_TAKEN')

    await startSession(res, user.id)
    res.status(201).json({ user: publicUser(user) })
  },
})
