import { Link, useLocation } from 'react-router-dom'
import type { ProjectMeta } from '../lib/projects'
import { activeProjectId, isHomePath, navSections } from '../lib/navModel'
import { setSidebarCollapsed, useSidebarCollapsed } from '../lib/useSidebarCollapsed'
import { useVisibleProjects } from '../lib/useVisibleProjects'
import { comboLabel } from '../lib/useHotkey'
import { FOCUS_RING_INSET } from './focus'
import { HelpButton } from './HelpButton'
import { OnlineBadge } from './OnlineBadge'
import { ProjectIcon } from './ProjectIcon'

// App shell sidebar (UI1). Rendered only from lg (1024px) up — Layout hides it
// with CSS below that, so phones and iPad portrait keep the plain header. The
// list is Home's (useVisibleProjects + groupByArea), in registry order.
// Collapsed = icon-only rail, a per-device preference (shared state, so the
// `[` hotkey and the button agree: lib/useSidebarCollapsed.ts).
const ITEM =
  'relative flex min-h-10 items-center gap-3 rounded-lg text-sm transition-colors hover:bg-slate-200/60 active:bg-slate-300/60 dark:hover:bg-slate-800 dark:active:bg-slate-700'
const ITEM_ACTIVE =
  'bg-(--accent-soft) font-semibold text-slate-900 hover:bg-(--accent-soft) dark:text-white dark:hover:bg-(--accent-soft)'
const FOOT_BTN = `flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-200/60 active:bg-slate-300/60 dark:text-slate-400 dark:hover:bg-slate-800 dark:active:bg-slate-700 ${FOCUS_RING_INSET}`
const ITEM_IDLE = 'text-slate-700 dark:text-slate-300'

// Accent bar on the left edge of the active entry (the route's area colour
// fading into the project's own, like the header line).
function ActiveBar() {
  return (
    <span
      aria-hidden="true"
      className="absolute inset-y-1.5 left-0 w-1 rounded-full"
      style={{
        backgroundImage: 'linear-gradient(180deg, var(--accent), var(--accent-2))',
      }}
    />
  )
}

export function Sidebar({ onOpenPalette, onOpenHelp }: { onOpenPalette: () => void; onOpenHelp: () => void }) {
  const { pathname } = useLocation()
  const { visible, permitted, isStarred } = useVisibleProjects()
  const collapsed = useSidebarCollapsed()
  const activeId = activeProjectId(pathname)
  // A permitted but hidden project you are on still shows (extra entry).
  const current = permitted.find((p) => p.id === activeId) ?? null
  const sections = navSections(visible, isStarred, current)
  const homeActive = isHomePath(pathname)

  function renderItem(p: ProjectMeta) {
    const active = p.id === activeId
    return (
      <li key={p.id}>
        <Link
          to={p.path}
          aria-current={active ? 'page' : undefined}
          aria-label={collapsed ? p.name : undefined}
          title={collapsed ? p.name : undefined}
          className={`${ITEM} ${collapsed ? 'justify-center px-0' : 'px-3'} ${active ? ITEM_ACTIVE : ITEM_IDLE} ${FOCUS_RING_INSET}`}
        >
          {active && <ActiveBar />}
          <ProjectIcon project={p} size="sm" />
          {!collapsed && <span className="truncate">{p.name}</span>}
        </Link>
      </li>
    )
  }

  return (
    <aside
      // Sticky, full viewport height minus the safe areas (body already pads
      // them), with its own scroll. Hidden below lg.
      className={`sticky hidden shrink-0 flex-col border-r border-slate-200 bg-white/70 dark:border-slate-800 dark:bg-slate-900/70 lg:flex ${
        collapsed ? 'w-16' : 'w-64'
      }`}
      style={{
        top: 'env(safe-area-inset-top)',
        height: 'calc(100dvh - env(safe-area-inset-top) - env(safe-area-inset-bottom))',
      }}
    >
      <div
        className={`flex items-center gap-1 border-b border-slate-200 p-2 dark:border-slate-800 ${collapsed ? 'flex-col' : ''}`}
      >
        <Link
          to="/"
          aria-current={homeActive ? 'page' : undefined}
          aria-label={collapsed ? 'Dashboard home' : undefined}
          title={collapsed ? 'Dashboard' : undefined}
          className={`${ITEM} min-w-10 flex-1 text-lg font-semibold tracking-tight ${collapsed ? 'justify-center px-0' : 'px-3'} ${
            homeActive ? ITEM_ACTIVE : 'text-slate-900 dark:text-slate-100'
          } ${FOCUS_RING_INSET}`}
        >
          {homeActive && <ActiveBar />}
          <span aria-hidden="true">🏠</span>
          {!collapsed && <span>Dashboard</span>}
        </Link>
        <button
          type="button"
          onClick={() => setSidebarCollapsed(!collapsed)}
          aria-pressed={collapsed}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-200/60 active:bg-slate-300/60 dark:text-slate-400 dark:hover:bg-slate-800 dark:active:bg-slate-700 ${FOCUS_RING_INSET}`}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            width={18}
            height={18}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M9 3v18" />
            <path d={collapsed ? 'm14 9 3 3-3 3' : 'm16 15-3-3 3-3'} />
          </svg>
        </button>
      </div>

      <nav aria-label="Projects" className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2">
        {sections.map((section, i) => {
          const headingId = `nav-section-${section.id}`
          return (
            <div key={section.id} className={i > 0 ? 'mt-4' : ''}>
              {collapsed ? (
                // Rail: the heading stays for screen readers; a hairline
                // separates the groups visually.
                <>
                  <span id={headingId} className="sr-only">
                    {section.title}
                  </span>
                  {i > 0 && (
                    <div aria-hidden="true" className="mx-3 mb-3 border-t border-slate-200 dark:border-slate-800" />
                  )}
                </>
              ) : (
                <p
                  id={headingId}
                  className="mb-1 flex items-center gap-2 px-3 text-xs font-semibold text-slate-500 dark:text-slate-400"
                >
                  {section.color === null ? (
                    <span aria-hidden="true" className="text-amber-500 dark:text-amber-400">
                      ★
                    </span>
                  ) : (
                    <span
                      aria-hidden="true"
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: section.color }}
                    />
                  )}
                  <span className="truncate">{section.title}</span>
                </p>
              )}
              <ul aria-labelledby={headingId} className="space-y-0.5">
                {section.projects.map(renderItem)}
              </ul>
            </div>
          )
        })}
      </nav>

      <div
        className={`flex items-center gap-1 border-t border-slate-200 p-2 dark:border-slate-800 ${collapsed ? 'flex-col' : ''}`}
      >
        <OnlineBadge compact={collapsed} />
        <span className={collapsed ? '' : 'flex-1'} />
        <button
          type="button"
          onClick={onOpenPalette}
          aria-label="Search and commands"
          title={`Search and commands (${comboLabel('mod+k')})`}
          className={FOOT_BTN}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            width={18}
            height={18}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
        </button>
        <HelpButton onClick={onOpenHelp} placement={collapsed ? 'above-start' : 'above'} />
      </div>
    </aside>
  )
}
