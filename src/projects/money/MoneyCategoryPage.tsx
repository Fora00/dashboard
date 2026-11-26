import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../lib/db'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { EmptyState } from '../../components/EmptyState'
import { PageHeader } from '../../components/PageHeader'
import { SectionTitle } from '../../components/SectionTitle'
import { SELECT } from '../../components/field'
import { MoneyBudgetSheet } from './MoneyBudgetSheet'
import { MoneyTrendChart } from './MoneyTrendChart'
import { applyBudgets } from './moneyBudgets'
import { categoryHistory } from './moneyCategory'
import { MONTHS_IT, availableMonths, periodLabel, periodLines } from './moneyPeriod'
import { euro } from './moneyStats'
import { WINDOWS, movingAverage, pctLabel, type Window } from './moneyTrends'

// Soldi → one category (MO14), /soldi/categoria/:name: the whole history of
// one category with its moving average, its budget over time (months over
// marked in text), year by year with the change and its share of the year's
// recurring spend (or income). "Budget" opens the same sheet as /soldi, for
// the year to date. Local-first: Dexie only.

const short = (m: string) => `${MONTHS_IT[Number(m.slice(5, 7)) - 1]} ${m.slice(2, 4)}`

export function MoneyCategoryPage() {
  const { name = '' } = useParams()
  const category = name
  const totals = useLiveQuery(() => db.moneyTotals.toArray())
  const rules = useLiveQuery(() => db.moneyBudgets.toArray())
  const choices = useLiveQuery(() => db.moneyBudgetChoices.toArray())
  const [win, setWin] = useState<Window>(3)
  const [editing, setEditing] = useState(false)

  const data = useMemo(() => {
    if (!totals || !rules || !choices) return undefined
    const newest = totals.reduce((m, l) => (l.month > m ? l.month : m), '')
    const applied = applyBudgets(totals, rules, choices, newest)
    const months = availableMonths(applied.lines)
    return { applied, months, newest, history: categoryHistory(applied.lines, category, months) }
  }, [totals, rules, choices, category])
  const ma = useMemo(() => (data?.history ? movingAverage(data.history.values, win) : []), [data, win])

  const back = (
    <Link
      to="/soldi"
      className="inline-flex min-h-10 items-center text-sm text-slate-600 underline dark:text-slate-300"
    >
      ← Soldi
    </Link>
  )
  if (data === undefined) return null
  const h = data.history
  if (!h) {
    return (
      <div>
        {back}
        <PageHeader emoji="💶" title={category} />
        <EmptyState emoji="💶" title="Nessun dato per questa categoria" hint="Controlla il nome o importa i totali." />
      </div>
    )
  }
  const word = h.direction === 'in' ? 'entrate' : 'uscite'
  const year = data.newest.slice(0, 4)
  const ytd = { from: `${year}-01`, to: data.newest }
  const hasBudget = h.budgets.some((b) => b !== null)
  const budgetedMonths = h.budgets.filter((b) => b !== null).length

  return (
    <div>
      {back}
      <PageHeader
        emoji="💶"
        title={category}
        subtitle={`Storia completa · ${word} · ${periodLabel({ from: h.months[0]!, to: h.months[h.months.length - 1]! })}`}
      />
      <div className="mt-4 space-y-6">
        <div className="flex flex-wrap items-end gap-3">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            <label htmlFor="money-cat-window">Finestra</label>
            <select
              id="money-cat-window"
              className={`${SELECT} mt-1 block w-32`}
              value={win}
              onChange={(e) => setWin(Number(e.target.value) as Window)}
            >
              {WINDOWS.map((w) => (
                <option key={w} value={w}>
                  {w} mesi
                </option>
              ))}
            </select>
          </div>
          {h.direction === 'out' && (
            <Button variant="ghost" onClick={() => setEditing(true)}>
              Budget
            </Button>
          )}
        </div>

        <section aria-label="Mese per mese">
          <SectionTitle>
            {word} mese per mese e media a {win} mesi
          </SectionTitle>
          <Card>
            <MoneyTrendChart
              title={`${category}: ${word} e media a ${win} mesi`}
              months={h.months}
              line={{ label: `media a ${win} mesi`, values: ma }}
              bars={{ label: word, values: h.values }}
              fit
              format={euro}
            />
          </Card>
        </section>

        {hasBudget && (
          <section aria-label="Budget nel tempo">
            <SectionTitle>Budget nel tempo</SectionTitle>
            <Card>
              <MoneyTrendChart
                title={`${category}: budget e ${word}`}
                months={h.months}
                line={{ label: 'budget', values: h.budgets }}
                bars={{ label: word, values: h.values }}
                format={euro}
              />
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300" data-testid="money-cat-over">
                {h.overMonths.length === 0
                  ? `Mai sopra il budget (${budgetedMonths} ${budgetedMonths === 1 ? 'mese' : 'mesi'} con budget).`
                  : `▲ Sopra il budget in ${h.overMonths.length} ${h.overMonths.length === 1 ? 'mese' : 'mesi'} su ${budgetedMonths}: ${h.overMonths.map(short).join(', ')}.`}
              </p>
            </Card>
          </section>
        )}

        <section aria-label="Anno per anno">
          <SectionTitle>Anno per anno</SectionTitle>
          <Card className="overflow-x-auto p-0">
            <table className="w-full min-w-[30rem] text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400">
                  <th className="px-2 py-1.5 text-left font-medium">Anno</th>
                  <th className="px-2 py-1.5 text-right font-medium">Totale</th>
                  <th className="px-2 py-1.5 text-right font-medium">Al mese</th>
                  <th className="px-2 py-1.5 text-right font-medium">vs anno prima</th>
                  <th className="px-2 py-1.5 text-right font-medium">
                    Quota {h.direction === 'in' ? 'entrate' : 'uscite ricorrenti'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {h.years.map((y) => (
                  <tr key={y.year} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                    <td className="px-2 py-1.5">
                      {y.year}
                      {y.months < 12 && (
                        <span className="text-xs text-slate-500 dark:text-slate-400"> ({y.months} mesi)</span>
                      )}
                    </td>
                    <td className="px-2 py-1.5 text-right tabular-nums">{euro(y.total)}</td>
                    <td className="px-2 py-1.5 text-right tabular-nums">{euro(y.perMonth)}</td>
                    <td className="px-2 py-1.5 text-right tabular-nums">
                      {y.change === null
                        ? '—'
                        : `${y.change > 0 ? '▲ ' : y.change < 0 ? '▼ ' : ''}${pctLabel(y.change)}`}
                    </td>
                    <td className="px-2 py-1.5 text-right tabular-nums">
                      {y.share === null ? '—' : pctLabel(y.share).replace('+', '')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </section>
      </div>

      <MoneyBudgetSheet
        category={editing ? category : null}
        onClose={() => setEditing(false)}
        periodLabel={periodLabel(ytd)}
        gbLines={periodLines(totals ?? [], ytd).filter((l) => l.category === category)}
        rules={(rules ?? []).filter((r) => r.category === category)}
        conflicts={(data.applied.conflicts.get(category) ?? []).filter((c) => c.month >= ytd.from && c.month <= ytd.to)}
        months={data.months}
      />
    </div>
  )
}
