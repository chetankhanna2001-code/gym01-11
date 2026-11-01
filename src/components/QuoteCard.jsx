import { Quote } from 'lucide-react'
import GlassCard from './GlassCard'
import { quoteOfTheDay } from '../data/mock'

export default function QuoteCard({ className = '', large = false, delay = 0 }) {
  const q = quoteOfTheDay()
  return (
    <GlassCard delay={delay} className={`overflow-hidden ${className}`}>
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent2/15 blur-3xl" />
      <div className="flex items-center gap-2">
        <Quote className="h-4 w-4 text-accent" />
        <p className="eyebrow">Quote of the day</p>
      </div>
      <blockquote className={`mt-4 font-display font-semibold leading-snug ${large ? 'text-2xl sm:text-4xl' : 'text-lg sm:text-xl'}`}>
        “{q.text}”
      </blockquote>
      <p className="mt-3 text-sm text-muted">— {q.author}</p>
    </GlassCard>
  )
}
