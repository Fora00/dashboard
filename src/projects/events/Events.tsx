import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, type EventMark } from '../../lib/db'
import { PageHeader } from '../../components/PageHeader'
import { EmptyState } from '../../components/EmptyState'
import { Button } from '../../components/Button'
import { Chip } from '../../components/Chip'
import { FOCUS_RING, FOCUS_RING_INSET } from '../../components/focus'
import { Snackbar } from '../../components/Snackbar'
import { useUndoSnackbar } from '../../lib/useUndoSnackbar'
import { SkeletonList } from '../../components/Skeleton'
import { FilterSheet } from './FilterSheet'
import { DATE_CHIPS } from './filters'
import { formatLabel } from './format'
import { EventCard } from './EventCard'
import { useEventFilters, type View } from './useEventFilters'
import type { EventItem } from './types'
import { areaLabel, categoryLabel, fetchEventsFile, isKidsEvent, relativeTime } from './model'

export function Events() {
  const { trigger: triggerUndo, pending: pendingUndo, confirmUndo } = useUndoSnackbar()
  const cache = useLiveQuery(() => db.eventsCache.get('latest'), [], null)
  const marksRaw = useLiveQuery(() => db.eventMarks.toArray())
  const prefs = useLiveQuery(() => db.eventPrefs.get('prefs'), [], null)

  const [fetchState, setFetchState] = useState<'loading' | 'ok' | 'offline' | 'missing'>('loading')
  const [sheetOpen, setSheetOpen] = useState(false)
  const [showSources, setShowSources] = useState(false)
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

  const file = cache?.file
  // Children's/family events are never shown (owner's choice); saved ones
  // still appear under Saved from their snapshot.
  const events = useMemo(() => (file?.events ?? []).filter((e) => !isKidsEvent(e)), [file])

  const { filters, toggles, counts, groups, marks } = useEventFilters(events, marksRaw, prefs, {
    now,
    persist: Boolean(file),
  })
  const { view, query, nq, dateChip, showHidden, selectedCats, selectedAreas, selectedCities, selectedFormats, activeCats, favourites, filtering, filterCount } = filters
  const { visibleGroups, total, limit } = groups

  // Stable across renders (they read the current mark from Dexie), so the
  // memoised EventCards only re-render when their own props change.
  const setMark = useCallback(
    async (e: EventItem, state: EventMark['state']) => {
      const prev = await db.eventMarks.get(e.id)
      if (prev?.state === state) await db.eventMarks.delete(e.id)
      else await db.eventMarks.put({ id: e.id, state, event: e, updatedAt: Date.now() })
      // Hiding makes the card vanish: offer Undo, restoring the previous mark.
      if (state === 'hidden' && prev?.state !== 'hidden') {
        triggerUndo('Event hidden', async () => {
          if (prev) await db.eventMarks.put(prev)
          else await db.eventMarks.delete(e.id)
        })
      }
    },
    [triggerUndo],
  )
  const onToggleSave = useCallback((e: EventItem) => void setMark(e, 'saved'), [setMark])
  const onToggleHide = useCallback((e: EventItem) => void setMark(e, 'hidden'), [setMark])

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

      <div className="mb-2 grid grid-cols-3 gap-2">
        {DATE_CHIPS.map(({ id, label }) => (
          <Chip key={id} active={dateChip === id} onClick={() => toggles.toggleDateChip(id)}>
            {label}
          </Chip>
        ))}
      </div>

      <div className="-mx-4 mb-4 overflow-x-auto px-4 pb-1">
        <div className="flex w-max items-center gap-2">
          <Chip toggle={false} active={filterCount > 0} onClick={() => setSheetOpen(true)}>
            Filters{filterCount ? ` · ${filterCount}` : ''}
          </Chip>
          {selectedAreas.map((id) => (
            <Chip
              key={`a-${id}`}
              toggle={false}
              active={false}
              aria-label={`Remove filter ${areaLabel(id)}`}
              onClick={() => toggles.toggleArea(id)}
            >
              {areaLabel(id)} ✕
            </Chip>
          ))}
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
          {selectedCities.map((city) => (
            <Chip
              key={`t-${city}`}
              toggle={false}
              active={false}
              aria-label={`Remove filter ${city}`}
              onClick={() => toggles.toggleCity(city)}
              className="max-w-48 truncate"
            >
              {city} ✕
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
        areaCounts={counts.areaCounts}
        selectedAreas={selectedAreas}
        onToggleArea={toggles.toggleArea}
        cityCounts={counts.cityCounts}
        selectedCities={selectedCities}
        showHidden={showHidden}
        canShowHidden={view !== 'saved'}
        canReset={filtering || showHidden}
        total={total}
        onToggleCat={toggles.toggleCat}
        onToggleFavourite={(id) => void toggles.toggleFavourite(id)}
        onToggleCity={toggles.toggleCity}
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
                    onToggleSave={onToggleSave}
                    onToggleHide={onToggleHide}
                  />
                ))}
              </ul>
            </section>
          ))}
          {limit < total && (
            <div className="flex justify-center">
              <Button variant="ghost" onClick={toggles.showMore}>
                Show more ({total - limit} left)
              </Button>
            </div>
          )}
        </div>
      )}
      {pendingUndo && <Snackbar label={pendingUndo.label} onUndo={confirmUndo} />}
    </div>
  )
}

