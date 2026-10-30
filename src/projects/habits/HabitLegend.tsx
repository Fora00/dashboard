import { STATE_CELL, STATE_ICON } from './habitStates'

const DAYS = [
  ['done', 'Done: the normal version'],
  ['floor', 'Floor: only the minimum (counts as done)'],
  ['skip', 'Rest day: on purpose, never a miss'],
  ['fail', 'Missed (a gap reason may be attached)'],
  ['empty', 'Empty: nothing marked'],
] as const

const TILE = [
  ['bg-emerald-400', 'Daily habits: a ring of seven segments, one per day Monday to Sunday (the thick one is today)'],
  ['bg-emerald-400', 'Weekly habits, ring green: this week’s target is reached'],
  ['bg-amber-400', 'Weekly habits, ring amber: this week is still in progress'],
  ['bg-amber-300/40', 'Amber tile: after an empty day the floor is offered; one tap marks it'],
] as const

/** What the colours and icons mean. Used under the tiles and the calendar. */
export function HabitLegend() {
  return (
    <details className="mt-3 rounded-xl border border-slate-200 p-3 text-xs text-slate-600 dark:border-slate-800 dark:text-slate-400">
      <summary className="cursor-pointer font-medium">Legend: colours and icons</summary>
      <ul className="mt-2 space-y-1.5">
        {DAYS.map(([state, label]) => (
          <li key={state} className="flex items-center gap-2">
            <span className={`flex size-6 shrink-0 items-center justify-center rounded-full ${STATE_CELL[state]}`}>
              {state === 'empty' ? '' : STATE_ICON[state]}
            </span>
            {label}
          </li>
        ))}
        {TILE.map(([swatch, label]) => (
          <li key={label} className="flex items-center gap-2">
            <span className={`ml-1.5 size-3 shrink-0 rounded-full ${swatch}`} />
            <span className="ml-1.5">{label}</span>
          </li>
        ))}
        <li>Tap a tile = done today. Hold = floor, rest or missed. ⋯ = stats, calendar and settings.</li>
        <li>Streak is in days (or weeks for “N times a week” habits); rest days never break it.</li>
      </ul>
    </details>
  )
}
