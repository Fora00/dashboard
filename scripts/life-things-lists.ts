// Resolves each task's area/project in a Life week JSON to its Things id
// (`listId`) and exact name (emoji included), reading Things read-only via
// AppleScript. Used by the /settimana command before life-link.ts.
//
//   npm run life:things-lists -- <week.json>     (or JSON on stdin)
//
// Prints the updated JSON on stdout. Names match loosely, like
// ~/life/_sync/things-add.sh: emoji, punctuation and case are ignored ("casa"
// → "🏡Casa"); an exact match wins, else a single substring match. Anything
// unmatched or ambiguous is reported on stderr (exit 1) and left untouched —
// never guessed. A task with a project goes into the project, else the area.
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

interface ThingsList {
  id: string
  name: string
}

// Bulk property gets: one Apple Event per list instead of one per item.
const SCRIPT = `
tell application "Things3"
  set out to ""
  set aIds to id of every area
  set aNames to name of every area
  repeat with i from 1 to count of aIds
    set out to out & "area" & tab & item i of aIds & tab & item i of aNames & linefeed
  end repeat
  set pIds to id of every project
  set pNames to name of every project
  repeat with i from 1 to count of pIds
    set out to out & "project" & tab & item i of pIds & tab & item i of pNames & linefeed
  end repeat
  return out
end tell`

function readThings(): { areas: ThingsList[]; projects: ThingsList[] } {
  const raw = execFileSync('osascript', ['-e', SCRIPT], { encoding: 'utf8' })
  const areas: ThingsList[] = []
  const projects: ThingsList[] = []
  for (const line of raw.split(/\r?\n/)) {
    const [kind, id, ...rest] = line.split('\t')
    if (!id) continue
    const item = { id, name: rest.join('\t').trim() }
    if (kind === 'area') areas.push(item)
    else if (kind === 'project') projects.push(item)
  }
  return { areas, projects }
}

function norm(s: string): string {
  return s
    .replace(/[^\p{L}\p{N}| ]/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

function match(want: string, lists: ThingsList[]): { hit: ThingsList } | { error: string } {
  const w = norm(want)
  if (!w) return { error: 'empty after removing emoji' }
  const exact = lists.filter((l) => norm(l.name) === w)
  if (exact.length === 1) return { hit: exact[0]! }
  const partial = exact.length > 1 ? exact : lists.filter((l) => norm(l.name).includes(w))
  if (partial.length === 1) return { hit: partial[0]! }
  if (partial.length === 0) return { error: 'no match' }
  return { error: `ambiguous: ${partial.map((l) => l.name).join(', ')}` }
}

type Task = { title?: string; area?: string | null; project?: string | null; listId?: string }

const file = process.argv[2]
const week = JSON.parse(readFileSync(file ?? 0, 'utf8')) as { tasks?: Task[] }
const { areas, projects } = readThings()
const problems: string[] = []

for (const task of week.tasks ?? []) {
  let listId: string | undefined
  for (const key of ['area', 'project'] as const) {
    const want = task[key]
    if (!want) continue
    const r = match(want, key === 'area' ? areas : projects)
    if ('error' in r) {
      problems.push(`"${task.title ?? '?'}": ${key} "${want}" — ${r.error}`)
      continue
    }
    task[key] = r.hit.name
    // Project wins over area: it's the more specific list.
    if (key === 'project' || !listId) listId = r.hit.id
  }
  if (listId) task.listId = listId
  else delete task.listId
}

console.log(JSON.stringify(week, null, 2))
if (problems.length) {
  console.error(problems.join('\n'))
  process.exit(1)
}
