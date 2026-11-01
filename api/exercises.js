import { requireUser } from './_lib/auth.js'
import { db } from './_lib/db.js'
import { HttpError, route } from './_lib/http.js'

const MUSCLES = ['Chest', 'Back', 'Legs', 'Arms', 'Core', 'Cardio']

export default route({
  async GET(req, res) {
    await requireUser(req)
    const muscle = req.query?.muscle
    if (muscle && !MUSCLES.includes(muscle)) throw new HttpError(400, `Muscle group must be one of: ${MUSCLES.join(', ')}.`)

    const sql = db()
    const rows = muscle
      ? await sql`SELECT * FROM exercises WHERE muscle_group = ${muscle} ORDER BY id`
      : await sql`SELECT * FROM exercises ORDER BY id`

    res.status(200).json({
      exercises: rows.map((e) => ({
        id: e.id,
        name: e.name,
        muscle: e.muscle_group,
        sets: e.sets,
        reps: e.reps,
        difficulty: e.difficulty,
        rest: e.rest_seconds,
        description: e.description,
      })),
    })
  },
})
