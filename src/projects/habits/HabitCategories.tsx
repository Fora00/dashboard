import type { Habit, HabitDayState, HabitVerdict } from '../../lib/db'
import { parseDayKey } from '../../lib/dates'
import { cycleWeeks, groupByCategory, type HabitPhase } from './habitCategoryGroups'
import { habitStats, daysBetween } from './habitStats'
import { dayKey } from './habitStore'

interface Props {
  /** Every habit, archived and planned ones too. */
  habits: readonly Habit[]
  states: ReadonlyMap<string, ReadonlyMap<string, HabitDayState>>
  today: string
  onOpen: (habitId: string) => void
}

const PHASES: { key: HabitPhase; label: string }[] = [
  { key: 'present', label: 'In corso' },
  { key: 'future', label: 'Future' },
  { key: 'past', label: 'Passate' },
]

const VERDICT: Record<HabitVerdict, string> = { up: '⬆ su', stay: '＝ resta', down: '⬇ giù', closed: '✕ chiusa' }

const short = (day: string) => parseDayKey(day).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })

/** One line under the name: dates, then progress (present), verdict and result (past) or the wait (future). */
function detail(habit: Habit, phase: HabitPhase, states: ReadonlyMap<string, HabitDayState>, today: string): string {
  const archived = habit.archivedAt !== undefined ? dayKey(new Date(habit.archivedAt)) : undefined
  const start = habit.cycleStart ?? dayKey(new Date(habit.createdAt))
  const end = habit.cycleEnd ?? archived
  const dates = end ? `${short(start)} → ${short(end)}` : `dal ${short(start)}`
  const weeks = habit.measure ? null : cycleWeeks(habit, states, today)
  const weeksText = weeks && `${weeks.hit}/${weeks.total} settimane ok`

  if (phase === 'future') {
    const n = daysBetween(today, start)
    return [dates, n === 1 ? 'inizia domani' : `inizia tra ${n} giorni`].join(' · ')
  }
  if (phase === 'past') {
    return [dates, habit.verdict ? VERDICT[habit.verdict] : archived && 'archiviata', weeksText]
      .filter(Boolean)
      .join(' · ')
  }
  const cycle = habitStats(habit, states, today).cycle
  return [dates, cycle && `giorno ${cycle.day}/${cycle.length}`, weeksText, habit.verdict && VERDICT[habit.verdict]]
    .filter(Boolean)
    .join(' · ')
}

/** The "Categorie" tab: every habit by engine, split into in corso / future / passate. */
export function HabitCategories({ habits, states, today, onOpen }: Props) {
  const groups = groupByCategory(habits, today)
  if (groups.length === 0) return <p className="text-sm text-slate-500 dark:text-slate-400">Nessuna habit ancora.</p>

  return (
    <div className="space-y-4">
      {groups.map((g) => (
        <section
          key={g.engine ?? 'none'}
          data-testid="category-group"
          className="rounded-xl border border-slate-200 p-3 dark:border-slate-800"
        >
          <h3 className="flex flex-wrap items-baseline justify-between gap-x-3 font-semibold">
            <span>{g.label}</span>
            <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
              {g.present.length} in corso · {g.future.length} future · {g.past.length} passate
            </span>
          </h3>
          {PHASES.filter((p) => g[p.key].length > 0).map((p) => (
            <div key={p.key} className="mt-3">
              <p className="mb-1 text-xs font-medium tracking-wide text-slate-500 uppercase dark:text-slate-400">
                {p.label}
              </p>
              <ul className="space-y-1">
                {g[p.key].map((habit) => (
                  <li key={habit.id}>
                    <button
                      type="button"
                      onClick={() => onOpen(habit.id)}
                      className={`flex min-h-12 w-full items-center gap-3 rounded-lg px-2 py-1.5 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                        p.key === 'past' ? 'text-slate-500 dark:text-slate-400' : ''
                      }`}
                    >
                      <span className="text-lg" aria-hidden>
                        {habit.emoji}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">{habit.name}</span>
                        <span className="block truncate text-xs text-slate-500 dark:text-slate-400">
                          {detail(habit, p.key, states.get(habit.id) ?? new Map(), today)}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      ))}
    </div>
  )
}
