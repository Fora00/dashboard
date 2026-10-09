// Validates an events interest SEED file with the app's own schema
// (src/projects/events/interestSeed.ts) and prints the prefill link
// (#/events/interests?seed=…). Opening it only fills the preview on the
// interests page; nothing is saved until the owner taps Save.
//
//   npx -y tsx scripts/events-seed-link.ts <seed.json>     (or JSON on stdin)
//
// The file is `{ "seed": { "<kind>:<value>": number in [-1, 1] } }`, at most
// 200 keys. Seed values are personal: keep the file outside the repo.
// Exit 1 with one error per line if the seed is invalid: nothing to open.
import { readFileSync } from 'node:fs'
import { encodeSeedLink, parseSeedJson } from '../src/projects/events/interestSeed.ts'

const file = process.argv[2]
const text = readFileSync(file ?? 0, 'utf8')
const result = parseSeedJson(text)
if (!result.ok) {
  console.error(result.errors.join('\n'))
  process.exit(1)
}
console.log(encodeSeedLink(result.seed))
