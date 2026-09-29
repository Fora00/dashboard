import { useState } from 'react'
import type { EventItem } from './types'
import { buildThingsAddUrl, categoryLabel, categoryOf, formatRange, safeHttpUrl } from './model'

interface Props {
  event: EventItem
  saved: boolean
  hidden: boolean
  onToggleSave: () => void
  onToggleHide: () => void
}

const ACTION =
  'inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg px-3.5 text-sm font-medium transition-colors'
const GHOST =
  'bg-slate-100 text-slate-800 hover:bg-slate-200 active:bg-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:active:bg-slate-600'

export function EventCard({ event: e, saved, hidden, onToggleSave, onToggleHide }: Props) {
  const [open, setOpen] = useState(false)
  const [imgOk, setImgOk] = useState(true)
  const place = [e.venue, e.city].filter(Boolean).join(' · ')
  const url = safeHttpUrl(e.url)
  const image = safeHttpUrl(e.image)

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
        className="block w-full text-left transition-colors active:bg-slate-100 dark:active:bg-slate-800"
      >
        {image && imgOk && (
          <img
            src={image}
            alt=""
            loading="lazy"
            onError={() => setImgOk(false)}
            className="aspect-video w-full bg-slate-100 object-cover dark:bg-slate-800"
          />
        )}
        <div className="space-y-1 px-4 py-3">
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
            {e.occurrences > 1 && (
              <span className="text-xs text-slate-500 dark:text-slate-400">{e.occurrences} dates</span>
            )}
            {hidden && <span className="text-xs text-slate-500">hidden</span>}
          </div>
          {e.summary && !open && (
            <p className="line-clamp-3 pt-1 text-sm text-slate-600 dark:text-slate-400">{e.summary}</p>
          )}
        </div>
      </button>
      {open && (
        <div className="space-y-3 border-t border-slate-200 px-4 py-3 dark:border-slate-800">
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
              className="inline-flex min-h-10 items-center text-sm text-indigo-600 underline dark:text-indigo-400"
            >
              Open event page ↗
            </a>
          )}
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={onToggleSave} className={`${ACTION} ${GHOST}`}>
              {saved ? '★ Unsave' : '☆ Save'}
            </button>
            <button type="button" onClick={onToggleHide} className={`${ACTION} ${GHOST}`}>
              {hidden ? 'Unhide' : 'Hide'}
            </button>
            <a href={buildThingsAddUrl(e)} className={`${ACTION} ${GHOST}`}>
              ✓ To Things
            </a>
          </div>
        </div>
      )}
    </li>
  )
}
