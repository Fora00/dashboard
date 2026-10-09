import { useEffect, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, requestPersistentStorage, type ProjectPref } from '../../lib/db'
import { formatBytes } from '../../lib/format'
import { projects } from '../../lib/projects'
import { NEVER_HIDDEN, isHidden, setHidden, useApplyHiddenDefaults } from '../../lib/projectStats'
import { sync as projectPrefsSync } from '../../lib/projectPrefsSync'
import { syncEnabled } from '../../lib/sync'
import { useAuth } from '../../lib/useAuth'
import { useOwner } from '../../lib/useOwner'
import { Button } from '../../components/Button'
import { ProjectIcon } from '../../components/ProjectIcon'
import { Card } from '../../components/Card'
import { PageHeader } from '../../components/PageHeader'
import { SyncCard } from '../../components/SyncCard'
import { runSafe } from '../../lib/runSafe'
import { buildBackup, parseBackup, restoreBackup } from '../../lib/backup'
import { DataView } from './DataView'
import { clearPrivateData, privateDataSummary } from '../../lib/privateData'

// Settings: project visibility (per user, synced when signed in), storage
// usage, persistence, sync status, local wipe.

// Show/hide switches for the home grid. Same ownerOnly rule as Home, minus
// the never-hideable projects (this page and Sharing).
function ProjectVisibility() {
  const owner = useOwner()
  const applyDefaults = useApplyHiddenDefaults()
  const prefs = useLiveQuery(() => db.projectPrefs.toArray())
  if (prefs === undefined) return null
  const prefsById = new Map<string, ProjectPref>(prefs.map((p) => [p.id, p]))
  const hideable = projects.filter((p) => (!p.ownerOnly || owner) && !NEVER_HIDDEN.has(p.id))

  return (
    <section>
      <h2 className="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">Projects</h2>
      <Card className="text-sm">
        <p className="mb-2 text-slate-500 dark:text-slate-400">
          Hidden projects stay reachable by URL; no data is deleted.
        </p>
        <ul className="divide-y divide-slate-200 dark:divide-slate-700/60">
          {hideable.map((p) => {
            const shown = !isHidden(p.id, prefsById.get(p.id), applyDefaults)
            return (
              <li key={p.id}>
                <button
                  type="button"
                  role="switch"
                  aria-checked={shown}
                  aria-label={`Show ${p.name} on home`}
                  onClick={() => void runSafe(setHidden, 'Could not save')(p.id, shown)}
                  className="flex min-h-11 w-full items-center gap-3 text-left"
                >
                  <ProjectIcon project={p} size="sm" />
                  <span className="flex-1 text-slate-800 dark:text-slate-200">{p.name}</span>
                  <span
                    aria-hidden="true"
                    className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                      shown ? 'bg-(--accent)' : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                        shown ? 'translate-x-5' : 'translate-x-0.5'
                      }`}
                    />
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </Card>
    </section>
  )
}

// Always available, enabled only while owner-only rows are on the device
// (they stay after a sign-out). Warns about changes that never synced.
function PrivateDataCard() {
  const summary = useLiveQuery(() => privateDataSummary())
  const has = (summary?.rows ?? 0) + (summary?.unsynced ?? 0) > 0

  async function remove() {
    const s = await privateDataSummary()
    const lost =
      s.unsynced > 0
        ? `\n\n${s.unsynced} change${s.unsynced === 1 ? ' was' : 's were'} never synced and will be lost for good.`
        : ''
    const ok = window.confirm(
      'Remove Life, Meal Diary and your events data from this device? The copy in the cloud is kept: ' +
        `sign in again to get it back.${lost}`,
    )
    if (!ok) return
    await clearPrivateData()
  }

  return (
    <Card className="space-y-2 text-sm">
      <div className="flex items-center justify-between gap-3">
        <span className="text-slate-500 dark:text-slate-400">
          {has
            ? 'Life, Meal Diary and your events are stored on this device. The cloud copy is kept.'
            : 'No private data on this device.'}
        </span>
        <Button variant="danger" disabled={!has} onClick={() => void runSafe(remove, 'Could not remove data')()}>
          Remove private data from this device
        </Button>
      </div>
      {summary && summary.unsynced > 0 && (
        <p className="text-rose-600 dark:text-rose-400">
          ⚠️ {summary.unsynced} change
          {summary.unsynced === 1 ? ' has' : 's have'} not reached the cloud yet. Removing deletes{' '}
          {summary.unsynced === 1 ? 'it' : 'them'} for good.
        </p>
      )}
    </Card>
  )
}

export function Settings() {
  const session = useAuth()
  const [estimate, setEstimate] = useState<StorageEstimate | null>(null)
  const [persisted, setPersisted] = useState<boolean | null>(null)
  const [confirmWipe, setConfirmWipe] = useState(false)
  const [imported, setImported] = useState<number | null>(null)

  useEffect(() => {
    void navigator.storage?.estimate?.().then(setEstimate)
    void navigator.storage?.persisted?.().then(setPersisted)
  }, [])

  async function requestPersist() {
    setPersisted(await requestPersistentStorage())
  }

  async function exportData() {
    const blob = new Blob([JSON.stringify(await buildBackup())], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `dashboard-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  async function importData(file: File) {
    const rows = await restoreBackup(parseBackup(await file.text()))
    setImported(rows)
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
      <PageHeader emoji="⚙️" title="Settings" subtitle="This device's storage and sync." />

      <div className="space-y-6">
        <ProjectVisibility />

        <section>
          <h2 className="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">Cloud sync</h2>
          {syncEnabled ? (
            // The engine shown here is the home layout's (starred/hidden), the
            // one sync this page owns: its Retry/Discard live here.
            <SyncCard sync={projectPrefsSync} />
          ) : (
            <Card className="text-sm text-slate-500 dark:text-slate-400">☁️ Sync isn't configured in this build.</Card>
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
              {estimate?.quota !== undefined && <> of {formatBytes(estimate.quota)} available</>}
            </p>
            <p className="text-slate-500 dark:text-slate-400">
              Protected from eviction:{' '}
              <span className="text-slate-800 dark:text-slate-200">
                {persisted === null ? '…' : persisted ? 'yes ✅' : 'no'}
              </span>
              {persisted === false && (
                <Button
                  variant="ghost"
                  className="ml-3"
                  onClick={() => void runSafe(requestPersist, 'Could not request persistence')()}
                >
                  Request
                </Button>
              )}
            </p>
          </Card>
        </section>

        <DataView />

        <section>
          <h2 className="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">Backup</h2>
          <Card className="space-y-3 text-sm">
            <p className="text-slate-500 dark:text-slate-400">
              Save everything on this device to one file, or merge a saved file back in. Importing never deletes current
              data.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="ghost" onClick={() => void runSafe(exportData, 'Could not export data')()}>
                Export backup
              </Button>
              <label className="inline-flex min-h-10 cursor-pointer items-center rounded-lg px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
                Import backup
                <input
                  type="file"
                  accept="application/json,.json"
                  className="sr-only"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    e.target.value = ''
                    if (file) void runSafe(() => importData(file), 'Could not import backup')()
                  }}
                />
              </label>
              {imported !== null && (
                <span className="text-emerald-700 dark:text-emerald-300">Restored {imported} rows ✅</span>
              )}
            </div>
          </Card>
        </section>

        <section>
          <h2 className="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">Danger zone</h2>
          <div className="mb-3">
            <PrivateDataCard />
          </div>
          <Card className="flex items-center justify-between gap-3 text-sm">
            <span className="text-slate-500 dark:text-slate-400">
              Delete all data stored on this device.
              {session && ' Synced data in the cloud is kept.'}
            </span>
            <Button variant="danger" onClick={() => void runSafe(wipeLocal, 'Could not wipe data')()}>
              {confirmWipe ? 'Really wipe?' : 'Wipe device data'}
            </Button>
          </Card>
        </section>
      </div>
    </div>
  )
}
