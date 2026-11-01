import { Route, Routes, useLocation } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import Layout from './components/Layout'
import RequireAuth, { GuestOnly } from './components/RequireAuth'
import Toaster from './components/Toaster'
import Classes from './pages/Classes'
import Dashboard from './pages/Dashboard'
import Landing from './pages/Landing'
import Library from './pages/Library'
import LiveWorkout from './pages/LiveWorkout'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import Profile from './pages/Profile'
import Progress from './pages/Progress'
import Signup from './pages/Signup'

export default function App() {
  const { pathname } = useLocation()
  return (
    <>
      <div className="backdrop-glow" aria-hidden="true" />
      <ErrorBoundary resetKey={pathname}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<GuestOnly><Login /></GuestOnly>} />
          <Route path="/signup" element={<GuestOnly><Signup /></GuestOnly>} />
          <Route element={<Layout />}>
            <Route element={<RequireAuth />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/library" element={<Library />} />
              <Route path="/workout" element={<LiveWorkout />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
            <Route path="/progress" element={<Progress />} />
            <Route path="/classes" element={<Classes />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </ErrorBoundary>
      <Toaster />
    </>
  )
}
