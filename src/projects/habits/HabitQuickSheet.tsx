import { useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import type { Habit, HabitDayState } from '../../lib/db'
import { buttonClass } from '../../components/Button'
import { Sheet } from '../../components/Sheet'
import { setDayState } from '../../lib/habitSync'
import { runSafe } from '../../lib/runSafe'
import { MeasureBadge } from './MeasureBadge'
import { habitBounds } from './habitDayStates'
import { shiftDayKey } from './habitStats'
import { habitPath, storedDaysOf, storedState } from './habitRoute'
import { HabitRestRanges } from './HabitRestRanges'
import { HabitOverview } from './HabitOverview'
import { experimentLines, targetLine } from './habitSummary'
import type { HabitDaysData } from './habitDaysData'

const noStates = new Map<string, HabitDayState>()

const CHOICES: { state: HabitDayState; icon: string; label: string; avoidLabel?: string }[] = [
  { state: 'done', icon: '✓', label: 'Fatto', avoidLabel: 'Tenuto' },
  { state: 'floor', icon: '◐', label: 'Minimo', avoidLabel: 'Nel limite' },
  { state: 'skip', icon: '⏸', label: 'Riposo' },
  { state: 'fail', icon: '✕', label: 'Mancato', avoidLabel: 'Scivolone' },
]

interface Props {
  habit: Habit | null
  data: HabitDaysData
  today: string
  onClose: () => void
}

/** The sheet from a tile's ⋯ (M2): target or grace, the experiment recap, a
 *  quick state for today and yesterday, vacation, the overview block (numbers,
 *  week bars, calendar; the same as on the page) and the way to the full page
 *  `/habits/:id` (suggestions, app limits, settings, archive/delete). */
export function HabitQuickSheet({ habit, data, today, onClose }: Props) {
  return (
    <Sheet open={habit !== null} onClose={onClose} title={habit ? `${habit.emoji} ${habit.name}` : ''}>
      {habit && <Body key={habit.id} habit={habit} data={data} today={today} />}
    </Sheet>
  )
}

function Body({ habit, data, today }: { habit: Habit; data: HabitDaysData; today: string }) {
  const location = useLocation()
  const states = data.states.get(habit.id) ?? noStates
  const stored = useMemo(() => storedDaysOf(data.checks, habit.id), [data.checks, habit.id])
  const yesterday = shiftDayKey(today, -1)
  const showYesterday = yesterday >= habitBounds(habit, states).start
  const avoid = habit.direction === 'avoid'
  const experiment = experimentLines({
    habit,
    states,
    slips: data.slips.get(habit.id),
    apps: data.appsByWeek,
    today,
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
        <span>{targetLine(habit)}</span>
        <MeasureBadge habit={habit} />
      </div>
      {habit.floor && <p className="-mt-2 text-xs text-slate-500">Minimo: {habit.floor}</p>}
      {experiment.length > 0 && (
        <section
          aria-label="Esperimento"
          className="-mt-1 space-y-0.5 rounded-lg bg-slate-100 p-2.5 text-sm dark:bg-slate-800"
        >
          {experiment.map((l, i) => (
            <p key={i} className={i === 0 ? 'font-medium' : 'text-slate-600 dark:text-slate-300'}>
              {l}
            </p>
          ))}
        </section>
      )}

      {[['Oggi', today] as const, ...(showYesterday ? ([['Ieri', yesterday]] as const) : [])].map(([label, day]) => {
        const current = storedState(states, stored, day)
        return (
          <div key={day} role="group" aria-label={`${label}: stato`} className="space-y-1.5">
            <p className="text-sm font-medium">{label}</p>
            <div className="grid grid-cols-4 gap-1.5">
              {CHOICES.map((c) => (
                <button
                  key={c.state}
                  type="button"
                  aria-pressed={current === c.state}
                  onClick={() =>
                    void runSafe(setDayState, 'Could not save')(habit.id, day, current === c.state ? null : c.state)
                  }
                  className={`flex min-h-11 flex-col items-center justify-center rounded-lg border px-1 text-xs leading-tight ${
                    current === c.state
                      ? 'border-(color:--accent-ring) bg-(color:--accent)/15 font-medium'
                      : 'border-slate-300 dark:border-slate-700'
                  }`}
                >
                  <span aria-hidden>{c.icon}</span>
                  {avoid && c.avoidLabel ? c.avoidLabel : c.label}
                </button>
              ))}
            </div>
          </div>
        )
      })}
      <p className="text-xs text-slate-500">Lo stesso stato di nuovo lo toglie.</p>

      <details className="group rounded-lg border border-slate-200 dark:border-slate-800">
        <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 px-3 text-sm font-medium [&::-webkit-details-marker]:hidden">
          <span aria-hidden className="text-slate-400 transition-transform group-open:rotate-90">
            ›
          </span>
          🏖 Vacanza
        </summary>
        <div className="px-3 pb-3">
          <HabitRestRanges habit={habit} today={today} />
        </div>
      </details>

      <HabitOverview
        habit={habit}
        states={states}
        storedDays={stored}
        slips={data.slips.get(habit.id)}
        apps={data.appsByWeek}
        wins={data.wins.get(habit.id) ?? 0}
        today={today}
      />

      <Link
        to={habitPath(habit.id)}
        state={{ from: `${location.pathname}${location.search}` }}
        className={`${buttonClass('primary')} w-full`}
      >
        Apri dettaglio →
      </Link>
    </div>
  )
}
