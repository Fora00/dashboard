// Prints the Soldi import link(s) (#/soldi/import?d=…) for the monthly totals
// CSV that ~/life/_sync/money-totals.py writes at every GreenBooks sync.
//
//   npm run life:money-link -- [monthly-totals.csv] [--since YYYY-MM] [--changed] [--open]
//
// Default CSV: ~/life/money/data/monthly-totals.csv. Default range: the whole
// history (it compresses to one link; years are split into several links,
// oldest first, only when it would not fit). --since sends only the months
// from YYYY-MM on. Each link replaces exactly the months it covers on the
// dashboard, after a preview and an explicit tap. Exit 1 with one error per
// line if the CSV is invalid. Prints only links, never figures.
//
// MO16, for the GreenBooks sync in ~/life: --changed compares the CSV with the
// copy saved by the last --changed run (`.monthly-totals.last-link.csv` next to
// it) and sends only from the first changed month, or prints "nessun mese
// cambiato" and no link; the copy is saved after the links are made. --open
// opens each link in Chrome (the owner checks the preview and taps Importa).
// If a link is left unopened, a plain run (whole history) catches up.
import { execFileSync } from 'node:child_process'
import { copyFileSync, existsSync, readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join } from 'node:path'
import { changedMonths } from '../src/projects/money/moneyChanged.ts'
import { isMonthKey, parseMoneyCsv } from '../src/projects/money/moneyCsv.ts'
import { chunkPayloads, encodeMoneyLink } from '../src/projects/money/moneyLink.ts'

const args = process.argv.slice(2)
const onlyChanged = args.includes('--changed')
const open = args.includes('--open')
const sinceAt = args.indexOf('--since')
let since = sinceAt >= 0 ? args[sinceAt + 1] : undefined
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
const snapshot = join(dirname(file), '.monthly-totals.last-link.csv')
if (onlyChanged) {
  const before = existsSync(snapshot) ? parseMoneyCsv(readFileSync(snapshot, 'utf8')) : null
  const changed = changedMonths(before?.ok ? before.lines : [], result.lines)
  if (changed.length === 0) {
    console.log('Soldi: nessun mese cambiato, niente da importare.')
    process.exit(0)
  }
  console.log(
    `Soldi: ${changed.length} ${changed.length === 1 ? 'mese cambiato' : 'mesi cambiati'} (da ${changed[0]}).`,
  )
  if (!since || changed[0]! > since) since = changed[0]
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
  const url = await encodeMoneyLink(c.payload)
  if (open) {
    execFileSync('open', ['-a', 'Google Chrome', url])
    console.log(`aperto in Chrome: ${c.payload.from} → ${c.payload.to}`)
  } else console.log(url)
}
if (onlyChanged) copyFileSync(file, snapshot)
