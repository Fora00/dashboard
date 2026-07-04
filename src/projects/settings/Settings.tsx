import { useEffect, useState } from 'react'
import { db, requestPersistentStorage } from '../../lib/db'
import { formatBytes } from '../../lib/format'
import { syncEnabled } from '../../lib/sync'
import { useAuth } from '../../lib/useAuth'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { PageHeader } from '../../components/PageHeader'
import { SyncCard } from '../../components/SyncCard'

// Per-device settings: storage usage, persistence, sync status, local wipe.

export function Settings() {
  const session = useAuth()
  const [estimate, setEstimate] = useState<StorageEstimate | null>(null)
  const [persisted, setPersisted] = useState<boolean | null>(null)
  const [confirmWipe, setConfirmWipe] = useState(false)

  useEffect(() => {
    void navigator.storage?.estimate?.().then(setEstimate)
    void navigator.storage?.persisted?.().then(setPersisted)
  }, [])

  async function requestPersist() {
    setPersisted(await requestPersistentStorage())
  }

  async function wipeLocal() {
    if (!confirmWipe) {
      setConfirmWipe(true)
      return
    }
    await Promise.all(db.tables.map((t) => t.clear()))
    localStorage.clear()
    setConfirmWipe(false)
  }

  return (
    <div>
      <PageHeader
        emoji="⚙️"
        title="Settings"
        subtitle="This device's storage and sync."
      />

      <div className="space-y-6">
        <section>
          <h2 className="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">Cloud sync</h2>
          {syncEnabled ? (
            <SyncCard />
          ) : (
            <Card className="text-sm text-slate-500 dark:text-slate-400">
              ☁️ Sync isn't configured in this build.
            </Card>
          )}
        </section>

        <section>
          <h2 className="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">Storage</h2>
          <Card className="space-y-3 text-sm">
            <p className="text-slate-500 dark:text-slate-400">
              Used:{' '}
              <span className="text-slate-800 dark:text-slate-200">
                {estimate?.usage !== undefined ? formatBytes(estimate.usage) : '…'}
              </span>
              {estimate?.quota !== undefined && (
                <> of {formatBytes(estimate.quota)} available</>
              )}
            </p>
            <p className="text-slate-500 dark:text-slate-400">
              Protected from eviction:{' '}
              <span className="text-slate-800 dark:text-slate-200">
                {persisted === null ? '…' : persisted ? 'yes ✅' : 'no'}
              </span>
              {persisted === false && (
                <Button variant="ghost" className="ml-3" onClick={() => void requestPersist()}>
                  Request
                </Button>
              )}
            </p>
          </Card>
        </section>

        <section>
          <h2 className="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">Danger zone</h2>
          <Card className="flex items-center justify-between gap-3 text-sm">
            <span className="text-slate-500 dark:text-slate-400">
              Delete all data stored on this device.
              {session && ' Synced data in the cloud is kept.'}
            </span>
            <Button variant="danger" onClick={() => void wipeLocal()}>
              {confirmWipe ? 'Really wipe?' : 'Wipe device data'}
            </Button>
          </Card>
        </section>
      </div>
    </div>
  )
}
