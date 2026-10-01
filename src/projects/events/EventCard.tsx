import { memo, useState } from 'react'
import { useFlash } from '../../lib/useFlash'
import type { EventItem } from './types'
import { addToCalendar } from './ics'
import { FOCUS_RING, FOCUS_RING_INSET } from '../../components/focus'
import { isManual, isSafeImageDataUrl } from './custom'
import { buildThingsAddUrl, categoryLabel, categoryOf, formatRange, isSparseSeries, isSpot, listingDay, safeHttpUrl, shortDay } from './model'

interface Props {
  event: EventItem
  saved: boolean
  hidden: boolean
  now: number
  /** Receive the event so the parent can pass one stable callback to every card (memo). */
  onToggleSave: (e: EventItem) => void
  onToggleHide: (e: EventItem) => void
  /** Hand-added events only: open the edit sheet. */
  onEdit?: ((e: EventItem) => void) | undefined
}

const ACTION = `inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg px-3.5 text-sm font-medium transition-colors ${FOCUS_RING}`
const GHOST =
  'bg-slate-100 text-slate-800 hover:bg-slate-200 active:bg-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:active:bg-slate-600'

export const EventCard = memo(function EventCard({ event: e, saved, hidden, now, onToggleSave, onToggleHide, onEdit }: Props) {
  const [open, setOpen] = useState(false)
  const [imgOk, setImgOk] = useState(true)
  const [copied, flashCopied] = useFlash(2000)
  const place = [e.venue, e.city].filter(Boolean).join(' · ')
  const url = safeHttpUrl(e.url)
  const manual = isManual(e)
  // Scraped images must be http(s); a hand-added one is an inline JPEG data URL.
  const image = manual && isSafeImageDataUrl(e.image) ? e.image : safeHttpUrl(e.image)
  const showImage = image !== null && imgOk
  const series = isSparseSeries(e)

  // Native share sheet where available (iOS/Android), else copy to clipboard.
  async function share() {
    const text = [e.title, formatRange(e), place].filter(Boolean).join('\n')
    try {
      if (typeof navigator.share === 'function') {
        await navigator.share({ title: e.title, text, ...(url ? { url } : {}) })
        return
      }
      await navigator.clipboard.writeText(url ? `${text}\n${url}` : text)
      flashCopied()
    } catch {
      // Share sheet dismissed or clipboard blocked: nothing to recover.
    }
  }

  return (
    <li
      className={`overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-800/50 ${
        hidden ? 'opacity-60' : ''
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={`block min-h-10 w-full text-left transition-colors active:bg-slate-100 dark:active:bg-slate-800 ${FOCUS_RING_INSET}`}
      >
        <div className="flex items-start gap-3 px-3 py-3">
          {showImage && (
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
          )}
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-start justify-between gap-2">
              <span className="min-w-0 font-medium">{e.title}</span>
              {saved && <span aria-label="Saved">★</span>}
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">{formatRange(e)}</p>
            {place && <p className="text-xs text-slate-500 dark:text-slate-400">{place}</p>}
            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600 dark:bg-slate-700/60 dark:text-slate-300">
                {categoryLabel(categoryOf(e))}
              </span>
              {manual && (
                <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-medium text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200">
                  Added by you
                </span>
              )}
              {isSpot(e) && (
                <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-800 dark:bg-amber-500/20 dark:text-amber-200">
                  Spot
                </span>
              )}
              {e.occurrences > 1 && (
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {e.occurrences} dates{series ? ` · next ≈ ${shortDay(listingDay(e, now))}` : ''}
                </span>
              )}
              {hidden && <span className="text-xs text-slate-500">hidden</span>}
            </div>
            {e.summary && !open && (
              <p className="line-clamp-2 pt-1 text-sm text-slate-600 dark:text-slate-400">{e.summary}</p>
            )}
          </div>
        </div>
      </button>
      <div className="flex flex-wrap gap-2 px-3 pb-3">
        <button type="button" onClick={() => onToggleSave(e)} className={`${ACTION} ${GHOST}`}>
          {saved ? '★ Saved' : '☆ Save'}
        </button>
        <button type="button" onClick={() => onToggleHide(e)} className={`${ACTION} ${GHOST}`}>
          {hidden ? 'Unhide' : '✕ Hide'}
        </button>
        <button type="button" onClick={() => void share()} className={`${ACTION} ${GHOST}`}>
          {copied ? 'Copied ✓' : '↗ Share'}
        </button>
        {manual && onEdit && (
          <button type="button" onClick={() => onEdit(e)} className={`${ACTION} ${GHOST}`}>
            ✎ Edit
          </button>
        )}
      </div>
      {open && (
        <div className="space-y-3 border-t border-slate-200 px-4 py-3 dark:border-slate-800">
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
              className={`inline-flex min-h-10 items-center text-sm text-indigo-600 underline dark:text-indigo-400 ${FOCUS_RING}`}
            >
              Open event page ↗
            </a>
          )}
          <div className="flex flex-wrap gap-2">
            <a href={buildThingsAddUrl(e)} className={`${ACTION} ${GHOST}`}>
              ✓ To Things
            </a>
            <button type="button" onClick={() => void addToCalendar(e)} className={`${ACTION} ${GHOST}`}>
              📅 Calendar
            </button>
          </div>
        </div>
      )}
    </li>
  )
})
