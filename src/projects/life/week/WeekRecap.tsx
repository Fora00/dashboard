import type { TrackerSummary } from '../model'

/** What the week actually held, shown above the Sunday questions so the
 * answers can lean on it. Empty parts of the plan are left out. */
export function WeekRecap({
  focus,
  trackers,
  checkins,
  tasks,
  title = 'This week',
}: {
  focus: [number, number]
  trackers: TrackerSummary[]
  checkins: [number, number]
  tasks: [number, number]
  title?: string
}) {
  const parts: { label: string; value: string; full: boolean }[] = []
  if (focus[1] > 0) parts.push({ label: 'Focus', value: `${focus[0]}/${focus[1]}`, full: focus[0] >= focus[1] })
  if (checkins[1] > 0)
    parts.push({ label: 'Check-ins', value: `${checkins[0]}/${checkins[1]}`, full: checkins[0] >= checkins[1] })
  if (tasks[1] > 0) parts.push({ label: 'Things sent', value: `${tasks[0]}/${tasks[1]}`, full: tasks[0] >= tasks[1] })
  if (parts.length === 0 && trackers.length === 0) return null

  return (
    <div className="mb-3 space-y-2 rounded-xl bg-slate-100 px-4 py-3 text-sm dark:bg-slate-800/60">
      {title && <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{title}</p>}
      {parts.length > 0 && (
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {parts.map((p) => (
            <span key={p.label} className="text-slate-600 dark:text-slate-300">
              {p.label}{' '}
              <span
                className={`font-medium ${p.full ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-800 dark:text-slate-100'}`}
              >
                {p.value}
              </span>
            </span>
          ))}
        </div>
      )}
      {trackers.length > 0 && (
        <ul className="space-y-0.5">
          {trackers.map(({ tracker, total, reachedTarget, atMax }) => {
            const limit = tracker.target ?? tracker.max
            return (
              <li key={tracker.id} className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <span aria-hidden>{tracker.emoji}</span>
                <span className="min-w-0 flex-1 truncate">{tracker.label}</span>
                <span
                  className={`shrink-0 font-medium ${
                    atMax
                      ? 'text-amber-600 dark:text-amber-400'
                      : reachedTarget
                        ? 'text-emerald-700 dark:text-emerald-300'
                        : 'text-slate-800 dark:text-slate-100'
                  }`}
                >
                  {limit !== null ? `${total}/${limit}` : total}
                  {reachedTarget && ' ✓'}
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
