import { DATE, INPUT } from '../../components/field'
import { useState, type FormEvent, type ReactNode } from 'react'
import type { HabitKind, HabitVerdict } from '../../lib/db'
import { Button } from '../../components/Button'
import { cleanLimits, MAX_EMOJI_LENGTH, MAX_NAME_LENGTH, MAX_TEXT_LENGTH } from '../../lib/habitSync'
import { ENGINES } from '../life/model/engines'
import { shiftDayKey } from './habitStats'
import { AppLimitsEditor } from './AppLimitsEditor'
import { AVOID_IDEAS, AVOID_PRESETS, CYCLE_DAYS, IDEAS, PRESETS, type HabitFormValues } from './habitFormDefaults'

const CHIP = 'min-h-10 rounded-lg border px-3 text-sm'
const CHIP_ON = 'border-(color:--accent-ring) bg-(color:--accent)/15'
const CHIP_OFF = 'border-slate-300 dark:border-slate-700'

const VERDICTS: { value: HabitVerdict; label: string }[] = [
  { value: 'up', label: '⬆ su' },
  { value: 'stay', label: '＝ resta' },
  { value: 'down', label: '⬇ giù' },
  { value: 'closed', label: '✕ chiusa' },
]
const KINDS: { value: HabitKind; label: string; hint: string }[] = [
  { value: 'forever', label: '♾ Per sempre', hint: 'una delle 2–3 che voglio davvero per la vita' },
  {
    value: 'experiment',
    label: '🧪 Esperimento',
    hint: 'una prova con una data di fine, chiudibile senza sensi di colpa',
  },
]

interface Props {
  initial: HabitFormValues
  submitLabel: string
  onSubmit: (values: HabitFormValues) => void | Promise<void>
  /** Show the starting-point presets (new habit only). */
  presets?: boolean
  /** Show the verdict row (editing a cycle). */
  verdict?: boolean
  /** Extra button next to submit (e.g. Archive). */
  extra?: ReactNode
}

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="text-sm font-medium">{label}</span>
      {hint && <span className="block text-xs text-slate-500 dark:text-slate-400">{hint}</span>}
      {children}
    </label>
  )
}

/** The add and edit form for a habit: the same guided fields in both places. */
export function HabitForm({ initial, submitLabel, onSubmit, presets, verdict, extra }: Props) {
  const [v, setV] = useState(initial)
  const avoid = v.direction === 'avoid'
  const set = <K extends keyof HabitFormValues>(key: K, value: HabitFormValues[K]) =>
    setV((prev) => ({ ...prev, [key]: value }))

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (!v.name.trim()) return
    await onSubmit(v)
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div role="group" aria-label="Direzione" className="space-y-1">
        <span className="text-sm font-medium">Che tipo di abitudine</span>
        <div className="flex gap-2">
          {(
            [
              ['do', '✅ Da fare'],
              ['avoid', '🚫 Da evitare'],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              aria-pressed={v.direction === value}
              onClick={() =>
                setV((prev) => ({
                  ...prev,
                  direction: value,
                  target: value === 'avoid' ? 7 : prev.target,
                  perDay: value === 'avoid' ? 1 : prev.perDay,
                  grace: value === 'avoid' ? prev.grace : 0,
                  // A measured habit counts slips: only a habit to avoid can be one.
                  measure: value === 'avoid' ? prev.measure : undefined,
                }))
              }
              className={`${CHIP} flex-1 ${v.direction === value ? CHIP_ON : CHIP_OFF}`}
            >
              {label}
            </button>
          ))}
        </div>
        <span className="block text-xs text-slate-500 dark:text-slate-400">
          {avoid
            ? 'Tenuta ogni giorno finché non segni uno scivolone. Contano solo i giorni in cui hai usato l’app, così un registro fermo non sembra mai una serie perfetta.'
            : 'Fatta quando la tocchi (o raggiungi i tocchi impostati).'}
        </span>
      </div>

      <div role="group" aria-label="Verifica" className="space-y-1">
        <span className="text-sm font-medium">Verifica</span>
        <div className="flex gap-2">
          {(
            [
              [undefined, '✋ a mano'],
              ['app-limits', '📱 limiti app'],
            ] as const
          ).map(([value, label]) => (
            <button
              key={label}
              type="button"
              aria-pressed={v.measure === value}
              onClick={() =>
                setV((prev) => ({
                  ...prev,
                  measure: value,
                  ...(value ? { direction: 'avoid' as const, target: 7, perDay: 1 } : {}),
                }))
              }
              className={`${CHIP} flex-1 ${v.measure === value ? CHIP_ON : CHIP_OFF}`}
            >
              {label}
            </button>
          ))}
        </div>
        <span className="block text-xs text-slate-500 dark:text-slate-400">
          {v.measure === 'app-limits'
            ? 'Abitudine complessa: le spunte restano, ma la domenica le “App più usate” provano il minimo di estensioni (una ogni 15 min oltre 7 × il limite). Conta il più alto dei due; senza dati la settimana resta da verificare.'
            : 'Conta solo quello che segni.'}
        </span>
        {v.measure === 'app-limits' && (
          <AppLimitsEditor value={v.measureLimits} onChange={(rows) => set('measureLimits', rows)} />
        )}
      </div>

      {presets && (
        <details className="rounded-xl border border-slate-200 p-3 text-sm dark:border-slate-800">
          <summary className="cursor-pointer font-medium">Idee e abitudini pronte</summary>
          <div className="mt-3 space-y-3">
            {[
              { area: avoid ? '⭐ Pronte' : '⭐ I cicli di novembre', items: avoid ? AVOID_PRESETS : PRESETS },
              ...(avoid ? [{ area: '🚫 Altre da evitare', items: AVOID_IDEAS }] : IDEAS),
            ].map((g) => (
              <div key={g.area}>
                <p className="mb-1.5 text-xs text-slate-500 dark:text-slate-400">{g.area}</p>
                <div className="flex flex-wrap gap-2">
                  {g.items.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => setV((prev) => ({ ...prev, ...p.values }))}
                      className={`${CHIP} ${CHIP_OFF}`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </details>
      )}

      <div className="flex gap-2">
        <input
          value={v.emoji}
          onChange={(e) => set('emoji', e.target.value)}
          placeholder="✅"
          maxLength={MAX_EMOJI_LENGTH}
          autoComplete="off"
          aria-label="Emoji"
          className={`${INPUT} w-14 text-center`}
        />
        <input
          value={v.name}
          onChange={(e) => set('name', e.target.value)}
          placeholder="Nome, es. Diario"
          maxLength={MAX_NAME_LENGTH}
          autoComplete="off"
          required
          aria-label="Nome"
          className={INPUT}
        />
      </div>

      <Field
        label="Perché"
        hint="A cosa serve e cosa mi costa. Un’abitudine senza un prezzo dichiarato si molla alla prima settimana storta."
      >
        <input
          value={v.why}
          onChange={(e) => set('why', e.target.value)}
          maxLength={MAX_TEXT_LENGTH}
          className={INPUT}
        />
      </Field>

      <div role="group" aria-label="Con chi" className="space-y-1">
        <span className="text-sm font-medium">Con chi</span>
        <span className="block text-xs text-slate-500 dark:text-slate-400">
          Le abitudini con una persona reggono; quelle da soli sono le fragili.
        </span>
        <div className="flex gap-2">
          {(
            [
              ['person', '👥 Con una persona'],
              ['alone', '🧍 Da solo'],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              aria-pressed={v.social === value}
              onClick={() => set('social', v.social === value ? undefined : value)}
              className={`${CHIP} flex-1 ${v.social === value ? CHIP_ON : CHIP_OFF}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <Field
        label={avoid ? 'Cosa faccio invece' : 'Ancora'}
        hint={
          avoid
            ? 'Quando arriva la voglia: il sostituto che rende tutto più facile.'
            : 'Dopo cosa, e dove. Un’abitudine con un’àncora sopravvive; senza, va alla deriva.'
        }
      >
        <input
          value={v.anchor}
          onChange={(e) => set('anchor', e.target.value)}
          placeholder="Dopo cena, il diario sul tavolo"
          maxLength={MAX_TEXT_LENGTH}
          className={INPUT}
        />
      </Field>

      <>
        <Field
          label={avoid ? 'Ideale' : 'Versione normale'}
          hint={avoid ? 'Come è un giorno pulito: nessuno.' : 'Come è un buon giorno.'}
        >
          <input
            value={v.normal}
            onChange={(e) => set('normal', e.target.value)}
            maxLength={MAX_TEXT_LENGTH}
            className={INPUT}
          />
        </Field>

        <Field
          label={avoid ? 'Limite (il minimo)' : 'Minimo'}
          hint={
            avoid
              ? 'Il massimo che mi concedo in un giorno storto. Restarci dentro vale ancora come tenuto; superarlo è uno scivolone.'
              : 'La versione più piccola che conta ancora, nel tuo giorno peggiore. Vale sempre; tutto il resto è un bonus.'
          }
        >
          <input
            value={v.floor}
            onChange={(e) => set('floor', e.target.value)}
            placeholder={avoid ? 'Un caffè, prima di mezzogiorno' : 'Data + una riga'}
            maxLength={MAX_TEXT_LENGTH}
            className={INPUT}
          />
        </Field>
        {!v.floor.trim() && (
          <p className="-mt-2 text-xs text-amber-700 dark:text-amber-300">
            {avoid
              ? 'Ancora nessun limite: ogni giorno storto conterà come scivolone pieno.'
              : 'Ancora nessun minimo: in un giorno storto non hai niente su cui ripiegare.'}
          </p>
        )}
      </>
      {avoid && (
        <div role="group" aria-label="Tolleranza" className="space-y-1">
          <span className="text-sm font-medium">Tolleranza</span>
          <div className="flex gap-2" role="group" aria-label="Ambito della tolleranza">
            {(
              [
                ['day', 'al giorno'],
                ['week', 'a settimana'],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                aria-pressed={v.graceScope === value}
                onClick={() => set('graceScope', value)}
                className={`${CHIP} flex-1 ${v.graceScope === value ? CHIP_ON : CHIP_OFF}`}
              >
                scivoloni {label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {[0, 1, 2, 3, 4].map((n) => (
              <button
                key={n}
                type="button"
                aria-pressed={v.grace === n}
                onClick={() => set('grace', n)}
                className={`${CHIP} min-w-11 ${v.grace === n ? CHIP_ON : CHIP_OFF}`}
              >
                {n === 0 ? 'nessuno' : `${n}×`}
              </button>
            ))}
          </div>
          <span className="block text-xs text-slate-500 dark:text-slate-400">
            {v.grace === 0
              ? 'Ogni scivolone spezza la serie.'
              : v.graceScope === 'day'
                ? `Ogni tocco sul riquadro è uno scivolone. Fino a ${v.grace} al giorno contano ancora come giorno tenuto (mostrato come nella tolleranza); il successivo di quel giorno è uno scivolone vero.`
                : `${v.grace} scivolon${v.grace === 1 ? 'e' : 'i'} a settimana ${v.grace === 1 ? 'è tollerato e non spezza' : 'sono tollerati e non spezzano'} la serie; il successivo sì. Lo specchio di un obiettivo settimanale: qui è un tetto.`}
          </span>
        </div>
      )}
      {!avoid && (
        <>
          <div role="group" aria-label="Volte a settimana" className="space-y-1">
            <span className="text-sm font-medium">Quanto spesso</span>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                <button
                  key={n}
                  type="button"
                  aria-pressed={v.target === n}
                  onClick={() => set('target', n)}
                  className={`${CHIP} min-w-11 ${v.target === n ? CHIP_ON : CHIP_OFF}`}
                >
                  {n === 7 ? 'ogni giorno' : `${n}×`}
                </button>
              ))}
            </div>
            <span className="block text-xs text-slate-500 dark:text-slate-400">
              {v.target === 7
                ? 'Ogni giorno: vale la regola dei due giorni (mai saltare due volte).'
                : `${v.target} volte a settimana: l’anello conta la settimana, in qualsiasi giorno.`}
            </span>
          </div>

          <div role="group" aria-label="Tocchi al giorno" className="space-y-1">
            <span className="text-sm font-medium">Tocchi al giorno</span>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5, 6, 8, 10].map((n) => (
                <button
                  key={n}
                  type="button"
                  aria-pressed={v.perDay === n}
                  onClick={() => set('perDay', n)}
                  className={`${CHIP} min-w-11 ${v.perDay === n ? CHIP_ON : CHIP_OFF}`}
                >
                  {n === 1 ? 'una volta' : `${n}×`}
                </button>
              ))}
            </div>
            <span className="block text-xs text-slate-500 dark:text-slate-400">
              {v.perDay === 1
                ? 'Un tocco e il giorno è fatto.'
                : `Tocca ${v.perDay} volte al giorno (bicchieri d’acqua, pasti…): il giorno è fatto a ${v.perDay}.`}
            </span>
          </div>
        </>
      )}

      <div role="group" aria-label="Engine" className="space-y-1">
        <span className="text-sm font-medium">Engine</span>
        <span className="block text-xs text-slate-500 dark:text-slate-400">
          L’unica area di vita che questa abitudine alimenta (obbligatoria). La verifica del mese elenca le abitudini di
          ogni engine.
        </span>
        <div className="flex flex-wrap gap-2">
          {ENGINES.map((e) => (
            <button
              key={e.key}
              type="button"
              aria-pressed={v.engine === e.key}
              onClick={() => set('engine', e.key)}
              className={`${CHIP} ${v.engine === e.key ? CHIP_ON : CHIP_OFF}`}
            >
              {e.label}
            </button>
          ))}
        </div>
      </div>

      <div role="group" aria-label="Tipo" className="space-y-1">
        <span className="text-sm font-medium">Tipo</span>
        <div className="flex gap-2">
          {KINDS.map((k) => (
            <button
              key={k.value}
              type="button"
              aria-pressed={v.kind === k.value}
              onClick={() => set('kind', k.value)}
              className={`${CHIP} flex-1 ${v.kind === k.value ? CHIP_ON : CHIP_OFF}`}
            >
              {k.label}
            </button>
          ))}
        </div>
        <span className="block text-xs text-slate-500 dark:text-slate-400">
          {KINDS.find((k) => k.value === v.kind)?.hint}
        </span>
      </div>

      <div className="space-y-1">
        <span className="text-sm font-medium">Ciclo</span>
        <div className="flex gap-2">
          <label className="flex-1 text-xs text-slate-500">
            Inizio
            <input
              type="date"
              value={v.cycleStart}
              onChange={(e) => set('cycleStart', e.target.value)}
              className={DATE}
            />
          </label>
          <label className="flex-1 text-xs text-slate-500">
            Fine
            <input type="date" value={v.cycleEnd} onChange={(e) => set('cycleEnd', e.target.value)} className={DATE} />
          </label>
        </div>
        <Button
          type="button"
          variant="ghost"
          onClick={() => v.cycleStart && set('cycleEnd', shiftDayKey(v.cycleStart, CYCLE_DAYS - 1))}
          disabled={!v.cycleStart}
        >
          4 settimane dall’inizio
        </Button>
      </div>

      {verdict && (
        <div role="group" aria-label="Verdetto" className="space-y-1">
          <span className="text-sm font-medium">Verdetto</span>
          <div className="flex flex-wrap gap-2">
            {VERDICTS.map((x) => (
              <button
                key={x.value}
                type="button"
                aria-pressed={v.verdict === x.value}
                onClick={() => set('verdict', v.verdict === x.value ? undefined : x.value)}
                className={`${CHIP} ${v.verdict === x.value ? CHIP_ON : CHIP_OFF}`}
              >
                {x.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <Button
          type="submit"
          className="flex-1"
          disabled={
            !v.name.trim() ||
            v.engine === undefined ||
            (v.measure === 'app-limits' && cleanLimits(v.measureLimits).length === 0)
          }
        >
          {submitLabel}
        </Button>
        {extra}
      </div>
    </form>
  )
}
