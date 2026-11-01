import { requireUser } from '../_lib/auth.js'
import { db } from '../_lib/db.js'
import { clientDate, HttpError, readBody, requireInt, route } from '../_lib/http.js'
import { findWorkout, workoutName } from '../_lib/workouts.js'

// POST { exerciseId, date } → adds an exercise (with its sets) to today's open workout, creating it if needed.
export default route({
  async POST(req, res) {
    const userId = await requireUser(req)
    const exerciseId = requireInt(readBody(req).exerciseId, 'exerciseId')
    const date = clientDate(req)
    const sql = db()

    const [exercise] = await sql`SELECT id, name, sets FROM exercises WHERE id = ${exerciseId}`
    if (!exercise) throw new HttpError(404, 'That exercise doesn’t exist anymore.')

    let [workout] = await sql`
      SELECT id FROM workouts
      WHERE user_id = ${userId} AND workout_date = ${date} AND status <> 'completed'
      ORDER BY id DESC LIMIT 1`
    if (!workout) {
      ;[workout] = await sql`
        INSERT INTO workouts (user_id, name, workout_date, status)
        VALUES (${userId}, ${'Today’s Workout'}, ${date}, 'planned')
        RETURNING id`
    }

    const [link] = await sql`
      INSERT INTO workout_exercises (workout_id, exercise_id, order_index)
      SELECT ${workout.id}, ${exercise.id}, COALESCE(MAX(order_index) + 1, 0)
      FROM workout_exercises WHERE workout_id = ${workout.id}
      ON CONFLICT (workout_id, exercise_id) DO NOTHING
      RETURNING id`
    if (!link) throw new HttpError(409, `${exercise.name} is already in today’s workout.`, 'ALREADY_ADDED')

    await sql`
      INSERT INTO workout_sets (workout_exercise_id, set_number)
      SELECT ${link.id}, n FROM generate_series(1, ${exercise.sets}::int) AS n`

    const muscles = await sql`
      SELECT e.muscle_group FROM workout_exercises we JOIN exercises e ON e.id = we.exercise_id
      WHERE we.workout_id = ${workout.id} ORDER BY we.order_index`
    await sql`UPDATE workouts SET name = ${workoutName(muscles.map((m) => m.muscle_group))} WHERE id = ${workout.id}`

    res.status(201).json({ workout: await findWorkout(sql, userId, workout.id) })
  },
})
