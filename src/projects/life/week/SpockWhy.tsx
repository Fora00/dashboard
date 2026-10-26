import { setWhy } from '../../../lib/lifeSync'
import { runSafe } from '../../../lib/runSafe'
import { Card } from '../../../components/Card'
import type { LifeStreakEntry } from '../../../lib/db'
import { doneLast7, isMissedStreak, LIFE_CAPS, type TrackerSummary } from '../model'
import { HabitHistoryButton } from './HabitHistory'

// Spock test, inside the Sunday check: every habit that is under its weekly
// target asks "why not?". The reasons go to the export (and /settimana) and
// show up in the habit's history, next to the ideas to fix it.

export function SpockWhy({
  week,
  trackers,
  streaks = [],
  whys,
  editable,
}: {
  week: string
  trackers: TrackerSummary[]
  /** Streaks-app habits (read-only snapshot): they ask the same question when under 4 of the last 7 days. */
  streaks?: LifeStreakEntry[]
  whys: ReadonlyMap<string, string>
  editable: boolean
}) {
  const rows = [
    ...trackers
      .filter((t) => t.reachedTarget === false)
      .map(({ tracker, total }) => ({
        id: tracker.id,
        emoji: tracker.emoji,
        label: tracker.label,
        count: `${total}/${tracker.target}`,
      })),
    ...streaks.filter(isMissedStreak).map((e) => ({
      id: e.ref,
      emoji: e.value.emoji,
      label: e.value.name,
      count: `${doneLast7(e.value.days)}/7 · Streaks`,
    })),
  ]
  if (rows.length === 0) return null
  return (
    <Card className="mb-3 space-y-3">
      <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
        🖖 Not completed: why not?
        <span className="ml-2 text-xs font-normal text-slate-500 dark:text-slate-400">
          {rows.filter((r) => whys.has(r.id)).length}/{rows.length} explained
        </span>
      </p>
      <ul className="divide-y divide-slate-200 dark:divide-slate-800">
        {rows.map((tracker) => {
          const reason = whys.get(tracker.id) ?? ''
          return (
            <li key={tracker.id} className="py-2 first:pt-0 last:pb-0">
              <div className="flex items-center justify-between gap-2">
                <span className="min-w-0 truncate text-sm font-medium">
                  {tracker.emoji && <span aria-hidden>{tracker.emoji} </span>}
                  {tracker.label}
                  <span className="ml-2 text-xs font-normal text-slate-500 dark:text-slate-400">{tracker.count}</span>
                </span>
                <HabitHistoryButton trackerId={tracker.id} label={tracker.label} week={week} />
              </div>
              {editable ? (
                <input
                  // Remount when another device changes the reason.
                  key={reason}
                  type="text"
                  defaultValue={reason}
                  maxLength={LIFE_CAPS.whyReason}
                  placeholder="Why not? (the real reason)"
                  aria-label={`Why not: ${tracker.label}`}
                  onBlur={(ev) => {
                    if (ev.target.value.trim() !== reason)
                      void runSafe(setWhy, 'Could not save')(week, tracker.id, ev.target.value)
                  }}
                  className="mt-1 min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900"
                />
              ) : (
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{reason || '—'}</p>
              )}
            </li>
          )
        })}
      </ul>
    </Card>
  )
}
