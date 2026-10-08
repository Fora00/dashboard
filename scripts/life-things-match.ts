// Pure matching logic of the life-things-* scripts, kept free of osascript and
// stdin so it can be tested (scripts/life-things.test.ts).

export interface ThingsList {
  id: string
  name: string
}

export type Status = 'open' | 'completed' | 'canceled' | 'deleted'
export interface ThingsTodo {
  id: string
  name: string
  status: Status
  createdAt: number
  completedAt: number | null
}
export interface Task {
  id: string
  title: string
}

// A Things batch lands within seconds of the tap; allow for phone/Mac clock
// skew and a slow Things launch.
export const BEFORE_MS = 2 * 60_000
export const AFTER_MS = 5 * 60_000

export function norm(s: string): string {
  return s
    .replace(/[^\p{L}\p{N}| ]/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

export function match(want: string, lists: ThingsList[]): { hit: ThingsList } | { error: string } {
  const w = norm(want)
  if (!w) return { error: 'empty after removing emoji' }
  const exact = lists.filter((l) => norm(l.name) === w)
  if (exact.length === 1) return { hit: exact[0]! }
  const partial = exact.length > 1 ? exact : lists.filter((l) => norm(l.name).includes(w))
  if (partial.length === 1) return { hit: partial[0]! }
  if (partial.length === 0) return { error: 'no match' }
  return { error: `ambiguous: ${partial.map((l) => l.name).join(', ')}` }
}

export function words(s: string): Set<string> {
  return new Set(
    s
      .toLowerCase()
      .split(/[^\p{L}\p{N}]+/u)
      .filter((w) => w.length > 2),
  )
}

export function sharedWords(a: string, b: string): number {
  const wb = words(b)
  return [...words(a)].filter((w) => wb.has(w)).length
}

/**
 * Matches one send batch (tasks sharing a send time `at`) to the to-dos Things
 * created around it. Exact titles first; then one leftover on each side; then
 * the unique best word overlap. `pairs` are [task id, to-do] in match order,
 * `unmatched` the tasks left over, `unexplained` the to-dos nobody claimed.
 */
export function matchBatch(
  batchTasks: Task[],
  things: ThingsTodo[],
  at: number,
): {
  pairs: [string, ThingsTodo][]
  unmatched: Task[]
  unexplained: ThingsTodo[]
} {
  const pairs: [string, ThingsTodo][] = []
  const pool = things
    .filter((x) => x.createdAt >= at - BEFORE_MS && x.createdAt <= at + AFTER_MS)
    .sort((a, b) => a.createdAt - b.createdAt)
  const left = [...batchTasks]
  for (const todo of [...pool]) {
    const i = left.findIndex((t) => t.title.trim() === todo.name.trim())
    if (i >= 0) {
      pairs.push([left[i]!.id, todo])
      left.splice(i, 1)
      pool.splice(pool.indexOf(todo), 1)
    }
  }
  // Renamed ones. A batch is created within the same second, so creation
  // order can't tell them apart. One leftover on each side is a certain
  // match. With more, pair by words shared with the original title, and only
  // when each task's best candidate is unique. Anything else is reported.
  if (left.length === 1 && pool.length === 1) {
    pairs.push([left[0]!.id, pool.splice(0, 1)[0]!])
    left.length = 0
  } else {
    for (const t of [...left]) {
      const scored = pool
        .map((todo) => ({ todo, score: sharedWords(t.title, todo.name) }))
        .sort((a, b) => b.score - a.score)
      const [best, second] = scored
      if (best && best.score > 0 && (!second || second.score < best.score)) {
        pairs.push([t.id, best.todo])
        pool.splice(pool.indexOf(best.todo), 1)
        left.splice(left.indexOf(t), 1)
      }
    }
  }
  return { pairs, unmatched: left, unexplained: pool }
}
