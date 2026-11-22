import { useMemo } from 'react'
import { Link, Navigate, useLocation, useParams } from 'react-router-dom'
import type { HabitDayState } from '../../lib/db'
import { SkeletonList } from '../../components/Skeleton'
import { useToday } from '../../lib/useToday'
import { useHabitDays } from './useHabitDays'
import { HabitDetail } from './HabitDetail'
import { backTarget, habitForRoute, storedDaysOf } from './habitRoute'

const noStates = new Map<string, HabitDayState>()
const noNotes = new Map<string, string>()

/** `/habits/:id` (M2): one habit's overview and management, live from Dexie
 *  (works offline and signed out). An unknown id goes back to /habits; the
 *  back control returns to the page that opened it (Habits or Life). */
export function HabitPage() {
  const { id } = useParams()
  const location = useLocation()
  const back = backTarget(location.state)
  const today = useToday()
  const data = useHabitDays(today)
  const habit = habitForRoute(data?.habits, id)
  const storedDays = useMemo(
    () => (data && habit ? storedDaysOf(data.checks, habit.id) : new Set<string>()),
    [data, habit],
  )

  if (habit === null) return <Navigate to="/habits" replace />

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        to={back}
        className="-ml-2 mb-2 inline-flex min-h-10 items-center rounded-lg px-2 text-sm text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
      >
        ← {back === '/habits' ? 'Habits' : 'Indietro'}
      </Link>
      {habit === undefined || data === undefined ? (
        <SkeletonList rows={4} rowClassName="h-16" />
      ) : (
        <>
          <h1 className="mb-6 text-2xl font-semibold tracking-tight break-words">
            <span className="mr-2">{habit.emoji}</span>
            {habit.name}
          </h1>
          <HabitDetail
            key={habit.id}
            habit={habit}
            states={data.states.get(habit.id) ?? noStates}
            notes={data.notes.get(habit.id) ?? noNotes}
            storedDays={storedDays}
            openCount={data.active.length}
            wins={data.wins.get(habit.id) ?? 0}
            slips={data.slips.get(habit.id)}
            apps={data.appsByWeek}
            today={today}
          />
        </>
      )}
    </div>
  )
}
