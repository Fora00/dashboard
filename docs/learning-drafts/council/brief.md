# Brief: language courses for the Learning project (Spanish and French, for an ITALIAN speaker)

Repo: /Users/francescoeliaforadori/Dev/personal/dashboard . Read first (do not edit):
- src/projects/learning/types.ts (Course/CourseModule shapes)
- src/projects/learning/courses/python-path.helpers.ts (use `mod`, `q`, `card`, `prac`; `q` shuffles options, pass the CORRECT option at index given)
- src/projects/learning/courses/api-path.extra.ts (style reference: lesson HTML, quiz, cards, practice)
- src/projects/learning/html.ts (HTML allowlist: <p class="lead">, <h3>, <ul>/<ol>/<li>, <table>, <pre><code>, <b>, <i>, <code>, <div class="say">; write < > & as entities in code)

Goal: a complete A1 -> B2 course for an Italian native, readable OFFLINE on iPhone (text only, no audio, no images). Lesson text in Italian; examples in the target language with Italian translation. Use <table> for conjugations (keep tables narrow: max ~4 columns, iPhone width) and short lines. Pronunciation is explained with Italian-based approximations (e.g. "j = come la 'h' aspirata"), not IPA only.
Target quality: native-level accuracy (accents, ñ, ¿¡, ç, œ, elision, agreement). A wrong example is worse than a missing one: if unsure, leave it out. Highlight italian-specific traps (false friends, interference) in every module.

Per module (hard minimums, tests enforce them): lesson 2500-6000 chars with h3 sections, worked examples and a closing <div class="say">; >= 6 quiz questions (4 options each, plausible distractors similar in LENGTH and form to the right answer, explanation >= 10 words saying why the tempting wrong option is wrong); >= 8 flashcards; >= 4 practice items (translation IT->target, fill-in, error correction, short production; the `answer` field has the model answer + a note). Ids: module ids as listed; quiz ids q1.., cards c1.., practice p1.. (stable, no ':' ).
Vocabulary modules: >= 60 words/expressions each in lesson tables grouped by theme, with gender/articles (ES: el/la; FR: le/la/un/une) and an example sentence for the trickiest.
Allenamento modules: drills = many short practice items (>= 25) with concrete answers; dialoghi = 8+ model dialogues IT/target in the lesson; esame = format of DELE (ES) / DELF (FR) A2/B1/B2, strategies, writing templates, and 40 mixed quiz questions.
The `vault` field: use the default (omit the argument).
Do NOT run `git`, do NOT touch ROADMAP.md, index.ts or other files than yours. Verify with `npx tsc --noEmit -p .` style check (npm run typecheck if exists) and `npx vitest run src/projects/learning` on your file only when the main course file exists; otherwise just typecheck. Export: `export const <exportName>: CourseModule[] = [ ... ]` using `mod(...)` per module; group ids as specified.
Write each module as its own `const` or inline array element; split into several files if a file passes ~1200 lines (name them <file>.2.ts etc. and re-export the array from the main one).
Final reply: <= 10 lines: modules done, line counts, anything you were unsure about (list uncertain claims so the reviewers check them).
