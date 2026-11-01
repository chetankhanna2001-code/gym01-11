import { motion } from 'framer-motion'
import { Clock, Dumbbell, LoaderCircle, Lock, Mail, Minus, Plus, Sparkles, User } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthShell, { Field, FormError } from '../components/AuthShell'
import { useApp } from '../context/AppContext'

function Stepper({ label, icon: Icon, value, onChange, min, max, step, unit }) {
  return (
    <div className="rounded-2xl border border-fg/10 bg-fg/5 p-3">
      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted">
        <Icon className="h-3.5 w-3.5 text-accent" /> {label}
      </p>
      <div className="mt-2 flex items-center justify-between">
        <button type="button" onClick={() => onChange(Math.max(min, value - step))} className="btn-ghost !h-9 !w-9 !rounded-xl !p-0" aria-label={`Decrease ${label}`}>
          <Minus className="h-4 w-4" />
        </button>
        <motion.span key={value} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
          <span className="font-display text-2xl font-bold">{value}</span>
          <span className="ml-1 text-xs text-muted">{unit}</span>
        </motion.span>
        <button type="button" onClick={() => onChange(Math.min(max, value + step))} className="btn-ghost !h-9 !w-9 !rounded-xl !p-0" aria-label={`Increase ${label}`}>
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export default function Signup() {
  const { signup, toast } = useApp()
  const navigate = useNavigate()
  const [form, setForm] = useState({ fullName: '', email: '', password: '', weeklyGoalWorkouts: 4, weeklyGoalMinutes: 150 })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const set = (key) => (v) => setForm((f) => ({ ...f, [key]: v }))

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.fullName.trim().length < 2) return setError('Please enter your name.')
    if (form.password.length < 8) return setError('Your password needs at least 8 characters.')
    setBusy(true)
    try {
      await signup(form)
      toast({ title: `Welcome to PulseFit, ${form.fullName.trim().split(/\s+/)[0]}! 🎉`, message: 'Pick a few exercises from the Library to build today’s workout.' })
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  return (
    <AuthShell
      title={<>Join <span className="text-gradient">PulseFit</span></>}
      subtitle="Create your free account and set your weekly goals. You can change them any time."
      footer={<>Already a member? <Link to="/login" className="font-semibold text-accent hover:underline">Log in</Link></>}
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        <Field label="Full name" icon={User} autoComplete="name" placeholder="Alex Rivera" required
          value={form.fullName} onChange={(e) => set('fullName')(e.target.value)} />
        <Field label="Email" icon={Mail} type="email" autoComplete="email" placeholder="you@example.com" required
          value={form.email} onChange={(e) => set('email')(e.target.value)} />
        <Field label="Password" icon={Lock} type="password" autoComplete="new-password" placeholder="At least 8 characters" required
          value={form.password} onChange={(e) => set('password')(e.target.value)} />
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">Weekly goals</p>
          <div className="grid grid-cols-2 gap-3">
            <Stepper label="Workouts" icon={Dumbbell} value={form.weeklyGoalWorkouts} onChange={set('weeklyGoalWorkouts')} min={1} max={14} step={1} unit="/ wk" />
            <Stepper label="Minutes" icon={Clock} value={form.weeklyGoalMinutes} onChange={set('weeklyGoalMinutes')} min={10} max={2000} step={10} unit="/ wk" />
          </div>
        </div>
        <FormError message={error} />
        <button type="submit" disabled={busy} className="btn-primary w-full !py-4 text-base">
          {busy ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <><Sparkles className="h-5 w-5" /> Create account</>}
        </button>
      </form>
    </AuthShell>
  )
}
