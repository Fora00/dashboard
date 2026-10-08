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
export function groupByArea(ordered: ProjectMeta[], isStarred: (id: string) => boolean): HomeSection[] {
  const sections: HomeSection[] = []
  const starred = ordered.filter((p) => isStarred(p.id))
  if (starred.length > 0)
    sections.push({
      id: 'starred',
      title: 'Starred',
      color: null,
      projects: starred,
    })
  for (const id of areaIds) {
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
