import type { Habit, HabitDayState } from '../../lib/db'
import { parseDayKey } from '../../lib/dates'
import { SectionTitle } from '../../components/SectionTitle'
import { engineLabel } from '../life/model/engines'
import { EXPIRING_WINDOW, expiringHabits, expiringLabel } from './habitExpiry'
import { habitStats } from './habitStats'
import { cycleWeeks } from './habitCategoryGroups'

interface Props {
  habits: readonly Habit[]
  states: ReadonlyMap<string, ReadonlyMap<string, HabitDayState>>
  today: string
  onOpen: (habitId: string) => void
}

const endDate = (day: string) =>
  parseDayKey(day).toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'short' })

/** The "Scadenze" tab: cycles ending in the next 14 days, and ended ones still
 *  waiting for a verdict. Each row opens the habit to judge it. */
export function HabitExpiring({ habits, states, today, onOpen }: Props) {
  const items = expiringHabits(habits, today)

  if (items.length === 0)
    return (
      <p className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
        Nessun ciclo finisce nei prossimi {EXPIRING_WINDOW} giorni.
      </p>
    )

  return (
    <section>
      <SectionTitle>In scadenza · prossimi {EXPIRING_WINDOW} giorni</SectionTitle>
      <ul className="space-y-2">
        {items.map(({ habit, left }) => {
          const stats = habitStats(habit, states.get(habit.id) ?? new Map(), today)
          const weeks = habit.measure ? null : cycleWeeks(habit, states.get(habit.id) ?? new Map(), today)
          const overdue = left < 0
          return (
            <li key={habit.id}>
              <button
                type="button"
                onClick={() => onOpen(habit.id)}
                className={`flex min-h-14 w-full items-center gap-3 rounded-xl border px-4 py-2 text-left ${
                  overdue
                    ? 'border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30'
                    : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
                }`}
              >
                <span className="text-xl" aria-hidden>
                  {habit.emoji}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">{habit.name}</span>
                  <span className="block truncate text-xs text-slate-500 dark:text-slate-400">
                    {[
                      habit.engine && engineLabel(habit.engine),
                      stats.cycle && `giorno ${stats.cycle.day}/${stats.cycle.length}`,
                      weeks && `${weeks.hit}/${weeks.total} settimane ok`,
                    ]
                      .filter(Boolean)
                      .join(' · ')}
                  </span>
                </span>
                <span className="shrink-0 text-right text-xs">
                  <span
                    className={`block font-medium ${overdue ? 'text-amber-700 dark:text-amber-300' : 'text-slate-700 dark:text-slate-200'}`}
                  >
                    {expiringLabel(left)}
                  </span>
                  <span className="block text-slate-500 dark:text-slate-400">
                    {overdue ? 'dai il verdetto' : endDate(habit.cycleEnd!)}
                  </span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
      <p className="mt-2 text-xs text-slate-500">
        Tocca una habit per aprirla e decidere: continua, aumenta, riduci o chiudi.
      </p>
    </section>
  )
}
