import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { projects } from '../lib/projects'
import { FOCUS_RING } from './focus'
import { ProjectIcon } from './ProjectIcon'

// The one way a page points at ANOTHER project ("open in Meal Diary"). It
// resolves the route and icon from the registry by project id, so a moved or
// renamed project can't leave a dead hard-coded path behind. `path` appends a
// sub-route/query inside that project (e.g. '?day=2026-10-26'). An unknown id
// renders nothing. Owner-only targets are the caller's business: only link
// from a place the viewer can already reach them.
export function ProjectLink({
  id,
  path = '',
  children,
  className = '',
}: {
  id: string
  path?: string
  children?: ReactNode
  className?: string
}) {
  const project = projects.find((p) => p.id === id)
  if (!project) return null
  return (
    <Link
      to={project.path + path}
      className={`inline-flex min-h-10 items-center gap-2 rounded-lg px-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 ${FOCUS_RING} ${className}`}
    >
      <ProjectIcon project={project} size="sm" />
      {children ?? project.name}
      <span aria-hidden="true">→</span>
    </Link>
  )
}
