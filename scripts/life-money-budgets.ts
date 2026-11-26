// Writes the dashboard budgets (Soldi, MO8) into ~/life: the text the
// "Copia budget per ~/life" button on /soldi put on the clipboard.
//
//   npm run life:money-budgets -- [--in <file>|-] [out.csv]
//
// Input: the clipboard (pbpaste) by default, a file with --in <file>, stdin
// with --in -. It is validated (src/projects/money/moneyBudgets.ts
// parseBudgetsCsv) and written, normalised, to out.csv (default
// ~/life/money/data/budgets-dashboard.csv), replacing it. Exit 1 with one
// error per line when the text is not a valid budgets CSV; nothing is written
// then. Nothing goes through the cloud. Prints only a count, never figures.
import { execFileSync } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join } from 'node:path'
import { budgetsCsvText, parseBudgetsCsv } from '../src/projects/money/moneyBudgets.ts'

const args = process.argv.slice(2)
const inAt = args.indexOf('--in')
const input = inAt >= 0 ? args[inAt + 1] : undefined
if (inAt >= 0 && !input) {
  console.error('--in needs a file (or - for stdin)')
  process.exit(1)
}
const out =
  args.find((a, i) => !a.startsWith('--') && (inAt < 0 || i !== inAt + 1)) ??
  join(homedir(), 'life/money/data/budgets-dashboard.csv')

let text: string
try {
  text =
    input === undefined
      ? execFileSync('pbpaste', { encoding: 'utf8' })
      : readFileSync(input === '-' ? 0 : input, 'utf8')
} catch (err) {
  console.error(`Cannot read the budgets: ${err instanceof Error ? err.message : String(err)}`)
  process.exit(1)
}

const result = parseBudgetsCsv(text)
if (!result.ok) {
  console.error(result.errors.join('\n'))
  process.exit(1)
}
mkdirSync(dirname(out), { recursive: true })
writeFileSync(out, budgetsCsvText(result.rows))
console.log(`${result.rows.length} budget rules written to ${out}`)
