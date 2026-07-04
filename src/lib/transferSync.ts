import { db, type TransferFile } from './db'
import { supabase } from './sync'

// Cloud layer for local-transfer, on top of the same local-first idea as the
// shop list: files always live in IndexedDB; while signed in they also upload
// to the private Supabase Storage bucket "transfer", so other devices (and
// invited guests, via project_members) can fetch them or get a signed link.
//
// Object paths are flat: "<uuid>_<filename>" — the uuid prefix (36 chars)
// keeps names collision-free and lets us map objects back to local ids.

const BUCKET = 'transfer'

const pathFor = (f: { id: string; name: string }) => `${f.id}_${f.name}`

export interface RemoteFile {
  id: string
  name: string
  path: string
  size: number | null
}

function parsePath(objectName: string): { id: string; name: string } | null {
  if (objectName.length < 38 || objectName[36] !== '_') return null
  return { id: objectName.slice(0, 36), name: objectName.slice(37) }
}

let uploading = false

/** Upload every local file that isn't in the cloud yet. Safe to call often. */
export async function uploadPending(): Promise<void> {
  if (!supabase || uploading) return
  const { data } = await supabase.auth.getSession()
  if (!data.session) return
  uploading = true
  try {
    const pending = await db.files.where('synced').equals(0).toArray()
    for (const f of pending) {
      const path = pathFor(f)
      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(path, f.blob, { contentType: f.type, upsert: true })
      if (error) break // offline or no access — retry on next call
      await db.files.update(f.id, { synced: 1 as const, remoteUrl: path })
    }
  } finally {
    uploading = false
  }
}

/** Files in the cloud, e.g. uploaded from another device. */
export async function listRemote(): Promise<RemoteFile[] | null> {
  if (!supabase) return null
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .list('', { limit: 200, sortBy: { column: 'created_at', order: 'desc' } })
  if (error || !data) return null
  const out: RemoteFile[] = []
  for (const obj of data) {
    const parsed = parsePath(obj.name)
    if (!parsed) continue
    out.push({
      ...parsed,
      path: obj.name,
      size: (obj.metadata as { size?: number } | null)?.size ?? null,
    })
  }
  return out
}

/** Download a cloud file into the local stash. */
export async function downloadRemote(r: RemoteFile): Promise<void> {
  if (!supabase) return
  const { data, error } = await supabase.storage.from(BUCKET).download(r.path)
  if (error || !data) throw error ?? new Error('Download failed')
  await db.files.put({
    id: r.id,
    name: r.name,
    type: data.type || 'application/octet-stream',
    size: data.size,
    blob: data,
    createdAt: Date.now(),
    synced: 1,
    remoteUrl: r.path,
  })
}

/** A share link anyone can download for 7 days (no sign-in needed). */
export async function signedLink(f: TransferFile): Promise<string> {
  if (!supabase || f.synced !== 1 || !f.remoteUrl) throw new Error('Not uploaded yet')
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(f.remoteUrl, 60 * 60 * 24 * 7)
  if (error || !data) throw error ?? new Error('Could not create link')
  return data.signedUrl
}

export async function removeRemote(path: string): Promise<void> {
  if (!supabase) return
  await supabase.storage.from(BUCKET).remove([path])
}

const onOnline = () => void uploadPending()

/** Start auto-upload (call when a session exists). Returns a stop function. */
export function startTransferSync(): () => void {
  if (!supabase) return () => {}
  void uploadPending()
  window.addEventListener('online', onOnline)
  return () => window.removeEventListener('online', onOnline)
}
