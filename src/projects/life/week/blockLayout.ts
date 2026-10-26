// Where each block of the week screen sits: three columns of block ids (the
// lg/xl grid; on a phone the columns flatten into one, in this order). Synced
// per user in project_prefs (row 'life', column layout) so every device shows
// the same arrangement; local Dexie first, works signed out.

export const BLOCK_IDS = [
  'oggi',
  'playbook',
  'focus',
  'trackers',
  'recap',
  'rules',
  'things',
  'checkins',
  'sunday',
  'food',
  'screen',
  'export',
  'progress',
] as const

export type BlockId = (typeof BLOCK_IDS)[number]
export type BlockLayout = BlockId[][]

export const DEFAULT_LAYOUT: BlockLayout = [
  ['oggi', 'playbook', 'focus', 'trackers', 'recap', 'rules'],
  ['things', 'checkins', 'sunday'],
  ['food', 'screen', 'export', 'progress'],
]

const known = new Set<string>(BLOCK_IDS)

/** Any stored value -> a layout holding every block exactly once: unknown and
 * duplicate ids dropped, blocks missing from storage (new ones) put back in
 * their default column. */
export function sanitizeLayout(raw: unknown): BlockLayout {
  const seen = new Set<string>()
  const cols: BlockLayout = DEFAULT_LAYOUT.map(() => [])
  const place = (c: number, id: BlockId) => cols[c]?.push(id)
  if (Array.isArray(raw)) {
    raw.slice(0, cols.length).forEach((col, c) => {
      if (!Array.isArray(col)) return
      for (const id of col) {
        if (typeof id === 'string' && known.has(id) && !seen.has(id)) {
          seen.add(id)
          place(c, id as BlockId)
        }
      }
    })
  }
  DEFAULT_LAYOUT.forEach((col, c) => {
    for (const id of col) if (!seen.has(id)) place(c, id)
  })
  return cols
}

/** Up/down walk the flattened order (what a phone shows), skipping blocks that
 * aren't on screen; at a column's edge the block crosses into the neighbour. */
export function moveVertical(
  layout: BlockLayout,
  id: BlockId,
  dir: -1 | 1,
  present: ReadonlySet<BlockId>,
): BlockLayout {
  const flat = layout.flatMap((col, c) => col.map((b) => ({ b, c })))
  const from = flat.findIndex((e) => e.b === id)
  if (from < 0) return layout
  let to = from + dir
  for (let e = flat[to]; e && !present.has(e.b); e = flat[to]) to += dir
  const target = flat[to]
  if (!target) return layout
  const next = layout.map((col) => col.filter((b) => b !== id))
  const col = next[target.c]
  if (!col) return layout
  const at = col.indexOf(target.b)
  col.splice(dir === -1 ? at : at + 1, 0, id)
  return next
}

/** Left/right (lg+): to the neighbouring column, same row where possible. */
export function moveHorizontal(layout: BlockLayout, id: BlockId, dir: -1 | 1): BlockLayout {
  const c = layout.findIndex((col) => col.includes(id))
  const row = layout[c]?.indexOf(id) ?? -1
  if (c < 0 || !layout[c + dir]) return layout
  const next = layout.map((col) => col.filter((b) => b !== id))
  const col = next[c + dir]
  col?.splice(Math.min(row, col.length), 0, id)
  return next
}
