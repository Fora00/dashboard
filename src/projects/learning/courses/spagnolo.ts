import type { Course } from '../types'
import { spagnoloA } from './spagnolo.a'
import { spagnoloB } from './spagnolo.b'

// Spanish course for an Italian speaker, A1 -> B2, text only, readable offline (2026-11-06).
export const spagnolo: Course = {
  id: 'spagnolo',
  title: 'Spagnolo: da A1 a B2',
  emoji: '🇪🇸',
  summary:
    'Pronuncia, grammatica, vocabolario, falsi amici, varianti latinoamericane, dialoghi, esercizi e preparazione al DELE.',
  intro:
    'Corso di spagnolo per italiani, dal livello A1 al B2 del QCER. Ogni modulo ha lezione, quiz, flashcard ed esercizi, con attenzione alle trappole tipiche di chi parla italiano (falsi amici, preposizioni, tempi del passato, subjuntivo). Pensato per la lettura offline: studia un modulo al giorno, fai il quiz, ripassa le flashcard e scrivi le risposte agli esercizi prima di guardare la soluzione. Pronuncia tra [ ] con ortografia italiana, sillaba accentata in MAIUSCOLO: th = think inglese (America: s), h = jota raschiata (mai muta), ss = s sorda anche tra vocali (casa [KA-ssa]), dh = d morbida (come in this), gn = ñ, gh = g dura davanti a e/i, c/ci = la ch spagnola, y = ll/y come in «ieri» (Rio de la Plata: sce), rr = r vibrata, la b vale sia b sia v. Leggi prima il modulo di pronuncia, che spiega anche sillabe, legami tra parole e intonazione.',
  groups: [
    { id: 'a1', label: 'A1 · Le basi' },
    { id: 'a2', label: 'A2 · Passato, futuro e pronomi' },
    { id: 'b1', label: 'B1 · Subjuntivo e tempi composti' },
    { id: 'b2', label: 'B2 · Registri, varianti e trappole' },
    { id: 'voc', label: 'Vocabolario per temi' },
    { id: 'drill', label: 'Allenamento ed esame' },
  ],
  modules: [...spagnoloA, ...spagnoloB],
  notes: [
    'Standard di riferimento: spagnolo di Spagna, con le differenze latinoamericane segnalate. Nessun audio: la pronuncia è spiegata con approssimazioni italiane.',
  ],
}
