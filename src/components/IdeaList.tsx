import { useState, type FormEvent } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import type { OutboxTable } from '../lib/db'
import type { CloudSync } from '../lib/cloudSync'
import { useAuth } from '../lib/useAuth'
import { useOwner } from '../lib/useOwner'
import { useUndoSnackbar } from '../lib/useUndoSnackbar'
import { FOCUS_RING_FIELD } from './focus'
import { Button } from './Button'
import { ListRow } from './ListRow'
import { PageHeader } from './PageHeader'
import { EmptyState } from './EmptyState'
import { SyncCard } from './SyncCard'
import { Snackbar } from './Snackbar'
import { SwipeableRow } from './SwipeableRow'
import { SkeletonList } from './Skeleton'

// Shared "list of ideas with expandable notes" page (Book Ideas, Boardgame
// Ideas). A page is just an IdeaListConfig: copy, its Dexie query and its
// *Sync.ts mutations.

export interface IdeaRow {
  id: string
  text: string
  notes: string
}

export interface IdeaListConfig<T extends IdeaRow> {
  emoji: string
  title: string
  subtitle: string
  addPlaceholder: string
  /** Server caps (characters), mirrored as the inputs' maxLength. */
  maxTextLength: number
  maxNotesLength: number
  emptyTitle: string
  /** Newest first. */
  query: () => Promise<T[]>
  add: (text: string) => Promise<void>
  remove: (id: string) => Promise<void>
  updateNotes: (idea: T, notes: string) => Promise<void>
  sync: CloudSync
  /** Remote table name, used to re-insert a deleted row on Undo. */
  table: OutboxTable
}

const INPUT =
  'min-h-10 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800'

export function IdeaList<T extends IdeaRow>({ config }: { config: IdeaListConfig<T> }) {
  const session = useAuth()
  const owner = useOwner()
  const isGuestViewer = Boolean(session) && owner === false
  const [text, setText] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const ideas = useLiveQuery(config.query, [config])
  const { pending, trigger, confirmUndo } = useUndoSnackbar()

  async function addIdea(e: FormEvent) {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    await config.add(trimmed)
    setText('')
  }

  function toggleExpand(id: string) {
    setExpandedId((current) => (current === id ? null : id))
  }

  async function saveNotes(idea: T, notes: string) {
    if (notes === idea.notes) return
    await config.updateNotes(idea, notes)
  }

  // Delete executes immediately (same call as always); the snapshot lets
  // Undo re-insert the exact same row via a normal engine upsert.
  async function remove(idea: T) {
    if (expandedId === idea.id) setExpandedId(null)
    await config.remove(idea.id)
    trigger(`Deleted "${idea.text}" · Undo`, () => config.sync.upsert(config.table, idea as never))
  }

  const renderIdea = (idea: T) => {
    const expanded = expandedId === idea.id
    const preview = idea.notes.replace(/\s+/g, ' ').trim()
    return (
      <li key={idea.id}>
        <SwipeableRow onSwipeLeft={() => void remove(idea)}>
          <div className="flex items-stretch gap-2">
            <ListRow
              onClick={() => toggleExpand(idea.id)}
              aria-expanded={expanded}
              className="flex min-h-12 w-full min-w-0 flex-1 flex-col items-start justify-center gap-0.5 px-4 py-2 text-left"
            >
              <span className="w-full min-w-0 truncate">{idea.text}</span>
              {preview && !expanded && (
                <span className="w-full min-w-0 truncate text-xs text-slate-500 dark:text-slate-400">{preview}</span>
              )}
            </ListRow>
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
            aria-label={`Notes for ${idea.text}`}
            rows={4}
            maxLength={config.maxNotesLength}
            className={`mt-2 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800 ${FOCUS_RING_FIELD}`}
          />
        )}
      </li>
    )
  }

  return (
    <div>
      <PageHeader emoji={config.emoji} title={config.title} subtitle={config.subtitle} />

      <SyncCard sync={config.sync} />

      <form onSubmit={addIdea} className="mb-6 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={config.addPlaceholder}
          aria-label={config.addPlaceholder.replace(/…$/, '')}
          maxLength={config.maxTextLength}
          autoComplete="off"
          enterKeyHint="done"
          className={`${INPUT} ${FOCUS_RING_FIELD}`}
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
          title={config.emptyTitle}
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
