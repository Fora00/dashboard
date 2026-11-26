import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { db, resetDb } from '../test/fakeDb'
import { drain } from '../test/drain'
import { applyMoneyImport, pickMoneyBudget, removeMoneyBudget, saveMoneyBudget } from './moneySync'

// Soldi import writer: local-first (Dexie + outbox, no session needed). Invented figures.

beforeEach(resetDb)
afterEach(() => drain(async () => String(await db.outbox.count())))

const ops = async () =>
  (await db.outbox.toArray()).filter((o) => o.table === 'money_totals').map((o) => `${o.op} ${o.rowId}`)

const line = (month: string, category: string, amount: number) => ({
  month,
  category,
  kind: 'spend' as const,
  amount,
  budget: null,
})

describe('applyMoneyImport', () => {
  it('writes the rows and queues them; a second run writes nothing', async () => {
    const payload = { from: '2025-01', to: '2025-01', lines: [line('2025-01', 'A', -100), line('2025-01', 'B', -200)] }
    const plan = await applyMoneyImport(payload)
    expect(plan.upserts).toHaveLength(2)
    expect(await db.moneyTotals.get('2025-01:A')).toMatchObject({ amount: -100, kind: 'spend' })
    expect(await ops()).toEqual(['upsert 2025-01:A', 'upsert 2025-01:B'])
    const again = await applyMoneyImport(payload)
    expect(again.upserts.length + again.deletes.length).toBe(0)
    expect(await ops()).toHaveLength(2)
  })

  it('replaces the covered months only: a vanished category is deleted, other months stay', async () => {
    await applyMoneyImport({
      from: '2024-12',
      to: '2025-01',
      lines: [line('2024-12', 'Keep', -1), line('2025-01', 'A', -100), line('2025-01', 'Gone', -5)],
    })
    await applyMoneyImport({ from: '2025-01', to: '2025-01', lines: [line('2025-01', 'A', -150)] })
    expect((await db.moneyTotals.toArray()).map((r) => `${r.id} ${r.amount}`).sort()).toEqual([
      '2024-12:Keep -1',
      '2025-01:A -150',
    ])
    expect(await ops()).toContain('delete 2025-01:Gone')
  })
})

describe('dashboard budgets (MO8), offline and signed out', () => {
  it('saving truncates the earlier rule, picks "dashboard" where GreenBooks differs, and queues both', async () => {
    await applyMoneyImport({
      from: '2026-11',
      to: '2026-12',
      lines: [
        { ...line('2026-11', 'Food', -100), budget: -15000 },
        { ...line('2026-12', 'Food', -100), budget: -15000 },
      ],
    })
    const first = await saveMoneyBudget({ category: 'Food', monthly: 10000, from: '2026-01', to: null })
    const second = await saveMoneyBudget({ category: 'Food', monthly: 12000, from: '2026-12', to: null })
    expect(await db.moneyBudgets.get(first.id)).toMatchObject({ to: '2026-11' })
    expect(await db.moneyBudgets.get(second.id)).toMatchObject({ monthly: 12000, from: '2026-12', to: null })
    expect(await db.moneyBudgetChoices.get('2026-12:Food')).toMatchObject({
      pick: 'dashboard',
      gb: -15000,
      dash: 12000,
    })
    // The first save picked November too, against its own amount.
    expect(await db.moneyBudgetChoices.get('2026-11:Food')).toMatchObject({ pick: 'dashboard', dash: 10000 })
    const queued = (await db.outbox.toArray()).map((o) => o.table)
    expect(queued).toContain('money_budgets')
    expect(queued).toContain('money_budget_choices')

    await pickMoneyBudget('Food', [{ month: '2026-12', gb: -15000, dash: 12000 }], 'greenbooks')
    expect(await db.moneyBudgetChoices.get('2026-12:Food')).toMatchObject({ pick: 'greenbooks' })
    await removeMoneyBudget(second.id)
    expect(await db.moneyBudgets.get(second.id)).toBeUndefined()
  })
})
