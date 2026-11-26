import { useState } from 'react'
import { MONTHS_IT, euro, euroShort, keptOf, type Totals } from './moneyStats'

// Messo da parte per month of the period as diverging bars around zero: the
// period filled, the comparison as a thinner outlined bar beside it (month by
// month, in order), or as a dashed line for the historic average. Positive =
// sky, negative = orange (validated for colour-blind separation in light and
// dark), and the bar's side of the zero line says the same thing, so colour is
// never the only cue. Plain HTML (not SVG) so labels keep their size on a
// phone. Hover, focus or tap a month for its entrate/uscite/una tantum. Past
// 12 months the bar values hide and only some month names show.

const H = 160 // plot height in px, labels get PAD above and below
const PAD = 16

const POS = 'bg-sky-600'
const NEG = 'bg-orange-600'
const POS_CMP = 'border-sky-600 bg-sky-600/25'
const NEG_CMP = 'border-orange-600 bg-orange-600/25'

export interface ChartCompare {
  label: string
  /** One per month of the period (aligned by position), or one value for every month when `flat`. */
  values: (Totals | null)[]
  /** The historic average: drawn as a line, not bars. */
  flat: boolean
  /** The compare month at each position ('YYYY-MM'); empty when flat. */
  months: string[]
}

interface Props {
  /** 'YYYY-MM', one per bar, oldest first. */
  months: string[]
  values: (Totals | null)[]
  label: string
  compare: ChartCompare | null
}

const monthName = (m: string) => MONTHS_IT[Number(m.slice(5, 7)) - 1]!
const short = (m: string) => `${monthName(m)} ${m.slice(2, 4)}`

export function MoneyMonthChart({ months, values, label, compare }: Props) {
  const [active, setActive] = useState<number | null>(null)
  const n = months.length
  const multiYear = n > 0 && months[0]!.slice(0, 4) !== months[n - 1]!.slice(0, 4)
  const dense = n > 12
  const every = Math.ceil(n / 12)
  const cmpAt = (i: number) => (compare ? ((compare.flat ? compare.values[0] : compare.values[i]) ?? null) : null)
  const all = [...values, ...(compare?.values ?? [])].filter((t): t is Totals => t !== null).map(keptOf)
  const max = Math.max(0, ...all)
  const min = Math.min(0, ...all)
  const range = max - min || 1
  const zero = PAD + (max / range) * H
  const px = (v: number) => (Math.abs(v) / range) * H
  const flatV = compare?.flat && compare.values[0] ? keptOf(compare.values[0]) : null
  const nameOf = (m: string, i: number) =>
    `${monthName(m)}${multiYear && (i === 0 || m.endsWith('-01')) ? ` ${m.slice(2, 4)}` : ''}`

  return (
    <div>
      <p className="mb-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-300">
        <span>
          <span className={`mr-1 inline-block size-2.5 rounded-sm ${POS}`} />
          <span className={`mr-1 inline-block size-2.5 rounded-sm ${NEG}`} />
          {label} (sopra = messo da parte, sotto = speso più di quanto entrato)
        </span>
        {compare !== null &&
          (compare.flat ? (
            <span>
              <span className="mr-1 inline-block w-4 border-t-2 border-dashed border-slate-500 align-middle" />
              {compare.label} (linea)
            </span>
          ) : (
            <span>
              <span className={`mr-1 inline-block size-2.5 rounded-sm border ${POS_CMP}`} />
              <span className={`mr-1 inline-block size-2.5 rounded-sm border ${NEG_CMP}`} />
              {compare.label} (contorno)
            </span>
          ))}
      </p>
      <div className="relative" style={{ height: H + 2 * PAD + 18 }} onMouseLeave={() => setActive(null)}>
        <div
          className="absolute inset-x-0 border-t border-slate-400 dark:border-slate-500"
          style={{ top: zero }}
          aria-hidden="true"
        />
        {flatV !== null && (
          <div
            className="pointer-events-none absolute inset-x-0 border-t-2 border-dashed border-slate-500 dark:border-slate-400"
            style={{ top: flatV >= 0 ? zero - px(flatV) : zero + px(flatV) }}
            aria-hidden="true"
            data-testid="money-chart-average"
          />
        )}
        <div className="absolute inset-0 flex">
          {months.map((m, i) => {
            const t = values[i] ?? null
            const c = cmpAt(i)
            const v = t ? keptOf(t) : null
            const cv = c ? keptOf(c) : null
            const full = `${monthName(m)} ${m.slice(0, 4)}`
            return (
              <button
                key={m}
                type="button"
                className="relative h-full min-w-0 flex-1 rounded-md hover:bg-slate-100 focus-visible:bg-slate-100 focus-visible:outline-none dark:hover:bg-slate-800 dark:focus-visible:bg-slate-800"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                onClick={() => setActive(active === i ? null : i)}
                aria-label={`${full}: ${v === null ? 'nessun dato' : `messo da parte ${euro(v)}`}${
                  compare !== null ? `; ${compare.label}: ${cv === null ? 'nessun dato' : euro(cv)}` : ''
                }`}
              >
                <span className="absolute inset-x-0 flex justify-center gap-0.5" style={{ top: 0, height: '100%' }}>
                  <Bar
                    v={v}
                    zero={zero}
                    px={px}
                    cls={v !== null && v < 0 ? NEG : POS}
                    width={compare && !compare.flat ? '44%' : '60%'}
                    label={!dense}
                  />
                  {compare !== null && !compare.flat && (
                    <Bar
                      v={cv}
                      zero={zero}
                      px={px}
                      cls={`border ${cv !== null && cv < 0 ? NEG_CMP : POS_CMP}`}
                      width="26%"
                    />
                  )}
                </span>
                {(!dense || i % every === 0) && (
                  <span className="absolute inset-x-0 bottom-0 text-center text-[10px] whitespace-nowrap text-slate-500 dark:text-slate-400">
                    {nameOf(m, i)}
                  </span>
                )}
              </button>
            )
          })}
        </div>
        {active !== null && months[active] && (
          <Tooltip
            index={active}
            count={n}
            month={months[active]}
            t={values[active] ?? null}
            compareLabel={
              compare === null ? null : compare.flat ? 'media' : short(compare.months[active] ?? months[active])
            }
            c={cmpAt(active)}
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
  count: number
  month: string
  t: Totals | null
  compareLabel: string | null
  c: Totals | null
}) {
  const { index, count, month, t, compareLabel, c } = props
  const pct = ((index + 0.5) / count) * 100
  const rows: [string, (x: Totals) => number][] = [
    ['entrate', (x) => x.income],
    ['uscite', (x) => x.spend],
    ['una tantum', (x) => x.oneoff],
    ['messo da parte', keptOf],
  ]
  return (
    <div
      role="status"
      className="pointer-events-none absolute top-0 z-10 w-60 rounded-lg border border-slate-200 bg-white p-2 text-xs shadow-md dark:border-slate-700 dark:bg-slate-900"
      style={{ left: `clamp(0px, calc(${pct}% - 7.5rem), calc(100% - 15rem))` }}
    >
      <table className="w-full tabular-nums">
        <thead>
          <tr className="text-slate-500 dark:text-slate-400">
            <th />
            <th className="pl-3 text-right font-normal">{short(month)}</th>
            {compareLabel !== null && <th className="pl-3 text-right font-normal">{compareLabel}</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map(([name, f]) => (
            <tr key={name}>
              <td className="text-slate-500 dark:text-slate-400">{name}</td>
              <td className="pl-3 text-right">{t ? euro(f(t)) : '—'}</td>
              {compareLabel !== null && <td className="pl-3 text-right">{c ? euro(f(c)) : '—'}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
