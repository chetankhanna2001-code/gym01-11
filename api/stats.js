import { db } from './_lib/db.js'
import { route } from './_lib/http.js'

// Public community stats for the landing page.
export default route({
  async GET(req, res) {
    const sql = db()
    const [row] = await sql`
      SELECT (SELECT count(*) FROM users)::int                                   AS members,
             (SELECT count(*) FROM workouts WHERE status = 'completed')::int     AS workouts,
             (SELECT count(*) FROM classes
               WHERE start_time >= date_trunc('week', now())
                 AND start_time <  date_trunc('week', now()) + interval '7 days')::int AS classes`
    res.status(200).json(row)
  },
})
