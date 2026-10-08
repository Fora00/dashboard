import type { ProjectMeta } from './projects'

// Home sections. Names and base colours come from the owner's icon choice
// (scripts/icons/choice.json). Key order is the order sections appear in.
export type AreaId = 'utility' | 'casa' | 'organizzazione' | 'sport' | 'svago'

export const areas: Record<AreaId, { name: string; color: string }> = {
  utility: { name: 'Utility', color: '#64748b' },
  casa: { name: 'Casa e cibo', color: '#e11d48' },
  organizzazione: { name: 'Organizzazione e crescita', color: '#22c55e' },
  sport: { name: 'Sport, viaggi e uscite', color: '#0ea5e9' },
  svago: { name: 'Svago e idee', color: '#f59e0b' },
}

export const areaIds = Object.keys(areas) as AreaId[]

export function areaOf(p: ProjectMeta): {
  id: AreaId
  name: string
  color: string
} {
  return { id: p.area, ...areas[p.area] }
}
