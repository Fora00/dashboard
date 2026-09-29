import { useEffect, useMemo, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, type EventMark } from '../../lib/db'
import { PageHeader } from '../../components/PageHeader'
import { EmptyState } from '../../components/EmptyState'
import { Button } from '../../components/Button'
import { SkeletonList } from '../../components/Skeleton'
import { EventCard } from './EventCard'
import type { EventItem } from './types'
import {
  CATEGORIES,
  categoryLabel,
  categoryOf,
  fetchEventsFile,
  groupByDay,
  isLongRunning,
  isOngoingNow,
  isOver,
  relativeTime,
  type DayGroup,
} from './model'

type View = 'all' | 'open' | 'saved'
const PAGE = 60

const CHIP_BASE =
  'min-h-10 shrink-0 rounded-full border-2 px-3.5 text-xs font-medium whitespace-nowrap transition-colors'
const CHIP_ON =
  'border-indigo-700 bg-indigo-600 text-white dark:border-indigo-300 dark:bg-indigo-500 dark:text-white'
const CHIP_OFF =
  'border-slate-200 bg-white text-slate-600 hover:bg-slate-100 active:bg-slate-200 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-800'

function byStart(a: EventItem, b: EventItem): number {
  return Date.parse(a.start) - Date.parse(b.start) || a.title.localeCompare(b.title)
}

export function Events() {
  const cache = useLiveQuery(() => db.eventsCache.get('latest'), [], null)
  const marksRaw = useLiveQuery(() => db.eventMarks.toArray())
  const prefs = useLiveQuery(() => db.eventPrefs.get('prefs'), [], null)

  const [fetchState, setFetchState] = useState<'loading' | 'ok' | 'offline' | 'missing'>('loading')
  const [view, setView] = useState<View>('all')
  // null = "not touched": the favourites (if any) are the default filter.
  const [selectedCats, setSelectedCats] = useState<string[] | null>(null)
  const [selectedCities, setSelectedCities] = useState<string[]>([])
  const [showHidden, setShowHidden] = useState(false)
  const [editFavs, setEditFavs] = useState(false)
  const [showSources, setShowSources] = useState(false)
  const [limit, setLimit] = useState(PAGE)
  // The clock is read once per mount/refresh, not on every render.
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    let cancelled = false
    void (async () => {
      const out = await fetchEventsFile()
      if (cancelled) return
      if (out.kind === 'ok') {
        await db.eventsCache.put({ id: 'latest', file: out.file, fetchedAt: Date.now() })
        setNow(Date.now())
        setFetchState('ok')
      } else {
        setFetchState(out.kind)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const marks = useMemo(() => new Map<string, EventMark>((marksRaw ?? []).map((m) => [m.id, m])), [marksRaw])
  const favourites = useMemo(() => prefs?.favouriteCategories ?? [], [prefs])
  const activeCats = selectedCats ?? favourites

  const file = cache?.file
  const events = useMemo(() => file?.events ?? [], [file])

  // Base list of the current view, before category/city filters.
  const base = useMemo(() => {
    if (view === 'saved') {
      const live = new Map(events.map((e) => [e.id, e]))
      return (marksRaw ?? [])
        .filter((m) => m.state === 'saved')
        .map((m) => live.get(m.id) ?? m.event)
        .sort(byStart)
    }
    const list = events.filter((e) => {
      if (isOver(e, now)) return false
      if (!showHidden && marks.get(e.id)?.state === 'hidden') return false
      if (view === 'open') return isOngoingNow(e, now)
      return true
    })
    return list
  }, [view, events, marksRaw, marks, now, showHidden])

  const cityCounts = useMemo(() => {
    const m = new Map<string, number>()
    for (const e of base) m.set(e.city, (m.get(e.city) ?? 0) + 1)
    return [...m.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  }, [base])

  // Category counts respect the city filter but not the category filter.
  const catCounts = useMemo(() => {
    const m = new Map<string, number>()
    for (const e of base) {
      if (selectedCities.length && !selectedCities.includes(e.city)) continue
      m.set(categoryOf(e), (m.get(categoryOf(e)) ?? 0) + 1)
    }
    return m
  }, [base, selectedCities])

  const catOrder = useMemo(() => {
    const ids = CATEGORIES.map((c) => c.id)
    const rank = (id: string) => (favourites.includes(id) ? 0 : 1)
    return ids.sort((a, b) => rank(a) - rank(b) || (catCounts.get(b) ?? 0) - (catCounts.get(a) ?? 0))
  }, [favourites, catCounts])

  const filtered = useMemo(
    () =>
      base.filter(
        (e) =>
          (activeCats.length === 0 || activeCats.includes(categoryOf(e))) &&
          (selectedCities.length === 0 || selectedCities.includes(e.city)),
      ),
    [base, activeCats, selectedCities],
  )

  // Flat, ordered list of groups; then cut to `limit` cards in total.
  const groups = useMemo(() => {
    const out: DayGroup[] = []
    if (view === 'all') {
      const running = filtered
        .filter((e) => isLongRunning(e, now))
        .sort((a, b) => Date.parse(a.end ?? a.start) - Date.parse(b.end ?? b.start))
      if (running.length) out.push({ key: 'open-now', label: 'Open now', events: running })
      out.push(...groupByDay(filtered.filter((e) => !isLongRunning(e, now)), now))
    } else if (view === 'open') {
      const running = [...filtered].sort(
        (a, b) => Date.parse(a.end ?? a.start) - Date.parse(b.end ?? b.start),
      )
      if (running.length) out.push({ key: 'open-now', label: 'Open now', events: running })
    } else {
      out.push(...groupByDay(filtered, now))
    }
    return out
  }, [filtered, view, now])

  const total = groups.reduce((n, g) => n + g.events.length, 0)
  const visibleGroups = useMemo(() => {
    let left = limit
    const out: DayGroup[] = []
    for (const g of groups) {
      if (left <= 0) break
      out.push({ ...g, events: g.events.slice(0, left) })
      left -= g.events.length
    }
    return out
  }, [groups, limit])

  function resetLimit() {
    setLimit(PAGE)
  }

  function toggleCat(id: string) {
    setSelectedCats((cur) => {
      const c = cur ?? favourites
      return c.includes(id) ? c.filter((x) => x !== id) : [...c, id]
    })
    resetLimit()
  }

  function toggleCity(city: string) {
    setSelectedCities((cur) => (cur.includes(city) ? cur.filter((c) => c !== city) : [...cur, city]))
    resetLimit()
  }

  async function toggleFavourite(id: string) {
    const next = favourites.includes(id) ? favourites.filter((c) => c !== id) : [...favourites, id]
    await db.eventPrefs.put({ id: 'prefs', favouriteCategories: next })
  }

  async function setMark(e: EventItem, state: EventMark['state']) {
    if (marks.get(e.id)?.state === state) await db.eventMarks.delete(e.id)
    else await db.eventMarks.put({ id: e.id, state, event: e, updatedAt: Date.now() })
  }

  const failed = file?.sources.filter((s) => !s.ok) ?? []
  const filtering = activeCats.length > 0 || selectedCities.length > 0

  const header = (
    <PageHeader
      emoji="📍"
      title="Events"
      subtitle={
        file
          ? `${events.length} events · updated ${relativeTime(file.generatedAt, now)}`
          : 'Public events around Trentino, Bolzano and Verona.'
      }
    />
  )

  if (cache === null || prefs === null || marksRaw === undefined) {
    return (
      <div>
        {header}
        <SkeletonList rows={4} rowClassName="h-24" />
      </div>
    )
  }

  if (!file) {
    return (
      <div>
        {header}
        {fetchState === 'loading' ? (
          <SkeletonList rows={4} rowClassName="h-24" />
        ) : fetchState === 'missing' ? (
          <EmptyState
            emoji="📍"
            title="No events file found"
            hint="In dev, run `npm run events:crawl` once to create it. When deployed, events load when you are online."
          />
        ) : (
          <EmptyState
            emoji="📡"
            title="Events load when you are online"
            hint="Nothing is saved on this device yet. Connect once and they will be kept for offline use."
          />
        )}
      </div>
    )
  }

  return (
    <div>
      {header}

      {fetchState === 'offline' && (
        <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
          Offline — showing copy from {new Date(cache?.fetchedAt ?? 0).toLocaleDateString('it-IT')}
        </p>
      )}
      {failed.length > 0 && (
        <div className="mb-3 text-xs text-slate-500 dark:text-slate-400">
          <button
            type="button"
            onClick={() => setShowSources((v) => !v)}
            aria-expanded={showSources}
            className="min-h-10 text-left underline"
          >
            {failed.length} {failed.length === 1 ? 'source' : 'sources'} failed — showing their last events
          </button>
          {showSources && (
            <ul className="mt-1 space-y-0.5">
              {failed.map((s) => (
                <li key={s.id}>
                  {s.name}: {s.error ?? 'error'}
                  {s.lastSuccess ? ` (last ok ${relativeTime(s.lastSuccess, now)})` : ''}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="mb-3 grid grid-cols-3 gap-2">
        {(
          [
            ['all', 'All'],
            ['open', 'Open now'],
            ['saved', `Saved${marksRaw.filter((m) => m.state === 'saved').length ? ` (${marksRaw.filter((m) => m.state === 'saved').length})` : ''}`],
          ] as [View, string][]
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            aria-pressed={view === id}
            onClick={() => {
              setView(id)
              resetLimit()
            }}
            className={`min-h-10 rounded-lg px-2 text-sm font-medium transition-colors ${
              view === id
                ? 'bg-indigo-500 text-white'
                : 'bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Category chips: favourites first. In edit mode a tap toggles the star. */}
      <div className="-mx-4 mb-2 overflow-x-auto px-4 pb-1">
        <div className="flex w-max items-center gap-2">
          {(filtering || selectedCats !== null) && (
            <button
              type="button"
              onClick={() => {
                setSelectedCats([])
                setSelectedCities([])
                resetLimit()
              }}
              className="min-h-10 shrink-0 rounded-full border-2 border-slate-300 bg-white px-3.5 text-xs font-medium whitespace-nowrap text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
            >
              ✕ Clear
            </button>
          )}
          <button
            type="button"
            onClick={() => setEditFavs((v) => !v)}
            aria-pressed={editFavs}
            aria-label="Edit favourite categories"
            className={`${CHIP_BASE} ${editFavs ? CHIP_ON : CHIP_OFF}`}
          >
            {editFavs ? '★ Done' : '☆'}
          </button>
          {catOrder.map((id) => {
            const on = activeCats.includes(id)
            const fav = favourites.includes(id)
            const count = catCounts.get(id) ?? 0
            if (!editFavs && count === 0 && !on) return null
            return (
              <button
                key={id}
                type="button"
                onClick={() => (editFavs ? void toggleFavourite(id) : toggleCat(id))}
                aria-pressed={editFavs ? fav : on}
                className={`${CHIP_BASE} ${(editFavs ? fav : on) ? CHIP_ON : CHIP_OFF}`}
              >
                {editFavs ? (fav ? '★ ' : '☆ ') : on ? '✓ ' : fav ? '★ ' : ''}
                {categoryLabel(id)} · {count}
              </button>
            )
          })}
        </div>
      </div>

      {cityCounts.length > 1 && (
        <div className="-mx-4 mb-2 overflow-x-auto px-4 pb-1">
          <div className="flex w-max items-center gap-2">
            {cityCounts.map(([city, n]) => {
              const on = selectedCities.includes(city)
              return (
                <button
                  key={city}
                  type="button"
                  onClick={() => toggleCity(city)}
                  aria-pressed={on}
                  className={`${CHIP_BASE} max-w-48 truncate ${on ? CHIP_ON : CHIP_OFF}`}
                >
                  {on ? '✓ ' : ''}
                  {city} · {n}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {view !== 'saved' && (
        <label className="mb-4 flex min-h-10 items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          <input
            type="checkbox"
            checked={showHidden}
            onChange={(e) => {
              setShowHidden(e.target.checked)
              resetLimit()
            }}
            className="size-5"
          />
          Show hidden
        </label>
      )}

      {total === 0 ? (
        <EmptyState
          emoji={view === 'saved' ? '☆' : '🔎'}
          title={view === 'saved' ? 'Nothing saved yet' : 'No events match'}
          hint={
            view === 'saved'
              ? 'Open an event and tap Save to keep it here.'
              : filtering
                ? 'Try clearing the filters.'
                : 'Nothing to show right now.'
          }
        />
      ) : (
        <div className="space-y-5">
          {visibleGroups.map((g) => (
            <section key={g.key}>
              <h2 className="mb-2 text-sm font-semibold text-slate-500 capitalize dark:text-slate-400">
                {g.label}
              </h2>
              <ul className="space-y-2">
                {g.events.map((e) => (
                  <EventCard
                    key={`${g.key}-${e.id}`}
                    event={e}
                    saved={marks.get(e.id)?.state === 'saved'}
                    hidden={marks.get(e.id)?.state === 'hidden'}
                    onToggleSave={() => void setMark(e, 'saved')}
                    onToggleHide={() => void setMark(e, 'hidden')}
                  />
                ))}
              </ul>
            </section>
          ))}
          {limit < total && (
            <div className="flex justify-center">
              <Button variant="ghost" onClick={() => setLimit((l) => l + PAGE)}>
                Show more ({total - limit} left)
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

