import { useSyncExternalStore } from 'react'
import type { AreaId } from './areas'
import { sanitizeAreaOrder } from './groupByArea'
import { readJSON, writeJSON } from './safeStorage'

// Home's area order (per device), shared by Home (which edits it) and the
// persistent Sidebar (which follows it): a tiny external store over the
// localStorage key, like useSidebarCollapsed, so both always agree.
export const HOME_AREA_ORDER_KEY = 'dashboard:home-area-order'

let current: AreaId[] | null = null
const listeners = new Set<() => void>()

function get(): AreaId[] {
  if (current === null) current = readJSON(HOME_AREA_ORDER_KEY, sanitizeAreaOrder, sanitizeAreaOrder(null))
  return current
}

export function setAreaOrder(next: AreaId[]): void {
  current = next
  writeJSON(HOME_AREA_ORDER_KEY, next)
  listeners.forEach((l) => l())
}

function subscribe(l: () => void): () => void {
  listeners.add(l)
  return () => listeners.delete(l)
}

export function useAreaOrder(): [AreaId[], (next: AreaId[]) => void] {
  const order = useSyncExternalStore(subscribe, get, () => sanitizeAreaOrder(null))
  return [order, setAreaOrder]
}
