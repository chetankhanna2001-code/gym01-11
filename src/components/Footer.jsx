import { Heart } from 'lucide-react'
import Logo from './Logo'

export default function Footer({ compact = false }) {
  return (
    <footer className={`mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-10 ${compact ? 'py-8' : 'py-12'}`}>
      <div className="flex flex-col items-center justify-between gap-4 border-t border-fg/10 pt-8 text-sm text-muted sm:flex-row">
        <Logo size="sm" />
        <p className="flex items-center gap-1.5">
          © {new Date().getFullYear()} PulseFit. Built for people who show up
          <Heart className="h-3.5 w-3.5 fill-accent text-accent" />
        </p>
      </div>
    </footer>
  )
}
