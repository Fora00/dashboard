import type { EventItem } from './types'

// "Come" (format) filter: three tags the crawler puts in `tags`. No React.

export const FORMAT_CHIPS: { id: string; label: string }[] = [
  { id: 'social-friend', label: 'Nuovi amici' },
  { id: 'social-girl', label: 'Conoscere ragazze' },
  { id: 'solo-ok', label: 'Da solo va bene' },
]

const SOCIAL = ['social-friend', 'social-girl']
const SOLO = 'solo-ok'

export function formatLabel(id: string): string {
  return FORMAT_CHIPS.find((c) => c.id === id)?.label ?? id
}

/** Only known ids, in chip order, no duplicates. */
export function cleanFormats(ids: readonly string[]): string[] {
  return FORMAT_CHIPS.map((c) => c.id).filter((id) => ids.includes(id))
}

/**
 * The social chips combine with OR; solo-ok is an AND constraint on top.
 * Nothing selected = every event.
 */
export function matchesFormat(e: EventItem, selected: string[]): boolean {
  const social = selected.filter((s) => SOCIAL.includes(s))
  if (social.length > 0 && !social.some((s) => e.tags.includes(s))) return false
  if (selected.includes(SOLO) && !e.tags.includes(SOLO)) return false
  return true
}
