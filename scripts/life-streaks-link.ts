// Prints the "Streaks" link (#/life/streaks?d=…) for the Streaks-app snapshot
// alone. Used by /streaks (and /oggi, which runs it).
//
//   npm run life:streaks-link -- [snapshot.json] [--force]
//
// Default snapshot: ~/life/_sync/streaks/snapshot.json (written by
// ~/life/_sync/streaks-sync.py). Unless --force, prints nothing and exits 0
// when the snapshot is no newer than the one a link was last made for
// (marker next to the snapshot), so /oggi only bothers the owner when the
// iCloud backup actually has something new. Exit 1 with one error per line
// if the snapshot is invalid.
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { encodeStreaksLink, parseStreaksJson } from '../src/projects/life/model/index.ts'

const args = process.argv.slice(2)
const force = args.includes('--force')
const file = args.find((a) => !a.startsWith('--')) ?? join(homedir(), 'life/_sync/streaks/snapshot.json')
const marker = `${file}.sent`

const result = parseStreaksJson(readFileSync(file, 'utf8'))
if (!result.ok) {
  console.error(result.errors.join('\n'))
  process.exit(1)
}
const asOf = result.streaks.reduce((m, s) => (s.asOf > m ? s.asOf : m), '')
const sent = existsSync(marker) ? readFileSync(marker, 'utf8').trim() : ''
if (!force && sent >= asOf) process.exit(0)
writeFileSync(marker, `${asOf}\n`)
console.log(encodeStreaksLink(result.streaks))
