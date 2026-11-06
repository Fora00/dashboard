import type { Course } from '../types'
import { tedescoA } from './tedesco.a'
import { tedescoB } from './tedesco.b'

// German course for an Italian speaker, A1 -> B2, text only, readable offline (2026-11-06).
export const tedesco: Course = {
  id: 'tedesco',
  title: 'Tedesco: da A1 a B2',
  emoji: '🇩🇪',
  summary:
    'Pronuncia, casi, ordine delle parole, vocabolario, falsi amici, Austria e Svizzera, dialoghi, esercizi e preparazione al Goethe/ÖSD.',
  intro:
    'Corso di tedesco per italiani, dal livello A1 al B2 del QCER. Ogni modulo ha lezione, quiz, flashcard ed esercizi, con attenzione alle trappole tipiche di chi parla italiano (casi, genere dei nomi, posizione del verbo, verbi separabili, parole composte, falsi amici). Pensato per la lettura offline: studia un modulo al giorno, fai il quiz, ripassa le flashcard e scrivi le risposte agli esercizi prima di guardare la soluzione. Pronuncia tra [ ] con lettere italiane, sillaba accentata in MAIUSCOLO: sh = sc di scena, ç = suono soffiato di ich, ch = suono raschiato di Bach, ts = z sorda, z = s sonora di rosa, ü ö = i ed e a labbra tonde, «:» = vocale lunga. Leggi prima il modulo di pronuncia.',
  groups: [
    { id: 'a1', label: 'A1 · Le basi' },
    { id: 'a2', label: 'A2 · Casi, passato e subordinate' },
    { id: 'b1', label: 'B1 · Subordinate, relative e Konjunktiv II' },
    { id: 'b2', label: 'B2 · Registri, varianti e trappole' },
    { id: 'voc', label: 'Vocabolario per temi' },
    { id: 'drill', label: 'Allenamento ed esame' },
  ],
  modules: [...tedescoA, ...tedescoB],
  notes: [
    'Standard di riferimento: tedesco standard (Hochdeutsch), con le varianti austriache e svizzere segnalate. Nessun audio: la pronuncia è spiegata con approssimazioni italiane.',
  ],
}
