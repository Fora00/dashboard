// Prints the "Oggi" link (#/life/oggi?d=…): 0-3 focus lines plus, when their
// snapshots exist, the Streaks habits and the household chores, so one Save on
// the page updates all three. Used by /oggi.
//
//   npm run life:oggi-link -- <YYYY-MM-DD> "line 1" "line 2" ...  [--no-streaks] [--no-chores]
//
// Streaks: ~/life/_sync/streaks/snapshot.json (streaks-sync.py). Chores:
// ~/life/_sync/chores/snapshot.json (chores-sync.py; each chore gets the
// snapshot's asOf). A missing file is skipped. Exit 1 with one error per line
// if the input is invalid — nothing to open.
import { existsSync, readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { encodeDayFocusLink, parseDayFocusJson } from '../src/projects/life/model/index.ts'

const args = process.argv.slice(2)
const flags = args.filter((a) => a.startsWith('--'))
const [day, ...lines] = args.filter((a) => !a.startsWith('--'))
const read = (file: string): string | null => (existsSync(file) ? readFileSync(file, 'utf8') : null)

const payload: Record<string, unknown> = { day, lines }
const streaks = flags.includes('--no-streaks') ? null : read(join(homedir(), 'life/_sync/streaks/snapshot.json'))
if (streaks) payload.streaks = JSON.parse(streaks)
const choresRaw = flags.includes('--no-chores') ? null : read(join(homedir(), 'life/_sync/chores/snapshot.json'))
if (choresRaw) {
  const { asOf, chores } = JSON.parse(choresRaw) as {
    asOf: string
    chores: Record<string, unknown>[]
  }
  payload.chores = chores.map((c) => ({ ...c, asOf }))
}

const result = parseDayFocusJson(JSON.stringify(payload))
if (!result.ok) {
  console.error(result.errors.join('\n'))
  process.exit(1)
}
console.log(encodeDayFocusLink(result.plan))
