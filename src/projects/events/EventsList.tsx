import { EventCard } from './EventCard'
import { FOCUS_RING } from '../../components/focus'
import type { EventMark } from '../../lib/db'
import type { WeekGroup } from './model'
import type { EventItem } from './types'
import { EyeOffIcon, ListChecksIcon } from './icons'

/** Floating bar shown while multi-selecting events to hide. */
export function SelectionBar({
  count,
  onSelectAll,
  onHide,
}: {
  count: number
  onSelectAll: () => void
  onHide: () => void
}) {
  return (
    <div
      className="fixed inset-x-0 z-20 flex justify-center px-4"
      style={{ bottom: 'calc(env(safe-area-inset-bottom) + 1rem)' }}
    >
      <div className="flex items-center gap-1 rounded-full bg-white py-2 pl-4 pr-2 text-sm font-medium text-slate-900 shadow-lg ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:ring-slate-700">
        <span className="shrink-0">{count} selected</span>
        <button
          type="button"
          onClick={onSelectAll}
          className="flex min-h-10 min-w-10 items-center justify-center rounded-full px-3 text-(--accent-border)"
        >
          <ListChecksIcon />
          <span className="sr-only">Select all</span>
        </button>
        <button
          type="button"
          disabled={count === 0}
          onClick={onHide}
          className="flex min-h-10 min-w-12 items-center justify-center rounded-full bg-(color:--accent-selected) px-4 font-semibold text-(color:--accent-fg) disabled:opacity-40"
        >
          <EyeOffIcon />
          <span className="sr-only">Hide selected</span>
        </button>
      </div>
    </div>
  )
}

/** Week > day > event cards, with foldable weeks (the "open now" group never folds). */
export function WeekSections({
  weeks,
  collapsedWeeks,
  onToggleWeek,
  marks,
  now,
  selecting,
  selectedIds,
  onToggleSave,
  onToggleHide,
  onEdit,
  onSelect,
  master = false,
  activeId = null,
  onActivate,
}: {
  weeks: WeekGroup[]
  collapsedWeeks: ReadonlySet<string>
  onToggleWeek: (key: string) => void
  marks: Map<string, EventMark>
  now: number
  selecting: boolean
  selectedIds: ReadonlySet<string>
  onToggleSave: (e: EventItem) => void
  onToggleHide: (e: EventItem) => void
  onEdit: (e: EventItem) => void
  onSelect: (e: EventItem, range?: boolean) => void
  /** lg+ master-detail: a tap shows the event in the detail panel. */
  master?: boolean
  activeId?: string | null
  onActivate?: (e: EventItem) => void
}) {
  return (
    <>
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
                  onClick={() => onToggleWeek(w.key)}
                  aria-expanded={!folded}
                  title={folded ? 'Show this week' : 'Hide this week'}
                  className={`flex min-h-10 w-full items-center gap-1.5 rounded-lg text-left ${FOCUS_RING}`}
                >
                  <span aria-hidden="true" className="text-xs">
                    {folded ? '▸' : '▾'}
                  </span>
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
                          master={master}
                          active={activeId === e.id}
                          onActivate={onActivate}
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
    </>
  )
}
