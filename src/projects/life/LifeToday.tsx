import { useEffect, useMemo, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { db } from '../../lib/db'
import { setDayFocus } from '../../lib/lifeSync'
import { useAuth } from '../../lib/useAuth'
import { decodeDayFocusParam, parseDayFocusJson } from './model'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { PageHeader } from '../../components/PageHeader'

// "Oggi" import screen: opened from the /oggi command's link
// (#/life/oggi?d=<base64url>), which only prefills; nothing is written until
// the owner taps Save. Saving replaces that day's lines; the normal sync then
// carries them to the phone.

export function LifeToday() {
  const navigate = useNavigate()
  const session = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const [text, setText] = useState('')
  const [linkErrors, setLinkErrors] = useState<string[] | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const linkParam = searchParams.get('d')

  useEffect(() => {
    if (!linkParam) return
    const decoded =
      linkParam.length > 20_000 ? { ok: false as const, errors: ['Link too large'] } : decodeDayFocusParam(linkParam)
    // Strip the lines from the URL (replace) so they don't linger in history.
    setSearchParams({}, { replace: true })
    setText(decoded.ok ? decoded.text : '')
    setLinkErrors(decoded.ok ? null : decoded.errors)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linkParam])

  const result = useMemo(() => (text.trim() ? parseDayFocusJson(text) : null), [text])
  const day = result?.ok ? result.plan.day : null
  const existing = useLiveQuery(() => (day ? db.lifeDayFocus.where('day').equals(day).sortBy('slot') : []), [day])

  async function save() {
    if (!result?.ok) return
    setSaving(true)
    setSaveError(null)
    try {
      await setDayFocus(result.plan.day, result.plan.lines)
      await navigate('/life', { replace: true })
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : String(err))
    } finally {
      setSaving(false)
    }
  }

  const errors = result && !result.ok ? result.errors : !text.trim() ? linkErrors : null

  return (
    <div>
      <PageHeader emoji="☀️" title="Oggi" subtitle="Imposta il focus del giorno (da /oggi)." />
      {session === null && (
        <p className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-3.5 py-2 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
          Non hai fatto l'accesso: resta solo su questo dispositivo, il telefono non lo vedrà.
        </p>
      )}
      {errors && (
        <Card className="mb-4 space-y-1 text-sm">
          <p className="font-medium text-rose-600 dark:text-rose-400">Link non valido:</p>
          <ul className="list-disc pl-5 text-rose-600 dark:text-rose-400">
            {errors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </Card>
      )}
      {result?.ok && (
        <Card className="space-y-3">
          <p className="text-sm font-medium">{result.plan.day}</p>
          <ul className="space-y-2">
            {result.plan.lines.map((l, i) => (
              <li
                key={i}
                className="rounded-xl border border-amber-300/70 px-4 py-2 text-base dark:border-amber-400/30"
              >
                {l}
              </li>
            ))}
          </ul>
          {existing && existing.length > 0 && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Sostituisce le {existing.length} righe già presenti per questo giorno.
            </p>
          )}
          {saveError && <p className="text-sm text-rose-600 dark:text-rose-400">{saveError}</p>}
          <Button disabled={saving} onClick={() => void save()}>
            {saving ? 'Salvo…' : 'Salva'}
          </Button>
        </Card>
      )}
    </div>
  )
}
