import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../lib/db'
import { applyBalancesImport } from '../../lib/moneySync'
import { useAuth } from '../../lib/useAuth'
import { useLinkImport } from '../../lib/useLinkImport'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { PageHeader } from '../../components/PageHeader'
import { BALANCES_LINK_MAX_PARAM, decodeBalancesParam, type BalancesPayloadResult } from './balancesLink'
import { planBalancesImport, type BalanceMonthDiff, type BalanceMonthStatus } from './balancesDiff'
import { monthLabel } from './moneyPeriod'
import { euro } from './moneyStats'

// Patrimonio import screen (MO17): opened from a link printed by
// `npm run life:money-balances-link` (#/soldi/patrimonio/import?d=…). Same flow
// as MoneyImport.tsx: the link only prefills, the preview lists every month of
// the link's range as nuovo / cambiato / invariato / da svuotare with the
// month's total before → after, and nothing is written until the owner taps
// Importa. Local-first: works signed out against Dexie; the normal sync
// carries the rows to the cloud.

const STATUS: Record<BalanceMonthStatus, { label: string; cls: string }> = {
  added: { label: '+ nuovo', cls: 'text-sky-700 dark:text-sky-400' },
  changed: { label: '~ cambiato', cls: 'text-amber-700 dark:text-amber-400' },
  removed: { label: '− da svuotare', cls: 'text-rose-700 dark:text-rose-400' },
  unchanged: { label: 'invariato', cls: 'text-slate-500 dark:text-slate-400' },
}

export function MoneyBalancesImport() {
  const navigate = useNavigate()
  const session = useAuth()
  // The hook strips `d` from the URL; unpacking is async, so it hands the raw param through.
  // The preview plans with updatedAt 0: applyBalancesImport re-plans with the real time.
  const { text, linkErrors } = useLinkImport({
    maxChars: BALANCES_LINK_MAX_PARAM,
    decode: (d) => ({ ok: true, text: d }),
    tooLarge: 'Link troppo lungo',
  })
  const [result, setResult] = useState<BalancesPayloadResult | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [showSame, setShowSame] = useState(false)
  const stored = useLiveQuery(() => db.moneyBalances.toArray())

  useEffect(() => {
    if (!text) return
    let live = true
    void decodeBalancesParam(text).then((r) => {
      if (live) setResult(r)
    })
    return () => {
      live = false
    }
  }, [text])

  const plan = useMemo(
    () => (result?.ok && stored ? planBalancesImport(result.payload, stored, 0) : null),
    [result, stored],
  )
  const errors = linkErrors ?? (result && !result.ok ? result.errors : null)
  const count = (s: BalanceMonthStatus) => plan?.months.filter((m) => m.status === s).length ?? 0
  const writes = plan ? plan.upserts.length + plan.deletes.length : 0

  async function apply() {
    if (!result?.ok) return
    setSaving(true)
    setSaveError(null)
    try {
      await applyBalancesImport(result.payload)
      await navigate('/soldi/patrimonio', { replace: true })
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
        title="Importa patrimonio"
        subtitle="Saldi di fine mese da ~/life (life:money-balances-link)."
        back={{ to: '/soldi/patrimonio', label: 'Patrimonio' }}
      />
      {session === null && (
        <p className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-3.5 py-2 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
          Non hai fatto l’accesso: i dati restano solo su questo dispositivo.
        </p>
      )}
      {!text && !linkErrors && (
        <Card className="text-sm text-slate-600 dark:text-slate-300">
          Apri questa pagina dal link stampato da <code>npm run life:money-balances-link</code>.
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
          <p className="text-sm font-medium" data-testid="balances-import-summary">
            {monthLabel(plan.from)} → {monthLabel(plan.to)}: {count('added')} nuovi, {count('changed')} cambiati,{' '}
            {count('unchanged')} invariati{count('removed') > 0 ? `, ${count('removed')} da svuotare` : ''}
          </p>
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
            Il CSV comanda: ogni mese del link sostituisce quello salvato (i conti spariti vengono tolti). I mesi fuori
            da questo intervallo non cambiano.
          </p>
          {saveError && <p className="text-sm text-rose-600 dark:text-rose-400">{saveError}</p>}
          {writes > 0 ? (
            <Button disabled={saving} onClick={() => void apply()}>
              {saving ? 'Importo…' : `Importa (${writes} ${writes === 1 ? 'riga' : 'righe'})`}
            </Button>
          ) : (
            <p className="text-sm font-medium" data-testid="balances-import-nothing">
              Niente da importare: è tutto già aggiornato.
            </p>
          )}
        </Card>
      )}
    </div>
  )
}

function MonthRow({ m }: { m: BalanceMonthDiff }) {
  const s = STATUS[m.status]
  const detail = [
    m.added && `${m.added} nuovi`,
    m.changed && `${m.changed} cambiati`,
    m.removed && `${m.removed} tolti`,
  ]
    .filter(Boolean)
    .join(', ')
  return (
    <li
      className="flex min-h-10 flex-wrap items-center gap-x-3 rounded-xl border border-slate-200 px-3 py-1.5 text-sm dark:border-slate-700"
      data-testid="balances-import-row"
    >
      <span className="w-20 font-medium">{monthLabel(m.month)}</span>
      <span className={`text-xs font-semibold ${s.cls}`}>{s.label}</span>
      <span className="ml-auto text-xs tabular-nums">
        {m.before !== null && m.status !== 'unchanged' && (
          <span className="text-slate-500 line-through dark:text-slate-400">{euro(m.before)}</span>
        )}
        {m.before !== null && m.after !== null && m.status !== 'unchanged' && ' → '}
        {m.after !== null ? euro(m.after) : '—'}
      </span>
      {detail && <span className="w-full text-xs text-slate-500 dark:text-slate-400">conti: {detail}</span>}
    </li>
  )
}
