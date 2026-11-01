import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../lib/db'
import { useAuth } from '../../lib/useAuth'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { PageHeader } from '../../components/PageHeader'
import {
  FIELD_LABELS,
  HABITS_LINK_MAX_PARAM,
  decodeHabitsParam,
  parseHabitsPlanJson,
  planHabitsImport,
  type FieldChange,
  type ImportRow,
} from './habitsPlan'
import { applyHabitsImport } from './habitsPlanApply'

// Habits import screen (EN4): opened from the link printed by
// `npm run life:habits-link` (#/habits/import?d=<base64url>), which only
// prefills; nothing is written until the owner taps Apply. Each row is
// `+ new`, `~ change` (before → after, only changed fields), `no change` or
// invalid; new and changed rows can be unticked. Local-first: works signed
// out against Dexie; the normal sync carries the habits to the other devices.

export function HabitsImport() {
  const navigate = useNavigate()
  const session = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const [text, setText] = useState('')
  const [linkErrors, setLinkErrors] = useState<string[] | null>(null)
  const [unticked, setUnticked] = useState<ReadonlySet<string>>(new Set())
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const linkParam = searchParams.get('d')
  const habits = useLiveQuery(() => db.habits.toArray())

  useEffect(() => {
    if (!linkParam) return
    const decoded =
      linkParam.length > HABITS_LINK_MAX_PARAM
        ? { ok: false as const, errors: ['Link too large'] }
        : decodeHabitsParam(linkParam)
    // Strip the data from the URL (replace) so it doesn't linger in history.
    setSearchParams({}, { replace: true })
    setText(decoded.ok ? decoded.text : '')
    setLinkErrors(decoded.ok ? null : decoded.errors)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linkParam])

  const result = useMemo(() => (text.trim() ? parseHabitsPlanJson(text) : null), [text])
  const rows = useMemo(() => (result?.ok && habits ? planHabitsImport(result.plan, habits) : null), [result, habits])
  const actionable = rows?.filter((r) => r.kind === 'create' || r.kind === 'update') ?? []
  const chosen = actionable.filter((r) => !unticked.has(r.key))
  const untouched = habits
    ? habits.filter((h) => h.archivedAt === undefined).length -
      (rows?.filter((r) => r.kind === 'update' || r.kind === 'same').length ?? 0)
    : 0

  function toggle(key: string) {
    setUnticked((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  async function apply() {
    if (!result?.ok || chosen.length === 0) return
    setSaving(true)
    setSaveError(null)
    try {
      await applyHabitsImport(result.plan, new Set(chosen.map((r) => r.key)))
      await navigate('/habits', { replace: true })
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : String(err))
    } finally {
      setSaving(false)
    }
  }

  const errors = result && !result.ok ? result.errors : !text.trim() ? linkErrors : null
  const count = (kind: ImportRow['kind']) => rows?.filter((r) => r.kind === kind).length ?? 0

  return (
    <div>
      <PageHeader emoji="📥" title="Import habits" subtitle="New habits and edits from ~/life (life:habits-link)." />
      {session === null && (
        <p className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-3.5 py-2 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
          You are not signed in: this stays on this device only.
        </p>
      )}
      {!text.trim() && !linkErrors && (
        <Card className="text-sm text-slate-600 dark:text-slate-300">
          Open this page from the link printed by <code>npm run life:habits-link</code>.
        </Card>
      )}
      {errors && (
        <Card className="mb-4 space-y-1 text-sm">
          <p className="font-medium text-rose-600 dark:text-rose-400">Invalid link:</p>
          <ul className="list-disc pl-5 text-rose-600 dark:text-rose-400">
            {errors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </Card>
      )}
      {result?.ok && rows && (
        <Card className="space-y-3">
          <p className="text-sm font-medium" data-testid="habits-import-summary">
            {count('create')} new, {count('update')} to change, {count('same')} no change
            {count('invalid') > 0 ? `, ${count('invalid')} invalid` : ''}
            {result.plan.asOf ? ` (plan of ${result.plan.asOf})` : ''}
          </p>
          <ul className="space-y-2">
            {rows.map((row) => (
              <ImportRowItem
                key={row.key}
                row={row}
                checked={!unticked.has(row.key)}
                onToggle={() => toggle(row.key)}
              />
            ))}
          </ul>
          {untouched > 0 && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {untouched} other {untouched === 1 ? 'habit is' : 'habits are'} not in the plan and stay as they are.
            </p>
          )}
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Nothing is archived or deleted, and check-offs are never touched.
          </p>
          {saveError && <p className="text-sm text-rose-600 dark:text-rose-400">{saveError}</p>}
          {actionable.length > 0 ? (
            <Button disabled={saving || chosen.length === 0} onClick={() => void apply()}>
              {saving ? 'Applying…' : `Apply (${chosen.length})`}
            </Button>
          ) : (
            <p className="text-sm font-medium" data-testid="habits-import-nothing">
              Nothing to apply: every habit is already up to date.
            </p>
          )}
        </Card>
      )}
    </div>
  )
}

function ImportRowItem({ row, checked, onToggle }: { row: ImportRow; checked: boolean; onToggle: () => void }) {
  const base = 'rounded-xl border px-3 py-2 text-sm'
  if (row.kind === 'invalid')
    return (
      <li className={`${base} border-rose-300 dark:border-rose-800`} data-testid="habits-import-row">
        <p className="font-medium">
          {row.name} <span className="text-rose-600 dark:text-rose-400">invalid</span>
        </p>
        <ul className="list-disc pl-5 text-rose-600 dark:text-rose-400">
          {row.errors.map((e, i) => (
            <li key={i}>{e}</li>
          ))}
        </ul>
      </li>
    )
  if (row.kind === 'same')
    return (
      <li
        className={`${base} flex min-h-10 items-center border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400`}
        data-testid="habits-import-row"
      >
        {row.habit.emoji} {row.habit.name} · no change
      </li>
    )
  const isNew = row.kind === 'create'
  const fields: FieldChange[] = isNew ? row.fields : row.changes
  return (
    <li
      className={`${base} ${isNew ? 'border-emerald-300 dark:border-emerald-800' : 'border-amber-300 dark:border-amber-800'}`}
      data-testid="habits-import-row"
    >
      <label className="flex min-h-10 cursor-pointer items-center gap-3">
        <input type="checkbox" className="size-5 shrink-0" checked={checked} onChange={onToggle} />
        <span className="font-medium">
          {row.emoji} {row.name}
        </span>
        <span
          className={`ml-auto shrink-0 text-xs font-semibold ${isNew ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}`}
        >
          {isNew ? '+ new' : '~ change'}
        </span>
      </label>
      {fields.length > 0 && (
        <dl className="mt-1 grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 pl-8 text-xs">
          {fields.map((f) => (
            <div key={f.field} className="contents">
              <dt className="text-slate-500 dark:text-slate-400">{FIELD_LABELS[f.field]}</dt>
              <dd className="break-words">
                {isNew ? (
                  f.after
                ) : (
                  <>
                    <span className="text-slate-500 line-through dark:text-slate-400">{f.before}</span> → {f.after}
                  </>
                )}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </li>
  )
}
