import { motion } from 'framer-motion'
import { ArrowRight, Flame, HeartPulse, Play, Star, Timer, Trophy } from 'lucide-react'
import { Link } from 'react-router-dom'
import AnimatedCounter from '../components/AnimatedCounter'
import Footer from '../components/Footer'
import GlassCard from '../components/GlassCard'
import Logo from '../components/Logo'
import ProgressRing from '../components/ProgressRing'
import QuoteCard from '../components/QuoteCard'
import { Skeleton } from '../components/Skeleton'
import ThemeToggle from '../components/ThemeToggle'
import UserMenu from '../components/UserMenu'
import { useApp } from '../context/AppContext'
import { classTypes, features, heroPreview } from '../data/mock'
import { useResource } from '../lib/api'
import { classMeta, ease, icons } from '../lib/meta'

const statCards = [
  { key: 'members', label: 'Active members', icon: 'users' },
  { key: 'workouts', label: 'Workouts completed', icon: 'dumbbell' },
  { key: 'classes', label: 'Classes this week', icon: 'calendar' },
]

function useStartLink() {
  const { user } = useApp()
  return user ? '/dashboard' : '/signup'
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease },
})

function Navbar() {
  const { user } = useApp()
  return (
    <header className="sticky top-0 z-40 border-b border-fg/[0.06] bg-bg/60 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-10">
        <Logo />
        <nav className="hidden items-center gap-8 text-sm text-muted md:flex">
          <a href="#features" className="transition hover:text-fg">Features</a>
          <a href="#classes" className="transition hover:text-fg">Classes</a>
          <a href="#community" className="transition hover:text-fg">Community</a>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user && <Link to="/dashboard" className="btn-ghost hidden !py-2.5 md:inline-flex">Open app</Link>}
          <UserMenu compact />
        </div>
      </div>
    </header>
  )
}

function HeartbeatLine() {
  return (
    <svg viewBox="0 0 300 60" className="h-14 w-full" aria-hidden="true">
      <defs>
        <linearGradient id="hb" x1="0" x2="1">
          <stop offset="0" stopColor="#C6FF3D" stopOpacity="0" />
          <stop offset="0.3" stopColor="#C6FF3D" />
          <stop offset="1" stopColor="#22E1FF" />
        </linearGradient>
      </defs>
      <motion.path
        d="M0 32 H70 L82 32 L92 10 L104 52 L116 18 L124 32 H170 L180 32 L190 4 L202 56 L214 22 L222 32 H300"
        fill="none"
        stroke="url(#hb)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: [0, 1, 1], opacity: [1, 1, 0] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut', times: [0, 0.75, 1] }}
      />
    </svg>
  )
}

function HeroVisual() {
  return (
    <motion.div {...fadeUp(0.3)} className="relative mx-auto w-full max-w-sm lg:max-w-md">
      <div className="absolute -inset-10 rounded-full bg-gradient-to-tr from-volt/25 via-transparent to-aqua/25 blur-3xl" />

      <div className="glass relative overflow-hidden p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="eyebrow">Today</p>
            <p className="mt-1 font-display text-xl font-bold">{heroPreview.name}</p>
          </div>
          <span className="chip !border-accent/30 !bg-accent/10 !text-accent">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" /> Live
          </span>
        </div>

        <div className="my-6 flex justify-center">
          <ProgressRing value={72} max={100} size={190} stroke={14}>
            <div>
              <p className="font-display text-5xl font-bold">
                <AnimatedCounter value={72} />%
              </p>
              <p className="text-xs text-muted">Workout complete</p>
            </div>
          </ProgressRing>
        </div>

        <HeartbeatLine />

        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          {[
            { icon: Flame, value: 420, unit: 'kcal', tone: 'text-orange-400' },
            { icon: Timer, value: 45, unit: 'min', tone: 'text-accent2' },
            { icon: HeartPulse, value: 142, unit: 'bpm', tone: 'text-rose-400' },
          ].map(({ icon: Icon, value, unit, tone }) => (
            <div key={unit} className="rounded-2xl bg-fg/5 py-3">
              <Icon className={`mx-auto h-4 w-4 ${tone}`} />
              <p className="mt-1 font-display text-lg font-bold">
                <AnimatedCounter value={value} />
              </p>
              <p className="text-[10px] uppercase tracking-wider text-muted">{unit}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="glass absolute -left-3 top-36 flex animate-float items-center gap-2 !rounded-2xl px-3 py-2 text-sm font-semibold sm:-left-10">
        <Flame className="h-4 w-4 animate-flicker text-orange-400" /> 12-day streak
      </div>
      <div className="glass absolute -bottom-5 -right-2 flex animate-float-delayed items-center gap-2 !rounded-2xl px-3 py-2 text-sm font-semibold sm:-right-8">
        <Trophy className="h-4 w-4 text-yellow-400" /> New PR · 150 kg
      </div>
    </motion.div>
  )
}

function Marquee() {
  const words = ['HIIT', 'Strength', 'Yoga', 'Spin', 'Boxing', 'Mobility', 'Cardio', 'Power']
  return (
    <div className="relative overflow-hidden border-y border-fg/[0.06] py-5" aria-hidden="true">
      <div className="flex w-max animate-marquee gap-10">
        {[...words, ...words].map((w, i) => (
          <span key={i} className="flex items-center gap-10 font-display text-2xl font-bold uppercase tracking-tight text-fg/20 sm:text-4xl">
            {w}
            <span className="h-2 w-2 rounded-full bg-accent/60" />
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Landing() {
  const startLink = useStartLink()
  const { user } = useApp()
  const stats = useResource('/api/stats')
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Navbar />

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-14 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:px-10 lg:pb-24 lg:pt-20">
        <div>
          <motion.span {...fadeUp(0)} className="chip !border-accent/25 !bg-accent/10 !text-accent">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
            {stats.data ? `${stats.data.classes} classes on the schedule this week` : 'Plan · Track · Book · Grow'}
          </motion.span>
          <motion.h1 {...fadeUp(0.08)} className="mt-6 text-[3.25rem] font-bold leading-[0.95] sm:text-7xl lg:text-[5.5rem]">
            Train smarter.
            <br />
            <span className="text-gradient">Get stronger.</span>
          </motion.h1>
          <motion.p {...fadeUp(0.16)} className="mt-6 max-w-lg text-base text-muted sm:text-lg">
            PulseFit plans your workouts, tracks every rep, books your favorite classes and keeps your streak alive,
            all from your pocket.
          </motion.p>
          <motion.div {...fadeUp(0.24)} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to={startLink} className="btn-primary !px-7 !py-4 text-base">
              <Play className="h-5 w-5 fill-current" /> Start Your Workout
            </Link>
            <Link to={user ? '/library' : '/login'} className="btn-ghost !px-7 !py-4 text-base">
              {user ? 'Browse exercises' : 'I have an account'} <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
          <motion.div {...fadeUp(0.32)} className="mt-8 flex items-center gap-3 text-sm text-muted">
            <div className="flex -space-x-2">
              {['JM', 'SK', 'PL', 'DR'].map((n, i) => (
                <span
                  key={n}
                  className="grid h-8 w-8 place-items-center rounded-full border-2 border-bg text-[10px] font-bold text-black"
                  style={{ background: ['#C6FF3D', '#22E1FF', '#A78BFA', '#FB923C'][i] }}
                >
                  {n}
                </span>
              ))}
            </div>
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <strong className="text-fg">4.9</strong> from 24k+ members
            </span>
          </motion.div>
        </div>
        <HeroVisual />
      </section>

      {/* Stats */}
      <section id="community" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-16 sm:px-6 lg:px-10">
        <div className="grid gap-4 sm:grid-cols-3">
          {statCards.map((s, i) => {
            const Icon = icons[s.icon]
            return (
              <GlassCard key={s.key} delay={i * 0.1} hover className="overflow-hidden">
                <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-accent/10 blur-2xl" />
                <Icon className="h-6 w-6 text-accent" />
                <div className="mt-4 flex h-12 items-center font-display text-4xl font-bold sm:h-[3.75rem] sm:text-5xl">
                  {stats.loading ? (
                    <Skeleton className="h-10 w-32" />
                  ) : stats.data ? (
                    <AnimatedCounter value={stats.data[s.key]} duration={2.2} />
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </div>
                <p className="mt-1 text-sm text-muted">{s.label}</p>
              </GlassCard>
            )
          })}
        </div>
        {stats.error && (
          <p className="mt-4 text-center text-sm text-muted" role="status">
            Live community stats are unavailable right now. {stats.error.message}{' '}
            <button onClick={stats.reload} className="font-semibold text-accent hover:underline">Retry</button>
          </p>
        )}
      </section>

      <Marquee />

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6 lg:px-10">
        <div className="mb-10 max-w-2xl">
          <p className="eyebrow">Everything in one app</p>
          <h2 className="mt-3 text-4xl font-bold sm:text-5xl">
            Built for the grind. <span className="text-gradient">Designed for the glow.</span>
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => {
            const Icon = icons[f.icon]
            return (
              <GlassCard key={f.title} delay={i * 0.06} hover>
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-volt/20 to-aqua/20 ring-1 ring-accent/20">
                  <Icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="mt-5 text-xl font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted">{f.text}</p>
              </GlassCard>
            )
          })}
        </div>
      </section>

      {/* Classes preview */}
      <section id="classes" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-20 sm:px-6 lg:px-10">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">Group classes</p>
            <h2 className="mt-3 text-4xl font-bold sm:text-5xl">Find your tribe.</h2>
          </div>
          <Link to="/classes" className="btn-ghost self-start">
            See this week’s schedule <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {classTypes.map((t, i) => {
            const { icon: Icon, color, blurb } = classMeta[t]
            return (
              <GlassCard key={t} delay={i * 0.08} hover className="overflow-hidden">
                <div className="pointer-events-none absolute -bottom-10 -right-10 h-32 w-32 rounded-full blur-2xl" style={{ background: `${color}33` }} />
                <Icon className="h-7 w-7" style={{ color }} />
                <h3 className="mt-6 text-2xl font-bold">{t}</h3>
                <p className="mt-1 text-sm text-muted">{blurb}</p>
              </GlassCard>
            )
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-10">
        <QuoteCard large />
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-8 sm:px-6 lg:px-10">
        <GlassCard className="overflow-hidden !p-8 text-center sm:!p-14">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-volt/15 via-transparent to-aqua/15" />
          <h2 className="relative text-4xl font-bold sm:text-6xl">
            Your next PR <span className="text-gradient">starts today.</span>
          </h2>
          <p className="relative mx-auto mt-4 max-w-md text-muted">No excuses, no guesswork. Open PulseFit, hit start, and let’s move.</p>
          <Link to={startLink} className="btn-primary relative mt-8 !px-8 !py-4 text-base">
            <Play className="h-5 w-5 fill-current" /> Start Your Workout
          </Link>
        </GlassCard>
      </section>

      <Footer />
    </div>
  )
}
