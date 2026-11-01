import { motion } from 'framer-motion'
import { ease } from '../lib/meta'

export default function GlassCard({ className = '', hover = false, delay = 0, children, ...rest }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay, ease }}
      whileHover={hover ? { y: -6, transition: { duration: 0.25 } } : undefined}
      className={`glass relative p-5 sm:p-6 ${hover ? 'transition-shadow hover:shadow-glow' : ''} ${className}`}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
