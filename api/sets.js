import { requireUser } from './_lib/auth.js'
import { db } from './_lib/db.js'
import { HttpError, readBody, requireInt, route } from './_lib/http.js'

// PATCH { setId, completed } → ticks or unticks a set in one of the user's own, unfinished workouts.
export default route({
  async PATCH(req, res) {
    const userId = await requireUser(req)
    const body = readBody(req)
    const setId = requireInt(body.setId, 'setId')
    if (typeof body.completed !== 'boolean') throw new HttpError(400, 'completed must be true or false.')
    const sql = db()

    const [row] = await sql`
      UPDATE workout_sets ws
      SET completed = ${body.completed}::boolean,
          completed_at = CASE WHEN ${body.completed}::boolean THEN now() ELSE NULL END
      FROM workout_exercises we, workouts w
      WHERE ws.id = ${setId}
        AND we.id = ws.workout_exercise_id
        AND w.id = we.workout_id
        AND w.user_id = ${userId}
        AND w.status <> 'completed'
      RETURNING ws.id, ws.completed, w.id AS workout_id`
    if (!row) throw new HttpError(404, 'That set can’t be changed. The workout may already be finished.')

    await sql`
      UPDATE workouts SET status = 'in_progress', started_at = COALESCE(started_at, now())
      WHERE id = ${row.workout_id} AND status = 'planned'`

    res.status(200).json({ set: { id: row.id, completed: row.completed } })
  },
})
