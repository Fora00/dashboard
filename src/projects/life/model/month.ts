import type { LifeEntry, LifePlan, LifeStreakEntry } from '../../../lib/db'
import { addDays, parseDayKey, weekKey } from './dates.ts'
import { summarizeWeek } from './summary.ts'
import { isStreak } from './streaks.ts'

// --- Month check (read-only) ---------------------------------------------------
// What a month said about each habit, from data the app already holds: the
// Streaks 28-day strips (calendar days) and the trackers of the plans whose
// Monday falls in the month. Pure; the Month view only renders it.

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
export function addMonths(month: string, n: number): string {
  const d = new Date(Number(month.slice(0, 4)), Number(month.slice(5, 7)) - 1 + n, 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

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

export interface MonthStreak {
  name: string
  emoji?: string
  done: number
  missed: number
  /** done / (done + missed); null with no verdict in the month. */
  share: number | null
  reading: Reading | null
  weeks: MonthWeekBar[]
  /** A done right after a missed day, in the month. */
  returns: number
  /** First day of the month the strip covers (later than day 1 when the strip is 28 days). */
  from: string
  streak: number
  best?: number
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
  streaks: MonthStreak[]
  trackers: MonthTracker[]
  /** Habits (Streaks and trackers) by reading. */
  counts: Record<Reading, number>
}

function streakOfMonth(e: LifeStreakEntry, first: string, upTo: string): MonthStreak {
  const { days, asOf } = e.value
  const n = days.length
  const perWeek = new Map<string, { d: number; m: number }>()
  let done = 0
  let missed = 0
  let returns = 0
  let prev = ''
  for (let i = 0; i < n; i++) {
    const day = addDays(asOf, i - (n - 1))
    if (day < first || day > upTo) continue
    const c = days[i]
    if (c !== 'd' && c !== 'm') continue
    if (c === 'd') {
      done++
      if (prev === 'm') returns++
    } else missed++
    prev = c
    const wk = weekKey(parseDayKey(day))
    const cur = perWeek.get(wk) ?? { d: 0, m: 0 }
    cur[c]++
    perWeek.set(wk, cur)
  }
  const share = done + missed > 0 ? done / (done + missed) : null
  return {
    name: e.value.name,
    ...(e.value.emoji ? { emoji: e.value.emoji } : {}),
    done,
    missed,
    share,
    reading: share === null ? null : readShare(share),
    weeks: [...perWeek].sort(([a], [b]) => (a < b ? -1 : 1)).map(([week, { d, m }]) => ({ week, done: d, of: d + m })),
    returns,
    from: coveredFrom(asOf, n, first),
    streak: e.value.streak,
    ...(e.value.best !== undefined ? { best: e.value.best } : {}),
  }
}

/** First day of the month the strip covers: day 1, or the strip's first day when it starts later. */
function coveredFrom(asOf: string, n: number, first: string): string {
  const start = addDays(asOf, -(n - 1))
  return start > first ? start : first
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
  const { first, last } = monthRange(month)
  const upTo = today < last ? today : last
  const streaks = entries
    .filter(isStreak)
    .map((e) => streakOfMonth(e, first, upTo))
    .filter((s) => s.done + s.missed > 0)
    .sort((a, b) => (a.share ?? 0) - (b.share ?? 0))
  const trackers = trackersOfMonth(month, plans, entries, today)
  const counts: Record<Reading, number> = { kept: 0, half: 0, few: 0 }
  for (const r of [...streaks, ...trackers]) if (r.reading) counts[r.reading]++
  return { month, upTo, partial: upTo < last, streaks, trackers, counts }
}

const pct = (n: number | null) => (n === null ? 'n/a' : `${n}%`)

/**
 * The month as Markdown for the `/month` analysis (read back with pbpaste, like
 * the week export): the progress lines against the previous month, every
 * Streaks habit and tracker with its weeks, and the Spock reasons. Numbers and
 * the owner's own reasons only.
 */
export function buildMonthMarkdown(
  report: MonthReport,
  lines: readonly { label: string; now: number | null; before: number | null }[],
): string {
  const out = [
    `# Life month ${report.month}`,
    '',
    `Covers ${report.month}-01 to ${report.upTo}${report.partial ? ' (month not over)' : ''}. Streaks: days with a verdict, rest days skipped. Trackers: weeks starting in the month.`,
    '',
    '## Progress lines (mean over the weeks, vs the previous month)',
    ...lines.map((l) => `- ${l.label}: ${pct(l.now)} (before: ${pct(l.before)})`),
    '',
    '## Streaks habits',
  ]
  for (const s of report.streaks) {
    const weeks = s.weeks.map((w) => `${w.week} ${w.done}/${w.of}`).join(', ')
    out.push(
      `- ${s.name}: ${s.done} of ${s.done + s.missed} days (${s.reading ?? 'n/a'}), returns ${s.returns}, streak ${s.streak}${s.best !== undefined ? ` (best ${s.best})` : ''}, counted from ${s.from}; weeks: ${weeks}`,
    )
  }
  if (report.streaks.length === 0) out.push('- none')
  out.push('', '## Trackers')
  for (const t of report.trackers) {
    const weeks = t.weeks.map((w) => `${w.week} ${w.total}${w.target ? `/${w.target}` : ''}`).join(', ')
    out.push(
      `- ${t.emoji} ${t.label}: ${t.total} in all${t.withTarget ? `, target hit ${t.hit} of ${t.withTarget} weeks (${t.reading})` : ''}; weeks: ${weeks}`,
    )
    for (const w of t.weeks) if (w.why) out.push(`  - why, week ${w.week}: ${w.why}`)
  }
  if (report.trackers.length === 0) out.push('- none')
  return out.join('\n') + '\n'
}
