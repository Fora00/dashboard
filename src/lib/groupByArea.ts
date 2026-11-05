import { areaIds, areas, type AreaId } from './areas'
import type { ProjectMeta } from './projects'

export interface HomeSection {
  id: AreaId | 'starred'
  title: string
  // Dot colour; null for the starred section (it shows a star instead).
  color: string | null
  projects: ProjectMeta[]
}

// Splits an ALREADY ordered list (Home applies starred-first + the chosen
// sort/reverse) into sections: a "Starred" section on top, then one section
// per area in areas.ts order holding the unstarred projects. Relative order of
// the input is preserved inside every section; empty sections are omitted.
// Hidden projects must be filtered out by the caller, as before.
export function groupByArea(
  ordered: ProjectMeta[],
  isStarred: (id: string) => boolean,
  areaOrder: readonly AreaId[] = areaIds,
): HomeSection[] {
  const sections: HomeSection[] = []
  const starred = ordered.filter((p) => isStarred(p.id))
  if (starred.length > 0)
    sections.push({
      id: 'starred',
      title: 'Starred',
      color: null,
      projects: starred,
    })
  for (const id of areaOrder) {
    const list = ordered.filter((p) => !isStarred(p.id) && p.area === id)
    if (list.length > 0)
      sections.push({
        id,
        title: areas[id].name,
        color: areas[id].color,
        projects: list,
      })
  }
  return sections
}

/** A stored section order made valid: unknown/duplicate ids dropped, missing areas appended in default order. */
export function sanitizeAreaOrder(raw: unknown): AreaId[] {
  const out: AreaId[] = []
  if (Array.isArray(raw))
    for (const v of raw) if (areaIds.includes(v as AreaId) && !out.includes(v as AreaId)) out.push(v as AreaId)
  for (const id of areaIds) if (!out.includes(id)) out.push(id)
  return out
}

/** Move `id` one step up (-1) or down (+1) in `order`; unchanged at the ends. */
export function moveArea(order: readonly AreaId[], id: AreaId, dir: -1 | 1): AreaId[] {
  const i = order.indexOf(id)
  const j = i + dir
  if (i < 0 || j < 0 || j >= order.length) return [...order]
  const next = [...order]
  ;[next[i], next[j]] = [next[j] as AreaId, next[i] as AreaId]
  return next
}
