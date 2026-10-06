import { useEffect, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { db, type LifePlan } from '../../lib/db'
import { importWeek } from '../../lib/lifeSync'
import { useAuth } from '../../lib/useAuth'
import { AUTO_QUESTION_TYPES, addDays, dayKey, isMondayKey, validatePlan, weekKey, withCheckinIds } from './model'
import { PlanPreview } from './PlanPreview'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { PageHeader } from '../../components/PageHeader'
import { SkeletonList } from '../../components/Skeleton'
import { CheckinsSection } from './editor/CheckinsSection'
import { FocusSection } from './editor/FocusSection'
import { RulesSection } from './editor/RulesSection'
import {
  newKey,
  questionToRow,
  taskToRow,
  trackerToRow,
  type CheckinRow,
  type FocusRow,
  type QuestionRow,
  type RuleRow,
  type TaskRow,
  type TrackerRow,
} from './editor/rows'
import { SundaySection } from './editor/SundaySection'
import { TasksSection } from './editor/TasksSection'
import { TrackersSection } from './editor/TrackersSection'

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
      setSundayCheck(plan.sundayCheck.map(questionToRow))
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
    setSundayCheck(plan.sundayCheck.map(questionToRow))
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
        ...(t.listId ? { listId: t.listId } : {}),
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
      // A link survives only while its tracker is still in the plan and the
      // type can be computed; otherwise the question goes back to typed.
      sundayCheck: sundayCheck.map((q) =>
        q.tracker && AUTO_QUESTION_TYPES.includes(q.type) && trackers.some((t) => t.id === q.tracker)
          ? { id: q.id, label: q.label, type: q.type, tracker: q.tracker }
          : { id: q.id, label: q.label, type: q.type },
      ),
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
      await navigate('/life')
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
      <PageHeader emoji="🧭" title={existing ? 'Edit week' : 'Build a week'} subtitle={`Week of ${week}`} />

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
          <SundaySection sundayCheck={sundayCheck} setSundayCheck={setSundayCheck} trackers={trackers} />
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
