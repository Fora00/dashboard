import { useEffect, useRef } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { OnlineBadge } from './OnlineBadge'
import { OfflineBanner } from './OfflineBanner'
import { UpdateToast } from './UpdateToast'
import { projects } from '../lib/projects'
import { recordOpen } from '../lib/projectStats'

export function Layout() {
  const location = useLocation()
  const lastCounted = useRef<string | null>(null)

  // Count an "open" wherever the user arrives from — card tap, deep link,
  // back/forward navigation, and the PWA start URL all land here since every
  // route renders through this Layout. The ref guards StrictMode's dev-only
  // double-invocation without preventing a real re-visit of the same path
  // from counting again.
  useEffect(() => {
    if (lastCounted.current === location.pathname) return
    lastCounted.current = location.pathname
    const p = projects.find((p) => p.path === location.pathname)
    if (p) void recordOpen(p.id)
  }, [location.pathname])

  return (
    <div className="min-h-dvh bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <Link to="/" className="text-lg font-semibold tracking-tight">
            <span className="mr-2">🏠</span>Dashboard
          </Link>
          <OnlineBadge />
        </div>
      </header>
      <OfflineBanner />
      <main className="mx-auto max-w-3xl px-4 py-6 pb-16">
        <Outlet />
      </main>
      <UpdateToast />
    </div>
  )
}
