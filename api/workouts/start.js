import { requireUser } from '../_lib/auth.js'
import { db } from '../_lib/db.js'
import { HttpError, readBody, requireInt, route } from '../_lib/http.js'
import { findWorkout } from '../_lib/workouts.js'

// POST { workoutId } → marks a planned workout as in progress and records when it started.
export default route({
  async POST(req, res) {
    const userId = await requireUser(req)
    const workoutId = requireInt(readBody(req).workoutId, 'workoutId')
    const sql = db()

    await sql`
      UPDATE workouts SET status = 'in_progress', started_at = COALESCE(started_at, now())
      WHERE id = ${workoutId} AND user_id = ${userId} AND status = 'planned'`

    const workout = await findWorkout(sql, userId, workoutId)
    if (!workout) throw new HttpError(404, 'We couldn’t find that workout.')
    res.status(200).json({ workout })
  },
})
