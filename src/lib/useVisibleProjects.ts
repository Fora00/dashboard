import { useLiveQuery } from 'dexie-react-hooks'
import { db, type ProjectStat } from './db'
import { projects, type ProjectMeta } from './projects'
import { isHidden, useApplyHiddenDefaults } from './projectStats'
import { useOwner } from './useOwner'

export interface VisibleProjects {
  /** Raw per-device stats; undefined while the first Dexie read is loading. */
  stats: ProjectStat[] | undefined
  statsById: Map<string, ProjectStat>
  /** Registry order, ownerOnly-filtered, hidden ones INCLUDED (palette, current-page entry). */
  permitted: ProjectMeta[]
  /** Registry order, ownerOnly-filtered, hidden projects removed. */
  visible: ProjectMeta[]
  /** Permitted projects the user hid (Home's "N hidden · manage"). */
  hiddenCount: number
  isStarred: (id: string) => boolean
}

// The project list Home and the sidebar both show: ownerOnly projects only for
// the owner, then the per-device hidden filter. Local Dexie read only, no
// network: works offline and signed out.
export function useVisibleProjects(): VisibleProjects {
  const owner = useOwner()
  const applyDefaults = useApplyHiddenDefaults()
  const stats = useLiveQuery(() => db.projectStats.toArray())
  const statsById = new Map<string, ProjectStat>((stats ?? []).map((s) => [s.id, s]))
  // Hidden projects drop out after the ownerOnly filter. While stats load,
  // statsById is empty so only the defaults apply — no flash of every tile.
  const permitted = projects.filter((p) => !p.ownerOnly || owner)
  const visible = permitted.filter((p) => !isHidden(p.id, statsById.get(p.id), applyDefaults))
  return {
    stats,
    statsById,
    permitted,
    visible,
    hiddenCount: permitted.length - visible.length,
    isStarred: (id) => statsById.get(id)?.starred === 1,
  }
}
