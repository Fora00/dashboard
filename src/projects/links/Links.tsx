import { useState, type FormEvent } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, type LinkItem } from '../../lib/db'
import { addLink, deleteLink, normalizeUrl, sync, toggleRead, updateLink } from '../../lib/linksSync'
import { useAuth } from '../../lib/useAuth'
import { useOwner } from '../../lib/useOwner'
import { useUndoSnackbar } from '../../lib/useUndoSnackbar'
import { Button } from '../../components/Button'
import { PageHeader } from '../../components/PageHeader'
import { EmptyState } from '../../components/EmptyState'
import { SyncCard } from '../../components/SyncCard'
import { Snackbar } from '../../components/Snackbar'
import { SwipeableRow } from '../../components/SwipeableRow'
import { SkeletonList } from '../../components/Skeleton'

function hostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

export function Links() {
  const session = useAuth()
  const owner = useOwner()
  const isGuestViewer = Boolean(session) && owner === false
  const [text, setText] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const raw = useLiveQuery(() => db.links.orderBy('createdAt').reverse().toArray())
  // Unread first, then newest-first within each group — a stable sort keeps
  // the createdAt-desc order the query already produced.
  const links = raw ? [...raw].sort((a, b) => a.read - b.read) : raw
  const { pending, trigger, confirmUndo } = useUndoSnackbar()

  const canAdd = normalizeUrl(text) !== null

  async function handleAdd(e: FormEvent) {
    e.preventDefault()
    if (!canAdd) return
    await addLink(text)
    setText('')
  }

  function toggleExpand(id: string) {
    setExpandedId((current) => (current === id ? null : id))
  }

  async function toggle(link: LinkItem) {
    await toggleRead(link)
  }

  // A blanked title would leave the row with nothing to tap, so restore the
  // saved one in the field rather than writing an empty string.
  async function saveTitle(link: LinkItem, input: HTMLInputElement) {
    const trimmed = input.value.trim()
    if (!trimmed) {
      input.value = link.title
      return
    }
    if (trimmed === link.title) return
    await updateLink(link, { title: trimmed })
  }

  async function saveNotes(link: LinkItem, notes: string) {
    if (notes === link.notes) return
    await updateLink(link, { notes })
  }

  // Clipboard access is unavailable in insecure contexts and can be denied
  // outright, so a failure must not surface as an unhandled rejection.
  async function copyLink(link: LinkItem) {
    if (!navigator.clipboard) return
    try {
      await navigator.clipboard.writeText(link.url)
    } catch {
      return
    }
    setCopiedId(link.id)
    setTimeout(() => setCopiedId((current) => (current === link.id ? null : current)), 1500)
  }

  // Delete executes immediately (same call as always); the snapshot lets
  // Undo re-insert the exact same row via a normal engine upsert.
  async function remove(link: LinkItem) {
    if (expandedId === link.id) setExpandedId(null)
    await deleteLink(link.id)
    trigger(`Deleted "${link.title}" · Undo`, () => sync.upsert('links', link))
  }

  const renderLink = (link: LinkItem) => {
    const expanded = expandedId === link.id
    const read = link.read === 1
    return (
      <li key={link.id}>
        <SwipeableRow onSwipeRight={() => void toggle(link)} onSwipeLeft={() => void remove(link)}>
          <div className="flex items-stretch gap-2">
            <button
              type="button"
              onClick={() => void toggle(link)}
              aria-label={read ? 'Mark as unread' : 'Mark as read'}
              className="flex min-h-12 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-lg transition-colors hover:border-slate-400 active:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/50 dark:hover:border-slate-600 dark:active:bg-slate-800"
            >
              {read ? '●' : '○'}
            </button>
            <button
              type="button"
              onClick={() => toggleExpand(link.id)}
              className="flex min-h-12 w-full min-w-0 flex-1 flex-col items-start justify-center gap-0.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-left transition-colors hover:border-slate-400 active:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/50 dark:hover:border-slate-600 dark:active:bg-slate-800"
            >
              <span className={`w-full min-w-0 truncate ${read ? 'text-slate-500 line-through' : ''}`}>
                {link.title}
              </span>
              <span className="w-full min-w-0 truncate text-xs text-slate-500 dark:text-slate-400">
                {hostname(link.url)}
              </span>
            </button>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${link.title}`}
              className="flex min-h-12 min-w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white px-2 text-lg transition-colors hover:border-slate-400 active:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/50 dark:hover:border-slate-600 dark:active:bg-slate-800"
            >
              ↗
            </a>
          </div>
        </SwipeableRow>
        {expanded && (
          <div className="mt-2 space-y-2">
            <input
              key={`title-${link.id}`}
              defaultValue={link.title}
              onBlur={(e) => void saveTitle(link, e.target)}
              maxLength={300}
              placeholder="Title…"
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
            />
            <textarea
              key={`notes-${link.id}`}
              defaultValue={link.notes}
              onBlur={(e) => void saveNotes(link, e.target.value)}
              placeholder="Notes…"
              rows={3}
              maxLength={2000}
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
            />
            {/* Swipe-left deletes too, but that's invisible on a desktop and
                unreachable by keyboard — so the row's delete lives here. */}
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => void copyLink(link)}>
                {copiedId === link.id ? 'Copied ✓' : '🔗 Copy'}
              </Button>
              <Button
                variant="danger"
                onClick={() => void remove(link)}
                aria-label={`Delete ${link.title}`}
              >
                ✕ Delete
              </Button>
            </div>
          </div>
        )}
      </li>
    )
  }

  return (
    <div>
      <PageHeader emoji="🔗" title="Links" subtitle="Save links to read later. Saved on this device." />

      <SyncCard sync={sync} />

      <form onSubmit={handleAdd} className="mb-6 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          type="text"
          inputMode="url"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          enterKeyHint="done"
          maxLength={2000}
          placeholder="Paste a URL…"
          className="min-h-10 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
        />
        <Button type="submit" disabled={!canAdd}>
          Add
        </Button>
      </form>

      {links === undefined ? (
        <SkeletonList rows={4} rowClassName="h-12" />
      ) : links.length === 0 ? (
        <EmptyState
          emoji="🔗"
          title="No links yet"
          hint={
            isGuestViewer
              ? 'Nothing shared with you yet — ask Francesco to invite you from the Sharing page.'
              : 'Links you save are kept on this device and work offline.'
          }
        />
      ) : (
        <ul className="space-y-2">{links.map(renderLink)}</ul>
      )}

      {pending && <Snackbar label={pending.label} onUndo={confirmUndo} />}
    </div>
  )
}
