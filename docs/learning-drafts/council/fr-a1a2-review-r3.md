# French A1-A2, ACCURACY + PHONETICS + COMPLETENESS review, round 3 (delta)

Status: COMPLETE. Scores: accuracy 95/100 (r2 95), phonetics 9.5/10 (r2 9), completeness 52.5/53 = 99% (r2 83%). Counts A=0 B=2 C=7.
Scope: delta vs r2. `git diff` of francese/a.ts, a.2.ts, a.3.ts, b.ts, b.2.ts, b.4.ts, b.5.ts, b.pron.ts, index.ts; new files c.ts, c.1.ts, c.2.ts (read in full: fr-determinants, fr-geo-reggenze, fr-irreguliers, fr-genre-pronom; fr-negation2 (b1) skimmed, no issue), respell.test.ts (passes, 9 tests). Full dump of the 16 a1/a2 modules (lesson, 157 quiz questions, cards, practice) checked with a script: every question has 4 options and exactly one keyed option; key is the longest option in only 10/157 (6%; fr-pron 0/16, was 7/16); key positions 37/41/36/43 (no skew).

## r2 findings: verification
| r2 item | status |
|---|---|
| B: capital Ë in B half (20) | FIXED (bien que [BYẼ-kë], de peur que [dë PÖR-kë], près de [PRÈ dë], que [kë]; no capital Ë left, test enforces it) |
| fr-pron octobre / démocratie open o | FIXED ([òk-TÒBR], [dé-mò-kra-SI]; also in the month list of fr-saluti) |
| fr-pron q3 [Ẽ-na-MI] | FIXED |
| [zhën sè PA] | FIXED ("spesso [zhë sè PA] o [shè PA]") |
| key-length skew fr-pron | FIXED (0/16) |
| depuis + passé composé "mai" | FIXED (lesson, card c11, q7, fr-confronti q2); correct (je ne l'ai pas vu depuis lundi) |
| "il = je + -t" loose | FIXED (-er identical; -t/-d/none; je dis -> il dit) |
| fr-imparfait p3 stray Lyon note | FIXED (note removed, "j'ai habité à Lyon pendant trois ans" in lesson) |
| voyions simplification | FIXED (declared in p1) |
| fr-etre "il y a = fa" | FIXED (il y a deux ans [i-lya dö-ZÃ]) |
| legend ç/gn/ill/tion/hyphen | FIXED (bullet added; parce que [PAR-skë] rule stated) |
| participles couru/suivi/cru/plu/fallu | FIXED (fr-passecompose table) |
| drafts: tag a2, import, -teur rule, q4 distractor | FIXED (a2, ../kit + ./b.pron, -teur rule via -ant participle, "des café") |
No fix introduced a factual error. The new "-teur" rule is workable (chantant -> chanteuse, acteur -> actrice; instituteur/conducteur also come out right because the noun stem differs from the participle stem).

## Findings

### A (wrong keyed answer or serious error): none
All new/changed quiz keys verified, including fr-irreguliers q4 (only "Ils boivent du café" is correct now), q9 (j'offre), fr-genre-pronom q1 (actrice), fr-saluti q9-q11, fr-nomi q10-q11 (orange invariable, les yeux marron), fr-quotidiano q9-q10 (il ne faut pas = divieto), fr-esame q41-q44. Nobody has two defensible options.

### B (factual error in text)
1. fr-genre-pronom card c9 "genere diverso => la dent, la fleur, la mer, la voix, la soif; le sang, le lait, le miel": la voix, la soif, le sang, le lait, le miel have the SAME gender as Italian (la voce, la sete, il sangue, il latte, il miele), so the card contradicts its own front. Keep la dent, la fleur, la mer, la couleur (IT masculine) and le soir, le nuage, le choix, le réseau (IT feminine), drop the five.
2. fr-geo-reggenze, islands paragraph: "le grandi, femminili o che sono paesi, con en" is contradicted by its own examples (à Malte, à Chypre, à Cuba, à Madagascar are countries and large). The working rule is: island with article (la Corse, la Sicile, l'Islande, la Crète) -> en (or à la/aux for the DOM and plurals); island name without article -> à (Malte, Cuba, Tahiti, Capri). q10 expl repeats the size criterion ("grandi ... piccole"). The key of q10 stays right.

### C (minor)
1. fr-genre-pronom feminine table: "-eur -> -euse" omits the comparatives/adjectives in -eur: meilleur -> meilleure, supérieur -> supérieure, inférieur, majeur, mineur (meilleur is taught in fr-confronti).
2. fr-irreguliers: "Accento circonflesso solo a il connaît e all'infinito" is incomplete (connaîtrai, vous connaîtrez, connaîtrait too). Say "davanti a t: il connaît, connaître, connaîtra".
3. fr-determinants q3 explanation "Il pronome tous va dopo il verbo": too absolute (Tous sont venus, Ils ont tous mangé). Say "qui, dopo être, sta dopo il verbo". p8 translates «quando vuoi» with n'importe quand (= in qualsiasi momento; quand tu veux is the literal one).
4. fr-pron q10 ("-ill-") uses travail [tra-VAY], which is -ail, not -ill-; q1 option 0 "senza arrotondare altro" is unclear (Italian u is rounded; say "come la u di lupo = ou francese").
5. Groups with no capital syllable although the legend now says "ultima sillaba che non finisce in ë": [kès-kë] (fr-quotidiano: should be [KÈS-kë]), "Parce que ... [par-skë]" in the same lesson (legend says [PAR-skë]), [il ni a pa dë] (fr-etre: [il ni a PA dë]); also [kë]/[në ... kë] in a table (acceptable). Liaison fragments [õ-nè], [sè-tẽ], [lé-zòm], [i-lya] carry no stress; acceptable as fragments but the legend example itself uses [õ-nè].
6. respell.test.ts does not catch a bracket with no capital letter at all (the cases in item 5); add a check "every [..] with 2+ syllables has a capital unless it ends in ë after a capital or is on a short allowlist".
7. fr-esame: DELF durations are flagged "indicativi" (good); the A2 CO/CE task types are one generic sentence (no number of documents/questions), enough for A2 but thin (see checklist #50).

## Phonetics notes (delta)
- New transcriptions all follow the legend and are correct standard French: time words (avant-hier [a-vã-TYÈR], dernière [dèr-NYÈR], toujours [tu-ZHUR], rarement [rar-MÃ], d'habitude [da-bi-TÜD], midi/minuit), colours (blanche [BLÃSH], violet [vyò-LÈ], brun [BRẼ], marron [ma-RÕ], orange [ò-RÃZH]), il faut family ([il FO], il fallait [il fa-LÈ], il a fallu [i-la fa-LÜ], il faudra [il fo-DRA]), -ment adverbs ([ö-rö-zë-MÃ], [é-vi-da-MÃ], [zhã-ti-MÃ], [vrè-MÃ], [lãt-MÃ]), irregular verbs ([zhé-KRI], [il-zé-KRIV], [il BUAV], [nu bü-VÕ], [vé-KÜ], [tü DÒR]), geography ([o-zé-ta-zü-NI], [a li-YÕ]), DELF models ([shèr a-NA], [gros BIZ], [a byẽ-TO]).
- B half: ë-final groups now stress the last non-ë syllable consistently ([jusqu'à ce que [zhüs-KA-së-kë]], [a kõ-di-SYÕ-kë], [en attendant que [ã-na-tã-DÃ-kë]]); `quoique [KUA-kë]` ok. Cross-half conflict closed.
- Remaining: item C5 above; the o/ò rule is still a tendency (stated as such), only two words fixed.

## A1-A2 completeness checklist (53 items), re-scored
Unchanged from r2 (all 1 or covered): #1-8, 11-14, 16-18, 20, 23, 24, 26-40, 44, 46, 47, 51-53.
| # | Topic | r2 | r3 | Justification |
|---|---|---|---|---|
| 9 | Clock time | 1 | 1 | du matin / de l'après-midi / du soir, à midi, à minuit added (the r2 caveat is gone) |
| 10 | Countries, nationalities, en/au/aux, de/du/d' | 0.5 | 1 | fr-geo-reggenze: gender table, exceptions, cities with article, regions, islands, US states |
| 15 | Feminine formation | 0.5 | 1 | 12-row table + irregulars + animals + epicene (fr-genre-pronom) |
| 19 | Colours | 0 | 1 | table, invariable marron/orange, foncé/clair, question (fr-nomi) |
| 21 | plusieurs, quelques, chaque, tout, certains | 0 | 1 | fr-determinants (quiz, cards, practice) |
| 22 | Ordinals | 0 | 1 | fr-determinants |
| 25 | Extended irregulars | 0.5 | 1 | fr-irreguliers: écrire, vivre, croire, suivre, connaître, boire, recevoir, ouvrir, courir, partir, sortir, dormir with tables |
| 41 | -ment adverbs | 0 | 1 | fr-determinants (rules, irregulars, position, false friends) |
| 42 | Time and frequency words | 0.5 | 1 | table + word-order paragraph + q10-q11 + cards (fr-saluti) |
| 43 | Impersonals: il faut + inf., weather | 0.5 | 1 | il faut section in fr-quotidiano (inf., négation = divieto, il me faut, tenses); il fait beau already present |
| 45 | Verb + preposition | 0.5 | 1 | ~50 verbs in tables + pronoun consequences (fr-geo-reggenze) |
| 48 | A1/A2 writing tasks | 0.5 | 1 | A1 postcard, A1 fiche, A2 e-mail, A2 invitation, formal letters (fr-esame, fr-registres) |
| 49 | DELF A1 format | 0 | 1 | durations, PE/PO structure, row in the table (marked indicative) |
| 50 | DELF A2 format | 0.5 | 0.5 | PO in three parts and prep time added; CO/CE task types still one generic sentence |
Total: **52.5 / 53 = 99%** (r2: 44 / 53 = 83%). Residual: A2 CO/CE task detail; "plaire/falloir" etc. only as participles (fine for A2).

## Scores
- ACCURACY: **95 / 100** (baseline r2 95). All r2 items fixed and no regression; about 1 800 new lines are almost entirely correct; two new B errors (card c9, island rule) and seven C offset the gain.
- PHONETICS: **9.5 / 10** (baseline r2 9). Capital Ë gone, open-o words fixed, [zhën sè PA] fixed, new content consistent with the legend and mechanically tested; deduction: three stress-less groups, fragments without stress, o/ò rule only a tendency.
- COMPLETENESS: **99%** (52.5/53).

## Fix list
1. fr-genre-pronom c9: remove la voix, la soif, le sang, le lait, le miel (same gender as Italian); keep genuine contrasts.
2. fr-geo-reggenze: restate the island rule (with article -> en; without article -> à; Cuba, Madagascar, Malte, Chypre -> à) in lesson, q10 explanation, card c6.
3. fr-genre-pronom: add "-eur comparatif: meilleur -> meilleure, supérieur, inférieur, majeur, mineur" to the -eur row.
4. fr-quotidiano: [KÈS-kë], [PAR-skë]; fr-etre: [il ni a PA dë].
5. fr-irreguliers: circumflex statement; fr-determinants q3 explanation and p8 wording; fr-pron q10 (replace travail by an -ill- word such as famille/bouteille or reword) and q1 option 0.
6. respell.test.ts: add the "bracket with no capital" check (with a short allowlist for liaison fragments).
7. Optional: expand DELF A2 CO/CE task types to reach 53/53.
