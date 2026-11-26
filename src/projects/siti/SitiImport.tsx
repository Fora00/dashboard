import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, type Site } from '../../lib/db'
import { applySitesImport } from '../../lib/sitiSync'
import { useAuth } from '../../lib/useAuth'
import { useLinkImport } from '../../lib/useLinkImport'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { PageHeader } from '../../components/PageHeader'
import { SITES_LINK_MAX_PARAM, decodeSitesParam, type SitesPayloadResult } from './sitesLink'
import { planSitesImport } from './sitesMerge'
import { siteName } from './sitesView'

// Siti import screen (SI1): opened from the link printed by
// `npm run sites:link` (#/siti/import?d=…). Same flow as the Soldi import
// screens: the link only prefills, the preview lists the new, updated and gone
// repos by name, and nothing is written until the owner taps Importa.
// Local-first: works signed out against Dexie; the normal sync carries the
// rows to the cloud.

export function SitiImport() {
  const navigate = useNavigate()
  const session = useAuth()
  // The hook strips `d` from the URL; unpacking is async, so it hands the raw param through.
  const { text, linkErrors } = useLinkImport({
    maxChars: SITES_LINK_MAX_PARAM,
    decode: (d) => ({ ok: true, text: d }),
    tooLarge: 'Link troppo lungo',
  })
  const [result, setResult] = useState<SitesPayloadResult | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const stored = useLiveQuery(() => db.sites.toArray())

  useEffect(() => {
    if (!text) return
    let live = true
    void decodeSitesParam(text).then((r) => {
      if (live) setResult(r)
    })
    return () => {
      live = false
    }
  }, [text])

  // The preview plans with now = 0; applySitesImport re-plans with the real time.
  const plan = useMemo(
    () => (result?.ok && stored ? planSitesImport(result.payload, stored, 0) : null),
    [result, stored],
  )
  const errors = linkErrors ?? (result && !result.ok ? result.errors : null)
  const writes = plan?.upserts.length ?? 0

  async function apply() {
    if (!result?.ok) return
    setSaving(true)
    setSaveError(null)
    try {
      await applySitesImport(result.payload)
      await navigate('/siti', { replace: true })
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : String(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader
        emoji="📥"
        title="Importa siti"
        subtitle="I repo con GitHub Pages, da npm run sites:link."
        back={{ to: '/siti', label: 'Siti' }}
      />
      {session === null && (
        <p className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-3.5 py-2 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
          Non hai fatto l’accesso: i dati restano solo su questo dispositivo.
        </p>
      )}
      {!text && !linkErrors && (
        <Card className="text-sm text-slate-600 dark:text-slate-300">
          Apri questa pagina dal link stampato da <code>npm run sites:link</code>.
        </Card>
      )}
      {errors && (
        <Card className="mb-4 space-y-1 text-sm">
          <p className="font-medium text-rose-600 dark:text-rose-400">Link non valido:</p>
          <ul className="list-disc pl-5 text-rose-600 dark:text-rose-400">
            {errors.slice(0, 20).map((e, i) => (
              <li key={i}>{e}</li>
            ))}
            {errors.length > 20 && <li>… e altri {errors.length - 20}</li>}
          </ul>
        </Card>
      )}
      {plan && (
        <Card className="space-y-4">
          <p className="text-sm font-medium" data-testid="sites-import-summary">
            {plan.added.length} nuovi, {plan.updated.length} aggiornati, {plan.gone.length} spariti da GitHub,{' '}
            {plan.unchanged} invariati
          </p>
          <Group title="Nuovi" tone="text-sky-700 dark:text-sky-400" sites={plan.added} testId="sites-import-added" />
          <Group
            title="Aggiornati"
            tone="text-amber-700 dark:text-amber-400"
            sites={plan.updated}
            testId="sites-import-updated"
          />
          <Group
            title="Spariti da GitHub"
            tone="text-rose-700 dark:text-rose-400"
            sites={plan.gone}
            testId="sites-import-gone"
          />
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Da GitHub arrivano solo indirizzo, descrizione e ultimo deploy: nome, note, stato e fissati restano i tuoi.
            Un repo sparito resta nella lista, segnato.
          </p>
          {saveError && <p className="text-sm text-rose-600 dark:text-rose-400">{saveError}</p>}
          {writes > 0 ? (
            <Button disabled={saving} onClick={() => void apply()}>
              {saving ? 'Importo…' : 'Importa'}
            </Button>
          ) : (
            <p className="text-sm font-medium" data-testid="sites-import-nothing">
              Niente da importare: è tutto già aggiornato.
            </p>
          )}
        </Card>
      )}
    </div>
  )
}

function Group({ title, tone, sites, testId }: { title: string; tone: string; sites: Site[]; testId: string }) {
  if (sites.length === 0) return null
  return (
    <div>
      <h3 className={`mb-1 text-xs font-semibold ${tone}`}>
        {title} ({sites.length})
      </h3>
      <ul className="space-y-1" data-testid={testId}>
        {sites.map((s) => (
          <li
            key={s.id}
            className="flex min-h-10 flex-wrap items-center gap-x-3 rounded-xl border border-slate-200 px-3 py-1.5 text-sm dark:border-slate-700"
          >
            <span className="font-medium">{siteName(s)}</span>
            <span className="min-w-0 truncate text-xs text-slate-500 dark:text-slate-400">{s.repo}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
