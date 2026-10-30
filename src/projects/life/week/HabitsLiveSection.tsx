import { useLiveQuery } from 'dexie-react-hooks'
import { Link, useNavigate } from 'react-router-dom'
import { db, type HabitDayState } from '../../../lib/db'
import { activeDaysOf, habitDayStates } from '../../habits/habitDayStates'
import { habitStats } from '../../habits/habitStats'
import { STATE_ICON } from '../../habits/habitStates'
import { tapHabit } from '../../habits/habitTap'
import { runSafe } from '../../../lib/runSafe'
import { useToday } from '../useToday'
import { CollapsibleSection } from './CollapsibleSection'

interface Props {
  open: boolean
  onToggle: () => void
  readOnly: boolean
}

/** The Habits project, live, inside Life: today's state and the week's count
 *  per habit. A tap does what it does on the Habits tile; ⋯ opens the Habits page. */
export function HabitsLiveSection({ open, onToggle, readOnly }: Props) {
  const today = useToday()
  const navigate = useNavigate()
  const habits = useLiveQuery(() => db.habits.orderBy('createdAt').toArray(), [])
  const checks = useLiveQuery(() => db.habitChecks.toArray(), [])
  if (!habits || !checks) return null
  const active = habits.filter((h) => h.archivedAt === undefined)
  if (active.length === 0) return null

  const activeDays = activeDaysOf(checks)
  const rows = active.map((habit) => {
    const days = habitDayStates(habit, checks, activeDays, today)
    const stats = habitStats(habit, days.states, today)
    const state: HabitDayState | 'open' = days.states.get(today) ?? 'open'
    return { habit, stats, state, taps: days.counts.get(today) ?? 0, slips: days.slips.get(today) ?? 0 }
  })
  const doneToday = rows.filter((r) => r.state === 'done' || r.state === 'floor').length

  return (
    <CollapsibleSection
      title="Habits"
      summary={`Habits · today ${doneToday}/${rows.length}`}
      open={open}
      onToggle={onToggle}
      readOnly={readOnly}
    >
      <ul className="space-y-2" aria-label="Habits (from the Habits page)">
        {rows.map(({ habit, stats, state, taps, slips }) => {
          const avoid = habit.direction === 'avoid'
          const perDay = habit.perDay ?? 1
          return (
            <li key={habit.id} className="flex items-stretch gap-1.5">
              <button
                type="button"
                onClick={() =>
                  void runSafe(async () => {
                    const next = await tapHabit(habit, { state, count: taps, slips, stats, today })
                    if (next === 'sheet') void navigate('/habits')
                  }, 'Could not save')()
                }
                aria-pressed={state === 'done' || state === 'floor'}
                aria-label={`${habit.name}: tap to ${avoid ? 'mark a slip' : 'check off'}`}
                className="flex min-h-12 min-w-0 flex-1 items-center gap-3 rounded-xl border border-slate-200 px-3 py-2 text-left active:bg-slate-100 dark:border-slate-800 dark:active:bg-slate-800"
              >
                <span
                  aria-hidden
                  className={`flex size-8 shrink-0 items-center justify-center rounded-full text-sm ${
                    state === 'done'
                      ? 'bg-emerald-400 text-slate-900'
                      : state === 'floor'
                        ? 'bg-lime-300 text-slate-900'
                        : state === 'skip'
                          ? 'bg-sky-400/40'
                          : state === 'fail'
                            ? 'bg-rose-400/50'
                            : 'bg-slate-100 dark:bg-slate-800'
                  }`}
                >
                  {STATE_ICON[state] ?? habit.emoji}
                </span>
                <span className="min-w-0 flex-1 truncate font-medium">
                  {habit.emoji} {habit.name}
                </span>
                <span className="shrink-0 text-xs text-slate-500 dark:text-slate-400">
                  {avoid
                    ? `${stats.streak} kept day${stats.streak === 1 ? '' : 's'}`
                    : `${perDay > 1 && state !== 'done' ? `${Math.min(taps, perDay)}/${perDay} · ` : ''}${stats.week.done}/${stats.week.expected || stats.target} wk`}
                </span>
              </button>
              <Link
                to="/habits"
                aria-label={`More for ${habit.name}`}
                className="flex min-h-12 w-10 shrink-0 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                ⋯
              </Link>
            </li>
          )
        })}
      </ul>
      <p className="mt-2 text-xs text-slate-500">
        Tap = done today (same as on the Habits page). Hold-menus, reasons and stats are on the page.
      </p>
      <Link to="/habits" className="mt-1 inline-block text-xs underline decoration-dotted">
        Open Habits →
      </Link>
    </CollapsibleSection>
  )
}
