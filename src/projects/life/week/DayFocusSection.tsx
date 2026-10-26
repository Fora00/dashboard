import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, type LifeDayFocus, type LifePlaybookEntry } from '../../../lib/db'
import { logPlaybook, removeDayFocus, removeTrackerEntry, setPlaybookNote, toggleDayFocus } from '../../../lib/lifeSync'
import { runSafe } from '../../../lib/runSafe'
import { LIFE_CAPS, parseDayKey, weekKey } from '../model'

// "Oggi": the current day's lines (up to 3), filled by the /oggi command, here
// only ticked or removed. Shows only `day`'s list; yesterday's lines are never
// carried over. Amber, so it reads apart from the weekly Focus.
// Local-first via Dexie; writes go through lifeSync.ts.

function Row({ item }: { item: LifeDayFocus }) {
  const { done, title } = item

  return (
    <li className="flex items-center gap-2">
      <button
        type="button"
        aria-pressed={done}
        onClick={() => void runSafe(toggleDayFocus, 'Could not save')(item.id)}
        className={`flex min-h-12 min-w-0 flex-1 items-center gap-3 rounded-xl border px-4 py-2 text-left text-base font-medium transition-colors active:bg-amber-100 dark:active:bg-amber-400/20 ${
          done
            ? 'border-amber-400 bg-amber-300/25 dark:bg-amber-400/15'
            : 'border-amber-300/70 bg-white hover:border-amber-400 dark:border-amber-400/30 dark:bg-slate-800/50 dark:hover:border-amber-400/60'
        }`}
      >
        <span
          className={`flex size-7 shrink-0 items-center justify-center rounded-full border text-sm ${
            done
              ? 'border-amber-500 bg-gradient-to-br from-amber-300 to-amber-500 text-slate-900'
              : 'border-amber-400 dark:border-amber-400/70'
          }`}
        >
          {done && '✓'}
        </span>
        <span className={`min-w-0 flex-1 break-words ${done ? 'text-slate-500 line-through' : ''}`}>{title}</span>
      </button>
      <button
        type="button"
        aria-label={`Elimina: ${title}`}
        onClick={() => {
          if (window.confirm(`Eliminare "${title}" da oggi?`)) void runSafe(removeDayFocus, 'Could not remove')(item.id)
        }}
        className="flex size-10 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
      >
        ✕
      </button>
    </li>
  )
}

// Reminder of the week's playbook practice, ticked like an Oggi line. Tap logs
// today's use (same entries as the Playbook block); notes pile up, one entry
// each (an empty "used" entry is reused by the first note). Tapping a done row
// undoes today's uses, asking first if any carries a note.
function PlaybookReminder({ day }: { day: string }) {
  const week = weekKey(parseDayKey(day))
  const practice = useLiveQuery(() => db.lifeWeeks.get(week).then((w) => w?.plan.playbook?.practice ?? null), [week])
  const todays = useLiveQuery(
    () =>
      db.lifeEntries
        .where('week')
        .equals(week)
        .filter((e): e is LifePlaybookEntry => e.kind === 'playbook' && e.day === day)
        .sortBy('createdAt'),
    [week, day],
  )
  const [draft, setDraft] = useState('')
  if (!practice || todays === undefined) return null
  const done = todays.length > 0
  const empty = todays.find((e) => !e.value.note?.trim())

  async function toggle() {
    if (!done) {
      await logPlaybook(week, { day, note: draft })
      setDraft('')
      return
    }
    if (todays!.some((e) => e.value.note?.trim()) && !window.confirm('Annullare gli usi di oggi, note comprese?'))
      return
    for (const e of todays!) await removeTrackerEntry(e.id)
  }

  async function addNote() {
    const note = draft.trim()
    if (!note) return
    if (empty) await setPlaybookNote(empty, note)
    else await logPlaybook(week, { day, note })
    setDraft('')
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        aria-pressed={done}
        onClick={() => void runSafe(toggle, 'Could not save')()}
        className={`flex min-h-12 w-full items-center gap-3 rounded-xl border px-4 py-2 text-left text-base transition-colors ${
          done
            ? 'border-amber-400 bg-amber-300/25 dark:bg-amber-400/15'
            : 'border-amber-300/70 bg-white hover:border-amber-400 dark:border-amber-400/30 dark:bg-slate-800/50'
        }`}
      >
        <span
          className={`flex size-7 shrink-0 items-center justify-center rounded-full border text-sm ${
            done
              ? 'border-amber-500 bg-gradient-to-br from-amber-300 to-amber-500 text-slate-900'
              : 'border-amber-400 dark:border-amber-400/70'
          }`}
        >
          {done && '✓'}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-xs text-slate-500 dark:text-slate-400">📖 Playbook</span>
          <span className={`block break-words font-medium ${done ? 'text-slate-500 line-through' : ''}`}>
            {practice}
          </span>
        </span>
      </button>
      {todays.some((e) => e.value.note?.trim()) && (
        <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
          {todays
            .filter((e) => e.value.note?.trim())
            .map((e) => (
              <li key={e.id} className="flex items-start gap-2">
                <span className="min-w-0 flex-1 break-words">• {e.value.note}</span>
                <button
                  type="button"
                  aria-label={`Elimina nota: ${e.value.note}`}
                  onClick={() => void runSafe(removeTrackerEntry, 'Could not remove')(e.id)}
                  className="flex size-8 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                >
                  ✕
                </button>
              </li>
            ))}
        </ul>
      )}
      <div className="flex gap-2">
        <input
          type="text"
          value={draft}
          maxLength={LIFE_CAPS.playbookNote}
          placeholder="Cosa è successo? (finisce nella revisione della settimana)"
          aria-label="Playbook note"
          onChange={(ev) => setDraft(ev.target.value)}
          onKeyDown={(ev) => {
            if (ev.key === 'Enter') void runSafe(addNote, 'Could not save')()
          }}
          className="min-h-11 min-w-0 flex-1 rounded-lg border border-amber-300/70 bg-white px-3 text-sm dark:border-amber-400/30 dark:bg-slate-900"
        />
        {draft.trim() && (
          <button
            type="button"
            onClick={() => void runSafe(addNote, 'Could not save')()}
            className="min-h-11 rounded-lg border border-amber-400 px-4 text-sm font-medium"
          >
            Aggiungi
          </button>
        )}
      </div>
    </div>
  )
}

export function DayFocusSection({ day }: { day: string }) {
  const items = useLiveQuery(() => db.lifeDayFocus.where('day').equals(day).sortBy('slot'), [day])

  if (items === undefined) return null

  return (
    <section className="mb-6" aria-label="Oggi">
      <div className="rounded-xl border border-amber-300/70 bg-amber-50/60 dark:border-amber-400/30 dark:bg-amber-400/5">
        <div className="flex min-h-12 items-center justify-between gap-3 px-4 text-sm font-medium text-amber-800 dark:text-amber-300">
          <h2>☀️ Oggi</h2>
          {items.length > 0 && (
            <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
              {items.filter((i) => i.done).length}/{items.length}
            </span>
          )}
        </div>
        <div className="space-y-2 border-t border-amber-300/70 px-4 py-3 dark:border-amber-400/30">
          {items.length > 0 ? (
            <ul className="space-y-2">
              {items.map((i) => (
                <Row key={`${i.id}:${i.updatedAt}`} item={i} />
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Niente per oggi. Lancia <code>/oggi</code> per impostarlo.
            </p>
          )}
          <PlaybookReminder day={day} />
        </div>
      </div>
    </section>
  )
}
