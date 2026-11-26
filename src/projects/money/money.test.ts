import { describe, expect, it } from 'vitest'
import type { MoneyBudget, MoneyBudgetChoice, MoneyTotal } from '../../lib/db'
import { lineKey, parseCents, parseMoneyCsv, type MoneyLine } from './moneyCsv'
import { chunkPayloads, decodeMoneyParam, encodeMoneyLink, monthsBetween, payloadJson } from './moneyLink'
import { planMoneyImport } from './moneyDiff'
import {
  availableMonths,
  defaultSelection,
  periodLabel,
  periodLines,
  resolveComparison,
  resolvePeriod,
  shortLabel,
  type Period,
  type Selection,
} from './moneyPeriod'
import {
  categoryMovers,
  cumulativeKept,
  movingAverage,
  pctLabel,
  spendSeries,
  superTotal,
  yearOnYear,
} from './moneyTrends'
import {
  applyBudgets,
  budgetsCsv,
  budgetsCsvText,
  choiceFor,
  choicesForSave,
  parseBudgetsCsv,
  planRuleSave,
} from './moneyBudgets'
import { budgetMonthsLabel, categoryRows, euroShort, keptOf, monthlyTotals, totalsOf, type Line } from './moneyStats'

// Soldi, pure part: CSV parser/validator, link round trip + chunking, import
// diff, totals. Invented categories and figures only: never real data here.

const HEADER = 'month,category,kind,amount,budget'
const CSV = [
  HEADER,
  '2025-01,Pay,income,1000.0,',
  '2025-01,Food,spend,-200.5,-250.0',
  '2025-01,Lent | Friend *Debiti,pass,-50.0,',
  '2025-02,Pay,income,1000.0,',
  '2025-02,Food,spend,-300.0,-250.0',
  '2025-02,Laptop,oneoff,-900.0,',
  '"2025-02","Fun, games",spend,-10.05,',
].join('\n')

const ok = (text: string) => {
  const r = parseMoneyCsv(text)
  if (!r.ok) throw new Error(r.errors.join('\n'))
  return r.lines
}

const stored = (l: MoneyLine, updatedAt = 1): MoneyTotal => ({ id: lineKey(l.month, l.category), ...l, updatedAt })

describe('parseCents', () => {
  it('turns decimals into integer cents without float drift', () => {
    expect(parseCents('-200.5')).toBe(-20050)
    expect(parseCents('0.1')).toBe(10)
    expect(parseCents('1234.56')).toBe(123456)
    expect(parseCents('-0.0')).toBe(0)
    expect(parseCents('12')).toBe(1200)
  })
  it('rejects anything else', () => {
    for (const bad of ['', '1.234', '1e3', '1,5', 'abc', '--1', '.5']) expect(parseCents(bad)).toBeNull()
  })
})

describe('parseMoneyCsv', () => {
  it('parses rows into cents, keeps " | " in names, handles quoted fields and sorts', () => {
    const lines = ok(CSV)
    expect(lines).toHaveLength(7)
    expect(lines[0]).toEqual({ month: '2025-01', category: 'Food', kind: 'spend', amount: -20050, budget: -25000 })
    expect(lines.find((l) => l.kind === 'pass')?.category).toBe('Lent | Friend *Debiti')
    expect(lines.find((l) => l.category === 'Fun, games')).toMatchObject({ amount: -1005, budget: null })
  })

  it('accepts CRLF, a BOM and a trailing newline', () => {
    expect(ok(`﻿${CSV.replace(/\n/g, '\r\n')}\r\n`)).toHaveLength(7)
  })

  it('rejects a wrong header or an empty file', () => {
    expect(parseMoneyCsv('month,category,amount\n2025-01,A,1').ok).toBe(false)
    expect(parseMoneyCsv(HEADER).ok).toBe(false)
  })

  it('reports every bad line with its line number', () => {
    const r = parseMoneyCsv(
      [
        HEADER,
        '2025-13,A,spend,-1,',
        '2025-01,,spend,-1,',
        '2025-01,B,refund,-1,',
        '2025-01,C,spend,1.234,',
        '2025-01,D,spend,-1,x',
        '2025-01,E,spend',
      ].join('\n'),
    )
    expect(r.ok).toBe(false)
    if (r.ok) return
    expect(r.errors).toEqual([
      expect.stringContaining('line 2: month'),
      expect.stringContaining('line 3: category is empty'),
      expect.stringContaining('line 4: kind'),
      expect.stringContaining('line 5: amount'),
      expect.stringContaining('line 6: budget'),
      expect.stringContaining('line 7: 3 columns'),
    ])
  })

  it('rejects a month+category twice and over-long names', () => {
    const dup = parseMoneyCsv([HEADER, '2025-01,A,spend,-1,', '2025-01, A ,spend,-2,'].join('\n'))
    expect(dup.ok ? [] : dup.errors).toEqual(['2025-01 "A" appears twice'])
    const long = parseMoneyCsv([HEADER, `2025-01,${'x'.repeat(101)},spend,-1,`].join('\n'))
    expect(long.ok).toBe(false)
  })
})

describe('import link', () => {
  it('round-trips through deflate + base64url, with the range', async () => {
    const lines = ok(CSV)
    const link = await encodeMoneyLink({ from: '2025-01', to: '2025-03', lines }, 'https://x.test/')
    expect(link.startsWith('https://x.test/#/soldi/import?d=')).toBe(true)
    const r = await decodeMoneyParam(link.slice(link.indexOf('?d=') + 3))
    expect(r).toEqual({ ok: true, payload: { from: '2025-01', to: '2025-03', lines } })
  })

  it('compresses: the link is much shorter than the JSON', async () => {
    const lines: MoneyLine[] = []
    for (let m = 1; m <= 12; m++)
      for (const c of ['Groceries', 'Transport', 'Restaurants', 'Rent', 'Subscriptions'])
        lines.push({
          month: `2024-${String(m).padStart(2, '0')}`,
          category: c,
          kind: 'spend',
          amount: -m * 1000,
          budget: null,
        })
    const link = await encodeMoneyLink({ from: '2024-01', to: '2024-12', lines }, '')
    expect(link.length).toBeLessThan(payloadJson({ from: '2024-01', to: '2024-12', lines }).length / 3)
  })

  it('rejects damaged links and payloads that break the rules', async () => {
    expect((await decodeMoneyParam('not base64!')).ok).toBe(false)
    expect((await decodeMoneyParam('AAAA')).ok).toBe(false)
    const outside = await encodeMoneyLink(
      {
        from: '2025-02',
        to: '2025-02',
        lines: [{ month: '2025-01', category: 'A', kind: 'spend', amount: -1, budget: null }],
      },
      '',
    )
    const r = await decodeMoneyParam(outside.slice(outside.indexOf('?d=') + 3))
    expect(r.ok ? [] : r.errors).toEqual([expect.stringContaining('outside 2025-02..2025-02')])
  })

  it('monthsBetween spans year ends', () => {
    expect(monthsBetween('2024-11', '2025-02')).toEqual(['2024-11', '2024-12', '2025-01', '2025-02'])
  })

  it('one link when it fits; --since keeps only later months', async () => {
    const lines = ok(CSV)
    const one = await chunkPayloads(lines)
    expect(one.map((c) => [c.payload.from, c.payload.to])).toEqual([['2025-01', '2025-02']])
    const since = await chunkPayloads(lines, { since: '2025-02' })
    expect(since[0]!.payload.lines.every((l) => l.month === '2025-02')).toBe(true)
    await expect(chunkPayloads(lines, { since: '2026-01' })).rejects.toThrow('No rows')
  })

  it('splits by whole years into contiguous ranges when too long', async () => {
    const lines: MoneyLine[] = []
    for (const y of [2021, 2022, 2024])
      for (let m = 3; m <= 12; m++)
        for (let c = 0; c < 8; c++)
          lines.push({
            month: `${y}-${String(m).padStart(2, '0')}`,
            category: `Cat ${c}`,
            kind: 'spend',
            amount: -(y * m * c),
            budget: null,
          })
    const single = (await chunkPayloads(lines, { since: '2021-03' }))[0]!.param.length
    const chunks = await chunkPayloads(lines, { maxParam: Math.ceil(single / 2) })
    expect(chunks.length).toBeGreaterThan(1)
    expect(chunks[0]!.payload.from).toBe('2021-03')
    expect(chunks.at(-1)!.payload.to).toBe('2024-12')
    for (let i = 0; i + 1 < chunks.length; i++) {
      const gap = monthsBetween(chunks[i]!.payload.to, chunks[i + 1]!.payload.from)
      expect(gap).toHaveLength(2) // next chunk starts the month after: nothing falls in between
    }
    expect(chunks.flatMap((c) => c.payload.lines)).toHaveLength(lines.length)
    await expect(chunkPayloads(lines, { maxParam: 50 })).rejects.toThrow('alone is too large')
  })
})

describe('planMoneyImport', () => {
  const lines = ok(CSV)
  const payload = { from: '2025-01', to: '2025-02', lines }

  it('everything is new on an empty device', () => {
    const plan = planMoneyImport(payload, [], 5)
    expect(plan.months.map((m) => m.status)).toEqual(['added', 'added'])
    expect(plan.upserts).toHaveLength(7)
    expect(plan.upserts.every((r) => r.updatedAt === 5 && r.id === `${r.month}:${r.category}`)).toBe(true)
    expect(plan.deletes).toEqual([])
    expect(plan.before).toEqual({ income: 0, spend: 0, oneoff: 0, pass: 0 })
  })

  it('is idempotent: importing the same rows again plans nothing', () => {
    const plan = planMoneyImport(
      payload,
      lines.map((l) => stored(l)),
      9,
    )
    expect(plan.upserts).toEqual([])
    expect(plan.deletes).toEqual([])
    expect(plan.months.map((m) => m.status)).toEqual(['unchanged', 'unchanged'])
  })

  it('replaces covered months: changed rows, new rows, and categories gone from the CSV are deleted', () => {
    const old = [
      ...lines.filter((l) => l.month === '2025-01').map((l) => stored(l)),
      stored({ month: '2025-01', category: 'Removed in GreenBooks', kind: 'spend', amount: -100, budget: null }),
      stored({ ...lines.find((l) => l.month === '2025-02' && l.category === 'Food')!, amount: -1 }),
      stored({ month: '2024-12', category: 'Outside the range', kind: 'spend', amount: -100, budget: null }),
    ]
    const plan = planMoneyImport(payload, old, 7)
    expect(plan.deletes).toEqual(['2025-01:Removed in GreenBooks'])
    const jan = plan.months.find((m) => m.month === '2025-01')!
    expect(jan).toMatchObject({ status: 'changed', added: 0, changed: 0, removed: 1 })
    const feb = plan.months.find((m) => m.month === '2025-02')!
    expect(feb).toMatchObject({ status: 'changed', changed: 1, added: 3 })
    expect(plan.upserts.map((r) => r.id).sort()).toEqual(
      ['2025-02:Food', '2025-02:Fun, games', '2025-02:Laptop', '2025-02:Pay'].sort(),
    )
    expect(plan.months.some((m) => m.month === '2024-12')).toBe(false)
  })

  it('a stored month the CSV no longer has is emptied', () => {
    const old = [stored({ month: '2025-03', category: 'Food', kind: 'spend', amount: -5, budget: null })]
    const plan = planMoneyImport({ from: '2025-01', to: '2025-03', lines }, old, 1)
    expect(plan.months.find((m) => m.month === '2025-03')).toMatchObject({ status: 'removed', after: null })
    expect(plan.deletes).toEqual(['2025-03:Food'])
  })
})

describe('totals', () => {
  const lines = ok(CSV)

  it('pass rows are never income or spend; kept = income - spend - oneoff', () => {
    const t = totalsOf(lines)
    expect(t).toEqual({ income: 200000, spend: 51055, oneoff: 90000, pass: -5000 })
    expect(keptOf(t)).toBe(200000 - 51055 - 90000)
  })

  const P = (from: string, to: string): Period => ({ from, to })
  const rowsOf = (all: Line[], kind: Parameters<typeof categoryRows>[1], p: Period, c: Period | null) =>
    categoryRows(periodLines(all, p), kind, c === null ? null : { lines: periodLines(all, c), scale: 1 })

  it('the newest year is year to date, and the year-before comparison is cut at the same month', () => {
    const more = [...lines, { month: '2024-03', category: 'Food', kind: 'spend' as const, amount: -100, budget: null }]
    const months = availableMonths(more)
    expect(months[0]).toBe('2024-03')
    expect(months).toHaveLength(12)
    const sel = defaultSelection(months)
    const p = resolvePeriod(sel, months)
    expect(p).toEqual(P('2025-01', '2025-02'))
    expect(resolvePeriod({ ...sel, year: 2024 }, months)).toEqual(P('2024-01', '2024-12'))
    const c = resolveComparison(sel, p, more)!
    expect(c.period).toEqual(P('2024-01', '2024-02'))
    expect(c.covered).toBe(0)
    expect(periodLabel(P('2025-01', '2025-02'))).toBe('gen–feb 2025')
    expect(periodLabel(P('2024-01', '2024-12'))).toBe('2024')
  })

  it('per category: spent vs summed budget, over flagged, compare same months', () => {
    const more = [
      ...lines,
      { month: '2024-02', category: 'Food', kind: 'spend' as const, amount: -40000, budget: null },
    ]
    const rows = rowsOf(more, 'spend', P('2025-01', '2025-02'), P('2024-01', '2024-02'))
    expect(rows[0]).toEqual({
      category: 'Food',
      value: 50050,
      budget: 50000,
      budgetMonths: ['2025-01', '2025-02'],
      rowMonths: 2,
      over: 50,
      compare: 40000,
    })
    expect(rows[1]).toMatchObject({ category: 'Fun, games', budget: null, over: 0, compare: 0 })
    expect(rowsOf(more, 'oneoff', P('2025-01', '2025-02'), null)).toEqual([
      { category: 'Laptop', value: 90000, budget: null, budgetMonths: [], rowMonths: 1, over: 0, compare: null },
    ])
  })

  it('a budget set mid-year only counts its own months towards over', () => {
    const mm = (m: number) => `2026-${String(m).padStart(2, '0')}`
    const gym = (m: number, budget: number | null) => ({
      month: mm(m),
      category: 'Gym',
      kind: 'spend' as const,
      amount: -5000,
      budget,
    })
    // 50 a month all year, a 50 budget only from October: never over.
    const fromOct = [...[1, 2, 3, 4, 5, 6, 7, 8, 9].map((m) => gym(m, null)), gym(10, -5000), gym(11, -5000)]
    expect(rowsOf(fromOct, 'spend', P('2026-01', '2026-11'), null)[0]).toMatchObject({
      value: 55000,
      budget: 10000,
      budgetMonths: ['2026-10', '2026-11'],
      rowMonths: 11,
      over: 0,
    })
    // Over inside the budget months still shows, by the budgeted months only.
    const over = [gym(1, null), { ...gym(2, -3000) }]
    expect(rowsOf(over, 'spend', P('2026-01', '2026-02'), null)[0]).toMatchObject({
      value: 10000,
      budget: 3000,
      over: 2000,
    })
    const L = (ms: number[], rowMonths: number) => budgetMonthsLabel({ budgetMonths: ms.map(mm), rowMonths })
    expect(L([10, 11], 11)).toBe('ott–nov')
    expect(L([1, 2, 3, 4, 5, 6, 7, 8, 9, 11], 11)).toBe('gen–set, nov')
    expect(L([11], 11)).toBe('nov')
    expect(L([], 12)).toBeNull()
    // Rows only in some months, a budget on each of them: not partial.
    expect(L([3, 7], 2)).toBeNull()
    // Across a year end the run continues, and the labels carry the year.
    expect(budgetMonthsLabel({ budgetMonths: ['2025-12', '2026-01'], rowMonths: 4 }, true)).toBe('dic 25–gen 26')
  })

  it('auto categories are income or spend by their total over the period shown', () => {
    const gift = (month: string, amount: number) => ({
      month,
      category: 'Gifts',
      kind: 'auto' as const,
      amount,
      budget: null,
    })
    const pay = (month: string) => ({ month, category: 'Pay', kind: 'income' as const, amount: 100000, budget: null })
    const all = [
      pay('2025-01'),
      gift('2025-01', -3000),
      gift('2025-02', 8000), // 2025 nets +50: income for the year
      pay('2026-01'),
      gift('2026-01', -2000), // 2026 nets -20: spend
    ]
    const Y25 = P('2025-01', '2025-12')
    const Y26 = P('2026-01', '2026-12')
    // Year 2025: the year's total decides, so the whole +50 is income.
    expect(totalsOf(periodLines(all, Y25))).toEqual({ income: 105000, spend: 0, oneoff: 0, pass: 0 })
    expect(totalsOf(periodLines(all, Y26))).toEqual({ income: 100000, spend: 2000, oneoff: 0, pass: 0 })
    // Month by month: January 2025 is spend, February income.
    const months = monthlyTotals(all, Y25)
    expect(months).toHaveLength(12)
    expect(months[0]).toEqual({ income: 100000, spend: 3000, oneoff: 0, pass: 0 })
    expect(months[1]).toEqual({ income: 8000, spend: 0, oneoff: 0, pass: 0 })
    expect(months[2]).toBeNull()
    // Kept is the same however auto is split.
    expect(keptOf(totalsOf(periodLines(all, Y25)))).toBe(105000)
    // Category blocks: income in 2025 (compare 2026 signed as income), spend in 2026.
    expect(rowsOf(all, 'income', Y25, Y26).find((r) => r.category === 'Gifts')).toMatchObject({
      value: 5000,
      compare: -2000,
    })
    expect(rowsOf(all, 'spend', Y25, null).find((r) => r.category === 'Gifts')).toBeUndefined()
    expect(rowsOf(all, 'spend', Y26, Y25).find((r) => r.category === 'Gifts')).toMatchObject({
      value: 2000,
      compare: -5000,
    })
    // Only in the comparison (January 2025 nets -30): placed by the compare total.
    const only = [pay('2027-01'), ...all]
    const J27 = P('2027-01', '2027-01')
    expect(rowsOf(only, 'spend', J27, P('2025-01', '2025-01')).find((r) => r.category === 'Gifts')).toMatchObject({
      value: 0,
      compare: 3000,
    })
    expect(rowsOf(only, 'income', J27, P('2025-01', '2025-01')).map((r) => r.category)).toEqual(['Pay'])
  })

  it('short labels', () => {
    expect(euroShort(85000)).toBe('850')
    expect(euroShort(123456)).toBe('1,2k')
    expect(euroShort(-300000)).toBe('-3k')
  })
})

describe('periods and comparisons (MO6)', () => {
  const pay = (month: string, amount = 100000): Line => ({
    month,
    category: 'Pay',
    kind: 'income',
    amount,
    budget: null,
  })
  const food = (month: string, amount: number): Line => ({
    month,
    category: 'Food',
    kind: 'spend',
    amount,
    budget: null,
  })
  // Jul 2024 .. Mar 2026, pay every month, food 100 + 10 per month index.
  const months: string[] = []
  for (let y = 2024; y <= 2026; y++)
    for (let m = 1; m <= 12; m++) {
      const mm = `${y}-${String(m).padStart(2, '0')}`
      if (mm >= '2024-07' && mm <= '2026-03') months.push(mm)
    }
  const all = months.flatMap((m, i) => [pay(m), food(m, -(10000 + i * 1000))])
  const avail = availableMonths(all)
  const base = defaultSelection(avail)
  const sel = (patch: Partial<Selection>): Selection => ({ ...base, ...patch })

  it('resolves each period mode inside the data', () => {
    expect(avail).toEqual(months)
    expect(resolvePeriod(sel({ mode: 'year', year: 2025 }), avail)).toEqual({ from: '2025-01', to: '2025-12' })
    // The newest year stops at the newest month; a year without data falls back to the newest.
    expect(resolvePeriod(sel({ mode: 'year', year: 2026 }), avail)).toEqual({ from: '2026-01', to: '2026-03' })
    expect(resolvePeriod(sel({ mode: 'year', year: 2019 }), avail)).toEqual({ from: '2026-01', to: '2026-03' })
    // A range crosses the year end, is put in order and kept inside the data.
    expect(resolvePeriod(sel({ mode: 'range', from: '2026-02', to: '2025-11' }), avail)).toEqual({
      from: '2025-11',
      to: '2026-02',
    })
    expect(resolvePeriod(sel({ mode: 'range', from: '2020-01', to: '2030-01' }), avail)).toEqual({
      from: '2024-07',
      to: '2026-03',
    })
    expect(resolvePeriod(sel({ mode: 'last', last: 6 }), avail)).toEqual({ from: '2025-10', to: '2026-03' })
    expect(resolvePeriod(sel({ mode: 'month', month: '2025-08' }), avail)).toEqual({ from: '2025-08', to: '2025-08' })
  })

  it('labels', () => {
    expect(periodLabel({ from: '2025-11', to: '2026-02' })).toBe('nov 2025 – feb 2026')
    expect(periodLabel({ from: '2025-08', to: '2025-08' })).toBe('ago 2025')
    expect(shortLabel({ from: '2025-01', to: '2025-03' })).toBe('2025')
    expect(shortLabel({ from: '2025-08', to: '2025-10' })).toBe('ago–ott 25')
    expect(shortLabel({ from: '2024-11', to: '2025-01' })).toBe('nov 24–gen 25')
    expect(shortLabel({ from: '2025-08', to: '2025-08' })).toBe('ago 25')
  })

  it('year before, previous period and a chosen start all keep the same length', () => {
    const p = { from: '2025-11', to: '2026-02' }
    const yoy = resolveComparison(sel({ compare: 'yoy' }), p, all)!
    expect(yoy.period).toEqual({ from: '2024-11', to: '2025-02' })
    expect(yoy.covered).toBe(4)
    const prev = resolveComparison(sel({ compare: 'prev' }), p, all)!
    expect(prev.period).toEqual({ from: '2025-07', to: '2025-10' })
    const custom = resolveComparison(sel({ mode: 'range', compare: 'custom', compareStart: '2024-08' }), p, all)!
    expect(custom.period).toEqual({ from: '2024-08', to: '2024-11' })
    // In year mode the chosen start is the year: the comparison starts in January.
    const y = { from: '2026-01', to: '2026-03' }
    const cy = resolveComparison(sel({ mode: 'year', compare: 'custom', compareStart: '2025-06' }), y, all)!
    expect(cy.period).toEqual({ from: '2025-01', to: '2025-03' })
    expect(cy.label).toBe('gen–mar 2025')
    // Partly before the data: says how many months it covers.
    const early = resolveComparison(sel({ compare: 'yoy' }), { from: '2025-05', to: '2025-08' }, all)!
    expect(early.covered).toBe(2)
    expect(early.length).toBe(4)
    expect(resolveComparison(sel({ compare: 'none' }), p, all)).toBeNull()
  })

  it('the historic average is the monthly mean scaled to the period length', () => {
    const p = { from: '2026-01', to: '2026-03' }
    const avg = resolveComparison(sel({ compare: 'avg' }), p, all)!
    expect(avg.period).toBeNull()
    expect(avg.covered).toBe(21)
    expect(avg.scale).toBeCloseTo(3 / 21)
    expect(avg.short).toBe('media')
    // Food: 100 + 10*i for i = 0..20 → mean 200 a month → 600 over three months.
    const rows = categoryRows(periodLines(all, p), 'spend', { lines: avg.lines, scale: avg.scale })
    expect(rows[0]).toMatchObject({ category: 'Food', compare: 60000 })
    const rowsIncome = categoryRows(periodLines(all, p), 'income', { lines: avg.lines, scale: avg.scale })
    expect(rowsIncome[0]).toMatchObject({ category: 'Pay', value: 300000, compare: 300000 })
  })
})

describe('trends (MO7)', () => {
  const L = (month: string, category: string, kind: Line['kind'], amount: number): Line => ({
    month,
    category,
    kind,
    amount,
    budget: null,
  })

  it('moving average waits for a full window; year on year needs the value 12 places before', () => {
    expect(movingAverage([10, 20, 30, 40], 3)).toEqual([null, null, 20, 30])
    expect(movingAverage([10, 20], 1)).toEqual([10, 20])
    const vals = Array.from({ length: 14 }, (_, i) => (i < 12 ? 100 : 150))
    const yoy = yearOnYear(vals)
    expect(yoy.slice(0, 12).every((v) => v === null)).toBe(true)
    expect(yoy[12]).toBe(50)
    expect(yearOnYear([...Array(12).fill(300), 301])[12]).toBe(0.3)
    expect(pctLabel(0.3)).toBe('+0,3%')
    expect(pctLabel(-12.4)).toBe('-12%')
    expect(yearOnYear([...Array(12).fill(0), 10])[12]).toBeNull()
    expect(yearOnYear([...Array(12).fill(null), 10])[12]).toBeNull()
  })

  it('spend series leaves one-offs out unless asked, empty months count 0, cumulative kept adds up', () => {
    const lines = [
      L('2025-01', 'Pay', 'income', 1000),
      L('2025-01', 'Food', 'spend', -300),
      L('2025-01', 'Laptop', 'oneoff', -500),
      L('2025-03', 'Food', 'spend', -200),
    ]
    const months = availableMonths(lines)
    expect(spendSeries(lines, months, false)).toEqual([300, 0, 200])
    expect(spendSeries(lines, months, true)).toEqual([800, 0, 200])
    expect(cumulativeKept(monthlyTotals(lines, { from: '2025-01', to: '2025-03' }))).toEqual([200, 200, 0])
    const { total, perMonth } = superTotal(lines, months.length)
    expect(keptOf(total)).toBe(0)
    expect(perMonth.income).toBe(333)
  })

  it('category movers: last n months against the n before, auto by the whole history', () => {
    const lines = [
      L('2025-01', 'Food', 'spend', -100),
      L('2025-02', 'Food', 'spend', -100),
      L('2025-03', 'Food', 'spend', -300),
      L('2025-04', 'Food', 'spend', -300),
      L('2025-01', 'Gym', 'auto', -500),
      L('2025-04', 'Gym', 'auto', -100),
      L('2025-03', 'Trip', 'oneoff', -2000),
      // Gifts: income over the history, never a spend mover.
      L('2025-01', 'Gifts', 'auto', 900),
      L('2025-03', 'Gifts', 'auto', -100),
    ]
    const months = availableMonths(lines)
    const m = categoryMovers(lines, months, 2, false)!
    expect(m.recent).toEqual({ from: '2025-03', to: '2025-04' })
    expect(m.rising).toEqual([{ category: 'Food', recent: 600, before: 200, delta: 400, pct: 200 }])
    expect(m.falling).toEqual([{ category: 'Gym', recent: 100, before: 500, delta: -400, pct: -80 }])
    expect(categoryMovers(lines, months, 2, true)!.rising.map((r) => r.category)).toEqual(['Trip', 'Food'])
    expect(categoryMovers(lines, months, 3, false)).toBeNull()
  })
})

describe('budgets (MO8)', () => {
  const L = (month: string, category: string, amount: number, budget: number | null, kind: Line['kind'] = 'auto') => ({
    month,
    category,
    kind,
    amount,
    budget,
  })
  const rule = (
    category: string,
    monthly: number,
    from: string,
    to: string | null = null,
    id = `${category}:${from}`,
  ) => ({ id, category, monthly, from, to, updatedAt: 1 }) satisfies MoneyBudget
  const pick = (month: string, category: string, p: MoneyBudgetChoice['pick'], gb: number, dash: number) =>
    choiceFor(month, category, p, gb, dash, 1)
  const budgetOf = (ls: { month: string; category: string; budget: number | null }[], m: string, c: string) =>
    ls.find((l) => l.month === m && l.category === c)?.budget
  const base = [
    L('2026-01', 'Food', -100, -150),
    L('2026-02', 'Food', -100, null),
    L('2026-02', 'Pay', 1000, null, 'income'),
  ]

  it('no rules: identity, GreenBooks marked as the source', () => {
    const r = applyBudgets(base, [], [], '2026-02')
    expect(r.lines.map(({ budgetFrom: _f, conflict: _c, ...l }) => l)).toEqual(base)
    expect(r.lines.map((l) => l.budgetFrom)).toEqual(['greenbooks', null, null])
    expect(r.conflicts.size).toBe(0)
  })

  it('dashboard only: signed like the rows; GreenBooks only: kept', () => {
    const r = applyBudgets(base, [rule('Food', 12000, '2026-02')], [], '2026-02')
    expect(budgetOf(r.lines, '2026-02', 'Food')).toBe(-12000)
    expect(r.lines.find((l) => l.month === '2026-02' && l.category === 'Food')?.budgetFrom).toBe('dashboard')
    expect(budgetOf(r.lines, '2026-01', 'Food')).toBe(-150)
    expect(r.conflicts.size).toBe(0)
  })

  it('equal values are no conflict', () => {
    const r = applyBudgets(base, [rule('Food', 150, '2026-01')], [], '2026-02')
    expect(r.conflicts.size).toBe(0)
    expect(budgetOf(r.lines, '2026-01', 'Food')).toBe(-150)
  })

  it('a conflict without a pick uses GreenBooks and is flagged', () => {
    const r = applyBudgets(base, [rule('Food', 200, '2026-01')], [], '2026-02')
    expect(budgetOf(r.lines, '2026-01', 'Food')).toBe(-150)
    expect(r.lines.find((l) => l.month === '2026-01' && l.category === 'Food')?.conflict).toBe(true)
    expect(r.conflicts.get('Food')).toEqual([{ month: '2026-01', gb: -150, dash: 200 }])
  })

  it('a pick decides while both values are unchanged', () => {
    const rules = [rule('Food', 200, '2026-01')]
    const dash = applyBudgets(base, rules, [pick('2026-01', 'Food', 'dashboard', -150, 200)], '2026-02')
    expect(budgetOf(dash.lines, '2026-01', 'Food')).toBe(-200)
    expect(dash.conflicts.size).toBe(0)
    const gb = applyBudgets(base, rules, [pick('2026-01', 'Food', 'greenbooks', -150, 200)], '2026-02')
    expect(budgetOf(gb.lines, '2026-01', 'Food')).toBe(-150)
    expect(gb.lines.find((l) => l.month === '2026-01' && l.category === 'Food')?.conflict).toBe(false)
    expect(gb.conflicts.size).toBe(0)
  })

  it('a pick goes stale when the GreenBooks or the dashboard value changes', () => {
    const choices = [pick('2026-01', 'Food', 'dashboard', -150, 200)]
    const gbChanged = [L('2026-01', 'Food', -100, -170), ...base.slice(1)]
    const a = applyBudgets(gbChanged, [rule('Food', 200, '2026-01')], choices, '2026-02')
    expect(a.conflicts.get('Food')).toEqual([{ month: '2026-01', gb: -170, dash: 200 }])
    expect(budgetOf(a.lines, '2026-01', 'Food')).toBe(-170)
    const b = applyBudgets(base, [rule('Food', 250, '2026-01')], choices, '2026-02')
    expect(b.conflicts.get('Food')).toEqual([{ month: '2026-01', gb: -150, dash: 250 }])
  })

  it('synthesises a zero row where a rule applies but the category has none, only in months with data', () => {
    const lines = [
      L('2026-01', 'Pay', 1000, null, 'income'),
      L('2026-02', 'Pay', 1000, null, 'income'),
      L('2026-01', 'Gym', -50, null, 'spend'),
    ]
    const r = applyBudgets(lines, [rule('Gym', 4000, '2025-06'), rule('New', 1000, '2026-02')], [], '2026-02')
    const synth = r.lines.filter((l) => l.amount === 0)
    // Gym takes its kind from its other rows, New (no rows) is spend; 2025 has no data, so nothing there.
    expect(synth).toEqual([
      {
        month: '2026-02',
        category: 'Gym',
        kind: 'spend',
        amount: 0,
        budget: -4000,
        budgetFrom: 'dashboard',
        conflict: false,
      },
      {
        month: '2026-02',
        category: 'New',
        kind: 'spend',
        amount: 0,
        budget: -1000,
        budgetFrom: 'dashboard',
        conflict: false,
      },
    ])
    // Totals are unchanged; the budget now counts for Gym in February.
    expect(totalsOf(r.lines)).toEqual(totalsOf(lines))
    const gym = categoryRows(r.lines, 'spend', null).find((c) => c.category === 'Gym')!
    expect(gym).toMatchObject({ value: 50, budget: 8000, rowMonths: 2, over: 0 })
  })

  it('does not apply a rule past the newest month', () => {
    const r = applyBudgets(base, [rule('Food', 200, '2026-02')], [], '2026-01')
    expect(budgetOf(r.lines, '2026-02', 'Food')).toBeNull()
  })

  it('saving a rule truncates, splits or removes the overlapping ones of the same category', () => {
    let n = 0
    const id = () => `new${++n}`
    const open = rule('Food', 100, '2026-01', null, 'open')
    const now = { ...rule('Food', 120, '2026-12', null, 'r'), updatedAt: 9 }
    expect(planRuleSave([open, rule('Gym', 1, '2026-01')], now, id)).toEqual({
      upserts: [now, { ...open, to: '2026-11', updatedAt: 9 }],
      deletes: [],
    })
    // A temporary override inside an open rule splits it.
    const temp = { ...rule('Food', 300, '2026-03', '2026-04', 'r'), updatedAt: 9 }
    expect(planRuleSave([open], temp, id).upserts).toEqual([
      temp,
      { ...open, to: '2026-02', updatedAt: 9 },
      { ...open, id: 'new1', from: '2026-05', updatedAt: 9 },
    ])
    // A rule inside the new one goes; one starting inside and running past it starts after.
    const wide = { ...rule('Food', 50, '2026-01', '2026-06', 'r'), updatedAt: 9 }
    const inside = rule('Food', 1, '2026-02', '2026-03', 'inside')
    const later = rule('Food', 2, '2026-05', null, 'later')
    expect(planRuleSave([inside, later], wide, id)).toEqual({
      upserts: [wide, { ...later, from: '2026-07', updatedAt: 9 }],
      deletes: ['inside'],
    })
    // Same start, open: the old one is replaced.
    expect(planRuleSave([open], { ...open, id: 'r', monthly: 5 }, id).deletes).toEqual(['open'])
  })

  it('saving counts as "dashboard" for the covered months where GreenBooks differs', () => {
    const rows = [
      L('2026-01', 'Food', -1, -150),
      L('2026-02', 'Food', -1, -200),
      L('2026-03', 'Food', -1, null),
      L('2026-01', 'X', -1, -1),
    ]
    expect(choicesForSave(rows, { category: 'Food', monthly: 200, from: '2026-01', to: null }, 5)).toEqual([
      { id: '2026-01:Food', month: '2026-01', category: 'Food', pick: 'dashboard', gb: -150, dash: 200, updatedAt: 5 },
    ])
  })

  it('exports the rules as CSV and parses them back', () => {
    const rules = [
      { ...rule('Ristoranti', 12000, '2026-12'), updatedAt: Date.UTC(2026, 10, 26) },
      { ...rule('Svago, "giochi"', 5, '2026-01', '2026-03'), updatedAt: Date.UTC(2026, 0, 2) },
    ]
    const text = budgetsCsv(rules)
    expect(text).toBe(
      'category,monthly,from,to,updated\nRistoranti,120.00,2026-12,,2026-11-26\n"Svago, ""giochi""",0.05,2026-01,2026-03,2026-01-02\n',
    )
    const parsed = parseBudgetsCsv(text)
    expect(parsed).toEqual({
      ok: true,
      rows: [
        { category: 'Ristoranti', monthly: 12000, from: '2026-12', to: null, updated: '2026-11-26' },
        { category: 'Svago, "giochi"', monthly: 5, from: '2026-01', to: '2026-03', updated: '2026-01-02' },
      ],
    })
    if (parsed.ok) expect(budgetsCsvText(parsed.rows)).toBe(text)
    expect(budgetsCsv([])).toBe('category,monthly,from,to,updated\n')
  })

  it('refuses a bad budgets CSV with one error per problem', () => {
    expect(parseBudgetsCsv('month,category\n')).toMatchObject({ ok: false })
    const bad = parseBudgetsCsv(
      'category,monthly,from,to,updated\nA,0,2026-01,,2026-01-01\nB,1,2026-05,2026-04,2026-01-01\nC,1,2026-01,,x',
    )
    expect(bad.ok ? [] : bad.errors).toHaveLength(3)
    const overlap = parseBudgetsCsv(
      'category,monthly,from,to,updated\nA,1,2026-01,,2026-01-01\nA,2,2026-03,,2026-01-01',
    )
    expect(overlap.ok ? [] : overlap.errors).toEqual(['"A": the rule from 2026-03 overlaps the one from 2026-01'])
  })
})
