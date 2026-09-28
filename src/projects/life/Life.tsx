import { useMemo, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { Link } from 'react-router-dom'
import {
  db,
  type LifeAnswer,
  type LifeEntry,
  type LifePlan,
  type LifeQuestion,
  type LifeTrackerEntry,
  type LifeWeek,
} from '../../lib/db'
import {
  logTracker,
  markTasksSent,
  removeTrackerEntry,
  restoreEntry,
  setSundayAnswer,
  setTrackerEnergy,
  sync,
  toggleFocus,
} from '../../lib/lifeSync'
import {
  buildExportMarkdown,
  buildThingsUrl,
  dayKey,
  nextCheckin,
  parseDayKey,
  summarizeWeek,
  validateAnswer,
  weekKey,
  type TrackerSummary,
} from './model'
import { useUndoSnackbar } from '../../lib/useUndoSnackbar'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { PageHeader } from '../../components/PageHeader'
import { EmptyState } from '../../components/EmptyState'
import { SyncCard } from '../../components/SyncCard'
import { Snackbar } from '../../components/Snackbar'
import { SkeletonList } from '../../components/Skeleton'

// Week screen for the Life project (spec: docs/HANDOFF-life.md). Local-first:
// reads db.lifeWeeks / db.lifeEntries directly via useLiveQuery, works fully
// offline and signed out. Mutations go through src/lib/lifeSync.ts only.

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const SCALE5 = [1, 2, 3, 4, 5]

type View = { tab: 'week' } | { tab: 'history' } | { tab: 'past'; week: string }

export function Life() {
  const week = weekKey()
  const [view, setView] = useState<View>({ tab: 'week' })

  // .get() resolves to undefined both while still loading and when no row
  // exists — map "no row" to null so `weekRow === undefined` means loading
  // and `weekRow === null` unambiguously means "no plan yet".
  const weekRow = useLiveQuery(() => db.lifeWeeks.get(week).then((w) => w ?? null), [week])
  const entries = useLiveQuery(() => db.lifeEntries.where('week').equals(week).toArray(), [week])
  const pastWeeks = useLiveQuery(() => db.lifeWeeks.orderBy('id').reverse().toArray())

  if (view.tab === 'history') {
    return (
      <HistoryList
        weeks={pastWeeks}
        currentWeek={week}
        onBack={() => setView({ tab: 'week' })}
        onOpen={(w) => setView({ tab: 'past', week: w })}
      />
    )
  }

  if (view.tab === 'past') {
    return <PastWeek weekKeyValue={view.week} onBack={() => setView({ tab: 'history' })} />
  }

  const header = (
    <PageHeader emoji="🧭" title="Life" subtitle="This week: focus, trackers, Sunday check. Owner only.">
      <div className="flex gap-2">
        <Link to="/life/import">
          <Button variant="ghost">Import</Button>
        </Link>
        <Button variant="ghost" onClick={() => setView({ tab: 'history' })}>
          History
        </Button>
      </div>
    </PageHeader>
  )

  if (weekRow === undefined || entries === undefined) {
    return (
      <div>
        {header}
        <SkeletonList rows={4} rowClassName="h-16" />
      </div>
    )
  }

  if (!weekRow) {
    return (
      <div>
        {header}
        <EmptyState
          emoji="🧭"
          title="No plan for this week"
          hint="Import this week's plan to get started — paste JSON or open an import link from your Mac."
        />
        <div className="mt-4 flex justify-center">
          <Link to="/life/import">
            <Button>Import week</Button>
          </Link>
        </div>
        <div className="mt-6">
          <SyncCard sync={sync} />
        </div>
      </div>
    )
  }

  return (
    <div>
      {header}
      <WeekBody week={week} plan={weekRow.plan} entries={entries} readOnly={false} />
      <div className="mt-6">
        <SyncCard sync={sync} />
      </div>
    </div>
  )
}

// --- History ------------------------------------------------------------

function HistoryList({
  weeks,
  currentWeek,
  onBack,
  onOpen,
}: {
  weeks: LifeWeek[] | undefined
  currentWeek: string
  onBack: () => void
  onOpen: (week: string) => void
}) {
  const past = weeks?.filter((w) => w.week !== currentWeek) ?? []
  return (
    <div>
      <PageHeader emoji="🧭" title="History" subtitle="Past weeks, newest first.">
        <Button variant="ghost" onClick={onBack}>
          ← This week
        </Button>
      </PageHeader>
      {weeks === undefined ? (
        <SkeletonList rows={4} rowClassName="h-12" />
      ) : past.length === 0 ? (
        <EmptyState emoji="🗓️" title="No past weeks yet" hint="Imported weeks show up here once a new week starts." />
      ) : (
        <ul className="space-y-2">
          {past.map((w) => (
            <li key={w.id}>
              <button
                type="button"
                onClick={() => onOpen(w.week)}
                className="flex min-h-12 w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-4 text-left text-sm transition-colors hover:border-slate-400 active:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/50 dark:hover:border-slate-600 dark:active:bg-slate-800"
              >
                <span className="font-medium">Week of {w.week}</span>
                <span aria-hidden className="text-slate-400">
                  ›
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function PastWeek({ weekKeyValue, onBack }: { weekKeyValue: string; onBack: () => void }) {
  const weekRow = useLiveQuery(() => db.lifeWeeks.get(weekKeyValue).then((w) => w ?? null), [weekKeyValue])
  const entries = useLiveQuery(() => db.lifeEntries.where('week').equals(weekKeyValue).toArray(), [weekKeyValue])
  return (
    <div>
      <PageHeader emoji="🧭" title={`Week of ${weekKeyValue}`} subtitle="Read-only.">
        <Button variant="ghost" onClick={onBack}>
          ← History
        </Button>
      </PageHeader>
      {weekRow === undefined || entries === undefined ? (
        <SkeletonList rows={4} rowClassName="h-16" />
      ) : !weekRow ? (
        <EmptyState emoji="🧭" title="Week not found" />
      ) : (
        <WeekBody key={weekKeyValue} week={weekKeyValue} plan={weekRow.plan} entries={entries} readOnly />
      )}
    </div>
  )
}

// --- Week body (shared by the current week and read-only History) -------

interface WeekBodyProps {
  week: string
  plan: LifePlan
  entries: LifeEntry[]
  readOnly: boolean
}

function WeekBody({ week, plan, entries, readOnly }: WeekBodyProps) {
  const summary = useMemo(() => summarizeWeek(plan, entries), [plan, entries])
  const { pending, trigger, confirmUndo } = useUndoSnackbar()
  const [rulesOpen, setRulesOpen] = useState(false)
  const [energyPromptId, setEnergyPromptId] = useState<string | null>(null)
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(new Set())
  const [exportState, setExportState] = useState<{ text: string; copied: boolean } | null>(null)

  const dow = new Date().getDay()
  const isWeekendToday = dow === 0 || dow === 6
  const [sundayOpen, setSundayOpen] = useState(isWeekendToday)

  const checkin = nextCheckin(plan)
  const unsent = plan.tasks.filter((t) => !summary.sentTaskIds.has(t.id))
  const sent = plan.tasks.filter((t) => summary.sentTaskIds.has(t.id))

  function toggleSelected(id: string) {
    setSelectedTaskIds((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  // Mark sent BEFORE opening Things: on iOS the PWA can be suspended the
  // moment Things opens, so a write after the navigation may never land and
  // a second tap would duplicate every to-do.
  async function sendAll() {
    if (unsent.length === 0) return
    await markTasksSent(week, unsent.map((t) => t.id), true)
    window.location.href = buildThingsUrl(unsent)
  }

  // Selected tasks are already marked sent; just open them again.
  function resendSelected() {
    const tasks = plan.tasks.filter((t) => selectedTaskIds.has(t.id))
    if (tasks.length === 0) return
    setSelectedTaskIds(new Set())
    window.location.href = buildThingsUrl(tasks)
  }

  async function doExport() {
    const md = buildExportMarkdown(plan, entries)
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(md)
        setExportState({ text: md, copied: true })
        setTimeout(() => setExportState((s) => (s?.copied ? null : s)), 2000)
        return
      } catch {
        // fall through to the textarea fallback below
      }
    }
    setExportState({ text: md, copied: false })
  }

  async function doShare() {
    const md = buildExportMarkdown(plan, entries)
    try {
      await navigator.share({ title: `Week of ${plan.week}`, text: md })
    } catch {
      // cancelled or unavailable — nothing to do
    }
  }

  return (
    <div>
      {plan.focus.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">Focus</h2>
          <ul className="space-y-2">
            {plan.focus.map((f) => {
              const done = summary.focusDone.has(f.id)
              return (
                <li key={f.id}>
                  <button
                    type="button"
                    disabled={readOnly}
                    aria-pressed={done}
                    onClick={() => void toggleFocus(week, f.id)}
                    className={`flex min-h-16 w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-base font-medium transition-colors ${
                      readOnly ? '' : 'active:bg-slate-100 dark:active:bg-slate-800'
                    } ${
                      done
                        ? 'border-emerald-400/60 bg-emerald-400/10'
                        : 'border-slate-200 bg-white hover:border-slate-400 dark:border-slate-800 dark:bg-slate-800/50 dark:hover:border-slate-600'
                    }`}
                  >
                    <span
                      className={`flex size-7 shrink-0 items-center justify-center rounded-full border text-sm ${
                        done
                          ? 'border-emerald-400 bg-emerald-400 text-slate-900'
                          : 'border-slate-400 dark:border-slate-500'
                      }`}
                    >
                      {done && '✓'}
                    </span>
                    <span className={`min-w-0 flex-1 ${done ? 'text-slate-500 line-through' : ''}`}>{f.title}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </section>
      )}

      {plan.trackers.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">Trackers</h2>
          <ul className="space-y-2">
            {summary.trackers.map((ts) => (
              <TrackerRow
                key={ts.tracker.id}
                ts={ts}
                week={week}
                readOnly={readOnly}
                energyPromptId={energyPromptId}
                setEnergyPromptId={setEnergyPromptId}
                onLogged={(entry) =>
                  trigger(`+1 ${ts.tracker.label}`, () => removeTrackerEntry(entry.id))
                }
                onRemove={(entry) => {
                  if (energyPromptId === entry.id) setEnergyPromptId(null)
                  void removeTrackerEntry(entry.id)
                  trigger(`Removed ${ts.tracker.label}`, () => restoreEntry(entry))
                }}
              />
            ))}
          </ul>
        </section>
      )}

      {plan.rules.length > 0 && (
        <section className="mb-6">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-800/50">
            <button
              type="button"
              onClick={() => setRulesOpen((o) => !o)}
              aria-expanded={rulesOpen}
              className="flex min-h-12 w-full items-center justify-between px-4 text-left text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              <span>📜 Rules</span>
              <span aria-hidden>{rulesOpen ? '▾' : '▸'}</span>
            </button>
            {rulesOpen && (
              <ul className="space-y-1 border-t border-slate-200 px-4 py-3 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-300">
                {plan.rules.map((r, i) => (
                  <li key={i}>• {r}</li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}

      {checkin && (
        <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
          📅 {checkin.label}{' '}
          {checkin.daysLeft <= 0 ? 'today' : checkin.daysLeft === 1 ? 'tomorrow' : `in ${checkin.daysLeft} days`}
        </p>
      )}

      {plan.sundayCheck.length > 0 && (
        <section className="mb-6">
          {readOnly ? (
            <>
              <h2 className="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">Sunday check</h2>
              <Card className="space-y-2 text-sm">
                {plan.sundayCheck.map((q) => (
                  <div key={q.id} className="flex items-center justify-between gap-3">
                    <span className="text-slate-600 dark:text-slate-300">{q.label}</span>
                    <span className="font-medium text-slate-800 dark:text-slate-100">
                      {describeAnswer(q, summary.answers.get(q.id) ?? null)}
                    </span>
                  </div>
                ))}
              </Card>
            </>
          ) : sundayOpen ? (
            <>
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-sm font-medium text-slate-500 dark:text-slate-400">Sunday check</h2>
                {!isWeekendToday && (
                  <Button variant="ghost" onClick={() => setSundayOpen(false)}>
                    Hide
                  </Button>
                )}
              </div>
              <Card className="space-y-4">
                {plan.sundayCheck.map((q) => (
                  <SundayQuestion key={q.id} week={week} question={q} value={summary.answers.get(q.id) ?? null} />
                ))}
              </Card>
            </>
          ) : (
            <Button variant="ghost" onClick={() => setSundayOpen(true)}>
              🗓️ Sunday check
            </Button>
          )}
        </section>
      )}

      {!readOnly && plan.tasks.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">Things</h2>
          <Card className="space-y-3 text-sm">
            {unsent.length > 0 ? (
              <Button onClick={() => void sendAll()}>
                Send {unsent.length} task{unsent.length === 1 ? '' : 's'} to Things
              </Button>
            ) : (
              <p className="text-slate-500 dark:text-slate-400">All tasks sent.</p>
            )}
            {sent.length > 0 && (
              <div className="space-y-2 border-t border-slate-200 pt-3 dark:border-slate-800">
                <ul className="space-y-1.5">
                  {sent.map((t) => (
                    <li key={t.id} className="flex items-center gap-2">
                      <button
                        type="button"
                        role="checkbox"
                        aria-checked={selectedTaskIds.has(t.id)}
                        aria-label={`Select ${t.title}`}
                        onClick={() => toggleSelected(t.id)}
                        className={`flex size-10 shrink-0 items-center justify-center rounded-lg border text-sm ${
                          selectedTaskIds.has(t.id)
                            ? 'border-indigo-500 bg-indigo-500 text-white'
                            : 'border-slate-300 dark:border-slate-700'
                        }`}
                      >
                        {selectedTaskIds.has(t.id) && '✓'}
                      </button>
                      <span className="min-w-0 flex-1 truncate">{t.title}</span>
                    </li>
                  ))}
                </ul>
                <Button variant="ghost" disabled={selectedTaskIds.size === 0} onClick={resendSelected}>
                  Resend selected
                </Button>
              </div>
            )}
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Requires Things → Settings → General → Enable Things URLs.
            </p>
          </Card>
        </section>
      )}

      <section className="mb-6">
        <h2 className="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">Export</h2>
        <Card className="space-y-3 text-sm">
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => void doExport()}>{exportState?.copied ? 'Copied ✓' : '📋 Export week'}</Button>
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <Button variant="ghost" onClick={() => void doShare()}>
                Share
              </Button>
            )}
          </div>
          {exportState && !exportState.copied && (
            <textarea
              readOnly
              value={exportState.text}
              rows={6}
              onFocus={(e) => e.target.select()}
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-800"
            />
          )}
        </Card>
      </section>

      {!readOnly && pending && <Snackbar label={pending.label} onUndo={confirmUndo} />}
    </div>
  )
}

// --- Trackers -------------------------------------------------------------

function TrackerRow({
  ts,
  week,
  readOnly,
  energyPromptId,
  setEnergyPromptId,
  onLogged,
  onRemove,
}: {
  ts: TrackerSummary
  week: string
  readOnly: boolean
  energyPromptId: string | null
  setEnergyPromptId: (id: string | null) => void
  onLogged: (entry: LifeTrackerEntry) => void
  onRemove: (entry: LifeTrackerEntry) => void
}) {
  const { tracker, total, perDay, atMax, entries } = ts
  const [showEntries, setShowEntries] = useState(false)
  const goal = tracker.target !== null ? `${total} / ${tracker.target}` : tracker.max !== null ? `${total} / ${tracker.max}` : `${total}`
  const activeEntry = energyPromptId ? entries.find((e) => e.id === energyPromptId) : undefined

  async function logOne() {
    const entry = await logTracker(week, tracker.id, { day: dayKey(new Date()) })
    onLogged(entry)
    if (tracker.energy) setEnergyPromptId(entry.id)
  }

  return (
    <li>
      <Card className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="text-xl" aria-hidden>
            {tracker.emoji}
          </span>
          <span className="min-w-0 flex-1 truncate font-medium">{tracker.label}</span>
          <span className="shrink-0 text-sm text-slate-500 dark:text-slate-400">{goal}</span>
          {!readOnly && (
            <Button
              variant="ghost"
              onClick={() => void logOne()}
              aria-label={`+1 ${tracker.label}`}
              className="min-w-10 shrink-0 px-0"
            >
              +1
            </Button>
          )}
        </div>
        <div className="flex gap-1.5">
          {DAY_LABELS.map((label, i) => {
            const count = perDay[i] ?? 0
            return (
              <span
                key={i}
                className={`flex h-7 flex-1 items-center justify-center rounded text-[11px] font-medium ${
                  count > 0
                    ? 'bg-emerald-400/20 text-emerald-700 dark:text-emerald-300'
                    : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600'
                }`}
              >
                {count > 0 ? count : label}
              </span>
            )
          })}
        </div>
        {atMax && <p className="text-xs text-amber-700 dark:text-amber-400">⚠️ Reached the max for this week</p>}
        {!readOnly && activeEntry && <EnergyPicker entry={activeEntry} onDone={() => setEnergyPromptId(null)} />}
        {/* Every logged entry stays editable: fix its energy or delete it
            (with undo). The +1 undo alone only covered the last few seconds. */}
        {!readOnly && entries.length > 0 && (
          <div>
            <button
              type="button"
              onClick={() => setShowEntries((v) => !v)}
              aria-expanded={showEntries}
              className="flex min-h-10 items-center text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            >
              {showEntries ? '▾' : '▸'} {entries.length} logged · edit
            </button>
            {showEntries && (
              <ul className="divide-y divide-slate-200 dark:divide-slate-800">
                {entries.map((e) => (
                  <li key={e.id} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => tracker.energy && setEnergyPromptId(energyPromptId === e.id ? null : e.id)}
                      disabled={!tracker.energy}
                      aria-pressed={tracker.energy ? energyPromptId === e.id : undefined}
                      className="flex min-h-10 min-w-0 flex-1 items-center gap-2 text-left text-sm"
                    >
                      <span className="w-10 shrink-0 font-medium capitalize">{weekdayShort(e.day)}</span>
                      <span className="truncate text-slate-500 dark:text-slate-400">
                        {tracker.energy ? describeEnergy(e) : 'logged'}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemove(e)}
                      aria-label={`Delete ${tracker.label} on ${e.day}`}
                      className="flex size-10 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </Card>
    </li>
  )
}

function weekdayShort(day: string): string {
  return parseDayKey(day).toLocaleDateString(undefined, { weekday: 'short' })
}

function describeEnergy(e: LifeTrackerEntry): string {
  const { energyBefore: b, energyAfter: a } = e.value
  if (b === undefined && a === undefined) return 'energy not set · tap to add'
  return `energy ${b ?? '–'} → ${a ?? '–'}`
}

function EnergyPicker({ entry, onDone }: { entry: LifeTrackerEntry; onDone: () => void }) {
  return (
    <div className="space-y-2 border-t border-slate-200 pt-2 dark:border-slate-800">
      <EnergyScale
        label="Energy before"
        value={entry.value.energyBefore}
        onPick={(n) => void setTrackerEnergy(entry, { energyBefore: n })}
      />
      <EnergyScale
        label="Energy after"
        value={entry.value.energyAfter}
        onPick={(n) => void setTrackerEnergy(entry, { energyAfter: n })}
      />
      <div className="flex justify-end">
        <Button variant="ghost" onClick={onDone}>
          Done
        </Button>
      </div>
    </div>
  )
}

function EnergyScale({
  label,
  value,
  onPick,
}: {
  label?: string
  value: number | undefined
  onPick: (n: number) => void
}) {
  return (
    <div className="flex items-center gap-2">
      {label && <span className="w-28 shrink-0 text-xs text-slate-500 dark:text-slate-400">{label}</span>}
      <div className="flex gap-1">
        {SCALE5.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onPick(n)}
            aria-pressed={value === n}
            className={`flex size-10 items-center justify-center rounded-lg border text-sm font-medium transition-colors ${
              value === n
                ? 'border-indigo-500 bg-indigo-500 text-white'
                : 'border-slate-300 bg-white text-slate-600 hover:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  )
}

// --- Sunday check -----------------------------------------------------------

function describeAnswer(question: LifeQuestion, answer: LifeAnswer): string {
  if (answer === null) return '—'
  if (typeof answer === 'boolean') return answer ? 'Yes' : 'No'
  if (question.type === 'scale5') return `${answer}/5`
  return String(answer)
}

function SundayQuestion({ week, question, value }: { week: string; question: LifeQuestion; value: LifeAnswer }) {
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
          defaultValue={typeof value === 'number' ? value : ''}
          onBlur={(e) => {
            const raw = e.target.value.trim()
            void save(raw === '' ? null : Number(raw))
          }}
          className="min-h-10 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm focus:border-indigo-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
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
      {question.type === 'text' && (
        <textarea
          defaultValue={typeof value === 'string' ? value : ''}
          onBlur={(e) => void save(e.target.value)}
          rows={2}
          maxLength={2000}
          className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm focus:border-indigo-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
        />
      )}
      {question.type === 'scale5' && <EnergyScale label="" value={typeof value === 'number' ? value : undefined} onPick={(n) => void save(value === n ? null : n)} />}
      {error && <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{error}</p>}
    </div>
  )
}
