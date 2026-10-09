import { useCallback, useEffect, useMemo, useState } from 'react'
import type { EventMark, EventPrefs } from '../../lib/db'
import { setFavouriteCategories } from '../../lib/eventMarksSync'
import {
  effectiveSubs,
  lacksSubcategory,
  loadFilters,
  matchesQuery,
  matchesChip,
  matchesSubcategory,
  normalizeText,
  saveFilters,
  type DateChip,
} from './filters'
import { cleanFormats, matchesFormat, FORMAT_CHIPS } from './format'
import type { EventItem } from './types'
import { isManual } from './custom'
import { collapseRepeats } from './groups'
import { categoryOfSubcategory } from './subcategories'
import { DISTANCE_STEPS, isNear, tooFarForCategory, withinMinutes } from './distance'
import {
  CATEGORIES,
  DEFAULT_CATEGORIES,
  categoryOf,
  compareInDay,
  groupByDay,
  inCategory,
  isLongRunning,
  isOngoingNow,
  isOver,
  isSpot,
  savedGroups,
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
  const [dateChip, setDateChip] = useState<DateChip | null>(initial.chip)
  const [rawFormats, setSelectedFormats] = useState<string[]>(initial.formats)
  const [showHidden, setShowHiddenState] = useState(initial.showHidden)
  const [maxMin, setMaxMin] = useState<number | null>(initial.maxMin)
  const [rawSubs, setSelectedSubs] = useState<string[]>(initial.subs)
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
  const selectedFormats = useMemo(() => cleanFormats(rawFormats), [rawFormats])

  useEffect(() => {
    if (!persist) return
    saveFilters({
      cats: selectedCats,
      chip: dateChip,
      formats: selectedFormats,
      showHidden,
      maxMin,
      subs: rawSubs,
    })
  }, [persist, selectedCats, dateChip, selectedFormats, showHidden, maxMin, rawSubs])

  const nq = useMemo(() => normalizeText(query), [query])
  // Untouched = the favourites, or the default picks when there are none.
  const defaultCats = useMemo(() => (favourites.length > 0 ? favourites : [...DEFAULT_CATEGORIES]), [favourites])
  const activeCats = selectedCats ?? defaultCats
  // Subcategory picks only count while their category is selected.
  const selectedSubs = useMemo(() => effectiveSubs(rawSubs, activeCats), [rawSubs, activeCats])

  // Base list of the current view, before category/city filters.
  const base = useMemo(() => {
    if (view === 'saved') {
      const live = new Map(events.map((e) => [e.id, e]))
      const saved = (marksRaw ?? []).filter((m) => m.state === 'saved').map((m) => live.get(m.id) ?? m.event)
      // Saved also holds everything the owner curates (hand-added + spot),
      // unless it is over or hidden.
      const ids = new Set(saved.map((e) => e.id))
      const mine = events.filter(
        (e) => (isManual(e) || isSpot(e)) && !ids.has(e.id) && !isOver(e, now) && marks.get(e.id)?.state !== 'hidden',
      )
      return [...saved, ...mine].sort(byStart)
    }
    return events.filter((e) => {
      if (isOver(e, now)) return false
      if (tooFarForCategory(e) && !isManual(e) && !isSpot(e)) return false
      if (!showHidden && marks.get(e.id)?.state === 'hidden') return false
      if (view === 'open') return isOngoingNow(e, now)
      return true
    })
  }, [view, events, marksRaw, marks, now, showHidden])

  // Date chip and search narrow the whole list, so the sheet counts follow them.
  const scoped = useMemo(
    () => base.filter((e) => (!dateChip || matchesChip(e, dateChip, now)) && matchesQuery(e, nq)),
    [base, dateChip, nq, now],
  )

  // Sheet counts: each one respects every filter except its own.
  // Events within each distance step (cumulative), respecting category and format.
  const distanceCounts = useMemo(() => {
    const pool = scoped.filter(
      (e) => inCats(e, activeCats) && matchesSubcategory(e, selectedSubs) && matchesFormat(e, selectedFormats),
    )
    return new Map<number, number>(DISTANCE_STEPS.map((m) => [m, pool.filter((e) => withinMinutes(e, m)).length]))
  }, [scoped, activeCats, selectedSubs, selectedFormats])

  // Category counts respect the area, city and format filters but not the category filter.
  const catCounts = useMemo(
    () =>
      countBy(
        scoped,
        (e) => matchesFormat(e, selectedFormats) && (maxMin === null || withinMinutes(e, maxMin)),
        (e) => CATEGORIES.filter((c) => inCategory(e, c.id)).map((c) => c.id),
      ),
    [scoped, selectedFormats, maxMin],
  )

  // Format counts respect every other filter (area, category, city) but not the format selection.
  const formatCounts = useMemo(
    () =>
      countBy(
        scoped,
        (e) =>
          inCats(e, activeCats) && matchesSubcategory(e, selectedSubs) && (maxMin === null || withinMinutes(e, maxMin)),
        (e) => FORMAT_CHIPS.filter((c) => e.tags.includes(c.id)).map((c) => c.id),
      ),
    [scoped, activeCats, selectedSubs, maxMin],
  )

  // Subcategory counts (by id) respect format and distance but not the subcategory filter itself.
  const subCounts = useMemo(
    () =>
      countBy(
        scoped,
        (e) => matchesFormat(e, selectedFormats) && (maxMin === null || withinMinutes(e, maxMin)),
        (e) => (e.subcategory ? [e.subcategory] : []),
      ),
    [scoped, selectedFormats, maxMin],
  )

  // Per category with an active subcategory filter: events hidden for lacking a subcategory.
  const noSubHidden = useMemo(() => {
    const cats = new Set(selectedSubs.map((id) => categoryOfSubcategory(id)).filter((c): c is string => c !== null))
    const m = new Map<string, number>()
    for (const c of cats) {
      const n = scoped.filter(
        (e) =>
          lacksSubcategory(e, c) && matchesFormat(e, selectedFormats) && (maxMin === null || withinMinutes(e, maxMin)),
      ).length
      m.set(c, n)
    }
    return m
  }, [scoped, selectedSubs, selectedFormats, maxMin])

  const catOrder = useMemo(() => {
    const ids = CATEGORIES.map((c) => c.id)
    const rank = (id: string) => (favourites.includes(id) ? 0 : 1)
    return ids.sort((a, b) => rank(a) - rank(b) || (catCounts.get(b) ?? 0) - (catCounts.get(a) ?? 0))
  }, [favourites, catCounts])

  // The favourites are only a default: a hand-added event (and everything in
  // spot ones in Saved) is never hidden by it (an explicit category choice still applies to it like to any event).
  const filtered = useMemo(
    () =>
      scoped.filter(
        (e) =>
          (inCats(e, activeCats) ||
            (selectedCats === null &&
              (isManual(e) ||
                (view === 'saved' && isSpot(e)) ||
                // Untouched defaults: an exhibition close by (the Mart) is worth a look.
                (favourites.length === 0 && categoryOf(e) === 'exhibitions' && isNear(e))))) &&
          matchesSubcategory(e, selectedSubs) &&
          matchesFormat(e, selectedFormats) &&
          (maxMin === null || withinMinutes(e, maxMin)),
      ),
    [scoped, activeCats, selectedCats, selectedSubs, selectedFormats, view, maxMin, favourites],
  )

  // Flat, ordered list of groups; then cut to `limit` cards in total.
  const collapsed = useMemo(() => {
    const out: DayGroup[] = []
    if (view === 'all') {
      // Dated days first (grouped into weeks by the page); the long "Open now"
      // list goes last so it never fills the page and hides the weeks.
      const running = filtered
        .filter((e) => isLongRunning(e, now))
        .sort((a, b) => Date.parse(a.end ?? a.start) - Date.parse(b.end ?? b.start))
      out.push(
        ...groupByDay(
          filtered.filter((e) => !isLongRunning(e, now)),
          now,
          compareInDay(defaultCats),
        ),
      )
      if (running.length) out.push({ key: 'open-now', label: 'Open now', events: running })
    } else if (view === 'open') {
      const running = [...filtered].sort((a, b) => Date.parse(a.end ?? a.start) - Date.parse(b.end ?? b.start))
      if (running.length) out.push({ key: 'open-now', label: 'Open now', events: running })
    } else {
      out.push(...savedGroups(filtered, now))
    }
    // Repeats (3+ same title and city) become one row, only in the main view;
    // marked and hand-added events stay on their own. Paging counts a group once.
    return collapseRepeats(out, view === 'all', (e) => isManual(e) || marks.has(e.id))
  }, [filtered, view, now, marks, defaultCats])
  const groups = collapsed.days
  const repeats = collapsed.repeats

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

  const filtering = activeCats.length > 0 || selectedFormats.length > 0 || maxMin !== null
  const filterCount = activeCats.length + selectedSubs.length + selectedFormats.length + (maxMin !== null ? 1 : 0)

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
      setSelectedCats((cur) => toggleIn(cur ?? defaultCats, id))
      resetLimit()
    },
    [defaultCats, resetLimit],
  )

  function toggleSub(id: string) {
    setSelectedSubs((cur) => toggleIn(cur, id))
    resetLimit()
  }

  function toggleFormat(id: string) {
    setSelectedFormats((cur) => toggleIn(cur, id))
    resetLimit()
  }

  /** Same step again clears the limit. */
  function toggleMaxMin(m: number) {
    setMaxMin((cur) => (cur === m ? null : m))
    resetLimit()
  }

  function setShowHidden(v: boolean) {
    setShowHiddenState(v)
    resetLimit()
  }

  function clearAll() {
    setSelectedFormats([])
    setSelectedCats([])
    setSelectedSubs([])
    setMaxMin(null)
    setShowHiddenState(false)
    resetLimit()
  }

  async function toggleFavourite(id: string) {
    await setFavouriteCategories(toggleIn(favourites, id))
  }

  return {
    filters: {
      view,
      query,
      nq,
      dateChip,
      showHidden,
      maxMin,
      selectedCats,
      selectedFormats,
      selectedSubs,
      activeCats,
      favourites,
      filtering,
      filterCount,
    },
    toggles: {
      setView,
      setQuery,
      toggleDateChip,
      toggleCat,
      toggleFormat,
      toggleSub,
      toggleMaxMin,
      setShowHidden,
      clearAll,
      toggleFavourite,
      showMore,
    },
    counts: { distanceCounts, catCounts, formatCounts, subCounts, noSubHidden, catOrder },
    groups: { visibleGroups, total, limit, repeats },
    marks,
  }
}
