import type { Course } from '../types'
import { gaps, langs } from './backend-interview-lab.extra'
import { modules } from './backend-interview-lab.modules'

// Module ids are stable (progress is keyed by them); the generated file keeps
// the prototype's order. `col` (the interview itself) closes the course in its
// own group and `proj` belongs to the stack group, as in the prototype.
const GROUP_OVERRIDE: Record<string, string> = { col: 'finale' }

const VERIFY: Record<string, string> = {
  gcp: 'Mappa generica dei servizi, non verificata su quello che Open Move usa davvero: da confermare con Farina.',
}

export const backendInterviewLab: Course = {
  id: 'backend-interview-lab',
  title: 'Backend Interview Lab',
  emoji: '🧪',
  summary: 'Preparazione al colloquio backend da Open Move: dall’API al deploy.',
  intro:
    'Corso a moduli per preparare il colloquio da Open Move. Lezione breve, quiz, flashcard e simulazione a voce alta per ogni argomento. I primi moduli valgono per ogni backend; gli ultimi seguono lo stack che usano (JS/TS, Fastify, Postgres, Mongo, RabbitMQ, Helm, GCP). Chiudi con il mini-progetto.',
  groups: [
    { id: 'general', label: 'Moduli generali' },
    { id: 'stack', label: 'Stack Open Move' },
    { id: 'finale', label: 'Il colloquio' },
  ],
  modules: [...modules, langs, gaps].map((m) => ({
    ...m,
    group: GROUP_OVERRIDE[m.id] ?? m.group ?? 'general',
    ...(VERIFY[m.id] ? { verify: VERIFY[m.id] } : {}),
  })),
  references: [
    {
      label: 'Checklist nel vault',
      path: '~/Dev/personal-work-learning/career/backend-interview-checklist.md',
      note: 'Rimanda agli stessi argomenti. Solo un riferimento, nessuna integrazione.',
    },
  ],
  notes: [
    'Alcuni esempi nei moduli generali (Celery, Django) sono in Python: i concetti valgono comunque anche con Node.',
  ],
}
