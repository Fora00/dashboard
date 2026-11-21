import type { LifeEntry, LifePlan } from '../../../lib/db'
import { shiftMonth } from '../../../lib/dates.ts'
import { summarizeWeek } from './summary.ts'
import { isoWeekLabel, monthHabitLine, weekHabitTotal, type LifeHabit } from './habits.ts'

// --- Month check (read-only) ---------------------------------------------------
// What a month said about each habit, from data the app already holds: the
// trackers of the plans whose Monday falls in the month. Pure; the Month view only renders it.

/** 'YYYY-MM' of a day key. */
export function monthOf(day: string): string {
  return day.slice(0, 7)
}

/** First and last day key of a 'YYYY-MM'. */
export function monthRange(month: string): { first: string; last: string } {
  const y = Number(month.slice(0, 4))
  const m = Number(month.slice(5, 7))
  const days = new Date(y, m, 0).getDate()
  return { first: `${month}-01`, last: `${month}-${String(days).padStart(2, '0')}` }
}

/** 'YYYY-MM' shifted by n months. */
export const addMonths = shiftMonth

/** How a share of kept days reads: words, never red/green verdicts. */
export type Reading = 'kept' | 'half' | 'few'

export function readShare(share: number): Reading {
  return share >= 0.8 ? 'kept' : share >= 0.5 ? 'half' : 'few'
}

export interface MonthWeekBar {
  /** Monday of the week. */
  week: string
  done: number
  /** Days of the week in the month, up to today, with a verdict ('d' or 'm'). */
  of: number
}

export interface MonthTrackerWeek {
  week: string
  total: number
  target: number | null
  /** The Spock-test reason given for missing the target that week. */
  why?: string
}

export interface MonthTracker {
  label: string
  emoji: string
  total: number
  weeks: MonthTrackerWeek[]
  /** Weeks with a target that reached it, and weeks with a target. */
  hit: number
  withTarget: number
  /** Share of weeks with a target that reached it; null without any target. */
  share: number | null
  reading: Reading | null
}

export interface MonthReport {
  month: string
  /** Last day the numbers cover: the month's end, or today in the current month. */
  upTo: string
  partial: boolean
  trackers: MonthTracker[]
  /** Trackers by reading. */
  counts: Record<Reading, number>
}

/** One live Habits-page habit over the month (from the habit recap), for the export. */
export type MonthHabit = LifeHabit

/** One week of the month (its Monday in the month): the habits' totals. */
export interface MonthHabitWeek {
  /** Monday of the week. */
  week: string
  /** The week is not over yet (today falls in it). */
  partial: boolean
  habits: LifeHabit[]
}

/** Plans whose Monday falls in the month, with their entries, summarised per tracker label. */
function trackersOfMonth(
  month: string,
  plans: readonly LifePlan[],
  entries: readonly LifeEntry[],
  today: string,
): MonthTracker[] {
  const byLabel = new Map<string, MonthTracker>()
  for (const plan of [...plans].sort((a, b) => (a.week < b.week ? -1 : 1))) {
    if (monthOf(plan.week) !== month) continue
    const sum = summarizeWeek(plan, entries, today)
    for (const t of sum.trackers) {
      const key = `${t.tracker.emoji} ${t.tracker.label}`
      const cur = byLabel.get(key) ?? {
        label: t.tracker.label,
        emoji: t.tracker.emoji,
        total: 0,
        weeks: [],
        hit: 0,
        withTarget: 0,
        share: null,
        reading: null,
      }
      cur.total += t.total
      const why = sum.whys.get(t.tracker.id)
      cur.weeks.push({ week: plan.week, total: t.total, target: t.tracker.target, ...(why ? { why } : {}) })
      if (t.tracker.target !== null && t.tracker.target > 0) {
        cur.withTarget++
        if (t.total >= t.tracker.target) cur.hit++
      }
      byLabel.set(key, cur)
    }
  }
  return [...byLabel.values()].map((t) => {
    const share = t.withTarget > 0 ? t.hit / t.withTarget : null
    return { ...t, share, reading: share === null ? null : readShare(share) }
  })
}

export function buildMonthReport(
  month: string,
  plans: readonly LifePlan[],
  entries: readonly LifeEntry[],
  today: string,
): MonthReport {
  const { last } = monthRange(month)
  const upTo = today < last ? today : last
  const trackers = trackersOfMonth(month, plans, entries, today)
  const counts: Record<Reading, number> = { kept: 0, half: 0, few: 0 }
  for (const r of trackers) if (r.reading) counts[r.reading]++
  return { month, upTo, partial: upTo < last, trackers, counts }
}

const pct = (n: number | null) => (n === null ? 'n/a' : `${n}%`)

/**
 * The month as Markdown for the `/month` analysis (read back with pbpaste, like
 * the week export): the progress lines against the previous month, every
 * tracker with its weeks, and the Spock reasons. Numbers and
 * the owner's own reasons only.
 */
export function buildMonthMarkdown(
  report: MonthReport,
  lines: readonly { label: string; now: number | null; before: number | null }[],
  habits: readonly MonthHabit[] = [],
  weeks: readonly MonthHabitWeek[] = [],
): string {
  const out = [
    `# Life month ${report.month}`,
    '',
    `Covers ${report.month}-01 to ${report.upTo}${report.partial ? ' (month not over)' : ''}. Trackers: weeks starting in the month.`,
    '',
    '## Progress lines (mean over the weeks, vs the previous month)',
    ...lines.map((l) => `- ${l.label}: ${pct(l.now)} (before: ${pct(l.before)})`),
    '',
    '## Habits (live, from the Habits page)',
  ]
  for (const h of habits) out.push(monthHabitLine(h))
  if (habits.length === 0) out.push('- none')
  out.push('', '## Trackers')
  for (const t of report.trackers) {
    const weeks = t.weeks.map((w) => `${w.week} ${w.total}${w.target ? `/${w.target}` : ''}`).join(', ')
    out.push(
      `- ${t.emoji} ${t.label}: ${t.total} in all${t.withTarget ? `, target hit ${t.hit} of ${t.withTarget} weeks (${t.reading})` : ''}; weeks: ${weeks}`,
    )
    for (const w of t.weeks) if (w.why) out.push(`  - why, week ${w.week}: ${w.why}`)
  }
  if (report.trackers.length === 0) out.push('- none')
  if (weeks.length) {
    // One line per week starting in the month, totals only, to check against the month plan's "Weeks".
    out.push('', '## Weeks (Habits-page totals per week starting in the month)')
    for (const w of weeks)
      out.push(
        `- ${isoWeekLabel(w.week)}${w.partial ? ' (week not over)' : ''}: ${w.habits.map((h) => weekHabitTotal(h, w.partial)).join(' · ') || 'no habits'}`,
      )
  }
  return out.join('\n') + '\n'
}
