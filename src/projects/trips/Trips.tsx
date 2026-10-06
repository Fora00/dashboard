import { useState, type FormEvent } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, type TripCompanion, type TripIdea } from '../../lib/db'
import {
  addIdea,
  deleteCompanion,
  deleteIdea,
  ideaKind,
  MAX_NOTES_LENGTH,
  MAX_TITLE_LENGTH,
  restoreCompanion,
  sync,
  toggleDone,
  updateIdea,
} from '../../lib/tripsSync'
import { useAuth } from '../../lib/useAuth'
import { useOwner } from '../../lib/useOwner'
import { useUndoSnackbar } from '../../lib/useUndoSnackbar'
import { Button } from '../../components/Button'
import { Chip } from '../../components/Chip'
import { FOCUS_RING_INSET } from '../../components/focus'
import { ListRow } from '../../components/ListRow'
import { PageHeader } from '../../components/PageHeader'
import { EmptyState } from '../../components/EmptyState'
import { SyncCard } from '../../components/SyncCard'
import { Snackbar } from '../../components/Snackbar'
import { SwipeableRow } from '../../components/SwipeableRow'
import { SkeletonList } from '../../components/Skeleton'
import { PeoplePicker } from './PeoplePicker'
import { PeopleSheet } from './PeopleSheet'

// People shown inline on a collapsed row before they collapse into "+N".
const ROW_PEOPLE_LIMIT = 3

type Filter = 'all' | 'solo' | 'group'

const FILTER_LABELS: [Filter, string][] = [
  ['all', 'All'],
  ['solo', 'Solo'],
  ['group', 'With others'],
]

function Badge({ idea, byId }: { idea: TripIdea; byId: Map<string, TripCompanion> }) {
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
function IdeaEditor({
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

export function Trips() {
  const session = useAuth()
  const owner = useOwner()
  const isGuestViewer = Boolean(session) && owner === false
  const [title, setTitle] = useState('')
  const [addMode, setAddMode] = useState<'solo' | 'group'>('solo')
  const [addIds, setAddIds] = useState<string[]>([])
  const [expandedId, setExpandedId] = useState<string | null>(null)
  // Filter state is deliberately component state — never persisted.
  const [filter, setFilter] = useState<Filter>('all')
  const [selectedPeople, setSelectedPeople] = useState<string[]>([])
  const [peopleOpen, setPeopleOpen] = useState(false)
  const raw = useLiveQuery(() => db.tripIdeas.orderBy('createdAt').reverse().toArray())
  const companionsRaw = useLiveQuery(() => db.tripCompanions.orderBy('createdAt').toArray())
  const { pending, trigger, confirmUndo } = useUndoSnackbar()

  // Not-done first; the stable sort keeps the newest-first order of the query.
  const ideas = raw ? [...raw].sort((a, b) => a.done - b.done) : raw
  const companions = companionsRaw ?? []
  const byId = new Map(companions.map((c) => [c.id, c]))

  const counts = new Map<string, number>()
  for (const idea of ideas ?? []) {
    for (const id of idea.companionIds ?? []) counts.set(id, (counts.get(id) ?? 0) + 1)
  }

  // A group idea needs at least one person; Solo stores [].
  const canAdd = title.trim() !== '' && (addMode === 'solo' || addIds.length > 0)

  const visible = ideas?.filter((i) => {
    if (filter === 'solo') return ideaKind(i) === 'solo'
    if (filter === 'group') {
      return ideaKind(i) === 'group' && selectedPeople.every((p) => (i.companionIds ?? []).includes(p))
    }
    return true
  })
  const peopleFiltering = filter === 'group' && selectedPeople.length > 0

  function changeFilter(next: Filter) {
    setFilter(next)
    setSelectedPeople([])
  }

  function togglePerson(id: string) {
    setSelectedPeople((cur) => (cur.includes(id) ? cur.filter((p) => p !== id) : [...cur, id]))
  }

  async function handleAdd(e: FormEvent) {
    e.preventDefault()
    if (!canAdd) return
    await addIdea(title, addMode === 'solo' ? [] : addIds)
    setTitle('')
    setAddIds([])
    // Keep addMode: adding several trips in a row usually means the same kind.
  }

  async function remove(idea: TripIdea) {
    if (expandedId === idea.id) setExpandedId(null)
    await deleteIdea(idea.id)
    trigger(`Deleted "${idea.title}" · Undo`, () => sync.upsert('trip_ideas', idea))
  }

  async function removePerson(c: TripCompanion) {
    const snapshot = await deleteCompanion(c.id)
    if (!snapshot) return
    setSelectedPeople((cur) => cur.filter((p) => p !== c.id))
    setAddIds((cur) => cur.filter((p) => p !== c.id))
    setPeopleOpen(false)
    const n = snapshot.ideas.length
    trigger(`Deleted ${c.name}${n > 0 ? ` from ${n} ${n === 1 ? 'trip' : 'trips'}` : ''} · Undo`, () =>
      restoreCompanion(snapshot),
    )
  }

  const renderIdea = (idea: TripIdea) => {
    const expanded = expandedId === idea.id
    const done = idea.done === 1
    return (
      <li key={idea.id}>
        <SwipeableRow onSwipeRight={() => void toggleDone(idea)} onSwipeLeft={() => void remove(idea)}>
          <div className="flex items-stretch gap-2">
            <ListRow
              onClick={() => void toggleDone(idea)}
              aria-label={done ? 'Mark as not been there' : 'Mark as been there'}
              className="flex min-h-12 w-10 shrink-0 items-center justify-center text-lg"
            >
              {done ? '●' : '○'}
            </ListRow>
            <ListRow
              onClick={() => setExpandedId((cur) => (cur === idea.id ? null : idea.id))}
              aria-expanded={expanded}
              className="flex min-h-12 w-full min-w-0 flex-1 flex-col items-start justify-center gap-0.5 px-4 py-2 text-left"
            >
              <span className={`w-full min-w-0 truncate ${done ? 'text-slate-500 line-through' : ''}`}>
                {idea.title}
              </span>
              <span className="flex w-full min-w-0 text-xs text-slate-500 dark:text-slate-400">
                <Badge idea={idea} byId={byId} />
              </span>
            </ListRow>
          </div>
        </SwipeableRow>
        {expanded && <IdeaEditor idea={idea} companions={companions} onDelete={() => void remove(idea)} />}
      </li>
    )
  }

  return (
    <div>
      <PageHeader emoji="✈️" title="Trips" subtitle="Travel ideas, solo or with friends. Saved on this device." />

      <SyncCard sync={sync} />

      <form onSubmit={handleAdd} className="mb-6 space-y-2">
        <div className="flex gap-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            autoComplete="off"
            enterKeyHint="done"
            maxLength={MAX_TITLE_LENGTH}
            aria-label="Trip destination"
            placeholder="Where to?"
            className="min-h-10 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-300 dark:border-slate-700 dark:bg-slate-800"
          />
          <Button type="submit" disabled={!canAdd}>
            Add
          </Button>
        </div>
        <PeoplePicker
          idPrefix="add"
          mode={addMode}
          onModeChange={setAddMode}
          companions={companions}
          selected={addIds}
          onSelectedChange={setAddIds}
        />
        {addMode === 'group' && addIds.length === 0 && (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Pick at least one person to add a trip with others.
          </p>
        )}
      </form>

      {/* Filter bar: All · Solo · With others, then the people chips (AND)
          while With others is active. Clear sits first so it can't scroll out
          of reach on a phone. */}
      <div className="-mx-4 mb-4 overflow-x-auto px-4 pb-1">
        <div className="flex w-max items-center gap-2">
          {peopleFiltering && (
            <Chip toggle={false} active={false} onClick={() => setSelectedPeople([])}>
              ✕ Clear
            </Chip>
          )}
          {FILTER_LABELS.map(([key, label]) => (
            <Chip key={key} active={filter === key} onClick={() => changeFilter(key)}>
              {label}
            </Chip>
          ))}
          {filter === 'group' &&
            companions.map((c) => (
              <Chip
                key={c.id}
                active={selectedPeople.includes(c.id)}
                onClick={() => togglePerson(c.id)}
                className="max-w-48 truncate"
              >
                {c.emoji} {c.name}
              </Chip>
            ))}
          <button
            type="button"
            onClick={() => setPeopleOpen(true)}
            className={`min-h-10 shrink-0 rounded-full px-3 text-xs whitespace-nowrap text-slate-500 underline-offset-2 hover:underline dark:text-slate-400 ${FOCUS_RING_INSET}`}
          >
            People
          </button>
        </div>
      </div>

      <PeopleSheet
        open={peopleOpen}
        onClose={() => setPeopleOpen(false)}
        companions={companions}
        counts={counts}
        onDelete={removePerson}
      />

      {ideas === undefined || visible === undefined ? (
        <SkeletonList rows={4} rowClassName="h-12" />
      ) : ideas.length === 0 ? (
        <EmptyState
          emoji="✈️"
          title="No trips yet"
          hint={
            isGuestViewer
              ? 'Nothing shared with you yet — ask Francesco to invite you from the Sharing page.'
              : 'Trip ideas you save are kept on this device and work offline.'
          }
        />
      ) : visible.length === 0 ? (
        <div className="space-y-3">
          <EmptyState
            emoji="🧳"
            title="No trips match"
            hint={
              peopleFiltering
                ? `Nothing includes ${selectedPeople.map((p) => byId.get(p)?.name ?? '?').join(' + ')}.`
                : 'Nothing in this view yet.'
            }
          />
          <div className="flex justify-center">
            <Button variant="ghost" onClick={() => changeFilter('all')}>
              ✕ Clear filters
            </Button>
          </div>
        </div>
      ) : (
        <ul className="space-y-2">{visible.map(renderIdea)}</ul>
      )}

      {pending && <Snackbar label={pending.label} onUndo={confirmUndo} />}
    </div>
  )
}
