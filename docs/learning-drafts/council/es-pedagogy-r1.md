# Spanish course (spagnolo.*) - pedagogy and rendering review, round 1

Reviewer role: language teacher + frontend sanity. Read-only. All 28 modules read in full (lesson, quiz, cards, practice).

Verdict: 7/10. The A half (A1-A2, 13 modules) is solid: precise tables, good Italian-interference notes, plausible distractors, specific model answers. The B half (B1-B2, vocab, drills, exam) has good grammar content, but it breaks the course's own conventions: pronunciation notation, prerequisite order, format.
Count: A = 5, B = 14, C = 12. Plus 5 completeness gaps.

Tests: `npx vitest run src/projects/learning/courses/languages.test.ts` does NOT load (`Cannot find module './tedesco.a'` imported from tedesco.ts via index.ts), so it was skipped. I ran an ad-hoc analysis (vitest with root in the scratchpad, importing spagnolo.ts directly):
- 283 quiz questions in total. The correct option is strictly the longest in only 52 of them (18%, below the 25% chance level), so there is no length bias overall.
- No table has more than 4 columns. The widest cell is 112 characters, in the 2-column es-pron table.
- No raw `<`, `>` or `&` in text. Everything renders through HtmlText (quiz `q`, options, explanations, card faces and practice answers all go through the HTML allowlist), so the `<i>` tags in B-half questions are fine.
- No Spanish module uses the `tblw` scroll class, so 4-column tables wrap instead of scrolling. This is only a minor risk in the es-latam table.

## A - misleading or wrong teaching

**A1. es-trapas (b1) uses the imperfecto de subjuntivo before es-cond (next-but-one module) teaches it, and the pluscuamperfecto de subjuntivo is never taught as a paradigm.**
- In the "Concordanza dei tempi" section, `vinieras`, `hubieras` and `quedara` appear with no formation.
- Quiz q5 ("Me pidió que me quedara") and practice p5 ("Quería que vinieras/viniese") also use it.
- es-cond then teaches `-ra/-se` from the `ellos` indefinido stem, but never lists `hubiera, hubieras, hubiera, hubiéramos, hubierais, hubieran`. "Tipo 3" and `Ojalá hubiera venido` are shown only as examples.
- Fix: move the "Concordanza" section from es-trapas into es-cond, or reorder to subj1, subj2, cond, trapas. Add the haber-subjuntivo imperfecto paradigm (`hubiera...`).

**A2. Pronunciation of the intervocalic s contradicts the course's core rule.**
- es-pron: "s sempre sorda, `ss`... Mai [KAZA]" with `casa [KA-ssa]`, `queso [KE-sso]`.
- B voc/exam modules write a single s: `casa [KA-sa]`, `mesa [ME-sa]` (es-esame, "Pronuncia e prova orale"), `queso [KE-so]`, `museo [mu-SE-o]`, `camisa [ka-MI-sa]`, `pasaporte [pa-sa-POR-te]`, `cocina`, `crisis [KRI-sis]`, and many more in es-voc-*.
- A northern Italian will read these with a /z/ sound, which is exactly the interference es-pron warns against.
- The LEGEND constant in spagnolo.b.4.ts and the headers of b.5 and b.6 do not mention `ss`.
- Fix: use `ss` between vowels everywhere (or drop the whole voc/B pronunciation system and reuse the es-pron one).

**A3. The `j` versus `y/h` pronunciation notation is incompatible between the two halves.**
- A (es-pron, es-saluti, es-ser...): `ll/y = y` ([KA-ye], [a-YER], [YA-be]), `h = jota`, and es-pron says `y` is a consonantal i "come in ieri". `j` is never used.
- B (LEGEND in b.4, b.5, b.6 and es-latam): "j = ll/y (come la «gi» di «gita»)": `llave [JA-be]`, `calle [KA-je]`, `pollo [PO-jo]`, `cuchillo [ku-CI-jo]`, `ayer [a-JER]`, `toalla [to-A-ja]`.
- A learner who has just learned "h = jota" will read [PO-jo] as the Spanish j. The "gi di gita" description also contradicts "ieri".
- es-pron has `calle [KA-she]` (the `sh` is not in its legend), while es-latam has [KA-sce], [scio] for the same Rioplatense sound.
- es-imperfecto writes `llegué [ye-GUE]`, which an Italian reads as "gwe". The correct form, used in es-passato, is [ye-GHE].
- Fix: one legend, used everywhere (`y` for ll/y; `sc` or `sh`, pick one, for the Rioplatense sound).

**A4. es-registri: "dopo i due punti, la riga successiva con la minuscola".**
- The RAE norm for the greeting in a letter or email is the opposite: new line, capital letter.
- The module's own examples in the say-block and p1 use a capital, so it contradicts itself.
- Card c1 ("si va a capo") is fine.

**A5. es-saluti: "el uno de mayo, non «el primero»" and q6 explanation "non esiste l'ordinale".**
- `el primero de mayo` is the normal way to say "the 1st of May" (the holiday is "Primero de Mayo"). The ordinal exists for day 1 only; the cardinal is used for 2-31. Say that, instead of the flat denial.
- Related gap: there is no ordinals section at all (primero/segundo/tercero, apocope `primer/tercer` is only mentioned in passing in es-nomi).

## B - imprecise, incomplete, or order/format problems

**B1. Gerundio used from A1, taught only in B1.**
- Uses: es-ser ("Estoy comiendo"), es-quotidiano (infinito/gerundio + pronoun), es-imperfecto ("Estaba durmiendo", card c10), es-futuro ("Estoy saliendo"), es-pronomi ("comiéndolo", q9, c11), es-porpara (seguir/llevar + gerundio, p5 "aprendiendo").
- The formation (-ando/-iendo, irregulars) is first given in es-passiva (b1).
- Fix: add a "gerundio" block to es-presente or es-quotidiano.

**B2. es-pronomi vs es-imperativo are circular.**
- es-pronomi uses `cómpralo`, `dime`, `dámelo`, `no me lo digas`, `no lo compres` (affirmative and negative imperative, the latter in the subjunctive) before es-imperativo.
- es-imperativo teaches pronoun position again.
- es-subj2 then repeats a full imperative section (irregulars, vosotros -d, pronouns, `levantaos`).
- Fix: put imperativo before pronomi (or add a forward pointer), and cut the imperative section from es-subj2 down to the negative = subjuntivo rule.

**B3. Notation dropped in the B half.**
- Soft d: `dh` is used in A (`a-KUER-dho`, `ber-DADH`, `TAR-dhes`, `a-DHIOS`). It is absent in all B voc/dialog/exam modules: `acuerdo [a-KUER-do]`, `ciudad [thiu-DAD]`, `TAR-des`, `verdad [ber-DAD]`, `universidad [u-ni-ber-si-DAD]`.
- Pronunciation coverage per module (count of `[...]`): A modules 20-171, B1/B2 grammar 0-9 (subj2 0, passiva 0, falsiamici 0, registri 2, trapas 2, cond 4, connettori 4). The course intro promises "Pronuncia tra [ ]".
- Accent marks inside hyphenated pronunciation differ: [por-KE] in connettori versus [por KE] in A.

**B4. es-connettori, discorso indiretto: "pretérito / perfecto -> pluscuamperfecto" is over-simplified.**
- The indefinido commonly stays unchanged: `Dijo que llegó ayer` is normal. The table presents the shift as the rule.
- Give the pluscuamperfecto as preferred and say that the indefinido can stay when the time reference is clear.

**B5. es-latam: "auto in Messico = carro; coche è la parola della Spagna".**
- `coche` is also very common in Mexico (alongside `carro` and `auto`). Q7 treats `coche` as wrong, and es-esame q36 repeats the question.
- Rephrase: "carro (MX, CO) è comune; coche in Spagna e anche in Messico", or drop the item.
- Also, the "AR / CO" column merges two countries with a slash and never says "first = AR, second = CO". The pairs are consistently in that order, but the reader has to guess.
- The yeísmo description "come la gi di gita" (see A3) is repeated here.

**B6. es-falsiamici q3 ("Cosa significa vaso?").** The distractor "Vaso sanguigno" is also correct Spanish (`vaso sanguíneo`), so there are two defensible answers. Use only clearly wrong distractors.

**B7. es-falsiamici table: "tienda | negozio (tenda = cortina)".** `tienda (de campaña)` is also a tent, so the contrast is half true. Use `tienda de campaña` in the note.

**B8. es-cond q2 explanation: "Supiéramos sarebbe presente".** `supiéramos` is the imperfecto de subjuntivo (type 2 if-clause), not the presente.

**B9. es-cond q8, distractor "Si vendrá, te aviso".** (Unsure, listed separately below too.)

**B10. Heavy duplication / overlap between modules.**
- ser/estar adjective table (listo, aburrido, malo, verde, seguro): es-ser, again in es-connettori ("casi avanzati"), and q5 in es-ser and in es-connettori, q37 in es-esame.
- Perifrasi tables: es-futuro (acabar de, estar a punto de), es-porpara (nine perifrasi), es-passiva (twelve).
- Imperativo: es-imperativo, es-subj2.
- Participi irregolari: es-perfecto, es-trapas.
- Cheat sheet in es-falsiamici and the "10 aree" in es-drills restate A1 content.
- Duplicate quiz stems across the course (ad-hoc check): "Come si legge «gracias» in Spagna?" (es-pron q8, es-saluti q8); "Come si dice «Quando arriverai, chiamami»?" (es-subj2 q1, es-drills q6); "Glielo do" (es-drills q3, es-esame q15); embarazada (es-falsiamici q1, es-esame q20); jamón (es-voc-vita q6, es-esame q25); "auto" in Messico (es-latam q7, es-esame q36).
- es-drills: quiz q1/q2/q3/q4/q5/q6 are the same items as practice p5/p6/p10/p1/p22/p14.
- Some repetition is fine as review (es-esame is meant to be mixed review), but the drills duplicates are pure repetition.

**B11. Format inconsistency between halves.**
- A: Spanish phrases in `<b>`, "Da dire."/"Da ricordare." in the say-block, 9-12 quiz questions, 12 cards, 5 practice items, tables with `<th>`.
- B: Spanish in `<i>`, "Cosa dire." with an Italian gloss (no pronunciation), 8 quiz questions, 10-11 cards (es-drills only 9), several 2-column tables with no header (connettori, passiva, registri idioms).
- Mixed `<code>` and quotation styles in B1.
- es-dialoghi says "copri la colonna italiana", but the layout is an italic line under each Spanish line, not a column.

**B12. Distractor quality drops in the B half.** Many options are filler that can be eliminated without knowing Spanish:
- "Sino llueve, voy"
- "Soy veinte años"
- "Regreso llamarte", "Torno llamarte", "Hago acuerdo"
- "Estoy lectura un libro"
- "Si yo sería tú, aceptaré"
- "Fue ayer lo cuando vi"
- "vehiculón", "automóvile", "rodado"
- "Tomo desde ayer", "Estoy tomando bien" (es-dialoghi q1)
- "Finirò di arrivare" (es-passiva q8)
- Also the "entrambe / nessuna" filler in es-imperfecto q3.

The A half uses much better ones (hablas/hables/hable/hablad). Replace the filler with plausible Italian-interference errors (for example `Cuando llegarás` is already a good one).

**B13. Explanations that do not teach.**
- es-nomi q7: "la nuova sillaba sposta la sillaba finale e cade la tilde".
- es-imperfecto q8: "senza tilde si leggerebbe come una llana diversa".
- es-futuro q4: "la sorpresa è che...".
- es-passiva q3: "a differenza di altre lingue".
- es-passato q2.
- es-imperativo q9: "che è per il comparativo, lo è neutro" (es-porpara q9).

**B14. Writing model answers are shorter than the length requested** (es-esame): p1 asks about 80 words, the model has about 45; p2 asks about 120, the model has about 65; p4 asks about 80, the model has about 40. State the target in the model, or add a longer model.

## C - minor

1. es-passato lesson says the perfecto is in "il modulo successivo". It is two modules later (imperfecto comes in between).
2. es-imperfecto: "Sono regolari tutti i verbi... " precedes the three irregular verbs. Say "tutti tranne ser, ir, ver".
3. es-nomi c2: `el día`, `el mapa` listed under "parole greche in -ma". They are not Greek -ma nouns; they are plain exceptions.
4. es-ser q8: the options "[ES-toi]" and "[ES-toi] con s sonora" are effectively the same distractor.
5. es-presente conjugation table for ir/saber/conocer omits vosotros while the other tables include it.
6. es-quotidiano: "me gusta Luca = attrazione" is stated too sharply (it can be plain liking in some contexts).
7. es-quotidiano: `El almuerzo`: in Spain it is often "pranzo" too. Mark as regional rather than "spuntino".
8. es-registri p3: the model answer's note "In Spagna e America: no pegué ojo" implies the same usage in both, which contradicts es-perfecto (Spain uses the perfecto for the recent night).
9. es-voc-viaggi: "todo recto" is Spain; LatAm uses "derecho" or "siga derecho". Add.
10. es-drills has only 9 cards (other modules have 10-15).
11. es-esame, pronunciation: "non cantare come in napoletano" is an unnecessary regional jibe.
12. es-esame pronunciation example: `ciudad [thiu-DAD]` should be `[thiu-DADH]` to match es-pron.

## Unsure (not counted)

- es-cond q8: "Si vendrá, te aviso" listed as wrong. It is not standard as a conditional, but it could be read as an indirect interrogative ("I'll tell you if he comes").
- es-registri q3: `madrita`/`madrito` marked as wrong; `madrita` is attested (rare) alongside `madrecita`.
- es-falsiamici q4: `la manteca de vaca` as a wrong distractor for "burro". In Spain and Argentina `manteca` can mean butter in some usages.
- es-esame DELE: task counts per level and the 60% pass mark per group (the author flags this in the file header). The number of tasks in B2 Auditiva/Lectura should be checked against the current Cervantes format.
- es-latam: `pelado` (CO) and `ahorita` details.

## Ordering / difficulty ramp

- A1 (6 modules): pron, saluti, ser, nomi, presente, quotidiano. Good ramp. Small issue: es-saluti uses ser/estar/tener/hay phrases before es-ser (acceptable as chunks).
- A2 (7 modules): passato, imperfecto, perfecto, futuro, pronomi, imperativo, porpara. The jump is steep (es-porpara bundles por/para, comparatives, prepositions, a personal and periphrases in 6 KB, with 12 questions). Consider splitting. Pronomi/imperativo order issue B2, gerundio B1.
- B1: subj1, subj2, trapas, cond, passiva. Order issue A1.
- B2: connettori, registri, latam, falsiamici. Fine. (Connettori is `b2` but es-passiva before it is `b1`; fine.)
- voc/drill: the A1 vocabulary (casa, famiglia, cibo, vestiti, meteo) sits at the end of the course after B2. Consider surfacing it (or a pointer in A1) so A1 learners find it early.

## Italian-interference coverage (good)

Covered with explicit "Trappola" notes: s sonora, ce/ci, gente/jota, gn/gli, doppie, tilde; tener vs essere (età, fame); hay vs estar; mi libro without article; muy/mucho; doppia negazione; indefinido vs "ho mangiato"; participio invariabile; essere vs haber ausiliare; cuando + subjuntivo (not future); si + imperfecto de subj (not condicional); ci/ne; se lo (not le lo); a personal; por/para; falsi amici; porque/por qué; sino/si no; ojalá; esperar a que.

Missing interference topics worth a line:
- "Ci vogliono due ore" = `se tarda / se necesitan / llevar dos horas` (`tardar` appears only in the falsi amici list).
- `tratar de`, `deber de` vs `deber`.
- "Abbastanza/troppo" = `bastante/demasiado`.
- Indefinite quantifiers (`algún/ningún/cualquier`: `algún` appears once, in passing).
- "Pronto?" is already covered.

## Completeness gaps against rubric.md

- Ordinali (primero...décimo), percentuali and fractions: not taught.
- Adverbs in -mente: not taught (only `últimamente` appears).
- Apocope is only partly covered (buen, gran, primer, tercer, un; `algún`/`ningún` missing).
- Exclamatives (`qué` + noun, `cuánto`), `hora/tiempo/vez` distinction.
- Gerundio formation too late (B1 above).

## Rendering sanity

- All lesson text is plain allowlisted HTML (p, h3, ul, li, b, i, code, table, tr, th, td, br, div class="say"/"lead", ol). No raw `<`, `>`, `&` and no entities needed.
- Quiz `q`, options, explanations, cards and practice are rendered through HtmlText, so `<i>` in B-half questions works.
- Tables: 2-4 columns everywhere. Widest is es-latam (4 cols, mostly slash-pairs like "judías verdes", "chauchas / habichuelas", "computadora / computador"); expect wrapping at 390px but no overflow. Optionally wrap with `class="tblw"` if horizontal scroll is preferred.
- es-pron has two tables with long cells (86 and 112 characters) in 2-3 columns: fine at `text-sm`.
- es-esame has 40 quiz questions in one module (longest list); consider splitting it into A2/B1/B2 blocks.
