import type { Bar } from './progress'

export function ProgressBar({ percent, label }: { percent: number; label: string }) {
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700"
    >
      <div className="h-full rounded-full bg-(color:--accent) transition-[width]" style={{ width: `${percent}%` }} />
    </div>
  )
}

/**
 * Progress where a single bar used to be. `split` (a course with checklist
 * exercises) shows "Sapere" (quiz + cards) and "Saper fare" (practice) as two
 * labelled bars; otherwise the one overall bar, exactly as before.
 */
export function ProgressBars({
  split,
  overall,
  know,
  skill,
  label,
  counts = false,
}: {
  split: boolean
  overall: Bar
  know: Bar
  skill: Bar
  /** Prefix for the accessible names. */
  label: string
  /** Also show done/total next to the percent. */
  counts?: boolean
}) {
  const row = (name: string | null, b: Bar, aria: string) => (
    <div className="flex items-center gap-3">
      {name && <span className="w-20 shrink-0 text-xs text-slate-500 dark:text-slate-400">{name}</span>}
      <div className="flex-1">
        <ProgressBar percent={b.percent} label={aria} />
      </div>
      <span className="text-sm text-slate-500 tabular-nums">
        {b.total === 0 ? '—' : `${b.percent}%`}
        {counts && b.total > 0 && ` · ${b.done}/${b.total}`}
      </span>
    </div>
  )
  if (!split) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <ProgressBar percent={overall.percent} label={label} />
        </div>
        <span className="text-sm text-slate-500 tabular-nums">
          {overall.percent}%{counts && ` · ${overall.done}/${overall.total}`}
        </span>
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-1.5">
      {row('Sapere', know, `${label}: sapere (quiz e flashcard)`)}
      {row('Saper fare', skill, `${label}: saper fare (esercizi)`)}
    </div>
  )
}
