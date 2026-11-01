import { useId } from 'react'
import { Link } from 'react-router-dom'

export function PulseMark({ className = 'h-9 w-9' }) {
  // Unique per instance: a shared id would resolve to a copy inside the hidden sidebar on mobile.
  const id = `pulse-mark-${useId().replace(/:/g, '')}`
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#C6FF3D" />
          <stop offset="1" stopColor="#22E1FF" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="18" fill="#0B0F14" />
      <path
        d="M8 34h11l5-13 8 24 6-17 4 6h14"
        fill="none"
        stroke={`url(#${id})`}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function Logo({ to = '/', size = 'md' }) {
  const text = size === 'lg' ? 'text-3xl' : size === 'sm' ? 'text-lg' : 'text-2xl'
  const mark = size === 'lg' ? 'h-11 w-11' : size === 'sm' ? 'h-7 w-7' : 'h-9 w-9'
  return (
    <Link to={to} className="group inline-flex min-h-[40px] items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent" aria-label="PulseFit home">
      <span className="transition-transform duration-300 group-hover:rotate-[-6deg] group-hover:scale-105">
        <PulseMark className={mark} />
      </span>
      <span className={`font-display font-bold italic tracking-tighter ${text} text-gradient`}>PulseFit</span>
    </Link>
  )
}
