import { useState } from 'react'
import type { BalanceGroup } from '../../lib/db'
import { BALANCE_GROUPS } from './balancesCsv'
import { GROUP_BG, GROUP_FILL, GROUP_LABEL, type GroupTotals } from './balancesStats'
import { MONTHS_IT } from './moneyPeriod'
import { euro } from './moneyStats'

// Patrimonio (MO17): the three groups stacked per month over the whole
// history, one y scale from zero (a negative group, e.g. an overdrawn account,
// stacks below the zero line). Colours: the dataviz skill's validated
// categorical slots blue / aqua / violet, light and dark steps each validated
// against their surface (scripts/validate_palette.js: CVD and normal-vision
// separation pass; aqua is under 3:1 on white, so the legend, the direct
// labels on the newest month and the table carry identity). A 1px surface
// stroke separates the stacked segments. Text stays in text tokens. Hover,
// focus or tap a month for its values.

const H = 160
const PAD = 10
const LABELS_W = 92

interface Props {
  history: readonly { month: string; totals: GroupTotals | null }[]
  /** The month shown on the page, outlined in the chart. */
  selected: string
}

const nameOf = (m: string) => `${MONTHS_IT[Number(m.slice(5, 7)) - 1]} ${m.slice(2, 4)}`

/** Stacked segments of one month: positives up from zero, negatives down, in group order. */
function segments(t: GroupTotals): { group: BalanceGroup; lo: number; hi: number }[] {
  let up = 0
  let down = 0
  return BALANCE_GROUPS.map((group) => {
    const v = t[group]
    if (v >= 0) {
      const seg = { group, lo: up, hi: up + v }
      up += v
      return seg
    }
    const seg = { group, lo: down + v, hi: down }
    down += v
    return seg
  })
}

export function BalancesChart({ history, selected }: Props) {
  const [active, setActive] = useState<number | null>(null)
  const n = history.length
  let max = 0
  let min = 0
  for (const h of history) {
    if (!h.totals) continue
    for (const s of segments(h.totals)) {
      max = Math.max(max, s.hi)
      min = Math.min(min, s.lo)
    }
  }
  const range = max - min || 1
  const y = (v: number) => PAD + ((max - v) / range) * H
  // Axis ticks that fit a phone: a long history gets one tick per year (its January, "2024"), a short one a
  // month name every few months.
  const byYear = n > 18
  const every = Math.ceil(n / 5)
  const tick = (m: string, i: number) =>
    byYear ? (m.endsWith('-01') ? m.slice(0, 4) : null) : i % every === 0 ? nameOf(m) : null
  const barW = n > 24 ? 0.8 : 0.7

  // Direct labels on the newest month with data, nudged apart so they never overlap.
  const last = [...history].reverse().find((h) => h.totals)
  const labels = last?.totals
    ? segments(last.totals)
        .filter((s) => s.hi - s.lo > 0)
        .map((s) => ({ group: s.group, top: y((s.lo + s.hi) / 2) }))
        .sort((a, b) => a.top - b.top)
    : []
  for (let i = 1; i < labels.length; i++)
    if (labels[i]!.top - labels[i - 1]!.top < 14) labels[i]!.top = labels[i - 1]!.top + 14

  const activeRow = active !== null ? history[active] : undefined

  return (
    <div>
      <p className="mb-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-300">
        {BALANCE_GROUPS.map((g) => (
          <span key={g}>
            <span className={`mr-1 inline-block h-2.5 w-2.5 rounded-sm align-middle ${GROUP_BG[g]}`} />
            {GROUP_LABEL[g]}
          </span>
        ))}
      </p>
      <div className="flex">
        <div
          className="relative min-w-0 flex-1"
          style={{ height: H + 2 * PAD + 18 }}
          role="group"
          aria-label="Patrimonio per gruppo, mese per mese"
          onMouseLeave={() => setActive(null)}
        >
          <svg
            className="absolute inset-x-0 top-0 w-full"
            style={{ height: H + 2 * PAD }}
            viewBox={`0 0 ${n || 1} ${H + 2 * PAD}`}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {history.map((h, i) =>
              h.totals ? (
                <g key={h.month} opacity={active !== null && active !== i ? 0.55 : 1}>
                  {segments(h.totals).map((s) =>
                    s.hi > s.lo ? (
                      <rect
                        key={s.group}
                        x={i + (1 - barW) / 2}
                        width={barW}
                        y={y(s.hi)}
                        height={y(s.lo) - y(s.hi)}
                        className={`${GROUP_FILL[s.group]} stroke-white dark:stroke-slate-900`}
                        strokeWidth={1}
                        vectorEffect="non-scaling-stroke"
                      />
                    ) : null,
                  )}
                </g>
              ) : null,
            )}
            <line
              x1={0}
              x2={n}
              y1={y(0)}
              y2={y(0)}
              className="stroke-slate-400 dark:stroke-slate-500"
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
            />
            {history.map((h, i) =>
              h.month === selected ? (
                <line
                  key="sel"
                  x1={i + 0.5}
                  x2={i + 0.5}
                  y1={PAD}
                  y2={PAD + H}
                  className="stroke-slate-500 dark:stroke-slate-400"
                  strokeDasharray="3 3"
                  vectorEffect="non-scaling-stroke"
                />
              ) : null,
            )}
          </svg>
          <span
            className="pointer-events-none absolute left-0 text-[10px] text-slate-500 tabular-nums dark:text-slate-400"
            style={{ top: PAD - 12 }}
          >
            {euro(max)}
          </span>
          {min < 0 && (
            <span
              className="pointer-events-none absolute left-0 text-[10px] text-slate-500 tabular-nums dark:text-slate-400"
              style={{ top: PAD + H + 1 }}
            >
              {euro(min)}
            </span>
          )}
          <div className="absolute inset-0 flex">
            {history.map((h, i) => (
              <button
                key={h.month}
                type="button"
                className="relative h-full min-w-0 flex-1 focus-visible:bg-slate-100/60 focus-visible:outline-none dark:focus-visible:bg-slate-800/60"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                onClick={() => setActive(active === i ? null : i)}
                aria-label={
                  h.totals
                    ? `${nameOf(h.month)}: totale ${euro(h.totals.total)}; ${BALANCE_GROUPS.map(
                        (g) => `${GROUP_LABEL[g]} ${euro(h.totals![g])}`,
                      ).join('; ')}`
                    : `${nameOf(h.month)}: nessun dato`
                }
              >
                {tick(h.month, i) && (
                  <span className="absolute inset-x-0 bottom-0 text-center text-[10px] whitespace-nowrap text-slate-500 dark:text-slate-400">
                    {tick(h.month, i)}
                  </span>
                )}
              </button>
            ))}
          </div>
          {activeRow && (
            <div
              role="status"
              className="pointer-events-none absolute top-0 z-10 w-52 rounded-lg border border-slate-200 bg-white p-2 text-xs shadow-md dark:border-slate-700 dark:bg-slate-900"
              style={{ left: `clamp(0px, calc(${((active! + 0.5) / n) * 100}% - 6.5rem), calc(100% - 13rem))` }}
            >
              <p className="mb-1 font-medium">{nameOf(activeRow.month)}</p>
              {activeRow.totals ? (
                <>
                  {[...BALANCE_GROUPS].reverse().map((g) => (
                    <p key={g} className="flex items-center justify-between gap-3 tabular-nums">
                      <span className="text-slate-500 dark:text-slate-400">
                        <span className={`mr-1 inline-block h-2 w-2 rounded-sm ${GROUP_BG[g]}`} />
                        {GROUP_LABEL[g]}
                      </span>
                      {euro(activeRow.totals![g])}
                    </p>
                  ))}
                  <p className="mt-1 flex justify-between gap-3 border-t border-slate-200 pt-1 font-medium tabular-nums dark:border-slate-700">
                    <span>totale</span>
                    {euro(activeRow.totals.total)}
                  </p>
                </>
              ) : (
                <p className="text-slate-500 dark:text-slate-400">nessun dato</p>
              )}
            </div>
          )}
        </div>
        <div className="relative shrink-0" style={{ width: LABELS_W, height: H + 2 * PAD }} aria-hidden="true">
          {labels.map((l) => (
            <span
              key={l.group}
              className="absolute left-1.5 -translate-y-1/2 text-[11px] whitespace-nowrap text-slate-600 dark:text-slate-300"
              style={{ top: l.top }}
            >
              {GROUP_LABEL[l.group]}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
