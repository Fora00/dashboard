import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { Link, useSearchParams } from 'react-router-dom'
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
  setCheckin,
  setSundayAnswer,
  setTrackerEnergy,
  sync,
  toggleFocus,
} from '../../lib/lifeSync'
import {
  addDays,
  buildExportMarkdown,
  buildThingsUrl,
  canReturnFromThings,
  dayKey,
  isIosLike,
  LIFE_CAPS,
  lifeReturnUrl,
  parseDayKey,
  summarizeWeek,
  validateAnswer,
  weekDays,
  weekKey,
  type CheckinStatus,
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

// --- Collapsible sections (per-device UI preference, guarded localStorage) --
// Every section except Rules starts open; Rules keeps its pre-existing
// default of closed. Sunday check is special: its default depends on the day
// of week (open on Sat/Sun), so only an explicit choice made THIS week
// (sundayWeek matches the current week key) overrides that default — next
// week it falls back to the day-of-week default again. Read-only history
// pages never read or write this: they always render fully expanded (see
// CollapsibleSection's readOnly branch).

const SECTIONS_KEY = 'dashboard:life-sections'

type SectionId = 'focus' | 'trackers' | 'rules' | 'checkins' | 'things' | 'export'

interface SectionsState {
  focus: boolean
  trackers: boolean
  rules: boolean
  checkins: boolean
  things: boolean
  export: boolean
  sundayWeek: string | null
  sundayOpen: boolean
}

const DEFAULT_SECTIONS: SectionsState = {
  focus: true,
  trackers: true,
  rules: false,
  checkins: true,
  things: true,
  export: true,
  sundayWeek: null,
  sundayOpen: false,
}

function isBool(v: unknown): v is boolean {
  return typeof v === 'boolean'
}

function sanitizeSections(raw: unknown): SectionsState {
  if (typeof raw !== 'object' || raw === null) return DEFAULT_SECTIONS
  const r = raw as Record<string, unknown>
  return {
    focus: isBool(r.focus) ? r.focus : DEFAULT_SECTIONS.focus,
    trackers: isBool(r.trackers) ? r.trackers : DEFAULT_SECTIONS.trackers,
    rules: isBool(r.rules) ? r.rules : DEFAULT_SECTIONS.rules,
    checkins: isBool(r.checkins) ? r.checkins : DEFAULT_SECTIONS.checkins,
    things: isBool(r.things) ? r.things : DEFAULT_SECTIONS.things,
    export: isBool(r.export) ? r.export : DEFAULT_SECTIONS.export,
    sundayWeek: typeof r.sundayWeek === 'string' ? r.sundayWeek : null,
    sundayOpen: isBool(r.sundayOpen) ? r.sundayOpen : DEFAULT_SECTIONS.sundayOpen,
  }
}

// Safari private mode / "block all cookies" makes localStorage THROW rather
// than return null (see src/projects/home/Home.tsx's readStoredOrder) — every
// access here is guarded so a blocked store never breaks the page.
function readStoredSections(): SectionsState {
  try {
    const raw = localStorage.getItem(SECTIONS_KEY)
    if (!raw) return DEFAULT_SECTIONS
    return sanitizeSections(JSON.parse(raw))
  } catch {
    return DEFAULT_SECTIONS
  }
}

function storeSections(state: SectionsState): void {
  try {
    localStorage.setItem(SECTIONS_KEY, JSON.stringify(state))
  } catch {
    // Storage blocked — the choice just won't survive a reload this session.
  }
}

/** Header button (▸/▾ + title + collapsed summary) wrapping a section's
 * content. In read-only history, always expanded with a plain header and no
 * persistence — see the module comment above. */
function CollapsibleSection({
  title,
  summary,
  open,
  onToggle,
  readOnly,
  children,
}: {
  title: string
  summary?: string
  open: boolean
  onToggle: () => void
  readOnly: boolean
  children: ReactNode
}) {
  if (readOnly) {
    return (
      <section className="mb-6">
        <h2 className="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">{title}</h2>
        {children}
      </section>
    )
  }
  return (
    <section className="mb-6">
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-800/50">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          className="flex min-h-12 w-full items-center justify-between gap-3 px-4 text-left text-sm font-medium text-slate-700 dark:text-slate-200"
        >
          <span className="truncate">{title}</span>
          <span className="flex shrink-0 items-center gap-2">
            {!open && summary && (
              <span className="truncate text-xs font-normal text-slate-500 dark:text-slate-400">{summary}</span>
            )}
            <span aria-hidden>{open ? '▾' : '▸'}</span>
          </span>
        </button>
        {open && <div className="border-t border-slate-200 px-4 py-3 dark:border-slate-800">{children}</div>}
      </div>
    </section>
  )
}

type View = { tab: 'week' } | { tab: 'history' } | { tab: 'past'; week: string }

export function Life() {
  const week = weekKey()
  const [view, setView] = useState<View>({ tab: 'week' })
  const [searchParams, setSearchParams] = useSearchParams()

  // Things appends `?x-things-ids=<JSON array>` to the xSuccess return URL
  // (see lifeReturnUrl in model.ts) — strip it once so the address bar stays
  // clean. `replace: true` so it doesn't leave an extra history entry.
  useEffect(() => {
    if (!searchParams.has('x-things-ids')) return
    const next = new URLSearchParams(searchParams)
    next.delete('x-things-ids')
    setSearchParams(next, { replace: true })
  }, [searchParams, setSearchParams])

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
    <PageHeader emoji="🧭" title="Life" subtitle="This week: focus, habits, Sunday check. Owner only.">
      <div className="flex flex-wrap gap-2">
        <Link to="/life/import">
          <Button variant="ghost">Import</Button>
        </Link>
        <Link to={`/life/edit?week=${week}`}>
          <Button variant="ghost">Edit week</Button>
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
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <Link to="/life/import">
            <Button>Import week</Button>
          </Link>
          <Link to="/life/edit">
            <Button variant="ghost">Create by hand</Button>
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
  const [energyPromptId, setEnergyPromptId] = useState<string | null>(null)
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(new Set())
  const [exportState, setExportState] = useState<{ text: string; copied: boolean } | null>(null)
  const [sundayEditing, setSundayEditing] = useState(false)
  // Questions linked to a habit answer themselves; only the rest need typing.
  const manualQuestions = plan.sundayCheck.filter((q) => !summary.autoAnswered.has(q.id)).length
  const manualAnswered = [...summary.answers.keys()].filter((id) => !summary.autoAnswered.has(id)).length

  // On Monday, yesterday belongs to last week: habits can still mark last
  // Sunday, written to last week's entries under last week's tracker (same
  // id, e.g. via "Copy last week", else same label).
  const isMonday = !readOnly && dayKey(new Date()) === week
  const prevWeek = addDays(week, -7)
  const prev = useLiveQuery(async () => {
    if (!isMonday) return null
    const [row, prevEntries] = await Promise.all([
      db.lifeWeeks.get(prevWeek),
      db.lifeEntries.where('[week+kind]').equals([prevWeek, 'tracker']).toArray(),
    ])
    return row ? { plan: row.plan, entries: prevEntries as LifeTrackerEntry[] } : null
  }, [isMonday, prevWeek])

  function lastSundayFor(trackerId: string, label: string): LastSunday | null {
    if (!prev) return null
    const match =
      prev.plan.trackers.find((t) => t.id === trackerId) ??
      prev.plan.trackers.find((t) => t.label.trim().toLowerCase() === label.trim().toLowerCase())
    if (!match) return null
    const day = addDays(week, -1)
    return {
      week: prevWeek,
      trackerId: match.id,
      day,
      entries: prev.entries.filter((e) => e.ref === match.id && e.day === day),
    }
  }

  // Read-only history never persists or reads localStorage — see the module
  // comment above CollapsibleSection.
  const [sections, setSections] = useState<SectionsState>(() => (readOnly ? DEFAULT_SECTIONS : readStoredSections()))

  function toggleSection(id: SectionId) {
    setSections((s) => {
      const next = { ...s, [id]: !s[id] }
      if (!readOnly) storeSections(next)
      return next
    })
  }

  const dow = new Date().getDay()
  const isWeekendToday = dow === 0 || dow === 6
  // Only an explicit choice made THIS week overrides the day-of-week default.
  const sundayOpen = readOnly
    ? true
    : sections.sundayWeek === week
      ? sections.sundayOpen
      : isWeekendToday

  function toggleSunday() {
    setSections((s) => {
      const currentOpen = s.sundayWeek === week ? s.sundayOpen : isWeekendToday
      const next = { ...s, sundayWeek: week, sundayOpen: !currentOpen }
      storeSections(next)
      return next
    })
  }

  const unsent = plan.tasks.filter((t) => !summary.sentTaskIds.has(t.id))
  const sent = plan.tasks.filter((t) => summary.sentTaskIds.has(t.id))
  const lastSent = useMemo(() => lastSentInfo(entries), [entries])

  function toggleSelected(id: string) {
    setSelectedTaskIds((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  // x-success only works on the Mac: an https link opened from another app
  // on iOS goes to Safari, never back into the installed PWA (see
  // canReturnFromThings in model.ts).
  const thingsOpts = canReturnFromThings() ? { xSuccess: lifeReturnUrl() } : {}

  // Mark sent BEFORE opening Things: on iOS the PWA can be suspended the
  // moment Things opens, so a write after the navigation may never land and
  // a second tap would duplicate every to-do.
  async function sendAll() {
    if (unsent.length === 0) return
    await markTasksSent(week, unsent.map((t) => t.id), true)
    window.location.href = buildThingsUrl(unsent, thingsOpts)
  }

  // Records the resend time too (before navigating, same reason as above):
  // the Things status check finds each batch by its send time.
  async function resendSelected() {
    const tasks = plan.tasks.filter((t) => selectedTaskIds.has(t.id))
    if (tasks.length === 0) return
    await markTasksSent(week, tasks.map((t) => t.id), true)
    setSelectedTaskIds(new Set())
    window.location.href = buildThingsUrl(tasks, thingsOpts)
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
        <CollapsibleSection
          title="Focus"
          summary={`${summary.focusDone.size}/${plan.focus.length}`}
          open={sections.focus}
          onToggle={() => toggleSection('focus')}
          readOnly={readOnly}
        >
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
        </CollapsibleSection>
      )}

      {plan.trackers.length > 0 && (
        <CollapsibleSection
          title="Habits"
          summary={`Habits · ${trackersSummary(summary.trackers)}`}
          open={sections.trackers}
          onToggle={() => toggleSection('trackers')}
          readOnly={readOnly}
        >
          <ul className="space-y-2">
            {summary.trackers.map((ts) => (
              <TrackerRow
                key={ts.tracker.id}
                ts={ts}
                week={week}
                readOnly={readOnly}
                energyPromptId={energyPromptId}
                setEnergyPromptId={setEnergyPromptId}
                lastSunday={lastSundayFor(ts.tracker.id, ts.tracker.label)}
                onLogged={(entry) =>
                  trigger(`✓ ${ts.tracker.label}`, () => removeTrackerEntry(entry.id))
                }
                onRemove={(entry) => {
                  if (energyPromptId === entry.id) setEnergyPromptId(null)
                  void removeTrackerEntry(entry.id)
                  trigger(`Removed ${ts.tracker.label}`, () => restoreEntry(entry))
                }}
              />
            ))}
          </ul>
        </CollapsibleSection>
      )}

      {plan.rules.length > 0 && (
        <CollapsibleSection
          title="📜 Rules"
          summary={`${plan.rules.length} rule${plan.rules.length === 1 ? '' : 's'}`}
          open={sections.rules}
          onToggle={() => toggleSection('rules')}
          readOnly={readOnly}
        >
          <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
            {plan.rules.map((r, i) => (
              <li key={i}>• {r}</li>
            ))}
          </ul>
        </CollapsibleSection>
      )}

      {summary.checkins.length > 0 && (
        <CollapsibleSection
          title="Check-ins"
          summary={`Check-ins · ${summary.checkins.filter((c) => c.done).length}/${summary.checkins.length} done`}
          open={sections.checkins}
          onToggle={() => toggleSection('checkins')}
          readOnly={readOnly}
        >
          <ul className="space-y-2">
            {summary.checkins.map((cs) => (
              <CheckinRow key={cs.checkin.id} week={week} status={cs} readOnly={readOnly} />
            ))}
          </ul>
        </CollapsibleSection>
      )}

      {plan.sundayCheck.length > 0 && (
        <CollapsibleSection
          title="🗓️ Sunday check"
          summary={`${summary.answers.size}/${plan.sundayCheck.length} answered`}
          open={sundayOpen}
          onToggle={toggleSunday}
          readOnly={readOnly}
        >
          <WeekRecap
            focus={[summary.focusDone.size, plan.focus.length]}
            trackers={summary.trackers}
            checkins={[summary.checkins.filter((c) => c.done).length, summary.checkins.length]}
            tasks={[sent.length, plan.tasks.length]}
          />
          {readOnly ? (
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
          ) : sundayEditing ? (
            <Card>
              <div className="divide-y divide-slate-200 dark:divide-slate-800">
                {plan.sundayCheck.map((q) => (
                  <div key={q.id} className="py-3 first:pt-0">
                    {summary.autoAnswered.has(q.id) ? (
                      <AutoAnswer question={q} value={summary.answers.get(q.id) ?? null} trackers={summary.trackers} />
                    ) : (
                      <SundayQuestion week={week} question={q} value={summary.answers.get(q.id) ?? null} />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-end border-t border-slate-200 pt-3 dark:border-slate-800">
                <Button onClick={() => setSundayEditing(false)}>Done</Button>
              </div>
            </Card>
          ) : (
            // Compact by default: just the answers on one line, form on demand.
            <Card className="space-y-3">
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {plan.sundayCheck.map((q, i) => (
                  <span key={q.id}>
                    {i > 0 && <span className="text-slate-300 dark:text-slate-600"> · </span>}
                    <span title={q.label}>{shortAnswer(q, summary.answers.get(q.id) ?? null)}</span>
                  </span>
                ))}
              </p>
              {manualQuestions > 0 && (
                <Button variant={manualAnswered === 0 ? 'primary' : 'ghost'} onClick={() => setSundayEditing(true)}>
                  {manualAnswered === 0 ? 'Answer' : 'Edit answers'}
                </Button>
              )}
            </Card>
          )}
        </CollapsibleSection>
      )}

      {!readOnly && plan.tasks.length > 0 && (
        <CollapsibleSection
          title="Things"
          summary={`Things · ${sent.length} of ${plan.tasks.length} sent`}
          open={sections.things}
          onToggle={() => toggleSection('things')}
          readOnly={false}
        >
          <Card className="space-y-3 text-sm">
            {unsent.length > 0 ? (
              <>
                <Button onClick={() => void sendAll()}>
                  Send {unsent.length} task{unsent.length === 1 ? '' : 's'} to Things
                </Button>
                {isIosLike() && (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    After Things opens, tap ◀ Dashboard at the top-left to come back.
                  </p>
                )}
                <ul className="space-y-1 border-t border-slate-200 pt-2 dark:border-slate-800">
                  {unsent.map((t) => (
                    <li key={t.id} className="flex items-center justify-between gap-2">
                      <span className="min-w-0 flex-1 truncate">{t.title}</span>
                      <span className="shrink-0 text-xs text-slate-400 dark:text-slate-500">{t.when ?? '—'}</span>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="text-slate-500 dark:text-slate-400">All tasks sent.</p>
            )}
            {lastSent && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Last sent {formatLastSent(lastSent.at)} · {lastSent.count} task{lastSent.count === 1 ? '' : 's'}
              </p>
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
                      <button
                        type="button"
                        onClick={() => {
                          window.location.href = `things:///search?query=${encodeURIComponent(t.title)}`
                        }}
                        className="flex min-h-10 min-w-0 flex-1 items-center justify-between gap-2 rounded-lg px-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <span className="min-w-0 flex-1 truncate">{t.title}</span>
                        <span aria-hidden className="shrink-0 text-slate-400">
                          ↗
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
                <Button variant="ghost" disabled={selectedTaskIds.size === 0} onClick={() => void resendSelected()}>
                  Resend selected
                </Button>
              </div>
            )}
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Requires Things → Settings → General → Enable Things URLs.
            </p>
          </Card>
        </CollapsibleSection>
      )}

      <CollapsibleSection
        title="Export"
        open={sections.export}
        onToggle={() => toggleSection('export')}
        readOnly={readOnly}
      >
        <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">
          Copies a summary of this week — focus, trackers with energy, Sunday answers, check-ins, tasks — to paste
          into /settimana on your Mac.
        </p>
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
      </CollapsibleSection>

      {!readOnly && pending && <Snackbar label={pending.label} onUndo={confirmUndo} />}
    </div>
  )
}

// --- Trackers summary / Things "Last sent" ---------------------------------

function trackersSummary(trackers: TrackerSummary[]): string {
  if (trackers.length === 0) return '0/0'
  const onTrack = trackers.filter((t) => (t.tracker.target !== null ? t.reachedTarget : t.total > 0)).length
  return `${onTrack}/${trackers.length}`
}

interface LastSentInfo {
  at: number
  count: number
}

/** The latest timestamp across every sent entry's `value.sends`, plus how
 * many tasks share that exact timestamp (one send/resend call stamps every
 * task in the batch with the same `Date.now()`, so this counts the batch). */
function lastSentInfo(entries: readonly LifeEntry[]): LastSentInfo | null {
  let maxAt = 0
  for (const e of entries) {
    if (e.kind !== 'sent') continue
    for (const t of e.value.sends ?? []) {
      if (t > maxAt) maxAt = t
    }
  }
  if (maxAt === 0) return null
  let count = 0
  for (const e of entries) {
    if (e.kind !== 'sent') continue
    if ((e.value.sends ?? []).includes(maxAt)) count++
  }
  return { at: maxAt, count }
}

function formatLastSent(at: number): string {
  const d = new Date(at)
  const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  if (dayKey(d) === dayKey(new Date())) return time
  return `${d.toLocaleDateString([], { month: 'short', day: 'numeric' })}, ${time}`
}

/** "today" / "tomorrow" / "in N days" / "N days ago" from summarizeWeek's daysLeft. */
function relativeCheckinDate(daysLeft: number): string {
  if (daysLeft === 0) return 'today'
  if (daysLeft === 1) return 'tomorrow'
  if (daysLeft === -1) return '1 day ago'
  if (daysLeft > 0) return `in ${daysLeft} days`
  return `${-daysLeft} days ago`
}

// --- Check-ins ---------------------------------------------------------------

function CheckinRow({ week, status, readOnly }: { week: string; status: CheckinStatus; readOnly: boolean }) {
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

// --- Trackers -------------------------------------------------------------

function TrackerRow({
  ts,
  week,
  readOnly,
  energyPromptId,
  setEnergyPromptId,
  lastSunday,
  onLogged,
  onRemove,
}: {
  ts: TrackerSummary
  week: string
  readOnly: boolean
  energyPromptId: string | null
  setEnergyPromptId: (id: string | null) => void
  lastSunday: LastSunday | null
  onLogged: (entry: LifeTrackerEntry) => void
  onRemove: (entry: LifeTrackerEntry) => void
}) {
  const { tracker, total, perDay, atMax, entries } = ts
  // The details (day strip, energy, per-entry edit) stay one tap away but are
  // hidden by default: the row itself is a single "done today" toggle.
  const [showDetails, setShowDetails] = useState(false)
  const limit = tracker.target ?? tracker.max
  const goal = limit !== null ? `${total}/${limit}` : total > 0 ? `${total}` : ''
  const activeEntry = energyPromptId ? entries.find((e) => e.id === energyPromptId) : undefined
  const today = dayKey(new Date())
  const doneToday = entries.some((e) => e.day === today)
  const days = weekDays(week)

  // One tap per day: logs the day, or removes its latest entry (with undo).
  // The row toggles today; the hidden day strip toggles any past day this week.
  async function toggleDay(day: string) {
    const dayEntries = entries.filter((e) => e.day === day)
    const last = dayEntries[dayEntries.length - 1]
    if (last) {
      onRemove(last)
      return
    }
    const entry = await logTracker(week, tracker.id, { day })
    onLogged(entry)
  }

  async function toggleLastSunday(ls: LastSunday) {
    const last = ls.entries[ls.entries.length - 1]
    if (last) {
      onRemove(last)
      return
    }
    const entry = await logTracker(ls.week, ls.trackerId, { day: ls.day })
    onLogged(entry)
  }

  return (
    <li>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={readOnly}
          aria-pressed={doneToday}
          onClick={() => void toggleDay(today)}
          className={`flex min-h-14 min-w-0 flex-1 items-center gap-3 rounded-xl border px-4 py-2 text-left text-base font-medium transition-colors ${
            readOnly ? '' : 'active:bg-slate-100 dark:active:bg-slate-800'
          } ${
            doneToday
              ? 'border-emerald-400/60 bg-emerald-400/10'
              : 'border-slate-200 bg-white hover:border-slate-400 dark:border-slate-800 dark:bg-slate-800/50 dark:hover:border-slate-600'
          }`}
        >
          {!readOnly && (
            <span
              className={`flex size-7 shrink-0 items-center justify-center rounded-full border text-sm ${
                doneToday ? 'border-emerald-400 bg-emerald-400 text-slate-900' : 'border-slate-400 dark:border-slate-500'
              }`}
            >
              {doneToday && '✓'}
            </span>
          )}
          {tracker.emoji && (
            <span className="text-xl" aria-hidden>
              {tracker.emoji}
            </span>
          )}
          <span className="min-w-0 flex-1 truncate">{tracker.label}</span>
          {goal && (
            <span
              className={`shrink-0 text-xs font-normal ${atMax ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400 dark:text-slate-500'}`}
            >
              {goal}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setShowDetails((v) => !v)}
          aria-expanded={showDetails}
          aria-label={`${showDetails ? 'Hide' : 'Show'} ${tracker.label} details`}
          className="flex size-10 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
        >
          {showDetails ? '▾' : '▸'}
        </button>
      </div>
      {showDetails && (
        <div className="mt-2 space-y-2 pl-1">
          <div className="flex gap-1.5">
            {lastSunday && (
              <button
                type="button"
                onClick={() => void toggleLastSunday(lastSunday)}
                aria-pressed={lastSunday.entries.length > 0}
                aria-label={`${tracker.label} last Sunday (${lastSunday.day})`}
                className={`mr-1.5 flex h-10 flex-1 items-center justify-center rounded border border-dashed text-xs font-medium ${
                  lastSunday.entries.length > 0
                    ? 'border-emerald-400/60 bg-emerald-400/20 text-emerald-700 dark:text-emerald-300'
                    : 'border-slate-300 text-slate-400 dark:border-slate-700 dark:text-slate-500'
                }`}
              >
                {lastSunday.entries.length > 0 ? lastSunday.entries.length : 'S'}
              </button>
            )}
            {DAY_LABELS.map((label, i) => {
              const count = perDay[i] ?? 0
              const day = days[i] ?? ''
              const future = day > today
              return (
                <button
                  key={i}
                  type="button"
                  disabled={readOnly || future}
                  onClick={() => void toggleDay(day)}
                  aria-pressed={count > 0}
                  aria-label={`${tracker.label} on ${day}`}
                  className={`flex h-10 flex-1 items-center justify-center rounded text-xs font-medium ${
                    count > 0
                      ? 'bg-emerald-400/20 text-emerald-700 dark:text-emerald-300'
                      : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600'
                  } ${future ? 'opacity-40' : ''} ${day === today ? 'ring-1 ring-slate-300 dark:ring-slate-600' : ''}`}
                >
                  {count > 0 ? count : label}
                </button>
              )
            })}
          </div>
          {!readOnly && (
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Tap a day to mark or unmark it.{lastSunday && ' The dashed one is last Sunday.'}
            </p>
          )}
          {atMax && <p className="text-xs text-amber-700 dark:text-amber-400">⚠️ Reached the max for this week</p>}
          {!readOnly && activeEntry && <EnergyPicker entry={activeEntry} onDone={() => setEnergyPromptId(null)} />}
          {/* Every logged entry stays editable: fix its energy or delete it
              (with undo). Past days are fixed here, not from the row. */}
          {!readOnly && entries.length > 0 && (
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
    </li>
  )
}

interface LastSunday {
  week: string
  trackerId: string
  day: string
  entries: LifeTrackerEntry[]
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

/** What the week actually held, shown above the Sunday questions so the
 * answers can lean on it. Empty parts of the plan are left out. */
function WeekRecap({
  focus,
  trackers,
  checkins,
  tasks,
}: {
  focus: [number, number]
  trackers: TrackerSummary[]
  checkins: [number, number]
  tasks: [number, number]
}) {
  const parts: { label: string; value: string; full: boolean }[] = []
  if (focus[1] > 0) parts.push({ label: 'Focus', value: `${focus[0]}/${focus[1]}`, full: focus[0] >= focus[1] })
  if (checkins[1] > 0)
    parts.push({ label: 'Check-ins', value: `${checkins[0]}/${checkins[1]}`, full: checkins[0] >= checkins[1] })
  if (tasks[1] > 0) parts.push({ label: 'Things sent', value: `${tasks[0]}/${tasks[1]}`, full: tasks[0] >= tasks[1] })
  if (parts.length === 0 && trackers.length === 0) return null

  return (
    <div className="mb-3 space-y-2 rounded-xl bg-slate-100 px-4 py-3 text-sm dark:bg-slate-800/60">
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">This week</p>
      {parts.length > 0 && (
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {parts.map((p) => (
            <span key={p.label} className="text-slate-600 dark:text-slate-300">
              {p.label}{' '}
              <span className={`font-medium ${p.full ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-800 dark:text-slate-100'}`}>
                {p.value}
              </span>
            </span>
          ))}
        </div>
      )}
      {trackers.length > 0 && (
        <ul className="space-y-0.5">
          {trackers.map(({ tracker, total, reachedTarget, atMax }) => {
            const limit = tracker.target ?? tracker.max
            return (
              <li key={tracker.id} className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <span aria-hidden>{tracker.emoji}</span>
                <span className="min-w-0 flex-1 truncate">{tracker.label}</span>
                <span
                  className={`shrink-0 font-medium ${
                    atMax
                      ? 'text-amber-600 dark:text-amber-400'
                      : reachedTarget
                        ? 'text-emerald-700 dark:text-emerald-300'
                        : 'text-slate-800 dark:text-slate-100'
                  }`}
                >
                  {limit !== null ? `${total}/${limit}` : total}
                  {reachedTarget && ' ✓'}
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

/** A Sunday question answered from its linked habit: shown, never typed. */
function AutoAnswer({
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
          <p className="text-xs text-slate-400 dark:text-slate-500">
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

/** One-line form for the compact summary: text answers are clipped. */
function shortAnswer(question: LifeQuestion, answer: LifeAnswer): string {
  const full = describeAnswer(question, answer)
  return full.length > 24 ? `${full.slice(0, 23)}…` : full
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
