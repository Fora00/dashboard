import type { LifeTask } from '../../../lib/db'

// --- Things bridge -------------------------------------------------------------

export interface ThingsTodo {
  type: 'to-do'
  attributes: {
    title: string
    notes?: string
    when?: string
    deadline?: string
    tags?: string[]
    list?: string
    'list-id'?: string
  }
}

/** The JSON array handed to Things (exported for the preview and tests). */
export function thingsItems(tasks: readonly LifeTask[]): ThingsTodo[] {
  return tasks.map((t) => {
    const where = [t.area, t.project].filter((x): x is string => !!x).join(' › ')
    const notes = [t.notes, where].filter(Boolean).join('\n\n')
    const list = t.project ?? t.area
    const attributes: ThingsTodo['attributes'] = { title: t.title }
    if (notes) attributes.notes = notes
    if (t.when) attributes.when = t.when
    if (t.deadline) attributes.deadline = t.deadline
    if (t.tags.length) attributes.tags = t.tags
    // The id survives renames; the name is only the fallback.
    if (t.listId) attributes['list-id'] = t.listId
    else if (list) attributes.list = list
    return { type: 'to-do', attributes }
  })
}

export interface ThingsUrlOptions {
  /**
   * x-callback-url `x-success`: the URL Things opens after creating the
   * to-dos (it appends `x-things-ids=<JSON array>` to it). Only pass it where
   * canReturnFromThings() is true — see there.
   */
  xSuccess?: string
}

/**
 * `things:///json?data=…&reveal=true` creating one to-do per task (creation
 * only, no auth token). `list` is the project, else the area; a list or tag
 * that doesn't exist in Things is ignored by Things (to-do lands in the
 * Inbox), so "Area › Project" is always appended to the notes.
 *
 * With `xSuccess`, appends `&x-success=<encoded URL>`: every Things command
 * supports the x-callback-url convention as plain extra parameters on the
 * same `things:///<command>` URL (Things URL scheme docs).
 */
export function buildThingsUrl(tasks: readonly LifeTask[], opts: ThingsUrlOptions = {}): string {
  const data = encodeURIComponent(JSON.stringify(thingsItems(tasks)))
  const back = opts.xSuccess ? `&x-success=${encodeURIComponent(opts.xSuccess)}` : ''
  return `things:///json?data=${data}&reveal=true${back}`
}

/** True on iPhone/iPod/iPad, including iPadOS, which reports itself as a Mac. */
export function isIosLike(
  nav: { userAgent?: string; platform?: string; maxTouchPoints?: number } | undefined = typeof navigator ===
  'undefined'
    ? undefined
    : navigator,
): boolean {
  if (!nav) return false
  if (/iPad|iPhone|iPod/.test(nav.userAgent ?? '')) return true
  // iPadOS 13+ desktop-class Safari: platform "MacIntel", but a touchscreen.
  // Real Macs report 0 touch points.
  return (nav.platform ?? '') === 'MacIntel' && (nav.maxTouchPoints ?? 0) > 1
}

/**
 * Whether Things can bring the owner back here via x-success. False on
 * iOS/iPadOS: an https link opened from another app goes to Safari, never
 * into the installed PWA (separate storage, wrong app). True elsewhere (the
 * Mac, where the link reopens the browser the dashboard runs in).
 */
export function canReturnFromThings(
  nav: { userAgent?: string; platform?: string; maxTouchPoints?: number } | undefined = typeof navigator ===
  'undefined'
    ? undefined
    : navigator,
): boolean {
  return !!nav && !isIosLike(nav)
}

/**
 * The URL of the Life page of this very deployment (e.g.
 * `https://…/dashboard/#/life`), for buildThingsUrl's xSuccess. Things
 * appends `?x-things-ids=…`, which HashRouter reads as the route's search
 * string, so the route still matches /life.
 */
export function lifeReturnUrl(
  loc: { origin: string; pathname: string } = window.location,
  route = '/life',
): string {
  return `${loc.origin}${loc.pathname}#${route}`
}
