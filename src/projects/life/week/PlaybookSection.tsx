import { useState } from 'react'
import type { LifePlaybook } from '../../../lib/db'
import { logPlaybook, removeTrackerEntry, setPlaybookNote } from '../../../lib/lifeSync'
import { runSafe } from '../../../lib/runSafe'
import { LIFE_CAPS, type PlaybookSummary } from '../model'
import { useToday } from '../useToday'
import { CollapsibleSection } from './CollapsibleSection'

// "Playbook of the week": the one practice chosen for the week and a one-tap
// "Used it today" log, same pattern as a tracker (one use per day; tapping
// again today undoes it). The optional note is what happened / what changed.

export function PlaybookSection({
  week,
  playbook,
  summary,
  open,
  onToggle,
  readOnly,
  trigger,
}: {
  week: string
  playbook: LifePlaybook
  summary: PlaybookSummary
  open: boolean
  onToggle: () => void
  readOnly: boolean
  trigger: (label: string, undo: () => void | Promise<void>) => void
}) {
  const today = useToday()
  const todays = summary.entries.filter((e) => e.day === today)
  const last = todays[todays.length - 1]
  const [draft, setDraft] = useState('')
  const [editing, setEditing] = useState<string | null>(null)
  const noteValue = editing ?? last?.value.note ?? ''
  const used = summary.total

  async function toggleToday() {
    if (last) {
      await removeTrackerEntry(last.id)
      setEditing(null)
      return
    }
    const entry = await logPlaybook(week, { note: draft })
    setDraft('')
    trigger('✓ Playbook', () => removeTrackerEntry(entry.id))
  }

  return (
    <CollapsibleSection
      title="📖 Playbook of the week"
      summary={`${last ? '✓ today' : 'due today'} · ${used}× · ${playbook.practice}`}
      open={open}
      onToggle={onToggle}
      readOnly={readOnly}
    >
      <p className="text-xs text-slate-500 dark:text-slate-400">{playbook.section}</p>
      <p className="mt-0.5 text-base font-medium">{playbook.practice}</p>
      {playbook.plan && <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{playbook.plan}</p>}
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
        {used === 0
          ? 'Not used yet this week'
          : `Used ${used} time${used === 1 ? '' : 's'} · ${summary.days.length} day${summary.days.length === 1 ? '' : 's'}`}
      </p>
      {summary.entries.some((e) => e.value.note) && (
        <ul className="mt-1 space-y-0.5 text-xs text-slate-500 dark:text-slate-400">
          {summary.entries
            .filter((e) => e.value.note)
            .map((e) => (
              <li key={e.id}>
                {e.day}: {e.value.note}
              </li>
            ))}
        </ul>
      )}
      {!readOnly && (
        <div className="mt-3 space-y-2">
          <input
            type="text"
            value={last ? noteValue : draft}
            maxLength={LIFE_CAPS.playbookNote}
            placeholder="Note (optional): what happened, what changed"
            aria-label="Playbook note"
            onChange={(ev) => (last ? setEditing(ev.target.value) : setDraft(ev.target.value))}
            className="min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900"
          />
          <div className="flex gap-2">
            <button
              type="button"
              aria-pressed={!!last}
              onClick={() => void runSafe(toggleToday, 'Could not save')()}
              className={`min-h-14 min-w-0 flex-1 rounded-xl border px-4 py-2 text-base font-medium ${
                last
                  ? 'border-emerald-400/60 bg-emerald-400/10'
                  : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-800/50'
              }`}
            >
              {last ? '✓ Used today (tap to undo)' : 'Used it today'}
            </button>
            {last && editing !== null && editing.trim() !== (last.value.note ?? '') && (
              <button
                type="button"
                onClick={() =>
                  void runSafe(async () => {
                    await setPlaybookNote(last, editing)
                    setEditing(null)
                  }, 'Could not save')()
                }
                className="min-h-14 rounded-xl border border-slate-200 px-4 text-sm font-medium dark:border-slate-700"
              >
                Save note
              </button>
            )}
          </div>
        </div>
      )}
    </CollapsibleSection>
  )
}
