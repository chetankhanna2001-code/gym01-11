import { ArrowRight, LoaderCircle, Lock, Mail } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import AuthShell, { Field, FormError } from '../components/AuthShell'
import { useApp } from '../context/AppContext'

export default function Login() {
  const { login, toast } = useApp()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const next = params.get('next')?.startsWith('/') ? params.get('next') : '/dashboard'
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await login(form.email, form.password)
      toast({ title: 'Welcome back! 💪', message: 'Let’s pick up where you left off.' })
      navigate(next, { replace: true })
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to see today’s workout, your streak and your progress."
      footer={<>New to PulseFit? <Link to="/signup" className="font-semibold text-accent hover:underline">Create an account</Link></>}
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        <Field label="Email" icon={Mail} type="email" autoComplete="email" placeholder="you@example.com" required
          value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <Field label="Password" icon={Lock} type="password" autoComplete="current-password" placeholder="••••••••" required
          value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <FormError message={error} />
        <button type="submit" disabled={busy} className="btn-primary w-full !py-4 text-base">
          {busy ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <>Log in <ArrowRight className="h-5 w-5" /></>}
        </button>
      </form>
    </AuthShell>
  )
}
