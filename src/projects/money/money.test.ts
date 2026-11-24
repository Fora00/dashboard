import { describe, expect, it } from 'vitest'
import type { MoneyTotal } from '../../lib/db'
import { lineKey, parseCents, parseMoneyCsv, type MoneyLine } from './moneyCsv'
import { chunkPayloads, decodeMoneyParam, encodeMoneyLink, monthsBetween, payloadJson } from './moneyLink'
import { planMoneyImport } from './moneyDiff'
import {
  budgetMonthsLabel,
  categoryRows,
  euroShort,
  keptOf,
  lastMonthOf,
  periodLabel,
  periodLines,
  totalsOf,
} from './moneyStats'

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

  it('the newest year is year to date, and the compare year is cut at the same month', () => {
    const more = [...lines, { month: '2024-03', category: 'Food', kind: 'spend' as const, amount: -100, budget: null }]
    expect(lastMonthOf(more, 2025)).toBe(2)
    expect(lastMonthOf(more, 2024)).toBe(12)
    expect(periodLines(more, 2024, 2)).toEqual([])
    expect(periodLabel(2025, 2)).toBe('gen–feb 2025')
    expect(periodLabel(2024, 12)).toBe('2024')
  })

  it('per category: spent vs summed budget, over flagged, compare year same months', () => {
    const more = [
      ...lines,
      { month: '2024-02', category: 'Food', kind: 'spend' as const, amount: -40000, budget: null },
    ]
    const rows = categoryRows(more, 'spend', 2025, 2, 2024)
    expect(rows[0]).toEqual({
      category: 'Food',
      value: 50050,
      budget: 50000,
      budgetMonths: [1, 2],
      rowMonths: 2,
      over: 50,
      compare: 40000,
    })
    expect(rows[1]).toMatchObject({ category: 'Fun, games', budget: null, over: 0, compare: 0 })
    expect(categoryRows(more, 'oneoff', 2025, 2, null)).toEqual([
      { category: 'Laptop', value: 90000, budget: null, budgetMonths: [], rowMonths: 1, over: 0, compare: null },
    ])
  })

  it('a budget set mid-year only counts its own months towards over', () => {
    const gym = (m: number, budget: number | null) => ({
      month: `2026-${String(m).padStart(2, '0')}`,
      category: 'Gym',
      kind: 'spend' as const,
      amount: -5000,
      budget,
    })
    // 50 a month all year, a 50 budget only from October: never over.
    const fromOct = [...[1, 2, 3, 4, 5, 6, 7, 8, 9].map((m) => gym(m, null)), gym(10, -5000), gym(11, -5000)]
    expect(categoryRows(fromOct, 'spend', 2026, 11, null)[0]).toMatchObject({
      value: 55000,
      budget: 10000,
      budgetMonths: [10, 11],
      rowMonths: 11,
      over: 0,
    })
    // Over inside the budget months still shows, by the budgeted months only.
    const over = [gym(1, null), { ...gym(2, -3000) }]
    expect(categoryRows(over, 'spend', 2026, 2, null)[0]).toMatchObject({ value: 10000, budget: 3000, over: 2000 })
    expect(budgetMonthsLabel({ budgetMonths: [10, 11], rowMonths: 11 })).toBe('ott–nov')
    expect(budgetMonthsLabel({ budgetMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 11], rowMonths: 11 })).toBe('gen–set, nov')
    expect(budgetMonthsLabel({ budgetMonths: [11], rowMonths: 11 })).toBe('nov')
    expect(budgetMonthsLabel({ budgetMonths: [], rowMonths: 12 })).toBeNull()
    // Rows only in some months, a budget on each of them: not partial.
    expect(budgetMonthsLabel({ budgetMonths: [3, 7], rowMonths: 2 })).toBeNull()
  })

  it('short labels', () => {
    expect(euroShort(85000)).toBe('850')
    expect(euroShort(123456)).toBe('1,2k')
    expect(euroShort(-300000)).toBe('-3k')
  })
})
