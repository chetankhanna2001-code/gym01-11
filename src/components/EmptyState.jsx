import { motion } from 'framer-motion'

export default function EmptyState({ icon: Icon, title, message, action, compact = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex flex-col items-center justify-center rounded-3xl border border-dashed border-fg/15 text-center ${compact ? 'px-4 py-8' : 'px-6 py-14'}`}
    >
      {Icon && (
        <div className="relative mb-4">
          <div className="absolute inset-0 rounded-full bg-accent/20 blur-xl" />
          <div className="relative grid h-14 w-14 place-items-center rounded-2xl border border-fg/10 bg-fg/5">
            <Icon className="h-6 w-6 text-accent" />
          </div>
        </div>
      )}
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      {message && <p className="mt-1 max-w-sm text-sm text-muted">{message}</p>}
      {action && <div className="mt-5">{action}</div>}
    </motion.div>
  )
}
