import { requireUser } from '../_lib/auth.js'
import { db } from '../_lib/db.js'
import { HttpError, readBody, requireInt, route } from '../_lib/http.js'
import { findWorkout } from '../_lib/workouts.js'

// POST { workoutId } → marks the workout completed and saves its duration (at least 1 minute).
export default route({
  async POST(req, res) {
    const userId = await requireUser(req)
    const workoutId = requireInt(readBody(req).workoutId, 'workoutId')
    const sql = db()

    const [updated] = await sql`
      UPDATE workouts
      SET status = 'completed',
          started_at = COALESCE(started_at, now()),
          completed_at = now(),
          duration_minutes = GREATEST(1, ROUND(EXTRACT(EPOCH FROM (now() - COALESCE(started_at, now()))) / 60))::int
      WHERE id = ${workoutId} AND user_id = ${userId} AND status <> 'completed'
      RETURNING id`

    const workout = await findWorkout(sql, userId, workoutId)
    if (!workout) throw new HttpError(404, 'We couldn’t find that workout.')
    if (!updated) throw new HttpError(409, 'This workout is already completed.', 'ALREADY_COMPLETED')
    res.status(200).json({ workout })
  },
})
