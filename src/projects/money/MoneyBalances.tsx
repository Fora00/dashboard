import { useMemo, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, type MoneyBalance } from '../../lib/db'
import { Card } from '../../components/Card'
import { EmptyState } from '../../components/EmptyState'
import { PageHeader } from '../../components/PageHeader'
import { SectionTitle } from '../../components/SectionTitle'
import { Stat } from '../../components/Stat'
import { SELECT } from '../../components/field'
import { BalancesChart } from './BalancesChart'
import { BALANCE_GROUPS } from './balancesCsv'
import {
  GROUP_BG,
  GROUP_LABEL,
  accountRows,
  balanceHistory,
  monthSummary,
  signedEuro,
  type GroupTotals,
} from './balancesStats'
import { monthLabel } from './moneyPeriod'
import { euro } from './moneyStats'

// Soldi Patrimonio (/soldi/patrimonio, MO17): month-end balances per
// GreenBooks account, mirrored from ~/life/money/data/account-balances.csv by
// the import link (npm run life:money-balances-link → /soldi/patrimonio/import).
// Read-only here: the CSV is the source of truth. Local-first: reads Dexie,
// works offline and signed out.

export function MoneyBalances() {
  const rows = useLiveQuery(() => db.moneyBalances.toArray())
  return (
    <div>
      <PageHeader
        emoji="🏦"
        title="Patrimonio"
        subtitle="Saldi di fine mese dei conti GreenBooks."
        back={{ to: '/soldi', label: 'Soldi' }}
      />
      {rows === undefined ? null : rows.length === 0 ? (
        <EmptyState
          emoji="🏦"
          title="Ancora nessun saldo"
          hint="Apri il link stampato da npm run life:money-balances-link (in ~/life) per importare i saldi di fine mese."
        />
      ) : (
        <BalancesBody rows={rows} />
      )}
    </div>
  )
}

function BalancesBody({ rows }: { rows: MoneyBalance[] }) {
  const history = useMemo(() => balanceHistory(rows), [rows])
  const withData = useMemo(() => history.filter((h) => h.totals).map((h) => h.month), [history])
  const newest = withData[withData.length - 1]!
  const [picked, setPicked] = useState<string | null>(null)
  const month = picked && withData.includes(picked) ? picked : newest
  const [showZero, setShowZero] = useState(false)

  const summary = useMemo(() => monthSummary(rows, month), [rows, month])
  const accounts = useMemo(() => accountRows(rows, month), [rows, month])
  const zero = accounts.filter((a) => a.balance === 0).length
  const shown = showZero ? accounts : accounts.filter((a) => a.balance !== 0)

  const sub = (k: keyof GroupTotals) =>
    [
      summary.prev ? `mese prima ${signedEuro(summary.now[k] - summary.prev[k])}` : null,
      summary.yearAgo ? `anno prima ${signedEuro(summary.now[k] - summary.yearAgo[k])}` : null,
    ]
      .filter(Boolean)
      .join(' · ') || undefined

  return (
    <div className="space-y-6">
      <label className="flex flex-wrap items-center gap-2 text-sm">
        <span className="text-slate-600 dark:text-slate-300">Mese</span>
        <select className={SELECT} value={month} onChange={(e) => setPicked(e.target.value)} aria-label="Mese">
          {[...withData].reverse().map((m) => (
            <option key={m} value={m}>
              {monthLabel(m)}
            </option>
          ))}
        </select>
      </label>

      <section aria-label="Totali" className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat label="totale" value={euro(summary.now.total)} sub={sub('total')} />
        {BALANCE_GROUPS.map((g) => (
          <Stat key={g} label={GROUP_LABEL[g]} value={euro(summary.now[g])} sub={sub(g)} />
        ))}
      </section>

      <section aria-label="Andamento">
        <SectionTitle>Andamento</SectionTitle>
        <Card>
          <BalancesChart history={history} selected={month} />
        </Card>
      </section>

      <section aria-label="Conti">
        <SectionTitle>Conti a fine {monthLabel(month)}</SectionTitle>
        <Card className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
                <th className="px-3 py-2 font-medium">Conto</th>
                <th className="px-3 py-2 text-right font-medium">Saldo</th>
                <th className="px-3 py-2 text-right font-medium">vs mese prima</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((a) => (
                <tr key={a.account} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                  <td className="px-3 py-2">
                    <span className="block">{a.account}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      <span className={`mr-1 inline-block h-2 w-2 rounded-sm ${GROUP_BG[a.group]}`} />
                      {GROUP_LABEL[a.group]}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums">{euro(a.balance)}</td>
                  <td className="px-3 py-2 text-right text-slate-600 tabular-nums dark:text-slate-300">
                    {a.change === null ? '—' : signedEuro(a.change)}
                  </td>
                </tr>
              ))}
              {shown.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-3 py-3 text-slate-500 dark:text-slate-400">
                    Nessun conto con saldo diverso da zero.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
        {zero > 0 && (
          <button
            type="button"
            className="mt-1 min-h-10 text-sm text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
            onClick={() => setShowZero(!showZero)}
          >
            {showZero ? 'Nascondi conti a zero' : `Mostra conti a zero (${zero})`}
          </button>
        )}
      </section>

      <p className="text-sm text-slate-600 dark:text-slate-300" data-testid="balances-invest-note">
        Investimenti: quanto ci hai messo, non il valore di mercato.
      </p>
    </div>
  )
}
