import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../lib/db'
import { applyMoneyImport } from '../../lib/moneySync'
import { useAuth } from '../../lib/useAuth'
import { useLinkImport } from '../../lib/useLinkImport'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { PageHeader } from '../../components/PageHeader'
import { MONEY_LINK_MAX_PARAM, decodeMoneyParam, type PayloadResult } from './moneyLink'
import { planMoneyImport, type MonthDiff, type MonthStatus } from './moneyDiff'
import { MONTHS_IT, euro, keptOf, outOf, type Totals } from './moneyStats'

// Soldi import screen: opened from a link printed by `npm run life:money-link`
// (#/soldi/import?d=<base64url(deflate-raw JSON)>). The link only prefills:
// the preview lists every month of the link's range as nuovo / cambiato /
// invariato / da svuotare with messo da parte before → after, plus the range
// totals, and nothing is written until the owner taps Importa. Local-first:
// works signed out against Dexie; the normal sync carries the rows to the cloud.

const STATUS: Record<MonthStatus, { label: string; cls: string }> = {
  added: { label: '+ nuovo', cls: 'text-sky-700 dark:text-sky-400' },
  changed: { label: '~ cambiato', cls: 'text-amber-700 dark:text-amber-400' },
  removed: { label: '− da svuotare', cls: 'text-rose-700 dark:text-rose-400' },
  unchanged: { label: 'invariato', cls: 'text-slate-500 dark:text-slate-400' },
}

const monthName = (m: string) => `${MONTHS_IT[Number(m.slice(5, 7)) - 1]} ${m.slice(0, 4)}`

export function MoneyImport() {
  const navigate = useNavigate()
  const session = useAuth()
  // The hook strips `d` from the URL; unpacking is async, so it hands the raw param through.
  // The preview plans with updatedAt 0: applyMoneyImport re-plans with the real time.
  const { text, linkErrors } = useLinkImport({
    maxChars: MONEY_LINK_MAX_PARAM,
    decode: (d) => ({ ok: true, text: d }),
    tooLarge: 'Link troppo lungo',
  })
  const [result, setResult] = useState<PayloadResult | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [showSame, setShowSame] = useState(false)
  const stored = useLiveQuery(() => db.moneyTotals.toArray())

  useEffect(() => {
    if (!text) return
    let live = true
    void decodeMoneyParam(text).then((r) => {
      if (live) setResult(r)
    })
    return () => {
      live = false
    }
  }, [text])

  const plan = useMemo(
    () => (result?.ok && stored ? planMoneyImport(result.payload, stored, 0) : null),
    [result, stored],
  )
  const errors = linkErrors ?? (result && !result.ok ? result.errors : null)
  const count = (s: MonthStatus) => plan?.months.filter((m) => m.status === s).length ?? 0
  const writes = plan ? plan.upserts.length + plan.deletes.length : 0

  async function apply() {
    if (!result?.ok) return
    setSaving(true)
    setSaveError(null)
    try {
      await applyMoneyImport(result.payload)
      await navigate('/soldi', { replace: true })
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
        title="Importa soldi"
        subtitle="Totali mensili da ~/life (life:money-link)."
        back={{ to: '/soldi', label: 'Soldi' }}
      />
      {session === null && (
        <p className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-3.5 py-2 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
          Non hai fatto l’accesso: i dati restano solo su questo dispositivo.
        </p>
      )}
      {!text && !linkErrors && (
        <Card className="text-sm text-slate-600 dark:text-slate-300">
          Apri questa pagina dal link stampato da <code>npm run life:money-link</code>.
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
          <p className="text-sm font-medium" data-testid="money-import-summary">
            {monthName(plan.from)} → {monthName(plan.to)}: {count('added')} nuovi, {count('changed')} cambiati,{' '}
            {count('unchanged')} invariati{count('removed') > 0 ? `, ${count('removed')} da svuotare` : ''}
          </p>
          <RangeTotals before={plan.before} after={plan.after} />
          <ul className="space-y-1.5">
            {plan.months
              .filter((m) => showSame || m.status !== 'unchanged')
              .map((m) => (
                <MonthRow key={m.month} m={m} />
              ))}
          </ul>
          {count('unchanged') > 0 && (
            <button
              type="button"
              className="min-h-10 text-sm text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
              onClick={() => setShowSame(!showSame)}
            >
              {showSame ? 'Nascondi i mesi invariati' : `Mostra i mesi invariati (${count('unchanged')})`}
            </button>
          )}
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Il CSV comanda: ogni mese del link sostituisce quello salvato (le categorie sparite vengono tolte). I mesi
            fuori da questo intervallo non cambiano.
          </p>
          {saveError && <p className="text-sm text-rose-600 dark:text-rose-400">{saveError}</p>}
          {writes > 0 ? (
            <Button disabled={saving} onClick={() => void apply()}>
              {saving ? 'Importo…' : `Importa (${writes} ${writes === 1 ? 'riga' : 'righe'})`}
            </Button>
          ) : (
            <p className="text-sm font-medium" data-testid="money-import-nothing">
              Niente da importare: è tutto già aggiornato.
            </p>
          )}
        </Card>
      )}
    </div>
  )
}

function RangeTotals({ before, after }: { before: Totals; after: Totals }) {
  const rows: [string, (t: Totals) => number][] = [
    ['entrate', (t) => t.income],
    ['uscite', outOf],
    ['messo da parte', keptOf],
  ]
  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-sm">
      {rows.map(([label, f]) => (
        <div key={label} className="contents">
          <dt className="text-slate-500 dark:text-slate-400">{label}</dt>
          <dd className="tabular-nums">
            {f(before) === f(after) ? (
              euro(f(after))
            ) : (
              <>
                <span className="text-slate-500 line-through dark:text-slate-400">{euro(f(before))}</span> →{' '}
                {euro(f(after))}
              </>
            )}
          </dd>
        </div>
      ))}
    </dl>
  )
}

function MonthRow({ m }: { m: MonthDiff }) {
  const s = STATUS[m.status]
  const detail = [
    m.added && `${m.added} nuove`,
    m.changed && `${m.changed} cambiate`,
    m.removed && `${m.removed} tolte`,
  ]
    .filter(Boolean)
    .join(', ')
  return (
    <li
      className="flex min-h-10 flex-wrap items-center gap-x-3 rounded-xl border border-slate-200 px-3 py-1.5 text-sm dark:border-slate-700"
      data-testid="money-import-row"
    >
      <span className="w-20 font-medium">{monthName(m.month)}</span>
      <span className={`text-xs font-semibold ${s.cls}`}>{s.label}</span>
      <span className="ml-auto text-xs tabular-nums">
        {m.before && m.status !== 'unchanged' && (
          <span className="text-slate-500 line-through dark:text-slate-400">{euro(keptOf(m.before))}</span>
        )}
        {m.before && m.after && m.status !== 'unchanged' && ' → '}
        {m.after ? euro(keptOf(m.after)) : '—'}
      </span>
      {detail && <span className="w-full text-xs text-slate-500 dark:text-slate-400">categorie: {detail}</span>}
    </li>
  )
}
