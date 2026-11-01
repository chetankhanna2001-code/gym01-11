import { requireUser } from '../_lib/auth.js'
import { db } from '../_lib/db.js'
import { clientDate, route } from '../_lib/http.js'
import { findTodayWorkout } from '../_lib/workouts.js'

export default route({
  async GET(req, res) {
    const userId = await requireUser(req)
    const workout = await findTodayWorkout(db(), userId, clientDate(req))
    res.status(200).json({ workout })
  },
})
