import { db, type MoneyKind, type MoneyTotal } from '../../lib/db'
import { lineKey } from './moneyCsv'

// Dev-only demo for Soldi (seeded by src/lib/devDemo.ts): invented categories
// and figures, NOT anyone's real money. Two full years plus the current year
// to date, with a budget on some categories (one only from October of the
// current year), one over-budget month pattern, a few one-offs, gifts that are
// income in odd years (kind auto) and a loan that comes back.

const RECURRING: [string, number, number | null][] = [
  ['Affitto', 70000, 70000],
  ['Spesa', 32000, 30000],
  ['Ristoranti', 14000, 12000],
  ['Trasporti', 9000, null],
  ['Sport', 6000, 6000],
  ['Abbonamenti', 3500, 4000],
  ['Svago | Libri', 2500, null],
]

export async function seedDemoMoney(): Promise<void> {
  const now = new Date()
  const rows: MoneyTotal[] = []
  // Deterministic wobble so the demo looks the same on every reset.
  const wobble = (i: number, amp: number) => Math.round(Math.sin(i * 1.7) * amp)
  const add = (month: string, category: string, kind: MoneyKind, amount: number, budget: number | null) =>
    rows.push({ id: lineKey(month, category), month, category, kind, amount, budget, updatedAt: 1 })
  for (let y = now.getFullYear() - 2; y <= now.getFullYear(); y++) {
    const lastM = y === now.getFullYear() ? now.getMonth() + 1 : 12
    for (let m = 1; m <= lastM; m++) {
      const month = `${y}-${String(m).padStart(2, '0')}`
      const i = y * 12 + m
      add(month, 'Stipendio', 'income', 210000 + (y - now.getFullYear() + 2) * 8000, null)
      if (m === 12) add(month, 'Tredicesima', 'income', 180000, null)
      RECURRING.forEach(([cat, base, budget], k) => {
        add(month, cat, 'auto', -(base + wobble(i + k, base * 0.25)), budget === null ? null : -budget)
      })
      // A budget that starts mid-year (October of the current year), as in real use.
      const lateBudget = y === now.getFullYear() && m >= 10 ? -2000 : null
      add(month, 'Caffè', 'auto', -(1800 + wobble(i, 300)), lateBudget)
      // Gifts: given most months, a lot received in December of odd years (income that year).
      add(month, 'Regali', 'auto', m === 12 && y % 2 === 1 ? 60000 : -3000, null)
      if (m === 8) add(month, 'Viaggi', 'oneoff', -(150000 + wobble(i, 30000)), null)
      if (m === 3 && y % 2 === 0) add(month, 'Computer', 'oneoff', -120000, null)
      if (m === 5) add(month, 'Prestiti *Debiti', 'pass', -50000, null)
      if (m === 7) add(month, 'Prestiti *Debiti', 'pass', 50000, null)
    }
  }
  await db.moneyTotals.bulkPut(rows)
}
