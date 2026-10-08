import { Suspense, useEffect, useRef, type CSSProperties } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { ErrorBoundary } from './ErrorBoundary'
import { InstallHint } from './InstallHint'
import { OnlineBadge } from './OnlineBadge'
import { OfflineBanner } from './OfflineBanner'
import { SkeletonList } from './Skeleton'
import { UpdateToast } from './UpdateToast'
import { ErrorFlash } from './ErrorFlash'
import { projects } from '../lib/projects'
import { recordOpen } from '../lib/projectStats'
import { useHomeScreenMeta } from '../lib/homeScreenMeta'
import { useProjectAccent } from '../lib/useProjectAccent'
import { contentWidthClass, layoutForPath } from '../lib/navModel'
import { Sidebar } from './Sidebar'
import { FOCUS_RING } from './focus'

export function Layout() {
  const location = useLocation()
  const lastCounted = useRef<string | null>(null)
  // Project accent as CSS variables on the root (IC3), and the per-project
  // Home Screen icon/name experiment (IC4). Off-project: indigo defaults.
  const accent = useProjectAccent()
  useHomeScreenMeta(location.pathname)

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

  // A guest who just redeemed a project invite (JoinProject navigates here
  // with state.joined) lands on the project with the PWA install tip on top.
  // (Home mounts its own hint, so skip it there.)
  const justJoined = location.pathname !== '/' && (location.state as { joined?: boolean } | null)?.joined === true

  // Content width (UI1): narrow/wide per project from lg up, see navModel.ts.
  const layout = layoutForPath(location.pathname)
  const mainRef = useRef<HTMLElement>(null)

  return (
    <div
      style={accent?.vars as CSSProperties | undefined}
      className="accent-scope min-h-dvh bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100"
    >
      {/* Skip link: focuses <main> directly. A plain href="#main" would be
          read by HashRouter as a route change. */}
      <a
        href="#main-content"
        onClick={(e) => {
          e.preventDefault()
          mainRef.current?.focus()
        }}
        className={`sr-only z-50 rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-900 shadow focus:not-sr-only focus:fixed focus:left-4 focus:top-4 dark:bg-slate-800 dark:text-slate-100 ${FOCUS_RING}`}
      >
        Skip to content
      </a>
      {/* Shell (UI1): below lg (1024px) the header + one column, as before;
          from lg a persistent sidebar (Sidebar hides itself below lg) and the
          content area beside it. Width-driven only, no device sniffing. */}
      <div className="lg:flex">
        <Sidebar />
        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur lg:hidden dark:border-slate-800 dark:bg-slate-900/90">
            <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
              <Link to="/" className="text-lg font-semibold tracking-tight">
                <span className="mr-2">🏠</span>Dashboard
              </Link>
              <OnlineBadge />
            </div>
            {accent && (
              <div
                aria-hidden="true"
                className="absolute inset-x-0 -bottom-px h-0.5"
                style={{ backgroundImage: 'linear-gradient(90deg, var(--accent), var(--accent-2))' }}
              />
            )}
          </header>
          {/* lg+: no header (the sidebar carries title and status), but the
              2px accent line stays on top of the content area. */}
          {accent && (
            <div
              aria-hidden="true"
              className="sticky z-10 hidden h-0.5 lg:block"
              style={{
                top: 'env(safe-area-inset-top)',
                backgroundImage: 'linear-gradient(90deg, var(--accent), var(--accent-2))',
              }}
            />
          )}
          <OfflineBanner />
          {/* data-layout / layout-* class / --content-max let pages adapt to
              the column width. Deliberately NOT a container-type here: that
              would make <main> the containing block of the pages' fixed
              snackbars and FABs. Pages put @container on their own blocks. */}
          <main
            id="main-content"
            ref={mainRef}
            tabIndex={-1}
            data-layout={layout}
            style={
              { '--content-max': layout === 'wide' ? 'var(--container-6xl)' : 'var(--container-3xl)' } as CSSProperties
            }
            className={`layout-${layout} mx-auto w-full px-4 py-6 pb-16 focus:outline-none ${contentWidthClass(layout)}`}
          >
            <ErrorBoundary resetKey={location.pathname}>
              {justJoined && <InstallHint />}
              <Suspense fallback={<SkeletonList rows={5} rowClassName="h-14" />}>
                <Outlet />
              </Suspense>
            </ErrorBoundary>
          </main>
        </div>
      </div>
      <UpdateToast />
      <ErrorFlash />
    </div>
  )
}
