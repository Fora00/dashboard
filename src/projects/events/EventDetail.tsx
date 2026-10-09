import { useState } from 'react'
import { FOCUS_RING } from '../../components/focus'
import type { EventItem } from './types'
import { CategoryThumb } from './CategoryThumb'
import { travelLabel } from './travel'
import { EventActions } from './EventActions'
import { EventBadges } from './EventBadges'
import { XIcon } from './icons'
import { eventImage, eventPlace, mapsUrl } from './display'
import { categoryOf, formatRange, isSparseSeries, listingDay, safeHttpUrl, shortDay } from './model'

interface Props {
  event: EventItem | null
  saved: boolean
  hidden: boolean
  now: number
  onToggleSave: (e: EventItem) => void
  onToggleHide: (e: EventItem) => void
  onEdit: (e: EventItem) => void
  /** Clear the selection (the ✕, or Esc on the page). */
  onClose: () => void
}

const LINK = `inline-flex min-h-10 items-center text-sm text-(--accent-border) underline ${FOCUS_RING}`

/** Right-hand panel of the lg+ master-detail layout: everything about the selected event. */
export function EventDetail({ event, ...rest }: Props) {
  if (!event) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 px-6 py-10 text-center dark:border-slate-700">
        <p className="text-base font-medium text-slate-700 dark:text-slate-200">Select an event</p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Click a card, or use <kbd className="font-sans">↑</kbd> <kbd className="font-sans">↓</kbd> in the list.{' '}
          <kbd className="font-sans">Esc</kbd> clears.
        </p>
      </div>
    )
  }
  // Keyed by id: the image error state belongs to one event.
  return <Detail key={event.id} event={event} {...rest} />
}

function Detail({
  event: e,
  saved,
  hidden,
  now,
  onToggleSave,
  onToggleHide,
  onEdit,
  onClose,
}: Props & { event: EventItem }) {
  const [imgOk, setImgOk] = useState(true)
  const image = eventImage(e)
  const showImage = image !== null && imgOk
  const place = eventPlace(e)
  const drive = travelLabel(e)
  const url = safeHttpUrl(e.url)
  const maps = mapsUrl(e)
  const series = isSparseSeries(e)
  const text = e.description || e.summary

  return (
    <article
      aria-label={e.title}
      className={`overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-800/50 ${
        hidden ? 'opacity-80' : ''
      }`}
    >
      <div className="relative">
        {showImage ? (
          <img
            src={image}
            alt=""
            decoding="async"
            onError={() => setImgOk(false)}
            className="aspect-video w-full bg-slate-100 object-cover dark:bg-slate-700"
          />
        ) : (
          <CategoryThumb category={categoryOf(e)} className="h-28 w-full text-5xl" />
        )}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close details"
          title="Close (Esc)"
          className={`absolute top-2 right-2 flex size-10 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-sm hover:bg-white dark:bg-slate-900/80 dark:text-slate-200 dark:hover:bg-slate-900 ${FOCUS_RING}`}
        >
          <XIcon />
        </button>
      </div>

      <div className="space-y-2 px-4 pt-3 pb-2">
        <h2 className="text-lg leading-snug font-semibold">
          {e.title}
          {saved && (
            <span aria-label="Saved" className="ml-1.5 text-amber-500">
              ★
            </span>
          )}
        </h2>
        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{formatRange(e)}</p>
        {e.occurrences > 1 && (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {e.occurrences} dates
            {series ? ` · next ≈ ${shortDay(listingDay(e, now))}` : ''}
          </p>
        )}
        {place && (
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {place}
            {drive && <span className="whitespace-nowrap text-slate-500 dark:text-slate-400"> · 🚗 {drive}</span>}
          </p>
        )}
        <EventBadges event={e} hidden={hidden} now={now} />
      </div>

      <EventActions
        event={e}
        saved={saved}
        hidden={hidden}
        onToggleSave={onToggleSave}
        onToggleHide={onToggleHide}
        onEdit={onEdit}
        className="border-y border-slate-100 px-2 py-1 dark:border-slate-700/50"
      />

      <div className="space-y-2 px-4 py-3">
        {text ? (
          <p className="text-sm whitespace-pre-line text-slate-700 dark:text-slate-300">{text}</p>
        ) : (
          <p className="text-sm text-slate-500 italic dark:text-slate-400">No description.</p>
        )}
        <div className="flex flex-wrap gap-x-4">
          {url && (
            <a href={url} target="_blank" rel="noopener" className={LINK}>
              Open event page ↗
            </a>
          )}
          {maps && (
            <a href={maps} target="_blank" rel="noopener" className={LINK}>
              Map ↗
            </a>
          )}
        </div>
      </div>
    </article>
  )
}
