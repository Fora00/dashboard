import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../lib/db'
import { sync } from '../../lib/moneySync'
import { Card } from '../../components/Card'
import { EmptyState } from '../../components/EmptyState'
import { PageHeader } from '../../components/PageHeader'
import { SectionTitle } from '../../components/SectionTitle'
import { SegmentedTabs } from '../../components/SegmentedTabs'
import { Stat } from '../../components/Stat'
import { SyncCard } from '../../components/SyncCard'
import { SELECT } from '../../components/field'
import { MoneyCategories } from './MoneyCategories'
import { MoneyMonthChart } from './MoneyMonthChart'
import {
  MONTHS_IT,
  budgetMonthsLabel,
  categoryRows,
  euro,
  keptOf,
  lastMonthOf,
  monthlyTotals,
  outOf,
  pctChange,
  periodLabel,
  periodLines,
  totalsOf,
  yearsOf,
  type CategoryRow,
  type Line,
  type Totals,
} from './moneyStats'

// Soldi (/soldi): monthly totals per GreenBooks category, mirrored from
// ~/life/money/data/monthly-totals.csv by the import link (npm run
// life:money-link → /soldi/import). Read-only here: the CSV is the source of
// truth. Local-first: reads Dexie, works offline and signed out.

type View = 'charts' | 'table'

export function Money() {
  const lines = useLiveQuery(() => db.moneyTotals.toArray())
  return (
    <div>
      <PageHeader emoji="💶" title="Soldi" subtitle="Entrate, uscite e messo da parte, da GreenBooks." />
      <SyncCard sync={sync} />
      {lines === undefined ? null : lines.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            emoji="💶"
            title="Ancora nessun dato"
            hint="Apri il link stampato da npm run life:money-link (in ~/life) per importare i totali mensili."
          />
        </div>
      ) : (
        <MoneyBody lines={lines} />
      )}
    </div>
  )
}

function MoneyBody({ lines }: { lines: Line[] }) {
  const years = useMemo(() => yearsOf(lines), [lines])
  const [yearPick, setYear] = useState<number | null>(null)
  const [comparePick, setCompare] = useState<number | 'none' | null>(null)
  const [view, setView] = useState<View>('charts')
  const year = yearPick !== null && years.includes(yearPick) ? yearPick : years[0]!
  const fallbackCompare = years.find((y) => y < year) ?? null
  const compareYear =
    comparePick === 'none'
      ? null
      : comparePick !== null && years.includes(comparePick) && comparePick !== year
        ? comparePick
        : fallbackCompare

  const last = lastMonthOf(lines, year)
  const t = useMemo(() => totalsOf(periodLines(lines, year, last)), [lines, year, last])
  const ct = useMemo(
    () => (compareYear === null ? null : totalsOf(periodLines(lines, compareYear, last))),
    [lines, compareYear, last],
  )
  const months = useMemo(() => monthlyTotals(lines, year), [lines, year])
  const cmonths = useMemo(() => (compareYear === null ? null : monthlyTotals(lines, compareYear)), [lines, compareYear])
  const rows = useMemo(
    () => ({
      spend: categoryRows(lines, 'spend', year, last, compareYear),
      oneoff: categoryRows(lines, 'oneoff', year, last, compareYear),
      income: categoryRows(lines, 'income', year, last, compareYear),
      pass: categoryRows(lines, 'pass', year, last, compareYear),
    }),
    [lines, year, last, compareYear],
  )
  const partial = last < 12

  return (
    <div className="mt-6 space-y-6">
      <div className="flex flex-wrap items-end gap-3">
        <label className="text-xs text-slate-500 dark:text-slate-400">
          Anno
          <select
            className={`${SELECT} mt-1 block w-32`}
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs text-slate-500 dark:text-slate-400">
          Confronta con
          <select
            className={`${SELECT} mt-1 block w-36`}
            value={compareYear ?? 'none'}
            onChange={(e) => setCompare(e.target.value === 'none' ? 'none' : Number(e.target.value))}
          >
            <option value="none">nessuno</option>
            {years
              .filter((y) => y !== year)
              .map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
          </select>
        </label>
        <div className="ml-auto w-full sm:w-64">
          <SegmentedTabs
            label="Vista"
            kind="choice"
            options={[
              { id: 'charts', label: 'Grafici' },
              { id: 'table', label: 'Vedi come tabella' },
            ]}
            value={view}
            onChange={setView}
          />
        </div>
      </div>

      <section aria-label="Totali">
        <SectionTitle>
          {periodLabel(year, last)}
          {partial && compareYear !== null ? ` · confronto con ${periodLabel(compareYear, last)}` : ''}
        </SectionTitle>
        <Tiles t={t} ct={ct} compareYear={compareYear} />
      </section>

      {view === 'charts' ? (
        <>
          <section aria-label="Mese per mese">
            <SectionTitle>Messo da parte, mese per mese</SectionTitle>
            <Card>
              <MoneyMonthChart year={year} months={months} compareYear={compareYear} compare={cmonths} />
            </Card>
          </section>
          <section aria-label="Uscite per categoria">
            <SectionTitle>Uscite per categoria · speso e budget ({periodLabel(year, last)})</SectionTitle>
            <Card>
              <MoneyCategories rows={rows.spend} compareYear={compareYear} empty="Nessuna uscita nel periodo." />
            </Card>
          </section>
          <section aria-label="Una tantum">
            <SectionTitle>Una tantum (scala propria)</SectionTitle>
            <Card>
              <MoneyCategories
                rows={rows.oneoff}
                compareYear={compareYear}
                empty="Nessuna spesa una tantum nel periodo."
              />
            </Card>
          </section>
        </>
      ) : (
        <Tables year={year} compareYear={compareYear} months={months} cmonths={cmonths} rows={rows} />
      )}

      <PassBlock rows={rows.pass} compareYear={compareYear} />

      <p className="text-xs text-slate-500 dark:text-slate-400">
        Dati da <code>monthly-totals.csv</code>: aggiorna con <code>npm run life:money-link</code> e apri il link (
        <Link to="/soldi/import" className="underline">
          importa
        </Link>
        ).
      </p>
    </div>
  )
}

function vs(now: number, before: number | undefined, compareYear: number | null): string | undefined {
  if (before === undefined || compareYear === null) return undefined
  const p = pctChange(now, before)
  return `${compareYear}: ${euro(before)}${p ? ` (${p})` : ''}`
}

function Tiles({ t, ct, compareYear }: { t: Totals; ct: Totals | null; compareYear: number | null }) {
  const kept = keptOf(t)
  const rate = t.income > 0 ? Math.round((kept / t.income) * 100) : null
  return (
    <div className="grid grid-cols-2 gap-2 text-center sm:grid-cols-3 lg:grid-cols-5">
      <Stat label="entrate" value={euro(t.income)} sub={vs(t.income, ct?.income, compareYear)} />
      <Stat label="uscite" value={euro(outOf(t))} sub={vs(outOf(t), ct ? outOf(ct) : undefined, compareYear)} />
      <Stat
        label={`messo da parte${rate !== null ? ` · ${rate}%` : ''}`}
        value={euro(kept)}
        sub={vs(kept, ct ? keptOf(ct) : undefined, compareYear)}
      />
      <Stat label="uscite senza una tantum" value={euro(t.spend)} sub={vs(t.spend, ct?.spend, compareYear)} />
      <Stat label="una tantum" value={euro(t.oneoff)} sub={vs(t.oneoff, ct?.oneoff, compareYear)} />
    </div>
  )
}

function PassBlock({ rows, compareYear }: { rows: CategoryRow[]; compareYear: number | null }) {
  if (rows.length === 0) return null
  return (
    <section aria-label="Prestiti e rimborsi">
      <SectionTitle>Prestiti e rimborsi (non contati)</SectionTitle>
      <Card className="space-y-1 text-sm">
        <p className="mb-2 text-xs text-slate-500 dark:text-slate-400">
          Soldi prestati o anticipati e poi resi: né entrate né uscite. Netto del periodo (+ rientrato, − uscito).
        </p>
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {rows.map((r) => (
            <li key={r.category} className="flex items-baseline justify-between gap-3 py-1">
              <span className="min-w-0 truncate">{r.category}</span>
              <span className="shrink-0 tabular-nums">
                {r.value > 0 ? '+' : ''}
                {euro(r.value)}
                {compareYear !== null && r.compare !== null && (
                  <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">
                    {compareYear}: {euro(r.compare)}
                  </span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </section>
  )
}

const TH_BASE = 'px-2 py-1.5 font-medium text-slate-500 dark:text-slate-400'
const TH = `${TH_BASE} text-right`
const TH_LEFT = `${TH_BASE} text-left`
const TD = 'px-2 py-1.5 text-right tabular-nums'

function Tables(props: {
  year: number
  compareYear: number | null
  months: (Totals | null)[]
  cmonths: (Totals | null)[] | null
  rows: Record<'spend' | 'oneoff' | 'income', CategoryRow[]>
}) {
  const { year, compareYear, months, cmonths, rows } = props
  const cell = (t: Totals | null, f: (x: Totals) => number) => (t ? euro(f(t)) : '—')
  const kinds: [string, CategoryRow[]][] = [
    ['entrata', rows.income],
    ['uscita', rows.spend],
    ['una tantum', rows.oneoff],
  ]
  return (
    <>
      <section aria-label="Tabella mesi">
        <SectionTitle>Mese per mese · {year}</SectionTitle>
        <Card className="overflow-x-auto p-0">
          <table className="w-full min-w-[34rem] text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className={TH_LEFT}>Mese</th>
                <th className={TH}>Entrate</th>
                <th className={TH}>Uscite</th>
                <th className={TH}>Una tantum</th>
                <th className={TH}>Messo da parte</th>
                {compareYear !== null && <th className={TH}>{compareYear}</th>}
              </tr>
            </thead>
            <tbody>
              {MONTHS_IT.map((m, i) => {
                const t = months[i] ?? null
                const c = cmonths?.[i] ?? null
                if (!t && !c) return null
                return (
                  <tr key={m} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                    <td className="px-2 py-1.5">{m}</td>
                    <td className={TD}>{cell(t, (x) => x.income)}</td>
                    <td className={TD}>{cell(t, (x) => x.spend)}</td>
                    <td className={TD}>{cell(t, (x) => x.oneoff)}</td>
                    <td className={`${TD} font-medium`}>{cell(t, keptOf)}</td>
                    {compareYear !== null && <td className={TD}>{cell(c, keptOf)}</td>}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </Card>
      </section>
      <section aria-label="Tabella categorie">
        <SectionTitle>Per categoria</SectionTitle>
        <Card className="overflow-x-auto p-0">
          <table className="w-full min-w-[34rem] text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className={TH_LEFT}>Categoria</th>
                <th className={TH_LEFT}>Tipo</th>
                <th className={TH}>{year}</th>
                <th className={TH}>Budget</th>
                <th className={TH}>Sforato</th>
                {compareYear !== null && <th className={TH}>{compareYear}</th>}
              </tr>
            </thead>
            <tbody>
              {kinds.flatMap(([kind, list]) =>
                list.map((r) => (
                  <tr
                    key={`${kind}:${r.category}`}
                    className="border-b border-slate-100 last:border-0 dark:border-slate-800"
                  >
                    <td className="px-2 py-1.5">{r.category}</td>
                    <td className="px-2 py-1.5 text-slate-500 dark:text-slate-400">{kind}</td>
                    <td className={TD}>{euro(r.value)}</td>
                    <td className={TD}>
                      {r.budget === null ? 'senza budget' : euro(r.budget)}
                      {budgetMonthsLabel(r) && (
                        <span className="text-slate-500 dark:text-slate-400"> ({budgetMonthsLabel(r)})</span>
                      )}
                    </td>
                    <td className={TD}>{r.over > 0 ? `▲ ${euro(r.over)}` : ''}</td>
                    {compareYear !== null && <td className={TD}>{r.compare === null ? '—' : euro(r.compare)}</td>}
                  </tr>
                )),
              )}
            </tbody>
          </table>
        </Card>
      </section>
    </>
  )
}
