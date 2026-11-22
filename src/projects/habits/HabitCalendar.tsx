import { useState } from 'react'
import type { Habit, HabitDayState } from '../../lib/db'
import { Button } from '../../components/Button'
import { setDayState } from '../../lib/habitSync'
import { shiftMonth } from '../../lib/dates'
import { runSafe } from '../../lib/runSafe'
import { STATE_CELL } from './habitStates'
import { HabitLegend } from './HabitLegend'
import { calendarMonth, chipLabel, chipText, chipTone, type CalendarLook } from './habitCalendarData'
import { isAppLimits, type AppsByWeek } from './habitMeasure'

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
/** The states a day can be set to from the calendar, never a partial one. A
 *  habit to avoid reads "done" as kept and "missed" as a slip. */
const DAY_CHOICES: { state: HabitDayState | null; icon: string; label: string; avoidLabel?: string }[] = [
  { state: 'done', icon: '✓', label: 'Done', avoidLabel: 'Kept' },
  { state: 'floor', icon: '◐', label: 'Only the floor', avoidLabel: 'Within my limit' },
  { state: 'skip', icon: '⏸', label: 'Rest day' },
  { state: 'fail', icon: '✕', label: 'Missed', avoidLabel: 'Slip' },
  { state: null, icon: '⌫', label: 'Clear' },
]

/** "Da verificare": neutral, dashed, never the kept green. */
const UNVERIFIED_CELL = 'border border-dashed border-slate-400 text-slate-500 dark:border-slate-500 dark:text-slate-400'

const lookClass = (look: CalendarLook) => (look === 'unverified' ? UNVERIFIED_CELL : STATE_CELL[look])

const CHIP_CLASS: Record<ReturnType<typeof chipTone>, string> = {
  hit: 'bg-emerald-400/20 text-emerald-700 dark:text-emerald-300',
  miss: 'bg-rose-400/20 text-rose-700 dark:text-rose-300',
  progress: 'bg-amber-400/20 text-amber-700 dark:text-amber-300',
  unverified: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
}

interface Props {
  habit: Habit
  states: ReadonlyMap<string, HabitDayState>
  /** Days with a stored check (habitRoute storedDaysOf). */
  storedDays: ReadonlySet<string>
  slips?: ReadonlyMap<string, number> | undefined
  apps?: AppsByWeek | undefined
  today: string
}

/** The month calendar of the habit page: a brush, one tap per day. Weeks are
 *  Monday-start (Life week keys); a measured habit's rows end with the week's
 *  verdict chip and its unproven "kept" days stay neutral (habitCalendarData.ts). */
export function HabitCalendar({ habit, states, storedDays, slips, apps, today }: Props) {
  const [month, setMonth] = useState(today.slice(0, 7))
  // The brush: one click on a day applies it (the same state again clears the day).
  const [brush, setBrush] = useState<HabitDayState | null>(habit.direction === 'avoid' ? 'fail' : 'done')
  const measured = isAppLimits(habit)
  const weeks = calendarMonth({ habit, states, storedDays, slips, apps, month, today })

  return (
    <section aria-label="Calendar">
      <div className="mb-2 flex items-center justify-between">
        <Button variant="ghost" onClick={() => setMonth(shiftMonth(month, -1))} aria-label="Previous month">
          ‹
        </Button>
        <h3 className="text-sm font-medium">{month}</h3>
        <Button
          variant="ghost"
          onClick={() => setMonth(shiftMonth(month, 1))}
          aria-label="Next month"
          disabled={month >= shiftMonth(today.slice(0, 7), 3)}
        >
          ›
        </Button>
      </div>
      <div role="radiogroup" aria-label="State to apply" className="mb-2 flex flex-wrap gap-1.5">
        {DAY_CHOICES.map((c) => (
          <button
            key={c.label}
            type="button"
            role="radio"
            aria-checked={brush === c.state}
            onClick={() => setBrush(c.state)}
            className={`min-h-10 rounded-lg border px-2.5 text-xs ${
              brush === c.state
                ? 'border-(color:--accent-ring) bg-(color:--accent)/15 font-medium'
                : 'border-slate-300 dark:border-slate-700'
            }`}
          >
            {c.icon} {habit.direction === 'avoid' && c.avoidLabel ? c.avoidLabel : c.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-[repeat(7,minmax(0,1fr))_2.75rem] gap-1 text-center text-xs">
        {WEEKDAYS.map((d, i) => (
          <span key={i} className="text-slate-500">
            {d}
          </span>
        ))}
        <span className="text-slate-500" title="Risultato della settimana">
          sett.
        </span>
        {weeks.flatMap((w) => [
          ...w.days.map((c, i) => {
            if (c === null) return <span key={`${w.week}:${i}`} />
            const label =
              c.look === 'unverified'
                ? 'da verificare'
                : c.cell === 'missed'
                  ? 'missed, not marked'
                  : (states.get(c.day) ?? 'empty')
            return (
              <button
                key={c.day}
                type="button"
                disabled={c.future}
                onClick={() => {
                  const current = states.get(c.day)
                  void runSafe(setDayState, 'Could not save')(
                    habit.id,
                    c.day,
                    brush === null || (current === brush && storedDays.has(c.day)) ? null : brush,
                  )
                }}
                aria-label={`${c.day}: ${label}`}
                className={`flex aspect-square w-full max-w-10 items-center justify-center justify-self-center rounded-full ${lookClass(c.look)} ${
                  c.future ? 'text-slate-400' : ''
                } ${c.day === today ? 'ring-2 ring-slate-400' : ''}`}
              >
                {Number(c.day.slice(8))}
              </button>
            )
          }),
          w.chip ? (
            <span
              key={`${w.week}:chip`}
              role="img"
              aria-label={`Settimana del ${w.week}: ${chipLabel(w.chip)}`}
              title={chipLabel(w.chip)}
              data-testid="week-chip"
              className={`flex min-h-8 items-center justify-center self-center rounded-full px-1 text-[11px] font-medium whitespace-nowrap tabular-nums ${CHIP_CLASS[chipTone(w.chip)]}`}
            >
              {chipText(w.chip)}
            </span>
          ) : (
            <span key={`${w.week}:chip`} />
          ),
        ])}
      </div>
      <p className="mt-2 text-xs text-slate-500">
        One click on a day applies the chosen state; the same state again clears it.
      </p>
      {!measured && (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          A fine riga il risultato della settimana:{' '}
          {habit.direction !== 'avoid'
            ? 'fatte / obiettivo'
            : habit.graceScope === 'day' && (habit.grace ?? 0) > 0
              ? 'giorni oltre il limite giornaliero'
              : 'sgarri / tollerati'}{' '}
          (verde rispettata, rosso mancata, ambra in corso). Mesi precedenti con ‹.
        </p>
      )}
      {measured && (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          <span className={`mr-1 inline-block size-3 rounded-full align-middle ${UNVERIFIED_CELL}`} /> Giorni non
          spuntati: da verificare finché la settimana non ha le “App più usate” della domenica. A fine riga: ✓ ok, ≥N ✕
          estensioni dimostrate (settimana mancata), ? da verificare. Le estensioni non si possono assegnare a un
          giorno.
        </p>
      )}
      <HabitLegend />
    </section>
  )
}
