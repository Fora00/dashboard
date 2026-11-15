# French A1-A2 fixes (applying fr-a1a2-review-r2.md)

Course folder: src/projects/learning/courses/francese/. Module count 31 -> 36 (registry.ts, languages.test.ts updated). Checks: `npm run check` (134 files, 1378 tests) and `npm run build` green.

## Drafts wired in (franceseC in c.ts, spread in index.ts)
| Draft | Module | Group | Gaps closed |
|---|---|---|---|
| c.1.ts | fr-determinants | a1/b1 -> **a2** | indefinites, ordinals, -ment adverbs |
| c.1.ts | fr-geo-reggenze | a2 | countries/prepositions, verb + preposition |
| c.2.ts | fr-irreguliers | a2 | écrire, vivre, croire... ; q4 distractor "Ils boivent le café" -> "des café", stem "del caffè" |
| c.2.ts | fr-genre-pronom | a2 | feminine formation; "-teur" rule: from a verb with -ant participle -> -teuse (chanteur), else -trice (acteur) (q1, card c1 and practice note updated) |
| c.2.ts | fr-negation2 | b1 | ni...ni, ne...que |
Imports switched from python-path.helpers/francese.b.pron to ../kit and ./b.pron. Draft transcriptions already followed the legend (checked mechanically by respell.test.ts).

## Findings -> fix -> module
| Finding | Fix | Module |
|---|---|---|
| B: 20 capital Ë in B half | lowercased, stress moved to the last non-ë syllable (bien que [BYẼ-kë], de peur que [dë PÖR-kë], près de [PRÈ dë], que [kë]) | fr-subj1 (b.ts), fr-relatifs (b.2.ts), fr-voc-viaggi (b.4.ts) |
| C: octobre / démocratie open o | [òk-TÒBR], [dé-mò-kra-SI] | fr-pron |
| C: q3 capital Ẽ distractor | [ẽ-na-MI] | fr-pron |
| C: [zhën sè PA] | "spesso [zhë sè PA] o [shè PA]" | fr-pron |
| C: key-longest rate | q1, q2, q9, q11, q12, q13, q14 rebalanced (fr-pron 7/16 -> 0/16) | fr-pron |
| C: depuis + passé composé "mai" | qualified (negation / concluded period), card c11, q7 and fr-confronti q2 explanations | fr-presente, fr-confronti |
| C: "il/elle = je + -t" loose | rewritten (-er identical; -t/-d; examples) | fr-presente |
| C: p3 stray Lyon note | removed; Lyon example moved to the lesson (j'ai habité à Lyon pendant trois ans) | fr-imparfait |
| C: voyions flag | p1 states the real form has two y and the course simplifies | fr-imparfait |
| C: no "il y a = fa" | example added (il y a deux ans) | fr-etre |
| C: legend lacks ç, gn, ill, tion, hyphen | one bullet added; "parce que [PAR-skë]" stress rule stated | b.pron.ts |
| Extra found: [ã-na-vyÕ] with lowercase stressed syllable | [ã-na-VYÕ] | fr-pron |
| Participles couru, suivi, cru, plu, fallu | added to the irregular table | fr-passecompose |

## Gaps (lesson + quiz + card + practice each)
| Gap | Where |
|---|---|
| Time of day (du matin / du soir, midi, minuit), time and frequency words (hier, demain, ce soir, la semaine prochaine, il y a deux jours, depuis, tous les jours, d'habitude, souvent, ne...jamais) with word order | fr-saluti (q9-q11, c14-c16, p6) |
| Colours with agreement, invariable marron/orange, foncé/clair | fr-nomi (q10-q11, c12, p6) |
| il faut + infinitif, il ne faut pas, il me faut, tenses, pointer to il faut que | fr-quotidiano (q9-q10, c13, p6) |
| DELF A1 format, A2 oral in three parts, A1 postcard, A1 form, A2 e-mail models; durations marked "indicativi, verifica sul sito ufficiale"; A1 row in the table; title now A1-B2 | fr-esame (q41-q44, c11-c13, p6-p7) |

## Tests
francese/respell.test.ts (new): no capital Ë anywhere; tilde nasals only (no decomposed tilde or IPA symbols); no nasal + n/m in one syllable; semivowel written y (no i + vowel); j'ai never [zhè]; stressed syllable entirely capital; bare le/de/ne/je/que never appear as syllables; no stray circumflex/grave letters. Allowlist WRONG_ON_PURPOSE for deliberate distractors.

## Not done / notes
- ROADMAP.md not touched (per brief).
- Open-o is only fixed in the two cited words; the o/ò rule stays a tendency in the course.
- Completeness estimate after changes: the 6 remaining gaps of the checklist (#19, #42, #43, #48, #49, #50) are now covered -> about 100% of the 53 items (drafts cover #10, #15, #21, #22, #25, #41, #45).
