import { describe, expect, it } from 'vitest'
import { categoryHistory } from './moneyCategory'
import { availableMonths } from './moneyPeriod'
import type { Line } from './moneyStats'

// Invented categories and figures only.
const L = (
  month: string,
  category: string,
  kind: Line['kind'],
  amount: number,
  budget: number | null = null,
): Line => ({
  month,
  category,
  kind,
  amount,
  budget,
})

describe('categoryHistory (MO14)', () => {
  const lines = [
    L('2025-11', 'Pay', 'income', 100000),
    L('2025-11', 'Food', 'spend', -20000),
    L('2025-11', 'Food', 'spend', 0),
    L('2025-11', 'Rent', 'spend', -60000),
    L('2025-12', 'Pay', 'income', 100000),
    L('2025-12', 'Rent', 'spend', -60000),
    L('2026-01', 'Pay', 'income', 100000),
    L('2026-01', 'Food', 'spend', -36000, -30000),
    L('2026-01', 'Rent', 'spend', -60000),
    L('2026-02', 'Pay', 'income', 100000),
    L('2026-02', 'Food', 'spend', -24000, -30000),
    L('2026-02', 'Rent', 'spend', -60000),
    L('2026-01', 'Gifts', 'auto', 5000),
  ]
  const months = availableMonths(lines)

  it('one value per month of the history, budgets and the months over', () => {
    const h = categoryHistory(lines, 'Food', months)!
    expect(h.direction).toBe('out')
    expect(h.months).toEqual(['2025-11', '2025-12', '2026-01', '2026-02'])
    expect(h.values).toEqual([20000, 0, 36000, 24000])
    expect(h.budgets).toEqual([null, null, 30000, 30000])
    expect(h.overMonths).toEqual(['2026-01'])
  })

  it('year by year: monthly mean, change, share of the recurring spend', () => {
    const h = categoryHistory(lines, 'Food', months)!
    expect(h.years).toEqual([
      { year: 2025, total: 20000, months: 2, perMonth: 10000, change: null, share: 14.3 },
      { year: 2026, total: 60000, months: 2, perMonth: 30000, change: 200, share: 33.3 },
    ])
  })

  it('income and auto-income categories read as money in; unknown is null', () => {
    expect(categoryHistory(lines, 'Pay', months)!.direction).toBe('in')
    const gifts = categoryHistory(lines, 'Gifts', months)!
    expect(gifts.direction).toBe('in')
    expect(gifts.values).toEqual([0, 0, 5000, 0])
    expect(categoryHistory(lines, 'Nope', months)).toBeNull()
  })
})
