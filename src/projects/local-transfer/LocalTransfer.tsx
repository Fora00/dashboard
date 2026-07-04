import { useCallback, useEffect, useRef, useState, type DragEvent } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, requestPersistentStorage, type TransferFile } from '../../lib/db'
import { formatBytes, formatDate } from '../../lib/format'
import { useOnline } from '../../lib/useOnline'
import { useAuth } from '../../lib/useAuth'
import {
  downloadRemote,
  listRemote,
  removeRemote,
  signedLink,
  uploadPending,
  type RemoteFile,
} from '../../lib/transferSync'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { PageHeader } from '../../components/PageHeader'
import { EmptyState } from '../../components/EmptyState'
import { SyncCard } from '../../components/SyncCard'

export function LocalTransfer() {
  const online = useOnline()
  const session = useAuth()
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)
  const [remote, setRemote] = useState<RemoteFile[] | null>(null)
  const [busy, setBusy] = useState(false)

  const files = useLiveQuery(() => db.files.orderBy('createdAt').reverse().toArray())
  const totalBytes = files?.reduce((sum, f) => sum + f.size, 0) ?? 0
  const localIds = new Set(files?.map((f) => f.id) ?? [])
  // Cloud files not present on this device.
  const cloudOnly = remote?.filter((r) => !localIds.has(r.id)) ?? []

  const refreshRemote = useCallback(async () => {
    if (!session || !online) return
    setRemote(await listRemote())
  }, [session, online])

  useEffect(() => {
    void refreshRemote()
  }, [refreshRemote])

  async function addFiles(list: FileList | File[]) {
    const picked = Array.from(list)
    if (picked.length === 0) return
    await requestPersistentStorage()
    await db.files.bulkAdd(
      picked.map((file) => ({
        id: crypto.randomUUID(),
        name: file.name,
        type: file.type || 'application/octet-stream',
        size: file.size,
        blob: file,
        createdAt: Date.now(),
        synced: 0 as const,
      })),
    )
    await uploadPending()
    await refreshRemote()
  }

  function onDrop(e: DragEvent) {
    e.preventDefault()
    setDragActive(false)
    void addFiles(e.dataTransfer.files)
  }

  function download(f: TransferFile) {
    const url = URL.createObjectURL(f.blob)
    const a = document.createElement('a')
    a.href = url
    a.download = f.name
    a.click()
    URL.revokeObjectURL(url)
  }

  async function share(f: TransferFile) {
    const file = new File([f.blob], f.name, { type: f.type })
    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: f.name })
      } catch {
        // user cancelled the share sheet — nothing to do
      }
    } else {
      download(f)
    }
  }

  async function copyLink(f: TransferFile) {
    setBusy(true)
    try {
      const url = await signedLink(f)
      if (navigator.share) await navigator.share({ url }).catch(() => {})
      else await navigator.clipboard.writeText(url)
    } catch {
      // not uploaded yet or offline
    } finally {
      setBusy(false)
    }
  }

  async function remove(f: TransferFile) {
    const where = f.synced === 1 ? 'on all devices' : 'on this device only'
    if (!window.confirm(`Delete "${f.name}"? This removes it ${where}.`)) return
    await db.files.delete(f.id)
    if (f.synced === 1 && f.remoteUrl) {
      await removeRemote(f.remoteUrl)
      await refreshRemote()
    }
  }

  async function fetchRemote(r: RemoteFile) {
    setBusy(true)
    try {
      await downloadRemote(r)
    } finally {
      setBusy(false)
    }
  }

  async function deleteRemote(r: RemoteFile) {
    if (!window.confirm(`Delete "${r.name}" from the cloud?`)) return
    await removeRemote(r.path)
    await refreshRemote()
  }

  return (
    <div>
      <PageHeader
        emoji="📁"
        title="Local Transfer"
        subtitle="Files are stored on this device and available offline."
      />

      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setDragActive(true)
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={onDrop}
        className={`mb-6 flex cursor-pointer flex-col items-center gap-1 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
          dragActive
            ? 'border-indigo-400 bg-indigo-500/10'
            : 'border-slate-700 hover:border-slate-500'
        }`}
      >
        <span className="text-3xl">⬆️</span>
        <p className="font-medium">Tap to add files</p>
        <p className="text-sm text-slate-500">or drag &amp; drop here</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          hidden
          onChange={(e) => {
            if (e.target.files) void addFiles(e.target.files)
            e.target.value = ''
          }}
        />
      </div>

      <SyncCard />

      {files === undefined ? null : files.length === 0 && cloudOnly.length === 0 ? (
        <EmptyState
          emoji="🗂️"
          title="Nothing stored yet"
          hint="Files you add are kept in the browser and survive restarts, even offline."
        />
      ) : (
        <div className="space-y-6">
          {files.length > 0 && (
            <section>
              <p className="mb-3 text-sm text-slate-400">
                On this device: {files.length} file{files.length === 1 ? '' : 's'} ·{' '}
                {formatBytes(totalBytes)}
              </p>
              <ul className="space-y-3">
                {files.map((f) => (
                  <li key={f.id}>
                    <Card>
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate font-medium">{f.name}</p>
                          <p className="mt-0.5 text-xs text-slate-500">
                            {formatBytes(f.size)} · {formatDate(f.createdAt)}
                            {f.synced === 1
                              ? ' · ☁️ in cloud'
                              : session
                                ? ' · ⏳ upload pending'
                                : ''}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Button variant="ghost" onClick={() => download(f)}>
                          Download
                        </Button>
                        <Button variant="ghost" onClick={() => void share(f)}>
                          Share
                        </Button>
                        {f.synced === 1 && (
                          <Button variant="ghost" disabled={busy} onClick={() => void copyLink(f)}>
                            🔗 Link
                          </Button>
                        )}
                        <Button variant="danger" onClick={() => void remove(f)}>
                          Delete
                        </Button>
                      </div>
                    </Card>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {cloudOnly.length > 0 && (
            <section>
              <p className="mb-3 text-sm text-slate-400">
                ☁️ In the cloud (not on this device): {cloudOnly.length}
              </p>
              <ul className="space-y-3">
                {cloudOnly.map((r) => (
                  <li key={r.path}>
                    <Card>
                      <p className="truncate font-medium">{r.name}</p>
                      {r.size !== null && (
                        <p className="mt-0.5 text-xs text-slate-500">{formatBytes(r.size)}</p>
                      )}
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Button variant="ghost" disabled={busy || !online} onClick={() => void fetchRemote(r)}>
                          ⬇️ Get on this device
                        </Button>
                        <Button variant="danger" disabled={busy} onClick={() => void deleteRemote(r)}>
                          Delete
                        </Button>
                      </div>
                    </Card>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </div>
  )
}
