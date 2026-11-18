import { useState } from 'react'
import type { TripCompanion } from '../../lib/db'
import { addCompanion, MAX_COMPANIONS_PER_IDEA, MAX_NAME_LENGTH } from '../../lib/tripsSync'
import { Button } from '../../components/Button'
import { Chip } from '../../components/Chip'
import { FOCUS_RING_INSET } from '../../components/focus'
import { SegmentedTabs } from '../../components/SegmentedTabs'

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
      <SegmentedTabs
        kind="choice"
        variant="joined"
        label="Trip type"
        options={[
          { id: 'solo', label: mode === 'solo' ? '✓ Solo' : 'Solo' },
          { id: 'group', label: mode === 'group' ? '✓ With others' : 'With others' },
        ]}
        value={mode}
        onChange={onModeChange}
      />

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
