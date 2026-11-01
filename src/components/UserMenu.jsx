import { LogIn, LogOut } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export function Avatar({ initials, size = 'h-9 w-9 text-xs' }) {
  return (
    <span className={`relative grid shrink-0 place-items-center rounded-full bg-gradient-to-br from-volt to-aqua p-[2px] ${size}`}>
      <span className="grid h-full w-full place-items-center rounded-full bg-bg font-display font-bold">{initials}</span>
    </span>
  )
}

export function useLogout() {
  const { logout, toast } = useApp()
  const navigate = useNavigate()
  return async () => {
    await logout()
    toast({ type: 'info', title: 'Logged out', message: 'See you at your next session 👋' })
    navigate('/', { replace: true })
  }
}

/** Name + avatar + logout when signed in, or log-in / sign-up buttons when not. */
export default function UserMenu({ compact = false }) {
  const { user, authLoading } = useApp()
  const handleLogout = useLogout()

  if (authLoading) return <span className="skeleton h-9 w-24 rounded-full" aria-hidden="true" />

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link to="/login" className={`btn-ghost !py-2.5 ${compact ? '!px-3' : ''}`}>
          <LogIn className="h-4 w-4" /> <span className={compact ? 'hidden min-[380px]:inline' : ''}>Log in</span>
        </Link>
        {!compact && <Link to="/signup" className="btn-primary hidden !py-2.5 sm:inline-flex">Sign up</Link>}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Link to="/profile" className="flex items-center gap-2 rounded-full p-0.5 pr-2 transition hover:bg-fg/5" aria-label="Your profile">
        <Avatar initials={user.initials} />
        <span className={`text-sm font-semibold ${compact ? 'hidden min-[400px]:inline' : ''}`}>{user.firstName}</span>
      </Link>
      <button onClick={handleLogout} className="btn-ghost !rounded-full !p-2.5" aria-label="Log out" title="Log out">
        <LogOut className="h-[18px] w-[18px]" />
      </button>
    </div>
  )
}
