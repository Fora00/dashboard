import { describe, expect, it } from 'vitest'
import type { MoneyLine } from './moneyCsv'
import { changedMonths } from './moneyChanged'

// Invented categories and figures only.
const L = (month: string, category: string, amount: number, budget: number | null = null): MoneyLine => ({
  month,
  category,
  kind: 'auto',
  amount,
  budget,
})

describe('changedMonths (MO16)', () => {
  const base = [L('2026-09', 'Food', -100), L('2026-10', 'Food', -200), L('2026-10', 'Pay', 1000)]

  it('nothing changed, in any row order', () => {
    expect(changedMonths(base, [...base].reverse())).toEqual([])
  })

  it('a changed amount or budget, a new row, a new month, a gone month', () => {
    expect(
      changedMonths(base, [L('2026-09', 'Food', -100), L('2026-10', 'Food', -250), L('2026-10', 'Pay', 1000)]),
    ).toEqual(['2026-10'])
    expect(changedMonths(base, [L('2026-09', 'Food', -100, -150), ...base.slice(1)])).toEqual(['2026-09'])
    expect(changedMonths(base, [...base, L('2026-11', 'Food', -10)])).toEqual(['2026-11'])
    expect(changedMonths(base, base.slice(1))).toEqual(['2026-09'])
    // First run: no snapshot, every month is new.
    expect(changedMonths([], base)).toEqual(['2026-09', '2026-10'])
  })
})
