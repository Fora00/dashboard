import { useLiveQuery } from 'dexie-react-hooks'
import { useNavigate } from 'react-router-dom'
import { db, type Habit, type HabitDayState } from '../../../lib/db'
import { runSafe } from '../../../lib/runSafe'
import { activeDaysOf, habitDayStates, type HabitDays } from '../../habits/habitDayStates'
import { HabitRecap } from '../../habits/HabitRecap'
import { setDayState } from '../../../lib/habitSync'
import { tapHabit } from '../../habits/habitTap'
import { useToday } from '../useToday'
import { CollapsibleSection } from './CollapsibleSection'

interface Props {
  open: boolean
  onToggle: () => void
  readOnly: boolean
}

/** The Habits project inside Life, as the same week view as on the Habits page
 *  (every habit side by side, the week's days, counts, reasons, tips) with a
 *  button on each row that taps the habit for today. */
export function HabitsLiveSection({ open, onToggle, readOnly }: Props) {
  const today = useToday()
  const navigate = useNavigate()
  const habits = useLiveQuery(() => db.habits.orderBy('createdAt').toArray(), [])
  const checks = useLiveQuery(() => db.habitChecks.toArray(), [])
  if (!habits || !checks) return null
  const active = habits.filter((h) => h.archivedAt === undefined)
  if (active.length === 0) return null

  const activeDays = activeDaysOf(checks)
  const days = new Map<string, HabitDays>(active.map((h) => [h.id, habitDayStates(h, checks, activeDays, today)]))
  const states = new Map<string, ReadonlyMap<string, HabitDayState>>([...days].map(([id, d]) => [id, d.states]))
  const notes = new Map<string, ReadonlyMap<string, string>>([...days].map(([id, d]) => [id, d.notes]))
  const doneToday = active.filter((h) => {
    const st = days.get(h.id)?.states.get(today)
    return st === 'done' || st === 'floor'
  }).length

  const tap = (habit: Habit) =>
    void runSafe(async () => {
      const d = days.get(habit.id)!
      const next = await tapHabit(habit, {
        state: d.states.get(today) ?? 'open',
        count: d.counts.get(today) ?? 0,
        slips: d.slips.get(today) ?? 0,
        today,
      })
      if (next === 'sheet') void navigate('/habits') // a slip needs its reason
    }, 'Could not save')()

  return (
    <CollapsibleSection
      title="Habits"
      summary={`Habits · today ${doneToday}/${active.length}`}
      open={open}
      onToggle={onToggle}
      readOnly={readOnly}
    >
      <HabitRecap
        kind="week"
        habits={active}
        states={states}
        notes={notes}
        today={today}
        onOpen={() => void navigate('/habits')}
        onTapToday={tap}
        onSetDay={(habit, day, state) => void runSafe(() => setDayState(habit.id, day, state), 'Could not save')()}
      />
      <p className="mt-3 text-xs text-slate-500">
        ○ = tap for today (done; a slip on a habit to avoid asks why on the Habits page). Tap any day for floor, rest or
        missed. Calendar and settings: Open on any row.
      </p>
    </CollapsibleSection>
  )
}
