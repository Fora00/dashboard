import { useRef, useState, type DragEvent } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, requestPersistentStorage, type TransferFile } from '../../lib/db'
import { formatBytes, formatDate } from '../../lib/format'
import { useOnline } from '../../lib/useOnline'
import { syncEnabled } from '../../lib/sync'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { PageHeader } from '../../components/PageHeader'
import { EmptyState } from '../../components/EmptyState'

export function LocalTransfer() {
  const online = useOnline()
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)

  const files = useLiveQuery(() => db.files.orderBy('createdAt').reverse().toArray())
  const totalBytes = files?.reduce((sum, f) => sum + f.size, 0) ?? 0

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
  }

  function onDrop(e: DragEvent) {
    e.preventDefault()
    setDragActive(false)
    addFiles(e.dataTransfer.files)
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

  async function remove(f: TransferFile) {
    if (window.confirm(`Delete "${f.name}"? It only exists on this device.`)) {
      await db.files.delete(f.id)
    }
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
            if (e.target.files) addFiles(e.target.files)
            e.target.value = ''
          }}
        />
      </div>

      {!syncEnabled && (
        <Card className="mb-6 text-sm text-slate-400">
          ☁️ Cloud sync is not configured yet — files stay on this device. When
          online{online ? ' (you are now)' : ''}, you can still send a file to
          other apps or nearby devices with <b>Share</b>. See ROADMAP.md to
          enable sync.
        </Card>
      )}

      {files === undefined ? null : files.length === 0 ? (
        <EmptyState
          emoji="🗂️"
          title="Nothing stored yet"
          hint="Files you add are kept in the browser and survive restarts, even offline."
        />
      ) : (
        <>
          <p className="mb-3 text-sm text-slate-400">
            {files.length} file{files.length === 1 ? '' : 's'} · {formatBytes(totalBytes)}
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
                        {f.synced === 1 ? ' · synced ☁️' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button variant="ghost" onClick={() => download(f)}>
                      Download
                    </Button>
                    <Button variant="ghost" onClick={() => share(f)}>
                      Share
                    </Button>
                    <Button variant="danger" onClick={() => remove(f)}>
                      Delete
                    </Button>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
