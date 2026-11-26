import { useMemo, useState } from 'react'
import { Card } from '../../components/Card'
import { SectionTitle } from '../../components/SectionTitle'
import { Stat } from '../../components/Stat'
import { SELECT } from '../../components/field'
import { MoneyTrendChart } from './MoneyTrendChart'
import { MONTHS_IT, periodLabel } from './moneyPeriod'
import { euro, keptOf, monthlyTotals, outOf, type Line } from './moneyStats'
import {
  WINDOWS,
  categoryMovers,
  cumulativeKept,
  movingAverage,
  pctLabel,
  spendSeries,
  superTotal,
  yearOnYear,
  type Mover,
  type Window,
} from './moneyTrends'

// Soldi → Andamento (MO7): the whole history, not the period picked on the
// other views. Super total, spend with its moving average, the moving average
// against a year before, and the categories that rose or fell most. One-offs
// are left out unless asked: they are spikes that hide the trend.

const FIRST = 5

export function MoneyTrends({ lines, months }: { lines: Line[]; months: string[] }) {
  const [win, setWin] = useState<Window>(3)
  const [withOneoff, setOneoff] = useState(false)
  const range = { from: months[0]!, to: months[months.length - 1]! }
  const series = useMemo(
    () => monthlyTotals(lines, { from: months[0]!, to: months[months.length - 1]! }),
    [lines, months],
  )
  const spend = useMemo(() => spendSeries(lines, months, withOneoff), [lines, months, withOneoff])
  const ma = useMemo(() => movingAverage(spend, win), [spend, win])
  const yoy = useMemo(() => yearOnYear(ma), [ma])
  const cumulative = useMemo(() => cumulativeKept(series), [series])
  const movers = useMemo(() => categoryMovers(lines, months, win, withOneoff), [lines, months, win, withOneoff])
  const { total, perMonth } = useMemo(() => superTotal(lines, months.length), [lines, months.length])
  const kept = keptOf(total)
  const rate = total.income > 0 ? Math.round((kept / total.income) * 100) : null
  const spendWord = withOneoff ? 'uscite (con una tantum)' : 'uscite ricorrenti'

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-3">
        <div className="text-xs text-slate-500 dark:text-slate-400">
          <label htmlFor="money-window">Finestra</label>
          <select
            id="money-window"
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
        <label className="flex min-h-10 items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          <input
            type="checkbox"
            className="size-5 shrink-0"
            checked={withOneoff}
            onChange={(e) => setOneoff(e.target.checked)}
          />
          Includi le una tantum
        </label>
      </div>

      <section aria-label="Super totale">
        <SectionTitle>
          Super totale · {periodLabel(range)} ({months.length} mesi)
        </SectionTitle>
        <div className="grid grid-cols-2 gap-2 text-center sm:grid-cols-3 lg:grid-cols-5">
          <Stat label="entrate" value={euro(total.income)} sub={`al mese: ${euro(perMonth.income)}`} />
          <Stat label="uscite" value={euro(outOf(total))} sub={`al mese: ${euro(outOf(perMonth))}`} />
          <Stat
            label={`messo da parte${rate !== null ? ` · ${rate}%` : ''}`}
            value={euro(kept)}
            sub={`al mese: ${euro(keptOf(perMonth))}`}
          />
          <Stat label="uscite senza una tantum" value={euro(total.spend)} sub={`al mese: ${euro(perMonth.spend)}`} />
          <Stat label="una tantum" value={euro(total.oneoff)} sub={`al mese: ${euro(perMonth.oneoff)}`} />
        </div>
        <Card className="mt-3">
          <MoneyTrendChart
            title="Messo da parte cumulato"
            months={months}
            line={{ label: 'messo da parte, cumulato', values: cumulative }}
            format={euro}
          />
        </Card>
      </section>

      <section aria-label="Media mobile">
        <SectionTitle>Uscite mese per mese e media a {win} mesi</SectionTitle>
        <Card>
          <MoneyTrendChart
            title={`Uscite e media mobile a ${win} mesi`}
            months={months}
            line={{ label: `media a ${win} mesi`, values: ma }}
            bars={{ label: spendWord, values: spend }}
            fit
            format={euro}
          />
        </Card>
      </section>

      <section aria-label="Anno su anno">
        <SectionTitle>Anno su anno · media a {win} mesi contro un anno prima</SectionTitle>
        <Card>
          <YearOnYear months={months} pct={yoy} ma={ma} />
        </Card>
      </section>

      <section aria-label="Categorie in movimento">
        <SectionTitle>Categorie in salita e in discesa</SectionTitle>
        <Card>
          {movers === null ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Servono almeno {2 * win} mesi di dati per confrontare due finestre da {win}.
            </p>
          ) : (
            <>
              <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
                {spendWord}: {periodLabel(movers.recent)} contro {periodLabel(movers.before)}.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <Movers title="In salita" rows={movers.rising} up />
                <Movers title="In discesa" rows={movers.falling} up={false} />
              </div>
            </>
          )}
        </Card>
      </section>
    </div>
  )
}

function Movers({ title, rows, up }: { title: string; rows: Mover[]; up: boolean }) {
  const [all, setAll] = useState(false)
  const shown = all ? rows : rows.slice(0, FIRST)
  return (
    <div data-testid={up ? 'money-rising' : 'money-falling'}>
      <h3 className="mb-1 text-sm font-medium">{title}</h3>
      {rows.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">Nessuna.</p>
      ) : (
        <ul className="divide-y divide-slate-100 text-sm dark:divide-slate-800">
          {shown.map((m) => (
            <li key={m.category} className="flex items-baseline justify-between gap-3 py-1.5">
              <span className="min-w-0 truncate">{m.category}</span>
              <span className="shrink-0 text-right tabular-nums">
                <span
                  className={
                    up
                      ? 'font-semibold text-orange-700 dark:text-orange-400'
                      : 'font-semibold text-sky-700 dark:text-sky-400'
                  }
                >
                  {up ? '▲' : '▼'} {euro(Math.abs(m.delta))}
                </span>
                <span className="ml-1.5 text-xs text-slate-500 dark:text-slate-400">
                  {euro(m.before)} → {euro(m.recent)}
                  {m.pct !== null && ` (${m.pct > 0 ? '+' : ''}${m.pct}%)`}
                </span>
              </span>
            </li>
          ))}
        </ul>
      )}
      {rows.length > FIRST && (
        <button
          type="button"
          onClick={() => setAll(!all)}
          className="min-h-10 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
        >
          {all ? 'Mostra meno' : `Mostra tutte (${rows.length})`}
        </button>
      )}
    </div>
  )
}

// Diverging bars of the percent change: above the line (orange, ▲) = spending
// more than a year before, below (sky, ▼) = less. Side and arrow carry the
// meaning, colour repeats it.
const YH = 120
const YPAD = 14

function YearOnYear({ months, pct, ma }: { months: string[]; pct: (number | null)[]; ma: (number | null)[] }) {
  const [active, setActive] = useState<number | null>(null)
  const start = pct.findIndex((p) => p !== null)
  if (start < 0) {
    return <p className="text-sm text-slate-500 dark:text-slate-400">Serve più di un anno di dati.</p>
  }
  const ms = months.slice(start)
  const ps = pct.slice(start)
  const vals = ps.filter((p): p is number => p !== null)
  // At least ±5% so a 1% change looks like one.
  const max = Math.max(5, ...vals)
  const min = Math.min(-5, ...vals)
  const range = max - min
  const zero = YPAD + (max / range) * YH
  const px = (v: number) => (Math.abs(v) / range) * YH
  const every = Math.ceil(ms.length / 8)
  const name = (m: string) => `${MONTHS_IT[Number(m.slice(5, 7)) - 1]} ${m.slice(2, 4)}`
  return (
    <div>
      <p className="mb-2 text-xs text-slate-600 dark:text-slate-300">
        <span className="mr-1 inline-block size-2.5 rounded-sm bg-orange-600" />▲ sopra = speso di più
        <span className="mr-1 ml-3 inline-block size-2.5 rounded-sm bg-sky-600" />▼ sotto = speso di meno
      </p>
      <div className="relative" style={{ height: YH + 2 * YPAD + 18 }} onMouseLeave={() => setActive(null)}>
        <div
          className="absolute inset-x-0 border-t border-slate-400 dark:border-slate-500"
          style={{ top: zero }}
          aria-hidden="true"
        />
        <span
          className="pointer-events-none absolute left-0 text-[10px] text-slate-500 tabular-nums dark:text-slate-400"
          style={{ top: YPAD - 12 }}
        >
          {pctLabel(Math.round(max))}
        </span>
        <span
          className="pointer-events-none absolute left-0 text-[10px] text-slate-500 tabular-nums dark:text-slate-400"
          style={{ top: YPAD + YH + 1 }}
        >
          {pctLabel(Math.round(min))}
        </span>
        <div className="absolute inset-0 flex">
          {ms.map((m, i) => {
            const p = ps[i] ?? null
            const h = p === null ? 0 : Math.max(1, px(p))
            const desc = p === null ? 'nessun dato' : pctLabel(p)
            return (
              <button
                key={m}
                type="button"
                className="relative h-full min-w-0 flex-1 rounded-md hover:bg-slate-100 focus-visible:bg-slate-100 focus-visible:outline-none dark:hover:bg-slate-800 dark:focus-visible:bg-slate-800"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                onClick={() => setActive(active === i ? null : i)}
                aria-label={`${name(m)}: ${desc} rispetto a un anno prima`}
              >
                {p !== null && (
                  <span
                    className={`absolute left-[20%] w-[60%] ${p > 0 ? 'rounded-t bg-orange-600' : 'rounded-b bg-sky-600'}`}
                    style={{ top: p > 0 ? zero - h : zero, height: h }}
                  />
                )}
                {i % every === 0 && (
                  <span className="absolute inset-x-0 bottom-0 text-center text-[10px] whitespace-nowrap text-slate-500 dark:text-slate-400">
                    {name(m)}
                  </span>
                )}
              </button>
            )
          })}
        </div>
        {active !== null && ms[active] && (
          <div
            role="status"
            className="pointer-events-none absolute top-0 z-10 w-52 rounded-lg border border-slate-200 bg-white p-2 text-xs shadow-md dark:border-slate-700 dark:bg-slate-900"
            style={{ left: `clamp(0px, calc(${((active + 0.5) / ms.length) * 100}% - 6.5rem), calc(100% - 13rem))` }}
          >
            <p className="mb-1 font-medium">{name(ms[active])}</p>
            <p className="tabular-nums">
              {(() => {
                const p = ps[active]
                const now = ma[start + active]
                const before = ma[start + active - 12]
                if (p === null || p === undefined || now == null || before == null) return 'nessun dato'
                return `${p > 0 ? '▲ ' : p < 0 ? '▼ ' : ''}${pctLabel(p)} · ${euro(before)} → ${euro(now)} al mese`
              })()}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
