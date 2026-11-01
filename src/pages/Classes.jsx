import { AnimatePresence, motion } from 'framer-motion'
import { CalendarCheck, CalendarX, Check, Clock, LoaderCircle, Users, X } from 'lucide-react'
import { forwardRef, useMemo, useState } from 'react'
import EmptyState from '../components/EmptyState'
import Page, { PageHeader } from '../components/Page'
import { useApp } from '../context/AppContext'
import { classTypes, findClass, schedule } from '../data/mock'
import { classMeta, to12h } from '../lib/meta'

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function useWeek() {
  return useMemo(() => {
    const now = new Date()
    const todayIdx = (now.getDay() + 6) % 7
    const monday = new Date(now)
    monday.setDate(now.getDate() - todayIdx)
    return weekdays.map((key, i) => {
      const d = new Date(monday)
      d.setDate(monday.getDate() + i)
      return { key, date: d.getDate(), isToday: i === todayIdx }
    })
  }, [])
}

const ClassCard = forwardRef(function ClassCard({ cls, isBooked, pending, onBook, onCancel }, ref) {
  const { icon: Icon, color } = classMeta[cls.type]
  const spotsLeft = cls.capacity - cls.taken - (isBooked ? 1 : 0)
  const full = spotsLeft <= 0 && !isBooked
  const fillPct = Math.min(100, ((cls.capacity - Math.max(spotsLeft, 0)) / cls.capacity) * 100)
  const low = spotsLeft > 0 && spotsLeft <= 3

  return (
    <motion.article
      ref={ref}
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      whileHover={{ y: -4 }}
      className={`glass relative flex flex-col gap-4 overflow-hidden p-5 sm:flex-row sm:items-center ${isBooked ? '!border-accent/40' : ''}`}
    >
      <div className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full blur-3xl" style={{ background: `${color}22` }} />
      <div className="relative flex items-center gap-4 sm:w-40 sm:shrink-0">
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl" style={{ background: `${color}1f`, color }}>
          <Icon className="h-7 w-7" />
        </span>
        <div>
          <p className="font-display text-xl font-bold leading-none">{to12h(cls.time)}</p>
          <p className="mt-1 flex items-center gap-1 text-xs text-muted"><Clock className="h-3 w-3" /> {cls.duration} min</p>
        </div>
      </div>

      <div className="relative min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-lg font-semibold">{cls.name}</h3>
          <span className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider" style={{ background: `${color}1f`, color }}>{cls.type}</span>
          {isBooked && (
            <span className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent">
              <Check className="h-3 w-3" /> Booked
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-muted">
          {cls.coach} · Intensity {'●'.repeat(cls.intensity)}<span className="opacity-30">{'●'.repeat(3 - cls.intensity)}</span>
        </p>
        <div className="mt-3 flex items-center gap-3">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-fg/[0.07]">
            <motion.div
              className="h-full rounded-full"
              style={{ background: full ? '#F43F5E' : low ? '#FB923C' : color }}
              initial={{ width: 0 }}
              animate={{ width: `${fillPct}%` }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
          <span className={`flex shrink-0 items-center gap-1 text-xs font-semibold ${full ? 'text-rose-400' : low ? 'text-orange-400' : 'text-muted'}`}>
            <Users className="h-3.5 w-3.5" />
            {full ? 'Class full' : `${spotsLeft} spot${spotsLeft === 1 ? '' : 's'} left`}
          </span>
        </div>
      </div>

      <div className="relative sm:w-36 sm:shrink-0">
        {isBooked ? (
          <button onClick={onCancel} className="btn-ghost w-full">
            <X className="h-4 w-4" /> Cancel
          </button>
        ) : (
          <button
            onClick={onBook}
            disabled={pending}
            aria-disabled={full}
            className={`w-full ${full ? 'btn border border-fg/10 bg-fg/5 text-muted hover:bg-fg/10' : 'btn-primary'}`}
          >
            {pending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : full ? 'Full' : 'Book'}
          </button>
        )}
      </div>
    </motion.article>
  )
})

export default function Classes() {
  const week = useWeek()
  const { booked, bookClass, cancelBooking, toast } = useApp()
  const [day, setDay] = useState(() => week.find((d) => d.isToday)?.key ?? 'Mon')
  const [type, setType] = useState('All')
  const [pending, setPending] = useState(null)

  const list = schedule[day].filter((c) => type === 'All' || c.type === type)
  const myClasses = booked.map(findClass).filter(Boolean)

  const handleBook = (cls) => {
    const spotsLeft = cls.capacity - cls.taken
    if (spotsLeft <= 0) {
      const alt = schedule[cls.day].find((c) => c.type === cls.type && c.id !== cls.id && c.capacity > c.taken)
      toast({
        type: 'error',
        title: 'Sorry, this class is full',
        message: alt ? `Try ${alt.name} at ${to12h(alt.time)} instead.` : 'Check another day. New spots open up all the time.',
      })
      return
    }
    setPending(cls.id)
    setTimeout(() => {
      bookClass(cls.id)
      setPending(null)
      toast({ title: 'You’re booked! 🎉', message: `${cls.name} · ${cls.day} at ${to12h(cls.time)} with ${cls.coach}.` })
    }, 700)
  }

  const handleCancel = (cls) => {
    cancelBooking(cls.id)
    toast({ type: 'info', title: 'Booking cancelled', message: `Your spot in ${cls.name} was released.` })
  }

  return (
    <Page>
      <PageHeader
        eyebrow="Class booking"
        title="This week at PulseFit"
        subtitle="Yoga, HIIT, Spin and Boxing with our best coaches. Book in one tap."
        action={
          <span className="chip self-start !px-4 !py-2 !text-sm">
            <CalendarCheck className="h-4 w-4 text-accent" /> {myClasses.length} booked
          </span>
        }
      />

      {myClasses.length > 0 && (
        <div className="no-scrollbar -mx-4 mb-6 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          {myClasses.map((c) => {
            const { icon: Icon, color } = classMeta[c.type]
            return (
              <button key={c.id} onClick={() => setDay(c.day)} className="glass flex shrink-0 items-center gap-2 !rounded-2xl px-3 py-2 text-left text-xs transition hover:!border-accent/40">
                <Icon className="h-4 w-4" style={{ color }} />
                <span>
                  <span className="block font-semibold">{c.name}</span>
                  <span className="text-muted">{c.day} · {to12h(c.time)}</span>
                </span>
              </button>
            )
          })}
        </div>
      )}

      <div className="no-scrollbar -mx-4 mb-4 grid grid-flow-col gap-2 overflow-x-auto px-4 sm:mx-0 sm:grid-cols-7 sm:px-0" role="tablist" aria-label="Day of week">
        {week.map((d) => {
          const active = d.key === day
          const count = schedule[d.key].length
          return (
            <button
              key={d.key}
              role="tab"
              aria-selected={active}
              onClick={() => setDay(d.key)}
              className={`relative flex min-w-[4.25rem] flex-col items-center rounded-2xl border px-3 py-3 transition-colors ${active ? 'border-transparent text-black' : 'border-fg/10 bg-fg/5 text-fg hover:bg-fg/10'}`}
            >
              {active && <motion.span layoutId="day-pill" className="absolute inset-0 rounded-2xl bg-gradient-to-br from-volt to-aqua shadow-glow" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
              <span className={`relative text-[11px] font-semibold uppercase ${active ? '' : 'text-muted'}`}>{d.isToday ? 'Today' : d.key}</span>
              <span className="relative font-display text-2xl font-bold">{d.date}</span>
              <span className={`relative text-[10px] ${active ? 'text-black/70' : 'text-muted'}`}>{count} classes</span>
            </button>
          )
        })}
      </div>

      <div className="no-scrollbar -mx-4 mb-6 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        {['All', ...classTypes].map((t) => {
          const meta = classMeta[t]
          const active = type === t
          return (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition ${active ? 'border-fg/20 bg-fg/10 text-fg' : 'border-fg/10 text-muted hover:text-fg'}`}
              style={active && meta ? { borderColor: `${meta.color}66`, color: meta.color, background: `${meta.color}14` } : undefined}
            >
              {meta && <meta.icon className="h-4 w-4" />}
              {t}
            </button>
          )
        })}
      </div>

      {list.length === 0 ? (
        <EmptyState
          icon={CalendarX}
          title={`No ${type} classes on ${day}`}
          message="Our coaches are resting too! Try another day or browse all class types."
          action={<button className="btn-primary" onClick={() => setType('All')}>Show all classes</button>}
        />
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {list.map((cls) => (
              <ClassCard
                key={cls.id}
                cls={cls}
                isBooked={booked.includes(cls.id)}
                pending={pending === cls.id}
                onBook={() => handleBook(cls)}
                onCancel={() => handleCancel(cls)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </Page>
  )
}
