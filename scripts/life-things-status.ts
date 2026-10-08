// Reports what happened in Things to the tasks a Life week sent there.
// Read-only: asks Things (via AppleScript, macOS only) for to-dos created
// around each recorded send time, then matches them to the week's tasks.
//
//   pbpaste | npm run --silent life:things-status      (a Life export)
//
// Matching survives renames in Things: a to-do's creation time never
// changes, and every send is timestamped in the export (`sends`). Within a
// batch, exact titles match first; the rest match by order (Things creates
// a batch in array order). Anything uncertain is reported, never guessed.
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { extractJsonFence } from '../src/projects/life/model/fence.ts'
import { BEFORE_MS, matchBatch, type Status, type Task, type ThingsTodo } from './life-things-match.ts'

interface ExportJson {
  plan: { week: string; tasks: Task[] }
  entries: {
    kind: string
    ref: string
    value: { sent?: boolean; sends?: number[] }
  }[]
}

function readExport(text: string): ExportJson {
  const json = extractJsonFence(text)
  if (!json) throw new Error('No Life export on the input: tap "Export week" first.')
  return JSON.parse(json) as ExportJson
}

// Seconds-ago rather than absolute dates: AppleScript date <-> epoch
// conversion is locale- and timezone-fragile, a difference from `now` isn't.
function readThings(sinceMs: number): ThingsTodo[] {
  const days = Math.ceil((Date.now() - sinceMs) / 86_400_000) + 1
  // Completions get a wider window (at least two weeks), so a /settimana run
  // days late still sees them. It can't cause a wrong match: a to-do is
  // completed after it's created, and matching stays tied to creation time.
  const doneDays = Math.max(days, 14)
  const script = `
on clean(s)
  set AppleScript's text item delimiters to {tab, linefeed, return}
  set parts to text items of s
  set AppleScript's text item delimiters to " "
  set s to parts as text
  set AppleScript's text item delimiters to ""
  return s
end clean
-- Rows from property lists fetched in bulk. Iterating a "whose" reference
-- re-runs the query on every step and fetches one property per Apple
-- event, which took minutes. Five bulk gets per list take seconds.
on rows(ids, names, sts, cds, cps, fixedStatus, nowD)
  set out to ""
  repeat with i from 1 to count of ids
    set statusText to fixedStatus
    if statusText is "" then
      tell application "Things3"
        set s to item i of sts
        if s is open then
          set statusText to "open"
        else if s is completed then
          set statusText to "completed"
        else
          set statusText to "canceled"
        end if
      end tell
    end if
    set c to ""
    set cp to item i of cps
    if cp is not missing value then set c to ((nowD - cp) as integer) as text
    set out to out & (item i of ids) & tab & ((nowD - (item i of cds)) as integer) & tab & statusText & tab & c & tab & my clean(item i of names) & linefeed
  end repeat
  return out
end rows
tell application "Things3"
  set nowD to current date
  set cutoff to nowD - (${days} * days)
  set doneCutoff to nowD - (${doneDays} * days)
  set out to my rows(id of (to dos whose creation date > cutoff), name of (to dos whose creation date > cutoff), status of (to dos whose creation date > cutoff), creation date of (to dos whose creation date > cutoff), completion date of (to dos whose creation date > cutoff), "", nowD)
  -- The app-level list excludes the Logbook, so completed and canceled
  -- to-dos need their own pass, filtered by completion date because the
  -- Logbook holds years of items.
  set lb to list id "TMLogbookListSource"
  set out to out & my rows(id of (to dos of lb whose completion date > doneCutoff), name of (to dos of lb whose completion date > doneCutoff), status of (to dos of lb whose completion date > doneCutoff), creation date of (to dos of lb whose completion date > doneCutoff), completion date of (to dos of lb whose completion date > doneCutoff), "", nowD)
  set tr to list id "TMTrashListSource"
  set out to out & my rows(id of (to dos of tr whose creation date > cutoff), name of (to dos of tr whose creation date > cutoff), status of (to dos of tr whose creation date > cutoff), creation date of (to dos of tr whose creation date > cutoff), completion date of (to dos of tr whose creation date > cutoff), "deleted", nowD)
  return out
end tell`
  const raw = execFileSync('osascript', ['-e', script], { encoding: 'utf8' })
  const now = Date.now()
  const byId = new Map<string, ThingsTodo>()
  for (const line of raw.split('\n')) {
    const [id, created, status, completed, name] = line.split('\t')
    if (!id || !created || !status || name === undefined) continue
    const todo: ThingsTodo = {
      id,
      name,
      status: status as Status,
      createdAt: now - Number(created) * 1000,
      completedAt: completed ? now - Number(completed) * 1000 : null,
    }
    // Later passes (Logbook, Trash) win over the open-list pass.
    if (!byId.has(id) || todo.status !== 'open') byId.set(id, todo)
  }
  return [...byId.values()]
}

let input: ExportJson
try {
  input = readExport(readFileSync(0, 'utf8'))
} catch (e) {
  console.error(e instanceof Error ? e.message : String(e))
  process.exit(1)
}
const tasks = input.plan.tasks
const sendsByTask = new Map<string, number[]>()
for (const e of input.entries) {
  if (e.kind === 'sent' && e.value.sent) sendsByTask.set(e.ref, e.value.sends ?? [])
}

// Group sent tasks into batches: tasks sharing a send time were one tap.
const batches = new Map<number, Task[]>()
const noTimestamp: Task[] = []
for (const t of tasks) {
  const sends = sendsByTask.get(t.id)
  if (!sends) continue
  if (sends.length === 0) noTimestamp.push(t)
  for (const at of sends) batches.set(at, [...(batches.get(at) ?? []), t])
}

const allSends = [...batches.keys()]
const things =
  allSends.length || noTimestamp.length
    ? readThings(Math.min(...allSends, Date.parse(`${input.plan.week}T00:00:00`)) - BEFORE_MS)
    : []

const found = new Map<string, ThingsTodo[]>() // task id -> Things to-dos (>1 = duplicates)
const unexplained: ThingsTodo[] = []
const add = (taskId: string, todo: ThingsTodo) => found.set(taskId, [...(found.get(taskId) ?? []), todo])

for (const [at, batchTasks] of [...batches.entries()].sort((a, b) => a[0] - b[0])) {
  const r = matchBatch(batchTasks, things, at)
  for (const [taskId, todo] of r.pairs) add(taskId, todo)
  unexplained.push(...r.unexplained)
  for (const t of r.unmatched) found.set(t.id, found.get(t.id) ?? [])
}
// Sends recorded before timestamps existed: title match anywhere in range.
for (const t of noTimestamp) {
  const weekStart = Date.parse(`${input.plan.week}T00:00:00`)
  for (const todo of things.filter((x) => x.createdAt >= weekStart - BEFORE_MS && x.name.trim() === t.title.trim())) {
    add(t.id, todo)
  }
}

const line = (t: Task) => {
  const hits = found.get(t.id)
  if (!sendsByTask.has(t.id)) return `- ${t.title}: not sent to Things`
  if (!hits || hits.length === 0)
    return `- ${t.title}: NOT FOUND in Things (renamed with no time match, or never created)`
  const desc = hits.map(
    (h) =>
      `${h.status}${h.completedAt ? ` ${new Date(h.completedAt).toLocaleDateString()}` : ''}${h.name !== t.title ? ` · now "${h.name}"` : ''}`,
  )
  return `- ${t.title}: ${desc.join(' + ')}${hits.length > 1 ? ' (DUPLICATE in Things)' : ''}`
}

const done = tasks.filter((t) => found.get(t.id)?.some((h) => h.status === 'completed')).length
const sentCount = tasks.filter((t) => sendsByTask.has(t.id)).length
console.log(`# Things status, week of ${input.plan.week}\n`)
console.log(`${done} of ${sentCount} sent tasks completed.\n`)
for (const t of tasks) console.log(line(t))
if (unexplained.length) {
  console.log('\nCreated in Things around a send time but not matched (check by hand):')
  for (const u of unexplained) console.log(`- "${u.name}" (${u.status})`)
}
