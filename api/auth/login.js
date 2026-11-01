import bcrypt from 'bcryptjs'
import { publicUser, startSession } from '../_lib/auth.js'
import { db } from '../_lib/db.js'
import { HttpError, readBody, route } from '../_lib/http.js'

// Compared against when the email doesn't exist, so response time doesn't reveal accounts.
const DUMMY_HASH = bcrypt.hashSync('pulsefit-no-such-user', 10)

export default route({
  async POST(req, res) {
    const { email, password } = readBody(req)
    const mail = String(email ?? '').trim().toLowerCase()
    if (!mail || typeof password !== 'string' || !password) {
      throw new HttpError(400, 'Please enter your email and password.')
    }

    const sql = db()
    const [user] = await sql`
      SELECT id, email, password_hash, full_name, weekly_goal_workouts, weekly_goal_minutes, created_at
      FROM users WHERE email = ${mail}`
    const ok = await bcrypt.compare(password, user?.password_hash ?? DUMMY_HASH)
    if (!user || !ok) throw new HttpError(401, 'That email and password don’t match. Please try again.', 'BAD_CREDENTIALS')

    await startSession(res, user.id)
    res.status(200).json({ user: publicUser(user) })
  },
})
