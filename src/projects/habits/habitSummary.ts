// Pure text and numbers for the habit's overview (M2): the measured version of
// the stat tiles and week bars, the quick sheet's experiment recap, the
// app-limits summary row and the target line. A measured habit is judged on
// its measured weeks only: no day streak, no lifeboard wins, no "came back"
// (they count ticks alone, and a forgotten slip would read as kept there).

import type { Habit, HabitDayState, HabitVerdict } from '../../lib/db'
import type { AppsByWeek } from './habitMeasure'
import { buildRecap, type MeasuredWeek, type RecapPeriod } from './habitRecapData'
import { measuredWeek } from './habitCalendarData'
import { habitBounds } from './habitDayStates'
import { daysBetween, habitStats, shiftDayKey, weekStart } from './habitStats'

export interface SummaryInput {
  habit: Habit
  states: ReadonlyMap<string, HabitDayState>
  slips?: ReadonlyMap<string, number> | undefined
  apps?: AppsByWeek | undefined
  today: string
}

const weeksWord = (n: number) => (n === 1 ? 'settimana' : 'settimane')

/** A measured habit's last weeks, judged on data, for its tiles and bars. */
export interface MeasuredOverview {
  /** Oldest first, this week last; only weeks that expected something. */
  weeks: MeasuredWeek[]
  /** This week, if it expects something yet. */
  current: MeasuredWeek | null
  hitWeeks: number
  verifiedWeeks: number
  unverifiedWeeks: number
  /** Extensions proven over the verified weeks, and slips ticked over all of them. */
  verified: number
  manual: number
}

/** The last `back` complete weeks plus this one (like the "Last weeks" bars, 8 + 1). */
export function measuredOverview({ habit, states, slips, apps, today }: SummaryInput, back = 8): MeasuredOverview {
  const monday = weekStart(today)
  const weeks: MeasuredWeek[] = []
  for (let i = back; i >= 0; i--) {
    const w = measuredWeek(habit, states, slips, apps, shiftDayKey(monday, -7 * i), today)
    if (w && w.manualHit !== null) weeks.push(w)
  }
  const verified = weeks.filter((w) => w.hit !== null)
  return {
    weeks,
    current: weeks.at(-1)?.week === monday ? weeks.at(-1)! : null,
    hitWeeks: verified.filter((w) => w.hit).length,
    verifiedWeeks: verified.length,
    unverifiedWeeks: weeks.length - verified.length,
    verified: verified.reduce((n, w) => n + (w.evidence?.verified ?? 0), 0),
    manual: weeks.reduce((n, w) => n + w.manual, 0),
  }
}

const VERDICT: Record<HabitVerdict, string> = { up: 'su', stay: 'resta', down: 'giù', closed: 'chiuso' }

const fmtDay = (day: string) =>
  new Date(`${day}T12:00:00`).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`

/** The quick sheet's recap of an experiment (kind 'experiment'): where the
 *  cycle is, then how it is going so far. Forever habits: nothing. */
export function experimentLines({ habit, states, slips, apps, today }: SummaryInput): string[] {
  if (habit.kind !== 'experiment') return []
  const start = habit.cycleStart ?? habitBounds(habit, states).start
  const end = habit.cycleEnd
  let head = '🧪 Esperimento'
  if (end && today > end)
    head += habit.verdict ? ` · verdetto: ${VERDICT[habit.verdict]}` : ` · finito il ${fmtDay(end)}: da giudicare`
  else if (end) {
    const cycle = habitStats(habit, states, today).cycle
    const left = daysBetween(today, end)
    if (cycle) head += ` · giorno ${cycle.day} di ${cycle.length}`
    head += left === 0 ? ' · ultimo giorno' : ` · ${left === 1 ? 'manca 1 giorno' : `mancano ${left} giorni`}`
  }

  // The cycle so far: start to today (or to the end, once past it).
  const last = end && end < today ? end : today
  if (last < start) return [head]
  const days: string[] = []
  for (let d = start; d <= last; d = shiftDayKey(d, 1)) days.push(d)
  const period: RecapPeriod = { kind: 'month', from: start, to: last, days }
  const [row] = buildRecap(
    [habit],
    new Map([[habit.id, states]]),
    new Map(),
    period,
    today,
    undefined,
    slips ? new Map([[habit.id, slips]]) : undefined,
    apps ?? new Map(),
  )
  if (!row) return [head]
  let sofar: string
  if (row.measured) {
    const m = row.measured
    sofar =
      m.verifiedWeeks > 0
        ? `Finora: ${m.hitWeeks} ${weeksWord(m.hitWeeks)} su ${m.verifiedWeeks} verificate rispettate`
        : 'Finora: nessuna settimana verificata'
    if (m.unverifiedWeeks) sofar += ` · ${m.unverifiedWeeks} da verificare`
  } else if (habit.direction === 'avoid') {
    const n = days.reduce((k, d) => k + (slips?.get(d) ?? (states.get(d) === 'fail' ? 1 : 0)), 0)
    const g = habit.grace ?? 0
    sofar = `Finora: ${plural(n, 'sgarro', 'sgarri')}, ${
      g > 0 ? `tolleranza ${g}/${habit.graceScope === 'day' ? 'giorno' : 'sett.'}` : 'nessuna tolleranza'
    }`
  } else {
    sofar = `Finora: ${row.done} fatti su ${row.expected} attesi`
  }
  return [head, sofar]
}

/** The closed row of the app-limits section: "4 app · ultima sett. ok ✓". `weeks` newest first. */
export function limitsSummary(appCount: number, weeks: readonly MeasuredWeek[]): string {
  const last = weeks.find((w) => w.hit !== null)
  const verdict = !last
    ? 'da verificare'
    : last.hit
      ? 'ultima sett. ok ✓'
      : `ultima sett. mancata ≥${last.slips ?? last.manual}`
  return `${appCount} app · ${verdict}`
}

/** "Ogni giorno", "3 volte a settimana", "Tolleranza: 1 a settimana". */
export function targetLine(h: Habit): string {
  if (h.direction === 'avoid') {
    const g = h.grace ?? 0
    return g > 0 ? `Tolleranza: ${g} ${h.graceScope === 'day' ? 'al giorno' : 'a settimana'}` : 'Nessuna tolleranza'
  }
  const t = h.target ?? 7
  const base = t === 7 ? 'Ogni giorno' : `${t} volt${t === 1 ? 'a' : 'e'} a settimana`
  return (h.perDay ?? 1) > 1 ? `${base}, ${h.perDay} al giorno` : base
}
