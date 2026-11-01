import { motion } from 'framer-motion'
import { CalendarDays, Dumbbell, Flame, LayoutDashboard, LogIn, LogOut, Timer, TrendingUp, User } from 'lucide-react'
import { useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Footer from './Footer'
import Logo from './Logo'
import ThemeToggle from './ThemeToggle'
import UserMenu, { Avatar, useLogout } from './UserMenu'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', short: 'Home', icon: LayoutDashboard },
  { to: '/library', label: 'Workout Library', short: 'Library', icon: Dumbbell },
  { to: '/workout', label: 'Live Workout', short: 'Train', icon: Timer, center: true },
  { to: '/progress', label: 'Progress', short: 'Progress', icon: TrendingUp },
  { to: '/classes', label: 'Class Booking', short: 'Classes', icon: CalendarDays },
  { to: '/profile', label: 'Profile', short: 'Profile', icon: User, desktopOnly: true },
]

function Sidebar() {
  const { user, userStats } = useApp()
  const handleLogout = useLogout()
  const streak = userStats?.streak ?? 0
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 flex-col border-r border-fg/[0.06] bg-bg/40 p-6 backdrop-blur-xl lg:flex">
      <Logo to="/" />
      <nav className="mt-10 flex flex-col gap-1" aria-label="Main">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className="relative">
            {({ isActive }) => (
              <span className={`relative flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${isActive ? 'text-fg' : 'text-muted hover:bg-fg/5 hover:text-fg'}`}>
                {isActive && (
                  <motion.span
                    layoutId="side-pill"
                    className="absolute inset-0 rounded-2xl border border-accent/25 bg-accent/10 shadow-glow"
                    transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                  />
                )}
                <Icon className={`relative h-5 w-5 ${isActive ? 'text-accent' : ''}`} />
                <span className="relative">{label}</span>
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto space-y-4">
        {user && (
          <div className="glass flex items-center gap-3 !rounded-2xl p-4">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-orange-500/15">
              <Flame className="h-6 w-6 animate-flicker text-orange-400" />
            </div>
            <div>
              <p className="font-display text-xl font-bold leading-none">{streak} {streak === 1 ? 'day' : 'days'}</p>
              <p className="mt-1 text-xs text-muted">{streak ? 'Current streak. Keep it lit!' : 'Finish a workout to start a streak.'}</p>
            </div>
          </div>
        )}
        <div className="flex items-center justify-between gap-2">
          {user ? (
            <Link to="/profile" className="flex min-w-0 items-center gap-3 rounded-xl p-1 pr-3 transition hover:bg-fg/5">
              <Avatar initials={user.initials} />
              <span className="min-w-0 text-sm">
                <span className="block truncate font-semibold leading-tight">{user.fullName}</span>
                <span className="block truncate text-xs text-muted">{user.email}</span>
              </span>
            </Link>
          ) : (
            <Link to="/login" className="btn-ghost !py-2.5">
              <LogIn className="h-4 w-4" /> Log in
            </Link>
          )}
          <div className="flex shrink-0 items-center gap-1">
            <ThemeToggle />
            {user && (
              <button onClick={handleLogout} className="btn-ghost !rounded-full !p-2.5" aria-label="Log out" title="Log out">
                <LogOut className="h-[18px] w-[18px]" />
              </button>
            )}
          </div>
        </div>
      </div>
    </aside>
  )
}

function MobileTopBar() {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-fg/[0.06] bg-bg/70 px-4 py-3 backdrop-blur-xl lg:hidden">
      <Logo size="sm" />
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <UserMenu compact />
      </div>
    </header>
  )
}

function BottomNav() {
  return (
    <nav
      className="glass fixed inset-x-3 bottom-3 z-40 grid grid-cols-5 items-end !rounded-[1.75rem] px-1.5 py-1.5 lg:hidden"
      style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="Main"
    >
      {navItems
        .filter((i) => !i.desktopOnly)
        .map(({ to, short, icon: Icon, center }) => (
          <NavLink key={to} to={to} className="flex justify-center">
            {({ isActive }) =>
              center ? (
                <span className="-mt-7 flex flex-col items-center gap-1">
                  <span className={`grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-volt to-aqua text-black shadow-glow transition-transform ${isActive ? 'scale-105' : ''}`}>
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className={`text-[10px] font-semibold ${isActive ? 'text-accent' : 'text-muted'}`}>{short}</span>
                </span>
              ) : (
                <span className={`relative flex w-full flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[10px] font-semibold transition-colors ${isActive ? 'text-accent' : 'text-muted'}`}>
                  {isActive && (
                    <motion.span
                      layoutId="bottom-pill"
                      className="absolute inset-0 rounded-2xl bg-accent/10"
                      transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                    />
                  )}
                  <Icon className="relative h-5 w-5" />
                  <span className="relative">{short}</span>
                </span>
              )
            }
          </NavLink>
        ))}
    </nav>
  )
}

export default function Layout() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [pathname])

  return (
    <div className="min-h-screen pb-28 lg:pb-0 lg:pl-72">
      <Sidebar />
      <MobileTopBar />
      <Outlet />
      <Footer compact />
      <BottomNav />
    </div>
  )
}
