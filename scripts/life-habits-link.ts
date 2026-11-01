// Prints the habits import link (#/habits/import?d=…) for a habits plan:
// new habits and edits to existing ones, prepared by Claude in ~/life.
//
//   npm run life:habits-link -- [habits-plan.json]
//
// Default plan: ~/life/_sync/habits-plan.json. The dashboard page previews
// the plan against the habits on the device (+ new / before → after / no
// change) and only writes on an explicit tap. Exit 1 with one error per line
// if the plan is invalid. No marker: it always prints the link.
import { readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { HABITS_LINK_MAX_PARAM, encodeHabitsLink, parseHabitsPlanJson } from '../src/projects/habits/habitsPlan.ts'

const file = process.argv.slice(2).find((a) => !a.startsWith('--')) ?? join(homedir(), 'life/_sync/habits-plan.json')

const result = parseHabitsPlanJson(readFileSync(file, 'utf8'))
if (!result.ok) {
  console.error(result.errors.join('\n'))
  process.exit(1)
}
const link = encodeHabitsLink(result.plan)
const param = link.slice(link.indexOf('?d=') + 3)
if (param.length > HABITS_LINK_MAX_PARAM) {
  console.error(`The plan is too large for a link (${param.length} characters, max ${HABITS_LINK_MAX_PARAM})`)
  process.exit(1)
}
console.log(link)
