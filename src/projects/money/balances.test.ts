import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { db, resetDb } from '../../test/fakeDb'
import { drain } from '../../test/drain'
import { applyBalancesImport } from '../../lib/moneySync'
import type { MoneyBalance } from '../../lib/db'
import { changedBalanceMonths, parseBalancesCsv, type BalanceLine } from './balancesCsv'
import {
  chunkBalancesPayloads,
  decodeBalancesParam,
  encodeBalancesLink,
  encodeBalancesParam,
  parseBalancesPayloadJson,
} from './balancesLink'
import { planBalancesImport } from './balancesDiff'
import { accountRows, balanceHistory, monthSummary, signedEuro } from './balancesStats'
import { decodeMoneyParam, encodeMoneyParam } from './moneyLink'

// Soldi Patrimonio (MO17): CSV, link, plan, page figures and the import
// writer. Invented accounts and figures only.

const line = (month: string, account: string, group: BalanceLine['group'], balance: number): BalanceLine => ({
  month,
  account,
  group,
  balance,
})

describe('parseBalancesCsv', () => {
  it('parses cents exactly, trims, keeps quoted names and sorts by month then account', () => {
    const r = parseBalancesCsv(
      '﻿month,account,group,balance\n' +
        '2026-02,Conto B,liquidita,10.5\n' +
        '2026-01,"Fondo, pensione",investimenti,-0.01\n' +
        '2026-01, Conto A ,risparmi,1234.56\n',
    )
    expect(r).toEqual({
      ok: true,
      lines: [
        line('2026-01', 'Conto A', 'risparmi', 123456),
        line('2026-01', 'Fondo, pensione', 'investimenti', -1),
        line('2026-02', 'Conto B', 'liquidita', 1050),
      ],
    })
  })

  it('reports every bad row and never clips', () => {
    const r = parseBalancesCsv(
      'month,account,group,balance\n2026-13,A,liquidita,1\n2026-01,,risparmi,1\n2026-01,B,azioni,1.234\n2026-01,C,risparmi\n',
    )
    expect(r.ok).toBe(false)
    if (r.ok) return
    expect(r.errors).toEqual([
      'line 2: month "2026-13" must be YYYY-MM',
      'line 3: account is empty',
      'line 4: group "azioni" must be one of liquidita, risparmi, investimenti',
      'line 4: balance "1.234" must be euros with at most 2 decimals',
      'line 5: 3 columns, expected 4',
    ])
  })

  it('refuses a wrong header, an empty file, a duplicate account and a too-long name', () => {
    expect(parseBalancesCsv('month,category,kind,amount,budget\n')).toMatchObject({ ok: false })
    expect(parseBalancesCsv('month,account,group,balance\n')).toEqual({ ok: false, errors: ['The CSV has no rows'] })
    expect(parseBalancesCsv('month,account,group,balance\n2026-01,A,liquidita,1\n2026-01,A,risparmi,2\n')).toEqual({
      ok: false,
      errors: ['2026-01 "A" appears twice'],
    })
    const long = 'x'.repeat(101)
    expect(parseBalancesCsv(`month,account,group,balance\n2026-01,${long},liquidita,1\n`)).toMatchObject({
      ok: false,
    })
  })
})

describe('changedBalanceMonths', () => {
  it('lists months added, changed or gone, oldest first; ignores row order', () => {
    const before = [
      line('2026-01', 'A', 'liquidita', 1),
      line('2026-01', 'B', 'risparmi', 2),
      line('2026-02', 'A', 'liquidita', 3),
    ]
    const after = [
      line('2026-01', 'B', 'risparmi', 2),
      line('2026-01', 'A', 'liquidita', 1),
      line('2026-03', 'A', 'liquidita', 3),
    ]
    expect(changedBalanceMonths(before, after)).toEqual(['2026-02', '2026-03'])
    expect(changedBalanceMonths(after, after)).toEqual([])
    // A group change alone counts.
    expect(changedBalanceMonths([line('2026-01', 'A', 'liquidita', 1)], [line('2026-01', 'A', 'risparmi', 1)])).toEqual(
      ['2026-01'],
    )
  })
})

describe('balances link', () => {
  const payload = {
    from: '2025-12',
    to: '2026-01',
    lines: [line('2025-12', 'Conto è', 'liquidita', 100), line('2026-01', 'Fondo', 'investimenti', -5)],
  }

  it('round-trips through the compressed param and prints its own route', async () => {
    expect(await decodeBalancesParam(await encodeBalancesParam(payload))).toEqual({ ok: true, payload })
    expect(await encodeBalancesLink(payload, 'https://x/')).toMatch(/^https:\/\/x\/#\/soldi\/patrimonio\/import\?d=/)
  })

  it('never mixes with the monthly-totals link, in either direction', async () => {
    const totals = await encodeMoneyParam({
      from: '2026-01',
      to: '2026-01',
      lines: [{ month: '2026-01', category: 'Spesa', kind: 'spend', amount: -100, budget: null }],
    })
    const asBalances = await decodeBalancesParam(totals)
    expect(asBalances.ok).toBe(false)
    if (!asBalances.ok) expect(asBalances.errors[0]).toMatch(/monthly-totals link/)
    const asTotals = await decodeMoneyParam(await encodeBalancesParam(payload))
    expect(asTotals.ok).toBe(false)
  })

  it('refuses damaged links and rows outside the range or malformed', async () => {
    expect(await decodeBalancesParam('%%%')).toMatchObject({ ok: false })
    expect(await decodeBalancesParam('AAAA')).toMatchObject({ ok: false })
    const bad = parseBalancesPayloadJson(
      JSON.stringify({
        v: 'balances-1',
        from: '2026-01',
        to: '2026-01',
        rows: [
          ['2026-02', 'A', 'liquidita', 1],
          ['2026-01', 'B', 'liquidita', 1.5],
          ['2026-01', 'C'],
        ],
      }),
    )
    expect(bad).toEqual({
      ok: false,
      errors: [
        'rows[0]: 2026-02 is outside 2026-01..2026-01',
        'rows[1]: balance "1.5" must be euros with at most 2 decimals',
        'rows[2] must be [month, account, group, balance]',
      ],
    })
    expect(
      parseBalancesPayloadJson(JSON.stringify({ v: 'balances-1', from: '2026-02', to: '2026-01', rows: [] })),
    ).toEqual({ ok: false, errors: ['to (2026-01) is before from (2026-02)'] })
  })

  it('chunks: one link when it fits, whole contiguous years otherwise, --since honoured', async () => {
    const lines: BalanceLine[] = []
    for (const y of [2022, 2023, 2024])
      for (let m = 1; m <= 12; m++)
        for (let a = 0; a < 13; a++)
          lines.push(
            line(`${y}-${String(m).padStart(2, '0')}`, `Conto ${a}`, 'risparmi', (y * 1000 + m * 37 + a) * 101),
          )
    const one = await chunkBalancesPayloads(lines)
    expect(one.map((c) => `${c.payload.from}..${c.payload.to}`)).toEqual(['2022-01..2024-12'])
    const since = await chunkBalancesPayloads(lines, { since: '2024-03' })
    expect(since[0]!.payload).toMatchObject({ from: '2024-03', to: '2024-12' })
    expect(since[0]!.payload.lines).toHaveLength(10 * 13)
    const yearLen = (await chunkBalancesPayloads(lines, { since: '2023-01' })).at(-1)!.param.length
    const split = await chunkBalancesPayloads(lines, { maxParam: Math.ceil(yearLen * 0.75) })
    expect(split.map((c) => `${c.payload.from}..${c.payload.to}`)).toEqual([
      '2022-01..2022-12',
      '2023-01..2023-12',
      '2024-01..2024-12',
    ])
    await expect(chunkBalancesPayloads(lines, { since: '2030-01' })).rejects.toThrow('No rows')
  })
})

const stored = (month: string, account: string, group: BalanceLine['group'], balance: number): MoneyBalance => ({
  id: `${month}:${account}`,
  month,
  account,
  group,
  balance,
  updatedAt: 1,
})

describe('planBalancesImport', () => {
  it('replaces the covered months only, says per month what happens, and is idempotent', () => {
    const existing = [
      stored('2025-12', 'Fuori', 'liquidita', 7),
      stored('2026-01', 'A', 'liquidita', 100),
      stored('2026-01', 'Chiuso', 'risparmi', 50),
      stored('2026-02', 'A', 'liquidita', 200),
      stored('2026-03', 'A', 'liquidita', 300),
    ]
    const payload = {
      from: '2026-01',
      to: '2026-04',
      lines: [
        line('2026-01', 'A', 'liquidita', 100),
        line('2026-02', 'A', 'liquidita', 200),
        line('2026-04', 'A', 'liquidita', 400),
      ],
    }
    const plan = planBalancesImport(payload, existing, 9)
    expect(plan.months.map((m) => `${m.month} ${m.status} ${m.before}→${m.after}`)).toEqual([
      '2026-01 changed 150→100',
      '2026-02 unchanged 200→200',
      '2026-03 removed 300→null',
      '2026-04 added null→400',
    ])
    expect(plan.upserts).toEqual([{ ...stored('2026-04', 'A', 'liquidita', 400), updatedAt: 9 }])
    expect(plan.deletes.sort()).toEqual(['2026-01:Chiuso', '2026-03:A'])
    const after = existing.filter((r) => !plan.deletes.includes(r.id)).concat(plan.upserts)
    const again = planBalancesImport(payload, after, 10)
    expect(again.upserts.length + again.deletes.length).toBe(0)
  })

  it('a changed group or balance is an update', () => {
    const plan = planBalancesImport(
      { from: '2026-01', to: '2026-01', lines: [line('2026-01', 'A', 'risparmi', 100)] },
      [stored('2026-01', 'A', 'liquidita', 100)],
      5,
    )
    expect(plan.months[0]).toMatchObject({ status: 'changed', changed: 1 })
    expect(plan.upserts[0]).toMatchObject({ group: 'risparmi', updatedAt: 5 })
  })
})

describe('page figures', () => {
  const rows = [
    line('2025-01', 'Conto', 'liquidita', 100_00),
    line('2025-01', 'Fondo', 'investimenti', 500_00),
    line('2025-12', 'Conto', 'liquidita', 300_00),
    line('2025-12', 'Vecchio', 'liquidita', 40_00),
    line('2026-01', 'Conto', 'liquidita', 250_00),
    line('2026-01', 'Deposito', 'risparmi', 1000_00),
    line('2026-01', 'Fondo', 'investimenti', 700_00),
    line('2026-01', 'Vecchio', 'liquidita', 0),
  ]

  it('groups and totals, with the month before and a year before', () => {
    const s = monthSummary(rows, '2026-01')
    expect(s.now).toEqual({ liquidita: 250_00, risparmi: 1000_00, investimenti: 700_00, total: 1950_00 })
    expect(s.prev).toEqual({ liquidita: 340_00, risparmi: 0, investimenti: 0, total: 340_00 })
    expect(s.yearAgo).toEqual({ liquidita: 100_00, risparmi: 0, investimenti: 500_00, total: 600_00 })
    expect(monthSummary(rows, '2025-01').prev).toBeNull()
  })

  it('history covers every month, gaps as null', () => {
    const h = balanceHistory(rows)
    expect(h).toHaveLength(13)
    expect(h[0]!.totals?.total).toBe(600_00)
    expect(h[1]!.totals).toBeNull()
    expect(h[12]!.totals?.total).toBe(1950_00)
  })

  it('account rows: by group then balance, with change vs the month before (null when new)', () => {
    expect(accountRows(rows, '2026-01')).toEqual([
      { account: 'Conto', group: 'liquidita', balance: 250_00, change: -50_00 },
      { account: 'Vecchio', group: 'liquidita', balance: 0, change: -40_00 },
      { account: 'Deposito', group: 'risparmi', balance: 1000_00, change: null },
      { account: 'Fondo', group: 'investimenti', balance: 700_00, change: null },
    ])
  })

  it('signed euros', () => {
    expect(signedEuro(123_40)).toMatch(/^\+123\s€$/)
    expect(signedEuro(-5_00)).toMatch(/^−5\s€$/)
    expect(signedEuro(20)).toMatch(/^0\s€$/)
  })
})

describe('applyBalancesImport (local-first, signed out)', () => {
  beforeEach(resetDb)
  afterEach(() => drain(async () => String(await db.outbox.count())))

  const ops = async () =>
    (await db.outbox.toArray()).filter((o) => o.table === 'money_balances').map((o) => `${o.op} ${o.rowId}`)

  it('writes and queues the rows, replaces only the covered months, and a second run writes nothing', async () => {
    await applyBalancesImport({
      from: '2025-12',
      to: '2026-01',
      lines: [
        line('2025-12', 'Tieni', 'liquidita', 1),
        line('2026-01', 'A', 'risparmi', 100),
        line('2026-01', 'Via', 'liquidita', 5),
      ],
    })
    expect(await ops()).toEqual(['upsert 2025-12:Tieni', 'upsert 2026-01:A', 'upsert 2026-01:Via'])
    const payload = { from: '2026-01', to: '2026-01', lines: [line('2026-01', 'A', 'risparmi', 150)] }
    await applyBalancesImport(payload)
    expect((await db.moneyBalances.toArray()).map((r) => `${r.id} ${r.balance}`).sort()).toEqual([
      '2025-12:Tieni 1',
      '2026-01:A 150',
    ])
    expect(await ops()).toContain('delete 2026-01:Via')
    const again = await applyBalancesImport(payload)
    expect(again.upserts.length + again.deletes.length).toBe(0)
  })
})
