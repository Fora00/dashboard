import { useState } from 'react'
import { setCheckin } from '../../../lib/lifeSync'
import { relativeCheckinDate } from '../format'
import { LIFE_CAPS, type CheckinStatus } from '../model'

export function CheckinRow({ week, status, readOnly }: { week: string; status: CheckinStatus; readOnly: boolean }) {
  const { checkin, done, note, daysLeft, overdue } = status
  const [expanded, setExpanded] = useState(false)

  async function toggleDone() {
    await setCheckin(week, checkin.id, { done: !done, note })
  }

  async function saveNote(value: string) {
    const trimmed = value.trim()
    if (trimmed === (note ?? '')) return
    await setCheckin(week, checkin.id, { done, note: trimmed })
  }

  const dateClass = overdue && !done ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400 dark:text-slate-500'

  // Same shape as Focus/Habits rows: the whole row toggles done; the note
  // sits behind the ✎ button on the right.
  return (
    <li>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={readOnly}
          aria-pressed={done}
          onClick={() => void toggleDone()}
          className={`flex min-h-14 min-w-0 flex-1 items-center gap-3 rounded-xl border px-4 py-2 text-left text-base font-medium transition-colors ${
            readOnly ? '' : 'active:bg-slate-100 dark:active:bg-slate-800'
          } ${
            done
              ? 'border-emerald-400/60 bg-emerald-400/10'
              : 'border-slate-200 bg-white hover:border-slate-400 dark:border-slate-800 dark:bg-slate-800/50 dark:hover:border-slate-600'
          }`}
        >
          <span
            className={`flex size-7 shrink-0 items-center justify-center rounded-full border text-sm ${
              done ? 'border-emerald-400 bg-emerald-400 text-slate-900' : 'border-slate-400 dark:border-slate-500'
            }`}
          >
            {done && '✓'}
          </span>
          <span className="flex min-w-0 flex-1 flex-col">
            <span className={`break-words ${done ? 'text-slate-500 line-through' : ''}`}>{checkin.label}</span>
            {note && !expanded && (
              <span className="truncate text-xs font-normal text-slate-400 dark:text-slate-500">{note}</span>
            )}
          </span>
          <span className={`shrink-0 text-xs font-normal ${dateClass}`}>{relativeCheckinDate(daysLeft)}</span>
        </button>
        {!readOnly && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            aria-label={`${expanded ? 'Hide' : 'Edit'} note for ${checkin.label}`}
            className={`flex size-10 shrink-0 items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 ${
              note ? 'text-slate-600 dark:text-slate-300' : 'text-slate-400'
            }`}
          >
            ✎
          </button>
        )}
      </div>
      {expanded && !readOnly && (
        <textarea
          defaultValue={note ?? ''}
          rows={2}
          maxLength={LIFE_CAPS.checkinNote}
          placeholder="Note (optional)"
          autoFocus
          onBlur={(e) => void saveNote(e.target.value)}
          className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm focus:border-indigo-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
        />
      )}
    </li>
  )
}
