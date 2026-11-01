// Tiny fetch wrapper for our /api routes. The browser never sees database credentials.
import { useCallback, useEffect, useRef, useState } from 'react'

export class ApiError extends Error {
  constructor(message, status, code) {
    super(message)
    this.status = status
    this.code = code
  }
}

const SERVER_DOWN = 'Can’t reach the PulseFit server. Make sure `npm run dev` is running, then try again.'

const pad = (n) => String(n).padStart(2, '0')
export const localDate = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

export async function api(path, { method = 'GET', body } = {}) {
  let res
  try {
    res = await fetch(path, {
      method,
      credentials: 'same-origin',
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError(SERVER_DOWN, 0, 'NETWORK')
  }

  let data = null
  try {
    data = await res.json()
  } catch {
    /* non-JSON response (e.g. proxy error) */
  }
  if (!res.ok) {
    if (!data) throw new ApiError(SERVER_DOWN, res.status, 'NETWORK')
    throw new ApiError(data.error || 'Something went wrong. Please try again.', res.status, data.code)
  }
  return data
}

/** Loads data from the API with loading / error state. */
export function useResource(path) {
  const [state, setState] = useState({ data: null, error: null, loading: true })
  const alive = useRef(true)

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }))
    try {
      const data = await api(path)
      if (alive.current) setState({ data, error: null, loading: false })
    } catch (error) {
      if (alive.current) setState({ data: null, error, loading: false })
    }
  }, [path])

  useEffect(() => {
    alive.current = true
    load()
    return () => {
      alive.current = false
    }
  }, [load])

  const setData = useCallback((fn) => setState((s) => ({ ...s, data: typeof fn === 'function' ? fn(s.data) : fn })), [])
  return { ...state, reload: load, setData }
}
