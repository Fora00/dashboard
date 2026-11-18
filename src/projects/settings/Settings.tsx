import { confirm } from '../../lib/confirm'
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
import { downloadBlob } from '../../lib/downloadBlob'
import { clearKeysExcept } from '../../lib/safeStorage'
import { runSafe } from '../../lib/runSafe'
import { buildBackup, parseBackup, restoreBackup, type RestoreResult } from '../../lib/backup'
import { DataView } from './DataView'
import {
  PRIVATE_DATA_LABEL,
  clearPrivateData,
  privateDataSummary,
  removePrivateDataConfirm,
} from '../../lib/privateData'

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
    const ok = await confirm({ ...removePrivateDataConfirm(s.unsynced), confirmLabel: 'Remove', danger: true })
    if (!ok) return
    await clearPrivateData()
  }

  return (
    <Card className="space-y-2 text-sm">
      <div className="flex items-center justify-between gap-3">
        <span className="text-slate-500 dark:text-slate-400">
          {has
            ? `${PRIVATE_DATA_LABEL} are stored on this device. The cloud copy is kept.`
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

// Supabase's persisted session (default key `sb-<project ref>-auth-token`).
const isAuthKey = (key: string) => key.startsWith('sb-') && key.includes('-auth-token')

export function Settings() {
  const session = useAuth()
  const unsyncedAll = useLiveQuery(() => db.outbox.count())
  const [estimate, setEstimate] = useState<StorageEstimate | null>(null)
  const [persisted, setPersisted] = useState<boolean | null>(null)
  const [imported, setImported] = useState<RestoreResult | null>(null)

  useEffect(() => {
    void navigator.storage?.estimate?.().then(setEstimate)
    void navigator.storage?.persisted?.().then(setPersisted)
  }, [])

  async function requestPersist() {
    setPersisted(await requestPersistentStorage())
  }

  async function exportData() {
    const blob = new Blob([JSON.stringify(await buildBackup())], { type: 'application/json' })
    downloadBlob(blob, `dashboard-backup-${new Date().toISOString().slice(0, 10)}.json`)
  }

  async function importData(file: File) {
    setImported(await restoreBackup(parseBackup(await file.text())))
  }

  async function wipeLocal() {
    const ok = await confirm({
      title: 'Wipe all data on this device?',
      body:
        'Everything stored on this device is deleted.' +
        (session ? ' Synced data in the cloud is kept, and you stay signed in.' : '') +
        (unsyncedAll
          ? `\n\n${unsyncedAll} change${unsyncedAll === 1 ? ' has' : 's have'} not reached the cloud and will be lost for good.`
          : ''),
      confirmLabel: 'Wipe',
      danger: true,
    })
    if (!ok) return
    // Dexie first, in ONE transaction (all or nothing): it holds the real data.
    // Then the per-device prefs in localStorage, best effort: if storage is
    // blocked that only leaves harmless prefs behind instead of failing a
    // half-finished wipe. The Supabase session key stays, so wiping the device
    // does not sign you out (use Sign out for that).
    await db.transaction('rw', db.tables, async () => {
      for (const t of db.tables) await t.clear()
    })
    clearKeysExcept(isAuthKey)
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
              data, and where this device has a newer copy of a row, the newer one stays.
            </p>
            {syncEnabled && (
              <p className="text-slate-500 dark:text-slate-400">
                {session
                  ? 'Signed in: imported rows of synced projects are uploaded too. Rows the server refuses (projects you are not part of) stay on this device and show up as rejected changes.'
                  : 'Signed out: imported rows stay on this device and upload the next time you sign in.'}
              </p>
            )}
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
                <span className="text-emerald-700 dark:text-emerald-300">
                  Restored {imported.restored} rows
                  {imported.kept > 0 && <> ({imported.kept} already up to date here)</>} ✅
                </span>
              )}
            </div>
          </Card>
        </section>

        <section>
          <h2 className="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">Danger zone</h2>
          <div className="mb-3">
            <PrivateDataCard />
          </div>
          <Card className="space-y-2 text-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-500 dark:text-slate-400">
                Delete all data stored on this device.
                {session && ' Synced data in the cloud is kept, and you stay signed in.'}
              </span>
              <Button variant="danger" onClick={() => void runSafe(wipeLocal, 'Could not wipe data')()}>
                Wipe device data
              </Button>
            </div>
            {unsyncedAll !== undefined && unsyncedAll > 0 && (
              <p className="text-rose-600 dark:text-rose-400">
                ⚠️ {unsyncedAll} change{unsyncedAll === 1 ? ' has' : 's have'} not reached the cloud yet. Wiping deletes{' '}
                {unsyncedAll === 1 ? 'it' : 'them'} for good.
              </p>
            )}
          </Card>
        </section>
      </div>
    </div>
  )
}
