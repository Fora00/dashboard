import { useState } from 'react'
import { type TripCompanion, type TripIdea } from '../../lib/db'
import { ideaKind, MAX_NOTES_LENGTH, MAX_TITLE_LENGTH, updateIdea } from '../../lib/tripsSync'
import { Button } from '../../components/Button'
import { PeoplePicker } from './PeoplePicker'

// People shown inline on a collapsed row before they collapse into "+N".
const ROW_PEOPLE_LIMIT = 3

export function Badge({ idea, byId }: { idea: TripIdea; byId: Map<string, TripCompanion> }) {
  const base =
    'shrink-0 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600 dark:bg-slate-700/60 dark:text-slate-300'
  if (ideaKind(idea) === 'solo') return <span className={base}>Solo</span>
  const people = (idea.companionIds ?? []).map((id) => byId.get(id)).filter((c): c is TripCompanion => c !== undefined)
  if (people.length === 0) return <span className={base}>With others</span>
  const shown = people.slice(0, ROW_PEOPLE_LIMIT)
  const extra = people.length - shown.length
  return (
    <span className={`${base} max-w-full truncate`}>
      {shown.map((c) => `${c.emoji} ${c.name}`).join(' · ')}
      {extra > 0 ? ` +${extra}` : ''}
    </span>
  )
}

/** Expanded panel for one idea. Own component so the solo/group mode is local state. */
export function IdeaEditor({
  idea,
  companions,
  onDelete,
}: {
  idea: TripIdea
  companions: TripCompanion[]
  onDelete: () => void
}) {
  const [mode, setMode] = useState<'solo' | 'group'>(ideaKind(idea))
  const ids = idea.companionIds ?? []

  async function saveTitle(input: HTMLInputElement) {
    const trimmed = input.value.trim()
    if (!trimmed) {
      input.value = idea.title
      return
    }
    if (trimmed === idea.title) return
    await updateIdea(idea, { title: trimmed })
  }

  async function saveNotes(notes: string) {
    if (notes === idea.notes) return
    await updateIdea(idea, { notes })
  }

  function changeMode(next: 'solo' | 'group') {
    setMode(next)
    // Switching to Solo clears the people right away.
    if (next === 'solo' && ids.length > 0) void updateIdea(idea, { companionIds: [] })
  }

  return (
    <div className="mt-2 space-y-2">
      <input
        key={`title-${idea.id}`}
        defaultValue={idea.title}
        onBlur={(e) => void saveTitle(e.target)}
        maxLength={MAX_TITLE_LENGTH}
        aria-label={`Title of ${idea.title}`}
        placeholder="Title…"
        className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-300 dark:border-slate-700 dark:bg-slate-800"
      />
      <textarea
        key={`notes-${idea.id}`}
        defaultValue={idea.notes}
        onBlur={(e) => void saveNotes(e.target.value)}
        aria-label={`Notes for ${idea.title}`}
        placeholder="Notes…"
        rows={3}
        maxLength={MAX_NOTES_LENGTH}
        className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-300 dark:border-slate-700 dark:bg-slate-800"
      />
      <PeoplePicker
        idPrefix={`edit-${idea.id}`}
        mode={mode}
        onModeChange={changeMode}
        companions={companions}
        selected={ids}
        onSelectedChange={(next) => void updateIdea(idea, { companionIds: next })}
      />
      {mode === 'group' && ids.length === 0 && (
        <p className="text-xs text-amber-700 dark:text-amber-400">
          Pick at least one person, otherwise this stays Solo.
        </p>
      )}
      <Button variant="danger" onClick={onDelete} aria-label={`Delete ${idea.title}`}>
        ✕ Delete
      </Button>
    </div>
  )
}
