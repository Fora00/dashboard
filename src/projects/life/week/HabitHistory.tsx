import { useState, type ReactNode } from 'react'
import type { LifeIdeaEntry, LifeIdeaStatus } from '../../../lib/db'
import { addIdea, removeIdea, updateIdea } from '../../../lib/lifeSync'
import { runSafe } from '../../../lib/runSafe'
import { Button } from '../../../components/Button'
import { Sheet } from '../../../components/Sheet'
import { LIFE_CAPS } from '../model'
import { useHabitHistory } from './useHabitHistory'

// A habit's story: week by week how it went and why it missed (the Spock
// test), plus the ideas to make it work, kept and updated over time. Opened
// from the 📈 button next to the habit (see HabitHistoryButton).

const STATUS_LABEL: Record<LifeIdeaStatus, string> = {
  open: '💡 To try',
  trying: '🔄 Trying',
  done: '✅ Works',
  dropped: '🗑️ Dropped',
}
const STATUSES = Object.keys(STATUS_LABEL) as LifeIdeaStatus[]

function weekLabel(week: string): string {
  return new Date(`${week}T12:00:00`).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })
}

function IdeaRow({ idea }: { idea: LifeIdeaEntry }) {
  return (
    <li className="space-y-1.5 py-2">
      <input
        // Remount when another device changes the text.
        key={idea.value.text}
        type="text"
        defaultValue={idea.value.text}
        maxLength={LIFE_CAPS.ideaText}
        aria-label="Idea"
        onBlur={(ev) => {
          if (ev.target.value.trim() && ev.target.value.trim() !== idea.value.text)
            void runSafe(updateIdea, 'Could not save')(idea, { text: ev.target.value })
          else ev.target.value = idea.value.text
        }}
        className="min-h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900"
      />
      <div className="flex items-center gap-2">
        <select
          value={idea.value.status}
          aria-label="Idea status"
          onChange={(ev) =>
            void runSafe(updateIdea, 'Could not save')(idea, { status: ev.target.value as LifeIdeaStatus })
          }
          className="min-h-10 flex-1 rounded-lg border border-slate-200 bg-white px-2 text-sm dark:border-slate-700 dark:bg-slate-900"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABEL[s]}
            </option>
          ))}
        </select>
        <button
          type="button"
          aria-label="Delete idea"
          onClick={() => void runSafe(removeIdea, 'Could not delete')(idea.id)}
          className="flex size-10 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-rose-600 dark:hover:bg-slate-800"
        >
          ✕
        </button>
      </div>
    </li>
  )
}

function HabitHistoryBody({ trackerId, week, summary }: { trackerId: string; week: string; summary?: ReactNode }) {
  const history = useHabitHistory(trackerId)
  const [draft, setDraft] = useState('')
  if (!history) return <p className="text-sm text-slate-500">Loading…</p>

  async function add() {
    const entry = await addIdea(week, trackerId, draft)
    if (entry) setDraft('')
  }

  return (
    <div className="space-y-5">
      <section>
        <h3 className="mb-1 text-sm font-semibold">Weeks</h3>
        {history.weeks.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">{summary ?? 'No weeks yet.'}</p>
        ) : (
          <ul className="divide-y divide-slate-200 dark:divide-slate-800">
            {history.weeks.map((w) => (
              <li key={w.week} className="py-2 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-600 dark:text-slate-300">Week of {weekLabel(w.week)}</span>
                  <span
                    className={
                      w.reached === false
                        ? 'font-medium text-amber-700 dark:text-amber-400'
                        : w.reached
                          ? 'font-medium text-emerald-700 dark:text-emerald-300'
                          : 'font-medium'
                    }
                  >
                    {w.target !== null ? `${w.total}/${w.target}${w.reached ? ' ✓' : ''}` : w.total}
                  </span>
                </div>
                {w.reason && <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Why not: {w.reason}</p>}
              </li>
            ))}
          </ul>
        )}
      </section>
      <section>
        <h3 className="mb-1 text-sm font-semibold">Ideas to make it work</h3>
        {history.ideas.length > 0 && (
          <ul className="divide-y divide-slate-200 dark:divide-slate-800">
            {history.ideas.map((i) => (
              <IdeaRow key={i.id} idea={i} />
            ))}
          </ul>
        )}
        <form
          className="mt-2 flex gap-2"
          onSubmit={(ev) => {
            ev.preventDefault()
            void runSafe(add, 'Could not save')()
          }}
        >
          <input
            type="text"
            value={draft}
            maxLength={LIFE_CAPS.ideaText}
            onChange={(ev) => setDraft(ev.target.value)}
            placeholder="A system fix to try…"
            aria-label="New idea"
            className="min-h-11 min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900"
          />
          <Button type="submit" disabled={!draft.trim()}>
            Add
          </Button>
        </form>
      </section>
    </div>
  )
}

/** The 📈 button beside a habit; opens its history sheet. Works on past weeks too. */
export function HabitHistoryButton({
  trackerId,
  label,
  week,
  summary,
}: {
  trackerId: string
  label: string
  /** Week new ideas are written in (the one on screen). */
  week: string
  /** Shown instead of "No weeks yet" for a habit that has no weekly plan (Streaks habits). */
  summary?: ReactNode
}) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`${label}: history and ideas`}
        className="flex size-10 shrink-0 items-center justify-center rounded-lg text-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
      >
        📈
      </button>
      <Sheet open={open} onClose={() => setOpen(false)} title={label}>
        {open && <HabitHistoryBody trackerId={trackerId} week={week} summary={summary} />}
      </Sheet>
    </>
  )
}
