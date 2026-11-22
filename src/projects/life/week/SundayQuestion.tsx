import { useState } from 'react'
import type { LifeAnswer, LifeQuestion } from '../../../lib/db'
import { setSundayAnswer } from '../../../lib/lifeSync'
import { describeAnswer } from '../format'
import { MAX_APPS, parseApps, serializeApps, validateAnswer, type AppUsage, type TrackerSummary } from '../model'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../../lib/db'
import { Button } from '../../../components/Button'
import { EnergyScale } from './EnergyScale'

/** A Sunday question answered from its linked habit: shown, never typed. */
export function AutoAnswer({
  question,
  value,
  trackers,
}: {
  question: LifeQuestion
  value: LifeAnswer
  trackers: TrackerSummary[]
}) {
  const t = trackers.find((x) => x.tracker.id === question.tracker)?.tracker
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{question.label}</p>
        {t && (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Auto, from {t.emoji ? `${t.emoji} ` : ''}
            {t.label}
          </p>
        )}
      </div>
      <span className="shrink-0 text-sm font-medium text-slate-800 dark:text-slate-100">
        {describeAnswer(question, value)}
      </span>
    </div>
  )
}

export function SundayQuestion({ week, question, value }: { week: string; question: LifeQuestion; value: LifeAnswer }) {
  const [error, setError] = useState<string | null>(null)

  async function save(next: LifeAnswer) {
    const err = validateAnswer(question.type, next)
    if (err) {
      setError(err)
      return
    }
    setError(null)
    await setSundayAnswer(week, question.id, next)
  }

  return (
    <div>
      <p className="mb-1.5 text-sm font-medium text-slate-700 dark:text-slate-200">{question.label}</p>
      {question.type === 'number' && (
        <input
          type="number"
          inputMode="decimal"
          aria-label={question.label}
          defaultValue={typeof value === 'number' ? value : ''}
          onBlur={(e) => {
            const raw = e.target.value.trim()
            void save(raw === '' ? null : Number(raw))
          }}
          className="min-h-10 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm focus:border-(color:--accent-ring) focus:outline-none dark:border-slate-700 dark:bg-slate-800"
        />
      )}
      {question.type === 'boolean' && (
        <div className="flex gap-2">
          <Button
            variant={value === true ? 'primary' : 'ghost'}
            onClick={() => void save(value === true ? null : true)}
          >
            {value === true ? '✓ Yes' : 'Yes'}
          </Button>
          <Button
            variant={value === false ? 'primary' : 'ghost'}
            onClick={() => void save(value === false ? null : false)}
          >
            {value === false ? '✓ No' : 'No'}
          </Button>
        </div>
      )}
      {question.type === 'apps' && <AppsInput label={question.label} value={value} onSave={save} />}
      {question.type === 'duration' && <DurationInput label={question.label} value={value} onSave={save} />}
      {question.type === 'text' && (
        <textarea
          defaultValue={typeof value === 'string' ? value : ''}
          aria-label={question.label}
          onBlur={(e) => void save(e.target.value)}
          rows={2}
          maxLength={2000}
          className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm focus:border-(color:--accent-ring) focus:outline-none dark:border-slate-700 dark:bg-slate-800"
        />
      )}
      {question.type === 'scale5' && (
        <EnergyScale
          label=""
          value={typeof value === 'number' ? value : undefined}
          onPick={(n) => void save(value === n ? null : n)}
        />
      )}
      {error && <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{error}</p>}
    </div>
  )
}

/** Hours + minutes boxes; stored as total minutes. Both empty clears the answer. */
export function DurationInput({
  label,
  value,
  onSave,
}: {
  label: string
  value: LifeAnswer
  onSave: (next: LifeAnswer) => Promise<void>
}) {
  const total = typeof value === 'number' ? value : null
  const box =
    'min-h-10 w-20 rounded-lg border border-slate-300 bg-white px-3 text-sm focus:border-(color:--accent-ring) focus:outline-none dark:border-slate-700 dark:bg-slate-800'
  function commit(form: HTMLElement) {
    const h = form.querySelector<HTMLInputElement>('[data-part=h]')?.value.trim() ?? ''
    const m = form.querySelector<HTMLInputElement>('[data-part=m]')?.value.trim() ?? ''
    void onSave(h === '' && m === '' ? null : Number(h || 0) * 60 + Number(m || 0))
  }
  return (
    <div
      className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) commit(e.currentTarget)
      }}
    >
      <input
        data-part="h"
        type="number"
        inputMode="numeric"
        min={0}
        aria-label={`${label} — hours`}
        defaultValue={total === null ? '' : Math.floor(total / 60)}
        className={box}
      />
      h
      <input
        data-part="m"
        type="number"
        inputMode="numeric"
        min={0}
        aria-label={`${label} — minutes`}
        defaultValue={total === null ? '' : total % 60}
        className={box}
      />
      m
    </div>
  )
}

/** Names used in any past week's apps answers: the autocomplete catalog. */
function useKnownApps(): string[] {
  return (
    useLiveQuery(async () => {
      const seen = new Map<string, string>()
      const all = await db.lifeEntries
        .where('kind')
        .equals('sunday')
        .toArray()
        .catch(() => [])
      for (const e of all)
        for (const r of parseApps((e.value as { answer?: unknown }).answer))
          seen.set(r.app.toLowerCase(), seen.get(r.app.toLowerCase()) ?? r.app)
      return [...seen.values()].sort((a, b) => a.localeCompare(b))
    }, []) ?? []
  )
}

/** Up to 7 rows of app + hours/minutes, plus one locked row per `required`
 *  app (the limits of the app-limits habits: always asked, 0 allowed). Saved
 *  on leaving the group; a required row left blank stays out of the answer
 *  (the section then shows it as still to fill). */
export function AppsInput({
  label,
  value,
  onSave,
  required = [],
}: {
  label: string
  value: LifeAnswer
  onSave: (next: LifeAnswer) => Promise<void>
  required?: readonly string[]
}) {
  const known = useKnownApps()
  const initial = parseApps(value)
  const toRow = (app: string, minutes: number | undefined, locked: boolean) => ({
    app,
    h: minutes === undefined ? '' : String(Math.floor(minutes / 60)),
    m: minutes === undefined ? '' : String(minutes % 60),
    locked,
  })
  const [rows, setRows] = useState<{ app: string; h: string; m: string; locked: boolean }[]>(() => {
    const req = new Set(required.map((a) => a.toLowerCase()))
    const locked = required.map((a) =>
      toRow(a, initial.find((r) => r.app.toLowerCase() === a.toLowerCase())?.minutes, true),
    )
    const free = initial
      .filter((r) => !req.has(r.app.toLowerCase()))
      .slice(0, MAX_APPS)
      .map((r) => toRow(r.app, r.minutes, false))
    return [...locked, ...(free.length ? free : [toRow('', undefined, false)])]
  })
  const listId = `apps-${label.replace(/\W+/g, '-')}`
  const box =
    'min-h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm focus:border-(color:--accent-ring) focus:outline-none dark:border-slate-700 dark:bg-slate-800'
  function patch(i: number, p: Partial<(typeof rows)[number]>) {
    setRows((rs) => rs.map((r, j) => (j === i ? { ...r, ...p } : r)))
  }
  function commit() {
    const usage: AppUsage[] = rows
      // A limited app with nothing typed is not an answer of 0: leave it out (still to fill).
      .filter((r) => !r.locked || r.h.trim() !== '' || r.m.trim() !== '')
      .map((r) => ({
        app: r.app,
        minutes: Number(r.h || 0) * 60 + Number(r.m || 0),
      }))
    void onSave(serializeApps(usage, known))
  }
  const freeCount = rows.filter((r) => !r.locked).length
  return (
    <div
      className="space-y-2"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) commit()
      }}
    >
      <datalist id={listId}>
        {known.map((k) => (
          <option key={k} value={k} />
        ))}
      </datalist>
      {rows.map((r, i) => {
        const blank = r.locked && r.h.trim() === '' && r.m.trim() === ''
        return (
          <div key={i} className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            {r.locked ? (
              <span
                className={`flex min-h-10 min-w-0 flex-1 items-center gap-1 truncate rounded-lg border border-dashed px-3 ${blank ? 'border-amber-400 text-amber-800 dark:text-amber-300' : 'border-slate-300 text-slate-700 dark:border-slate-700 dark:text-slate-200'}`}
                title="App con limite: sempre da compilare (0 se non usata)"
              >
                <span aria-hidden>🔒</span>
                <span className="truncate">{r.app}</span>
              </span>
            ) : (
              <input
                list={listId}
                value={r.app}
                onChange={(e) => patch(i, { app: e.target.value })}
                maxLength={60}
                placeholder="App"
                aria-label={`App ${i + 1}`}
                className={`${box} min-w-0 flex-1`}
              />
            )}
            <input
              type="number"
              inputMode="numeric"
              min={0}
              value={r.h}
              onChange={(e) => patch(i, { h: e.target.value })}
              aria-label={`${r.locked ? r.app : `App ${i + 1}`} hours`}
              className={`${box} w-16`}
            />
            h
            <input
              type="number"
              inputMode="numeric"
              min={0}
              value={r.m}
              onChange={(e) => patch(i, { m: e.target.value })}
              aria-label={`${r.locked ? r.app : `App ${i + 1}`} minutes`}
              className={`${box} w-16`}
            />
            m
          </div>
        )
      })}
      {freeCount < MAX_APPS && (
        <button
          type="button"
          onClick={() => setRows((rs) => [...rs, toRow('', undefined, false)])}
          className="min-h-10 text-sm text-slate-500 dark:text-slate-400"
        >
          + Add app
        </button>
      )}
    </div>
  )
}
