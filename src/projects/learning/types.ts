// Course content is static data shipped in the bundle; only the learner's state
// (quiz answers, known cards, practice notes) lives in Dexie. A course is one
// data file in courses/ plus one line in courses/index.ts.

export interface QuizQuestion {
  /** Stable within the module (progress is keyed by it, never by position). */
  id: string
  /** Light HTML (see sanitizeHtml.ts). */
  q: string
  options: string[]
  /** Index into `options`. */
  answer: number
  explanation: string
}

export interface Flashcard {
  /** Stable within the module. */
  id: string
  front: string
  back: string
}

export interface PracticeItem {
  /** Stable within the module. */
  id: string
  question: string
  /** Model answer, revealed on demand. */
  answer: string
}

export interface CourseModule {
  /** Stable: progress rows are keyed by it. */
  id: string
  title: string
  subtitle: string
  /** Id of one of the course's `groups`; absent = the first group. */
  group?: string
  /** HTML hint about related notes in the owner's vault. */
  vault: string
  /** HTML: <p>, <h3>, <ul>/<ol>, <table>, <pre><code>, <div class="say">. */
  lesson: string
  quiz: QuizQuestion[]
  cards: Flashcard[]
  practice: PracticeItem[]
  /** Visible "to verify" marker (content not checked against reality yet). */
  verify?: string
}

export interface CourseGroup {
  id: string
  label: string
}

export interface CourseReference {
  label: string
  /** Shown as plain text, not a link: it lives on the owner's Mac. */
  path: string
  note?: string
}

export interface Course {
  /** Stable: progress rows are keyed by it. */
  id: string
  title: string
  emoji: string
  summary: string
  intro: string
  /** Display order; modules reference these by id. */
  groups: CourseGroup[]
  modules: CourseModule[]
  references?: CourseReference[]
  /** Caveats shown on the course page. */
  notes?: string[]
}
