import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Check, LoaderCircle, Plus, Search, SearchX, Timer, X } from 'lucide-react'
import { forwardRef, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import Page, { PageHeader } from '../components/Page'
import { Skeleton, SkeletonCard } from '../components/Skeleton'
import { useApp } from '../context/AppContext'
import { muscleGroups } from '../data/mock'
import { api, localDate, useResource } from '../lib/api'
import { difficultyLevel, muscleMeta } from '../lib/meta'

const difficultyTone = {
  Beginner: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  Intermediate: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  Advanced: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
}

function DifficultyBars({ level }) {
  return (
    <span className="flex items-end gap-0.5" aria-hidden="true">
      {[1, 2, 3].map((n) => (
        <span key={n} className={`w-1 rounded-full ${n <= level ? 'bg-current' : 'bg-current opacity-20'}`} style={{ height: 4 + n * 3 }} />
      ))}
    </span>
  )
}

const ExerciseCard = forwardRef(function ExerciseCard({ ex, added, pending, onAdd }, ref) {
  const { icon: Icon, color } = muscleMeta[ex.muscle]
  return (
    <motion.article
      ref={ref}
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      whileHover={{ y: -6 }}
      className="glass group relative flex flex-col overflow-hidden p-5 transition-shadow hover:shadow-glow"
    >
      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-60 blur-2xl transition-opacity group-hover:opacity-100" style={{ background: `${color}26` }} />
      <div className="relative flex items-start justify-between gap-3">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl ring-1 ring-inset" style={{ background: `${color}1a`, color, '--tw-ring-color': `${color}40` }}>
          <Icon className="h-6 w-6" />
        </span>
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${difficultyTone[ex.difficulty]}`}>
          <DifficultyBars level={difficultyLevel[ex.difficulty]} />
          {ex.difficulty}
        </span>
      </div>

      <h3 className="relative mt-4 text-lg font-semibold leading-tight">{ex.name}</h3>
      <p className="relative mt-1 text-xs text-muted">{ex.muscle}</p>

      <div className="relative mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl bg-fg/5 py-2">
          <p className="font-display text-lg font-bold">{ex.sets}</p>
          <p className="text-[10px] uppercase tracking-wider text-muted">Sets</p>
        </div>
        <div className="rounded-xl bg-fg/5 py-2">
          <p className="truncate px-1 font-display text-lg font-bold">{ex.reps}</p>
          <p className="text-[10px] uppercase tracking-wider text-muted">Reps</p>
        </div>
        <div className="rounded-xl bg-fg/5 py-2">
          <p className="font-display text-lg font-bold">{ex.rest}s</p>
          <p className="text-[10px] uppercase tracking-wider text-muted">Rest</p>
        </div>
      </div>

      <p className="relative mt-4 flex-1 text-sm text-muted">💡 {ex.description}</p>

      <button
        onClick={onAdd}
        disabled={added || pending}
        className={`relative mt-4 w-full ${added ? 'btn !border !border-accent/30 !bg-accent/10 !text-accent !opacity-100' : 'btn-ghost'}`}
      >
        {pending ? (
          <><LoaderCircle className="h-4 w-4 animate-spin" /> Adding…</>
        ) : added ? (
          <><Check className="h-4 w-4" /> Added to today</>
        ) : (
          <><Plus className="h-4 w-4" /> Add to today’s workout</>
        )}
      </button>
    </motion.article>
  )
})

function LibrarySkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }, (_, i) => (
        <SkeletonCard key={i}>
          <div className="flex justify-between">
            <Skeleton className="h-12 w-12 !rounded-2xl" />
            <Skeleton className="h-6 w-24 !rounded-full" />
          </div>
          <Skeleton className="mt-4 h-5 w-2/3" />
          <Skeleton className="mt-2 h-3 w-1/4" />
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[0, 1, 2].map((j) => <Skeleton key={j} className="h-14" />)}
          </div>
          <Skeleton className="mt-4 h-11 w-full !rounded-2xl" />
        </SkeletonCard>
      ))}
    </div>
  )
}

export default function Library() {
  const { toast } = useApp()
  const [muscle, setMuscle] = useState('All')
  const [query, setQuery] = useState('')
  const [added, setAdded] = useState([])
  const [pending, setPending] = useState(null)
  const list = useResource('/api/exercises')
  const today = useResource(`/api/workouts/today?date=${localDate()}`)
  const exercises = list.data?.exercises ?? []

  // Exercises already in today's open workout show as "Added".
  useEffect(() => {
    const w = today.data?.workout
    if (w && w.status !== 'completed') setAdded(w.exercises.map((e) => e.exerciseId))
  }, [today.data])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return exercises.filter(
      (e) =>
        (muscle === 'All' || e.muscle === muscle) &&
        (!q || e.name.toLowerCase().includes(q) || e.description.toLowerCase().includes(q)),
    )
  }, [exercises, muscle, query])

  const handleAdd = async (ex) => {
    setPending(ex.id)
    setAdded((a) => [...a, ex.id])
    try {
      const { workout } = await api('/api/workouts/exercises', { method: 'POST', body: { exerciseId: ex.id, date: localDate() } })
      toast({ title: 'Added to today’s workout', message: `${ex.name} joins ${workout.name} (${workout.exercises.length} total).` })
    } catch (err) {
      if (err.code === 'ALREADY_ADDED') {
        toast({ type: 'info', title: 'Already there', message: err.message })
      } else {
        setAdded((a) => a.filter((id) => id !== ex.id))
        toast({ type: 'error', title: 'Couldn’t add that exercise', message: err.message })
      }
    } finally {
      setPending(null)
    }
  }

  const reset = () => {
    setMuscle('All')
    setQuery('')
  }

  return (
    <Page>
      <PageHeader
        eyebrow="Workout library"
        title="Find your next move"
        subtitle={
          list.data
            ? `${exercises.length} coach-approved exercises with sets, reps and rest built in.`
            : 'Coach-approved exercises with sets, reps and rest built in.'
        }
        action={
          added.length > 0 && (
            <Link to="/workout" className="btn-primary self-start">
              Start today’s workout ({added.length}) <ArrowRight className="h-4 w-4" />
            </Link>
          )
        }
      />

      <div className="glass sticky top-[61px] z-20 mb-6 space-y-3 !rounded-2xl p-3 lg:top-4">
        <label className="flex items-center gap-2 rounded-xl bg-fg/5 px-3 focus-within:ring-2 focus-within:ring-accent">
          <Search className="h-4 w-4 shrink-0 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search exercises or equipment…"
            className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted"
            aria-label="Search exercises"
          />
          {query && (
            <button onClick={() => setQuery('')} className="rounded-lg p-1 text-muted hover:text-fg" aria-label="Clear search">
              <X className="h-4 w-4" />
            </button>
          )}
        </label>
        <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1" role="tablist" aria-label="Filter by muscle group">
          {['All', ...muscleGroups].map((m) => {
            const active = muscle === m
            const meta = muscleMeta[m]
            const Icon = meta?.icon
            return (
              <button
                key={m}
                role="tab"
                aria-selected={active}
                onClick={() => setMuscle(m)}
                className={`relative flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${active ? 'text-black' : 'text-muted hover:bg-fg/5 hover:text-fg'}`}
              >
                {active && (
                  <motion.span layoutId="muscle-pill" className="absolute inset-0 rounded-full bg-gradient-to-r from-volt to-aqua shadow-glow" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />
                )}
                {Icon && <Icon className="relative h-4 w-4" />}
                <span className="relative">{m}</span>
              </button>
            )
          })}
        </div>
      </div>

      <p className="mb-4 flex items-center gap-2 text-sm text-muted">
        <Timer className="h-4 w-4" /> Showing <strong className="text-fg">{filtered.length}</strong> {filtered.length === 1 ? 'exercise' : 'exercises'}
        {muscle !== 'All' && <> for <strong className="text-fg">{muscle}</strong></>}
      </p>

      {list.loading && !list.data ? (
        <LibrarySkeleton />
      ) : list.error ? (
        <ErrorState error={list.error} onRetry={list.reload} />
      ) : exercises.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="The library is empty"
          message="No exercises in the database yet. Run “npm run db:setup” to load the starter set."
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No exercises found"
          message={`Nothing matches “${query}”${muscle !== 'All' ? ` in ${muscle}` : ''}. Try a different word or clear the filters.`}
          action={<button onClick={reset} className="btn-primary">Clear filters</button>}
        />
      ) : (
        <motion.div layout className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((ex) => (
              <ExerciseCard key={ex.id} ex={ex} added={added.includes(ex.id)} pending={pending === ex.id} onAdd={() => handleAdd(ex)} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </Page>
  )
}
