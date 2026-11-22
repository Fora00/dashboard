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

/** One limited app in one week of a measured habit (habits/habitMeasure.ts AppWeek). */
export interface MeasuredAppLike {
  app: string
  /** Daily limit, minutes. */
  limit: number
  /** Minutes that week; null = not in the top apps entered (no evidence). */
  weekly: number | null
  allowed: number
  extensions: number
}

/** One week of a measured habit (habits/habitRecapData.ts MeasuredWeek). */
export interface MeasuredWeekLike {
  week: string
  manual: number
  evidence: { verified: number; apps: readonly MeasuredAppLike[]; missing: readonly string[] } | null
  slips: number | null
  hit: boolean | null
}

/** A measured habit over the period (habits/habitRecapData.ts MeasuredRecap). */
export interface MeasuredLike {
  kind: 'app-limits'
  limits: readonly { app: string; minutes: number }[]
  weeks: readonly MeasuredWeekLike[]
  manual: number
  verified: number
  verifiedWeeks: number
  hitWeeks: number
  unverifiedWeeks: number
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
  /** Measured ("complex") habits: checked against data; `hit` is then the measured verdict (null = unverified). */
  measured?: MeasuredLike
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
    | 'measure'
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
  measured?: MeasuredLike | undefined
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
    ...(r.measured && h.measure ? { measured: r.measured } : {}),
  }
}

/** The tag shown next to a habit's name: its engine, "complex" when measured, and the experiment month if any. */
export function habitTag(h: Pick<LifeHabit, 'engine' | 'experiment' | 'measured'>): string {
  const parts = [h.engine ? engineLabel(h.engine) : 'no engine']
  if (h.measured) parts.push('complex: app limits')
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

export function habitVerdict(h: Pick<LifeHabit, 'hit' | 'measured'>): string {
  if (h.hit === null) return h.measured ? 'unverified (no top apps entered)' : 'not started'
  return h.hit ? 'target hit' : 'target missed'
}

/** "App A 325m vs 280m allowed: +3; App B not in the top apps (no evidence)". */
function appsText(apps: readonly MeasuredAppLike[], onlyOver = false): string {
  return apps
    .filter((a) => !onlyOver || a.extensions > 0)
    .map((a) =>
      a.weekly === null
        ? `${a.app} not in the top apps (no evidence)`
        : `${a.app} ${a.weekly}m vs ${a.allowed}m allowed (7 x ${a.limit}m)${a.extensions ? `: +${a.extensions}` : ''}`,
    )
    .join('; ')
}

/** The measured part of a week line: ticked vs proven vs counted, or why it is unverified. */
function measuredWeekText(m: MeasuredWeekLike): string {
  if (!m.evidence) return `measured: unverified (no top apps entered); ${m.manual} slips ticked`
  return `measured: ${m.manual} slips ticked, verified at least ${m.evidence.verified} extensions, counted ${m.slips ?? m.manual} (${appsText(m.evidence.apps)})`
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
  const m = h.measured?.weeks[0]
  return `- ${habitName(h)}: ${parts.join(', ')} of 7 days; ${targetText(h)} (${h.expected} expected): ${h.hit === null ? (h.measured ? 'unverified' : 'not started') : h.hit ? 'hit' : 'missed'}${m ? `; ${measuredWeekText(m)}` : ''}${h.extra ? (h.avoid ? `; ${h.extra} slips past the limit` : `; ${h.extra} extra beyond the goal`) : ''}${reasons ? `; reasons: ${reasons}` : ''}`
}

/** One habit over a month, for the month export's `## Habits` section. */
export function monthHabitLine(h: LifeHabit): string {
  const reasons = reasonsText(h)
  return `- ${habitName(h)}: ${h.done} done${h.floor ? ` (${h.floor} floor)` : ''} of ${h.expected} expected, ${h.skip} rest, ${h.fail} ${h.avoid ? 'slipped' : 'missed'}${h.graceUsed ? ` (${h.graceUsed} within grace)` : ''}, ${h.empty} unmarked${h.extra ? (h.avoid ? `, ${h.extra} slips past the limit (negative overshoot)` : `, ${h.extra} extra beyond the goal`) : ''}; ${habitVerdict(h)}${h.measured ? `; ${measuredMonthText(h.measured)}` : ''}${reasons ? `; reasons: ${reasons}` : ''}`
}

/** The measured part of a month line: weeks hit / verified, unverified apart, and the weeks over a limit. */
function measuredMonthText(m: MeasuredLike): string {
  const over = m.weeks
    .filter((w) => w.evidence && w.evidence.verified > 0)
    .map((w) => `${isoWeekLabel(w.week)} ${appsText(w.evidence!.apps, true)}`)
  return `measured weeks: ${m.hitWeeks} hit of ${m.verifiedWeeks} verified${m.unverifiedWeeks ? `, ${m.unverifiedWeeks} unverified (no top apps entered)` : ''}; ${m.manual} slips ticked, verified at least ${m.verified} extensions${over.length ? `; over the limit: ${over.join(' | ')}` : ''}`
}

/** A habit's week as a short total: "📖 Read 5/7 hit", "🚭 X 1 slip/limit 1 hit". */
export function weekHabitTotal(h: LifeHabit, partial: boolean): string {
  const m = h.measured?.weeks[0]
  const slips = m ? (m.slips ?? m.manual) : h.fail
  const count = h.avoid
    ? `${slips} slip${slips === 1 ? '' : 's'}${m?.evidence ? ` (at least ${m.evidence.verified} verified)` : ''}/limit ${h.grace ?? 0}`
    : `${h.done}/${h.target ?? 7}`
  const verdict =
    m && !m.evidence ? 'unverified' : partial ? 'so far' : h.hit === null ? 'not started' : h.hit ? 'hit' : 'missed'
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
    ...(h.measured
      ? {
          measure: {
            kind: h.measured.kind,
            limits: h.measured.limits,
            slipsTicked: h.measured.manual,
            verifiedMin: h.measured.verified,
            weeksVerified: h.measured.verifiedWeeks,
            weeksHit: h.measured.hitWeeks,
            weeksUnverified: h.measured.unverifiedWeeks,
            weeks: h.measured.weeks.map((w) => ({
              week: w.week,
              slipsTicked: w.manual,
              verified: w.evidence !== null,
              verifiedMin: w.evidence?.verified ?? null,
              counted: w.slips,
              hit: w.hit,
              apps: w.evidence?.apps ?? [],
            })),
          },
        }
      : {}),
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
