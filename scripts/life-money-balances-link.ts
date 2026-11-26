// Prints the Soldi Patrimonio import link(s) (#/soldi/patrimonio/import?d=…)
// for the month-end account balances CSV that ~/life/_sync/money-balances.py
// writes at every GreenBooks sync (MO17). Same flags and rules as
// scripts/life-money-link.ts:
//
//   npm run life:money-balances-link -- [account-balances.csv] [--since YYYY-MM] [--changed] [--open]
//
// Default CSV: ~/life/money/data/account-balances.csv. Default range: the
// whole history (one link; whole years are split into several links, oldest
// first, only when it would not fit). --since sends only the months from
// YYYY-MM on. Each link replaces exactly the months it covers on the
// dashboard, after a preview and an explicit tap. Exit 1 with one error per
// line if the CSV is invalid. Prints only links and counts, never figures.
//
// --changed compares the CSV with the copy saved by the last --changed run
// (`.account-balances.last-link.csv` next to it) and sends only from the first
// changed month, or prints "nessun mese cambiato" and no link; the copy is
// saved after the links are made. --open opens each link in Chrome (the owner
// checks the preview and taps Importa). If a link is left unopened, a plain
// run (whole history) catches up.
import { execFileSync } from 'node:child_process'
import { copyFileSync, existsSync, readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join } from 'node:path'
import { changedBalanceMonths, parseBalancesCsv } from '../src/projects/money/balancesCsv.ts'
import { chunkBalancesPayloads, encodeBalancesLink } from '../src/projects/money/balancesLink.ts'
import { isMonthKey } from '../src/projects/money/moneyCsv.ts'

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
  join(homedir(), 'life/money/data/account-balances.csv')

const result = parseBalancesCsv(readFileSync(file, 'utf8'))
if (!result.ok) {
  console.error(result.errors.join('\n'))
  process.exit(1)
}
const snapshot = join(dirname(file), '.account-balances.last-link.csv')
if (onlyChanged) {
  const before = existsSync(snapshot) ? parseBalancesCsv(readFileSync(snapshot, 'utf8')) : null
  const changed = changedBalanceMonths(before?.ok ? before.lines : [], result.lines)
  if (changed.length === 0) {
    console.log('Patrimonio: nessun mese cambiato, niente da importare.')
    process.exit(0)
  }
  console.log(
    `Patrimonio: ${changed.length} ${changed.length === 1 ? 'mese cambiato' : 'mesi cambiati'} (da ${changed[0]}).`,
  )
  if (!since || changed[0]! > since) since = changed[0]
}
let chunks
try {
  chunks = await chunkBalancesPayloads(result.lines, since ? { since } : {})
} catch (err) {
  console.error(err instanceof Error ? err.message : String(err))
  process.exit(1)
}
for (const [i, c] of chunks.entries()) {
  if (chunks.length > 1) console.log(`# ${i + 1}/${chunks.length}: ${c.payload.from} → ${c.payload.to}`)
  const url = await encodeBalancesLink(c.payload)
  if (open) {
    execFileSync('open', ['-a', 'Google Chrome', url])
    console.log(`aperto in Chrome: ${c.payload.from} → ${c.payload.to}`)
  } else console.log(url)
}
if (onlyChanged) copyFileSync(file, snapshot)
