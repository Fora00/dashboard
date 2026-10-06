import { useState, type FormEvent } from 'react'
import { normalizeTag } from '../../lib/linksSync'
import { Button } from '../../components/Button'
import { Sheet } from '../../components/Sheet'

const MAX_TAG_LENGTH = 30

interface Props {
  open: boolean
  onClose: () => void
  /** Every tag in use with its link count, already sorted. */
  tags: [string, number][]
  /** Shared <datalist> id so typing suggests existing tags (merge target). */
  optionsId: string
  onRename: (from: string, to: string) => void | Promise<void>
}

/** Rename / merge sheet: tap a tag, type the new name, Save. */
export function ManageTagsSheet({ open, onClose, tags, optionsId, onRename }: Props) {
  const [editing, setEditing] = useState<string | null>(null)
  const [value, setValue] = useState('')

  const counts = new Map(tags)
  const target = normalizeTag(value)
  const merges = editing !== null && target !== null && target !== editing && counts.has(target)
  const canSave = editing !== null && target !== null && target !== editing

  function close() {
    setEditing(null)
    setValue('')
    onClose()
  }

  function startEdit(tag: string) {
    if (editing === tag) {
      setEditing(null)
      return
    }
    setEditing(tag)
    setValue(tag)
  }

  async function save(e: FormEvent) {
    e.preventDefault()
    if (!canSave || editing === null || target === null) return
    const from = editing
    setEditing(null)
    setValue('')
    onClose()
    await onRename(from, target)
  }

  return (
    <Sheet open={open} onClose={close} title="Manage tags">
      {tags.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">No tags yet.</p>
      ) : (
        <ul className="space-y-1">
          {tags.map(([tag, count]) => (
            <li key={tag}>
              <button
                type="button"
                onClick={() => startEdit(tag)}
                aria-expanded={editing === tag}
                className="flex min-h-10 w-full items-center justify-between gap-3 rounded-lg px-3 text-left text-sm transition-colors hover:bg-slate-100 active:bg-slate-200 dark:hover:bg-slate-800 dark:active:bg-slate-700"
              >
                <span className="min-w-0 truncate">{tag}</span>
                <span className="shrink-0 text-xs text-slate-500 dark:text-slate-400">
                  {count} {count === 1 ? 'link' : 'links'}
                </span>
              </button>
              {editing === tag && (
                <form onSubmit={save} className="space-y-1 px-1 pt-1 pb-2">
                  <div className="flex gap-2">
                    <input
                      autoFocus
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      list={optionsId}
                      maxLength={MAX_TAG_LENGTH}
                      autoComplete="off"
                      autoCapitalize="off"
                      spellCheck={false}
                      enterKeyHint="done"
                      aria-label={`New name for ${tag}`}
                      className="min-h-10 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-300 dark:border-slate-700 dark:bg-slate-800"
                    />
                    <Button type="submit" disabled={!canSave}>
                      Save
                    </Button>
                  </div>
                  {merges && (
                    <p className="text-xs text-amber-700 dark:text-amber-400">“{target}” already exists: will merge</p>
                  )}
                </form>
              )}
            </li>
          ))}
        </ul>
      )}
    </Sheet>
  )
}
