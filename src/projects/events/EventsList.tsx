import { Fragment, useState } from 'react'
import { EventCard } from './EventCard'
import { FOCUS_RING } from '../../components/focus'
import type { EventMark } from '../../lib/db'
import { formatRange, isFlatGroup, isNew, listingDay, shortDay, type WeekGroup } from './model'
import { eventPlace } from './display'
import type { EventItem } from './types'
import type { InterestValue } from './interest'
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

/**
 * The other dates of a repeated event (groups.ts), under the card of its next
 * occurrence: a toggle "17 dates · next ≈ …" and, open, one compact row per
 * date (day/time, place); tapping a row shows the normal card with its
 * actions. Save/Hide there apply to that one date only.
 */
function RepeatRows({
  dates,
  cardProps,
  now,
  since,
}: {
  dates: EventItem[]
  cardProps: (e: EventItem) => React.ComponentProps<typeof EventCard>
  now: number
  since: number | null
}) {
  const [open, setOpen] = useState(false)
  const [openId, setOpenId] = useState<string | null>(null)
  const anyNew = dates.some((d) => isNew(d, since))
  const first = dates[0]
  return (
    <>
      <li className="-mt-1">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className={`flex min-h-10 w-full items-center gap-2 rounded-lg px-3 text-left text-sm font-medium text-slate-600 dark:text-slate-300 ${FOCUS_RING}`}
        >
          <span aria-hidden="true" className="text-xs">
            {open ? '▾' : '▸'}
          </span>
          <span>
            {dates.length} dates{first ? ` · next ≈ ${shortDay(listingDay(first, now))}` : ''}
          </span>
          {anyNew && (
            <span className="rounded-full bg-violet-100 px-2.5 py-1 text-xs font-medium text-violet-800 dark:bg-violet-500/20 dark:text-violet-200">
              New
            </span>
          )}
        </button>
      </li>
      {open && (
        <li>
          <ul className="space-y-1 border-l-2 border-slate-200 pl-3 dark:border-slate-700">
            {dates.map((d) =>
              openId === d.id ? (
                <EventCard key={d.id} {...cardProps(d)} />
              ) : (
                <li key={d.id}>
                  <button
                    type="button"
                    onClick={() => setOpenId(d.id)}
                    className={`flex min-h-10 w-full flex-col items-start justify-center rounded-lg px-2 py-1 text-left text-sm ${FOCUS_RING}`}
                  >
                    <span className="font-medium text-slate-700 dark:text-slate-200">
                      {isNew(d, since) && <span className="mr-1.5 text-violet-700 dark:text-violet-300">New ·</span>}
                      {formatRange(d)}
                    </span>
                    {eventPlace(d) && (
                      <span className="text-xs text-slate-500 dark:text-slate-400">{eventPlace(d)}</span>
                    )}
                  </button>
                </li>
              ),
            )}
          </ul>
        </li>
      )}
    </>
  )
}

/** Week > day > event cards, with foldable weeks (the "open now" group never folds). */
export function WeekSections({
  weeks,
  collapsedWeeks,
  onToggleWeek,
  marks,
  now,
  since = null,
  selecting,
  selectedIds,
  onToggleSave,
  onToggleHide,
  interest,
  onInterest,
  onEdit,
  onSelect,
  master = false,
  activeId = null,
  onActivate,
  repeats,
  explain,
}: {
  weeks: WeekGroup[]
  collapsedWeeks: ReadonlySet<string>
  onToggleWeek: (key: string) => void
  marks: Map<string, EventMark>
  now: number
  /** Previous-visit baseline for the "New" badge (null = none). */
  since?: number | null
  selecting: boolean
  selectedIds: ReadonlySet<string>
  onToggleSave: (e: EventItem) => void
  onToggleHide: (e: EventItem) => void
  /** event id -> the owner's 👍 (1) / 👎 (-1). */
  interest: ReadonlyMap<string, InterestValue>
  onInterest: (e: EventItem, value: InterestValue) => void
  onEdit: (e: EventItem) => void
  onSelect: (e: EventItem, range?: boolean) => void
  /** lg+ master-detail: a tap shows the event in the detail panel. */
  master?: boolean
  activeId?: string | null
  onActivate?: (e: EventItem) => void
  /** next occurrence's id -> all its dates, for repeated events (groups.ts). */
  repeats?: ReadonlyMap<string, EventItem[]>
  /** "Ordina per te" on: why an event ranks where it does ("perché: …"). */
  explain?: ((e: EventItem) => string) | undefined
}) {
  const cardProps = (e: EventItem): React.ComponentProps<typeof EventCard> => ({
    event: e,
    saved: marks.get(e.id)?.state === 'saved',
    hidden: marks.get(e.id)?.state === 'hidden',
    now,
    since,
    onToggleSave,
    onToggleHide,
    interest: interest.get(e.id) ?? 0,
    onInterest,
    onEdit,
    selecting,
    selected: selectedIds.has(e.id),
    onSelect,
    master,
    active: activeId === e.id,
    onActivate,
    why: explain?.(e),
  })
  return (
    <>
      {weeks.map((w) => {
        const isOpenNow = isFlatGroup(w.key)
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
                    {!isFlatGroup(w.key) && (
                      <h3 className="mb-2 text-sm font-semibold text-slate-500 dark:text-slate-400">{g.label}</h3>
                    )}
                    <ul className="space-y-2">
                      {g.events.map((e) => (
                        <Fragment key={`${g.key}-${e.id}`}>
                          <EventCard {...cardProps(e)} />
                          {!selecting && repeats?.get(e.id) && (
                            <RepeatRows dates={repeats.get(e.id) ?? []} cardProps={cardProps} now={now} since={since} />
                          )}
                        </Fragment>
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
