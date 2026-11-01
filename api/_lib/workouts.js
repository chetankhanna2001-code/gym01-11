// Workout queries shared by several routes. Every query is scoped by user_id.
import { addDays } from './http.js'

const WORK_SECONDS_PER_SET = 45
const KCAL_PER_MINUTE = 8

export const estimateCalories = (minutes) => Math.round(minutes * KCAL_PER_MINUTE)

export function workoutName(muscles) {
  const unique = [...new Set(muscles)]
  if (unique.length === 0) return 'Today’s Workout'
  if (unique.length === 1) return `${unique[0]} Workout`
  if (unique.length === 2) return `${unique[0]} & ${unique[1]}`
  return 'Full Body Workout'
}

/** Today's workout: the open one if there is one, else the latest completed one. */
export async function findTodayWorkout(sql, userId, date) {
  const [w] = await sql`
    SELECT id, name, status, workout_date::text AS date, duration_minutes, started_at, completed_at
    FROM workouts
    WHERE user_id = ${userId} AND workout_date = ${date}
    ORDER BY (status = 'completed'), id DESC
    LIMIT 1`
  return w ? withDetail(sql, w) : null
}

export async function findWorkout(sql, userId, workoutId) {
  const [w] = await sql`
    SELECT id, name, status, workout_date::text AS date, duration_minutes, started_at, completed_at
    FROM workouts
    WHERE id = ${workoutId} AND user_id = ${userId}`
  return w ? withDetail(sql, w) : null
}

async function withDetail(sql, w) {
  const rows = await sql`
    SELECT we.id AS we_id, e.id AS exercise_id, e.name, e.muscle_group, e.reps, e.difficulty,
           e.rest_seconds, e.description, ws.id AS set_id, ws.set_number, ws.completed
    FROM workout_exercises we
    JOIN exercises e ON e.id = we.exercise_id
    LEFT JOIN workout_sets ws ON ws.workout_exercise_id = we.id
    WHERE we.workout_id = ${w.id}
    ORDER BY we.order_index, we.id, ws.set_number`

  const byId = new Map()
  for (const r of rows) {
    if (!byId.has(r.we_id)) {
      byId.set(r.we_id, {
        id: r.we_id,
        exerciseId: r.exercise_id,
        name: r.name,
        muscle: r.muscle_group,
        reps: r.reps,
        difficulty: r.difficulty,
        rest: r.rest_seconds,
        description: r.description,
        sets: [],
      })
    }
    if (r.set_id) byId.get(r.we_id).sets.push({ id: r.set_id, number: r.set_number, completed: r.completed })
  }
  const exercises = [...byId.values()]
  const totalSets = exercises.reduce((n, e) => n + e.sets.length, 0)
  const estMinutes = Math.max(
    1,
    Math.round(exercises.reduce((s, e) => s + e.sets.length * (WORK_SECONDS_PER_SET + e.rest), 0) / 60),
  )
  const levels = { Beginner: 1, Intermediate: 2, Advanced: 3 }
  const hardest = exercises.reduce((top, e) => (levels[e.difficulty] > levels[top] ? e.difficulty : top), 'Beginner')

  return {
    id: w.id,
    name: w.name,
    status: w.status,
    date: w.date,
    durationMinutes: w.duration_minutes,
    startedAt: w.started_at,
    completedAt: w.completed_at,
    focus: [...new Set(exercises.map((e) => e.muscle))].join(' · '),
    difficulty: exercises.length ? hardest : null,
    estMinutes,
    estCalories: estimateCalories(w.duration_minutes ?? estMinutes),
    totalSets,
    completedSets: exercises.reduce((n, e) => n + e.sets.filter((s) => s.completed).length, 0),
    exercises,
  }
}

/** Current and best streak of consecutive days with a completed workout. */
export async function streakFor(sql, userId, today) {
  const rows = await sql`
    SELECT DISTINCT workout_date::text AS d
    FROM workouts
    WHERE user_id = ${userId} AND status = 'completed' AND workout_date <= ${today}
    ORDER BY d`
  const days = new Set(rows.map((r) => r.d))

  let best = 0
  let run = 0
  let prev = null
  for (const { d } of rows) {
    run = prev && addDays(prev, 1) === d ? run + 1 : 1
    best = Math.max(best, run)
    prev = d
  }

  // A streak stays alive until the end of today, so start from yesterday if today isn't done yet.
  let cursor = days.has(today) ? today : addDays(today, -1)
  let current = 0
  while (days.has(cursor)) {
    current += 1
    cursor = addDays(cursor, -1)
  }
  return { current, best, days, doneToday: days.has(today) }
}
