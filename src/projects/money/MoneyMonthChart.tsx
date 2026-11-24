import { useState } from 'react'
import { MONTHS_IT, euro, euroShort, keptOf, type Totals } from './moneyStats'

// Messo da parte per month as diverging bars around zero: the selected year
// filled, the compare year as a thinner outlined bar beside it. Positive =
// sky, negative = orange (validated for colour-blind separation in light and
// dark), and the bar's side of the zero line says the same thing, so colour is
// never the only cue. Plain HTML (not SVG) so labels keep their size on a
// phone. Hover, focus or tap a month for its entrate/uscite/una tantum.

const H = 160 // plot height in px, labels get PAD above and below
const PAD = 16

const POS = 'bg-sky-600'
const NEG = 'bg-orange-600'
const POS_CMP = 'border-sky-600 bg-sky-600/25'
const NEG_CMP = 'border-orange-600 bg-orange-600/25'

interface Props {
  year: number
  months: (Totals | null)[]
  compareYear: number | null
  compare: (Totals | null)[] | null
}

export function MoneyMonthChart({ year, months, compareYear, compare }: Props) {
  const [active, setActive] = useState<number | null>(null)
  const values = [...months, ...(compare ?? [])].filter((t): t is Totals => t !== null).map(keptOf)
  const max = Math.max(0, ...values)
  const min = Math.min(0, ...values)
  const range = max - min || 1
  const zero = PAD + (max / range) * H
  const px = (v: number) => (Math.abs(v) / range) * H

  return (
    <div>
      <p className="mb-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-300">
        <span>
          <span className={`mr-1 inline-block size-2.5 rounded-sm ${POS}`} />
          <span className={`mr-1 inline-block size-2.5 rounded-sm ${NEG}`} />
          {year} (sopra = messo da parte, sotto = speso più di quanto entrato)
        </span>
        {compareYear !== null && (
          <span>
            <span className={`mr-1 inline-block size-2.5 rounded-sm border ${POS_CMP}`} />
            <span className={`mr-1 inline-block size-2.5 rounded-sm border ${NEG_CMP}`} />
            {compareYear} (contorno)
          </span>
        )}
      </p>
      <div className="relative" style={{ height: H + 2 * PAD + 18 }} onMouseLeave={() => setActive(null)}>
        <div
          className="absolute inset-x-0 border-t border-slate-400 dark:border-slate-500"
          style={{ top: zero }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 flex">
          {MONTHS_IT.map((name, i) => {
            const t = months[i] ?? null
            const c = compare?.[i] ?? null
            const v = t ? keptOf(t) : null
            const cv = c ? keptOf(c) : null
            return (
              <button
                key={name}
                type="button"
                className="relative h-full flex-1 rounded-md hover:bg-slate-100 focus-visible:bg-slate-100 focus-visible:outline-none dark:hover:bg-slate-800 dark:focus-visible:bg-slate-800"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                onClick={() => setActive(active === i ? null : i)}
                aria-label={`${name} ${year}: ${v === null ? 'nessun dato' : `messo da parte ${euro(v)}`}${
                  compareYear !== null ? `; ${compareYear}: ${cv === null ? 'nessun dato' : euro(cv)}` : ''
                }`}
              >
                <span className="absolute inset-x-0 flex justify-center gap-0.5" style={{ top: 0, height: '100%' }}>
                  <Bar v={v} zero={zero} px={px} cls={v !== null && v < 0 ? NEG : POS} width="44%" label />
                  {compareYear !== null && (
                    <Bar
                      v={cv}
                      zero={zero}
                      px={px}
                      cls={`border ${cv !== null && cv < 0 ? NEG_CMP : POS_CMP}`}
                      width="26%"
                    />
                  )}
                </span>
                <span className="absolute inset-x-0 bottom-0 text-center text-[10px] text-slate-500 dark:text-slate-400">
                  {name}
                </span>
              </button>
            )
          })}
        </div>
        {active !== null && (
          <Tooltip
            index={active}
            year={year}
            t={months[active] ?? null}
            compareYear={compareYear}
            c={compare?.[active] ?? null}
          />
        )}
      </div>
    </div>
  )
}

function Bar(props: {
  v: number | null
  zero: number
  px: (v: number) => number
  cls: string
  width: string
  label?: boolean
}) {
  const { v, zero, px, cls, width, label } = props
  if (v === null) return <span style={{ width }} />
  const h = Math.max(1, px(v))
  const top = v >= 0 ? zero - h : zero
  return (
    <span className="relative" style={{ width }}>
      <span className={`absolute inset-x-0 ${cls} ${v >= 0 ? 'rounded-t' : 'rounded-b'}`} style={{ top, height: h }} />
      {label && (
        <span
          className="absolute left-1/2 -translate-x-1/2 text-[10px] font-medium whitespace-nowrap text-slate-700 tabular-nums dark:text-slate-200"
          style={{ top: v >= 0 ? top - 14 : top + h + 1 }}
        >
          {euroShort(v)}
        </span>
      )}
    </span>
  )
}

function Tooltip(props: {
  index: number
  year: number
  t: Totals | null
  compareYear: number | null
  c: Totals | null
}) {
  const { index, year, t, compareYear, c } = props
  const pct = ((index + 0.5) / 12) * 100
  const rows: [string, (x: Totals) => number][] = [
    ['entrate', (x) => x.income],
    ['uscite', (x) => x.spend],
    ['una tantum', (x) => x.oneoff],
    ['messo da parte', keptOf],
  ]
  return (
    <div
      role="status"
      className="pointer-events-none absolute top-0 z-10 w-56 rounded-lg border border-slate-200 bg-white p-2 text-xs shadow-md dark:border-slate-700 dark:bg-slate-900"
      style={{ left: `clamp(0px, calc(${pct}% - 7rem), calc(100% - 14rem))` }}
    >
      <p className="mb-1 font-medium">{MONTHS_IT[index]}</p>
      <table className="w-full tabular-nums">
        <thead>
          <tr className="text-slate-500 dark:text-slate-400">
            <th />
            <th className="pl-3 text-right font-normal">{year}</th>
            {compareYear !== null && <th className="pl-3 text-right font-normal">{compareYear}</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map(([label, f]) => (
            <tr key={label}>
              <td className="text-slate-500 dark:text-slate-400">{label}</td>
              <td className="pl-3 text-right">{t ? euro(f(t)) : '—'}</td>
              {compareYear !== null && <td className="pl-3 text-right">{c ? euro(f(c)) : '—'}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
