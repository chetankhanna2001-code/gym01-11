import { motion } from 'framer-motion'
import { ease } from '../lib/meta'

export default function Page({ children, className = '' }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease }}
      className={`mx-auto w-full max-w-6xl px-4 pt-4 sm:px-6 lg:px-10 lg:pt-10 ${className}`}
    >
      {children}
    </motion.main>
  )
}

export function PageHeader({ eyebrow, title, subtitle, action }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
        <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-2 max-w-xl text-sm text-muted sm:text-base">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}
