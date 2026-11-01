import confetti from 'canvas-confetti'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, CircleCheck, Clock, Dumbbell, Flame, Library, LoaderCircle, Minus, Pause, Play, Plus, SkipForward, Trophy } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import Page from '../components/Page'
import { Skeleton, SkeletonCard } from '../components/Skeleton'
import { useApp } from '../context/AppContext'
import { api, localDate } from '../lib/api'
import { formatTime, muscleMeta } from '../lib/meta'

function celebrate() {
  const colors = ['#C6FF3D', '#22E1FF', '#ffffff', '#A78BFA']
  const opts = { colors, disableForReducedMotion: true, zIndex: 80 }
  confetti({ ...opts, particleCount: 160, spread: 100, startVelocity: 45, origin: { y: 0.6 } })
  const end = Date.now() + 1600
  ;(function frame() {
    confetti({ ...opts, particleCount: 4, angle: 60, spread: 60, origin: { x: 0, y: 0.75 } })
    confetti({ ...opts, particleCount: 4, angle: 120, spread: 60, origin: { x: 1, y: 0.75 } })
    if (Date.now() < end) requestAnimationFrame(frame)
  })()
}

function RestTimer({ rest, setRest, idleRest, nextLabel, onSkip }) {
  const size = 300
  const stroke = 16
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const resting = rest.total > 0 && rest.remaining > 0
  const pct = resting ? rest.remaining / rest.total : 1

  const adjust = (delta) =>
    setRest((s) => {
      if (!s.total) return s
      const remaining = Math.max(0, s.remaining + delta)
      return { ...s, remaining, total: Math.max(s.total, remaining) }
    })

  return (
    <div className="glass relative overflow-hidden p-6 lg:sticky lg:top-6">
      <div className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ${resting ? 'opacity-100' : 'opacity-40'}`}>
        <div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-accent2/20 blur-3xl" />
      </div>

      <p className="eyebrow relative text-center">{resting ? 'Rest timer' : 'Ready'}</p>
      <div className="relative mx-auto mt-4 aspect-square w-full max-w-[300px]">
        <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full -rotate-90" aria-hidden="true">
          <defs>
            <linearGradient id="timer-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#C6FF3D" />
              <stop offset="100%" stopColor="#22E1FF" />
            </linearGradient>
          </defs>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className="stroke-fg/[0.07]" />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="url(#timer-grad)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={c}
            initial={{ strokeDashoffset: 0 }}
            animate={{ strokeDashoffset: c * (1 - pct) }}
            transition={{ duration: rest.running ? 1 : 0.5, ease: 'linear' }}
            style={{ filter: 'drop-shadow(0 0 10px rgba(198,255,61,0.45))' }}
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center text-center" role="timer" aria-live="off">
          <div>
            <AnimatePresence mode="wait">
              <motion.p
                key={resting ? 'rest' : 'go'}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="font-display text-6xl font-bold tabular-nums sm:text-7xl"
              >
                {resting ? formatTime(rest.remaining) : 'GO'}
              </motion.p>
            </AnimatePresence>
            <p className="mt-2 max-w-[180px] text-sm text-muted">{resting ? (rest.running ? 'Breathe. Hydrate.' : 'Paused') : nextLabel}</p>
          </div>
        </div>
      </div>

      <div className="relative mt-6 flex items-center justify-center gap-3">
        <button onClick={() => adjust(-15)} disabled={!resting} className="btn-ghost !h-12 !w-12 !rounded-full !p-0" aria-label="Remove 15 seconds">
          <Minus className="h-5 w-5" />
        </button>
        <button
          onClick={() =>
            resting
              ? setRest((s) => ({ ...s, running: !s.running }))
              : idleRest > 0 && setRest({ total: idleRest, remaining: idleRest, running: true })
          }
          className="btn-primary !h-16 !w-16 !rounded-full !p-0"
          aria-label={resting && rest.running ? 'Pause timer' : 'Start rest timer'}
        >
          {resting && rest.running ? <Pause className="h-7 w-7 fill-current" /> : <Play className="ml-1 h-7 w-7 fill-current" />}
        </button>
        <button onClick={() => adjust(15)} disabled={!resting} className="btn-ghost !h-12 !w-12 !rounded-full !p-0" aria-label="Add 15 seconds">
          <Plus className="h-5 w-5" />
        </button>
        <button onClick={onSkip} disabled={!resting} className="btn-ghost !h-12 !w-12 !rounded-full !p-0" aria-label="Skip rest">
          <SkipForward className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}

function CompleteModal({ workout, streak }) {
  const stats = [
    { icon: Clock, label: 'Minutes', value: workout.durationMinutes ?? '—' },
    { icon: Dumbbell, label: 'Sets', value: `${workout.completedSets}/${workout.totalSets}` },
    { icon: Flame, label: 'Calories', value: `~${workout.estCalories}` },
  ]
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] grid place-items-center bg-black/60 p-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="complete-title"
    >
      <motion.div
        initial={{ scale: 0.85, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22, delay: 0.1 }}
        className="glass relative w-full max-w-md overflow-hidden p-8 text-center"
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-accent/15 to-transparent" />
        <motion.div
          initial={{ rotate: -20, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 12, delay: 0.25 }}
          className="relative mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-volt to-aqua shadow-glow"
        >
          <Trophy className="h-10 w-10 text-black" />
        </motion.div>
        <h2 id="complete-title" className="relative mt-6 text-3xl font-bold">Workout complete!</h2>
        <p className="relative mt-2 text-muted">
          You crushed <strong className="text-fg">{workout.name}</strong>.
          {streak > 0 && (
            <> Streak is now <strong className="whitespace-nowrap text-orange-400">{streak} {streak === 1 ? 'day' : 'days'} 🔥</strong></>
          )}
        </p>
        <div className="relative mt-6 grid grid-cols-3 gap-2">
          {stats.map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-2xl bg-fg/5 py-3">
              <Icon className="mx-auto h-4 w-4 text-accent" />
              <p className="mt-1 font-display text-lg font-bold">{value}</p>
              <p className="text-[10px] uppercase tracking-wider text-muted">{label}</p>
            </div>
          ))}
        </div>
        <div className="relative mt-6 flex flex-col gap-2 sm:flex-row">
          <Link to="/dashboard" className="btn-primary flex-1">Back to dashboard</Link>
          <Link to="/library" className="btn-ghost flex-1">
            <Library className="h-4 w-4" /> Plan another
          </Link>
        </div>
      </motion.div>
    </motion.div>
  )
}

function Session({ workout, onCompleted }) {
  const { toast, refreshUser, userStats } = useApp()
  const { exercises } = workout
  const totalSets = workout.totalSets
  const [done, setDone] = useState(() => exercises.map((ex) => ex.sets.map((s) => s.completed)))
  const [active, setActive] = useState(() => Math.max(0, exercises.findIndex((ex) => ex.sets.some((s) => !s.completed))))
  const [rest, setRest] = useState({ total: 0, remaining: 0, running: false })
  const [elapsed, setElapsed] = useState(0)
  const [saving, setSaving] = useState(false)
  const [finished, setFinished] = useState(null)
  const wasResting = useRef(false)
  const inFlight = useRef(new Set())
  const startedAt = useRef(workout.startedAt ? new Date(workout.startedAt).getTime() : Date.now())

  const doneCount = done.flat().filter(Boolean).length
  const pct = totalSets ? Math.round((doneCount / totalSets) * 100) : 0

  // Workout clock, based on the saved start time so it survives a refresh.
  useEffect(() => {
    if (finished) return
    const tick = () => setElapsed(Math.max(0, Math.floor((Date.now() - startedAt.current) / 1000)))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [finished])

  // Rest countdown
  useEffect(() => {
    if (!rest.running) return
    const id = setInterval(() => {
      setRest((s) => (s.remaining <= 1 ? { ...s, remaining: 0, running: false } : { ...s, remaining: s.remaining - 1 }))
    }, 1000)
    return () => clearInterval(id)
  }, [rest.running])

  // Notify when rest ends naturally
  useEffect(() => {
    if (rest.running) {
      wasResting.current = true
    } else if (wasResting.current && rest.remaining === 0) {
      wasResting.current = false
      toast({ type: 'info', title: 'Rest is over', message: 'Time for your next set. You’ve got this 💪' })
      navigator.vibrate?.(200)
    }
  }, [rest, toast])

  const skipRest = useCallback(() => {
    wasResting.current = false
    setRest({ total: 0, remaining: 0, running: false })
  }, [])

  const finish = async () => {
    if (saving || finished) return
    skipRest()
    setSaving(true)
    try {
      await Promise.allSettled([...inFlight.current])
      let result
      try {
        result = await api('/api/workouts/complete', { method: 'POST', body: { workoutId: workout.id } })
      } catch (err) {
        if (err.code !== 'ALREADY_COMPLETED') throw err
        result = await api(`/api/workouts/today?date=${localDate()}`)
      }
      setFinished(result.workout)
      celebrate()
      refreshUser()
      onCompleted?.(result.workout)
    } catch (err) {
      toast({ type: 'error', title: 'Couldn’t save your workout', message: `${err.message} Your sets are still saved, so tap Finish to try again.` })
    } finally {
      setSaving(false)
    }
  }

  const saveSet = (exIdx, setIdx, completed) => {
    const setId = exercises[exIdx].sets[setIdx].id
    const req = api('/api/sets', { method: 'PATCH', body: { setId, completed } })
      .catch((err) => {
        setDone((d) => d.map((sets, i) => (i === exIdx ? sets.map((v, j) => (j === setIdx ? !completed : v)) : sets)))
        toast({ type: 'error', title: 'Set not saved', message: err.message })
      })
      .finally(() => inFlight.current.delete(req))
    inFlight.current.add(req)
  }

  const toggleSet = (exIdx, setIdx) => {
    if (finished || saving) return
    const next = done.map((sets, i) => (i === exIdx ? sets.map((v, j) => (j === setIdx ? !v : v)) : sets))
    const completed = next[exIdx][setIdx]
    setDone(next) // optimistic
    setActive(exIdx)
    saveSet(exIdx, setIdx, completed)
    if (!completed) return

    if (next.every((sets) => sets.every(Boolean))) return finish()

    const ex = exercises[exIdx]
    if (ex.rest > 0) setRest({ total: ex.rest, remaining: ex.rest, running: true })
    if (next[exIdx].every(Boolean)) {
      const upcoming = next.findIndex((sets) => !sets.every(Boolean))
      setActive(upcoming)
      toast({ title: `${ex.name} done!`, message: `Up next: ${exercises[upcoming].name}` })
    }
  }

  const nextIdx = done[active]?.findIndex((v) => !v)
  const nextLabel = nextIdx >= 0 ? `Next: ${exercises[active].name}, set ${nextIdx + 1}` : 'Tick off a set to start resting'

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow mb-2 flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-rose-500" /> Live workout
          </p>
          <h1 className="text-3xl font-bold sm:text-4xl">{workout.name}</h1>
          <p className="mt-1 text-sm text-muted">{workout.focus} · {totalSets} sets</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="chip !px-4 !py-2 !text-sm tabular-nums">
            <Clock className="h-4 w-4 text-accent2" /> {formatTime(elapsed)}
          </span>
          <button onClick={finish} disabled={saving || !!finished} className="btn-ghost !py-2">
            {saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} {saving ? 'Saving…' : 'Finish now'}
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="mb-2 flex justify-between text-xs font-semibold">
          <span className="text-muted">{doneCount} of {totalSets} sets</span>
          <span className="text-accent">{pct}%</span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-fg/[0.07]">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-volt to-aqua shadow-glow"
            animate={{ width: `${pct}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          />
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-start">
        <RestTimer rest={rest} setRest={setRest} idleRest={exercises[active]?.rest ?? 60} nextLabel={nextLabel} onSkip={skipRest} />

        <div className="space-y-3">
          {exercises.map((ex, exIdx) => {
            const sets = done[exIdx]
            const exDone = sets.every(Boolean)
            const isActive = exIdx === active && !exDone
            const { icon: Icon, color } = muscleMeta[ex.muscle]
            return (
              <motion.div
                key={ex.id}
                layout
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: exIdx * 0.05 }}
                className={`glass !rounded-2xl p-4 transition-all ${isActive ? '!border-accent/40 shadow-glow' : ''} ${exDone ? 'opacity-60' : ''}`}
              >
                <button onClick={() => setActive(exIdx)} className="flex w-full items-center gap-3 text-left">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl" style={{ background: `${color}1f`, color }}>
                    {exDone ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className={`truncate font-semibold ${exDone ? 'line-through decoration-accent/60' : ''}`}>{ex.name}</p>
                    <p className="text-xs text-muted">
                      {ex.sets.length} × {ex.reps} · {ex.rest}s rest
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-muted">
                    {sets.filter(Boolean).length}/{ex.sets.length}
                  </span>
                </button>
                <div className="mt-4 flex flex-wrap gap-2">
                  {sets.map((isDone, setIdx) => (
                    <motion.button
                      key={ex.sets[setIdx].id}
                      whileTap={{ scale: 0.88 }}
                      onClick={() => toggleSet(exIdx, setIdx)}
                      className={`flex h-12 min-w-[3.5rem] flex-1 items-center justify-center gap-1.5 rounded-xl border text-sm font-semibold transition-colors sm:flex-none sm:px-4 ${
                        isDone
                          ? 'border-transparent bg-gradient-to-br from-volt to-aqua text-black shadow-glow'
                          : 'border-fg/10 bg-fg/5 text-fg hover:border-accent/40 hover:bg-accent/10'
                      }`}
                      aria-pressed={isDone}
                      aria-label={`${ex.name} set ${setIdx + 1}${isDone ? ' done' : ''}`}
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        {isDone ? (
                          <motion.span key="c" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }}>
                            <Check className="h-4 w-4" strokeWidth={3} />
                          </motion.span>
                        ) : (
                          <motion.span key="n" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                            Set {setIdx + 1}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      <AnimatePresence>{finished && <CompleteModal workout={finished} streak={userStats?.streak ?? 0} />}</AnimatePresence>
    </>
  )
}

function SessionSkeleton() {
  return (
    <>
      <Skeleton className="mb-3 h-4 w-28" />
      <Skeleton className="mb-8 h-10 w-72 max-w-full" />
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <SkeletonCard>
          <Skeleton className="mx-auto aspect-square w-full max-w-[300px] !rounded-full" />
        </SkeletonCard>
        <div className="space-y-3">
          {[0, 1, 2, 3].map((i) => <SkeletonCard key={i} lines={1} className="!rounded-2xl" />)}
        </div>
      </div>
    </>
  )
}

export default function LiveWorkout() {
  const [state, setState] = useState({ loading: true, error: null, workout: null })
  const [justCompleted, setJustCompleted] = useState(false)

  const load = useCallback(async () => {
    setState({ loading: true, error: null, workout: null })
    try {
      let { workout } = await api(`/api/workouts/today?date=${localDate()}`)
      if (workout?.status === 'planned' && workout.exercises.length > 0) {
        ;({ workout } = await api('/api/workouts/start', { method: 'POST', body: { workoutId: workout.id } }))
      }
      setState({ loading: false, error: null, workout })
    } catch (error) {
      setState({ loading: false, error, workout: null })
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const { loading, error, workout } = state

  let content
  if (loading) content = <SessionSkeleton />
  else if (error) content = <ErrorState error={error} onRetry={load} />
  else if (!workout || workout.exercises.length === 0) {
    content = (
      <EmptyState
        icon={Dumbbell}
        title="No workout yet today"
        message="Pick one from the Library! Add a few exercises and come back here to train."
        action={<Link to="/library" className="btn-primary"><Library className="h-4 w-4" /> Open the Library</Link>}
      />
    )
  } else if (workout.status === 'completed' && !justCompleted) {
    content = (
      <EmptyState
        icon={CircleCheck}
        title="Today’s workout is done 🎉"
        message={`You finished ${workout.name} in ${workout.durationMinutes} min. Rest up, or add more exercises to train again.`}
        action={
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link to="/dashboard" className="btn-primary">See your dashboard</Link>
            <Link to="/library" className="btn-ghost"><Library className="h-4 w-4" /> Plan another</Link>
          </div>
        }
      />
    )
  } else {
    content = <Session workout={workout} onCompleted={() => setJustCompleted(true)} />
  }

  return <Page>{content}</Page>
}
