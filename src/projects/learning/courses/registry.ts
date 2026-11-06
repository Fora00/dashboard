import type { Course } from '../types'

// Lightweight course list + lazy content. The UI imports ONLY this file; the full
// `courses` array in ./index.ts is for tests (it pulls every course into one chunk).
// A course = meta here + `load` doing a dynamic import (own chunk, precached by the PWA).
export interface CourseMeta {
  id: string
  title: string
  emoji: string
  summary: string
  moduleCount: number
  load: () => Promise<Course>
}

export const courseMetas: CourseMeta[] = [
  {
    id: 'backend-interview-lab',
    title: 'Full Stack Interview Lab',
    emoji: '🧪',
    summary: 'Preparazione al colloquio full stack da Open Move: backend, frontend, mobile e live coding.',
    moduleCount: 37,
    load: () => import('./backend-interview-lab').then((m) => m.backendInterviewLab),
  },
  {
    id: 'python-path',
    title: 'Python: percorso completo',
    emoji: '🐍',
    summary: 'Da JS/TS a Python per il backend: base, oggetti, stile pythonic, API, test e deploy. Tutto offline.',
    moduleCount: 47,
    load: () => import('./python-path').then((m) => m.pythonPath),
  },
  {
    id: 'databases-path',
    title: 'Database: dal SQL a Postgres in produzione',
    emoji: '🗄️',
    summary:
      'SQL, schema, indici, transazioni, Postgres operativo, NoSQL e ORM, con esercizi e domande da colloquio. Offline.',
    moduleCount: 20,
    load: () => import('./databases-path').then((m) => m.databasesPath),
  },
  {
    id: 'api-path',
    title: 'API: capirle, interrogarle e testarle',
    emoji: '🔌',
    summary:
      'HTTP, REST, curl, Bruno, Postman, autenticazione, OpenAPI, GraphQL, test e debug, con esercizi e domande da colloquio.',
    moduleCount: 20,
    load: () => import('./api-path').then((m) => m.apiPath),
  },
  {
    id: 'disegno',
    title: 'Disegno da zero',
    emoji: '✏️',
    summary: 'Dal segno ai solidi e alla luce, con figure disegnate. Esercizi su carta.',
    moduleCount: 17,
    load: () => import('./disegno').then((m) => m.disegno),
  },
  {
    id: 'spagnolo',
    title: 'Spagnolo: da A1 a B2',
    emoji: '🇪🇸',
    summary:
      'Pronuncia, grammatica, vocabolario, falsi amici, varianti latinoamericane, dialoghi, esercizi e preparazione al DELE.',
    moduleCount: 29,
    load: () => import('./spagnolo').then((m) => m.spagnolo),
  },
  {
    id: 'francese',
    title: 'Francese: da A1 a B2',
    emoji: '🇫🇷',
    summary: 'Pronuncia, grammatica, vocabolario, falsi amici, francofonia, dialoghi, esercizi e preparazione al DELF.',
    moduleCount: 31,
    load: () => import('./francese').then((m) => m.francese),
  },
  {
    id: 'tedesco',
    title: 'Tedesco: da A1 a B2',
    emoji: '🇩🇪',
    summary:
      'Pronuncia, casi, ordine delle parole, vocabolario, falsi amici, Austria e Svizzera, dialoghi, esercizi e preparazione al Goethe/ÖSD.',
    moduleCount: 30,
    load: () => import('./tedesco').then((m) => m.tedesco),
  },
]

const loaded = new Map<string, Course>()
const pending = new Map<string, Promise<Course>>()

export const courseMetaById = (id: string): CourseMeta | undefined => courseMetas.find((m) => m.id === id)

/** Already-loaded course (sync), if any. */
export const loadedCourse = (id: string): Course | undefined => loaded.get(id)

/** Loads a course chunk once; resolves undefined for an unknown id. */
export async function loadCourse(id: string): Promise<Course | undefined> {
  const hit = loaded.get(id)
  if (hit) return hit
  const meta = courseMetaById(id)
  if (!meta) return undefined
  let p = pending.get(id)
  if (!p) {
    p = meta.load().then((c) => {
      loaded.set(id, c)
      pending.delete(id)
      return c
    })
    p.catch(() => pending.delete(id))
    pending.set(id, p)
  }
  return p
}
