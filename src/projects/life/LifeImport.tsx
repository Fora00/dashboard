import { useEffect, useMemo, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { db } from '../../lib/db'
import { importWeek } from '../../lib/lifeSync'
import { useAuth } from '../../lib/useAuth'
import { decodeImportParam, parseWeekJson, type ParseResult } from './model'
import { PlanPreview } from './PlanPreview'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { PageHeader } from '../../components/PageHeader'

// Import screen (spec: docs/HANDOFF-life.md 2.1). Paste JSON, or open with
// `?d=<base64url>` (from encodeImportLink / scripts/life-link.ts) to prefill
// — the link never auto-saves, it only prefills the same preview-then-Save
// flow. Nothing is written until the owner taps Save.

// Hard cap on pasted/linked input, checked before decode and JSON.parse.
const MAX_INPUT_CHARS = 200_000
const TOO_LARGE = 'That input is too large (over 200 KB) to be a week plan.'

export function LifeImport() {
  const navigate = useNavigate()
  const session = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const [text, setText] = useState('')
  const [linkErrors, setLinkErrors] = useState<string[] | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const linkParam = searchParams.get('d')

  // Prefill from an import link, once, whenever `d` changes.
  useEffect(() => {
    if (!linkParam) return
    const decoded =
      linkParam.length > MAX_INPUT_CHARS ? { ok: false as const, errors: [TOO_LARGE] } : decodeImportParam(linkParam)
    // Strip the plan from the URL (replace, not push) so it doesn't linger in
    // browser history / synced tabs. The decoded text lives in state only.
    setSearchParams({}, { replace: true })
    if (decoded.ok) {
      setText(decoded.text)
      setLinkErrors(null)
    } else {
      // Clear any earlier paste/link content so the damaged-link error is
      // what shows, instead of a stale preview from before this link opened.
      setText('')
      setLinkErrors(decoded.errors)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linkParam])

  const result = useMemo<ParseResult | null>(
    () => (text.trim() && text.length <= MAX_INPUT_CHARS ? parseWeekJson(text) : null),
    [text],
  )
  const planWeek = result?.ok ? result.plan.week : null
  const existing = useLiveQuery(() => (planWeek ? db.lifeWeeks.get(planWeek).then((w) => w ?? null) : null), [planWeek])

  async function save() {
    if (!result?.ok) return
    setSaving(true)
    setSaveError(null)
    try {
      await importWeek(result.plan)
      await navigate('/life', { replace: true })
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

      <div className="mb-4">
        <Link to="/life/edit">
          <Button variant="ghost">✍️ Build by hand</Button>
        </Link>
      </div>

      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value)
          setLinkErrors(null)
        }}
        placeholder={
          '{ "version": 1, "week": "2026-01-05", "focus": [], "rules": [], "tasks": [], "trackers": [], "sundayCheck": [], "checkins": [] }'
        }
        aria-label="Week JSON"
        rows={10}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        className="mb-4 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 font-mono text-xs placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:border-(color:--accent-ring) focus:outline-none dark:border-slate-700 dark:bg-slate-800"
      />

      {text.length > MAX_INPUT_CHARS && <p className="mb-4 text-sm text-rose-600 dark:text-rose-400">{TOO_LARGE}</p>}

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

      {result?.ok && (
        <PlanPreview
          plan={result.plan}
          existingPlan={existing?.plan ?? null}
          saving={saving}
          saveError={saveError}
          onConfirm={() => void save()}
        />
      )}
    </div>
  )
}
