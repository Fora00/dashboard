import { memo, useState } from 'react'
import { shareOrCopy } from '../../lib/share'
import { useFlash } from '../../lib/useFlash'
import type { EventItem } from './types'
import { addToCalendar } from './ics'
import { FOCUS_RING, FOCUS_RING_INSET } from '../../components/focus'
import { CalendarPlusIcon, CheckIcon, EyeIcon, EyeOffIcon, PencilIcon, ShareIcon, StarIcon, ThingsIcon } from './icons'
import { CategoryThumb } from './CategoryThumb'
import { driveLabel } from './distance'
import { endingInDays } from './filters'
import { cleanFormats, formatLabel } from './format'
import { isManual, isSafeImageDataUrl } from './custom'
import {
  buildThingsAddUrl,
  categoryLabel,
  categoryOf,
  formatRange,
  isSparseSeries,
  isSpot,
  listingDay,
  safeHttpUrl,
  shortDay,
} from './model'

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
  /** Multi-select mode: tapping the card toggles `selected` instead of expanding it. */
  selecting?: boolean
  selected?: boolean
  onSelect?: ((e: EventItem) => void) | undefined
}

const BADGE = 'rounded-full px-2.5 py-1 text-xs font-medium'
const ICON = `inline-flex min-h-10 min-w-10 flex-1 flex-col items-center justify-center gap-0.5 rounded-lg px-1 py-1 text-[10px] leading-none text-slate-700 transition-colors hover:bg-slate-100 active:bg-slate-200 dark:text-slate-200 dark:hover:bg-slate-700 dark:active:bg-slate-600 ${FOCUS_RING}`

export const EventCard = memo(function EventCard({
  event: e,
  saved,
  hidden,
  now,
  onToggleSave,
  onToggleHide,
  onEdit,
  selecting = false,
  selected = false,
  onSelect,
}: Props) {
  const [open, setOpen] = useState(false)
  const [imgOk, setImgOk] = useState(true)
  const [copied, flashCopied] = useFlash(2000)
  const drive = driveLabel(e.city)
  const place = [e.venue, e.city].filter(Boolean).join(' · ')
  const url = safeHttpUrl(e.url)
  const manual = isManual(e)
  // Scraped images must be http(s); a hand-added one is an inline JPEG data URL.
  const image = manual && isSafeImageDataUrl(e.image) ? e.image : safeHttpUrl(e.image)
  const showImage = image !== null && imgOk
  const series = isSparseSeries(e)
  const left = endingInDays(e, now)
  const formats = cleanFormats(e.tags)

  // Native share sheet where available (iOS/Android), else copy to clipboard.
  async function share() {
    const text = [e.title, formatRange(e), place].filter(Boolean).join('\n')
    try {
      const outcome = await shareOrCopy(text, { title: e.title, ...(url ? { url } : {}) })
      if (outcome === 'copied') flashCopied()
    } catch {
      // Share sheet dismissed or clipboard blocked: nothing to recover.
    }
  }

  return (
    <li
      className={`overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-800/50 ${
        hidden ? 'opacity-60' : ''
      } ${selected ? 'ring-2 ring-indigo-500' : ''}`}
    >
      <button
        type="button"
        onClick={() => (selecting ? onSelect?.(e) : setOpen((v) => !v))}
        {...(selecting ? { 'aria-pressed': selected } : { 'aria-expanded': open })}
        className={`block min-h-10 w-full text-left transition-colors active:bg-slate-100 dark:active:bg-slate-800 ${FOCUS_RING_INSET}`}
      >
        <div className="flex items-start gap-3 px-3 py-3">
          {selecting && (
            <span
              aria-hidden
              className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border-2 text-sm ${
                selected ? 'border-indigo-500 bg-indigo-500 text-white' : 'border-slate-300 dark:border-slate-600'
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
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {left !== null && (
                <span className={`${BADGE} bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-200`}>
                  ⏳ {left === 0 ? 'Ultimo giorno' : left === 1 ? 'Finisce domani' : `In scadenza · ${left} giorni`}
                </span>
              )}
              <span className={`${BADGE} bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-200`}>
                {categoryLabel(categoryOf(e))}
              </span>
              {formats.map((id) => (
                <span key={id} className={`${BADGE} bg-sky-100 text-sky-800 dark:bg-sky-500/20 dark:text-sky-200`}>
                  {formatLabel(id)}
                </span>
              ))}
              {manual && (
                <span
                  className={`${BADGE} bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200`}
                >
                  Added by you
                </span>
              )}
              {isSpot(e) && (
                <span className={`${BADGE} bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-200`}>
                  Spot
                </span>
              )}
              {e.datesTentative && (
                <span className={`${BADGE} bg-sky-100 text-sky-800 dark:bg-sky-500/20 dark:text-sky-200`}>
                  Date da confermare
                </span>
              )}
              {hidden && (
                <span className={`${BADGE} bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200`}>
                  Hidden
                </span>
              )}
            </div>
            {e.occurrences > 1 && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {e.occurrences} dates
                {series ? ` · next ≈ ${shortDay(listingDay(e, now))}` : ''}
              </p>
            )}
            {e.summary && !open && (
              <p className="line-clamp-2 pt-1 text-sm text-slate-600 dark:text-slate-400">{e.summary}</p>
            )}
          </div>
        </div>
      </button>
      {selecting ? null : (
        <div className="flex items-center justify-between gap-1 border-t border-slate-100 px-2 py-1 dark:border-slate-700/50">
          <button
            type="button"
            onClick={() => onToggleSave(e)}
            aria-pressed={saved}
            aria-label={saved ? 'Remove from saved' : 'Save'}
            title={saved ? 'Remove from saved' : 'Save'}
            className={`${ICON} ${saved ? 'text-amber-500' : ''}`}
          >
            <StarIcon filled={saved} />
            {saved ? 'Saved' : 'Save'}
          </button>
          <a href={buildThingsAddUrl(e)} aria-label="Add to Things" title="Add to Things" className={ICON}>
            <ThingsIcon />
            Things
          </a>
          <button
            type="button"
            onClick={() => void addToCalendar(e)}
            aria-label="Add to calendar"
            title="Add to calendar"
            className={ICON}
          >
            <CalendarPlusIcon />
            Calendar
          </button>
          <button
            type="button"
            onClick={() => onToggleHide(e)}
            aria-label={hidden ? 'Unhide' : 'Hide'}
            title={hidden ? 'Unhide' : 'Hide'}
            className={`${ICON} ${hidden ? 'text-indigo-600 dark:text-indigo-400' : ''}`}
          >
            {hidden ? <EyeIcon /> : <EyeOffIcon />}
            {hidden ? 'Unhide' : 'Hide'}
          </button>
          <button type="button" onClick={() => void share()} aria-label="Share" title="Share" className={ICON}>
            {copied ? <CheckIcon /> : <ShareIcon />}
            {copied ? 'Copied' : 'Share'}
          </button>
          {manual && onEdit && (
            <button type="button" onClick={() => onEdit(e)} aria-label="Edit" title="Edit" className={ICON}>
              <PencilIcon />
              Edit
            </button>
          )}
        </div>
      )}
      {open && !selecting && (
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
        </div>
      )}
    </li>
  )
})
