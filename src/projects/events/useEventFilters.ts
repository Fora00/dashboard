import { useCallback, useEffect, useMemo, useState } from 'react'
import { db, type EventMark, type EventPrefs } from '../../lib/db'
import {
  chipRange,
  loadFilters,
  matchesQuery,
  matchesRange,
  normalizeText,
  saveFilters,
  type DateChip,
} from './filters'
import { cleanFormats, matchesFormat, FORMAT_CHIPS } from './format'
import type { EventItem } from './types'
import {
  CATEGORIES,
  areaOf,
  areaRank,
  groupByDay,
  inCategory,
  isLongRunning,
  isOngoingNow,
  isOver,
  type DayGroup,
} from './model'

export type View = 'all' | 'open' | 'saved'
export const PAGE = 60

/** Add `id` to `list`, or remove it when present. Always returns a new array. */
export function toggleIn<T>(list: readonly T[], id: T): T[] {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id]
}

function byStart(a: EventItem, b: EventItem): number {
  return Date.parse(a.start) - Date.parse(b.start) || a.title.localeCompare(b.title)
}

/** OR over the selected areas; none selected = every area. */
function inAreas(e: EventItem, areas: string[]): boolean {
  return areas.length === 0 || areas.includes(areaOf(e))
}

function inCities(e: EventItem, cities: string[]): boolean {
  return cities.length === 0 || cities.includes(e.city)
}

function inCats(e: EventItem, cats: string[]): boolean {
  return cats.length === 0 || cats.some((c) => inCategory(e, c))
}

/** Count events per key: `keysOf` lists the keys one event counts towards, `pass` the filters that apply. */
function countBy(
  list: EventItem[],
  pass: (e: EventItem) => boolean,
  keysOf: (e: EventItem) => string[],
): Map<string, number> {
  const m = new Map<string, number>()
  for (const e of list) {
    if (!pass(e)) continue
    for (const k of keysOf(e)) m.set(k, (m.get(k) ?? 0) + 1)
  }
  return m
}

interface Options {
  /** Current clock (read once per mount/refresh by the page). */
  now: number
  /** Remembered filters are only written once the events file is there. */
  persist: boolean
}

/**
 * All the state and derived data behind the Events page filters: view,
 * search, date chip, category/area/city/"Come" selections, the remembered
 * selection, the sheet counts and the day groups. Pure logic, no JSX.
 */
export function useEventFilters(
  events: EventItem[],
  marksRaw: EventMark[] | undefined,
  prefs: EventPrefs | null | undefined,
  { now, persist }: Options,
) {
  const [view, setViewState] = useState<View>('all')
  // The last selection of this device (guarded localStorage); the search text is not kept.
  const [initial] = useState(loadFilters)
  // null = "not touched": the favourites (if any) are the default filter.
  const [rawCats, setSelectedCats] = useState<string[] | null>(initial.cats)
  const [rawAreas, setSelectedAreas] = useState<string[]>(initial.areas)
  const [rawCities, setSelectedCities] = useState<string[]>(initial.cities)
  const [dateChip, setDateChip] = useState<DateChip | null>(initial.chip)
  const [rawFormats, setSelectedFormats] = useState<string[]>(initial.formats)
  const [showHidden, setShowHiddenState] = useState(initial.showHidden)
  const [query, setQueryState] = useState('')
  const [limit, setLimit] = useState(PAGE)

  const marks = useMemo(() => new Map<string, EventMark>((marksRaw ?? []).map((m) => [m.id, m])), [marksRaw])
  const favourites = useMemo(() => prefs?.favouriteCategories ?? [], [prefs])

  // A remembered selection may name areas/categories/cities that no longer
  // exist: only the ones still present in the file count.
  const selectedCats = useMemo(
    () => (rawCats === null ? null : rawCats.filter((id) => CATEGORIES.some((c) => c.id === id))),
    [rawCats],
  )
  const selectedAreas = useMemo(() => {
    const known = new Set(events.map(areaOf))
    return rawAreas.filter((a) => known.has(a))
  }, [rawAreas, events])
  const selectedCities = useMemo(() => {
    const known = new Set(events.map((e) => e.city))
    return rawCities.filter((c) => known.has(c))
  }, [rawCities, events])
  const selectedFormats = useMemo(() => cleanFormats(rawFormats), [rawFormats])

  useEffect(() => {
    if (!persist) return
    saveFilters({
      cats: selectedCats,
      areas: selectedAreas,
      cities: selectedCities,
      chip: dateChip,
      formats: selectedFormats,
      showHidden,
    })
  }, [persist, selectedCats, selectedAreas, selectedCities, dateChip, selectedFormats, showHidden])

  const nq = useMemo(() => normalizeText(query), [query])
  const activeCats = selectedCats ?? favourites

  // Base list of the current view, before category/city filters.
  const base = useMemo(() => {
    if (view === 'saved') {
      const live = new Map(events.map((e) => [e.id, e]))
      return (marksRaw ?? [])
        .filter((m) => m.state === 'saved')
        .map((m) => live.get(m.id) ?? m.event)
        .sort(byStart)
    }
    return events.filter((e) => {
      if (isOver(e, now)) return false
      if (!showHidden && marks.get(e.id)?.state === 'hidden') return false
      if (view === 'open') return isOngoingNow(e, now)
      return true
    })
  }, [view, events, marksRaw, marks, now, showHidden])

  // Date chip and search narrow the whole list, so the sheet counts follow them.
  const range = useMemo(() => (dateChip ? chipRange(dateChip, now) : null), [dateChip, now])
  const scoped = useMemo(
    () => base.filter((e) => (!range || matchesRange(e, range, now)) && matchesQuery(e, nq)),
    [base, range, nq, now],
  )

  // Sheet counts: each one respects every filter except its own.
  // Areas, nearest first; counts over the whole view.
  const areaCounts = useMemo(
    () =>
      [...countBy(scoped, () => true, (e) => [areaOf(e)]).entries()].sort(
        (a, b) => areaRank(a[0]) - areaRank(b[0]) || a[0].localeCompare(b[0]),
      ),
    [scoped],
  )

  // Only the cities of the selected areas (all when none is selected).
  const cityCounts = useMemo(
    () =>
      [...countBy(scoped, (e) => inAreas(e, selectedAreas), (e) => [e.city]).entries()].sort(
        (a, b) => b[1] - a[1] || a[0].localeCompare(b[0]),
      ),
    [scoped, selectedAreas],
  )

  // Category counts respect the area, city and format filters but not the category filter.
  const catCounts = useMemo(
    () =>
      countBy(
        scoped,
        (e) => inAreas(e, selectedAreas) && inCities(e, selectedCities) && matchesFormat(e, selectedFormats),
        (e) => CATEGORIES.filter((c) => inCategory(e, c.id)).map((c) => c.id),
      ),
    [scoped, selectedAreas, selectedCities, selectedFormats],
  )

  // Format counts respect every other filter (area, category, city) but not the format selection.
  const formatCounts = useMemo(
    () =>
      countBy(
        scoped,
        (e) => inAreas(e, selectedAreas) && inCities(e, selectedCities) && inCats(e, activeCats),
        (e) => FORMAT_CHIPS.filter((c) => e.tags.includes(c.id)).map((c) => c.id),
      ),
    [scoped, selectedAreas, selectedCities, activeCats],
  )

  const catOrder = useMemo(() => {
    const ids = CATEGORIES.map((c) => c.id)
    const rank = (id: string) => (favourites.includes(id) ? 0 : 1)
    return ids.sort((a, b) => rank(a) - rank(b) || (catCounts.get(b) ?? 0) - (catCounts.get(a) ?? 0))
  }, [favourites, catCounts])

  const filtered = useMemo(
    () =>
      scoped.filter(
        (e) =>
          inCats(e, activeCats) &&
          inAreas(e, selectedAreas) &&
          inCities(e, selectedCities) &&
          matchesFormat(e, selectedFormats),
      ),
    [scoped, activeCats, selectedAreas, selectedCities, selectedFormats],
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

  const filtering = activeCats.length > 0 || selectedAreas.length > 0 || selectedCities.length > 0 || selectedFormats.length > 0
  const filterCount = activeCats.length + selectedAreas.length + selectedCities.length + selectedFormats.length

  // --- Toggles ---------------------------------------------------------------------

  const resetLimit = useCallback(() => setLimit(PAGE), [])
  const showMore = useCallback(() => setLimit((l) => l + PAGE), [])

  const setView = useCallback(
    (v: View) => {
      setViewState(v)
      resetLimit()
    },
    [resetLimit],
  )

  const setQuery = useCallback(
    (q: string) => {
      setQueryState(q)
      resetLimit()
    },
    [resetLimit],
  )

  const toggleDateChip = useCallback(
    (id: DateChip) => {
      setDateChip((cur) => (cur === id ? null : id))
      resetLimit()
    },
    [resetLimit],
  )

  const toggleCat = useCallback(
    (id: string) => {
      setSelectedCats((cur) => toggleIn(cur ?? favourites, id))
      resetLimit()
    },
    [favourites, resetLimit],
  )

  function toggleArea(area: string) {
    const next = toggleIn(selectedAreas, area)
    setSelectedAreas(next)
    // A selected city outside the new areas would silently empty the list.
    if (next.length) {
      const keep = new Set(base.filter((e) => next.includes(areaOf(e))).map((e) => e.city))
      setSelectedCities((cur) => cur.filter((c) => keep.has(c)))
    }
    resetLimit()
  }

  function toggleCity(city: string) {
    setSelectedCities((cur) => toggleIn(cur, city))
    resetLimit()
  }

  function toggleFormat(id: string) {
    setSelectedFormats((cur) => toggleIn(cur, id))
    resetLimit()
  }

  function setShowHidden(v: boolean) {
    setShowHiddenState(v)
    resetLimit()
  }

  function clearAll() {
    setSelectedFormats([])
    setSelectedCats([])
    setSelectedAreas([])
    setSelectedCities([])
    setShowHiddenState(false)
    resetLimit()
  }

  async function toggleFavourite(id: string) {
    await db.eventPrefs.put({ id: 'prefs', favouriteCategories: toggleIn(favourites, id) })
  }

  return {
    filters: { view, query, nq, dateChip, showHidden, selectedCats, selectedAreas, selectedCities, selectedFormats, activeCats, favourites, filtering, filterCount },
    toggles: { setView, setQuery, toggleDateChip, toggleCat, toggleArea, toggleCity, toggleFormat, setShowHidden, clearAll, toggleFavourite, showMore },
    counts: { areaCounts, cityCounts, catCounts, formatCounts, catOrder },
    groups: { visibleGroups, total, limit },
    marks,
  }
}
