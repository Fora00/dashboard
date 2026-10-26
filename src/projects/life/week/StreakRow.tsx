import type { LifeStreakEntry } from '../../../lib/db'
import { HabitHistoryButton } from './HabitHistory'
import { isStaleStreak, last7, type StreakDay } from '../model'

const DAY_TONE: Record<StreakDay, string> = {
  d: 'bg-emerald-400/70 dark:bg-emerald-500/70',
  m: 'bg-rose-400/70 dark:bg-rose-500/60',
  '-': 'bg-slate-200 dark:bg-slate-700',
}
const DAY_WORD: Record<StreakDay, string> = {
  d: 'done',
  m: 'missed',
  '-': 'no entry',
}

/**
 * A Streaks-app habit, read-only: the iPhone app is the place to log it. Shows
 * the last 7 days of the snapshot, the current streak and how old the snapshot
 * is (the Mac reads an iCloud backup that can be a couple of days behind).
 */
export function StreakRow({ entry, today, week }: { entry: LifeStreakEntry; today: string; week: string }) {
  const v = entry.value
  const strip = last7(v.days)
  const stale = isStaleStreak(v.asOf, today)
  return (
    <li className="flex items-center gap-2">
      <div className="flex min-h-14 min-w-0 flex-1 items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-white/60 px-4 py-2 dark:border-slate-700 dark:bg-slate-800/30">
        {v.emoji && (
          <span className="text-xl" aria-hidden>
            {v.emoji}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <span className="min-w-0 font-medium break-words">{v.name}</span>
            <span className="shrink-0 rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-slate-500 uppercase dark:bg-slate-800 dark:text-slate-400">
              Streaks
            </span>
          </div>
          <p
            className={`text-xs ${stale ? 'text-amber-700 italic dark:text-amber-400' : 'text-slate-500 dark:text-slate-400'}`}
          >
            as of {v.asOf}
            {stale && ' · may be out of date'}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <span
            className="flex gap-0.5"
            role="img"
            aria-label={`Last 7 days: ${strip.map((c) => DAY_WORD[c]).join(', ')}`}
          >
            {strip.map((c, i) => (
              <span key={i} className={`size-2.5 rounded-sm ${DAY_TONE[c]}`} />
            ))}
          </span>
          <span className="text-sm font-medium tabular-nums" aria-label={`Streak ${v.streak} days`}>
            🔥 {v.streak}
          </span>
        </div>
      </div>
      <HabitHistoryButton
        trackerId={entry.ref}
        label={v.name}
        week={week}
        summary={`Logged in the Streaks app. Last 28 days: ${v.days.split('d').length - 1} done, ${v.days.split('m').length - 1} missed · streak ${v.streak}${v.best ? `, best ${v.best}` : ''}. Add the ideas that make it work below.`}
      />
    </li>
  )
}
