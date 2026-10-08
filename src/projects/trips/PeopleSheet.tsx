import { useState } from 'react'
import type { TripCompanion } from '../../lib/db'
import { MAX_EMOJI_LENGTH, MAX_NAME_LENGTH, renameCompanion, setCompanionEmoji } from '../../lib/tripsSync'
import { Button } from '../../components/Button'
import { Sheet } from '../../components/Sheet'

interface Props {
  open: boolean
  onClose: () => void
  companions: TripCompanion[]
  /** Ideas per companion id, for the "N trips" label. */
  counts: Map<string, number>
  onDelete: (companion: TripCompanion) => void | Promise<void>
}

/** Rename (blur/Enter saves) and delete the people you travel with. */
export function PeopleSheet({ open, onClose, companions, counts, onDelete }: Props) {
  const [error, setError] = useState<{ id: string; text: string } | null>(null)

  async function saveName(c: TripCompanion, input: HTMLInputElement) {
    if (input.value.trim() === c.name) {
      input.value = c.name
      setError(null)
      return
    }
    const result = await renameCompanion(c, input.value)
    if (!result.ok) {
      setError({ id: c.id, text: result.reason === 'duplicate' ? 'That name already exists' : 'Enter a name' })
      input.value = c.name
      return
    }
    setError(null)
  }

  async function saveEmoji(c: TripCompanion, input: HTMLInputElement) {
    await setCompanionEmoji(c, input.value)
    input.value = c.emoji
  }

  return (
    <Sheet
      open={open}
      onClose={() => {
        setError(null)
        onClose()
      }}
      title="People"
    >
      {companions.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          No people yet. Choose “With others” when adding a trip and tap “+ Person”.
        </p>
      ) : (
        <ul className="space-y-2">
          {companions.map((c) => {
            const count = counts.get(c.id) ?? 0
            return (
              <li key={c.id}>
                <div className="flex items-center gap-2">
                  <input
                    key={`emoji-${c.id}-${c.emoji}`}
                    defaultValue={c.emoji}
                    onBlur={(e) => void saveEmoji(c, e.target)}
                    maxLength={MAX_EMOJI_LENGTH}
                    aria-label={`Emoji for ${c.name}`}
                    className="min-h-10 w-12 shrink-0 rounded-lg border border-slate-300 bg-white text-center text-base focus:border-(color:--accent-ring) focus:outline-none focus-visible:ring-2 focus-visible:ring-(color:--accent-ring) dark:border-slate-700 dark:bg-slate-800"
                  />
                  <input
                    key={`name-${c.id}-${c.name}`}
                    defaultValue={c.name}
                    onBlur={(e) => void saveName(c, e.target)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') e.currentTarget.blur()
                    }}
                    maxLength={MAX_NAME_LENGTH}
                    autoComplete="off"
                    enterKeyHint="done"
                    aria-label={`Name for ${c.name}`}
                    className="min-h-10 min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3.5 text-sm focus:border-(color:--accent-ring) focus:outline-none focus-visible:ring-2 focus-visible:ring-(color:--accent-ring) dark:border-slate-700 dark:bg-slate-800"
                  />
                  <Button variant="danger" onClick={() => void onDelete(c)} aria-label={`Delete ${c.name}`}>
                    ✕
                  </Button>
                </div>
                <p className="px-1 pt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  {count} {count === 1 ? 'trip' : 'trips'}
                </p>
                {error?.id === c.id && <p className="px-1 text-xs text-rose-700 dark:text-rose-400">{error.text}</p>}
              </li>
            )
          })}
        </ul>
      )}
    </Sheet>
  )
}
