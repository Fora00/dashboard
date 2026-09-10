import { useState, type ChangeEvent } from 'react'
import { Link } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, type ProjectStat } from '../../lib/db'
import { projects, type ProjectMeta } from '../../lib/projects'
import { formatBytes } from '../../lib/format'
import { useOwner } from '../../lib/useOwner'
import { toggleStar } from '../../lib/projectStats'
import { Card } from '../../components/Card'
import { IosInstallHint } from '../../components/IosInstallHint'

// Local calendar-day key, matching the Habits project's own day boundary
// ('YYYY-MM-DD' in device local time — see habits/habitStore.ts).
function todayKey(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate(),
  ).padStart(2, '0')}`
}

// Within-group order shown in the home grid (starred/unstarred grouping is
// separate and always wins — see the sort in Home()). Persisted per-device
// as a UI preference, deliberately NOT a Dexie table: no schema bump for a
// value this small, and it never needs to sync.
type HomeOrder = 'used' | 'recent' | 'name' | 'default'
const HOME_ORDER_KEY = 'dashboard:home-order'

function isHomeOrder(value: string | null): value is HomeOrder {
  return value === 'used' || value === 'recent' || value === 'name' || value === 'default'
}

// Safari private mode / "block all cookies" makes localStorage access THROW
// rather than return null, and this runs on the app's entry point — an
// unguarded read here would white-screen the whole dashboard. A garbage or
// missing stored value falls back to 'used' (today's default behaviour).
function readStoredOrder(): HomeOrder {
  try {
    const stored = localStorage.getItem(HOME_ORDER_KEY)
    return isHomeOrder(stored) ? stored : 'used'
  } catch {
    return 'used'
  }
}

function storeOrder(order: HomeOrder): void {
  try {
    localStorage.setItem(HOME_ORDER_KEY, order)
  } catch {
    // Storage blocked — the choice just won't survive a reload this session.
  }
}

// Whether the selected mode runs backwards. A separate boolean rather than
// folding into HomeOrder as 'asc'/'desc': each mode has its own natural
// direction (most-first for 'used'/'recent', A-Z for 'name', registry order
// for 'default'), so "ascending" is ambiguous across modes while "reversed"
// is not. Same guarded persistence pattern as HOME_ORDER_KEY.
const HOME_REVERSED_KEY = 'dashboard:home-order-reversed'

function isReversedValue(value: string | null): value is 'true' | 'false' {
  return value === 'true' || value === 'false'
}

function readStoredReversed(): boolean {
  try {
    const stored = localStorage.getItem(HOME_REVERSED_KEY)
    return isReversedValue(stored) ? stored === 'true' : false
  } catch {
    return false
  }
}

function storeReversed(reversed: boolean): void {
  try {
    localStorage.setItem(HOME_REVERSED_KEY, reversed ? 'true' : 'false')
  } catch {
    // Storage blocked — the choice just won't survive a reload this session.
  }
}

// The dashboard home is itself the first "project": the entry point that
// surfaces every subproject and a live stat pulled from its data — an example
// of one project reading another project's data through the shared db.
export function Home() {
  const owner = useOwner()
  const visible = projects.filter((p) => !p.ownerOnly || owner)
  const stats = useLiveQuery(() => db.projectStats.toArray())
  const statsById = new Map<string, ProjectStat>((stats ?? []).map((s) => [s.id, s]))
  const [order, setOrder] = useState<HomeOrder>(() => readStoredOrder())
  const [reversed, setReversed] = useState<boolean>(() => readStoredReversed())

  function handleOrderChange(e: ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value
    if (!isHomeOrder(next)) return
    setOrder(next)
    storeOrder(next)
  }

  function handleReversedToggle() {
    const next = !reversed
    setReversed(next)
    storeReversed(next)
  }

  // Within-group comparator for the selected mode. Deliberately excludes the
  // starred/unstarred split — that's handled by sorting the two groups
  // separately below, which is what lets reversal flip each group on its own
  // while keeping the starred block pinned above the unstarred block.
  const compareWithinGroup = (a: ProjectMeta, b: ProjectMeta): number => {
    const sa = statsById.get(a.id)
    const sb = statsById.get(b.id)
    switch (order) {
      case 'recent':
        // A never-opened project has no row — treat it as 0 so it sorts last.
        return (sb?.lastOpenedAt ?? 0) - (sa?.lastOpenedAt ?? 0)
      case 'name':
        return a.name.localeCompare(b.name)
      case 'default':
        // Registry order — let the stable sort's tie-breaking do the work.
        return 0
      case 'used':
      default:
        return (sb?.opens ?? 0) - (sa?.opens ?? 0)
    }
  }

  // Starred first — always, in every mode, reversed or not — then the
  // selected within-group order. Each group is sorted (stable, so ties —
  // including the all-zero fresh-device case and 'default' mode's always-0
  // comparator — keep the registry's hand-curated order from
  // src/lib/projects.ts) and, when reversed, reversed independently before
  // the two groups are re-concatenated. Reversing a comparator's sign instead
  // would be a no-op for 'default' (0 negates to 0) and wouldn't visibly
  // flip tied entries either, which is why this reverses the OUTPUT instead.
  // While stats are still loading, render the registry order untouched —
  // reversal doesn't apply to that fallback.
  const ordered: ProjectMeta[] =
    stats === undefined
      ? visible
      : (() => {
          const starredGroup = visible
            .filter((p) => statsById.get(p.id)?.starred === 1)
            .sort(compareWithinGroup)
          const unstarredGroup = visible
            .filter((p) => statsById.get(p.id)?.starred !== 1)
            .sort(compareWithinGroup)
          if (reversed) {
            starredGroup.reverse()
            unstarredGroup.reverse()
          }
          return [...starredGroup, ...unstarredGroup]
        })()
  const fileStats = useLiveQuery(async () => {
    const files = await db.files.toArray()
    return {
      count: files.length,
      bytes: files.reduce((sum, f) => sum + f.size, 0),
    }
  })
  const shopStats = useLiveQuery(async () => {
    const open = await db.shopItems.where('done').equals(0).count()
    return { open }
  })
  const todoStats = useLiveQuery(async () => {
    const open = await db.todos.where('done').equals(0).count()
    return { open }
  })
  const habitStats = useLiveQuery(async () => {
    const habits = await db.habits.toArray()
    const active = habits.filter((h) => h.archivedAt === undefined)
    if (active.length === 0) return { remaining: 0 }
    const checksToday = await db.habitChecks.where('day').equals(todayKey()).toArray()
    const doneIds = new Set(checksToday.map((c) => c.habitId))
    return { remaining: active.filter((h) => !doneIds.has(h.id)).length }
  })
  const linksStats = useLiveQuery(async () => {
    const unread = await db.links.where('read').equals(0).count()
    return { unread }
  })

  const statFor = (id: string): string | null => {
    if (id === 'local-transfer' && fileStats) {
      return fileStats.count === 0
        ? 'No files yet'
        : `${fileStats.count} file${fileStats.count === 1 ? '' : 's'} · ${formatBytes(fileStats.bytes)}`
    }
    return null
  }

  // Small live counts shown as a pill on the tile; hidden entirely at zero.
  const badgeFor = (id: string): number | null => {
    if (id === 'shop-list') return shopStats && shopStats.open > 0 ? shopStats.open : null
    if (id === 'todo') return todoStats && todoStats.open > 0 ? todoStats.open : null
    if (id === 'habits') return habitStats && habitStats.remaining > 0 ? habitStats.remaining : null
    if (id === 'links') return linksStats && linksStats.unread > 0 ? linksStats.unread : null
    return null
  }

  return (
    <div>
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
        <div className="flex items-center gap-2">
          <select
            value={order}
            onChange={handleOrderChange}
            aria-label="Sort projects by"
            className="min-h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-indigo-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          >
            <option value="used">Most used</option>
            <option value="recent">Recently opened</option>
            <option value="name">Name</option>
            <option value="default">Default order</option>
          </select>
          <button
            type="button"
            onClick={handleReversedToggle}
            aria-pressed={reversed}
            aria-label={reversed ? 'Restore normal order' : 'Reverse order'}
            className="flex min-h-10 min-w-10 items-center justify-center rounded-lg border border-slate-300 bg-white text-base text-slate-700 transition-colors hover:bg-slate-100 active:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            {reversed ? '↑' : '↓'}
          </button>
        </div>
      </div>
      <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
        Everything lives on this device and works offline. Sign in to sync
        across devices.
      </p>
      <IosInstallHint />
      <div className="grid gap-4 sm:grid-cols-2">
        {ordered.map((p) => {
          const starred = statsById.get(p.id)?.starred === 1
          return (
            <div key={p.id} className="relative">
              <button
                type="button"
                onClick={() => void toggleStar(p.id)}
                aria-pressed={starred}
                aria-label={starred ? `Unstar ${p.name}` : `Star ${p.name}`}
                className="absolute right-1 top-1 z-10 flex h-10 w-10 items-center justify-center rounded-full text-xl text-slate-400 hover:bg-slate-200/60 active:bg-slate-300/60 dark:text-slate-500 dark:hover:bg-slate-700/60 dark:active:bg-slate-600/60"
              >
                {starred ? <span className="text-amber-500 dark:text-amber-400">★</span> : '☆'}
              </button>
              <Link to={p.path} className="group">
                <Card className="h-full transition-colors group-hover:border-slate-400 group-active:bg-slate-100 dark:group-hover:border-slate-600 dark:group-active:bg-slate-800">
                  <div className="mb-2 flex items-center justify-between pr-10">
                    <span className="text-3xl">{p.emoji}</span>
                    {p.status === 'planned' ? (
                      <span className="rounded-full bg-slate-200 px-2.5 py-1 text-xs text-slate-500 dark:bg-slate-700/60 dark:text-slate-400">
                        planned
                      </span>
                    ) : (
                      badgeFor(p.id) !== null && (
                        <span className="rounded-full bg-indigo-500/20 px-2.5 py-1 text-xs font-medium text-indigo-600 dark:text-indigo-300">
                          {badgeFor(p.id)}
                        </span>
                      )
                    )}
                  </div>
                  <h2 className="font-semibold">{p.name}</h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{p.description}</p>
                  {statFor(p.id) && (
                    <p className="mt-3 text-xs font-medium text-indigo-600 dark:text-indigo-400">{statFor(p.id)}</p>
                  )}
                </Card>
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}
