import { periodLines } from './moneyPeriod'
import type { YearProjection } from './moneyProjection'
import { euro, keptOf, totalsOf, type Line, type Totals } from './moneyStats'

// Soldi (MO13): the yearly savings goal, a rate of income kept ("messo da
// parte" / entrate) in basis points (3000 = 30%). Pure.
//
// Owner decisions: one goal per year; a year without its own goal inherits the
// latest earlier year's goal until changed.

export const MAX_RATE_BP = 10000

export interface GoalRow {
  /** The year, 'YYYY'. */
  id: string
  rateBp: number
}

export interface YearGoal {
  rateBp: number
  /** The year the goal was set for. */
  fromYear: number
  /** true when it comes from an earlier year. */
  inherited: boolean
}

/** The goal that applies to `year`: its own, else the latest earlier year's, else null. */
export function goalFor(goals: readonly GoalRow[], year: number): YearGoal | null {
  let best: GoalRow | null = null
  for (const g of goals) {
    const y = Number(g.id)
    if (!Number.isInteger(y) || y > year) continue
    if (best === null || y > Number(best.id)) best = g
  }
  if (best === null) return null
  const fromYear = Number(best.id)
  return { rateBp: best.rateBp, fromYear, inherited: fromYear !== year }
}

export interface GoalProgress {
  /** Messo da parte, cents. */
  kept: number
  /** income × rate, cents. */
  target: number
  /** target - kept: > 0 = still missing, <= 0 = reached. */
  gap: number
  /** Actual rate in basis points, null without income. */
  rateBp: number | null
  reached: boolean
}

export function goalProgress(t: Totals, rateBp: number): GoalProgress {
  const kept = keptOf(t)
  const target = t.income > 0 ? Math.round((t.income * rateBp) / 10000) : 0
  const gap = target - kept
  return {
    kept,
    target,
    gap,
    rateBp: t.income > 0 ? Math.round((kept / t.income) * 10000) : null,
    reached: gap <= 0,
  }
}

/** "30%", "27,5%", "12,25%" (Italian decimal comma). */
export function pctText(bp: number): string {
  const v = Math.round(bp) / 100
  return `${String(v).replace('.', ',')}%`
}

/** A whole-percent label for an actual rate ("27%"), like the tiles. */
export const ratePct = (bp: number) => `${Math.round(bp / 100)}%`

/**
 * The owner's input ("30", "27,5", "30 %") as basis points, or null when it is
 * not a number from 0 to 100 with at most two decimals.
 */
export function parseRatePct(input: string): number | null {
  const s = input.trim().replace(/\s*%$/, '').replace(',', '.')
  if (!/^\d{1,3}(\.\d{1,2})?$/.test(s)) return null
  const bp = Math.round(Number(s) * 100)
  return bp >= 0 && bp <= MAX_RATE_BP ? bp : null
}

export interface YearRate {
  year: number
  /** Months with data in the year. */
  months: number
  /** Actual rate in basis points, null without income. */
  rateBp: number | null
  goal: YearGoal | null
}

/** Every year with data, oldest first: its actual rate and the goal that applies. */
export function yearRates(lines: readonly Line[], goals: readonly GoalRow[]): YearRate[] {
  const years = [...new Set(lines.map((l) => Number(l.month.slice(0, 4))))].sort((a, b) => a - b)
  return years.map((year) => {
    const mine = periodLines(lines, { from: `${year}-01`, to: `${year}-12` })
    const t = totalsOf(mine)
    return {
      year,
      months: new Set(mine.map((l) => l.month)).size,
      rateBp: t.income > 0 ? Math.round((keptOf(t) / t.income) * 10000) : null,
      goal: goalFor(goals, year),
    }
  })
}

/** "obiettivo 30%: a dicembre ≈ 27% (mancano ≈ 1.200 €)" / "… ≈ 33%, raggiunto". */
export function goalProjectionText(p: YearProjection, goal: YearGoal): string {
  const g = goalProgress(p.total, goal.rateBp)
  const at = g.rateBp === null ? 'a dicembre nessuna entrata' : `a dicembre ≈ ${ratePct(g.rateBp)}`
  const from = goal.inherited ? ` (dal ${goal.fromYear})` : ''
  return `obiettivo ${pctText(goal.rateBp)}${from}: ${at}${g.reached ? ', raggiunto' : ` (mancano ≈ ${euro(g.gap)})`}`
}
