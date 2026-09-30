import { useEffect, useMemo, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, type EventMark } from '../../lib/db'
import { PageHeader } from '../../components/PageHeader'
import { EmptyState } from '../../components/EmptyState'
import { Button } from '../../components/Button'
import { SkeletonList } from '../../components/Skeleton'
import { FilterSheet } from './FilterSheet'
import { EventCard } from './EventCard'
import type { EventItem } from './types'
import {
  CATEGORIES,
  areaLabel,
  areaOf,
  areaRank,
  categoryLabel,
  fetchEventsFile,
  groupByDay,
  inCategory,
  isKidsEvent,
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

/** OR over the selected areas; none selected = every area. */
function inAreas(e: EventItem, areas: string[]): boolean {
  return areas.length === 0 || areas.includes(areaOf(e))
}

export function Events() {
  const cache = useLiveQuery(() => db.eventsCache.get('latest'), [], null)
  const marksRaw = useLiveQuery(() => db.eventMarks.toArray())
  const prefs = useLiveQuery(() => db.eventPrefs.get('prefs'), [], null)

  const [fetchState, setFetchState] = useState<'loading' | 'ok' | 'offline' | 'missing'>('loading')
  const [view, setView] = useState<View>('all')
  // null = "not touched": the favourites (if any) are the default filter.
  const [selectedCats, setSelectedCats] = useState<string[] | null>(null)
  const [selectedAreas, setSelectedAreas] = useState<string[]>([])
  const [selectedCities, setSelectedCities] = useState<string[]>([])
  const [showHidden, setShowHidden] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
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
  // Children's/family events are never shown (owner's choice); saved ones
  // still appear under Saved from their snapshot.
  const events = useMemo(() => (file?.events ?? []).filter((e) => !isKidsEvent(e)), [file])

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

  // Areas, nearest first; counts over the whole view (like cities used to be).
  const areaCounts = useMemo(() => {
    const m = new Map<string, number>()
    for (const e of base) m.set(areaOf(e), (m.get(areaOf(e)) ?? 0) + 1)
    return [...m.entries()].sort((a, b) => areaRank(a[0]) - areaRank(b[0]) || a[0].localeCompare(b[0]))
  }, [base])

  // Only the cities of the selected areas (all when none is selected).
  const cityCounts = useMemo(() => {
    const m = new Map<string, number>()
    for (const e of base) if (inAreas(e, selectedAreas)) m.set(e.city, (m.get(e.city) ?? 0) + 1)
    return [...m.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  }, [base, selectedAreas])

  // Category counts respect the area and city filters but not the category filter.
  const catCounts = useMemo(() => {
    const m = new Map<string, number>()
    for (const e of base) {
      if (!inAreas(e, selectedAreas)) continue
      if (selectedCities.length && !selectedCities.includes(e.city)) continue
      for (const c of CATEGORIES) if (inCategory(e, c.id)) m.set(c.id, (m.get(c.id) ?? 0) + 1)
    }
    return m
  }, [base, selectedAreas, selectedCities])

  const catOrder = useMemo(() => {
    const ids = CATEGORIES.map((c) => c.id)
    const rank = (id: string) => (favourites.includes(id) ? 0 : 1)
    return ids.sort((a, b) => rank(a) - rank(b) || (catCounts.get(b) ?? 0) - (catCounts.get(a) ?? 0))
  }, [favourites, catCounts])

  const filtered = useMemo(
    () =>
      base.filter(
        (e) =>
          (activeCats.length === 0 || activeCats.some((c) => inCategory(e, c))) &&
          inAreas(e, selectedAreas) &&
          (selectedCities.length === 0 || selectedCities.includes(e.city)),
      ),
    [base, activeCats, selectedAreas, selectedCities],
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

  function toggleArea(area: string) {
    const next = selectedAreas.includes(area) ? selectedAreas.filter((a) => a !== area) : [...selectedAreas, area]
    setSelectedAreas(next)
    // A selected city outside the new areas would silently empty the list.
    if (next.length) {
      const keep = new Set(base.filter((e) => next.includes(areaOf(e))).map((e) => e.city))
      setSelectedCities((cur) => cur.filter((c) => keep.has(c)))
    }
    resetLimit()
  }

  function toggleCity(city: string) {
    setSelectedCities((cur) => (cur.includes(city) ? cur.filter((c) => c !== city) : [...cur, city]))
    resetLimit()
  }

  function clearAll() {
    setSelectedCats([])
    setSelectedAreas([])
    setSelectedCities([])
    setShowHidden(false)
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
  const filtering = activeCats.length > 0 || selectedAreas.length > 0 || selectedCities.length > 0
  const filterCount = activeCats.length + selectedAreas.length + selectedCities.length

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

      <div className="-mx-4 mb-4 overflow-x-auto px-4 pb-1">
        <div className="flex w-max items-center gap-2">
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className={`${CHIP_BASE} ${filterCount ? CHIP_ON : CHIP_OFF}`}
          >
            Filters{filterCount ? ` · ${filterCount}` : ''}
          </button>
          {selectedAreas.map((id) => (
            <button
              key={`a-${id}`}
              type="button"
              aria-label={`Remove filter ${areaLabel(id)}`}
              onClick={() => toggleArea(id)}
              className={`${CHIP_BASE} ${CHIP_OFF}`}
            >
              {areaLabel(id)} ✕
            </button>
          ))}
          {activeCats.map((id) => (
            <button
              key={`c-${id}`}
              type="button"
              aria-label={`Remove filter ${categoryLabel(id)}`}
              onClick={() => toggleCat(id)}
              className={`${CHIP_BASE} ${CHIP_OFF}`}
            >
              {categoryLabel(id)} ✕
            </button>
          ))}
          {selectedCities.map((city) => (
            <button
              key={`t-${city}`}
              type="button"
              aria-label={`Remove filter ${city}`}
              onClick={() => toggleCity(city)}
              className={`${CHIP_BASE} max-w-48 truncate ${CHIP_OFF}`}
            >
              {city} ✕
            </button>
          ))}
          {(filtering || selectedCats !== null) && (
            <button type="button" onClick={clearAll} className={`${CHIP_BASE} ${CHIP_OFF} underline`}>
              Clear
            </button>
          )}
        </div>
      </div>

      <FilterSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        catOrder={catOrder}
        catCounts={catCounts}
        activeCats={activeCats}
        favourites={favourites}
        areaCounts={areaCounts}
        selectedAreas={selectedAreas}
        onToggleArea={toggleArea}
        cityCounts={cityCounts}
        selectedCities={selectedCities}
        showHidden={showHidden}
        canShowHidden={view !== 'saved'}
        total={total}
        onToggleCat={toggleCat}
        onToggleFavourite={(id) => void toggleFavourite(id)}
        onToggleCity={toggleCity}
        onShowHidden={(v) => {
          setShowHidden(v)
          resetLimit()
        }}
        onClearAll={clearAll}
      />

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
              <h2 className="mb-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
                {g.label}
              </h2>
              <ul className="space-y-2">
                {g.events.map((e) => (
                  <EventCard
                    key={`${g.key}-${e.id}`}
                    event={e}
                    saved={marks.get(e.id)?.state === 'saved'}
                    hidden={marks.get(e.id)?.state === 'hidden'}
                    now={now}
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

