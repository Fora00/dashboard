import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, type LifeDayFocus } from '../../../lib/db'
import { addDayFocus, editDayFocus, removeDayFocus, toggleDayFocus } from '../../../lib/lifeSync'
import { runSafe } from '../../../lib/runSafe'
import { LIFE_CAPS, parseFocusLines } from '../model'

// "Focus di oggi": up to 3 free-text lines for the current day, added by hand
// or pasted (one per line), ticked, edited, deleted. Shows only `day`'s list;
// yesterday's lines are never carried over. Same look as the weekly Focus.
// Local-first via Dexie; writes go through lifeSync.ts.

function Row({ item }: { item: LifeDayFocus }) {
  const [editing, setEditing] = useState(false)
  const { done, title } = item

  async function save(value: string) {
    setEditing(false)
    await editDayFocus(item.id, value)
  }

  return (
    <li className="flex items-center gap-2">
      {editing ? (
        <input
          defaultValue={title}
          maxLength={LIFE_CAPS.dayFocusTitle}
          aria-label="Modifica focus"
          autoFocus
          onBlur={(e) => void runSafe(save, 'Could not save')(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') e.currentTarget.blur()
            if (e.key === 'Escape') setEditing(false)
          }}
          className="min-h-16 min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-base focus:border-(color:--accent-ring) focus:outline-none dark:border-slate-700 dark:bg-slate-800"
        />
      ) : (
        <button
          type="button"
          aria-pressed={done}
          onClick={() => void runSafe(toggleDayFocus, 'Could not save')(item.id)}
          className={`flex min-h-16 min-w-0 flex-1 items-center gap-3 rounded-xl border px-4 py-3 text-left text-base font-medium transition-colors active:bg-slate-100 dark:active:bg-slate-800 ${
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
          <span className={`min-w-0 flex-1 break-words ${done ? 'text-slate-500 line-through' : ''}`}>{title}</span>
        </button>
      )}
      {!editing && (
        <>
          <button
            type="button"
            aria-label={`Modifica focus: ${title}`}
            onClick={() => setEditing(true)}
            className="flex size-10 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            ✎
          </button>
          <button
            type="button"
            aria-label={`Elimina focus: ${title}`}
            onClick={() => {
              if (window.confirm(`Eliminare "${title}" dal focus di oggi?`))
                void runSafe(removeDayFocus, 'Could not remove')(item.id)
            }}
            className="flex size-10 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            ✕
          </button>
        </>
      )}
    </li>
  )
}

export function DayFocusSection({ day }: { day: string }) {
  const items = useLiveQuery(() => db.lifeDayFocus.where('day').equals(day).sortBy('slot'), [day])
  const [text, setText] = useState('')
  const [skipped, setSkipped] = useState(0)

  if (items === undefined) return null
  const full = items.length >= LIFE_CAPS.dayFocus

  async function add() {
    const lines = parseFocusLines(text)
    if (lines.length === 0) return
    const added = await addDayFocus(day, lines)
    setSkipped(lines.length - added)
    setText('')
  }

  return (
    <section className="mb-6" aria-label="Focus di oggi">
      <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-800/50">
        <div className="flex min-h-12 items-center justify-between gap-3 px-4 text-sm font-medium text-slate-700 dark:text-slate-200">
          <h2>🎯 Focus di oggi</h2>
          <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
            {items.filter((i) => i.done).length}/{items.length}
          </span>
        </div>
        <div className="border-t border-slate-200 px-4 py-3 dark:border-slate-800">
          {items.length > 0 && (
            <ul className="mb-3 space-y-2">
              {items.map((i) => (
                <Row key={`${i.id}:${i.updatedAt}`} item={i} />
              ))}
            </ul>
          )}
          {!full && (
            <div className="flex items-start gap-2">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    void runSafe(add, 'Could not save')()
                  }
                }}
                rows={text.includes('\n') ? 3 : 1}
                maxLength={LIFE_CAPS.dayFocusTitle * LIFE_CAPS.dayFocus + 2}
                placeholder="Aggiungi o incolla (una riga per focus)"
                aria-label="Nuovo focus di oggi"
                className="min-h-10 min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm focus:border-(color:--accent-ring) focus:outline-none dark:border-slate-700 dark:bg-slate-800"
              />
              <button
                type="button"
                disabled={parseFocusLines(text).length === 0}
                onClick={() => void runSafe(add, 'Could not save')()}
                className="min-h-10 shrink-0 rounded-lg border border-slate-300 px-3 text-sm font-medium disabled:opacity-40 dark:border-slate-700"
              >
                Aggiungi
              </button>
            </div>
          )}
          {skipped > 0 && (
            <p role="status" className="mt-2 text-xs text-amber-600 dark:text-amber-400">
              Max {LIFE_CAPS.dayFocus} al giorno: {skipped} non {skipped === 1 ? 'è entrata' : 'sono entrate'}.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
