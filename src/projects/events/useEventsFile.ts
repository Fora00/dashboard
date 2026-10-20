import { useEffect, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../lib/db'
import { fetchEventsFile } from './model'

export type FetchState = 'loading' | 'ok' | 'offline' | 'missing'

/**
 * events.json through the offline cache (Dexie): the cached copy is live, the
 * network refresh replaces it. `cache` is null until Dexie answered, undefined
 * when nothing is cached yet. `now` is read once per mount / refresh.
 */
export function useEventsFile() {
  const cache = useLiveQuery(() => db.eventsCache.get('latest'), [], null)
  const [fetchState, setFetchState] = useState<FetchState>('loading')
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    let cancelled = false
    void (async () => {
      const out = await fetchEventsFile()
      if (cancelled) return
      if (out.kind === 'ok' && out.file.events.length === 0) {
        // An empty (or all-malformed) file never replaces the offline cache.
        setFetchState('offline')
      } else if (out.kind === 'ok') {
        await db.eventsCache.put({ id: 'latest', file: out.file, fetchedAt: Date.now() })
        setNow(Date.now())
        setFetchState('ok')
      } else {
        setFetchState(out.kind)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return { cache, fetchState, now }
}
