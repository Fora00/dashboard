import { useCallback, useSyncExternalStore } from 'react'
import type { CloudSync, SyncStatus } from './cloudSync'

// React binding for a CloudSync engine's observable status. Components read
// live sync state (pending/dead counts, last synced, last error, syncing) with:
//
//   const status = useSyncStatus(sync)
//
// `sync` is optional so a component can render before an engine is available
// (or in local-only builds) without breaking the rules of hooks — the hook is
// always called; a missing engine just yields the empty status below.

const EMPTY: SyncStatus = {
  pending: 0,
  dead: 0,
  lastSyncedAt: null,
  lastError: null,
  syncing: false,
}

export function useSyncStatus(sync?: CloudSync): SyncStatus {
  const subscribe = useCallback(
    (onChange: () => void) => (sync ? sync.subscribe(onChange) : () => {}),
    [sync],
  )
  const getSnapshot = useCallback(() => (sync ? sync.getStatus() : EMPTY), [sync])
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}
