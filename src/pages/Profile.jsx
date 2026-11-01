import { motion } from 'framer-motion'
import { Bell, CalendarClock, Crown, LogOut, MapPin, Pencil, Lock, Target } from 'lucide-react'
import { useState } from 'react'
import AnimatedCounter from '../components/AnimatedCounter'
import GlassCard from '../components/GlassCard'
import { PulseMark } from '../components/Logo'
import Page from '../components/Page'
import ThemeToggle from '../components/ThemeToggle'
import { useLogout } from '../components/UserMenu'
import { useApp } from '../context/AppContext'
import { achievements, user as member } from '../data/mock'
import { icons } from '../lib/meta'

function Switch({ on, onChange, label }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className="grid h-10 w-14 shrink-0 place-items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <span className={`relative h-7 w-12 rounded-full transition-colors ${on ? 'bg-gradient-to-r from-volt to-aqua' : 'bg-fg/15'}`}>
        <motion.span layout transition={{ type: 'spring', stiffness: 500, damping: 30 }} className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow ${on ? 'right-1' : 'left-1'}`} />
      </span>
    </button>
  )
}

export default function Profile() {
  const { user: me, userStats, toast } = useApp()
  const handleLogout = useLogout()
  const memberSince = new Date(me.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const [prefs, setPrefs] = useState({ workout: true, classes: true, weekly: false })
  const xpPct = (member.xp / member.xpNext) * 100
  const unlocked = achievements.filter((a) => a.unlocked).length

  const stats = [
    { label: 'Workouts', value: userStats?.totalWorkouts ?? 0 },
    { label: 'Hours trained', value: member.totals.hours },
    { label: 'PRs set', value: member.totals.prs },
    { label: 'Day streak', value: userStats?.streak ?? 0 },
  ]

  return (
    <Page>
      <div className="grid gap-5 lg:grid-cols-3">
        {/* Identity */}
        <GlassCard className="overflow-hidden lg:col-span-2">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-r from-volt/25 via-aqua/15 to-violet-400/20" />
          <div className="relative flex flex-col items-center gap-5 pt-6 text-center sm:flex-row sm:items-end sm:text-left">
            <div className="relative">
              <div className="absolute -inset-1.5 animate-spinslow rounded-full bg-[conic-gradient(from_0deg,#C6FF3D,#22E1FF,#A78BFA,#C6FF3D)] opacity-90 blur-[2px]" />
              <div className="relative grid h-28 w-28 place-items-center rounded-full border-4 border-bg bg-gradient-to-br from-[#11161d] to-[#1b2430] font-display text-4xl font-bold text-white">
                {me.initials}
              </div>
              <span className="absolute -bottom-1 -right-1 grid h-9 w-9 place-items-center rounded-full border-4 border-bg bg-gradient-to-br from-yellow-300 to-amber-500">
                <Crown className="h-4 w-4 text-black" />
              </span>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{me.fullName}</h1>
              <p className="text-sm text-muted">{me.email}</p>
              <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                <span className="chip !border-yellow-400/30 !bg-yellow-400/10 !text-yellow-500"><Crown className="h-3.5 w-3.5" /> {member.membership} member</span>
                <span className="chip"><MapPin className="h-3.5 w-3.5" /> {member.homeGym}</span>
                <span className="chip"><Target className="h-3.5 w-3.5" /> {me.weeklyGoalWorkouts} workouts · {me.weeklyGoalMinutes} min / week</span>
              </div>
            </div>
            <button
              className="btn-ghost !py-2.5"
              onClick={() => toast({ type: 'info', title: 'Coming soon', message: 'Profile editing lands in the next update.' })}
            >
              <Pencil className="h-4 w-4" /> Edit
            </button>
          </div>

          <div className="relative mt-6">
            <div className="mb-2 flex justify-between text-xs font-semibold">
              <span>Level {member.level}</span>
              <span className="text-muted">{member.xp.toLocaleString()} / {member.xpNext.toLocaleString()} XP</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-fg/[0.07]">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-volt to-aqua shadow-glow"
                initial={{ width: 0 }}
                whileInView={{ width: `${xpPct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            <p className="mt-2 text-xs text-muted">{(member.xpNext - member.xp).toLocaleString()} XP to Level {member.level + 1}</p>
          </div>

          <div className="relative mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl bg-fg/5 p-4 text-center">
                <p className="font-display text-3xl font-bold"><AnimatedCounter value={s.value} /></p>
                <p className="mt-1 text-xs text-muted">{s.label}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Membership card */}
        <motion.div
          initial={{ opacity: 0, rotateY: -20, y: 20 }}
          animate={{ opacity: 1, rotateY: 0, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ y: -6, rotate: -1 }}
          className="relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br from-[#0d1117] via-[#121a12] to-[#071a1f] p-6 text-white shadow-glow"
        >
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-volt/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-aqua/25 blur-3xl" />
          <div className="relative flex items-start justify-between">
            <div className="flex items-center gap-2">
              <PulseMark className="h-8 w-8" />
              <span className="font-display text-lg font-bold italic tracking-tighter">PulseFit</span>
            </div>
            <span className="rounded-full border border-yellow-300/40 bg-yellow-300/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-yellow-300">
              {member.membership}
            </span>
          </div>
          <div className="relative">
            <p className="font-mono text-lg tracking-[0.2em]">{member.memberId}</p>
            <div className="mt-4 flex justify-between text-xs text-white/60">
              <div>
                <p className="uppercase tracking-wider">Member</p>
                <p className="mt-0.5 font-semibold text-white">{me.fullName}</p>
              </div>
              <div className="text-right">
                <p className="uppercase tracking-wider">Valid thru</p>
                <p className="mt-0.5 font-semibold text-white">{member.validThru}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Achievements */}
        <GlassCard delay={0.1} className="lg:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold">Achievements</h2>
            <span className="text-sm text-muted"><strong className="text-fg">{unlocked}</strong> / {achievements.length} unlocked</span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {achievements.map((a, i) => {
              const Icon = icons[a.icon]
              return (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, type: 'spring', stiffness: 300, damping: 20 }}
                  whileHover={{ y: -4 }}
                  className={`relative rounded-2xl border p-4 text-center ${a.unlocked ? 'border-accent/20 bg-accent/[0.06]' : 'border-fg/10 bg-fg/[0.03]'}`}
                >
                  <div className={`mx-auto grid h-14 w-14 place-items-center rounded-2xl ${a.unlocked ? 'bg-gradient-to-br from-volt to-aqua text-black shadow-glow' : 'bg-fg/10 text-muted'}`}>
                    {a.unlocked ? <Icon className="h-7 w-7" /> : <Lock className="h-6 w-6" />}
                  </div>
                  <p className="mt-3 text-sm font-semibold">{a.name}</p>
                  <p className="mt-0.5 text-[11px] leading-snug text-muted">{a.desc}</p>
                  {a.unlocked ? (
                    <p className="mt-2 text-[10px] font-semibold uppercase tracking-wider text-accent">{a.date}</p>
                  ) : (
                    <div className="mt-3">
                      <div className="h-1.5 overflow-hidden rounded-full bg-fg/10">
                        <div className="h-full rounded-full bg-fg/40" style={{ width: `${(a.progress / a.goal) * 100}%` }} />
                      </div>
                      <p className="mt-1 text-[10px] text-muted">{a.progress} / {a.goal}</p>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </GlassCard>

        {/* Settings */}
        <GlassCard delay={0.15}>
          <h2 className="mb-4 text-xl font-bold">Settings</h2>
          <div className="space-y-1">
            <div className="flex items-center justify-between rounded-2xl p-3">
              <span className="text-sm font-medium">Appearance</span>
              <ThemeToggle withLabel />
            </div>
            {[
              { key: 'workout', icon: Bell, label: 'Workout reminders' },
              { key: 'classes', icon: CalendarClock, label: 'Class reminders' },
              { key: 'weekly', icon: Target, label: 'Weekly recap email' },
            ].map(({ key, icon: Icon, label }) => (
              <div key={key} className="flex items-center justify-between rounded-2xl p-3 transition hover:bg-fg/5">
                <span className="flex items-center gap-3 text-sm font-medium">
                  <Icon className="h-4 w-4 text-muted" /> {label}
                </span>
                <Switch
                  label={label}
                  on={prefs[key]}
                  onChange={(v) => {
                    setPrefs((p) => ({ ...p, [key]: v }))
                    toast({ type: 'info', title: `${label} ${v ? 'on' : 'off'}`, duration: 2000 })
                  }}
                />
              </div>
            ))}
          </div>
          <p className="mt-4 rounded-2xl bg-fg/5 p-3 text-xs text-muted">Member since {memberSince}. Thanks for showing up! 🙌</p>
          <button
            className="btn-ghost mt-4 w-full !text-rose-400"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </GlassCard>
      </div>
    </Page>
  )
}
