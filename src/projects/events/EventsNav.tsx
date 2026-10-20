import { NavLink } from 'react-router-dom'
import { FOCUS_RING } from '../../components/focus'

const TABS = [
  ['/events', 'Events'],
  ['/events/shows', 'Spettacoli'],
] as const

/** The two pages of the project, side by side: the event list and the shows (cinema, theatre, concerts). */
export function EventsNav() {
  return (
    <nav aria-label="Events sections" className="mb-4 grid grid-cols-2 gap-2">
      {TABS.map(([to, label]) => (
        <NavLink
          key={to}
          to={to}
          end
          className={({ isActive }) =>
            `flex min-h-10 items-center justify-center rounded-lg px-2 text-sm font-medium transition-colors ${FOCUS_RING} ${
              isActive
                ? 'bg-(color:--accent-selected) text-(color:--accent-fg)'
                : 'bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
            }`
          }
        >
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
