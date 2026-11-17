// Search across every course (pure, unit-tested in courseSearch.test.ts). Matches are accent- and
// case-insensitive (same folding as the Vocabolario search). Lesson hits point at the <h3> section
// they fall in, numbered like headingsOf / HtmlText anchors, so the module page can scroll there.
import { htmlToText } from './html'
import type { Course, CourseModule } from './types'
import { normalize } from '../vocab/search'

export type HitKind = 'module' | 'section' | 'lesson' | 'quiz' | 'card' | 'practice'

export interface CourseHit {
  course: Course
  module: CourseModule
  kind: HitKind
  /** What matched: module title, section heading, or the item's first line. */
  label: string
  /** Text around the match, split so the UI can highlight it. */
  snippet: { before: string; match: string; after: string } | null
  tab: 'lesson' | 'quiz' | 'cards' | 'practice'
  /** Lesson section index (anchor `lez-<n>`), when the hit is inside one. */
  section?: number
}

const RANK: Record<HitKind, number> = { module: 0, section: 1, lesson: 2, quiz: 3, card: 3, practice: 3 }

/** Folds case and accents without changing length (NFC input), so indexes map back to the shown text. */
const fold = (s: string) => s.normalize('NFD').replace(/\p{M}/gu, '').normalize('NFC').toLowerCase()
// Blocks (paragraphs, cells, items) end with a space so their texts don't run together.
const flat = (html: string) =>
  htmlToText(html.replace(/<\/(p|li|h3|h4|td|th|div|tr|pre)>|<br\s*\/?>/gi, '$& '))
    .replace(/\s+/g, ' ')
    .trim()

function snippetOf(text: string, q: string, radius = 60): CourseHit['snippet'] {
  // NFD + strip marks keeps one char per precomposed letter, so positions match `text`.
  const at = fold(text).indexOf(q)
  if (at < 0 || fold(text).length !== text.length) return null
  const s = Math.max(0, at - radius)
  const e = Math.min(text.length, at + q.length + radius)
  return {
    before: (s > 0 ? '…' : '') + text.slice(s, at),
    match: text.slice(at, at + q.length),
    after: text.slice(at + q.length, e) + (e < text.length ? '…' : ''),
  }
}

interface Section {
  heading: string | null
  index?: number
  text: string
}

// Lesson split at each <h3> (nested ones too, same order as the anchors). Cached per module object.
const sectionCache = new WeakMap<CourseModule, Section[]>()
function sectionsOf(m: CourseModule): Section[] {
  const hit = sectionCache.get(m)
  if (hit) return hit
  let n = 0
  const out = m.lesson.split(/(?=<h3[\s>])/i).map((part): Section => {
    if (!/^<h3[\s>]/i.test(part)) return { heading: null, text: flat(part) }
    const close = part.search(/<\/h3>/i)
    const heading = flat(close < 0 ? part : part.slice(0, close))
    return { heading, index: n++, text: flat(close < 0 ? '' : part.slice(close)) }
  })
  sectionCache.set(m, out)
  return out
}

/** Hits across `courses`, best first (titles, headings, lesson text, then items); empty under 2 chars. */
export function searchCourses(courses: readonly Course[], query: string, limit = 60): CourseHit[] {
  const q = normalize(query)
  if (q.length < 2) return []
  const hits: (CourseHit & { order: number })[] = []
  let order = 0
  const has = (s: string) => normalize(s).includes(q)
  for (const course of courses)
    for (const module of course.modules) {
      const base = { course, module, order: order++ }
      if (has(module.title) || has(module.subtitle))
        hits.push({
          ...base,
          kind: 'module',
          label: module.title,
          snippet: snippetOf(module.subtitle, q),
          tab: 'lesson',
        })
      for (const s of sectionsOf(module)) {
        const where = s.index === undefined ? {} : { section: s.index }
        if (s.heading && has(s.heading))
          hits.push({ ...base, ...where, kind: 'section', label: s.heading, snippet: null, tab: 'lesson' })
        else if (has(s.text))
          hits.push({
            ...base,
            ...where,
            kind: 'lesson',
            label: s.heading ?? module.title,
            snippet: snippetOf(s.text, q),
            tab: 'lesson',
          })
      }
      for (const x of module.quiz) {
        const text = flat(`${x.q} ${x.options.join(' · ')} ${x.explanation}`)
        if (has(text)) hits.push({ ...base, kind: 'quiz', label: flat(x.q), snippet: snippetOf(text, q), tab: 'quiz' })
      }
      for (const x of module.cards) {
        const text = flat(`${x.front} — ${x.back}`)
        if (has(text))
          hits.push({ ...base, kind: 'card', label: flat(x.front), snippet: snippetOf(text, q), tab: 'cards' })
      }
      for (const x of module.practice) {
        const text = flat(`${x.question} ${x.answer}`)
        if (has(text))
          hits.push({
            ...base,
            kind: 'practice',
            label: flat(x.question),
            snippet: snippetOf(text, q),
            tab: 'practice',
          })
      }
    }
  return hits
    .sort((a, b) => RANK[a.kind] - RANK[b.kind] || a.order - b.order)
    .slice(0, limit)
    .map(({ order: _order, ...h }) => h)
}

/** Count before the limit, for "showing 60 of N". */
export const countCourseHits = (courses: readonly Course[], query: string) =>
  searchCourses(courses, query, Number.MAX_SAFE_INTEGER).length
