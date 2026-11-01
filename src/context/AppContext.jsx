import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { api, localDate } from '../lib/api'

const AppContext = createContext(null)

const read = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}
const write = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage unavailable: state still works in memory */
  }
}

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('pulsefit-theme') || 'dark'
    } catch {
      return 'dark'
    }
  })
  const [booked, setBooked] = useState(() => read('pulsefit-booked', ['Thu-2']))
  const [toasts, setToasts] = useState([])
  const [auth, setAuth] = useState({ user: null, stats: null, loading: true, error: null })

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light')
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#F2F5EE' : '#06080B')
    try {
      localStorage.setItem('pulsefit-theme', theme)
    } catch {
      /* ignore */
    }
  }, [theme])

  useEffect(() => {
    write('pulsefit-booked', booked)
  }, [booked])

  const dismiss = useCallback((id) => setToasts((ts) => ts.filter((t) => t.id !== id)), [])

  const toast = useCallback(
    ({ type = 'success', title, message, duration = 3800 }) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`
      setToasts((ts) => [...ts.slice(-3), { id, type, title, message }])
      setTimeout(() => dismiss(id), duration)
    },
    [dismiss],
  )

  const refreshUser = useCallback(async () => {
    try {
      const data = await api(`/api/auth/me?date=${localDate()}`)
      setAuth({ user: data.user, stats: data.stats ?? null, loading: false, error: null })
    } catch (error) {
      setAuth({ user: null, stats: null, loading: false, error })
    }
  }, [])

  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  const login = useCallback(
    async (email, password) => {
      await api('/api/auth/login', { method: 'POST', body: { email, password } })
      await refreshUser()
    },
    [refreshUser],
  )

  const signup = useCallback(
    async (details) => {
      await api('/api/auth/signup', { method: 'POST', body: details })
      await refreshUser()
    },
    [refreshUser],
  )

  const logout = useCallback(async () => {
    try {
      await api('/api/auth/logout', { method: 'POST' })
    } finally {
      setAuth({ user: null, stats: null, loading: false, error: null })
    }
  }, [])

  const toggleTheme = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), [])
  const bookClass = useCallback((id) => setBooked((b) => (b.includes(id) ? b : [...b, id])), [])
  const cancelBooking = useCallback((id) => setBooked((b) => b.filter((x) => x !== id)), [])

  const value = useMemo(
    () => ({
      theme, toggleTheme, booked, bookClass, cancelBooking, toasts, toast, dismiss,
      user: auth.user, userStats: auth.stats, authLoading: auth.loading, authError: auth.error,
      login, signup, logout, refreshUser,
    }),
    [theme, toggleTheme, booked, bookClass, cancelBooking, toasts, toast, dismiss, auth, login, signup, logout, refreshUser],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>')
  return ctx
}

export function useChartColors() {
  const { theme } = useApp()
  return theme === 'light'
    ? { a: '#4D7C0F', b: '#0E7490', c: '#7C3AED', grid: 'rgba(15,23,42,0.08)', muted: '#64748B', cursor: 'rgba(15,23,42,0.05)' }
    : { a: '#C6FF3D', b: '#22E1FF', c: '#A78BFA', grid: 'rgba(255,255,255,0.06)', muted: '#94A3B8', cursor: 'rgba(255,255,255,0.04)' }
}
