import { SectionTitle } from '../../components/SectionTitle'
import { useRef, useState } from 'react'
import { Stat } from '../../components/Stat'
import { Button } from '../../components/Button'
import { useLongPress } from '../../lib/useLongPress'
import type { Habit, HabitDayState } from '../../lib/db'
import { buildRecap, recapPeriod, shiftPeriod, tallyReasons, type RecapKind } from './habitRecapData'
import { habitStats } from './habitStats'
import { suggest } from './habitSuggestions'
import {
  OVERSHOOT_CELL,
  OVERSHOOT_ICON,
  NEG_OVERSHOOT_CELL,
  NEG_OVERSHOOT_ICON,
  NEG_OVERSHOOT_TEXT,
  OVERSHOOT_TEXT,
  MISS_REASONS,
  overshootOf,
  reasonLabel,
  REST_REASONS,
  slipLimit,
  STATE_CELL,
  STATE_ICON,
} from './habitStates'

interface Props {
  kind: RecapKind
  habits: readonly Habit[]
  states: ReadonlyMap<string, ReadonlyMap<string, HabitDayState>>
  notes: ReadonlyMap<string, ReadonlyMap<string, string>>
  today: string
  /** A day in the period to show instead of today's; the ‹ › buttons are then hidden (Life's month view picks the month itself). */
  anchor?: string | undefined
  onOpen: (habitId: string) => void
  /** When given, every row gets a button that taps the habit for today (used in Life). */
  onTapToday?: ((habit: Habit) => void) | undefined
  /** When given, a day can be tapped to pick its state (done, floor, rest, missed, clear). `reason`
   *  undefined keeps the day's reason when the same state is picked again; '' clears it. */
  onSetDay?: ((habit: Habit, day: string, state: HabitDayState | null, reason?: string) => void) | undefined
  /** Taps per day (multi-tap habits) and slips per day (daily-grace "don't" habits), per habit. */
  counts?: ReadonlyMap<string, ReadonlyMap<string, number>> | undefined
  slips?: ReadonlyMap<string, ReadonlyMap<string, number>> | undefined
  onSetCount?: ((habit: Habit, day: string, count: number) => void) | undefined
  onSetSlips?: ((habit: Habit, day: string, slips: number) => void) | undefined
}

const WEEKDAY = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

const PICK: readonly (readonly [HabitDayState | null, string])[] = [
  ['done', '✓ Done'],
  ['floor', '◐ Floor'],
  ['skip', '⏸ Rest'],
  ['fail', '✕ Missed'],
  [null, 'Clear'],
]

const fmt = (day: string) =>
  new Date(`${day}T12:00:00`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  })

/** Every habit side by side for a week or a month: counts, reasons, Spock prompt. */
export function HabitRecap({
  kind,
  habits,
  states,
  notes,
  today,
  anchor,
  onOpen,
  onTapToday,
  onSetDay,
  counts,
  slips,
  onSetCount,
  onSetSlips,
}: Props) {
  const [offset, setOffset] = useState(0)
  // The day being picked; after Rest or Missed, `reasonFor` shows the one-tap reasons.
  const [picked, setPicked] = useState<{ id: string; day: string; reasonFor?: 'skip' | 'fail' } | null>(null)
  // Long press on today's button opens today's choices (floor, rest, missed, clear).
  const pressed = useRef('')
  const { bind, consumeLongPress } = useLongPress(() => setPicked({ id: pressed.current, day: today }), !!onSetDay)
  let period = recapPeriod(kind, anchor ?? today)
  if (offset !== 0) for (let i = 0; i < Math.abs(offset); i++) period = shiftPeriod(period, Math.sign(offset))
  const rows = buildRecap(habits, states, notes, period, today, counts, slips)

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
      : new Date(`${period.from}T12:00:00`).toLocaleDateString('en-GB', {
          month: 'long',
          year: 'numeric',
        })

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        {anchor ? (
          <span />
        ) : (
          <Button variant="ghost" onClick={() => setOffset(offset - 1)} aria-label={`Previous ${kind}`}>
            ‹
          </Button>
        )}
        <h2 className="text-sm font-medium">
          {label}
          {offset === 0 && !anchor && <span className="ml-2 text-xs text-slate-500">(now)</span>}
        </h2>
        {anchor ? (
          <span />
        ) : (
          <Button
            variant="ghost"
            onClick={() => setOffset(offset + 1)}
            disabled={offset >= 0}
            aria-label={`Next ${kind}`}
          >
            ›
          </Button>
        )}
      </div>

      <section aria-label="Overview" className="grid grid-cols-2 gap-2 text-center sm:grid-cols-4">
        <Stat label="targets reached" value={counted.length ? `${hits}/${counted.length}` : '–'} />
        <Stat
          label="days done"
          value={String(sum((r) => r.done))}
          sub={sum((r) => r.floor) ? `${sum((r) => r.floor)} floor` : undefined}
        />
        <Stat label="rest days" value={String(sum((r) => r.skip))} />
        {sum((r) => (r.habit.direction === 'avoid' ? 0 : r.extra)) > 0 && (
          <Stat
            label={`${OVERSHOOT_ICON} extra`}
            value={`+${sum((r) => (r.habit.direction === 'avoid' ? 0 : r.extra))}`}
            sub="beyond the goal"
          />
        )}
        {sum((r) => (r.habit.direction === 'avoid' ? r.extra : 0)) > 0 && (
          <Stat
            label={`${NEG_OVERSHOOT_ICON} past the limit`}
            value={String(sum((r) => (r.habit.direction === 'avoid' ? r.extra : 0)))}
            sub="slips"
          />
        )}
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
                  const perDay = r.habit.perDay ?? 1
                  const avoid = r.habit.direction === 'avoid'
                  const n = counts?.get(r.habit.id)?.get(today) ?? 0
                  const sl = slips?.get(r.habit.id)?.get(today) ?? 0
                  const slipped = todayState === 'fail' || sl > 0
                  // Same amber as the Today tile (floor mode): open today after a missed day, the streak is at risk.
                  const atRisk =
                    !avoid &&
                    !done &&
                    todayState !== 'skip' &&
                    todayState !== 'fail' &&
                    habitStats(r.habit, states.get(r.habit.id) ?? new Map(), today).gap >= 1
                  const face = avoid
                    ? sl > 0 && (sl > slipLimit(r.habit) || r.habit.graceScope === 'day')
                      ? sl > slipLimit(r.habit)
                        ? `${sl} ${NEG_OVERSHOOT_ICON}`
                        : String(sl)
                      : todayState === 'fail'
                        ? '✕'
                        : todayState === 'skip'
                          ? '⏸'
                          : '✓'
                    : perDay > 1 && !done
                      ? `${n}/${perDay}`
                      : done
                        ? n > perDay
                          ? `${n}/${perDay} ${OVERSHOOT_ICON}`
                          : '✓'
                        : '○'
                  return (
                    <button
                      type="button"
                      {...bind}
                      onPointerDown={() => {
                        pressed.current = r.habit.id
                        bind.onPointerDown()
                      }}
                      onClick={() => {
                        if (consumeLongPress()) return
                        if (avoid) setPicked({ id: r.habit.id, day: today })
                        else onTapToday(r.habit)
                      }}
                      aria-label={
                        avoid
                          ? `${r.habit.name}: kept or slipped today`
                          : perDay > 1
                            ? `${r.habit.name}: ${n} of ${perDay} today, tap for one more`
                            : `${r.habit.name}: tap for today`
                      }
                      aria-pressed={done}
                      className={`flex h-10 min-w-10 shrink-0 touch-manipulation items-center justify-center rounded-full border px-2 text-sm select-none ${
                        avoid && overshootOf(r.habit, 0, sl) > 0
                          ? 'border-rose-600 bg-rose-600 text-white'
                          : avoid && slipped
                            ? 'border-amber-400 bg-amber-400/30'
                            : !avoid && done && n > perDay
                              ? 'border-violet-400 bg-violet-400 text-slate-900'
                              : done || (avoid && todayState !== 'skip')
                                ? 'border-emerald-400 bg-emerald-400 text-slate-900'
                                : atRisk
                                  ? 'border-amber-400 bg-amber-300/20'
                                  : 'border-slate-300 dark:border-slate-600'
                      }`}
                    >
                      {face}
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
                  : `${r.done}/${r.expected}${r.graceUsed ? ` +${r.graceUsed} grace` : ''}${r.hit ? ' ✓' : ''}`}
                {r.hit !== null && r.extra > 0 && (
                  <span
                    className={`ml-1 font-medium ${r.habit.direction === 'avoid' ? NEG_OVERSHOOT_TEXT : OVERSHOOT_TEXT}`}
                  >
                    {r.habit.direction === 'avoid' ? NEG_OVERSHOOT_ICON : OVERSHOOT_ICON}
                    {r.extra}
                  </span>
                )}
              </span>
            </div>
            <div className={`mt-2 flex flex-wrap ${kind === 'week' ? 'justify-between' : 'gap-1'}`} aria-label="Days">
              {r.cells.map((c, i) => {
                const st = c.state === 'future' || c.state === 'before' || c.state === 'after' ? null : c.state
                const dayCount = counts?.get(r.habit.id)?.get(c.day) ?? 0
                const goal = r.habit.perDay ?? 1
                const daySlips = slips?.get(r.habit.id)?.get(c.day) ?? 0
                const over =
                  r.habit.direction === 'avoid'
                    ? overshootOf(r.habit, 0, daySlips) > 0
                    : st === 'done' && dayCount > goal
                const cls = `flex size-8 items-center justify-center rounded-full text-xs ${
                  over
                    ? r.habit.direction === 'avoid'
                      ? NEG_OVERSHOOT_CELL
                      : OVERSHOOT_CELL
                    : st
                      ? STATE_CELL[st]
                      : 'border border-slate-200 text-slate-300 dark:border-slate-800'
                } ${picked?.id === r.habit.id && picked.day === c.day ? 'ring-2 ring-slate-500' : ''}`
                const partial = dayCount > 0 && (st === 'empty' || st === 'missed')
                const icon = partial
                  ? String(dayCount)
                  : over
                    ? r.habit.direction === 'avoid'
                      ? NEG_OVERSHOOT_ICON
                      : OVERSHOOT_ICON
                    : !st || st === 'empty'
                      ? ''
                      : STATE_ICON[st]
                const title = `${c.day}${over ? (r.habit.direction === 'avoid' ? ` · ${daySlips} slips` : ` · ${dayCount}/${goal}`) : ''}${c.note ? ` · ${reasonLabel(c.note)}` : ''}`
                return (
                  <span key={c.day} className="flex flex-col items-center gap-0.5">
                    {onSetDay && c.state !== 'future' ? (
                      <button
                        type="button"
                        title={title}
                        aria-label={`${r.habit.name}, ${c.day}${st === 'missed' ? ' (missed, not marked)' : ''}: choose a state`}
                        onClick={() =>
                          setPicked(
                            picked?.id === r.habit.id && picked.day === c.day ? null : { id: r.habit.id, day: c.day },
                          )
                        }
                        className={`${cls} touch-manipulation`}
                      >
                        {icon}
                      </button>
                    ) : (
                      <span title={title} className={cls}>
                        {icon}
                      </span>
                    )}
                    {kind === 'week' && (
                      <span
                        className={`text-[10px] leading-none ${c.day === today ? 'font-semibold' : 'text-slate-500 dark:text-slate-400'}`}
                      >
                        {WEEKDAY[i]}
                      </span>
                    )}
                  </span>
                )
              })}
            </div>
            {onSetDay && picked?.id === r.habit.id && picked.reasonFor === undefined && (
              <div className="mt-2 flex flex-wrap gap-1" role="group" aria-label={`State for ${picked.day}`}>
                {pickOptions(
                  r.habit,
                  picked.day,
                  counts?.get(r.habit.id)?.get(picked.day) ?? 0,
                  slips?.get(r.habit.id)?.get(picked.day) ?? 0,
                  { onSetDay, onSetCount, onSetSlips },
                ).map(({ label, run, reasonFor }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => {
                      run()
                      setPicked(reasonFor ? { ...picked, reasonFor } : null)
                    }}
                    className="min-h-10 flex-1 rounded-lg bg-slate-100 px-2 text-xs hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
            {onSetDay &&
              picked?.id === r.habit.id &&
              picked.reasonFor !== undefined &&
              (() => {
                const { day, reasonFor } = picked
                const current = notes.get(r.habit.id)?.get(day)
                return (
                  <div className="mt-2 flex flex-wrap gap-1" role="group" aria-label={`Reason for ${day}`}>
                    {(reasonFor === 'skip' ? REST_REASONS : MISS_REASONS).map(([reason, label]) => (
                      <button
                        key={reason}
                        type="button"
                        aria-pressed={current === reason}
                        onClick={() => {
                          onSetDay(r.habit, day, reasonFor, reason)
                          setPicked(null)
                        }}
                        className={`min-h-10 flex-1 rounded-lg px-2 text-xs ${
                          current === reason
                            ? 'bg-slate-300 font-medium dark:bg-slate-600'
                            : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setPicked(null)}
                      className="min-h-10 flex-1 rounded-lg border border-slate-300 px-2 text-xs dark:border-slate-700"
                    >
                      {current ? 'Keep the reason' : 'No reason'}
                    </button>
                  </div>
                )
              })()}
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
          <SectionTitle as="h3">What got in the way, this {kind}</SectionTitle>
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

interface PickOption {
  label: string
  run: () => void
  /** Rest and missed: after saving, offer the one-tap reasons. */
  reasonFor?: 'skip' | 'fail' | undefined
}

/** The choices for one day, shaped by the kind of habit: steps count taps,
 *  a "don't" habit is kept or slipped, a plain habit is done or not. */
function pickOptions(
  habit: Habit,
  day: string,
  count: number,
  slipCount: number,
  p: Pick<Props, 'onSetDay' | 'onSetCount' | 'onSetSlips'>,
): PickOption[] {
  const set = (state: HabitDayState | null) => () => p.onSetDay?.(habit, day, state)
  const rest: PickOption = { label: '⏸ Rest', run: set('skip'), reasonFor: 'skip' }
  const perDay = habit.perDay ?? 1
  if (habit.direction === 'avoid') {
    const daily = habit.graceScope === 'day' && (habit.grace ?? 0) > 0
    return [
      { label: '✓ Kept', run: () => (daily ? p.onSetSlips?.(habit, day, 0) : p.onSetDay?.(habit, day, null)) },
      ...(daily
        ? [
            {
              label: slipCount >= slipLimit(habit) ? NEG_OVERSHOOT_ICON : '+1 slip',
              run: () => p.onSetSlips?.(habit, day, slipCount + 1),
            },
          ]
        : slipCount >= 1
          ? [{ label: NEG_OVERSHOOT_ICON, run: () => p.onSetSlips?.(habit, day, slipCount + 1) }]
          : []),
      { label: '✕ Slipped', run: set('fail'), reasonFor: 'fail' },
      rest,
    ]
  }
  if (perDay > 1) {
    return [
      { label: count >= perDay ? OVERSHOOT_ICON : '+1', run: () => p.onSetCount?.(habit, day, count + 1) },
      { label: '✓ All', run: set('done') },
      { label: '◐ Floor', run: set('floor') },
      rest,
      { label: '✕ Missed', run: set('fail'), reasonFor: 'fail' },
      { label: 'Clear', run: set(null) },
    ]
  }
  const extras: PickOption[] =
    count >= 1 && p.onSetCount ? [{ label: OVERSHOOT_ICON, run: () => p.onSetCount?.(habit, day, count + 1) }] : []
  return [
    ...PICK.map(([state, label]) => ({
      label,
      run: set(state),
      reasonFor: state === 'skip' || state === 'fail' ? state : undefined,
    })),
    ...extras,
  ]
}
