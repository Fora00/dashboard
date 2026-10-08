import { type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../lib/db'
import { projects, type ProjectMeta } from '../../lib/projects'
import { usePersistedState, type Codec } from '../../lib/safeStorage'
import { eventWhen, habitProgress, lifeToday, nextEvents } from '../../lib/homeToday'
import { useAuth } from '../../lib/useAuth'
import { useOwner } from '../../lib/useOwner'
import { parseDayKey, weekKey } from '../life/model'
import { useToday } from '../life/useToday'
import { ProjectIcon } from '../../components/ProjectIcon'
import { FOCUS_RING_INSET } from '../../components/focus'

// Per-device toggle for the panel (default shown), same guarded pattern as the
// other dashboard:home-* preferences.
const HOME_TODAY_KEY = 'dashboard:home-today'

const shownCodec: Codec<boolean> = {
  parse: (raw) => (raw === 'false' ? false : true),
  serialize: (shown) => (shown ? 'true' : 'false'),
}

const byId = (id: string): ProjectMeta | undefined => projects.find((p) => p.id === id)

// Phones: a horizontally scrolling strip of compact cards. sm+: a grid.
const CARD =
  'group flex min-h-[4.5rem] w-40 shrink-0 snap-start flex-col justify-between gap-1 rounded-xl border border-slate-200 bg-white p-3 transition-colors hover:border-slate-400 active:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/50 dark:hover:border-slate-600 dark:active:bg-slate-800 sm:w-auto'

function TodayCard({
  project,
  title,
  to,
  wide = false,
  children,
}: {
  project?: ProjectMeta | undefined
  title: string
  to: string
  wide?: boolean
  children: ReactNode
}) {
  return (
    <Link to={to} className={`${CARD} ${FOCUS_RING_INSET} ${wide ? 'w-64 sm:col-span-2' : ''}`}>
      <span className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
        {project && <ProjectIcon project={project} size="sm" />}
        {title}
      </span>
      <span className="block text-sm text-slate-900 dark:text-slate-100">{children}</span>
    </Link>
  )
}

const Big = ({ children }: { children: ReactNode }) => (
  <span className="text-xl font-semibold tabular-nums">{children}</span>
)

function LifeCard({ project, today }: { project: ProjectMeta | undefined; today: string }) {
  const week = weekKey(parseDayKey(today))
  const data = useLiveQuery(async () => {
    const row = await db.lifeWeeks.get(week)
    if (!row) return null
    const entries = await db.lifeEntries.where('week').equals(week).toArray()
    return lifeToday(row.plan, entries, today)
  }, [week, today])
  if (!data || (data.focusTotal === 0 && data.trackers.length === 0)) return null
  return (
    <TodayCard project={project} title="Life" to="/life" wide>
      {data.focusTotal > 0 && (
        <span className="block">
          <Big>
            {data.focusDone}/{data.focusTotal}
          </Big>{' '}
          <span className="text-slate-500 dark:text-slate-400">focus</span>
          {data.focusOpen[0] && (
            <span className="block truncate text-xs text-slate-500 dark:text-slate-400">{data.focusOpen[0]}</span>
          )}
        </span>
      )}
      {data.trackers.length > 0 && (
        <span className="mt-1 block truncate text-xs text-slate-600 dark:text-slate-300">
          {data.trackers
            .slice(0, 3)
            .map((t) => `${t.emoji} ${t.total}/${t.target}`)
            .join('  ')}
        </span>
      )}
    </TodayCard>
  )
}

// Home's "Today" panel: live local summary, every card optional.
export function TodayPanel({ visibleIds }: { visibleIds: ReadonlySet<string> }) {
  const [shown, setShown] = usePersistedState<boolean>(HOME_TODAY_KEY, true, undefined, shownCodec)
  const today = useToday()
  const owner = useOwner()
  const session = useAuth()

  const habits = useLiveQuery(async () => {
    const [list, checks] = await Promise.all([db.habits.toArray(), db.habitChecks.where('day').equals(today).toArray()])
    return habitProgress(list, checks, today)
  }, [today])
  const openTodos = useLiveQuery(() => db.todos.where('done').equals(0).count())
  const events = useLiveQuery(async () => {
    const cache = await db.eventsCache.get('latest')
    if (!cache) return []
    const now = Date.now()
    return nextEvents(cache.file.events, now, 3).map((e) => ({ id: e.id, title: e.title, when: eventWhen(e, now) }))
  }, [today])
  const pending = useLiveQuery(() => db.outbox.count())

  const showHabits = visibleIds.has('habits') && habits !== undefined && habits.total > 0
  const showTodos = visibleIds.has('todo') && openTodos !== undefined && openTodos > 0
  const showEvents = visibleIds.has('events') && events !== undefined && events.length > 0
  const showLife = owner === true && visibleIds.has('life')
  const showSync = session !== null && session !== undefined && pending !== undefined && pending > 0

  const toggle = (
    <button
      type="button"
      onClick={() => setShown(!shown)}
      aria-expanded={shown}
      className={`min-h-10 rounded-lg px-3 text-sm text-slate-500 hover:text-slate-700 active:bg-slate-200/60 dark:text-slate-400 dark:hover:text-slate-200 dark:active:bg-slate-700/60 ${FOCUS_RING_INSET}`}
    >
      {shown ? 'Hide' : 'Show Today'}
    </button>
  )

  if (!shown) return <div className="mb-4 flex justify-end">{toggle}</div>
  // Nothing to show at all: no empty frame, just the toggle-free page.
  if (!showHabits && !showTodos && !showEvents && !showLife && !showSync) return null

  return (
    <section aria-labelledby="home-today" className="mb-6">
      <div className="mb-1 flex items-center justify-between">
        <h2 id="home-today" className="text-sm font-semibold text-slate-600 dark:text-slate-300">
          Today
        </h2>
        {toggle}
      </div>
      <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
        {showHabits && habits && (
          <TodayCard project={byId('habits')} title="Habits" to="/habits">
            <Big>
              {habits.done}/{habits.total}
            </Big>{' '}
            <span className="text-slate-500 dark:text-slate-400">
              {habits.done === habits.total ? 'all done' : 'done'}
            </span>
          </TodayCard>
        )}
        {showTodos && (
          <TodayCard project={byId('todo')} title="To-do" to="/todo">
            <Big>{openTodos}</Big> <span className="text-slate-500 dark:text-slate-400">open</span>
          </TodayCard>
        )}
        {showEvents && (
          <TodayCard project={byId('events')} title="Next events" to="/events" wide>
            <span className="block space-y-0.5">
              {events.map((e) => (
                <span key={e.id} className="flex items-baseline gap-2">
                  <span className="shrink-0 text-xs tabular-nums text-slate-500 dark:text-slate-400">{e.when}</span>
                  <span className="truncate">{e.title}</span>
                </span>
              ))}
            </span>
          </TodayCard>
        )}
        {showLife && <LifeCard project={byId('life')} today={today} />}
        {showSync && (
          <TodayCard title="Sync" to="/settings">
            <Big>{pending}</Big> <span className="text-slate-500 dark:text-slate-400">pending</span>
          </TodayCard>
        )}
      </div>
    </section>
  )
}
