import { motion } from 'framer-motion'
import { ArrowRight, CalendarDays, CalendarPlus, CircleCheck, Clock, Dumbbell, Flame, Library, Play, Target, Timer } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import AnimatedCounter from '../components/AnimatedCounter'
import ChartTooltip from '../components/ChartTooltip'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import GlassCard from '../components/GlassCard'
import Page from '../components/Page'
import ProgressRing from '../components/ProgressRing'
import QuoteCard from '../components/QuoteCard'
import { Skeleton, SkeletonCard } from '../components/Skeleton'
import { useApp, useChartColors } from '../context/AppContext'
import { findClass } from '../data/mock'
import { localDate, useResource } from '../lib/api'
import { classMeta, to12h } from '../lib/meta'

const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

function TodayWorkout({ workout }) {
  if (!workout || workout.exercises.length === 0) {
    return (
      <GlassCard className="overflow-hidden lg:col-span-2">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-accent/15 blur-3xl" />
        <span className="chip relative !border-accent/30 !bg-accent/10 !text-accent">Today’s workout</span>
        <div className="relative mt-4">
          <EmptyState
            compact
            icon={Dumbbell}
            title="No workout yet today"
            message="Pick a few exercises from the Library and they’ll show up right here."
            action={<Link to="/library" className="btn-primary"><Library className="h-4 w-4" /> Open the Library</Link>}
          />
        </div>
      </GlassCard>
    )
  }

  const done = workout.status === 'completed'
  const inProgress = workout.status === 'in_progress'
  return (
    <GlassCard className="overflow-hidden lg:col-span-2">
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-accent/15 blur-3xl" />
      <Dumbbell className="pointer-events-none absolute -bottom-6 right-4 h-40 w-40 rotate-[-20deg] text-fg/[0.04]" />
      <div className="relative">
        <div className="flex flex-wrap items-center gap-2">
          <span className="chip !border-accent/30 !bg-accent/10 !text-accent">Today’s workout</span>
          {workout.difficulty && <span className="chip">{workout.difficulty}</span>}
          {done && <span className="chip !border-accent/30 !text-accent"><CircleCheck className="h-3.5 w-3.5" /> Completed</span>}
          {inProgress && <span className="chip !border-orange-400/30 !text-orange-400">In progress · {workout.completedSets}/{workout.totalSets} sets</span>}
        </div>
        <h2 className="mt-4 text-3xl font-bold sm:text-4xl">{workout.name}</h2>
        <p className="mt-1 text-muted">{workout.focus}</p>

        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <span className="flex items-center gap-2"><Timer className="h-4 w-4 text-accent2" /> {done ? `${workout.durationMinutes} min` : `~${workout.estMinutes} min`}</span>
          <span className="flex items-center gap-2"><Flame className="h-4 w-4 text-orange-400" /> ~{workout.estCalories} kcal</span>
          <span className="flex items-center gap-2"><Dumbbell className="h-4 w-4 text-accent" /> {workout.exercises.length} {workout.exercises.length === 1 ? 'exercise' : 'exercises'}</span>
        </div>

        <div className="no-scrollbar -mx-1 mt-5 flex gap-2 overflow-x-auto px-1">
          {workout.exercises.map((e) => (
            <span key={e.id} className="shrink-0 rounded-xl border border-fg/10 bg-fg/5 px-3 py-2 text-xs">
              <span className="font-semibold">{e.name}</span>
              <span className="ml-2 text-muted">{e.sets.length}×{e.reps}</span>
            </span>
          ))}
        </div>

        {done ? (
          <Link to="/library" className="btn-ghost mt-6 w-full !py-4 text-base sm:w-auto sm:!px-8">
            <Library className="h-5 w-5" /> Plan another workout
          </Link>
        ) : (
          <Link to="/workout" className="btn-primary mt-6 w-full !py-4 text-base sm:w-auto sm:!px-8">
            <Play className="h-5 w-5 fill-current" /> {inProgress ? 'Resume' : 'Start'}
          </Link>
        )}
      </div>
    </GlassCard>
  )
}

function StreakCard({ streak }) {
  const toBeat = streak.best - streak.current + 1
  return (
    <GlassCard delay={0.08} className="overflow-hidden">
      <div className="pointer-events-none absolute -left-10 -top-10 h-48 w-48 rounded-full bg-orange-500/20 blur-3xl" />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="eyebrow !text-orange-400">Streak</p>
          <p className="mt-3 font-display text-6xl font-bold leading-none">
            <AnimatedCounter value={streak.current} />
          </p>
          <p className="mt-1 text-sm text-muted">{streak.current === 1 ? 'day in a row' : 'days in a row'}</p>
        </div>
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-orange-500/40 blur-xl" />
          <Flame className="relative h-16 w-16 animate-flicker fill-orange-500/30 text-orange-400" />
        </div>
      </div>
      <div className="relative mt-6 flex justify-between">
        {streak.week.map(({ date, active, isToday }, i) => (
          <div key={date} className="flex flex-col items-center gap-1.5">
            <motion.span
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.06, type: 'spring', stiffness: 400 }}
              className={`grid h-8 w-8 place-items-center rounded-full text-xs ${active ? 'bg-gradient-to-br from-orange-400 to-rose-500 text-white shadow-[0_0_16px_-2px_rgba(251,146,60,0.7)]' : 'bg-fg/5 text-muted'} ${isToday ? 'ring-2 ring-orange-400/60 ring-offset-2 ring-offset-bg' : ''}`}
            >
              {active ? <Flame className="h-3.5 w-3.5" /> : ''}
            </motion.span>
            <span className={`text-[10px] font-semibold ${isToday ? 'text-fg' : 'text-muted'}`}>{dayLabels[i]}</span>
          </div>
        ))}
      </div>
      <p className="relative mt-4 text-xs text-muted">
        {streak.current === 0
          ? 'Finish a workout today to light the flame.'
          : streak.current >= streak.best
            ? 'This is your best streak ever. Keep going! 🔥'
            : `Personal best: ${streak.best} days. ${toBeat} more to beat it!`}
      </p>
    </GlassCard>
  )
}

function Rings({ rings }) {
  const list = [
    { label: 'Workouts', sub: 'this week', ...rings.workouts, from: '#C6FF3D', to: '#86EFAC', icon: Dumbbell },
    { label: 'Active min', sub: 'this week', ...rings.minutes, from: '#22E1FF', to: '#818CF8', icon: Clock },
    { label: 'Goals hit', sub: 'this week', ...rings.goalsHit, from: '#FB923C', to: '#F43F5E', icon: Target },
  ]
  return (
    <GlassCard delay={0.12} className="lg:col-span-3">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Weekly goals</h3>
        <span className="text-xs text-muted">Resets Monday</span>
      </div>
      <div className="grid grid-cols-3 gap-2 sm:gap-6">
        {list.map((r) => (
          <div key={r.label} className="flex flex-col items-center text-center">
            <ProgressRing value={r.value} max={r.goal} from={r.from} to={r.to} size={140} stroke={12}>
              <div>
                <r.icon className="mx-auto mb-1 hidden h-4 w-4 sm:block" style={{ color: r.from }} />
                <p className="font-display text-xl font-bold leading-none sm:text-2xl">
                  <AnimatedCounter value={r.value} />
                </p>
                <p className="mt-0.5 text-[10px] text-muted sm:text-[11px]">of {r.goal}</p>
              </div>
            </ProgressRing>
            <p className="mt-3 text-sm font-semibold">{r.label}</p>
            <p className="text-xs text-muted">{r.sub}</p>
          </div>
        ))}
      </div>
    </GlassCard>
  )
}

function WeeklyChart({ activity }) {
  const [metric, setMetric] = useState('minutes')
  const c = useChartColors()
  const total = activity.reduce((s, d) => s + d[metric], 0)
  return (
    <GlassCard delay={0.16} className="lg:col-span-2">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">Last 7 days</h3>
          <p className="mt-1 font-display text-3xl font-bold">
            <AnimatedCounter key={metric} value={total} duration={1} />
            <span className="ml-1.5 text-base font-medium text-muted">{metric === 'minutes' ? 'active min' : 'kcal (est.)'}</span>
          </p>
        </div>
        <div className="flex rounded-xl bg-fg/5 p-1 text-xs font-semibold">
          {['minutes', 'calories'].map((m) => (
            <button
              key={m}
              onClick={() => setMetric(m)}
              className={`relative rounded-lg px-3 py-2.5 capitalize transition-colors ${metric === m ? 'text-black' : 'text-muted hover:text-fg'}`}
            >
              {metric === m && <motion.span layoutId="metric-pill" className="absolute inset-0 rounded-lg bg-gradient-to-r from-volt to-aqua" />}
              <span className="relative">{m}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="mt-6 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={activity} barCategoryGap="26%">
            <defs>
              <linearGradient id="bar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={c.a} />
                <stop offset="100%" stopColor={c.b} stopOpacity={0.7} />
              </linearGradient>
              <linearGradient id="bar-dim" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={c.a} stopOpacity={0.35} />
                <stop offset="100%" stopColor={c.b} stopOpacity={0.15} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke={c.grid} strokeDasharray="3 6" />
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: c.muted, fontSize: 12 }} />
            <YAxis hide domain={[0, (max) => Math.max(max, 30)]} />
            <Tooltip cursor={{ fill: c.cursor, radius: 12 }} content={<ChartTooltip unit={metric === 'minutes' ? ' min' : ' kcal'} formatEmpty="Rest day" />} />
            <Bar dataKey={metric} name={metric} radius={[10, 10, 10, 10]} minPointSize={4} animationDuration={1200}>
              {activity.map((d) => (
                <Cell key={d.date} fill={d.isToday ? 'url(#bar)' : 'url(#bar-dim)'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  )
}

function UpcomingClasses() {
  const { booked } = useApp()
  const list = booked.map(findClass).filter(Boolean).slice(0, 3)
  return (
    <GlassCard delay={0.2}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Your classes</h3>
        <Link to="/classes" className="-my-2.5 flex items-center gap-1 py-2.5 pl-2 text-xs font-semibold text-accent hover:underline">
          Book more <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      {list.length === 0 ? (
        <EmptyState
          compact
          icon={CalendarPlus}
          title="No classes booked"
          message="Grab a spot in Yoga, HIIT, Spin or Boxing."
          action={<Link to="/classes" className="btn-ghost !py-2 text-xs">Browse schedule</Link>}
        />
      ) : (
        <ul className="space-y-2">
          {list.map((cls) => {
            const { icon: Icon, color } = classMeta[cls.type]
            return (
              <li key={cls.id} className="flex items-center gap-3 rounded-2xl bg-fg/5 p-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: `${color}22` }}>
                  <Icon className="h-5 w-5" style={{ color }} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{cls.name}</p>
                  <p className="text-xs text-muted">{cls.day} · {to12h(cls.time)} · {cls.coach}</p>
                </div>
                <CalendarDays className="h-4 w-4 text-muted" />
              </li>
            )
          })}
        </ul>
      )}
    </GlassCard>
  )
}

function DashboardSkeleton() {
  return (
    <div className="grid gap-4 sm:gap-5 lg:grid-cols-3">
      <SkeletonCard className="min-h-[300px] lg:col-span-2" lines={4} />
      <SkeletonCard className="min-h-[300px]" lines={3} />
      <SkeletonCard className="lg:col-span-3">
        <Skeleton className="h-5 w-32" />
        <div className="mt-6 grid grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => <Skeleton key={i} className="mx-auto aspect-square w-full max-w-[140px] !rounded-full" />)}
        </div>
      </SkeletonCard>
      <SkeletonCard className="lg:col-span-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="mt-6 h-48 w-full" />
      </SkeletonCard>
      <SkeletonCard lines={3} />
    </div>
  )
}

export default function Dashboard() {
  const { user } = useApp()
  const { data, error, loading, reload } = useResource(`/api/dashboard?date=${localDate()}`)
  const date = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  const remaining = data ? Math.max(0, data.rings.workouts.goal - data.rings.workouts.value) : null
  const subtitle =
    remaining === null
      ? 'Loading your week…'
      : remaining === 0
        ? 'Weekly workout goal smashed. Anything extra is a bonus! 🏆'
        : `You’re ${remaining} ${remaining === 1 ? 'workout' : 'workouts'} away from your weekly goal. Let’s go.`

  return (
    <Page>
      <div className="mb-6 sm:mb-8">
        <p className="eyebrow mb-2">{date}</p>
        <h1 className="text-3xl font-bold sm:text-4xl">
          {greeting()}, <span className="text-gradient">{data?.firstName ?? user?.firstName}</span> 👋
        </h1>
        <p className="mt-2 text-sm text-muted sm:text-base">{subtitle}</p>
      </div>

      {loading && !data ? (
        <DashboardSkeleton />
      ) : error ? (
        <ErrorState error={error} onRetry={reload} />
      ) : (
        <div className="grid gap-4 sm:gap-5 lg:grid-cols-3">
          <TodayWorkout workout={data.today} />
          <StreakCard streak={data.streak} />
          <Rings rings={data.rings} />
          <WeeklyChart activity={data.activity} />
          <div className="flex flex-col gap-4 sm:gap-5">
            <UpcomingClasses />
            <QuoteCard delay={0.24} />
          </div>
        </div>
      )}
    </Page>
  )
}
