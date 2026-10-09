import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { useSearchParams } from 'react-router-dom'
import { db, type CustomEvent, type EventMark } from '../../lib/db'
import { deleteCustomEvent, pruneCustomEvents, sync as customSync } from '../../lib/customEventsSync'
import { hideEvents, pruneEventMarks, restoreEventMark, toggleEventMark } from '../../lib/eventMarksSync'
import { Kbd } from '../../components/Kbd'
import { useListHotkeys } from '../../lib/useListHotkeys'
import { SyncCard } from '../../components/SyncCard'
import { PageHeader } from '../../components/PageHeader'
import { EmptyState } from '../../components/EmptyState'
import { Button } from '../../components/Button'
import { Chip } from '../../components/Chip'
import { FOCUS_RING, FOCUS_RING_INSET } from '../../components/focus'
import { Snackbar } from '../../components/Snackbar'
import { formatDate as formatDateLocal } from '../../lib/dates'
import { useUndoSnackbar } from '../../lib/useUndoSnackbar'
import { SkeletonList } from '../../components/Skeleton'
import { FilterSheet } from './FilterSheet'
import { FilterPanel, type FilterPanelProps } from './FilterPanel'
import { EventDetail } from './EventDetail'
import { isTypingTarget, listKeyAction, moveSelection, rangeBetween, visibleOrder } from './selection'
import { useWide } from './useWide'
import { CustomEventSheet } from './CustomEventSheet'
import { PREFILL_KEYS, mergeEvents, parsePrefill, type CustomEventForm } from './custom'
import { DATE_CHIPS } from './filters'
import { NEAR_MINUTES, minutesLabel } from './distance'
import { formatLabel } from './format'
import { SelectionBar, WeekSections } from './EventsList'
import { ListChecksIcon, PlusIcon, XIcon } from './icons'
import { useEventFilters, type View } from './useEventFilters'
import type { EventItem } from './types'
import { categoryLabel, fetchEventsFile, groupByWeek, isKidsEvent, isNew, relativeTime } from './model'
import { recordVisit } from './visit'

/** The add/edit sheet: closed, adding (with an optional prefill) or editing a row. */
type Editor =
  | { open: false }
  | {
      open: true
      editing: CustomEvent | null
      prefill: Partial<CustomEventForm> | null
    }

export function Events() {
  const { trigger: triggerUndo, pending: pendingUndo, confirmUndo } = useUndoSnackbar()
  const cache = useLiveQuery(() => db.eventsCache.get('latest'), [], null)
  const marksRaw = useLiveQuery(() => db.eventMarks.toArray())
  const prefs = useLiveQuery(() => db.eventPrefs.get('prefs'), [], null)
  const customRows = useLiveQuery(() => db.customEvents.toArray())
  const [editor, setEditor] = useState<Editor>({ open: false })

  // Hand-added events disappear two weeks after their last day; saved/hidden
  // marks the day after the event (locally and on the server).
  useEffect(() => {
    void pruneCustomEvents().catch(() => {})
    void pruneEventMarks().catch(() => {})
  }, [])
  const [searchParams, setSearchParams] = useSearchParams()

  // Deep link from a Shortcut / share sheet: #/events?add=1&url=…&title=…
  // Opens the add sheet prefilled, then strips the keys so a reload or Back
  // doesn't open it again.
  useEffect(() => {
    const prefill = parsePrefill(searchParams)
    if (!PREFILL_KEYS.some((k) => searchParams.has(k))) return
    // oxlint-disable-next-line react/set-state-in-effect -- syncs the URL deep-link params into the add sheet, then strips them
    if (prefill) setEditor({ open: true, editing: null, prefill })
    const next = new URLSearchParams(searchParams)
    for (const k of PREFILL_KEYS) next.delete(k)
    setSearchParams(next, { replace: true })
  }, [searchParams, setSearchParams])

  const [fetchState, setFetchState] = useState<'loading' | 'ok' | 'offline' | 'missing'>('loading')
  const [sheetOpen, setSheetOpen] = useState(false)
  // Multi-select: pick several cards, hide them in one go.
  const [selecting, setSelecting] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set())
  const [showSources, setShowSources] = useState(false)
  // The clock is read once per mount/refresh, not on every render.
  const [now, setNow] = useState(() => Date.now())
  // Baseline for "New" (visit.ts): read once on mount, before this visit is
  // recorded, so it stays the same for the whole visit (and reloads within it).
  // The toggle is never persisted with the filters: it would go stale.
  const [since] = useState(() => recordVisit(Date.now()))
  const [onlyNew, setOnlyNew] = useState(false)

  useEffect(() => {
    let cancelled = false
    void (async () => {
      const out = await fetchEventsFile()
      if (cancelled) return
      if (out.kind === 'ok' && out.file.events.length === 0) {
        // An empty (or all-malformed) file never replaces the offline cache.
        setFetchState('offline')
      } else if (out.kind === 'ok') {
        await db.eventsCache.put({
          id: 'latest',
          file: out.file,
          fetchedAt: Date.now(),
        })
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

  const file = cache?.file
  // Children's/family events are never shown (owner's choice); saved ones
  // still appear under Saved from their snapshot. Hand-added events are merged
  // in (custom.ts) and never dropped by that rule; they work with no file.
  const allEvents = useMemo(() => mergeEvents(file?.events ?? [], customRows ?? [], isKidsEvent), [file, customRows])
  const newCount = useMemo(() => allEvents.filter((e) => isNew(e, since)).length, [allEvents, since])
  // "New" only narrows the list; a stale toggle with nothing new is ignored.
  const newOnly = onlyNew && newCount > 0
  const events = useMemo(
    () => (newOnly ? allEvents.filter((e) => isNew(e, since)) : allEvents),
    [allEvents, newOnly, since],
  )
  const hasCustom = (customRows?.length ?? 0) > 0
  const cityNames = useMemo(
    () => [...new Set(allEvents.map((e) => e.city))].sort((a, b) => a.localeCompare(b)),
    [allEvents],
  )

  const { filters, toggles, counts, groups, marks } = useEventFilters(events, marksRaw, prefs, {
    now,
    persist: Boolean(file),
  })
  const {
    view,
    query,
    nq,
    dateChip,
    showHidden,
    maxMin,
    selectedCats,
    selectedFormats,
    activeCats,
    favourites,
    filtering,
    filterCount,
  } = filters
  const { visibleGroups, total, limit, repeats } = groups
  const weeks = useMemo(() => groupByWeek(visibleGroups, now), [visibleGroups, now])
  // Weeks the user folded away (all open by default).
  const [collapsedWeeks, setCollapsedWeeks] = useState<ReadonlySet<string>>(new Set())
  const toggleWeek = (k: string) =>
    setCollapsedWeeks((prev) => {
      const next = new Set(prev)
      if (!next.delete(k)) next.add(k)
      return next
    })

  // Master-detail (lg+, UI2): the event shown in the detail panel. Local UI
  // state only; below lg cards expand inline as before and this stays unused.
  const wide = useWide()
  const [activeId, setActiveId] = useState<string | null>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const order = useMemo(() => visibleOrder(weeks, collapsedWeeks), [weeks, collapsedWeeks])
  // The shown event, even after it leaves the list (hidden, filtered out) so
  // Unhide/Save stay at hand; a saved one may only exist as its mark snapshot.
  const activeEvent = useMemo(() => {
    if (activeId === null) return null
    return events.find((e) => e.id === activeId) ?? marksRaw?.find((m) => m.id === activeId)?.event ?? null
  }, [activeId, events, marksRaw])
  const onActivate = useCallback((e: EventItem) => {
    setActiveId(e.id)
    // Safari doesn't focus a clicked button: keep the keyboard on the list so
    // the arrows work right after a click (no ring: the list has no outline).
    const list = listRef.current
    if (list && !list.contains(document.activeElement)) list.focus({ preventScroll: true })
  }, [])
  const focusCard = (id: string) => {
    const btn = listRef.current?.querySelector<HTMLElement>(`[data-event-id="${CSS.escape(id)}"]`)
    btn?.focus({ preventScroll: true })
    btn?.scrollIntoView({ block: 'nearest' })
  }
  const onListKeyDown = (ev: KeyboardEvent<HTMLElement>) => {
    if (ev.defaultPrevented || selecting || isTypingTarget(ev.target as HTMLElement)) return
    const action = listKeyAction(ev)
    if (!action) return
    if (action.kind === 'clear') {
      if (activeId === null) return
      ev.preventDefault()
      const prev = activeId
      setActiveId(null)
      // Focus was maybe inside the panel that is about to empty: back to the card.
      if (!listRef.current?.contains(document.activeElement)) focusCard(prev)
      return
    }
    const next = moveSelection(order, activeId, action.move)
    if (next === null) return
    ev.preventDefault()
    setActiveId(next)
    focusCard(next)
  }

  // Stable across renders (they read the current mark from Dexie), so the
  // memoised EventCards only re-render when their own props change.
  const setMark = useCallback(
    async (e: EventItem, state: EventMark['state']) => {
      // Through the owner-only sync engine (eventMarksSync.ts). The snapshot
      // is sanitised there: a hand-added event's inline image is dropped (the
      // live row has it), scraped fields are capped.
      const prev = await toggleEventMark(e, state)
      // Hiding makes the card vanish: offer Undo, restoring the previous mark.
      if (state === 'hidden' && prev?.state !== 'hidden') {
        triggerUndo('Event hidden', () => restoreEventMark(e.id, prev))
      }
    },
    [triggerUndo],
  )
  const onToggleSave = useCallback((e: EventItem) => void setMark(e, 'saved'), [setMark])
  const onToggleHide = useCallback((e: EventItem) => void setMark(e, 'hidden'), [setMark])
  // Shift-click range select: the last card picked is the anchor; the list
  // order is read through a ref so onSelect stays stable for the memoised cards.
  const orderRef = useRef(order)
  useEffect(() => {
    orderRef.current = order
  })
  const anchorRef = useRef<string | null>(null)
  const onSelect = useCallback((e: EventItem, range = false) => {
    const from = anchorRef.current
    anchorRef.current = e.id
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (range && from !== null) {
        for (const id of rangeBetween(orderRef.current, from, e.id)) next.add(id)
      } else if (!next.delete(e.id)) next.add(e.id)
      return next
    })
  }, [])
  const exitSelect = () => {
    anchorRef.current = null
    setSelecting(false)
    setSelectedIds(new Set())
  }
  const onEdit = useCallback((e: EventItem) => {
    void db.customEvents.get(e.id).then((row) => {
      if (row) setEditor({ open: true, editing: row, prefill: null })
    })
  }, [])
  const openAdd = () => setEditor({ open: true, editing: null, prefill: null })
  const searchRef = useRef<HTMLInputElement>(null)
  // '/' focuses the search field, 'n' opens the add-event sheet.
  useListHotkeys({
    onSearch: () => searchRef.current?.focus(),
    onNew: openAdd,
  })
  const closeEditor = () => setEditor({ open: false })
  const onDeleteCustom = (row: CustomEvent) => {
    closeEditor()
    void deleteCustomEvent(row.id).then((undo) => triggerUndo('Event deleted', undo))
  }

  const hideSelected = () => {
    const picked = visibleGroups.flatMap((g) => g.events).filter((e) => selectedIds.has(e.id))
    // An event can sit in two groups: hide each once.
    const unique = [...new Map(picked.map((e) => [e.id, e])).values()]
    exitSelect()
    void hideEvents(unique).then((changed) => {
      if (changed.length === 0) return
      triggerUndo(`${changed.length} ${changed.length === 1 ? 'event' : 'events'} hidden`, async () => {
        for (const [id, prev] of changed) await restoreEventMark(id, prev)
      })
    })
  }
  const selectAllVisible = () => setSelectedIds(new Set(visibleGroups.flatMap((g) => g.events).map((e) => e.id)))

  const failed = file?.sources.filter((s) => !s.ok) ?? []

  const header = (
    <PageHeader
      emoji="📍"
      title="Events"
      subtitle={
        file
          ? `${allEvents.length} events · updated ${relativeTime(file.generatedAt, now)}`
          : 'Public events around Trentino, Bolzano and Verona.'
      }
    >
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          className="min-w-10 px-2"
          aria-label={selecting ? 'Cancel selection' : 'Select events'}
          onClick={() => (selecting ? exitSelect() : setSelecting(true))}
        >
          {selecting ? <XIcon /> : <ListChecksIcon />}
        </Button>
        <Button className="min-w-10 px-2" onClick={openAdd} aria-label="Add event">
          <PlusIcon />
        </Button>
      </div>
    </PageHeader>
  )

  const editorSheet = (
    <CustomEventSheet
      open={editor.open}
      onClose={closeEditor}
      editing={editor.open ? editor.editing : null}
      prefill={editor.open ? editor.prefill : null}
      cities={cityNames}
      onDelete={onDeleteCustom}
      onSaved={closeEditor}
    />
  )

  if (cache === null || prefs === null || marksRaw === undefined || customRows === undefined) {
    return (
      <div>
        {header}
        <SkeletonList rows={4} rowClassName="h-24" />
        {editorSheet}
      </div>
    )
  }

  if (!file && !hasCustom) {
    return (
      <div>
        {header}
        {editorSheet}
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
            hint="Nothing is saved on this device yet. Connect once and they will be kept for offline use. Your own events (＋ Add) work offline."
          />
        )}
        {pendingUndo && <Snackbar label={pendingUndo.label} onUndo={confirmUndo} />}
      </div>
    )
  }

  const filterProps: FilterPanelProps = {
    catOrder: counts.catOrder,
    catCounts: counts.catCounts,
    activeCats,
    favourites,
    distanceCounts: counts.distanceCounts,
    maxMin,
    onToggleMaxMin: toggles.toggleMaxMin,
    showHidden,
    canShowHidden: view !== 'saved',
    canReset: filtering || showHidden,
    total,
    onToggleCat: toggles.toggleCat,
    onToggleFavourite: (id) => void toggles.toggleFavourite(id),
    formatCounts: counts.formatCounts,
    selectedFormats,
    onToggleFormat: toggles.toggleFormat,
    onShowHidden: toggles.setShowHidden,
    onClearAll: toggles.clearAll,
  }

  const notices = (
    <>
      {file && fetchState === 'offline' && (
        <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
          Offline — showing copy from {formatDateLocal(cache?.fetchedAt ?? 0, undefined, 'it-IT')}
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
    </>
  )

  // View tabs, search, date chips: on top of the list in both layouts.
  const controls = (
    <>
      <div className="mb-3 grid grid-cols-3 gap-2">
        {(
          [
            ['all', 'All'],
            ['open', 'Open now'],
            [
              'saved',
              `Saved${marksRaw.filter((m) => m.state === 'saved').length ? ` (${marksRaw.filter((m) => m.state === 'saved').length})` : ''}`,
            ],
          ] as [View, string][]
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            aria-pressed={view === id}
            onClick={() => toggles.setView(id)}
            className={`min-h-10 rounded-lg px-2 text-sm font-medium transition-colors ${FOCUS_RING} ${
              view === id
                ? 'bg-(color:--accent-selected) text-(color:--accent-fg)'
                : 'bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="relative mb-2">
        <input
          ref={searchRef}
          type="text"
          inputMode="search"
          enterKeyHint="search"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          aria-label="Search events"
          placeholder="Search title, venue, city…"
          value={query}
          onChange={(e) => toggles.setQuery(e.target.value)}
          className="h-10 w-full rounded-lg border-2 border-slate-200 bg-white pr-10 pl-3 text-base text-slate-900 placeholder:text-slate-500 dark:placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100"
        />
        {!query && <Kbd>/</Kbd>}
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => toggles.setQuery('')}
          className={`absolute top-0 right-0 flex size-10 items-center justify-center text-slate-500 dark:text-slate-400 ${FOCUS_RING_INSET} ${
            query ? '' : 'invisible'
          }`}
        >
          ✕
        </button>
      </div>

      <div className="mb-2 grid grid-cols-[1fr_1fr_1fr_1.4fr] gap-2">
        {DATE_CHIPS.map(({ id, label }) => (
          <Chip key={id} active={dateChip === id} onClick={() => toggles.toggleDateChip(id)}>
            {label}
          </Chip>
        ))}
        {newCount > 0 && (
          <Chip active={newOnly} count={newCount} onClick={() => setOnlyNew((v) => !v)} className="col-span-4">
            New since last visit
          </Chip>
        )}
      </div>
    </>
  )

  const list = (
    <>
      {total === 0 ? (
        <EmptyState
          emoji={view === 'saved' ? '☆' : '🔎'}
          title={view === 'saved' ? 'Nothing saved yet' : 'No events match'}
          hint={
            view === 'saved'
              ? 'Open an event and tap Save to keep it here.'
              : filtering || dateChip || nq
                ? 'Try clearing the filters.'
                : 'Nothing to show right now.'
          }
        />
      ) : (
        <div className="space-y-5">
          <WeekSections
            weeks={weeks}
            collapsedWeeks={collapsedWeeks}
            onToggleWeek={toggleWeek}
            marks={marks}
            now={now}
            since={since}
            selecting={selecting}
            selectedIds={selectedIds}
            onToggleSave={onToggleSave}
            onToggleHide={onToggleHide}
            onEdit={onEdit}
            onSelect={onSelect}
            master={wide}
            activeId={activeId}
            onActivate={onActivate}
            repeats={repeats}
          />
          {limit < total && (
            <div className="flex justify-center">
              <Button variant="ghost" onClick={toggles.showMore}>
                Show more ({total - limit} left)
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  )

  const bars = (
    <>
      {selecting && <SelectionBar count={selectedIds.size} onSelectAll={selectAllVisible} onHide={hideSelected} />}
      {!selecting && pendingUndo && <Snackbar label={pendingUndo.label} onUndo={confirmUndo} />}
    </>
  )

  if (wide) {
    // lg+ (UI2): filter rail | list | detail panel. @container on our own
    // wrapper (never on <main>, see docs/ARCHITECTURE.md); the fixed bars and
    // the sheets stay outside it.
    const sticky =
      'sticky top-[calc(env(safe-area-inset-top)+1rem)] max-h-[calc(100dvh-env(safe-area-inset-top)-2rem)] overflow-y-auto overscroll-contain'
    return (
      <div>
        {header}
        {editorSheet}
        {notices}
        <div className="@container">
          <div className="grid grid-cols-[12rem_minmax(0,1fr)_18rem] items-start gap-4 @min-[64rem]:grid-cols-[15rem_minmax(0,1fr)_22rem] @min-[64rem]:gap-6">
            <aside aria-label="Filters" className={`${sticky} pr-1`}>
              <FilterPanel variant="rail" {...filterProps} />
            </aside>
            {/* Arrow keys / Home / End / Esc move the selection while focus is in
                the list or the panel (never in the search field). */}
            <div ref={listRef} tabIndex={-1} onKeyDown={onListKeyDown} className="min-w-0 focus:outline-none">
              {controls}
              <div className="mt-4">{list}</div>
              {hasCustom && (
                <div className="mt-8">
                  <SyncCard sync={customSync} />
                </div>
              )}
            </div>
            <aside aria-label="Event details" onKeyDown={onListKeyDown} className={sticky}>
              <EventDetail
                event={activeEvent}
                saved={activeEvent ? marks.get(activeEvent.id)?.state === 'saved' : false}
                hidden={activeEvent ? marks.get(activeEvent.id)?.state === 'hidden' : false}
                now={now}
                onToggleSave={onToggleSave}
                onToggleHide={onToggleHide}
                onEdit={onEdit}
                onClose={() => setActiveId(null)}
              />
            </aside>
          </div>
        </div>
        {bars}
      </div>
    )
  }

  return (
    <div>
      {header}

      {editorSheet}
      {notices}
      {controls}
      <div className="-mx-4 mb-4 overflow-x-auto px-4 pb-1">
        <div className="flex w-max items-center gap-2">
          <Chip active={maxMin !== null} onClick={() => toggles.toggleMaxMin(maxMin ?? NEAR_MINUTES)}>
            {maxMin === null ? `Vicino · ${NEAR_MINUTES} min` : `Entro ${minutesLabel(maxMin)} ✕`}
          </Chip>
          <Chip toggle={false} active={filterCount > 0} onClick={() => setSheetOpen(true)}>
            Filters{filterCount ? ` · ${filterCount}` : ''}
          </Chip>
          {activeCats.map((id) => (
            <Chip
              key={`c-${id}`}
              toggle={false}
              active={false}
              aria-label={`Remove filter ${categoryLabel(id)}`}
              onClick={() => toggles.toggleCat(id)}
            >
              {categoryLabel(id)} ✕
            </Chip>
          ))}
          {selectedFormats.map((id) => (
            <Chip
              key={`f-${id}`}
              toggle={false}
              active={false}
              aria-label={`Remove filter ${formatLabel(id)}`}
              onClick={() => toggles.toggleFormat(id)}
            >
              {formatLabel(id)} ✕
            </Chip>
          ))}
          {(filtering || selectedCats !== null) && (
            <Chip toggle={false} active={false} onClick={toggles.clearAll} className="underline">
              Clear
            </Chip>
          )}
        </div>
      </div>

      <FilterSheet open={sheetOpen} onClose={() => setSheetOpen(false)} {...filterProps} />

      {list}
      {hasCustom && (
        <div className="mt-8">
          <SyncCard sync={customSync} />
        </div>
      )}
      {bars}
    </div>
  )
}
