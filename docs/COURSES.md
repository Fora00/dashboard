# Learning: how the code is laid out and how to write a course

Read this before touching `src/projects/learning/`. Status and queues live in `ROADMAP.md`
(Project 13, L22, "Learning refactor").

## Folders

```
src/projects/learning/
  Learning.tsx        routes only
  home/               the Learning home (Oggi, search, areas) and the area pages (/learning/<groupId>)
  course/             course page, photo diary
  module/             module page and its tabs (lesson, quiz, cards, practice, sketches)
  review/             Ripasso page, its queue hook, the home card
  vocab/              Vocabolario (dictionary, flashcards, Pronuncia)
  engine/             pure logic + data access: types, progress, html allowlist, HtmlText,
                      search, review schedule, Dexie read hooks, useCourse
  ui/                 small shared pieces (ProgressBar, CourseLoading, NotFound)
  figures/            SVG figures for Disegno (`<fig id="...">` in lesson HTML)
  courses/            CONTENT: one folder per course + registry + kit + tests
src/lib/learningSync.ts   every write (outbox + Supabase, owner-only)
src/lib/learningLocal.ts  local-only photo diary
```

Rule of thumb: pages read through `engine/store.ts` (or `review/useQueue.ts`) and write only through
`src/lib/learningSync.ts`. `engine/` never imports from pages.

## Adding a course (5 steps)

1. `courses/<id>/index.ts` exporting a `Course` (`engine/types.ts`): `id` (stable, no `:`, ≤ 60 chars:
   progress rows are keyed by it), `title`, `emoji`, `summary`, `intro`, `groups`, `modules`, optional
   `notes`/`references`. Split modules over several files (`a.ts`, `b.ts`…) to keep files readable.
2. Build modules with the kit (`courses/kit.ts`): `mod(id, title, subtitle, group, lesson, quiz, cards,
   practice, vault?)`, `q(id, text, options, answerIndex, explanation)`, `card(id, front, back)`,
   `prac(id, question, answer)`. `q()` shuffles the options with a seed, so write the right answer
   anywhere and never rely on its slot. Saved answers store the option's position as written (author
   order, `engine/quizAnswer.ts`), so rewording a question or its options is safe; reordering, inserting
   or removing options of a live question is not (max 10 options per question).
3. Add it to `courses/index.ts` (eager list, tests only) AND to `courses/registry.ts` (meta + `load()` +
   `group`: `sviluppo`, `creativita`, `lingue`, or a new entry in `courseGroups`, which also gets its own
   page at `/learning/<groupId>`; course ids must differ from area ids, `ripasso` and `vocabolario`). The `lazy registry`
   test fails until title/emoji/summary/moduleCount match the content.
4. Add a profile to `PROFILES` in `courses/courses.test.ts` (module count, minimums, ratchets).
5. `npm run check` and `npm run build`.

## Writing content

- Text fields are light HTML through an allowlist (`engine/html.ts`): `p h3 h4 ul ol li b strong i em
  code pre br div span table thead tbody tr th td fig`, classes `lead say tblw`. Anything else is dropped,
  and the lint suite fails when a tag would be dropped. Write `<`, `>`, `&` as entities inside code.
- Lessons: sections as `<h3>` (they become the "In questa lezione" jump list and search anchors), concrete
  tables, the traps for an Italian speaker, a closing summary. Languages: ≥ 2500 characters per lesson.
- Quiz: 4 distinct options, an explanation of ≥ 8 words (languages), and distractors about as long as the
  right answer (the suite measures how often the right option is the longest; keep it ≤ 60% for new
  courses).
- Ids of modules, questions, cards and practice items are progress keys: never rename them once shipped.
- `verify` on a module shows a "Da verificare" banner (facts that may age: prices, exam formats).

## Language courses

- Pronunciation is an Italian-based respelling in `[ ]`, stressed syllable in CAPS, never IPA in the UI.
  One legend per language (`courses/<lang>/pron.ts`, French `b.pron.ts`), checked by
  `courses/<lang>/respell.test.ts`.
- Vocabulary has ONE source per language: `courses/<lang>/words.ts`. Course tables render from it with
  `vsecW(heading, ids)`; Vocabolario merges the four lists by `id`. Sentence tables stay `vsec`.
- Work goes in atomic tasks (one module or one vocab theme, one language), each green and ≥ 9/10 on
  accuracy and phonetics against `docs/learning-drafts/council/rubric.md`; log in
  `docs/learning-drafts/council/<lang>-atomic.md`.

## Learner state (Dexie → Supabase, owner-only)

| Dexie | Supabase | What |
|---|---|---|
| `learningQuiz` | `learning_quiz` | first answer per question (locked until "Rifai") |
| `learningCards` | `learning_cards` | a row = card/word known (Vocabolario: courseId `vocabolario`, moduleId `_words`, itemId `<wordId>.<lang>`: keyed by word, so a word may move between themes) |
| `learningPractice` | `learning_practice` | done + notes |
| `learningChecks` | `learning_checks` | checklist ticks |
| `learningPosition` | `learning_position` | last module/tab per course |
| `learningReviews` | `learning_reviews` | Ripasso schedule, written only on grading |
| `learningSketches` | — | photo diary, local only |

Row ids are `courseId:moduleId:itemId` (Ripasso: `kind:` in front), so devices converge by
last-writer-wins. A new synced table needs a migration (owner-only RLS, `ignore_stale_update`, realtime),
a Dexie version, a `TableSync` in `learningSync.ts`, `privateData.ts`, and `npm run db:types`.
