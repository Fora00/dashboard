import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { accentVars, projectForPath, type AccentVars } from './accent'
import type { ProjectMeta } from './projects'

/** The current route's project and its accent CSS variables; null off-project (Home, join pages: indigo defaults). */
export function useProjectAccent(): { project: ProjectMeta; vars: AccentVars } | null {
  const { pathname } = useLocation()
  return useMemo(() => {
    const project = projectForPath(pathname)
    return project ? { project, vars: accentVars(project) } : null
  }, [pathname])
}
