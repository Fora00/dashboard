import { useEffect, useState } from 'react'
import { formatBytes, formatDate, relativeTime } from '../../lib/format'
import { watchedEngines } from '../../lib/syncHealth'
import { useAuth } from '../../lib/useAuth'
import { useOnline } from '../../lib/useOnline'

// Settings → "Data on this device" → System: connection, last pull, build and
// storage. All local (no network calls), so it works signed out and offline.

/** Latest successful pull across every watched engine, re-read on any change. */
function useLastPull(): number | null {
  const read = () =>
    watchedEngines.reduce<number | null>((max, w) => {
      const t = w.sync.getStatus().lastSyncedAt
      return t !== null && (max === null || t > max) ? t : max
    }, null)
  const [last, setLast] = useState(read)
  useEffect(() => {
    const offs = watchedEngines.map((w) => w.sync.subscribe(() => setLast(read())))
    return () => offs.forEach((off) => off())
  }, [])
  return last
}

function useStorage(): { used: number; quota: number } | null {
  const [est, setEst] = useState<{ used: number; quota: number } | null>(null)
  useEffect(() => {
    void navigator.storage?.estimate?.().then((e) => {
      if (e.usage !== undefined && e.quota !== undefined) setEst({ used: e.usage, quota: e.quota })
    })
  }, [])
  return est
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex min-h-8 items-center justify-between gap-3">
      <span className="min-w-0 truncate text-slate-600 dark:text-slate-400">{label}</span>
      <span className="shrink-0 text-slate-800 dark:text-slate-200">{value}</span>
    </li>
  )
}

export function SystemStatus() {
  const session = useAuth()
  const online = useOnline()
  const lastPull = useLastPull()
  const storage = useStorage()

  return (
    <div>
      <h3 className="mb-1 font-medium text-slate-700 dark:text-slate-300">System</h3>
      <ul className="divide-y divide-slate-200 dark:divide-slate-700/60">
        <Row label="Connection" value={online ? 'Online' : 'Offline'} />
        <Row label="Account" value={session === undefined ? '…' : session ? 'Signed in' : 'Signed out'} />
        <Row label="Last pull" value={lastPull === null ? 'Not yet' : relativeTime(lastPull)} />
        <Row label="Build" value={`${__BUILD_COMMIT__} · ${formatDate(Date.parse(__BUILD_TIME__))}`} />
        {storage && <Row label="Storage" value={`${formatBytes(storage.used)} of ${formatBytes(storage.quota)}`} />}
      </ul>
    </div>
  )
}
