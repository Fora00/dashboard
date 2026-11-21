import type { Habit, HabitVerdict, LifeEngineKey } from '../../../lib/db'
import { addDays } from './dates.ts'
import { engineLabel, isEngineKey } from './engines.ts'

// --- Habits-page habits in the exports (week and month) --------------------------
// One shape for a live habit over a period (a week or a month), filled by the
// views from the Habits recap (habits/habitRecapData.ts `buildRecap`), and the
// Markdown/JSON helpers both exports share. Pure: no React, no Dexie.

/** An experiment habit (kind 'experiment'): the month it runs in, from its cycle start. */
export interface HabitExperiment {
  /** 'YYYY-MM' of the cycle start; null when the cycle has no start date. */
  month: string | null
  start: string | null
  end: string | null
  verdict: HabitVerdict | null
}

/** One live Habits-page habit over a period (from the habit recap), for the exports. */
export interface LifeHabit {
  /** Habit id: stable across renames. Optional so older callers/tests stay valid. */
  id?: string
  emoji: string
  name: string
  /** 'avoid' = a "don't" habit: it counts slips, not done days. */
  avoid: boolean
  /** The Life Engine the habit feeds; null/absent = untagged. */
  engine?: LifeEngineKey | null
  /** Times per week (1-7; 7 = daily). Absent in older callers. */
  target?: number
  /** "Don't" habits: slips per week tolerated. */
  grace?: number
  /** Set only on experiment habits. */
  experiment?: HabitExperiment
  done: number
  floor: number
  skip: number
  fail: number
  /** Past, unmarked days. */
  empty: number
  /** Days of the period after today (current period only). */
  future?: number
  expected: number
  /** null when nothing was expected yet. */
  hit: boolean | null
  graceUsed: number
  /** Overshoot: taps above the goal over the period. */
  extra: number
  /** Reason label -> times, over rest days and misses (the Spock reasons of a habit). */
  reasons: Record<string, number>
}

/** The fields of a recap row this module reads (habits/habitRecapData.ts RecapRow). */
export interface HabitRecapLike {
  habit: Pick<
    Habit,
    | 'id'
    | 'emoji'
    | 'name'
    | 'direction'
    | 'engine'
    | 'target'
    | 'grace'
    | 'kind'
    | 'cycleStart'
    | 'cycleEnd'
    | 'verdict'
  >
  cells: readonly { state: string }[]
  done: number
  floor: number
  skip: number
  fail: number
  empty: number
  expected: number
  hit: boolean | null
  graceUsed: number
  extra: number
  reasons: Record<string, number>
}

/** A recap row as a LifeHabit; `label` turns a stored reason into its display label. */
export function toLifeHabit(r: HabitRecapLike, label: (reason: string) => string = (s) => s): LifeHabit {
  const h = r.habit
  const avoid = h.direction === 'avoid'
  const future = r.cells.filter((c) => c.state === 'future').length
  return {
    id: h.id,
    emoji: h.emoji,
    name: h.name,
    avoid,
    engine: isEngineKey(h.engine) ? h.engine : null,
    target: h.target ?? 7,
    ...(avoid ? { grace: h.grace ?? 0 } : {}),
    ...(h.kind === 'experiment'
      ? {
          experiment: {
            month: h.cycleStart ? h.cycleStart.slice(0, 7) : null,
            start: h.cycleStart ?? null,
            end: h.cycleEnd ?? null,
            verdict: h.verdict ?? null,
          },
        }
      : {}),
    done: r.done,
    floor: r.floor,
    skip: r.skip,
    fail: r.fail,
    empty: r.empty,
    ...(future ? { future } : {}),
    expected: r.expected,
    hit: r.hit,
    graceUsed: r.graceUsed,
    extra: r.extra,
    reasons: Object.fromEntries(Object.entries(r.reasons).map(([k, n]) => [label(k), n])),
  }
}

/** The tag shown next to a habit's name: its engine, and the experiment month if any. */
export function habitTag(h: Pick<LifeHabit, 'engine' | 'experiment'>): string {
  const parts = [h.engine ? engineLabel(h.engine) : 'no engine']
  if (h.experiment) {
    const e = h.experiment
    parts.push(`experiment${e.month ? ` for ${e.month}` : ''}${e.verdict ? `, verdict ${e.verdict}` : ''}`)
  }
  return `[${parts.join(' · ')}]`
}

/** "📖 Read [Mind]" / "🚭 X (don't) [Physical Health · experiment for 2026-11]". */
export function habitName(h: LifeHabit): string {
  return `${h.emoji} ${h.name}${h.avoid ? " (don't)" : ''} ${habitTag(h)}`
}

export function habitVerdict(h: Pick<LifeHabit, 'hit'>): string {
  return h.hit === null ? 'not started' : h.hit ? 'target hit' : 'target missed'
}

function reasonsText(h: LifeHabit): string {
  return Object.entries(h.reasons)
    .map(([r, n]) => `${r} x${n}`)
    .join(', ')
}

/** The weekly target as words: "target 5/week" or, for a "don't" habit, its slip limit. */
function targetText(h: LifeHabit): string {
  if (h.avoid) return `limit ${h.grace ?? 0} slip${h.grace === 1 ? '' : 's'}/week`
  return `target ${h.target ?? 7}/week`
}

/** One habit over a week, for the week export's `## Habits` section. */
export function weekHabitLine(h: LifeHabit): string {
  const parts = [
    `${h.done} done${h.floor ? ` (${h.floor} floor)` : ''}`,
    `${h.skip} rest`,
    `${h.fail} ${h.avoid ? 'slipped' : 'missed'}${h.graceUsed ? ` (${h.graceUsed} within grace)` : ''}`,
    `${h.empty} unmarked`,
  ]
  if (h.future) parts.push(`${h.future} to come`)
  const reasons = reasonsText(h)
  return `- ${habitName(h)}: ${parts.join(', ')} of 7 days; ${targetText(h)} (${h.expected} expected): ${h.hit === null ? 'not started' : h.hit ? 'hit' : 'missed'}${h.extra ? (h.avoid ? `; ${h.extra} slips past the limit` : `; ${h.extra} extra beyond the goal`) : ''}${reasons ? `; reasons: ${reasons}` : ''}`
}

/** One habit over a month, for the month export's `## Habits` section. */
export function monthHabitLine(h: LifeHabit): string {
  const reasons = reasonsText(h)
  return `- ${habitName(h)}: ${h.done} done${h.floor ? ` (${h.floor} floor)` : ''} of ${h.expected} expected, ${h.skip} rest, ${h.fail} ${h.avoid ? 'slipped' : 'missed'}${h.graceUsed ? ` (${h.graceUsed} within grace)` : ''}, ${h.empty} unmarked${h.extra ? (h.avoid ? `, ${h.extra} slips past the limit (negative overshoot)` : `, ${h.extra} extra beyond the goal`) : ''}; ${habitVerdict(h)}${reasons ? `; reasons: ${reasons}` : ''}`
}

/** A habit's week as a short total: "📖 Read 5/7 hit", "🚭 X 1 slip/limit 1 hit". */
export function weekHabitTotal(h: LifeHabit, partial: boolean): string {
  const count = h.avoid
    ? `${h.fail} slip${h.fail === 1 ? '' : 's'}/limit ${h.grace ?? 0}`
    : `${h.done}/${h.target ?? 7}`
  const verdict = partial ? 'so far' : h.hit === null ? 'not started' : h.hit ? 'hit' : 'missed'
  return `${h.emoji} ${h.name} ${count} ${verdict}`
}

/** The habits as the export JSON carries them. */
export function habitsForJson(habits: readonly LifeHabit[]) {
  return habits.map((h) => ({
    id: h.id ?? null,
    emoji: h.emoji,
    name: h.name,
    engine: h.engine ?? null,
    avoid: h.avoid,
    target: h.target ?? 7,
    ...(h.avoid ? { grace: h.grace ?? 0 } : {}),
    experiment: h.experiment ?? null,
    done: h.done,
    floor: h.floor,
    rest: h.skip,
    missed: h.fail,
    unmarked: h.empty,
    toCome: h.future ?? 0,
    expected: h.expected,
    hit: h.hit,
    graceUsed: h.graceUsed,
    extra: h.extra,
    reasons: h.reasons,
  }))
}

// --- ISO week -------------------------------------------------------------------

/** ISO 8601 week of the week starting on `monday`: { year, week } (the ISO year can differ near New Year). */
export function isoWeek(monday: string): { year: number; week: number } {
  const thursday = addDays(monday, 3)
  const [y, m, d] = thursday.split('-').map(Number) as [number, number, number]
  const t = Date.UTC(y, m - 1, d)
  const jan1 = Date.UTC(y, 0, 1)
  return { year: y, week: Math.floor((t - jan1) / 86_400_000 / 7) + 1 }
}

/** "2026-W47 (16/11)": the ISO week and the Monday as dd/mm. */
export function isoWeekLabel(monday: string): string {
  const { year, week } = isoWeek(monday)
  return `${year}-W${String(week).padStart(2, '0')} (${monday.slice(8, 10)}/${monday.slice(5, 7)})`
}

/** The Mondays whose week starts in the month 'YYYY-MM', up to `upTo` (a day key) when given. */
export function mondaysOf(month: string, upTo?: string): string[] {
  const out: string[] = []
  for (let d = `${month}-01`; d.startsWith(month); d = addDays(d, 1)) {
    if (upTo !== undefined && d > upTo) break
    const [y, m, dd] = d.split('-').map(Number) as [number, number, number]
    if (new Date(Date.UTC(y, m - 1, dd)).getUTCDay() === 1) out.push(d)
  }
  return out
}
