import { endSession, publicUser, sessionUserId } from '../_lib/auth.js'
import { db } from '../_lib/db.js'
import { clientDate, route } from '../_lib/http.js'
import { streakFor } from '../_lib/workouts.js'

export default route({
  async GET(req, res) {
    const userId = await sessionUserId(req)
    if (!userId) return res.status(200).json({ user: null })

    const sql = db()
    const [user] = await sql`
      SELECT id, email, full_name, weekly_goal_workouts, weekly_goal_minutes, created_at,
             (SELECT count(*) FROM workouts WHERE user_id = users.id AND status = 'completed')::int AS total_workouts
      FROM users WHERE id = ${userId}`
    if (!user) {
      endSession(res)
      return res.status(200).json({ user: null })
    }

    const streak = await streakFor(sql, userId, clientDate(req))
    res.status(200).json({
      user: publicUser(user),
      stats: { streak: streak.current, bestStreak: streak.best, totalWorkouts: user.total_workouts },
    })
  },
})
