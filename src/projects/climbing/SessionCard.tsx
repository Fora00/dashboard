import { SELECT } from '../../components/field'
import { useState, type FormEvent } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, type Climb, type ClimbSession } from '../../lib/db'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { FOCUS_RING_INSET } from '../../components/focus'
import { addClimb, deleteClimb, deleteSession, restoreSession, sync, toggleClimbSent } from '../../lib/climbSync'
import { formatDate } from '../../lib/dates'
import { DISCIPLINE_LABEL, GRADES } from './grades'

function sessionDate(date: string): string {
  return formatDate(date, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function SessionCard({
  session,
  onUndoable,
}: {
  session: ClimbSession
  /** Show the page's Undo snackbar (it outlives this card when the session is deleted). */
  onUndoable: (label: string, undo: () => void | Promise<void>) => void
}) {
  const grades = GRADES[session.discipline]
  // GRADES arrays are non-empty compile-time constants.
  const [grade, setGrade] = useState(grades[Math.floor(grades.length / 3)]!)
  const [sent, setSent] = useState(true)

  const climbs = useLiveQuery(() => db.climbs.where('sessionId').equals(session.id).sortBy('createdAt'), [session.id])
  const sends = climbs?.filter((c) => c.sent === 1).length ?? 0

  async function logClimb(e: FormEvent) {
    e.preventDefault()
    await addClimb(session, grade, sent)
  }

  async function removeClimb(climb: Climb) {
    await deleteClimb(climb.id)
    onUndoable(`Removed ${climb.grade} · Undo`, () => sync.upsert('climbs', climb))
  }

  async function removeSession() {
    // Snapshot first: deleteSession cascades the local climbs.
    const snapshot = await db.climbs.where('sessionId').equals(session.id).toArray()
    await deleteSession(session.id)
    onUndoable(`Deleted session at ${session.location} · Undo`, () => restoreSession(session, snapshot))
  }

  const renderClimb = (climb: Climb) => (
    <li key={climb.id} className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => void toggleClimbSent(climb)}
        title="Tap to toggle sent / attempted"
        aria-pressed={climb.sent === 1}
        className={`flex min-h-10 items-center gap-1.5 rounded-l-lg border py-1.5 pr-2 pl-3 text-sm transition-colors ${FOCUS_RING_INSET} ${
          climb.sent === 1
            ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-600 dark:text-emerald-300'
            : 'border-slate-300 bg-white text-slate-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400'
        }`}
      >
        <span className="font-semibold">{climb.grade}</span>
        <span className="text-xs">{climb.sent === 1 ? '✓ sent' : '· try'}</span>
      </button>
      <button
        type="button"
        onClick={() => void removeClimb(climb)}
        aria-label={`Remove ${climb.grade}`}
        className={`flex min-h-10 min-w-10 items-center justify-center rounded-r-lg border border-slate-200 bg-slate-50 text-xs text-slate-500 transition-colors hover:text-rose-600 dark:border-slate-800 dark:bg-slate-800/30 dark:hover:text-rose-400 ${FOCUS_RING_INSET}`}
      >
        ✕
      </button>
    </li>
  )

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-medium text-slate-800 dark:text-slate-200">{session.location}</p>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            {sessionDate(session.date)}
            {climbs && climbs.length > 0 && (
              <span className="text-slate-500">
                {' '}
                · {sends}/{climbs.length} sent
              </span>
            )}
          </p>
        </div>
        <span
          className={`rounded-full border px-2.5 py-1 text-xs ${
            session.discipline === 'boulder'
              ? 'border-indigo-400/40 bg-indigo-500/10 text-indigo-600 dark:text-indigo-300'
              : 'border-sky-400/40 bg-sky-500/10 text-sky-600 dark:text-sky-300'
          }`}
        >
          {DISCIPLINE_LABEL[session.discipline]}
        </span>
      </div>

      {session.notes && <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{session.notes}</p>}

      {climbs && climbs.length > 0 && <ul className="mt-3 flex flex-wrap gap-2">{climbs.map(renderClimb)}</ul>}

      <form onSubmit={logClimb} className="mt-3 flex flex-wrap items-center gap-2">
        <select value={grade} onChange={(e) => setGrade(e.target.value)} aria-label="Grade" className={SELECT}>
          {grades.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
        <div className="flex overflow-hidden rounded-lg border border-slate-300 dark:border-slate-700">
          {([true, false] as const).map((isSent) => (
            <button
              key={String(isSent)}
              type="button"
              onClick={() => setSent(isSent)}
              aria-pressed={sent === isSent}
              className={`min-h-10 px-3 text-sm transition-colors ${FOCUS_RING_INSET} ${
                sent === isSent
                  ? isSent
                    ? 'bg-emerald-400/20 text-emerald-600 dark:text-emerald-300'
                    : 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200'
                  : 'bg-slate-100 text-slate-500 dark:bg-slate-800'
              }`}
            >
              {sent === isSent ? '✓ ' : ''}
              {isSent ? 'Sent' : 'Attempt'}
            </button>
          ))}
        </div>
        <Button type="submit" variant="ghost">
          Log climb
        </Button>
      </form>

      <div className="mt-3 flex justify-end gap-2 border-t border-slate-200 pt-2 dark:border-slate-800">
        <button
          type="button"
          onClick={() => void removeSession()}
          className={`min-h-10 px-2 text-xs text-slate-500 transition-colors hover:text-rose-600 dark:hover:text-rose-400 ${FOCUS_RING_INSET}`}
        >
          Delete session
        </button>
      </div>
    </Card>
  )
}
