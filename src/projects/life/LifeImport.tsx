import { useEffect, useMemo, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { db } from '../../lib/db'
import { importWeek } from '../../lib/lifeSync'
import { useAuth } from '../../lib/useAuth'
import { decodeImportParam, diffPlans, parseWeekJson, type ParseResult } from './model'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { PageHeader } from '../../components/PageHeader'

// Import screen (spec: docs/HANDOFF-life.md 2.1). Paste JSON, or open with
// `?d=<base64url>` (from encodeImportLink / scripts/life-link.ts) to prefill
// — the link never auto-saves, it only prefills the same preview-then-Save
// flow. Nothing is written until the owner taps Save.

export function LifeImport() {
  const navigate = useNavigate()
  const session = useAuth()
  const [searchParams] = useSearchParams()
  const [text, setText] = useState('')
  const [linkErrors, setLinkErrors] = useState<string[] | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const linkParam = searchParams.get('d')

  // Prefill from an import link, once, whenever `d` changes.
  useEffect(() => {
    if (!linkParam) return
    const decoded = decodeImportParam(linkParam)
    if (decoded.ok) {
      setText(decoded.text)
      setLinkErrors(null)
    } else {
      // Clear any earlier paste/link content so the damaged-link error is
      // what shows, instead of a stale preview from before this link opened.
      setText('')
      setLinkErrors(decoded.errors)
    }
  }, [linkParam])

  const result = useMemo<ParseResult | null>(() => (text.trim() ? parseWeekJson(text) : null), [text])
  const planWeek = result?.ok ? result.plan.week : null
  const existing = useLiveQuery(
    () => (planWeek ? db.lifeWeeks.get(planWeek).then((w) => w ?? null) : null),
    [planWeek],
  )
  const diff = result?.ok ? diffPlans(existing?.plan ?? null, result.plan) : null

  async function save() {
    if (!result?.ok) return
    setSaving(true)
    setSaveError(null)
    try {
      await importWeek(result.plan)
      navigate('/life')
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : String(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader emoji="🧭" title="Import week" subtitle="Paste the week's JSON, or open an import link." />

      {session === null && (
        <p className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-3.5 py-2 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
          Signed out — this week stays on this device only.
        </p>
      )}

      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value)
          setLinkErrors(null)
        }}
        placeholder={'{ "version": 1, "week": "2026-01-05", "focus": [], "rules": [], "tasks": [], "trackers": [], "sundayCheck": [], "checkins": [] }'}
        rows={10}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        className="mb-4 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 font-mono text-xs placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
      />

      {linkErrors && !text.trim() && (
        <Card className="mb-4 space-y-1 text-sm">
          <p className="font-medium text-rose-600 dark:text-rose-400">The import link couldn't be read:</p>
          <ul className="list-disc space-y-0.5 pl-5 text-rose-600 dark:text-rose-400">
            {linkErrors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </Card>
      )}

      {result && !result.ok && (
        <Card className="mb-4 space-y-1 text-sm">
          <p className="font-medium text-rose-600 dark:text-rose-400">This isn't a valid week:</p>
          <ul className="list-disc space-y-0.5 pl-5 text-rose-600 dark:text-rose-400">
            {result.errors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </Card>
      )}

      {result?.ok && diff && (
        <Card className="mb-4 space-y-3 text-sm">
          <p className="font-medium text-slate-800 dark:text-slate-100">Week of {result.plan.week}</p>
          <ul className="space-y-0.5 text-slate-600 dark:text-slate-300">
            <li>{result.plan.focus.length} focus item{result.plan.focus.length === 1 ? '' : 's'}</li>
            <li>{result.plan.tasks.length} task{result.plan.tasks.length === 1 ? '' : 's'}</li>
            <li>{result.plan.trackers.length} tracker{result.plan.trackers.length === 1 ? '' : 's'}</li>
            <li>
              {result.plan.sundayCheck.length} Sunday question{result.plan.sundayCheck.length === 1 ? '' : 's'}
            </li>
            <li>{result.plan.rules.length} rule{result.plan.rules.length === 1 ? '' : 's'}</li>
            <li>{result.plan.checkins.length} check-in{result.plan.checkins.length === 1 ? '' : 's'}</li>
          </ul>

          <div className="border-t border-slate-200 pt-2 dark:border-slate-800">
            {diff.firstImport ? (
              <p className="text-slate-500 dark:text-slate-400">First import for this week.</p>
            ) : diff.unchanged ? (
              <p className="text-slate-500 dark:text-slate-400">Identical to the saved plan — nothing will change.</p>
            ) : (
              <ul className="list-disc space-y-0.5 pl-5 text-slate-600 dark:text-slate-300">
                {diff.summary.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            )}
          </div>

          {saveError && <p className="text-rose-600 dark:text-rose-400">{saveError}</p>}

          <Button onClick={() => void save()} disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </Card>
      )}
    </div>
  )
}
