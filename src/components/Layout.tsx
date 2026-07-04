import { Link, Outlet } from 'react-router-dom'
import { OnlineBadge } from './OnlineBadge'
import { OfflineBanner } from './OfflineBanner'
import { UpdateToast } from './UpdateToast'

export function Layout() {
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
