import { motion } from 'framer-motion'
import { Sparkles, TrendingUp, Trophy } from 'lucide-react'
import { useState } from 'react'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import AnimatedCounter from '../components/AnimatedCounter'
import ChartTooltip from '../components/ChartTooltip'
import EmptyState from '../components/EmptyState'
import GlassCard from '../components/GlassCard'
import Page, { PageHeader } from '../components/Page'
import { useChartColors } from '../context/AppContext'
import { personalRecords, strengthData } from '../data/mock'

const ranges = { '3M': 3, '6M': 6, '1Y': 12 }

const tierStyle = {
  gold: { ring: 'from-yellow-300 to-amber-500', glow: 'shadow-[0_0_30px_-6px_rgba(250,204,21,0.7)]', label: 'Gold' },
  silver: { ring: 'from-slate-200 to-slate-400', glow: 'shadow-[0_0_30px_-8px_rgba(203,213,225,0.6)]', label: 'Silver' },
  bronze: { ring: 'from-orange-300 to-amber-700', glow: 'shadow-[0_0_30px_-8px_rgba(217,119,6,0.6)]', label: 'Bronze' },
}

export default function Progress() {
  const c = useChartColors()
  const [range, setRange] = useState('6M')
  const lifts = [
    { key: 'deadlift', label: 'Deadlift', color: c.a },
    { key: 'squat', label: 'Squat', color: c.b },
    { key: 'bench', label: 'Bench', color: c.c },
  ]
  const [visible, setVisible] = useState(['deadlift', 'squat', 'bench'])
  const data = strengthData.slice(-ranges[range])

  const toggleLift = (key) => setVisible((v) => (v.includes(key) ? v.filter((k) => k !== key) : [...v, key]))

  return (
    <Page>
      <PageHeader
        eyebrow="Progress"
        title="Stronger every month"
        subtitle="Your estimated one-rep max for the big three, plus every personal record you’ve earned."
      />

      <div className="mb-5 grid grid-cols-3 gap-3 sm:gap-4">
        {lifts.map((l, i) => {
          const gain = data[data.length - 1][l.key] - data[0][l.key]
          const pct = Math.round((gain / data[0][l.key]) * 100)
          return (
            <GlassCard key={l.key} delay={i * 0.06} className="!p-4 sm:!p-5">
              <p className="flex items-center gap-2 text-xs font-semibold text-muted sm:text-sm">
                <span className="h-2 w-2 rounded-full" style={{ background: l.color }} /> {l.label}
              </p>
              <p className="mt-2 font-display text-2xl font-bold sm:text-3xl">
                +<AnimatedCounter key={range} value={gain} decimals={gain % 1 ? 1 : 0} duration={1} />
                <span className="ml-1 text-sm font-medium text-muted">kg</span>
              </p>
              <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-accent">
                <TrendingUp className="h-3 w-3" /> {pct}% in {range}
              </p>
            </GlassCard>
          )
        })}
      </div>

      <GlassCard delay={0.1} className="mb-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {lifts.map((l) => {
              const on = visible.includes(l.key)
              return (
                <button
                  key={l.key}
                  onClick={() => toggleLift(l.key)}
                  className={`flex items-center gap-2 rounded-full border px-3.5 py-2.5 text-xs font-semibold transition ${on ? 'border-fg/15 bg-fg/10 text-fg' : 'border-fg/10 text-muted line-through opacity-60'}`}
                  aria-pressed={on}
                >
                  <span className="h-2 w-2 rounded-full" style={{ background: l.color }} />
                  {l.label}
                </button>
              )
            })}
          </div>
          <div className="flex rounded-xl bg-fg/5 p-1 text-xs font-semibold">
            {Object.keys(ranges).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`relative rounded-lg px-3.5 py-2.5 transition-colors ${range === r ? 'text-black' : 'text-muted hover:text-fg'}`}
              >
                {range === r && <motion.span layoutId="range-pill" className="absolute inset-0 rounded-lg bg-gradient-to-r from-volt to-aqua" />}
                <span className="relative">{r}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 h-72 sm:h-80">
          {visible.length === 0 ? (
            <EmptyState compact icon={TrendingUp} title="No lifts selected" message="Tap a lift above to bring its line back." />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart key={range} data={data} margin={{ top: 10, right: 10, left: -18, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke={c.grid} strokeDasharray="3 6" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: c.muted, fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: c.muted, fontSize: 12 }} domain={['dataMin - 10', 'dataMax + 10']} />
                <Tooltip content={<ChartTooltip unit=" kg" />} cursor={{ stroke: c.grid, strokeWidth: 2 }} />
                {lifts
                  .filter((l) => visible.includes(l.key))
                  .map((l) => (
                    <Line
                      key={l.key}
                      type="monotone"
                      dataKey={l.key}
                      name={l.label}
                      stroke={l.color}
                      strokeWidth={3}
                      dot={false}
                      activeDot={{ r: 6, strokeWidth: 3, stroke: l.color, fill: 'rgb(var(--bg))' }}
                      animationDuration={1600}
                      style={{ filter: `drop-shadow(0 4px 12px ${l.color}66)` }}
                    />
                  ))}
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </GlassCard>

      <div className="mb-5 flex items-end justify-between">
        <div>
          <p className="eyebrow mb-2">Hall of fame</p>
          <h2 className="text-2xl font-bold sm:text-3xl">Personal records</h2>
        </div>
        <span className="chip"><Trophy className="h-3.5 w-3.5 text-yellow-400" /> {personalRecords.length} PRs</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {personalRecords.map((pr, i) => {
          const t = tierStyle[pr.tier]
          return (
            <GlassCard key={pr.id} delay={i * 0.06} hover className="flex items-center gap-4 overflow-hidden">
              {pr.isNew && (
                <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent">
                  <Sparkles className="h-3 w-3" /> New
                </span>
              )}
              <motion.div
                initial={{ rotate: -30, scale: 0.5, opacity: 0 }}
                whileInView={{ rotate: 0, scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 260, damping: 14, delay: 0.1 + i * 0.06 }}
                className={`grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${t.ring} ${t.glow}`}
              >
                <Trophy className="h-8 w-8 text-black/80" />
              </motion.div>
              <div className="min-w-0">
                <p className="text-sm text-muted">{pr.lift}</p>
                <p className="font-display text-3xl font-bold leading-tight">
                  {pr.value}
                  <span className="ml-1 text-sm font-medium text-muted">{pr.unit}</span>
                </p>
                <p className="mt-0.5 text-xs text-muted">
                  {pr.date} · <span className="font-semibold text-accent">{pr.delta}</span>
                </p>
              </div>
            </GlassCard>
          )
        })}
      </div>
    </Page>
  )
}
