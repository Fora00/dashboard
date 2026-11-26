import type { Line } from './moneyStats'

// Soldi (MO6): which months the page totals, and what it compares them with.
// A period is a run of whole months, 'YYYY-MM' inclusive on both ends, so it
// can cross a year end. Pure: the page keeps a Selection in state and resolves
// it against the months that have data.

export interface Period {
  from: string
  to: string
}

export type PeriodMode = 'year' | 'range' | 'last' | 'month'
export type CompareMode = 'yoy' | 'prev' | 'custom' | 'avg' | 'none'
export const LAST_OPTIONS = [3, 6, 12] as const
export type LastN = (typeof LAST_OPTIONS)[number]

export interface Selection {
  mode: PeriodMode
  /** mode 'year'. */
  year: number
  /** mode 'range'. */
  from: string
  to: string
  /** mode 'last'. */
  last: LastN
  /** mode 'month'. */
  month: string
  compare: CompareMode
  /** compare 'custom': first month of the compare period (same length as the period). */
  compareStart: string
}

/** What the period is compared with: lines to total and a factor to apply (avg only). */
export interface Comparison {
  mode: Exclude<CompareMode, 'none'>
  /** Long label for titles: "gen–nov 2025", "media mensile (30 mesi)". */
  label: string
  /** Short label beside a value: "2025", "ago–ott 25", "media". */
  short: string
  /** The compare months (null for avg). */
  period: Period | null
  lines: Line[]
  /** 1 for a period; for avg, period length / months of history. */
  scale: number
  /** Months of the compare period with data (for avg: months of history). */
  covered: number
  /** Months the compare should cover (the period's length). */
  length: number
}

// --- Months -----------------------------------------------------------------------

export const MONTHS_IT = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'] as const

/** The lines inside the period. */
export function periodLines<T extends { month: string }>(lines: readonly T[], p: Period): T[] {
  return lines.filter((l) => l.month >= p.from && l.month <= p.to)
}

/** How many different months the lines touch. */
export const distinctMonths = (lines: readonly { month: string }[]) => new Set(lines.map((l) => l.month)).size

const index = (m: string) => Number(m.slice(0, 4)) * 12 + Number(m.slice(5, 7)) - 1
const fromIndex = (i: number) => `${Math.floor(i / 12)}-${String((i % 12) + 1).padStart(2, '0')}`

export const addMonths = (m: string, n: number) => fromIndex(index(m) + n)
export const lengthOf = (p: Period) => index(p.to) - index(p.from) + 1
export const shift = (p: Period, n: number): Period => ({ from: addMonths(p.from, n), to: addMonths(p.to, n) })

export function monthsIn(p: Period): string[] {
  const out: string[] = []
  for (let i = index(p.from); i <= index(p.to); i++) out.push(fromIndex(i))
  return out
}

/** Every month from the oldest to the newest with data, gaps included, oldest first. */
export function availableMonths(lines: readonly Line[]): string[] {
  if (lines.length === 0) return []
  let lo = lines[0]!.month
  let hi = lo
  for (const l of lines) {
    if (l.month < lo) lo = l.month
    if (l.month > hi) hi = l.month
  }
  return monthsIn({ from: lo, to: hi })
}

/** The calendar month today ('YYYY-MM'), the one still filling up until the next import. */
export function currentMonth(now = new Date()): string {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

const yearOf = (m: string) => Number(m.slice(0, 4))
const name = (m: string) => MONTHS_IT[Number(m.slice(5, 7)) - 1]!
const yy = (m: string) => m.slice(2, 4)

/** "nov 2026". */
export const monthLabel = (m: string) => `${name(m)} ${yearOf(m)}`

/** "2026", "gen–nov 2026", "ott 2026", "set 2025 – feb 2026". */
export function periodLabel(p: Period): string {
  if (p.from === p.to) return monthLabel(p.from)
  if (yearOf(p.from) !== yearOf(p.to)) return `${monthLabel(p.from)} – ${monthLabel(p.to)}`
  if (name(p.from) === 'gen' && name(p.to) === 'dic') return String(yearOf(p.from))
  return `${name(p.from)}–${name(p.to)} ${yearOf(p.from)}`
}

/** Short, to sit beside a value: "2025" (a year from January), "ott 25", "ago–ott 25", "nov 24–gen 25". */
export function shortLabel(p: Period): string {
  if (p.from === p.to) return `${name(p.from)} ${yy(p.from)}`
  if (yearOf(p.from) !== yearOf(p.to)) return `${name(p.from)} ${yy(p.from)}–${name(p.to)} ${yy(p.to)}`
  if (name(p.from) === 'gen') return String(yearOf(p.from))
  return `${name(p.from)}–${name(p.to)} ${yy(p.from)}`
}

// --- Selection ----------------------------------------------------------------------

/** The page's first view: the newest year to date, against the same months a year before. */
export function defaultSelection(months: readonly string[]): Selection {
  const newest = months[months.length - 1]!
  return {
    mode: 'year',
    year: yearOf(newest),
    from: addMonths(newest, -2) < months[0]! ? months[0]! : addMonths(newest, -2),
    to: newest,
    last: 3,
    month: newest,
    compare: 'yoy',
    compareStart: addMonths(`${yearOf(newest)}-01`, -12),
  }
}

const clamp = (m: string, months: readonly string[]) =>
  m < months[0]! ? months[0]! : m > months[months.length - 1]! ? months[months.length - 1]! : m

/**
 * The months the selection covers, kept inside the data: a year stops at the
 * newest month (year to date), "last N" never starts before the oldest, a
 * range is put in order. `months` is availableMonths(), non-empty.
 */
export function resolvePeriod(sel: Selection, months: readonly string[]): Period {
  const newest = months[months.length - 1]!
  switch (sel.mode) {
    case 'year': {
      const years = new Set(months.map(yearOf))
      const y = years.has(sel.year) ? sel.year : yearOf(newest)
      const to = `${y}-12`
      return { from: `${y}-01`, to: to > newest ? newest : to }
    }
    case 'range': {
      const a = clamp(sel.from, months)
      const b = clamp(sel.to, months)
      return a <= b ? { from: a, to: b } : { from: b, to: a }
    }
    case 'last':
      return { from: clamp(addMonths(newest, 1 - sel.last), months), to: newest }
    case 'month': {
      const m = clamp(sel.month, months)
      return { from: m, to: m }
    }
  }
}

/** What `period` is compared with, or null for none. `lines` are all the lines the page shows. */
export function resolveComparison(sel: Selection, period: Period, lines: readonly Line[]): Comparison | null {
  const length = lengthOf(period)
  const ofPeriod = (mode: 'yoy' | 'prev' | 'custom', p: Period): Comparison => {
    const ls = periodLines(lines, p)
    return {
      mode,
      label: periodLabel(p),
      short: shortLabel(p),
      period: p,
      lines: ls,
      scale: 1,
      covered: distinctMonths(ls),
      length,
    }
  }
  switch (sel.compare) {
    case 'none':
      return null
    case 'yoy':
      return ofPeriod('yoy', shift(period, -12))
    case 'prev':
      return ofPeriod('prev', shift(period, -length))
    case 'custom': {
      const from = sel.mode === 'year' ? `${yearOf(sel.compareStart)}-01` : sel.compareStart
      return ofPeriod('custom', { from, to: addMonths(from, length - 1) })
    }
    case 'avg': {
      const n = distinctMonths(lines)
      return {
        mode: 'avg',
        label: `media mensile storica (${n} ${n === 1 ? 'mese' : 'mesi'})${length > 1 ? ` × ${length}` : ''}`,
        short: 'media',
        period: null,
        lines: [...lines],
        scale: n === 0 ? 0 : length / n,
        covered: n,
        length,
      }
    }
  }
}
