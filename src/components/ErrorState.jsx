import { motion } from 'framer-motion'
import { DatabaseZap, RotateCcw, ServerCrash, TriangleAlert } from 'lucide-react'

const variants = {
  DB_NOT_CONFIGURED: { icon: DatabaseZap, title: 'Database not connected yet' },
  DB_NOT_SETUP: { icon: DatabaseZap, title: 'Database needs setting up' },
  DB_UNREACHABLE: { icon: DatabaseZap, title: 'Can’t reach the database' },
  NETWORK: { icon: ServerCrash, title: 'Server is offline' },
}

export default function ErrorState({ error, onRetry, compact = false }) {
  const v = variants[error?.code] || { icon: TriangleAlert, title: 'Something went wrong' }
  const Icon = v.icon
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`glass flex flex-col items-center justify-center text-center ${compact ? 'px-4 py-8' : 'px-6 py-14'}`}
      role="alert"
    >
      <div className="relative mb-4">
        <div className="absolute inset-0 rounded-full bg-rose-500/25 blur-xl" />
        <div className="relative grid h-14 w-14 place-items-center rounded-2xl border border-rose-400/20 bg-rose-500/10">
          <Icon className="h-6 w-6 text-rose-400" />
        </div>
      </div>
      <h3 className="font-display text-lg font-semibold">{v.title}</h3>
      <p className="mt-1 max-w-md text-sm text-muted">{error?.message || 'Please try again in a moment.'}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-ghost mt-5">
          <RotateCcw className="h-4 w-4" /> Try again
        </button>
      )}
    </motion.div>
  )
}
