import { shareOrCopy } from '../../lib/share'
import { useFlash } from '../../lib/useFlash'
import { FOCUS_RING } from '../../components/focus'
import type { EventItem } from './types'
import { addToCalendar } from './ics'
import { CalendarPlusIcon, CheckIcon, EyeIcon, EyeOffIcon, PencilIcon, ShareIcon, StarIcon, ThingsIcon } from './icons'
import { isManual } from './custom'
import { InterestButtons, type InterestState } from './InterestButtons'
import type { InterestValue } from './interest'
import { eventPlace } from './display'
import { buildThingsAddUrl, formatRange, safeHttpUrl } from './model'

const ICON = `inline-flex min-h-10 min-w-10 flex-1 flex-col items-center justify-center gap-0.5 rounded-lg px-1 py-1 text-[10px] leading-none text-slate-700 transition-colors hover:bg-slate-100 active:bg-slate-200 dark:text-slate-200 dark:hover:bg-slate-700 dark:active:bg-slate-600 ${FOCUS_RING}`

interface Props {
  event: EventItem
  saved: boolean
  hidden: boolean
  onToggleSave: (e: EventItem) => void
  onToggleHide: (e: EventItem) => void
  /** Hand-added events only: open the edit sheet. */
  onEdit?: ((e: EventItem) => void) | undefined
  /** 👍 / 👎 cells at the end of the row (omit `onInterest` to leave them out). */
  interest?: InterestState
  onInterest?: ((e: EventItem, value: InterestValue) => void) | undefined
  className?: string
}

/** Save · Things · Calendar · Hide · Share (· Like · Nope | · Edit): the card footer and the detail panel. */
export function EventActions({
  event: e,
  saved,
  hidden,
  onToggleSave,
  onToggleHide,
  onEdit,
  interest = 0,
  onInterest,
  className = '',
}: Props) {
  const [copied, flashCopied] = useFlash(2000)
  const url = safeHttpUrl(e.url)

  // Native share sheet where available (iOS/Android), else copy to clipboard.
  async function share() {
    const text = [e.title, formatRange(e), eventPlace(e)].filter(Boolean).join('\n')
    try {
      const outcome = await shareOrCopy(text, {
        title: e.title,
        ...(url ? { url } : {}),
      })
      if (outcome === 'copied') flashCopied()
    } catch {
      // Share sheet dismissed or clipboard blocked: nothing to recover.
    }
  }

  return (
    <div className={`flex items-center justify-between gap-1 ${className}`}>
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
        className={`${ICON} ${hidden ? 'text-(--accent-border)' : ''}`}
      >
        {hidden ? <EyeIcon /> : <EyeOffIcon />}
        {hidden ? 'Unhide' : 'Hide'}
      </button>
      <button type="button" onClick={() => void share()} aria-label="Share" title="Share" className={ICON}>
        {copied ? <CheckIcon /> : <ShareIcon />}
        {copied ? 'Copied' : 'Share'}
      </button>
      {onInterest && (
        <InterestButtons event={e} interest={interest} onInterest={onInterest} variant="compact" cellClass={ICON} />
      )}
      {isManual(e) && onEdit && (
        <button type="button" onClick={() => onEdit(e)} aria-label="Edit" title="Edit" className={ICON}>
          <PencilIcon />
          Edit
        </button>
      )}
    </div>
  )
}
