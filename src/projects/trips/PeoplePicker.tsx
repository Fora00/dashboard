import { useState } from 'react'
import type { TripCompanion } from '../../lib/db'
import { addCompanion, MAX_COMPANIONS_PER_IDEA, MAX_NAME_LENGTH } from '../../lib/tripsSync'
import { Button } from '../../components/Button'
import { Chip } from '../../components/Chip'
import { FOCUS_RING_INSET } from '../../components/focus'

interface Props {
  /** 'solo' hides the people chips; 'group' shows them. */
  mode: 'solo' | 'group'
  onModeChange: (mode: 'solo' | 'group') => void
  companions: TripCompanion[]
  selected: string[]
  onSelectedChange: (ids: string[]) => void
  /** Used to make aria labels and ids unique when several pickers coexist. */
  idPrefix: string
}

const SEGMENT = `min-h-10 flex-1 border-2 px-3 text-sm font-medium transition-colors first:rounded-l-lg last:rounded-r-lg ${FOCUS_RING_INSET}`
const SEGMENT_ON = 'border-(color:--accent-border) bg-(color:--accent-selected) text-(color:--accent-fg)'
const SEGMENT_OFF =
  'border-slate-200 bg-white text-slate-600 hover:bg-slate-100 active:bg-slate-200 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-800'

/** Solo | With others segmented control plus the multi-select people chips. Shared by the add form and the expanded row. */
export function PeoplePicker({ mode, onModeChange, companions, selected, onSelectedChange, idPrefix }: Props) {
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const full = selected.length >= MAX_COMPANIONS_PER_IDEA

  function toggle(id: string) {
    if (selected.includes(id)) onSelectedChange(selected.filter((s) => s !== id))
    else if (!full) onSelectedChange([...selected, id])
  }

  async function createPerson() {
    const result = await addCompanion(name)
    if (!result.ok) {
      setError(result.reason === 'duplicate' ? 'That name already exists' : 'Enter a name')
      return
    }
    setName('')
    setError(null)
    setAdding(false)
    if (!full) onSelectedChange([...selected, result.companion.id])
  }

  return (
    <div className="space-y-2">
      <div role="group" aria-label="Trip type" className="flex">
        <button
          type="button"
          aria-pressed={mode === 'solo'}
          onClick={() => onModeChange('solo')}
          className={`${SEGMENT} ${mode === 'solo' ? SEGMENT_ON : SEGMENT_OFF}`}
        >
          {mode === 'solo' ? '✓ Solo' : 'Solo'}
        </button>
        <button
          type="button"
          aria-pressed={mode === 'group'}
          onClick={() => onModeChange('group')}
          className={`${SEGMENT} ${mode === 'group' ? SEGMENT_ON : SEGMENT_OFF}`}
        >
          {mode === 'group' ? '✓ With others' : 'With others'}
        </button>
      </div>

      {mode === 'group' && (
        <>
          <div className="flex flex-wrap items-center gap-2">
            {companions.map((c) => (
              <Chip
                key={c.id}
                active={selected.includes(c.id)}
                onClick={() => toggle(c.id)}
                className="max-w-48 truncate"
              >
                {c.emoji} {c.name}
              </Chip>
            ))}
            {!adding && (
              <button
                type="button"
                onClick={() => setAdding(true)}
                className={`min-h-10 shrink-0 rounded-full border-2 border-dashed border-slate-300 px-3.5 text-xs font-medium whitespace-nowrap text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800 ${FOCUS_RING_INSET}`}
              >
                + Person
              </button>
            )}
          </div>
          {adding && (
            <div className="space-y-1">
              <div className="flex gap-2">
                <input
                  autoFocus
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    setError(null)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      void createPerson()
                    }
                    if (e.key === 'Escape') setAdding(false)
                  }}
                  maxLength={MAX_NAME_LENGTH}
                  placeholder="Name…"
                  autoComplete="off"
                  enterKeyHint="done"
                  aria-label="New person's name"
                  id={`${idPrefix}-new-person`}
                  className="min-h-10 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm placeholder:text-slate-500 focus:border-(color:--accent-ring) focus:outline-none focus-visible:ring-2 focus-visible:ring-(color:--accent-ring) dark:border-slate-700 dark:bg-slate-800"
                />
                <Button type="button" onClick={() => void createPerson()}>
                  Add
                </Button>
                <Button type="button" variant="ghost" aria-label="Cancel" onClick={() => setAdding(false)}>
                  ✕
                </Button>
              </div>
              {error && <p className="text-xs text-rose-700 dark:text-rose-400">{error}</p>}
            </div>
          )}
        </>
      )}
    </div>
  )
}
