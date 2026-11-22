import { CHIP_BASE, CHIP_TONE, STATE_CELL, STATE_ICON, UNVERIFIED_CELL } from './habitStates'

const DAYS = [
  ['done', 'Fatto: la versione normale'],
  ['floor', 'Minimo: solo il minimo (conta come fatto)'],
  ['skip', 'Riposo: voluto, mai un mancato'],
  ['fail', 'Mancato (può avere il motivo del vuoto)'],
  ['missed', 'Mancato, non segnato: un giorno passato di un’abitudine quotidiana lasciato vuoto'],
  ['empty', 'Vuoto: niente segnato (oggi, o un’abitudine non quotidiana)'],
] as const

/** The week chips at the end of a calendar row (same look as habitCalendarData's chips). */
const CHIPS = [
  ['hit', '✓', 'Settimana verificata e rispettata'],
  ['miss', '≥2 ✕', 'Settimana mancata: almeno N estensioni dimostrate dai dati'],
  ['unverified', '?', 'Settimana da verificare: manca la risposta “App più usate”'],
] as const

const TILE = [
  [
    'bg-emerald-400',
    'Abitudini quotidiane: un anello di sette segmenti, uno per giorno da lunedì a domenica (quello spesso è oggi)',
  ],
  ['bg-emerald-400', 'Abitudini settimanali, anello verde: l’obiettivo della settimana è raggiunto'],
  ['bg-amber-400', 'Abitudini settimanali, anello ambra: la settimana è ancora in corso'],
  ['bg-amber-300/40', 'Riquadro ambra: dopo un giorno vuoto viene offerto il minimo; un tocco lo segna'],
] as const

/** Cosa significano colori e icone. Usata under the tiles and the calendar. */
export function HabitLegend() {
  return (
    <details className="mt-3 rounded-xl border border-slate-200 p-3 text-xs text-slate-600 dark:border-slate-800 dark:text-slate-400">
      <summary className="cursor-pointer font-medium">Legenda: colori e icone</summary>
      <ul className="mt-2 space-y-1.5">
        {DAYS.map(([state, label]) => (
          <li key={state} className="flex items-center gap-2">
            <span className={`flex size-6 shrink-0 items-center justify-center rounded-full ${STATE_CELL[state]}`}>
              {state === 'empty' ? '' : STATE_ICON[state]}
            </span>
            {label}
          </li>
        ))}
        <li className="flex items-center gap-2">
          <span
            data-testid="legend-unverified"
            className={`flex size-6 shrink-0 items-center justify-center rounded-full ${UNVERIFIED_CELL}`}
          />
          Da verificare: abitudine complessa, giorno “tenuto” non provato finché la domenica non arrivano le “App più
          usate”
        </li>
        {CHIPS.map(([tone, text, label]) => (
          <li key={tone} className="flex items-center gap-2">
            <span data-testid="legend-chip" className={`${CHIP_BASE} min-w-11 shrink-0 ${CHIP_TONE[tone]}`}>
              {text}
            </span>
            {label}
          </li>
        ))}
        {TILE.map(([swatch, label]) => (
          <li key={label} className="flex items-center gap-2">
            <span className={`ml-1.5 size-3 shrink-0 rounded-full ${swatch}`} />
            <span className="ml-1.5">{label}</span>
          </li>
        ))}
        <li>
          Tocco su un riquadro = fatto oggi. Tieni premuto = minimo, riposo o mancato. ⋯ = scheda rapida; “Apri
          dettaglio” porta a statistiche, calendario e impostazioni.
        </li>
        <li>
          La serie è in giorni (o settimane per le abitudini “N volte a settimana”); i giorni di riposo non la spezzano.
        </li>
      </ul>
    </details>
  )
}
