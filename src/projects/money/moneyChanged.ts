import type { MoneyLine } from './moneyCsv'

// Soldi (MO16): which months of the monthly-totals CSV changed since the last
// link the sync opened, so the GreenBooks sync can open a link only when there
// is something new, and only from the first changed month. Pure.

const rowKey = (l: MoneyLine) => `${l.category}\u0000${l.kind}\u0000${l.amount}\u0000${l.budget ?? ''}`

function byMonth(lines: readonly MoneyLine[]): Map<string, string> {
  const m = new Map<string, string[]>()
  for (const l of lines) {
    const list = m.get(l.month) ?? []
    list.push(rowKey(l))
    m.set(l.month, list)
  }
  return new Map([...m].map(([month, rows]) => [month, rows.sort().join('\n')]))
}

/** Months whose rows differ (added, changed, or gone), oldest first. */
export function changedMonths(before: readonly MoneyLine[], after: readonly MoneyLine[]): string[] {
  const a = byMonth(before)
  const b = byMonth(after)
  const months = new Set([...a.keys(), ...b.keys()])
  return [...months].filter((m) => a.get(m) !== b.get(m)).sort()
}
