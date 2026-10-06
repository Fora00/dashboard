import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { useSearchParams } from 'react-router-dom'
import { db, type CustomEvent, type EventMark } from '../../lib/db'
import { deleteCustomEvent, pruneCustomEvents, sync as customSync } from '../../lib/customEventsSync'
import { hideEvents, pruneEventMarks, restoreEventMark, toggleEventMark } from '../../lib/eventMarksSync'
import { SyncCard } from '../../components/SyncCard'
import { PageHeader } from '../../components/PageHeader'
import { EmptyState } from '../../components/EmptyState'
import { Button } from '../../components/Button'
import { Chip } from '../../components/Chip'
import { FOCUS_RING, FOCUS_RING_INSET } from '../../components/focus'
import { Snackbar } from '../../components/Snackbar'
import { useUndoSnackbar } from '../../lib/useUndoSnackbar'
import { SkeletonList } from '../../components/Skeleton'
import { FilterSheet } from './FilterSheet'
import { CustomEventSheet } from './CustomEventSheet'
import { PREFILL_KEYS, mergeEvents, parsePrefill, type CustomEventForm } from './custom'
import { DATE_CHIPS } from './filters'
import { NEAR_MINUTES, minutesLabel } from './distance'
import { formatLabel } from './format'
import { EventCard } from './EventCard'
import { EyeOffIcon, ListChecksIcon, PlusIcon, XIcon } from './icons'
import { useEventFilters, type View } from './useEventFilters'
import type { EventItem } from './types'
import { categoryLabel, fetchEventsFile, groupByWeek, isKidsEvent, relativeTime } from './model'

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

  useEffect(() => {
    let cancelled = false
    void (async () => {
      const out = await fetchEventsFile()
      if (cancelled) return
      if (out.kind === 'ok') {
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
  const events = useMemo(() => mergeEvents(file?.events ?? [], customRows ?? [], isKidsEvent), [file, customRows])
  const hasCustom = (customRows?.length ?? 0) > 0
  const cityNames = useMemo(() => [...new Set(events.map((e) => e.city))].sort((a, b) => a.localeCompare(b)), [events])

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
  const { visibleGroups, total, limit } = groups
  const weeks = useMemo(() => groupByWeek(visibleGroups, now), [visibleGroups, now])
  // Weeks the user folded away (all open by default).
  const [collapsedWeeks, setCollapsedWeeks] = useState<ReadonlySet<string>>(new Set())
  const toggleWeek = (k: string) =>
    setCollapsedWeeks((prev) => {
      const next = new Set(prev)
      if (!next.delete(k)) next.add(k)
      return next
    })

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
  const onSelect = useCallback((e: EventItem) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (!next.delete(e.id)) next.add(e.id)
      return next
    })
  }, [])
  const exitSelect = () => {
    setSelecting(false)
    setSelectedIds(new Set())
  }
  const onEdit = useCallback((e: EventItem) => {
    void db.customEvents.get(e.id).then((row) => {
      if (row) setEditor({ open: true, editing: row, prefill: null })
    })
  }, [])
  const openAdd = () => setEditor({ open: true, editing: null, prefill: null })
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
          ? `${events.length} events · updated ${relativeTime(file.generatedAt, now)}`
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

  return (
    <div>
      {header}

      {editorSheet}
      {file && fetchState === 'offline' && (
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
                ? 'bg-indigo-500 text-white'
                : 'bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="relative mb-2">
        <input
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
          className="h-10 w-full rounded-lg border-2 border-slate-200 bg-white pr-10 pl-3 text-base text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100"
        />
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
      </div>

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

      <FilterSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        catOrder={counts.catOrder}
        catCounts={counts.catCounts}
        activeCats={activeCats}
        favourites={favourites}
        distanceCounts={counts.distanceCounts}
        maxMin={maxMin}
        onToggleMaxMin={toggles.toggleMaxMin}
        showHidden={showHidden}
        canShowHidden={view !== 'saved'}
        canReset={filtering || showHidden}
        total={total}
        onToggleCat={toggles.toggleCat}
        onToggleFavourite={(id) => void toggles.toggleFavourite(id)}
        formatCounts={counts.formatCounts}
        selectedFormats={selectedFormats}
        onToggleFormat={toggles.toggleFormat}
        onShowHidden={toggles.setShowHidden}
        onClearAll={toggles.clearAll}
      />

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
          {weeks.map((w) => {
            const isOpenNow = w.key === 'open-now'
            const folded = !isOpenNow && collapsedWeeks.has(w.key)
            return (
              <section key={w.key} aria-label={w.label}>
                <h2 className="mb-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                  {isOpenNow ? (
                    w.label
                  ) : (
                  <button
                    type="button"
                    onClick={() => toggleWeek(w.key)}
                    aria-expanded={!folded}
                    title={folded ? 'Show this week' : 'Hide this week'}
                    className={`flex min-h-10 w-full items-center gap-1.5 rounded-lg text-left ${FOCUS_RING}`}
                  >
                    <span aria-hidden="true" className="text-xs">{folded ? '▸' : '▾'}</span>
                    {w.label}
                    <span className="text-xs font-normal text-slate-500 dark:text-slate-400" title={`${w.count} events`}>
                      · {w.count} 📍
                    </span>
                  </button>
                  )}
                </h2>
                {!folded && (
                  <div className="space-y-5">
                    {w.days.map((g) => (
                      <div key={g.key}>
                        {w.key !== 'open-now' && (
                          <h3 className="mb-2 text-sm font-semibold text-slate-500 dark:text-slate-400">{g.label}</h3>
                        )}
                        <ul className="space-y-2">
                          {g.events.map((e) => (
                            <EventCard
                              key={`${g.key}-${e.id}`}
                              event={e}
                              saved={marks.get(e.id)?.state === 'saved'}
                              hidden={marks.get(e.id)?.state === 'hidden'}
                              now={now}
                              onToggleSave={onToggleSave}
                              onToggleHide={onToggleHide}
                              onEdit={onEdit}
                              selecting={selecting}
                              selected={selectedIds.has(e.id)}
                              onSelect={onSelect}
                            />
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )
          })}
          {limit < total && (
            <div className="flex justify-center">
              <Button variant="ghost" onClick={toggles.showMore}>
                Show more ({total - limit} left)
              </Button>
            </div>
          )}
        </div>
      )}
      {hasCustom && (
        <div className="mt-8">
          <SyncCard sync={customSync} />
        </div>
      )}
      {selecting && (
        <div
          className="fixed inset-x-0 z-20 flex justify-center px-4"
          style={{ bottom: 'calc(env(safe-area-inset-bottom) + 1rem)' }}
        >
          <div className="flex items-center gap-1 rounded-full bg-white py-2 pl-4 pr-2 text-sm font-medium text-slate-900 shadow-lg ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:ring-slate-700">
            <span className="shrink-0">{selectedIds.size} selected</span>
            <button
              type="button"
              onClick={selectAllVisible}
              className="flex min-h-10 min-w-10 items-center justify-center rounded-full px-3 text-indigo-600 dark:text-indigo-300"
            >
              <ListChecksIcon />
              <span className="sr-only">Select all</span>
            </button>
            <button
              type="button"
              disabled={selectedIds.size === 0}
              onClick={hideSelected}
              className="flex min-h-10 min-w-12 items-center justify-center rounded-full bg-indigo-500 px-4 font-semibold text-white disabled:opacity-40"
            >
              <EyeOffIcon />
              <span className="sr-only">Hide selected</span>
            </button>
          </div>
        </div>
      )}
      {!selecting && pendingUndo && <Snackbar label={pendingUndo.label} onUndo={confirmUndo} />}
    </div>
  )
}
