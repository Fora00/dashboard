import { useState } from 'react'
import { Button } from '../../components/Button'
import type { Habit, HabitDayState } from '../../lib/db'
import { buildRecap, recapPeriod, shiftPeriod, tallyReasons, type RecapKind } from './habitRecapData'
import { habitStats } from './habitStats'
import { suggest } from './habitSuggestions'
import { reasonLabel, STATE_CELL, STATE_ICON } from './habitStates'

interface Props {
  kind: RecapKind
  habits: readonly Habit[]
  states: ReadonlyMap<string, ReadonlyMap<string, HabitDayState>>
  notes: ReadonlyMap<string, ReadonlyMap<string, string>>
  today: string
  onOpen: (habitId: string) => void
  /** When given, every row gets a button that taps the habit for today (used in Life). */
  onTapToday?: ((habit: Habit) => void) | undefined
}

const fmt = (day: string) => new Date(`${day}T12:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })

/** Every habit side by side for a week or a month: counts, reasons, Spock prompt. */
export function HabitRecap({ kind, habits, states, notes, today, onOpen, onTapToday }: Props) {
  const [offset, setOffset] = useState(0)
  let period = recapPeriod(kind, today)
  if (offset !== 0) for (let i = 0; i < Math.abs(offset); i++) period = shiftPeriod(period, Math.sign(offset))
  const rows = buildRecap(habits, states, notes, period, today)

  const counted = rows.filter((r) => r.hit !== null)
  const hits = counted.filter((r) => r.hit).length
  const sum = (f: (r: (typeof rows)[number]) => number) => rows.reduce((n, r) => n + f(r), 0)
  const reasons = tallyReasons(rows)
  const toReview = rows.filter(
    (r) => r.fail > 0 || r.empty > 0 || r.hit === false || r.skip >= (kind === 'week' ? 3 : 8),
  )
  const label =
    kind === 'week'
      ? `${fmt(period.from)} – ${fmt(period.to)}`
      : new Date(`${period.from}T12:00:00`).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => setOffset(offset - 1)} aria-label={`Previous ${kind}`}>
          ‹
        </Button>
        <h2 className="text-sm font-medium">
          {label}
          {offset === 0 && <span className="ml-2 text-xs text-slate-500">(now)</span>}
        </h2>
        <Button
          variant="ghost"
          onClick={() => setOffset(offset + 1)}
          disabled={offset >= 0}
          aria-label={`Next ${kind}`}
        >
          ›
        </Button>
      </div>

      <section aria-label="Overview" className="grid grid-cols-2 gap-2 text-center sm:grid-cols-4">
        <Stat label="targets reached" value={counted.length ? `${hits}/${counted.length}` : '–'} />
        <Stat
          label="days done"
          value={String(sum((r) => r.done))}
          sub={sum((r) => r.floor) ? `${sum((r) => r.floor)} floor` : undefined}
        />
        <Stat label="rest days" value={String(sum((r) => r.skip))} />
        <Stat
          label="missed"
          value={String(sum((r) => r.fail))}
          sub={sum((r) => r.empty) ? `${sum((r) => r.empty)} unmarked` : undefined}
        />
      </section>

      <ul className="space-y-3">
        {rows.map((r) => (
          <li key={r.habit.id} className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
            <div className="flex items-start gap-2">
              <span className="text-xl">{r.habit.emoji}</span>
              <div className="min-w-0 flex-1">
                <div className="font-medium">{r.habit.name}</div>
                {r.habit.why && <div className="text-xs text-slate-500 italic">{r.habit.why}</div>}
              </div>
              {onTapToday &&
                offset === 0 &&
                (() => {
                  const todayState = r.cells.find((c) => c.day === today)?.state
                  const done = todayState === 'done' || todayState === 'floor'
                  return (
                    <button
                      type="button"
                      onClick={() => onTapToday(r.habit)}
                      aria-label={`${r.habit.name}: tap for today`}
                      aria-pressed={done}
                      className={`flex size-10 shrink-0 items-center justify-center rounded-full border text-sm ${
                        done
                          ? 'border-emerald-400 bg-emerald-400 text-slate-900'
                          : 'border-slate-300 dark:border-slate-600'
                      }`}
                    >
                      {done ? '✓' : '○'}
                    </button>
                  )
                })()}
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-xs ${
                  r.hit === null
                    ? 'bg-slate-100 text-slate-500 dark:bg-slate-800'
                    : r.hit
                      ? 'bg-emerald-400/20 text-emerald-700 dark:text-emerald-300'
                      : 'bg-amber-400/20 text-amber-700 dark:text-amber-300'
                }`}
              >
                {r.hit === null
                  ? 'not started'
                  : `${r.done}/${r.expected}${r.graceUsed ? ` +${r.graceUsed} grace` : ''} ${r.hit ? '✓' : ''}`}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1" aria-label="Days">
              {r.cells.map((c) => (
                <span
                  key={c.day}
                  title={`${c.day}${c.note ? ` · ${reasonLabel(c.note)}` : ''}`}
                  className={`flex size-6 items-center justify-center rounded-full text-[10px] ${
                    c.state === 'future' || c.state === 'before'
                      ? 'border border-slate-200 text-slate-300 dark:border-slate-800'
                      : STATE_CELL[c.state]
                  }`}
                >
                  {c.state === 'empty' || c.state === 'future' || c.state === 'before' ? '' : STATE_ICON[c.state]}
                </span>
              ))}
            </div>
            {Object.keys(r.reasons).length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {Object.entries(r.reasons).map(([k, n]) => (
                  <span key={k} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs dark:bg-slate-800">
                    {reasonLabel(k)} ×{n}
                  </span>
                ))}
              </div>
            )}
            {(() => {
              const hs = states.get(r.habit.id) ?? new Map<string, HabitDayState>()
              const tip = suggest({
                habit: r.habit,
                stats: habitStats(r.habit, hs, today),
                states: hs,
                notes: notes.get(r.habit.id) ?? new Map<string, string>(),
                today,
                openCount: habits.length,
              })[0]
              return tip ? <p className="mt-2 text-xs text-sky-700 dark:text-sky-300">💡 {tip.text}</p> : null
            })()}
            <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
              <span>
                {r.floor ? `${r.floor} floor · ` : ''}
                {r.skip ? `${r.skip} rest · ` : ''}
                {r.fail ? `${r.fail} missed · ` : ''}
                {r.empty ? `${r.empty} unmarked` : ''}
              </span>
              <button type="button" onClick={() => onOpen(r.habit.id)} className="min-h-8 underline decoration-dotted">
                Open
              </button>
            </div>
          </li>
        ))}
      </ul>

      {reasons.length > 0 && (
        <section aria-label="Reasons">
          <h3 className="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">
            What got in the way, this {kind}
          </h3>
          <div className="flex flex-wrap gap-2">
            {reasons.map(([k, n]) => (
              <span key={k} className="rounded-full bg-slate-100 px-3 py-1 text-sm dark:bg-slate-800">
                {reasonLabel(k)} ×{n}
              </span>
            ))}
          </div>
        </section>
      )}

      {toReview.length > 0 && (
        <section aria-label="Spock test" className="rounded-xl border border-amber-300/60 bg-amber-300/5 p-3 text-sm">
          <h3 className="font-medium">🖖 Spock test</h3>
          <p className="mt-1 text-slate-600 dark:text-slate-300">
            Not a character flaw: a systems problem. For each, one word for how you felt, the facts, and one fix to the
            setup (anchor, floor, plan).
          </p>
          <ul className="mt-2 space-y-1">
            {toReview.map((r) => (
              <li key={r.habit.id} className="flex items-center justify-between gap-2">
                <span>
                  {r.habit.emoji} {r.habit.name}: {r.done}/{r.expected}
                  {Object.keys(r.reasons).length > 0 && ` · ${Object.keys(r.reasons).map(reasonLabel).join(', ')}`}
                  {r.skip >= (kind === 'week' ? 3 : 8) && ` · ${r.skip} rest days: a break, or avoiding something?`}
                </span>
                <button
                  type="button"
                  onClick={() => onOpen(r.habit.id)}
                  className="min-h-8 shrink-0 underline decoration-dotted"
                >
                  Fix the setup
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
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
