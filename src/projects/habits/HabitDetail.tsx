import { useState } from 'react'
import type { Habit, HabitDayState } from '../../lib/db'
import { Button } from '../../components/Button'
import { Sheet } from '../../components/Sheet'
import { setDayState, updateHabit } from '../../lib/habitSync'
import { runSafe } from '../../lib/runSafe'
import { habitStats, monthGrid } from './habitStats'
import { HabitForm } from './HabitForm'
import { HabitSuggestionList } from './HabitSuggestionList'
import { suggest } from './habitSuggestions'
import { toForm } from './habitFormDefaults'
import { STATE_CELL } from './habitStates'
import { HabitLegend } from './HabitLegend'

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
  const unit = s.streakUnit === 'weeks' ? 'w' : 'd'

  return (
    <div className="space-y-6">
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
            disabled={month >= today.slice(0, 7)}
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
            .map((c, i) =>
              c === null ? (
                <span key={i} />
              ) : (
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
                  aria-label={`${c.day}: ${states.get(c.day) ?? 'empty'}`}
                  className={`flex size-9 items-center justify-center justify-self-center rounded-full ${STATE_CELL[states.get(c.day) ?? 'empty']} ${
                    c.future ? 'text-slate-400' : ''
                  } ${c.day === today ? 'ring-2 ring-slate-400' : ''}`}
                >
                  {Number(c.day.slice(8))}
                </button>
              ),
            )}
        </div>
        <p className="mt-2 text-xs text-slate-500">
          One click on a day applies the chosen state; the same state again clears it.
        </p>
        <HabitLegend />
      </section>

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
