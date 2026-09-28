import { useEffect, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  db,
  type LifePlan,
  type LifeQuestionType,
  type LifeTask,
  type LifeTracker,
} from '../../lib/db'
import { importWeek } from '../../lib/lifeSync'
import { useAuth } from '../../lib/useAuth'
import {
  LIFE_CAPS,
  THINGS_WHEN_KEYWORDS,
  addDays,
  dayKey,
  isMondayKey,
  validatePlan,
  weekKey,
  withCheckinIds,
} from './model'
import { PlanPreview } from './PlanPreview'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { PageHeader } from '../../components/PageHeader'
import { SkeletonList } from '../../components/Skeleton'

// Form-based plan editor (spec: docs/HANDOFF-life.md, ROADMAP "Plan editor,
// 'By hand'"). Builds the same LifePlan shape LifeImport parses from pasted
// JSON, then reuses validatePlan + the shared <PlanPreview> for the
// diff-then-confirm step. Nothing is written until Confirm — validatePlan
// re-checks on save the same way importWeek() does, so this can never write
// an invalid plan.
//
// Ids: every focus/task/tracker/question keeps its existing id on edit
// (never regenerated) and gets a short random one on add — never shown.
// Rules and check-ins have no id in the schema; a local-only key is used
// for React list rendering and is never sent to the plan.

type WhenMode = 'none' | 'date' | 'keyword'
type CapMode = 'target' | 'max'

interface FocusRow {
  id: string
  title: string
}
interface RuleRow {
  key: string
  text: string
}
interface TaskRow {
  id: string
  title: string
  whenMode: WhenMode
  whenDate: string
  whenKeyword: string
  deadline: string
  area: string
  project: string
  tags: string
  notes: string
}
interface TrackerRow {
  id: string
  emoji: string
  label: string
  capMode: CapMode
  capValue: string
  energy: boolean
}
interface QuestionRow {
  id: string
  label: string
  type: LifeQuestionType
}
interface CheckinRow {
  // The check-in's stable id (entries link to it); also the React key.
  id: string
  date: string
  label: string
}

function newId(): string {
  return crypto.randomUUID().slice(0, 8)
}
function newKey(): string {
  return crypto.randomUUID()
}

function taskToRow(t: LifeTask): TaskRow {
  const isKeyword = t.when !== null && (THINGS_WHEN_KEYWORDS as readonly string[]).includes(t.when)
  return {
    id: t.id,
    title: t.title,
    whenMode: t.when === null ? 'none' : isKeyword ? 'keyword' : 'date',
    whenDate: t.when !== null && !isKeyword ? t.when : '',
    whenKeyword: isKeyword ? (t.when as string) : THINGS_WHEN_KEYWORDS[0],
    deadline: t.deadline ?? '',
    area: t.area ?? '',
    project: t.project ?? '',
    tags: t.tags.join(', '),
    notes: t.notes,
  }
}

function trackerToRow(t: LifeTracker): TrackerRow {
  const capMode: CapMode = t.max !== null ? 'max' : 'target'
  const capValue = t.max !== null ? String(t.max) : t.target !== null ? String(t.target) : ''
  return { id: t.id, emoji: t.emoji, label: t.label, capMode, capValue, energy: t.energy }
}

function updateAt<T>(list: T[], i: number, patch: Partial<T>): T[] {
  return list.map((item, idx) => (idx === i ? { ...item, ...patch } : item))
}
function removeAt<T>(list: T[], i: number): T[] {
  return list.filter((_, idx) => idx !== i)
}

const inputClass =
  'min-h-10 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800'
const textareaClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800'
const removeBtnClass =
  'flex size-10 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400'

const QUESTION_TYPE_OPTIONS: { value: LifeQuestionType; label: string }[] = [
  { value: 'number', label: 'Number' },
  { value: 'boolean', label: 'Yes / No' },
  { value: 'text', label: 'Text' },
  { value: 'scale5', label: '1–5' },
]

export function LifeEditor() {
  const navigate = useNavigate()
  const session = useAuth()
  const [searchParams] = useSearchParams()
  const weekParam = searchParams.get('week')
  const week = weekParam ?? weekKey()
  const validWeek = isMondayKey(week)
  const prevWeek = addDays(week, -7)

  const existing = useLiveQuery(
    () => (validWeek ? db.lifeWeeks.get(week).then((w) => w ?? null) : null),
    [week, validWeek],
  )
  // Only worth loading once we know this week is blank.
  const previous = useLiveQuery(
    () => (validWeek && existing === null ? db.lifeWeeks.get(prevWeek).then((w) => w ?? null) : null),
    [prevWeek, validWeek, existing],
  )

  const [initialized, setInitialized] = useState(false)

  const [focus, setFocus] = useState<FocusRow[]>([])
  const [rules, setRules] = useState<RuleRow[]>([])
  const [tasks, setTasks] = useState<TaskRow[]>([])
  const [trackers, setTrackers] = useState<TrackerRow[]>([])
  const [sundayCheck, setSundayCheck] = useState<QuestionRow[]>([])
  const [checkins, setCheckins] = useState<CheckinRow[]>([])

  const [errors, setErrors] = useState<string[] | null>(null)
  const [previewPlan, setPreviewPlan] = useState<LifePlan | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  // Prefill exactly once, once we know which start state applies (existing
  // plan / blank-with-a-copy-offer / blank). Re-running this on every
  // useLiveQuery tick (e.g. a background sync pull) would clobber in-progress
  // edits, hence the `initialized` guard.
  useEffect(() => {
    if (!validWeek || initialized) return
    if (existing === undefined) return
    if (existing) {
      const plan = existing.plan
      setFocus(plan.focus.map((f) => ({ id: f.id, title: f.title })))
      setRules(plan.rules.map((r) => ({ key: newKey(), text: r })))
      setTasks(plan.tasks.map(taskToRow))
      setTrackers(plan.trackers.map(trackerToRow))
      setSundayCheck(plan.sundayCheck.map((q) => ({ id: q.id, label: q.label, type: q.type })))
      setCheckins(withCheckinIds(plan).checkins.map((c) => ({ id: c.id, date: c.date, label: c.label })))
      setInitialized(true)
      return
    }
    // existing === null: blank start. Still wait for `previous` to resolve
    // so the "Copy last week" offer doesn't flash in after the form renders.
    if (previous === undefined) return
    setInitialized(true)
  }, [validWeek, initialized, existing, previous])

  function copyLastWeek() {
    if (!previous) return
    const plan = previous.plan
    setTrackers(plan.trackers.map(trackerToRow))
    setRules(plan.rules.map((r) => ({ key: newKey(), text: r })))
    setSundayCheck(plan.sundayCheck.map((q) => ({ id: q.id, label: q.label, type: q.type })))
    const today = dayKey(new Date())
    setCheckins(
      withCheckinIds(plan)
        .checkins.filter((c) => c.date >= today)
        .map((c) => ({ id: c.id, date: c.date, label: c.label })),
    )
  }

  function buildRawPlan(): unknown {
    return {
      version: 1,
      week,
      focus: focus.map((f) => ({ id: f.id, title: f.title })),
      rules: rules.map((r) => r.text),
      tasks: tasks.map((t) => ({
        id: t.id,
        title: t.title,
        when: t.whenMode === 'date' ? t.whenDate || null : t.whenMode === 'keyword' ? t.whenKeyword : null,
        deadline: t.deadline || null,
        area: t.area.trim() || null,
        project: t.project.trim() || null,
        tags: t.tags
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        notes: t.notes,
      })),
      trackers: trackers.map((tr) => {
        const n = tr.capValue.trim() === '' ? null : Number(tr.capValue)
        return {
          id: tr.id,
          emoji: tr.emoji,
          label: tr.label,
          target: tr.capMode === 'target' ? n : null,
          max: tr.capMode === 'max' ? n : null,
          energy: tr.energy,
        }
      }),
      sundayCheck: sundayCheck.map((q) => ({ id: q.id, label: q.label, type: q.type })),
      checkins: checkins.map((c) => ({ id: c.id, date: c.date, label: c.label })),
    }
  }

  function handleSave() {
    const result = validatePlan(buildRawPlan())
    if (!result.ok) {
      setErrors(result.errors)
      setPreviewPlan(null)
      return
    }
    setErrors(null)
    setPreviewPlan(result.plan)
  }

  async function confirm() {
    if (!previewPlan) return
    setSaving(true)
    setSaveError(null)
    try {
      await importWeek(previewPlan)
      navigate('/life')
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : String(err))
    } finally {
      setSaving(false)
    }
  }

  if (!validWeek) {
    return (
      <div>
        <PageHeader emoji="🧭" title="Build a week" subtitle="Create or edit a week's plan by hand." />
        <Card className="text-sm text-rose-600 dark:text-rose-400">
          "{week}" isn't a Monday — the week param must be the Monday of the week (YYYY-MM-DD).
        </Card>
      </div>
    )
  }

  if (!initialized) {
    return (
      <div>
        <PageHeader emoji="🧭" title="Build a week" subtitle={`Week of ${week}`} />
        <SkeletonList rows={4} rowClassName="h-16" />
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        emoji="🧭"
        title={existing ? 'Edit week' : 'Build a week'}
        subtitle={`Week of ${week}`}
      />

      {session === null && (
        <p className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-3.5 py-2 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
          Signed out — this week stays on this device only.
        </p>
      )}

      {previewPlan ? (
        <PlanPreview
          plan={previewPlan}
          existingPlan={existing?.plan ?? null}
          saving={saving}
          saveError={saveError}
          onConfirm={() => void confirm()}
          confirmLabel="Confirm"
          extraActions={
            <Button variant="ghost" onClick={() => setPreviewPlan(null)} disabled={saving}>
              ← Back to edit
            </Button>
          }
        />
      ) : (
        <>
          {!existing && previous && (
            <Card className="mb-4 space-y-2 text-sm">
              <p className="text-slate-600 dark:text-slate-300">
                Last week's plan has trackers, rules and Sunday questions you can start from.
              </p>
              <Button variant="ghost" onClick={copyLastWeek}>
                Copy last week
              </Button>
            </Card>
          )}

          {errors && (
            <Card className="mb-4 space-y-1 text-sm">
              <p className="font-medium text-rose-600 dark:text-rose-400">This isn't a valid week:</p>
              <ul className="list-disc space-y-0.5 pl-5 text-rose-600 dark:text-rose-400">
                {errors.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </Card>
          )}

          <FocusSection focus={focus} setFocus={setFocus} />
          <TrackersSection trackers={trackers} setTrackers={setTrackers} />
          <RulesSection rules={rules} setRules={setRules} />
          <SundaySection sundayCheck={sundayCheck} setSundayCheck={setSundayCheck} />
          <CheckinsSection checkins={checkins} setCheckins={setCheckins} />
          <TasksSection tasks={tasks} setTasks={setTasks} />

          <div className="mt-2 mb-6">
            <Button onClick={handleSave}>Save</Button>
          </div>
        </>
      )}
    </div>
  )
}

// --- Focus --------------------------------------------------------------

function FocusSection({ focus, setFocus }: { focus: FocusRow[]; setFocus: (v: FocusRow[]) => void }) {
  return (
    <section className="mb-6">
      <h2 className="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">Focus</h2>
      <Card className="space-y-2">
        {focus.map((f, i) => (
          <div key={f.id} className="flex items-center gap-2">
            <input
              value={f.title}
              onChange={(e) => setFocus(updateAt(focus, i, { title: e.target.value }))}
              maxLength={LIFE_CAPS.focusTitle}
              placeholder="Focus title…"
              className={inputClass}
            />
            <button
              type="button"
              onClick={() => setFocus(removeAt(focus, i))}
              aria-label="Remove focus item"
              className={removeBtnClass}
            >
              ✕
            </button>
          </div>
        ))}
        {focus.length < LIFE_CAPS.focus && (
          <Button variant="ghost" onClick={() => setFocus([...focus, { id: newId(), title: '' }])}>
            + Add focus
          </Button>
        )}
      </Card>
    </section>
  )
}

// --- Rules ----------------------------------------------------------------

function RulesSection({ rules, setRules }: { rules: RuleRow[]; setRules: (v: RuleRow[]) => void }) {
  return (
    <section className="mb-6">
      <h2 className="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">Rules</h2>
      <Card className="space-y-2">
        {rules.map((r, i) => (
          <div key={r.key} className="flex items-center gap-2">
            <input
              value={r.text}
              onChange={(e) => setRules(updateAt(rules, i, { text: e.target.value }))}
              maxLength={LIFE_CAPS.rule}
              placeholder="Rule…"
              className={inputClass}
            />
            <button
              type="button"
              onClick={() => setRules(removeAt(rules, i))}
              aria-label="Remove rule"
              className={removeBtnClass}
            >
              ✕
            </button>
          </div>
        ))}
        {rules.length < LIFE_CAPS.rules && (
          <Button variant="ghost" onClick={() => setRules([...rules, { key: newKey(), text: '' }])}>
            + Add rule
          </Button>
        )}
      </Card>
    </section>
  )
}

// --- Trackers ---------------------------------------------------------------

function TrackersSection({
  trackers,
  setTrackers,
}: {
  trackers: TrackerRow[]
  setTrackers: (v: TrackerRow[]) => void
}) {
  return (
    <section className="mb-6">
      <h2 className="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">Trackers</h2>
      <div className="space-y-2">
        {trackers.map((tr, i) => (
          <Card key={tr.id} className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                value={tr.emoji}
                onChange={(e) => setTrackers(updateAt(trackers, i, { emoji: e.target.value }))}
                maxLength={LIFE_CAPS.emoji}
                placeholder="🔹"
                aria-label="Tracker emoji"
                className={`${inputClass} w-16 text-center`}
              />
              <input
                value={tr.label}
                onChange={(e) => setTrackers(updateAt(trackers, i, { label: e.target.value }))}
                maxLength={LIFE_CAPS.trackerLabel}
                placeholder="Tracker label…"
                aria-label="Tracker label"
                className={`${inputClass} flex-1`}
              />
              <button
                type="button"
                onClick={() => setTrackers(removeAt(trackers, i))}
                aria-label={`Remove tracker ${tr.label || i + 1}`}
                className={removeBtnClass}
              >
                ✕
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex overflow-hidden rounded-lg border border-slate-300 dark:border-slate-700">
                {(['target', 'max'] as CapMode[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setTrackers(updateAt(trackers, i, { capMode: mode }))}
                    aria-pressed={tr.capMode === mode}
                    className={`min-h-10 px-3.5 text-sm font-medium capitalize transition-colors ${
                      tr.capMode === mode
                        ? 'bg-indigo-500 text-white'
                        : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
              <input
                type="number"
                inputMode="numeric"
                min={1}
                max={LIFE_CAPS.countMax}
                value={tr.capValue}
                onChange={(e) => setTrackers(updateAt(trackers, i, { capValue: e.target.value }))}
                placeholder="e.g. 3"
                aria-label={`${tr.capMode} value`}
                className={`${inputClass} w-24`}
              />
              <button
                type="button"
                onClick={() => setTrackers(updateAt(trackers, i, { energy: !tr.energy }))}
                aria-pressed={tr.energy}
                className={`flex min-h-10 items-center gap-1.5 rounded-lg border px-3.5 text-sm font-medium transition-colors ${
                  tr.energy
                    ? 'border-indigo-500 bg-indigo-500 text-white'
                    : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                ⚡ Energy {tr.energy ? 'on' : 'off'}
              </button>
            </div>
          </Card>
        ))}
      </div>
      {trackers.length < LIFE_CAPS.trackers && (
        <div className="mt-2">
          <Button
            variant="ghost"
            onClick={() =>
              setTrackers([
                ...trackers,
                { id: newId(), emoji: '', label: '', capMode: 'target', capValue: '', energy: false },
              ])
            }
          >
            + Add tracker
          </Button>
        </div>
      )}
    </section>
  )
}

// --- Sunday questions ------------------------------------------------------

function SundaySection({
  sundayCheck,
  setSundayCheck,
}: {
  sundayCheck: QuestionRow[]
  setSundayCheck: (v: QuestionRow[]) => void
}) {
  return (
    <section className="mb-6">
      <h2 className="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">Sunday questions</h2>
      <Card className="space-y-2">
        {sundayCheck.map((q, i) => (
          <div key={q.id} className="flex items-center gap-2">
            <input
              value={q.label}
              onChange={(e) => setSundayCheck(updateAt(sundayCheck, i, { label: e.target.value }))}
              maxLength={LIFE_CAPS.questionLabel}
              placeholder="Question…"
              aria-label="Question label"
              className={`${inputClass} flex-1`}
            />
            <select
              value={q.type}
              onChange={(e) => setSundayCheck(updateAt(sundayCheck, i, { type: e.target.value as LifeQuestionType }))}
              aria-label="Question type"
              className={`${inputClass} w-32`}
            >
              {QUESTION_TYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setSundayCheck(removeAt(sundayCheck, i))}
              aria-label="Remove question"
              className={removeBtnClass}
            >
              ✕
            </button>
          </div>
        ))}
        {sundayCheck.length < LIFE_CAPS.questions && (
          <Button
            variant="ghost"
            onClick={() => setSundayCheck([...sundayCheck, { id: newId(), label: '', type: 'text' }])}
          >
            + Add question
          </Button>
        )}
      </Card>
    </section>
  )
}

// --- Check-ins ---------------------------------------------------------------

function CheckinsSection({
  checkins,
  setCheckins,
}: {
  checkins: CheckinRow[]
  setCheckins: (v: CheckinRow[]) => void
}) {
  return (
    <section className="mb-6">
      <h2 className="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">Check-ins</h2>
      <Card className="space-y-2">
        {checkins.map((c, i) => (
          <div key={c.id} className="flex items-center gap-2">
            <input
              type="date"
              value={c.date}
              onChange={(e) => setCheckins(updateAt(checkins, i, { date: e.target.value }))}
              aria-label="Check-in date"
              className={`${inputClass} w-40`}
            />
            <input
              value={c.label}
              onChange={(e) => setCheckins(updateAt(checkins, i, { label: e.target.value }))}
              maxLength={LIFE_CAPS.checkinLabel}
              placeholder="Label…"
              aria-label="Check-in label"
              className={`${inputClass} flex-1`}
            />
            <button
              type="button"
              onClick={() => setCheckins(removeAt(checkins, i))}
              aria-label="Remove check-in"
              className={removeBtnClass}
            >
              ✕
            </button>
          </div>
        ))}
        {checkins.length < LIFE_CAPS.checkins && (
          <Button
            variant="ghost"
            onClick={() => setCheckins([...checkins, { id: newId(), date: '', label: '' }])}
          >
            + Add check-in
          </Button>
        )}
      </Card>
    </section>
  )
}

// --- Tasks --------------------------------------------------------------------

function TasksSection({ tasks, setTasks }: { tasks: TaskRow[]; setTasks: (v: TaskRow[]) => void }) {
  return (
    <section className="mb-6">
      <h2 className="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">Tasks</h2>
      <div className="space-y-2">
        {tasks.map((t, i) => (
          <Card key={t.id} className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                value={t.title}
                onChange={(e) => setTasks(updateAt(tasks, i, { title: e.target.value }))}
                maxLength={LIFE_CAPS.taskTitle}
                placeholder="Task title…"
                aria-label="Task title"
                className={`${inputClass} flex-1`}
              />
              <button
                type="button"
                onClick={() => setTasks(removeAt(tasks, i))}
                aria-label={`Remove task ${t.title || i + 1}`}
                className={removeBtnClass}
              >
                ✕
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={t.whenMode}
                onChange={(e) => setTasks(updateAt(tasks, i, { whenMode: e.target.value as WhenMode }))}
                aria-label="When"
                className={`${inputClass} w-32`}
              >
                <option value="none">No date</option>
                <option value="date">Date</option>
                <option value="keyword">Keyword</option>
              </select>
              {t.whenMode === 'date' && (
                <input
                  type="date"
                  value={t.whenDate}
                  onChange={(e) => setTasks(updateAt(tasks, i, { whenDate: e.target.value }))}
                  aria-label="When date"
                  className={`${inputClass} w-40`}
                />
              )}
              {t.whenMode === 'keyword' && (
                <select
                  value={t.whenKeyword}
                  onChange={(e) => setTasks(updateAt(tasks, i, { whenKeyword: e.target.value }))}
                  aria-label="When keyword"
                  className={`${inputClass} w-32`}
                >
                  {THINGS_WHEN_KEYWORDS.map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="w-20 shrink-0 text-xs text-slate-500 dark:text-slate-400">Deadline</span>
              <input
                type="date"
                value={t.deadline}
                onChange={(e) => setTasks(updateAt(tasks, i, { deadline: e.target.value }))}
                aria-label="Deadline"
                className={`${inputClass} w-40`}
              />
            </div>

            <div className="flex gap-2">
              <input
                value={t.area}
                onChange={(e) => setTasks(updateAt(tasks, i, { area: e.target.value }))}
                maxLength={LIFE_CAPS.areaProject}
                placeholder="Area…"
                aria-label="Area"
                className={inputClass}
              />
              <input
                value={t.project}
                onChange={(e) => setTasks(updateAt(tasks, i, { project: e.target.value }))}
                maxLength={LIFE_CAPS.areaProject}
                placeholder="Project…"
                aria-label="Project"
                className={inputClass}
              />
            </div>

            <input
              value={t.tags}
              onChange={(e) => setTasks(updateAt(tasks, i, { tags: e.target.value }))}
              placeholder="tags, comma, separated…"
              aria-label="Tags"
              className={inputClass}
            />

            <textarea
              value={t.notes}
              onChange={(e) => setTasks(updateAt(tasks, i, { notes: e.target.value }))}
              maxLength={LIFE_CAPS.taskNotes}
              placeholder="Notes…"
              rows={2}
              aria-label="Notes"
              className={textareaClass}
            />
          </Card>
        ))}
      </div>
      {tasks.length < LIFE_CAPS.tasks && (
        <div className="mt-2">
          <Button
            variant="ghost"
            onClick={() =>
              setTasks([
                ...tasks,
                {
                  id: newId(),
                  title: '',
                  whenMode: 'none',
                  whenDate: '',
                  whenKeyword: THINGS_WHEN_KEYWORDS[0],
                  deadline: '',
                  area: '',
                  project: '',
                  tags: '',
                  notes: '',
                },
              ])
            }
          >
            + Add task
          </Button>
        </div>
      )}
    </section>
  )
}
