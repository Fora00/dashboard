import { useState, type FormEvent } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, type BookIdea as BookIdeaRow } from '../../lib/db'
import { addBookIdea, deleteBookIdea, sync, updateNotes } from '../../lib/bookIdeasSync'
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

export function BookIdeas() {
  const session = useAuth()
  const owner = useOwner()
  const isGuestViewer = Boolean(session) && owner === false
  const [text, setText] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const ideas = useLiveQuery(() => db.bookIdeas.orderBy('createdAt').reverse().toArray())
  const { pending, trigger, confirmUndo } = useUndoSnackbar()

  async function addIdea(e: FormEvent) {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    await addBookIdea(trimmed)
    setText('')
  }

  function toggleExpand(id: string) {
    setExpandedId((current) => (current === id ? null : id))
  }

  async function saveNotes(idea: BookIdeaRow, notes: string) {
    if (notes === idea.notes) return
    await updateNotes(idea, notes)
  }

  // Delete executes immediately (same call as always); the snapshot lets
  // Undo re-insert the exact same row via a normal engine upsert.
  async function remove(idea: BookIdeaRow) {
    if (expandedId === idea.id) setExpandedId(null)
    await deleteBookIdea(idea.id)
    trigger(`Deleted "${idea.text}" · Undo`, () => sync.upsert('book_ideas', idea))
  }

  const renderIdea = (idea: BookIdeaRow) => {
    const expanded = expandedId === idea.id
    const preview = idea.notes.replace(/\s+/g, ' ').trim()
    return (
      <li key={idea.id}>
        <SwipeableRow onSwipeLeft={() => void remove(idea)}>
          <div className="flex items-stretch gap-2">
            <button
              type="button"
              onClick={() => toggleExpand(idea.id)}
              className="flex min-h-12 w-full min-w-0 flex-1 flex-col items-start justify-center gap-0.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-left transition-colors hover:border-slate-400 active:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/50 dark:hover:border-slate-600 dark:active:bg-slate-800"
            >
              <span className="w-full min-w-0 truncate">{idea.text}</span>
              {preview && !expanded && (
                <span className="w-full min-w-0 truncate text-xs text-slate-500 dark:text-slate-400">
                  {preview}
                </span>
              )}
            </button>
            <Button
              variant="danger"
              onClick={() => void remove(idea)}
              aria-label={`Delete ${idea.text}`}
              className="min-w-10"
            >
              ✕
            </Button>
          </div>
        </SwipeableRow>
        {expanded && (
          <textarea
            key={idea.id}
            defaultValue={idea.notes}
            onBlur={(e) => void saveNotes(idea, e.target.value)}
            placeholder="Notes…"
            rows={4}
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
          />
        )}
      </li>
    )
  }

  return (
    <div>
      <PageHeader
        emoji="📖"
        title="Book Ideas"
        subtitle="Writing ideas — tap one to jot notes. Saved on this device."
      />

      <SyncCard sync={sync} />

      <form onSubmit={addIdea} className="mb-6 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a book idea…"
          autoComplete="off"
          enterKeyHint="done"
          className="min-h-10 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
        />
        <Button type="submit" disabled={!text.trim()}>
          Add
        </Button>
      </form>

      {ideas === undefined ? (
        <SkeletonList rows={4} rowClassName="h-12" />
      ) : ideas.length === 0 ? (
        <EmptyState
          emoji="🌤️"
          title="No book ideas yet"
          hint={
            isGuestViewer
              ? 'Nothing shared with you yet — ask Francesco to invite you from the Sharing page.'
              : 'Ideas you add are saved on this device and work offline.'
          }
        />
      ) : (
        <ul className="space-y-2">{ideas.map(renderIdea)}</ul>
      )}

      {pending && <Snackbar label={pending.label} onUndo={confirmUndo} />}
    </div>
  )
}
