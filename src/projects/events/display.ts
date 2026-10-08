// Small display helpers shared by the event card and the detail panel.
import type { EventItem } from './types'
import { isManual, isSafeImageDataUrl } from './custom'
import { safeHttpUrl } from './model'

/** Scraped images must be http(s); a hand-added one is an inline JPEG data URL. */
export function eventImage(e: EventItem): string | null {
  return isManual(e) && isSafeImageDataUrl(e.image) ? e.image : safeHttpUrl(e.image)
}

/** "Venue · City", or whichever of the two exists. */
export function eventPlace(e: Pick<EventItem, 'venue' | 'city'>): string {
  return [e.venue, e.city].filter(Boolean).join(' · ')
}

/** Apple Maps search for the place (opens Maps on iPhone/iPad/Mac, the web map elsewhere); null without a place. */
export function mapsUrl(e: Pick<EventItem, 'venue' | 'city'>): string | null {
  const q = [e.venue, e.city].filter(Boolean).join(', ')
  return q ? `https://maps.apple.com/?q=${encodeURIComponent(q)}` : null
}
