import { Link, Outlet } from 'react-router-dom'
import { OnlineBadge } from './OnlineBadge'

export function Layout() {
  return (
    <div className="min-h-dvh bg-slate-900 text-slate-100">
      <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-900/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <Link to="/" className="text-lg font-semibold tracking-tight">
            <span className="mr-2">🏠</span>Dashboard
          </Link>
          <OnlineBadge />
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-6 pb-16">
        <Outlet />
      </main>
    </div>
  )
}
