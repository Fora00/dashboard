import { MONTHS_IT } from './moneyPeriod'

// Soldi (MO15): seasonality. For each calendar month, the usual spend (mean
// over the years that month is in the history) against the mean month, so a
// rise in December or August reads as "normal for the season" or not. Input is
// the spend series of MO7 (`spendSeries`: one value per month of the history,
// empty months 0). Pure, cents.

export interface SeasonMonth {
  /** 1..12. */
  month: number
  name: string
  /** Mean spend of this calendar month over the years it appears; null when it never does. */
  mean: number | null
  /** How many years the mean is over. */
  years: number
  /** Percent above (+) or below (-) the mean month; null without a mean. */
  index: number | null
}

export function seasonality(months: readonly string[], values: readonly number[]): SeasonMonth[] {
  const sums = Array.from({ length: 12 }, () => ({ sum: 0, n: 0 }))
  months.forEach((m, i) => {
    const s = sums[Number(m.slice(5, 7)) - 1]!
    s.sum += values[i] ?? 0
    s.n++
  })
  const means = sums.map((s) => (s.n ? s.sum / s.n : null))
  const known = means.filter((v): v is number => v !== null)
  const overall = known.length ? known.reduce((a, b) => a + b, 0) / known.length : 0
  return means.map((mean, i) => ({
    month: i + 1,
    name: MONTHS_IT[i]!,
    mean: mean === null ? null : Math.round(mean),
    years: sums[i]!.n,
    index: mean === null || overall <= 0 ? null : Math.round(((mean - overall) / overall) * 100),
  }))
}
