import { projectForPath } from './accent'
import { areaIds, areas } from './areas'
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
export function navSections(
  visible: ProjectMeta[],
  isStarred: (id: string) => boolean,
  current?: ProjectMeta | null,
): HomeSection[] {
  const sections = groupByArea(visible, isStarred)
  // The page you are on stays in the nav even when it is not in the list (a
  // hidden project, opened by link or from the palette): an extra entry at
  // the top of its area section (the section is created if it would be empty).
  if (!current || visible.some((p) => p.id === current.id)) return sections
  const section = sections.find((s) => s.id === current.area)
  if (section) {
    section.projects = [current, ...section.projects]
    return sections
  }
  const created: HomeSection = {
    id: current.area,
    title: areas[current.area].name,
    color: areas[current.area].color,
    projects: [current],
  }
  const rank = (s: HomeSection) => (s.id === 'starred' ? -1 : areaIds.indexOf(s.id))
  const at = sections.findIndex((s) => rank(s) > rank(created))
  sections.splice(at < 0 ? sections.length : at, 0, created)
  return sections
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
