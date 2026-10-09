import { useLiveQuery } from 'dexie-react-hooks'
import { db, type ProjectPref, type ProjectStat } from './db'
import { projects, type ProjectMeta } from './projects'
import { isHidden, useApplyHiddenDefaults } from './projectStats'
import { useOwner } from './useOwner'

export interface VisibleProjects {
  /** Raw per-device stats; undefined while the first Dexie read is loading. */
  stats: ProjectStat[] | undefined
  statsById: Map<string, ProjectStat>
  /** Per-user starred/hidden choices (synced); undefined while loading. */
  prefs: ProjectPref[] | undefined
  /** Registry order, ownerOnly-filtered, hidden ones INCLUDED (palette, current-page entry). */
  permitted: ProjectMeta[]
  /** Registry order, ownerOnly-filtered, hidden projects removed. */
  visible: ProjectMeta[]
  /** Permitted projects the user hid (Home's "N hidden · manage"). */
  hiddenCount: number
  isStarred: (id: string) => boolean
}

// The project list Home and the sidebar both show: ownerOnly projects only for
// the owner, then the hidden filter (per-user prefs, synced when signed in). Local Dexie read only, no
// network: works offline and signed out.
export function useVisibleProjects(): VisibleProjects {
  const owner = useOwner()
  const applyDefaults = useApplyHiddenDefaults()
  const stats = useLiveQuery(() => db.projectStats.toArray())
  const statsById = new Map<string, ProjectStat>((stats ?? []).map((s) => [s.id, s]))
  const prefs = useLiveQuery(() => db.projectPrefs.toArray())
  const prefsById = new Map<string, ProjectPref>((prefs ?? []).map((p) => [p.id, p]))
  // Hidden projects drop out after the ownerOnly filter. While prefs load,
  // prefsById is empty so only the defaults apply — no flash of every tile.
  const permitted = projects.filter((p) => !p.ownerOnly || owner)
  const visible = permitted.filter((p) => !isHidden(p.id, prefsById.get(p.id), applyDefaults))
  return {
    stats,
    statsById,
    prefs,
    permitted,
    visible,
    hiddenCount: permitted.length - visible.length,
    isStarred: (id) => prefsById.get(id)?.starred === 1,
  }
}
