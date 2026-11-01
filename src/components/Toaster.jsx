import { AnimatePresence, motion } from 'framer-motion'
import { CircleCheck, Info, TriangleAlert, X } from 'lucide-react'
import { useApp } from '../context/AppContext'

const styles = {
  success: { icon: CircleCheck, tone: 'text-accent', bar: 'from-volt to-aqua' },
  error: { icon: TriangleAlert, tone: 'text-rose-400', bar: 'from-rose-500 to-orange-400' },
  info: { icon: Info, tone: 'text-accent2', bar: 'from-aqua to-violet-400' },
}

export default function Toaster() {
  const { toasts, dismiss } = useApp()
  return (
    <div className="pointer-events-none fixed inset-x-0 top-3 z-[60] flex flex-col items-center gap-2 px-3 lg:inset-x-auto lg:right-6 lg:top-6 lg:items-end" aria-live="polite">
      <AnimatePresence initial={false}>
        {toasts.map((t) => {
          const s = styles[t.type] || styles.info
          const Icon = s.icon
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              className="glass pointer-events-auto relative flex w-full max-w-sm items-start gap-3 overflow-hidden !rounded-2xl p-4 pr-10"
              role="status"
            >
              <span className={`absolute inset-y-0 left-0 w-1 bg-gradient-to-b ${s.bar}`} />
              <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${s.tone}`} />
              <div className="min-w-0">
                <p className="font-display text-sm font-semibold">{t.title}</p>
                {t.message && <p className="mt-0.5 text-sm text-muted">{t.message}</p>}
              </div>
              <button
                onClick={() => dismiss(t.id)}
                className="absolute right-2.5 top-2.5 rounded-lg p-1 text-muted transition hover:bg-fg/10 hover:text-fg"
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
