import type { BalanceGroup } from '../../lib/db'
import { MAX_ABS_CENTS, MAX_CATEGORY_LENGTH, isMonthKey, lineKey, parseCents, splitCsv } from './moneyCsv.ts'

// Soldi Patrimonio (MO17): the CSV written by ~/life/_sync/money-balances.py at
// every GreenBooks sync (~/life/money/data/account-balances.csv), parsed and
// validated. Pure: no React, no Dexie, loadable by plain node
// (scripts/life-money-balances-link.ts uses it).
//
// Header: month,account,group,balance
//   month    YYYY-MM
//   account  GreenBooks account name (may contain spaces), trimmed
//   group    liquidita | risparmi | investimenti
//   balance  the account's balance at the end of the month, signed euros with
//            at most 2 decimals (investments: what went in, not market value)
// Balances become integer cents (string arithmetic, no float rounding).
// Invalid rows are reported, never clipped or skipped.

export const BALANCE_GROUPS = ['liquidita', 'risparmi', 'investimenti'] as const satisfies readonly BalanceGroup[]
export const BALANCES_HEADER = ['month', 'account', 'group', 'balance'] as const
/** Longest account name: same cap as a category. MUST match the CHECK in 20261126160000_money_balances.sql. */
export const MAX_ACCOUNT_LENGTH = MAX_CATEGORY_LENGTH
/** Accounts per month: a sanity cap well above any real GreenBooks setup. */
export const MAX_ACCOUNTS_PER_MONTH = 200

/** One account's balance at the end of one month (cents). */
export interface BalanceLine {
  month: string
  account: string
  group: BalanceGroup
  balance: number
}

export type BalancesParseResult = { ok: true; lines: BalanceLine[] } | { ok: false; errors: string[] }

export function isBalanceGroup(v: unknown): v is BalanceGroup {
  return typeof v === 'string' && (BALANCE_GROUPS as readonly string[]).includes(v)
}

/** The month+account key every row is unique by (also the row id). */
export const balanceKey = (month: string, account: string): string => lineKey(month, account)

/** Validate one already-split line (shared by the CSV and the link payload). */
export function validateBalanceLine(
  raw: { month: unknown; account: unknown; group: unknown; balance: unknown },
  p: string,
  err: (m: string) => void,
): BalanceLine | null {
  let ok = true
  const bad = (m: string) => {
    err(`${p}: ${m}`)
    ok = false
  }
  if (!isMonthKey(raw.month)) bad(`month "${String(raw.month)}" must be YYYY-MM`)
  const account = typeof raw.account === 'string' ? raw.account.trim() : ''
  if (!account) bad('account is empty')
  else if (account.length > MAX_ACCOUNT_LENGTH)
    bad(`account is too long (${account.length} characters, max ${MAX_ACCOUNT_LENGTH})`)
  if (!isBalanceGroup(raw.group)) bad(`group "${String(raw.group)}" must be one of ${BALANCE_GROUPS.join(', ')}`)
  const balance = typeof raw.balance === 'number' ? raw.balance : null
  if (balance === null || !Number.isSafeInteger(balance) || Math.abs(balance) > MAX_ABS_CENTS)
    bad(`balance "${String(raw.balance)}" must be euros with at most 2 decimals`)
  if (!ok) return null
  return { month: raw.month as string, account, group: raw.group as BalanceGroup, balance: balance! }
}

/** Check uniqueness (month+account) and the per-month cap over validated lines. */
export function checkBalanceLines(lines: readonly BalanceLine[], err: (m: string) => void): void {
  const seen = new Set<string>()
  const perMonth = new Map<string, number>()
  for (const l of lines) {
    const k = balanceKey(l.month, l.account)
    if (seen.has(k)) err(`${l.month} "${l.account}" appears twice`)
    seen.add(k)
    perMonth.set(l.month, (perMonth.get(l.month) ?? 0) + 1)
  }
  for (const [m, n] of perMonth)
    if (n > MAX_ACCOUNTS_PER_MONTH) err(`${m} has ${n} accounts (max ${MAX_ACCOUNTS_PER_MONTH})`)
}

/** Parse account-balances.csv. Lines come back sorted by month, then account. */
export function parseBalancesCsv(text: string): BalancesParseResult {
  const rows = splitCsv(text.replace(/^﻿/, ''))
  const header = rows[0]?.map((h) => h.trim())
  if (!header || header.join(',') !== BALANCES_HEADER.join(','))
    return { ok: false, errors: [`The first line must be: ${BALANCES_HEADER.join(',')}`] }
  if (rows.length < 2) return { ok: false, errors: ['The CSV has no rows'] }
  const errors: string[] = []
  const err = (m: string) => errors.push(m)
  const lines: BalanceLine[] = []
  rows.slice(1).forEach((cells, i) => {
    const p = `line ${i + 2}`
    if (cells.length !== BALANCES_HEADER.length) {
      err(`${p}: ${cells.length} columns, expected ${BALANCES_HEADER.length}`)
      return
    }
    const [month, account, group, balance] = cells.map((c) => c.trim()) as [string, string, string, string]
    const line = validateBalanceLine({ month, account, group, balance: parseCents(balance) ?? balance }, p, err)
    if (line) lines.push(line)
  })
  if (errors.length === 0) checkBalanceLines(lines, err)
  if (errors.length > 0) return { ok: false, errors }
  return { ok: true, lines: sortBalanceLines(lines) }
}

export function sortBalanceLines<T extends BalanceLine>(lines: T[]): T[] {
  return lines.sort((a, b) =>
    a.month === b.month ? (a.account < b.account ? -1 : a.account > b.account ? 1 : 0) : a.month < b.month ? -1 : 1,
  )
}

// --- What changed since the last link (MO16's --changed, for balances) --------

const rowKey = (l: BalanceLine) => `${l.account}\u0000${l.group}\u0000${l.balance}`

function byMonth(lines: readonly BalanceLine[]): Map<string, string> {
  const m = new Map<string, string[]>()
  for (const l of lines) {
    const list = m.get(l.month) ?? []
    list.push(rowKey(l))
    m.set(l.month, list)
  }
  return new Map([...m].map(([month, rows]) => [month, rows.sort().join('\n')]))
}

/** Months whose balances differ (added, changed, or gone), oldest first. */
export function changedBalanceMonths(before: readonly BalanceLine[], after: readonly BalanceLine[]): string[] {
  const a = byMonth(before)
  const b = byMonth(after)
  const months = new Set([...a.keys(), ...b.keys()])
  return [...months].filter((m) => a.get(m) !== b.get(m)).sort()
}
