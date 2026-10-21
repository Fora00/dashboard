// Prints the "Oggi" link (#/life/oggi?d=…) for 1-3 lines. Used by /oggi.
//
//   npm run life:oggi-link -- <YYYY-MM-DD> "line 1" "line 2" ...
//
// Exit 1 with one error per line if the input is invalid — nothing to open.
import { encodeDayFocusLink, parseDayFocusJson } from '../src/projects/life/model/index.ts'

const [day, ...lines] = process.argv.slice(2)
const result = parseDayFocusJson(JSON.stringify({ day, lines }))
if (!result.ok) {
  console.error(result.errors.join('\n'))
  process.exit(1)
}
console.log(encodeDayFocusLink(result.plan))
