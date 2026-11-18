import { useState } from 'react'
import { db, type Habit, type HabitDayState } from '../../lib/db'
import { Button } from '../../components/Button'
import { Sheet } from '../../components/Sheet'
import { daysInRange, MAX_REST_RANGE, setDayState, setRestRange, updateHabit } from '../../lib/habitSync'
import { runSafe } from '../../lib/runSafe'
import { habitStats, monthGrid, shiftDayKey } from './habitStats'
import { HabitForm } from './HabitForm'
import { HabitSuggestionList } from './HabitSuggestionList'
import { suggest } from './habitSuggestions'
import { toForm } from './habitFormDefaults'
import { REST_REASONS, STATE_CELL } from './habitStates'
import { displayCell, habitBounds } from './habitDayStates'
import { HabitLegend } from './HabitLegend'
import { engineLabel } from '../life/model/engines'

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

interface Props {
  habit: Habit | null
  states: ReadonlyMap<string, HabitDayState>
  notes: ReadonlyMap<string, string>
  openCount: number
  /** Lifetime wins of this habit: its boxes on the lifeboard. */
  wins: number
  today: string
  onClose: () => void
  onArchive: (habit: Habit) => void
}

function shiftMonth(month: string, n: number): string {
  const [y, m] = month.split('-').map(Number) as [number, number]
  const d = new Date(y, m - 1 + n, 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export function HabitDetail({ habit, states, notes, openCount, wins, today, onClose, onArchive }: Props) {
  return (
    <Sheet open={habit !== null} onClose={onClose} title={habit ? `${habit.emoji} ${habit.name}` : ''}>
      {habit && (
        <Body
          key={habit.id}
          habit={habit}
          states={states}
          notes={notes}
          openCount={openCount}
          wins={wins}
          today={today}
          onClose={onClose}
          onArchive={onArchive}
        />
      )}
    </Sheet>
  )
}

function Body({ habit, states, notes, openCount, wins, today, onClose, onArchive }: Props & { habit: Habit }) {
  const [month, setMonth] = useState(today.slice(0, 7))
  // The brush: one click on a day applies it (the same state again clears the day).
  const [brush, setBrush] = useState<HabitDayState | null>(habit.direction === 'avoid' ? 'fail' : 'done')
  const s = habitStats(habit, states, today)
  const bounds = habitBounds(habit, states)
  const unit = s.streakUnit === 'weeks' ? 'w' : 'd'

  return (
    <div className="space-y-6">
      {habit.engine && (
        <p
          data-testid="habit-engine"
          aria-label={`Engine: ${engineLabel(habit.engine)}`}
          className="-mb-3 inline-flex rounded-full border border-slate-300 px-2.5 py-0.5 text-xs text-slate-600 dark:border-slate-700 dark:text-slate-300"
        >
          {engineLabel(habit.engine)}
        </p>
      )}
      <HabitSuggestionList
        suggestions={suggest({ habit, stats: s, states, notes, today, openCount })}
        onApply={(sg) => {
          if (sg.action)
            void runSafe(updateHabit, 'Could not save')(habit, habit.name, habit.emoji, {
              ...toForm(habit),
              ...sg.action.patch,
            })
        }}
      />

      <section aria-label="Numbers" className="grid grid-cols-2 gap-2 text-center sm:grid-cols-3">
        <Stat label="forever wins" value={String(wins)} sub="boxes on the lifeboard" />
        <Stat
          label="days done"
          value={String(s.doneTotal)}
          sub={s.floor30 ? `${s.floor30} floor in the last 30` : undefined}
        />
        <Stat label="this week" value={`${s.week.done}/${s.week.expected || s.target}`} />
        <Stat label="current streak" value={`${s.streak}${unit}`} />
        <Stat label="longest streak" value={`${s.bestStreak}${unit}`} />
        <Stat label="came back" value={String(s.returns)} sub="after a miss" />
        {s.cycle && <Stat label="cycle day" value={`${s.cycle.day}/${s.cycle.length}`} />}
      </section>

      {s.lastWeeks.length > 0 && (
        <section aria-label="Weeks">
          <h3 className="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">
            Last weeks (target {s.target}/week)
          </h3>
          <div className="flex items-end gap-1.5">
            {[...s.lastWeeks, s.week].map((w) => (
              <div
                key={w.start}
                className="flex flex-1 flex-col items-center gap-1"
                title={`${w.start}: ${w.done}/${w.expected}`}
              >
                <div className="flex h-14 w-full items-end rounded bg-slate-100 dark:bg-slate-800">
                  <div
                    className={`w-full rounded ${w.hit ? 'bg-emerald-400' : 'bg-amber-400'}`}
                    style={{ height: `${Math.min(100, (w.done / Math.max(1, s.target)) * 100)}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-500">{w.start.slice(8)}</span>
              </div>
            ))}
          </div>
        </section>
      )}

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
              className={`min-h-9 rounded-lg border px-2.5 text-xs ${
                brush === c.state
                  ? 'border-(color:--accent-ring) bg-(color:--accent)/15 font-medium'
                  : 'border-slate-300 dark:border-slate-700'
              }`}
            >
              {c.icon} {habit.direction === 'avoid' && c.avoidLabel ? c.avoidLabel : c.label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs">
          {WEEKDAYS.map((d, i) => (
            <span key={i} className="text-slate-500">
              {d}
            </span>
          ))}
          {monthGrid(month, today)
            .flat()
            .map((c, i) => {
              if (c === null) return <span key={i} />
              const cell = displayCell(habit, c.day, states.get(c.day), today, bounds)
              const look = cell === 'future' || cell === 'before' || cell === 'after' ? 'empty' : cell
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
                      brush === null || current === brush ? null : brush,
                    )
                  }}
                  aria-label={`${c.day}: ${cell === 'missed' ? 'missed, not marked' : (states.get(c.day) ?? 'empty')}`}
                  className={`flex size-10 items-center justify-center justify-self-center rounded-full ${STATE_CELL[look]} ${
                    c.future ? 'text-slate-400' : ''
                  } ${c.day === today ? 'ring-2 ring-slate-400' : ''}`}
                >
                  {Number(c.day.slice(8))}
                </button>
              )
            })}
        </div>
        <p className="mt-2 text-xs text-slate-500">
          One click on a day applies the chosen state; the same state again clears it.
        </p>
        <HabitLegend />
      </section>

      <VacationForm habit={habit} today={today} />

      <section aria-label="Cycle and settings" className="space-y-3">
        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Cycle and settings</h3>
        <HabitForm
          initial={toForm(habit)}
          submitLabel="Save"
          verdict
          onSubmit={async (v) => {
            await updateHabit(habit, v.name, v.emoji, v)
            onClose()
          }}
          extra={
            <Button type="button" variant="ghost" onClick={() => onArchive(habit)}>
              🗄 Archive
            </Button>
          }
        />
      </section>
    </div>
  )
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string | undefined }) {
  return (
    <div className="rounded-xl bg-slate-100 p-2 dark:bg-slate-800">
      <div className="text-xl font-semibold">{value}</div>
      <div className="text-xs text-slate-500 dark:text-slate-400">{label}</div>
      {sub && <div className="text-[10px] text-slate-500">{sub}</div>}
    </div>
  )
}

/** Vacation: one habit, every day from X to Y becomes a rest day with a
 *  reason (default 🏖 Vacation), whatever it held before. Future days allowed. */
function VacationForm({ habit, today }: { habit: Habit; today: string }) {
  const [from, setFrom] = useState(today)
  const [to, setTo] = useState(shiftDayKey(today, 6))
  const [reason, setReason] = useState<string>('vacation')
  const days = from && to ? daysInRange(from, to) : []
  const tooLong = from && to && days.length > MAX_REST_RANGE
  const valid = days.length > 0 && !tooLong
  async function apply(clear: boolean) {
    if (!valid) return
    // Only stored checks count: a habit to avoid shows a derived "kept" on days with nothing saved.
    const stored = await db.habitChecks
      .where('[habitId+day]')
      .between([habit.id, days[0]!], [habit.id, days[days.length - 1]!], true, true)
      .filter((c) => c.status !== 'skip')
      .count()
    if (
      !clear &&
      stored > 0 &&
      !window.confirm(`${stored} day(s) in this range already have a state. Make them rest days too?`)
    )
      return
    if (clear && !window.confirm(`Clear every day from ${days[0]} to ${days[days.length - 1]}?`)) return
    void runSafe(setRestRange, 'Could not save')(habit.id, from, to, clear ? null : reason)
  }

  const field = 'min-h-10 w-full rounded-lg border border-slate-300 bg-transparent px-2 text-sm dark:border-slate-700'
  return (
    <section aria-label="Vacation" className="space-y-2">
      <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">🏖 Vacation</h3>
      <div className="grid grid-cols-2 gap-2">
        <label className="text-xs text-slate-500">
          From
          <input type="date" className={field} value={from} onChange={(e) => setFrom(e.target.value)} />
        </label>
        <label className="text-xs text-slate-500">
          To
          <input type="date" className={field} value={to} onChange={(e) => setTo(e.target.value)} />
        </label>
      </div>
      <label className="block text-xs text-slate-500">
        Reason
        <select className={field} value={reason} onChange={(e) => setReason(e.target.value)}>
          {REST_REASONS.map(([k, label]) => (
            <option key={k} value={k}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <div className="flex flex-wrap gap-2">
        <Button type="button" disabled={!valid} onClick={() => void apply(false)}>
          Set {valid ? days.length : ''} rest day{days.length === 1 ? '' : 's'}
        </Button>
        <Button type="button" variant="ghost" disabled={!valid} onClick={() => void apply(true)}>
          ⌫ Clear these days
        </Button>
      </div>
      <p className="text-xs text-slate-500">
        {tooLong
          ? `At most ${MAX_REST_RANGE} days at a time.`
          : 'Every day in the range becomes a rest day: it does not break the streak. Future days are fine.'}
      </p>
    </section>
  )
}
