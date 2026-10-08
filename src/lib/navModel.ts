import { projectForPath } from './accent'
import { groupByArea, type HomeSection } from './groupByArea'
import type { ProjectLayout, ProjectMeta } from './projects'

// Pure model behind the app shell (UI1): which sections the sidebar shows,
// which entry is active, and how wide the content column is for a route.
// Kept free of React so it is unit-tested (navModel.test.ts).

/**
 * Sidebar sections: Starred first, then one per area in areas.ts order (the
 * same split Home uses). `visible` must already be ownerOnly- and
 * hidden-filtered (useVisibleProjects). Inside a section the REGISTRY order
 * is kept on purpose: Home's "most used / recent" orders reshuffle on every
 * open, which is fine for a grid you scan but bad for a nav you click by
 * position.
 */
export function navSections(visible: ProjectMeta[], isStarred: (id: string) => boolean): HomeSection[] {
  return groupByArea(visible, isStarred)
}

/** Id of the project the route belongs to (sub-pages included, e.g. /life/edit), or null (Home, join, unknown). */
export function activeProjectId(pathname: string): string | null {
  return projectForPath(pathname)?.id ?? null
}

/** Whether the app title (the Home link) is the current page. */
export function isHomePath(pathname: string): boolean {
  return pathname === '/' || pathname === ''
}

/**
 * Content width for a route. Home is wide; a project uses its registry
 * `layout` (default narrow); join pages and unknown routes are narrow.
 */
export function layoutForPath(pathname: string): ProjectLayout {
  if (isHomePath(pathname)) return 'wide'
  return projectForPath(pathname)?.layout ?? 'narrow'
}

/**
 * Width classes for <main>. Below lg every page keeps today's max-w-3xl
 * column; from lg a wide page grows to max-w-6xl, a narrow one stays 3xl and
 * sits centred in the content area (mx-auto).
 */
export function contentWidthClass(layout: ProjectLayout): string {
  return layout === 'wide' ? 'max-w-3xl lg:max-w-6xl lg:px-8' : 'max-w-3xl lg:px-6'
}
