import { memo, useState } from 'react'
import type { EventItem } from './types'
import { FOCUS_RING, FOCUS_RING_INSET } from '../../components/focus'
import { CategoryThumb } from './CategoryThumb'
import { travelLabel } from './travel'
import { EventActions } from './EventActions'
import type { InterestState } from './InterestButtons'
import type { InterestValue } from './interest'
import { EventBadges } from './EventBadges'
import { eventImage, eventPlace } from './display'
import { categoryOf, formatRange, isSparseSeries, listingDay, safeHttpUrl, shortDay } from './model'

interface Props {
  event: EventItem
  saved: boolean
  hidden: boolean
  now: number
  /** Previous-visit baseline for the "New" badge (null = none). */
  since?: number | null
  /** Receive the event so the parent can pass one stable callback to every card (memo). */
  onToggleSave: (e: EventItem) => void
  onToggleHide: (e: EventItem) => void
  /** The owner's 👍 / 👎 on this event (0 = none) and its toggle. */
  interest?: InterestState
  onInterest?: ((e: EventItem, value: InterestValue) => void) | undefined
  /** Hand-added events only: open the edit sheet. */
  onEdit?: ((e: EventItem) => void) | undefined
  /** Multi-select mode: tapping the card toggles `selected` instead of expanding it. */
  selecting?: boolean
  selected?: boolean
  /** `range` = shift held: select everything between the last pick and this card. */
  onSelect?: ((e: EventItem, range?: boolean) => void) | undefined
  /**
   * Master-detail (lg+): tapping the card shows it in the detail panel
   * (`onActivate`) instead of expanding it inline; `active` = the one shown.
   */
  master?: boolean
  active?: boolean
  onActivate?: ((e: EventItem) => void) | undefined
  /** "Ordina per te" on: why it ranks here ("perché: …"), shown when expanded. */
  why?: string | undefined
}

export const EventCard = memo(function EventCard({
  event: e,
  saved,
  hidden,
  now,
  since = null,
  onToggleSave,
  onToggleHide,
  interest = 0,
  onInterest,
  onEdit,
  selecting = false,
  selected = false,
  onSelect,
  master = false,
  active = false,
  onActivate,
  why,
}: Props) {
  const [open, setOpen] = useState(false)
  const [imgOk, setImgOk] = useState(true)
  const drive = travelLabel(e)
  const place = eventPlace(e)
  const url = safeHttpUrl(e.url)
  const image = eventImage(e)
  const showImage = image !== null && imgOk
  const series = isSparseSeries(e)
  // In master mode the card never expands (the detail panel shows it all).
  const expanded = open && !master && !selecting
  const highlighted = master && active && !selecting

  return (
    <li
      className={`overflow-hidden rounded-xl border ${
        highlighted
          ? 'border-(color:--accent-border) bg-white ring-1 ring-(color:--accent-border) dark:bg-slate-800/50'
          : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-800/50'
      } ${hidden ? 'opacity-60' : ''} ${selected ? 'ring-2 ring-(color:--accent-ring)' : ''}`}
    >
      <button
        type="button"
        data-event-id={e.id}
        onMouseDown={(ev) => {
          // Shift-click range select must not also select text.
          if (selecting && ev.shiftKey) ev.preventDefault()
        }}
        onClick={(ev) => (selecting ? onSelect?.(e, ev.shiftKey) : master ? onActivate?.(e) : setOpen((v) => !v))}
        {...(selecting
          ? { 'aria-pressed': selected }
          : master
            ? { 'aria-current': highlighted ? ('true' as const) : undefined }
            : { 'aria-expanded': open })}
        className={`block min-h-10 w-full text-left transition-colors active:bg-slate-100 dark:active:bg-slate-800 ${FOCUS_RING_INSET}`}
      >
        <div className="flex items-start gap-3 px-3 py-3">
          {selecting && (
            <span
              aria-hidden
              className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border-2 text-sm ${
                selected
                  ? 'border-(color:--accent-border) bg-(color:--accent-selected) text-(color:--accent-fg)'
                  : 'border-slate-300 dark:border-slate-600'
              }`}
            >
              {selected ? '✓' : ''}
            </span>
          )}
          {showImage ? (
            <img
              src={image}
              alt=""
              loading="lazy"
              decoding="async"
              width={80}
              height={80}
              onError={() => setImgOk(false)}
              className="size-20 shrink-0 rounded-lg bg-slate-100 object-cover dark:bg-slate-700"
            />
          ) : (
            <CategoryThumb category={categoryOf(e)} className="size-20 rounded-lg" />
          )}
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-start justify-between gap-2">
              <span className="min-w-0 font-semibold leading-snug">{e.title}</span>
              {saved && <span aria-label="Saved">★</span>}
            </div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{formatRange(e)}</p>
            {place && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {place}
                {drive && <span className="whitespace-nowrap"> · 🚗 {drive}</span>}
              </p>
            )}
            <EventBadges event={e} hidden={hidden} now={now} since={since} />
            {e.occurrences > 1 && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {e.occurrences} dates
                {series ? ` · next ≈ ${shortDay(listingDay(e, now))}` : ''}
              </p>
            )}
            {e.summary && !(open && !master) && (
              <p className="line-clamp-2 pt-1 text-sm text-slate-600 dark:text-slate-400">{e.summary}</p>
            )}
          </div>
        </div>
      </button>
      {selecting ? null : (
        <EventActions
          event={e}
          saved={saved}
          hidden={hidden}
          onToggleSave={onToggleSave}
          onToggleHide={onToggleHide}
          interest={interest}
          onInterest={onInterest}
          onEdit={onEdit}
          className="border-t border-slate-100 px-2 py-1 dark:border-slate-700/50"
        />
      )}
      {expanded && (
        <div className="space-y-3 border-t border-slate-200 px-4 py-3 dark:border-slate-800">
          {why && <p className="text-xs text-slate-500 italic dark:text-slate-400">{why}</p>}
          {showImage && (
            <img
              src={image}
              alt=""
              loading="lazy"
              className="aspect-video w-full rounded-lg bg-slate-100 object-cover dark:bg-slate-700"
            />
          )}
          {(e.description || e.summary) && (
            <p className="text-sm whitespace-pre-line text-slate-700 dark:text-slate-300">
              {e.description || e.summary}
            </p>
          )}
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener"
              className={`inline-flex min-h-10 items-center text-sm text-(--accent-border) underline ${FOCUS_RING}`}
            >
              Open event page ↗
            </a>
          )}
        </div>
      )}
    </li>
  )
})
