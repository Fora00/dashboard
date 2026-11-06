import type { Course } from '../types'
import { franceseA } from './francese.a'
import { franceseB } from './francese.b'

// French course for an Italian speaker, A1 -> B2, text only, readable offline (2026-11-06).
export const francese: Course = {
  id: 'francese',
  title: 'Francese: da A1 a B2',
  emoji: '🇫🇷',
  summary: 'Pronuncia, grammatica, vocabolario, falsi amici, francofonia, dialoghi, esercizi e preparazione al DELF.',
  intro:
    'Corso di francese per italiani, dal livello A1 al B2 del QCER. Ogni modulo ha lezione, quiz, flashcard ed esercizi, con attenzione alle trappole tipiche di chi parla italiano (pronuncia e ortografia lontane, partitivi, accordo del participio, subjonctif, falsi amici). Pensato per la lettura offline: studia un modulo al giorno, fai il quiz, ripassa le flashcard e scrivi le risposte agli esercizi prima di guardare la soluzione. Pronuncia tra [ ] con lettere italiane, ultima sillaba del gruppo in MAIUSCOLO: ë = e debole, ü e ö = i ed e a labbra tonde, õ ã ẽ = nasali (la n non si pronuncia), zh = j dolce, sh = ch, y = i veloce, ò = o aperta; consonanti finali senza vocale (TABL), liaison attaccata alla sillaba dopo (il-ZÕ). Leggi prima il modulo di pronuncia.',
  groups: [
    { id: 'a1', label: 'A1 · Le basi' },
    { id: 'a2', label: 'A2 · Passato, futuro e pronomi' },
    { id: 'b1', label: 'B1 · Subjonctif e tempi composti' },
    { id: 'b2', label: 'B2 · Registri, francofonia e trappole' },
    { id: 'voc', label: 'Vocabolario per temi' },
    { id: 'drill', label: 'Allenamento ed esame' },
  ],
  modules: [...franceseA, ...franceseB],
  notes: [
    'Standard di riferimento: francese di Francia, con le varianti francofone segnalate. Nessun audio: la pronuncia è spiegata con approssimazioni italiane.',
  ],
}
