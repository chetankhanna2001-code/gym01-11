import { motion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { ease } from '../lib/meta'
import Logo from './Logo'
import ThemeToggle from './ThemeToggle'

export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-10">
        <Logo />
        <ThemeToggle />
      </header>
      <main className="flex flex-1 items-center justify-center px-4 pb-16 pt-4">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease }}
          className="relative w-full max-w-md"
        >
          <div className="pointer-events-none absolute -inset-10 rounded-full bg-gradient-to-tr from-volt/20 via-transparent to-aqua/20 blur-3xl" />
          <div className="glass relative overflow-hidden p-6 sm:p-8">
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent/15 blur-3xl" />
            <h1 className="relative text-3xl font-bold">{title}</h1>
            <p className="relative mt-2 text-sm text-muted">{subtitle}</p>
            <div className="relative mt-6">{children}</div>
          </div>
          {footer && <p className="relative mt-6 text-center text-sm text-muted">{footer}</p>}
        </motion.div>
      </main>
    </div>
  )
}

export function Field({ label, icon: Icon, hint, type = 'text', ...props }) {
  const [show, setShow] = useState(false)
  const isPassword = type === 'password'
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">{label}</span>
      <span className="flex items-center gap-2 rounded-2xl border border-fg/10 bg-fg/5 px-4 transition focus-within:border-accent/50 focus-within:ring-2 focus-within:ring-accent/40">
        {Icon && <Icon className="h-4 w-4 shrink-0 text-muted" />}
        <input
          type={isPassword && show ? 'text' : type}
          className="w-full bg-transparent py-3.5 text-sm outline-none placeholder:text-muted/70"
          {...props}
        />
        {isPassword && (
          <button type="button" onClick={() => setShow((s) => !s)} className="text-muted hover:text-fg" aria-label={show ? 'Hide password' : 'Show password'}>
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </span>
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  )
}

export function FormError({ message }) {
  if (!message) return null
  return (
    <motion.p
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-rose-400/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-400"
      role="alert"
    >
      {message}
    </motion.p>
  )
}
