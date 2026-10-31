import { useRef } from 'react'
import type { Habit, HabitDayState } from '../../lib/db'
import { STATE_ICON } from './habitStates'
import type { HabitStats } from './habitStats'

export type WeekCell = HabitDayState | 'empty' | 'future'
const CELL_STROKE: Record<WeekCell, string> = {
  done: 'stroke-emerald-400',
  floor: 'stroke-lime-300',
  skip: 'stroke-sky-400',
  fail: 'stroke-rose-400',
  empty: 'stroke-slate-200 dark:stroke-slate-700',
  future: 'stroke-slate-100 dark:stroke-slate-800',
}
const LONG_PRESS_MS = 500
const STATE_LABEL: Record<HabitDayState | 'open', string> = {
  done: 'done today',
  floor: 'floor done today',
  skip: 'rest day',
  fail: 'missed',
  open: 'not done',
}
const R = 26
const CIRC = 2 * Math.PI * R
const GAP = 3
const SEG = CIRC / 7 - GAP

interface Props {
  habit: Habit
  stats: HabitStats
  state: HabitDayState | 'open'
  today: string
  onToggle: () => void
  onMore: () => void
  /** Floor-only mode (two-day rule): tapping marks the floor, not the normal version. */
  onFloor: () => void
  /** Open the rest-day choice (with its reason) straight away. */
  onRest: () => void
  /** Two or more empty days: offer to reset the setup. */
  onReset: () => void
  /** Taps so far today on a multi-tap habit. */
  count?: number | undefined
  /** Slips today on a "don't" habit with a daily grace. */
  slips?: number | undefined
  /** Daily habits: this week's seven days, Monday first, for the segmented ring. */
  weekCells?: readonly WeekCell[] | undefined
  /** Index (0 = Monday) of today in weekCells. */
  todayIndex?: number | undefined
  onOpen: () => void
}

/** A big tappable tile: tap = done today, long-press = rest day (skip), the
 *  ring is this week's progress against the weekly target. */
export function HabitTile({
  habit,
  stats,
  state,
  today,
  onToggle,
  onMore,
  onFloor,
  onRest,
  onReset,
  onOpen,
  count = 0,
  slips = 0,
  weekCells,
  todayIndex = -1,
}: Props) {
  const timer = useRef<number | undefined>(undefined)
  const fired = useRef(false)
  const { week } = stats
  // Two-day rule: after an empty or missed day the tile quietly offers the floor.
  const avoid = habit.direction === 'avoid'
  const dailyGrace = avoid && habit.graceScope === 'day' && (habit.grace ?? 0) > 0
  const perDay = avoid ? 1 : (habit.perDay ?? 1)
  const floorMode = !avoid && state === 'open' && stats.gap >= 1
  const restNote = state === 'skip' && stats.restRun >= 3
  const progress = week.expected === 0 ? 1 : Math.min(1, week.done / week.expected)

  const start = () => {
    fired.current = false
    timer.current = window.setTimeout(() => {
      fired.current = true
      onMore()
    }, LONG_PRESS_MS)
  }
  const cancel = () => window.clearTimeout(timer.current)

  const tone =
    state === 'done'
      ? 'border-emerald-400/60 bg-emerald-400/10'
      : state === 'floor'
        ? 'border-lime-400/60 bg-lime-400/10'
        : state === 'skip'
          ? 'border-sky-400/50 bg-sky-400/10'
          : state === 'fail'
            ? stats.gracedDays.has(today)
              ? 'border-amber-400/60 bg-amber-400/10'
              : 'border-rose-400/50 bg-rose-400/10'
            : floorMode
              ? 'border-amber-300/60 bg-amber-300/5'
              : 'border-slate-200 bg-white hover:border-slate-400 dark:border-slate-800 dark:bg-slate-800/50 dark:hover:border-slate-600'

  return (
    <li className="relative">
      <button
        type="button"
        onPointerDown={start}
        onPointerUp={cancel}
        onPointerLeave={cancel}
        onPointerCancel={cancel}
        onContextMenu={(e) => e.preventDefault()}
        onClick={() => {
          if (fired.current) return
          onToggle()
        }}
        aria-pressed={state === 'done' || state === 'floor'}
        aria-label={`${habit.name}: ${STATE_LABEL[state]}. Hold for floor, rest or missed.`}
        className={`flex min-h-40 w-full touch-manipulation flex-col items-center justify-center gap-2 rounded-2xl border p-3 text-center transition-colors select-none active:scale-[0.98] ${tone}`}
      >
        <span className="relative flex size-16 items-center justify-center">
          <svg viewBox="0 0 64 64" className="absolute inset-0 -rotate-90" aria-hidden>
            {weekCells ? (
              weekCells.map((cell, i) => (
                <circle
                  key={i}
                  cx="32"
                  cy="32"
                  r={R}
                  fill="none"
                  strokeWidth={i === todayIndex ? 7 : 5}
                  strokeDasharray={`${SEG} ${CIRC - SEG}`}
                  transform={`rotate(${(i * 360) / 7 + (GAP / CIRC) * 180} 32 32)`}
                  className={CELL_STROKE[cell]}
                />
              ))
            ) : (
              <>
                <circle
                  cx="32"
                  cy="32"
                  r={R}
                  fill="none"
                  strokeWidth="5"
                  className="stroke-slate-200 dark:stroke-slate-700"
                />
                <circle
                  cx="32"
                  cy="32"
                  r={R}
                  fill="none"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={CIRC}
                  strokeDashoffset={CIRC * (1 - progress)}
                  className={week.hit ? 'stroke-emerald-400' : 'stroke-amber-400'}
                />
              </>
            )}
          </svg>
          <span className="text-2xl">{avoid && state === 'done' ? '🚫' : (STATE_ICON[state] ?? habit.emoji)}</span>
        </span>
        <span className="line-clamp-2 w-full text-sm leading-tight font-medium">{habit.name}</span>
        {avoid ? (
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {dailyGrace && slips > 0
              ? state === 'fail'
                ? `Past the grace today (${slips} of ${habit.grace}). Tap for one more.`
                : `Within grace: ${slips} of ${habit.grace} today. Tap if you slip again.`
              : dailyGrace && state !== 'fail'
                ? `${stats.streak} kept day${stats.streak === 1 ? '' : 's'} · ${habit.grace} slips a day allowed`
                : stats.gap >= 1 && state !== 'fail' && state !== 'floor'
                  ? 'A slip is one data point. Today is the one that counts.'
                  : state === 'fail'
                    ? stats.gracedDays.has(today)
                      ? `Within grace (${stats.graceUsedWeek} of ${stats.grace} used this week). Tap to undo.`
                      : 'Past the grace: this one counts. Tap to undo.'
                    : state === 'floor'
                      ? `Within my limit${habit.floor ? `: ${habit.floor}` : ''}. Tap to undo.`
                      : `${stats.streak} kept day${stats.streak === 1 ? '' : 's'}${
                          stats.grace > 0
                            ? ` · grace ${Math.max(0, stats.grace - stats.graceUsedWeek)}/${stats.grace} left`
                            : ' · tap if you go past it'
                        }`}
          </span>
        ) : floorMode ? (
          <span className="text-xs text-amber-700 dark:text-amber-300">
            Tap = done. Or the floor is enough: {habit.floor || 'the smallest version'}
          </span>
        ) : (
          <>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {perDay > 1 && `${count}/${perDay} today · `}
              {perDay === 1 && count > 1 && `×${count} today · `}
              {week.done}/{week.expected || stats.target} this week
            </span>
            {perDay > 1 && state !== 'skip' && state !== 'fail' && (
              <span className="flex gap-1" aria-hidden>
                {Array.from({ length: perDay }, (_, i) => (
                  <span
                    key={i}
                    className={`size-1.5 rounded-full ${i < count || state === 'done' ? 'bg-emerald-400' : 'bg-slate-300 dark:bg-slate-600'}`}
                  />
                ))}
              </span>
            )}
            {habit.why && (
              <span className="line-clamp-1 w-full text-[11px] text-slate-500 italic dark:text-slate-400">
                {habit.why}
              </span>
            )}
          </>
        )}
      </button>
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Stats and settings for ${habit.name}`}
        className="absolute top-1 right-1 flex size-10 items-center justify-center rounded-full text-slate-500 hover:bg-slate-200/60 dark:hover:bg-slate-700/60"
      >
        ⋯
      </button>
      {floorMode && (
        <div className="mt-1 flex gap-1">
          <button
            type="button"
            onClick={onFloor}
            className="min-h-10 flex-1 rounded-lg bg-lime-300/30 text-xs hover:bg-lime-300/50"
          >
            ◐ Only the floor
          </button>
          <button
            type="button"
            onClick={onRest}
            className="min-h-10 flex-1 rounded-lg bg-sky-400/15 text-xs hover:bg-sky-400/30"
          >
            ⏸ Skip today
          </button>
        </div>
      )}
      {restNote && (
        <p className="mt-1 text-center text-[11px] text-amber-700 dark:text-amber-300">
          {stats.restRun} rest days in a row: a break, or avoiding something?
        </p>
      )}
      {state === 'open' && stats.gap >= 2 && (
        <button
          type="button"
          onClick={onReset}
          className="mt-1 min-h-10 w-full rounded-lg text-xs text-slate-500 underline decoration-dotted hover:text-slate-700 dark:hover:text-slate-300"
        >
          Reset the setup
        </button>
      )}
    </li>
  )
}
