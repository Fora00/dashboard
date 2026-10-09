import { FOCUS_RING } from '../../components/focus'
import type { EventItem } from './types'
import type { InterestValue } from './interest'
import { isManual } from './custom'
import { ThumbsDownIcon, ThumbsUpIcon } from './icons'

/** 0 = no signal. */
export type InterestState = InterestValue | 0

interface Props {
  event: EventItem
  interest: InterestState
  onInterest: (e: EventItem, value: InterestValue) => void
  /** `compact`: two cells for the card footer; `row`: a labelled row for the detail panel. */
  variant: 'compact' | 'row'
  /** The card footer's cell class (EventActions' ICON), so the cells match. */
  cellClass?: string
}

const DOWN_LABEL = 'Not interested (hides it)'

/**
 * 👍 / 👎 (the interest signal, src/lib/eventInterestSync.ts). Not shown on
 * hand-added events: the owner added those, so they are already a pick, and
 * their footer has no room left on a 375px phone.
 */
export function InterestButtons({ event: e, interest, onInterest, variant, cellClass = '' }: Props) {
  if (isManual(e)) return null
  const up = interest === 1
  const down = interest === -1
  if (variant === 'compact') {
    return (
      <>
        <button
          type="button"
          onClick={() => onInterest(e, 1)}
          aria-pressed={up}
          aria-label="Interested"
          title={up ? 'Interested (tap to undo)' : 'Interested'}
          className={`${cellClass} ${up ? 'text-emerald-600 dark:text-emerald-400' : ''}`}
        >
          <ThumbsUpIcon filled={up} />
          Like
        </button>
        <button
          type="button"
          onClick={() => onInterest(e, -1)}
          aria-pressed={down}
          aria-label={DOWN_LABEL}
          title={down ? 'Not interested (tap to undo)' : DOWN_LABEL}
          className={`${cellClass} ${down ? 'text-rose-600 dark:text-rose-400' : ''}`}
        >
          <ThumbsDownIcon filled={down} />
          Nope
        </button>
      </>
    )
  }
  const pill = `inline-flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 text-sm transition-colors ${FOCUS_RING}`
  const off =
    'border-slate-200 text-slate-700 hover:bg-slate-100 active:bg-slate-200 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700 dark:active:bg-slate-600'
  return (
    <div role="group" aria-label="Your interest" className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onInterest(e, 1)}
        aria-pressed={up}
        aria-label="Interested"
        title={up ? 'Tap to undo' : undefined}
        className={`${pill} ${
          up
            ? 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
            : off
        }`}
      >
        <ThumbsUpIcon filled={up} />
        Interested
      </button>
      <button
        type="button"
        onClick={() => onInterest(e, -1)}
        aria-pressed={down}
        aria-label={DOWN_LABEL}
        title={down ? 'Tap to undo' : 'Also hides the event'}
        className={`${pill} ${
          down
            ? 'border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300'
            : off
        }`}
      >
        <ThumbsDownIcon filled={down} />
        Not for me
      </button>
    </div>
  )
}
