import { useMemo, useState, type FormEvent } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, type Discipline } from '../../lib/db'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { PageHeader } from '../../components/PageHeader'
import { EmptyState } from '../../components/EmptyState'
import { addSession } from '../../lib/climbSync'
import { DISCIPLINES, DISCIPLINE_LABEL, gradeFraction, gradeIndex } from './grades'
import { SessionCard } from './SessionCard'
import { SyncCard } from '../../components/SyncCard'

const inputClass =
  'min-h-10 w-full rounded-lg border border-slate-700 bg-slate-800 px-3.5 text-sm placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none'

const BAR_COLOR: Record<Discipline, string> = {
  boulder: 'bg-indigo-400/70',
  lead: 'bg-sky-400/70',
}

function today(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate(),
  ).padStart(2, '0')}`
}

function formatMonth(month: string): string {
  return new Date(`${month}-01T00:00:00`).toLocaleDateString(undefined, {
    month: 'short',
    year: 'numeric',
  })
}

interface MonthProgress {
  month: string
  best: Partial<Record<Discipline, string>>
}

export function Climbing() {
  const [showForm, setShowForm] = useState(false)
  const [date, setDate] = useState(today)
  const [location, setLocation] = useState('')
  const [discipline, setDiscipline] = useState<Discipline>('boulder')
  const [notes, setNotes] = useState('')

  const sessions = useLiveQuery(() =>
    db.climbSessions.orderBy('date').reverse().toArray(),
  )
  const climbs = useLiveQuery(() => db.climbs.toArray())

  const sendCount = climbs?.filter((c) => c.sent === 1).length ?? 0

  // Hardest grade sent per month, per discipline, newest month first.
  const monthly = useMemo<MonthProgress[]>(() => {
    if (!climbs) return []
    const byMonth = new Map<string, Partial<Record<Discipline, string>>>()
    for (const climb of climbs) {
      if (climb.sent !== 1) continue
      const month = climb.date.slice(0, 7)
      const best = byMonth.get(month) ?? {}
      const current = best[climb.discipline]
      if (
        current === undefined ||
        gradeIndex(climb.discipline, climb.grade) >
          gradeIndex(climb.discipline, current)
      ) {
        best[climb.discipline] = climb.grade
      }
      byMonth.set(month, best)
    }
    return [...byMonth.entries()]
      .sort(([a], [b]) => (a < b ? 1 : -1))
      .map(([month, best]) => ({ month, best }))
  }, [climbs])

  async function createSession(e: FormEvent) {
    e.preventDefault()
    const trimmed = location.trim()
    if (!trimmed || !date) return
    await addSession({ date, location: trimmed, discipline, notes: notes.trim() })
    setLocation('')
    setNotes('')
    setShowForm(false)
  }

  return (
    <div>
      <PageHeader
        emoji="🧗"
        title="Climbing"
        subtitle="Log sessions and sends — data stays on this device."
      >
        {!showForm && <Button onClick={() => setShowForm(true)}>+ Session</Button>}
      </PageHeader>

      <SyncCard />

      {showForm && (
        <form onSubmit={createSession} className="mb-6">
          <Card className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {DISCIPLINES.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDiscipline(d)}
                  className={`min-h-10 rounded-full border px-3.5 text-sm transition-colors ${
                    d === discipline
                      ? 'border-indigo-400 bg-indigo-500/20 text-indigo-300'
                      : 'border-slate-700 text-slate-400'
                  }`}
                >
                  {DISCIPLINE_LABEL[d]}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                aria-label="Session date"
                className={`${inputClass} w-auto`}
              />
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Where? e.g. Vertical Gym"
                autoFocus
                className={`${inputClass} min-w-40 flex-1`}
              />
            </div>
            <input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes (optional)"
              className={inputClass}
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" type="button" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!location.trim() || !date}>
                Add session
              </Button>
            </div>
          </Card>
        </form>
      )}

      <section className="mb-6">
        <h2 className="mb-2 text-sm font-medium text-slate-400">Progress</h2>
        <Card>
          <div className="flex gap-6">
            <div>
              <p className="text-2xl font-semibold text-slate-100">
                {sessions?.length ?? 0}
              </p>
              <p className="text-xs text-slate-400">sessions</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-slate-100">{sendCount}</p>
              <p className="text-xs text-slate-400">sends</p>
            </div>
          </div>

          {monthly.length > 0 && (
            <div className="mt-4 space-y-3 border-t border-slate-800 pt-3">
              <p className="text-xs text-slate-500">Hardest send per month</p>
              {monthly.map(({ month, best }) => (
                <div key={month}>
                  <p className="mb-1 text-xs text-slate-400">{formatMonth(month)}</p>
                  <div className="space-y-1">
                    {DISCIPLINES.map((d) => {
                      const grade = best[d]
                      if (!grade) return null
                      return (
                        <div key={d} className="flex items-center gap-2">
                          <span className="w-14 shrink-0 text-xs text-slate-500">
                            {DISCIPLINE_LABEL[d]}
                          </span>
                          <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-800">
                            <div
                              className={`h-full rounded-full ${BAR_COLOR[d]}`}
                              style={{ width: `${gradeFraction(d, grade) * 100}%` }}
                            />
                          </div>
                          <span className="w-8 shrink-0 text-right text-xs font-semibold text-slate-200">
                            {grade}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </section>

      <section>
        <h2 className="mb-2 text-sm font-medium text-slate-400">
          Sessions{sessions && sessions.length > 0 ? ` · ${sessions.length}` : ''}
        </h2>
        {sessions === undefined ? null : sessions.length === 0 ? (
          <EmptyState
            emoji="🪨"
            title="No sessions yet"
            hint="Add a session, then log each climb with its grade."
          />
        ) : (
          <div className="space-y-3">
            {sessions.map((s) => (
              <SessionCard key={s.id} session={s} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
