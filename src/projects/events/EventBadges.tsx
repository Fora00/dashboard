import type { EventItem } from './types'
import { endingInDays } from './filters'
import { cleanFormats, formatLabel } from './format'
import { isManual } from './custom'
import { categoryLabel, categoryOf, isNew, isSpot } from './model'

const BADGE = 'rounded-full px-2.5 py-1 text-xs font-medium'

/** New since the last visit · ending soon · category · formats · added by you · spot · tentative · hidden. */
export function EventBadges({
  event: e,
  hidden,
  now,
  since = null,
}: {
  event: EventItem
  hidden: boolean
  now: number
  since?: number | null
}) {
  const left = endingInDays(e, now)
  return (
    <div className="flex flex-wrap items-center gap-1.5 pt-1">
      {isNew(e, since) && (
        <span className={`${BADGE} bg-violet-100 text-violet-800 dark:bg-violet-500/20 dark:text-violet-200`}>New</span>
      )}
      {left !== null && (
        <span className={`${BADGE} bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-200`}>
          ⏳ {left === 0 ? 'Ultimo giorno' : left === 1 ? 'Finisce domani' : `In scadenza · ${left} giorni`}
        </span>
      )}
      <span className={`${BADGE} bg-(color:--accent-soft) text-slate-800 dark:text-slate-100`}>
        {categoryLabel(categoryOf(e))}
      </span>
      {cleanFormats(e.tags).map((id) => (
        <span key={id} className={`${BADGE} bg-sky-100 text-sky-800 dark:bg-sky-500/20 dark:text-sky-200`}>
          {formatLabel(id)}
        </span>
      ))}
      {isManual(e) && (
        <span className={`${BADGE} bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200`}>
          Added by you
        </span>
      )}
      {isSpot(e) && (
        <span className={`${BADGE} bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-200`}>Spot</span>
      )}
      {e.datesTentative && (
        <span className={`${BADGE} bg-sky-100 text-sky-800 dark:bg-sky-500/20 dark:text-sky-200`}>
          Date da confermare
        </span>
      )}
      {hidden && (
        <span className={`${BADGE} bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200`}>Hidden</span>
      )}
    </div>
  )
}
