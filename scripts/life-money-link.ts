// Prints the Soldi import link(s) (#/soldi/import?d=…) for the monthly totals
// CSV that ~/life/_sync/money-totals.py writes at every GreenBooks sync.
//
//   npm run life:money-link -- [monthly-totals.csv] [--since YYYY-MM]
//
// Default CSV: ~/life/money/data/monthly-totals.csv. Default range: the whole
// history (it compresses to one link; years are split into several links,
// oldest first, only when it would not fit). --since sends only the months
// from YYYY-MM on. Each link replaces exactly the months it covers on the
// dashboard, after a preview and an explicit tap. Exit 1 with one error per
// line if the CSV is invalid. Prints only links, never figures.
import { readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { isMonthKey, parseMoneyCsv } from '../src/projects/money/moneyCsv.ts'
import { chunkPayloads, encodeMoneyLink } from '../src/projects/money/moneyLink.ts'

const args = process.argv.slice(2)
const sinceAt = args.indexOf('--since')
const since = sinceAt >= 0 ? args[sinceAt + 1] : undefined
if (sinceAt >= 0 && !isMonthKey(since)) {
  console.error('--since needs a month: --since YYYY-MM')
  process.exit(1)
}
const file =
  args.find((a, i) => !a.startsWith('--') && (sinceAt < 0 || i !== sinceAt + 1)) ??
  join(homedir(), 'life/money/data/monthly-totals.csv')

const result = parseMoneyCsv(readFileSync(file, 'utf8'))
if (!result.ok) {
  console.error(result.errors.join('\n'))
  process.exit(1)
}
let chunks
try {
  chunks = await chunkPayloads(result.lines, since ? { since } : {})
} catch (err) {
  console.error(err instanceof Error ? err.message : String(err))
  process.exit(1)
}
for (const [i, c] of chunks.entries()) {
  if (chunks.length > 1) console.log(`# ${i + 1}/${chunks.length}: ${c.payload.from} → ${c.payload.to}`)
  console.log(await encodeMoneyLink(c.payload))
}
