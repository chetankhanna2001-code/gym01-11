import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import ErrorState from './ErrorState'
import Page from './Page'
import { SkeletonCard } from './Skeleton'

/** Gate for pages that need a logged-in user. */
export default function RequireAuth() {
  const { user, authLoading, authError, refreshUser } = useApp()
  const location = useLocation()

  if (authLoading) {
    return (
      <Page>
        <div className="grid gap-5 lg:grid-cols-3">
          <SkeletonCard className="h-64 lg:col-span-2" />
          <SkeletonCard className="h-64" />
        </div>
      </Page>
    )
  }
  if (authError) {
    return (
      <Page className="py-10">
        <ErrorState error={authError} onRetry={refreshUser} />
      </Page>
    )
  }
  if (!user) return <Navigate to={`/login?next=${encodeURIComponent(location.pathname)}`} replace />
  return <Outlet />
}

/** Login / sign-up pages: bounce logged-in users to the dashboard. */
export function GuestOnly({ children }) {
  const { user, authLoading } = useApp()
  if (!authLoading && user) return <Navigate to="/dashboard" replace />
  return children
}
