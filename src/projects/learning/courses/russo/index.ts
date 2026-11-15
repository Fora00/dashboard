import type { Course } from '../../types'
import { russoA } from './a'
import { russoB } from './b'
import { russoC } from './c'

// Russian course for an Italian speaker, A1, text only, readable offline (2026-11-14).
export const russo: Course = {
  id: 'russo',
  title: 'Russo: A1',
  emoji: '🇷🇺',
  summary:
    'Alfabeto cirillico, pronuncia e accento, saluti, numeri e date, casi di base (strumentale in blocchi), presente e passato, aspetto, verbi di moto, imperativo, vocabolario, dialoghi e preparazione al TORFL A1.',
  intro:
    'Corso di russo per italiani, livello A1 del QCER. Ogni modulo ha lezione, quiz, flashcard ed esercizi, con attenzione alle trappole di chi parla italiano: alfabeto cirillico (В Н Р С У Х sembrano latine ma non lo sono), accento libero, vocali ridotte, consonanti dure e morbide, nessun verbo essere al presente, aspetto, verbi di moto. Ordine consigliato: comincia con Alfabeto e Pronuncia, poi Saluti, Essere, Nomi, Aggettivi, Presente, Casi, Domande, Passato, Verbi di moto; il vocabolario e i dialoghi si studiano in parallelo; l’ultimo modulo prepara all’esame. Pronuncia tra [ ] con ortografia italiana, sillaba accentata in MAIUSCOLO: sh = «sc» di scena (ш), zh = «j» francese (ж), shsh = sc lunga e morbida (щ), ts = ц, c/ci = ч di «ciao», h = х raschiata, y = ы (i con la lingua indietro), ’ = consonante morbida (ь), ia/ie/iu/io = я/е/ю/ё dopo consonante, vocali atone ridotte (молоко́ [ma-la-KO]). Nessun audio: per sentire la lingua usa la voce russa dell’iPhone (Impostazioni > Accessibilità > Contenuto letto ad alta voce > Voci > Russo) e fai leggere i testi del corso. Ogni parola russa ha l’accento acuto (nei testi normali non è scritto).',
  groups: [
    { id: 'a1', label: 'A1 · Le basi' },
    { id: 'voc', label: 'Vocabolario per temi' },
    { id: 'drill', label: 'Allenamento ed esame' },
  ],
  modules: [...russoA, ...russoB, ...russoC],
  notes: [
    'Livello di riferimento: A1 del QCER (TORFL Элемента́рный). Nessun audio: la pronuncia è spiegata con approssimazioni italiane e controllata meccanicamente (respell.test.ts) su sillabe, accento e consonanti.',
  ],
}
