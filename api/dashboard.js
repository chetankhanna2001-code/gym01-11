import { requireUser } from './_lib/auth.js'
import { db } from './_lib/db.js'
import { addDays, clientDate, HttpError, mondayOf, route, weekdayShort } from './_lib/http.js'
import { estimateCalories, findTodayWorkout, streakFor } from './_lib/workouts.js'

export default route({
  async GET(req, res) {
    const userId = await requireUser(req)
    const today = clientDate(req)
    const weekStart = mondayOf(today)
    const last7Start = addDays(today, -6)
    const from = weekStart < last7Start ? weekStart : last7Start
    const sql = db()

    const [user] = await sql`
      SELECT full_name, weekly_goal_workouts, weekly_goal_minutes FROM users WHERE id = ${userId}`
    if (!user) throw new HttpError(401, 'Please log in to continue.', 'UNAUTHENTICATED')

    const [daily, todayWorkout, streak] = await Promise.all([
      sql`
        SELECT workout_date::text AS d,
               COALESCE(SUM(duration_minutes), 0)::int AS minutes,
               COUNT(*)::int AS workouts
        FROM workouts
        WHERE user_id = ${userId} AND status = 'completed'
          AND workout_date BETWEEN ${from} AND ${today}
        GROUP BY workout_date`,
      findTodayWorkout(sql, userId, today),
      streakFor(sql, userId, today),
    ])
    const byDay = new Map(daily.map((r) => [r.d, r]))

    const activity = Array.from({ length: 7 }, (_, i) => {
      const d = addDays(last7Start, i)
      const minutes = byDay.get(d)?.minutes ?? 0
      return { date: d, day: weekdayShort(d), minutes, calories: estimateCalories(minutes), isToday: d === today }
    })

    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
    const week = weekDays.reduce(
      (acc, d) => ({ workouts: acc.workouts + (byDay.get(d)?.workouts ?? 0), minutes: acc.minutes + (byDay.get(d)?.minutes ?? 0) }),
      { workouts: 0, minutes: 0 },
    )
    const goalsHit = Number(week.workouts >= user.weekly_goal_workouts) + Number(week.minutes >= user.weekly_goal_minutes)

    res.status(200).json({
      firstName: user.full_name.trim().split(/\s+/)[0],
      today: todayWorkout,
      activity,
      streak: {
        current: streak.current,
        best: streak.best,
        doneToday: streak.doneToday,
        week: weekDays.map((d) => ({ date: d, active: streak.days.has(d), isToday: d === today })),
      },
      rings: {
        workouts: { value: week.workouts, goal: user.weekly_goal_workouts },
        minutes: { value: week.minutes, goal: user.weekly_goal_minutes },
        goalsHit: { value: goalsHit, goal: 2 },
      },
    })
  },
})
