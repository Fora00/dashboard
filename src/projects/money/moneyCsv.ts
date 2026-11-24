import type { MoneyKind } from '../../lib/db'

// Soldi: the CSV written by ~/life/_sync/money-totals.py at every GreenBooks
// sync (~/life/money/data/monthly-totals.csv), parsed and validated. Pure: no
// React, no Dexie, loadable by plain node (scripts/life-money-link.ts uses it).
//
// Header: month,category,kind,amount,budget
//   month    YYYY-MM
//   category GreenBooks name (may contain " | "), trimmed
//   kind     income | spend | oneoff | pass | auto (pass = loans/refunds, never income
//            or spend; auto = income or spend by the sign of the category's total
//            over the period shown, see moneyStats.ts)
//   amount   signed euros, at most 2 decimals (+ in, - out)
//   budget   that month's limit, signed like amount, empty when none
// Amounts become integer cents (string arithmetic, no float rounding).
// Invalid rows are reported, never clipped or skipped.

export const MONEY_KINDS = ['income', 'spend', 'oneoff', 'pass', 'auto'] as const satisfies readonly MoneyKind[]
export const MONEY_HEADER = ['month', 'category', 'kind', 'amount', 'budget'] as const
/** Longest category name. MUST match the CHECK in supabase/migrations/20261124120000_money_totals.sql. */
export const MAX_CATEGORY_LENGTH = 100
/** Largest |amount| or |budget| in cents (1 billion euros). MUST match the migration's CHECK. */
export const MAX_ABS_CENTS = 100_000_000_000
/** Rows per month: a sanity cap well above any real GreenBooks setup. */
export const MAX_ROWS_PER_MONTH = 300

/** One month's total for one category (amount and budget in cents). */
export interface MoneyLine {
  month: string
  category: string
  kind: MoneyKind
  amount: number
  budget: number | null
}

export type ParseResult = { ok: true; lines: MoneyLine[] } | { ok: false; errors: string[] }

const MONTH_RE = /^\d{4}-(0[1-9]|1[0-2])$/
const AMOUNT_RE = /^(-?)(\d+)(?:\.(\d{1,2}))?$/

export function isMonthKey(v: unknown): v is string {
  return typeof v === 'string' && MONTH_RE.test(v)
}

export function isMoneyKind(v: unknown): v is MoneyKind {
  return typeof v === 'string' && (MONEY_KINDS as readonly string[]).includes(v)
}

/** "-12.3" → -1230 cents; null when it is not a plain decimal with at most 2 decimals. */
export function parseCents(text: string): number | null {
  const m = AMOUNT_RE.exec(text.trim())
  if (!m) return null
  const cents = Number(m[2]) * 100 + Number((m[3] ?? '').padEnd(2, '0'))
  if (!Number.isSafeInteger(cents)) return null
  return m[1] === '-' && cents !== 0 ? -cents : cents
}

/** The month+category key every row is unique by. */
export function lineKey(month: string, category: string): string {
  return `${month}:${category}`
}

/** RFC 4180 fields of one CSV text: quoted fields may hold commas, quotes ("") and newlines. */
export function splitCsv(text: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let quoted = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]!
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"'
        i++
      } else if (c === '"') quoted = false
      else field += c
    } else if (c === '"' && field === '') quoted = true
    else if (c === ',') {
      row.push(field)
      field = ''
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++
      row.push(field)
      rows.push(row)
      row = []
      field = ''
    } else field += c
  }
  if (field !== '' || row.length > 0) {
    row.push(field)
    rows.push(row)
  }
  return rows.filter((r) => !(r.length === 1 && r[0]!.trim() === ''))
}

/** Validate one already-split line (shared by the CSV and the link payload). */
export function validateLine(
  raw: { month: unknown; category: unknown; kind: unknown; amount: unknown; budget: unknown },
  p: string,
  err: (m: string) => void,
): MoneyLine | null {
  let ok = true
  const bad = (m: string) => {
    err(`${p}: ${m}`)
    ok = false
  }
  if (!isMonthKey(raw.month)) bad(`month "${String(raw.month)}" must be YYYY-MM`)
  const category = typeof raw.category === 'string' ? raw.category.trim() : ''
  if (!category) bad('category is empty')
  else if (category.length > MAX_CATEGORY_LENGTH)
    bad(`category is too long (${category.length} characters, max ${MAX_CATEGORY_LENGTH})`)
  if (!isMoneyKind(raw.kind)) bad(`kind "${String(raw.kind)}" must be one of ${MONEY_KINDS.join(', ')}`)
  const amount = typeof raw.amount === 'number' ? raw.amount : null
  if (amount === null || !Number.isSafeInteger(amount) || Math.abs(amount) > MAX_ABS_CENTS)
    bad(`amount "${String(raw.amount)}" must be euros with at most 2 decimals`)
  const budget = raw.budget === null ? null : typeof raw.budget === 'number' ? raw.budget : NaN
  if (budget !== null && (!Number.isSafeInteger(budget) || Math.abs(budget) > MAX_ABS_CENTS))
    bad(`budget "${String(raw.budget)}" must be empty or euros with at most 2 decimals`)
  if (!ok) return null
  return { month: raw.month as string, category, kind: raw.kind as MoneyKind, amount: amount!, budget }
}

/** Check uniqueness (month+category) and the per-month cap over validated lines. */
export function checkLines(lines: readonly MoneyLine[], err: (m: string) => void): void {
  const seen = new Set<string>()
  const perMonth = new Map<string, number>()
  for (const l of lines) {
    const k = lineKey(l.month, l.category)
    if (seen.has(k)) err(`${l.month} "${l.category}" appears twice`)
    seen.add(k)
    perMonth.set(l.month, (perMonth.get(l.month) ?? 0) + 1)
  }
  for (const [m, n] of perMonth) if (n > MAX_ROWS_PER_MONTH) err(`${m} has ${n} rows (max ${MAX_ROWS_PER_MONTH})`)
}

/** Parse monthly-totals.csv. Lines come back sorted by month, then category. */
export function parseMoneyCsv(text: string): ParseResult {
  const rows = splitCsv(text.replace(/^﻿/, ''))
  const header = rows[0]?.map((h) => h.trim())
  if (!header || header.join(',') !== MONEY_HEADER.join(','))
    return { ok: false, errors: [`The first line must be: ${MONEY_HEADER.join(',')}`] }
  if (rows.length < 2) return { ok: false, errors: ['The CSV has no rows'] }
  const errors: string[] = []
  const err = (m: string) => errors.push(m)
  const lines: MoneyLine[] = []
  rows.slice(1).forEach((cells, i) => {
    const p = `line ${i + 2}`
    if (cells.length !== MONEY_HEADER.length) {
      err(`${p}: ${cells.length} columns, expected ${MONEY_HEADER.length}`)
      return
    }
    const [month, category, kind, amount, budget] = cells.map((c) => c.trim()) as [
      string,
      string,
      string,
      string,
      string,
    ]
    const amountCents = parseCents(amount)
    const budgetCents = budget === '' ? null : parseCents(budget)
    const line = validateLine(
      {
        month,
        category,
        kind,
        amount: amountCents ?? amount,
        budget: budget === '' ? null : (budgetCents ?? budget),
      },
      p,
      err,
    )
    if (line) lines.push(line)
  })
  if (errors.length === 0) checkLines(lines, err)
  if (errors.length > 0) return { ok: false, errors }
  return { ok: true, lines: sortLines(lines) }
}

export function sortLines(lines: MoneyLine[]): MoneyLine[] {
  return lines.sort((a, b) =>
    a.month === b.month ? (a.category < b.category ? -1 : a.category > b.category ? 1 : 0) : a.month < b.month ? -1 : 1,
  )
}
