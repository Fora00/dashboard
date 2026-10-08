import { useSyncExternalStore } from 'react'
import { readString, writeString, type Codec } from './safeStorage'

// Sidebar collapse state (per device), shared between the Sidebar button, the
// `[` hotkey and the palette action: a tiny external store over the existing
// localStorage key so they all agree.
export const COLLAPSED_KEY = 'dashboard:sidebar-collapsed'

const collapsedCodec: Codec<boolean> = {
  parse: (raw) => raw === 'true',
  serialize: (collapsed) => (collapsed ? 'true' : 'false'),
}

let current: boolean | null = null
const listeners = new Set<() => void>()

function get(): boolean {
  if (current === null) current = collapsedCodec.parse(readString(COLLAPSED_KEY))
  return current
}

export function setSidebarCollapsed(next: boolean): void {
  current = next
  writeString(COLLAPSED_KEY, collapsedCodec.serialize(next))
  listeners.forEach((l) => l())
}

export function toggleSidebarCollapsed(): void {
  setSidebarCollapsed(!get())
}

function subscribe(l: () => void): () => void {
  listeners.add(l)
  return () => listeners.delete(l)
}

export function useSidebarCollapsed(): boolean {
  return useSyncExternalStore(subscribe, get, () => false)
}
