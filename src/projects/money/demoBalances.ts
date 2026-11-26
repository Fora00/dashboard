import { db, type BalanceGroup, type MoneyBalance } from '../../lib/db'
import { balanceKey } from './balancesCsv'

// Dev-only demo for Soldi Patrimonio (seeded by src/lib/devDemo.ts): invented
// accounts and balances, NOT anyone's real money. Month-end balances from
// January two years ago to this month: two current accounts and cash
// (liquidità), a savings account and an emergency fund (risparmi), a fund and a
// pension plan fed every month (investimenti), and an old account closed in the
// first year that stays at zero afterwards (hidden from the table unless asked).

type Account = [name: string, group: BalanceGroup, start: number, perMonth: number]

const ACCOUNTS: Account[] = [
  ['Conto corrente demo', 'liquidita', 250000, 4000],
  ['Carta prepagata demo', 'liquidita', 30000, 0],
  ['Contanti', 'liquidita', 15000, 0],
  ['Conto deposito demo', 'risparmi', 500000, 15000],
  ['Fondo emergenze demo', 'risparmi', 300000, 5000],
  ['Fondo azionario demo', 'investimenti', 200000, 20000],
  ['Fondo pensione demo', 'investimenti', 400000, 10000],
]

export async function seedDemoBalances(): Promise<void> {
  const now = new Date()
  const rows: MoneyBalance[] = []
  const wobble = (i: number, amp: number) => Math.round(Math.sin(i * 1.3) * amp)
  const add = (month: string, account: string, group: BalanceGroup, balance: number) =>
    rows.push({ id: balanceKey(month, account), month, account, group, balance, updatedAt: 1 })
  let i = 0
  for (let y = now.getFullYear() - 2; y <= now.getFullYear(); y++) {
    const lastM = y === now.getFullYear() ? now.getMonth() + 1 : 12
    for (let m = 1; m <= lastM; m++, i++) {
      const month = `${y}-${String(m).padStart(2, '0')}`
      for (const [name, group, start, perMonth] of ACCOUNTS) {
        const amp = group === 'liquidita' ? start * 0.2 : 0
        add(month, name, group, start + perMonth * i + wobble(i + name.length, amp))
      }
      // An old account emptied in June of the first year, then closed at zero.
      add(month, 'Vecchio conto demo', 'liquidita', i < 5 ? 80000 - i * 15000 : 0)
    }
  }
  await db.moneyBalances.bulkPut(rows)
}
