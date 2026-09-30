// Validates a Life week JSON with the app's own validator and prints the
// import link (#/life/import?d=…). Used by the /settimana command.
//
//   npm run life:link -- <week.json>     (or JSON on stdin)
//
// Exit 1 with one error per line if the week is invalid — nothing to open.
import { readFileSync } from 'node:fs'
import { encodeImportLink, parseWeekJson } from '../src/projects/life/model.ts'

const file = process.argv[2]
const text = readFileSync(file ?? 0, 'utf8')
const result = parseWeekJson(text)
if (!result.ok) {
  console.error(result.errors.join('\n'))
  process.exit(1)
}
console.log(encodeImportLink(result.plan))
