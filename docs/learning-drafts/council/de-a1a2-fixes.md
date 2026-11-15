# German A1-A2 fix log (accuracy r1 + phonetics r1)

Files: `src/projects/learning/courses/tedesco/` (a.ts, a.2.ts, a.3.ts, a.4.ts, b.1-b.6.ts, pron.ts, respell.test.ts).

## Accuracy (de-accuracy-r1.md), A1/A2 modules + de-nebensaetze2

| Finding | Fix | File |
| --- | --- | --- |
| [B] saluti: 15 missing in numbers table | row now 13, 14, 15, 16, 17 (FÜNF-tse:n) | a.ts |
| [C] saluti c8 zweite listed as irregular | card lists erste, dritte, siebte, achte; says zweite/vierte regular | a.ts |
| [C] saluti q5 "ts + sh" | "tsh (un solo suono) + ü breve" | a.ts |
| [C] saluti "ze:" lowercase | Auf Wiedersehen [AUF VI:-da-ZÉ:-ën] | a.ts |
| [C] pron q11 "ver-" | option now fer-SHTÉ:-ën; legend Straße example fixed | a.ts, pron.ts |
| [C] sein Arzt long/short | Er wird Arzt [A:RTST] (same as Ärztin) | a.ts |
| [C] sein Café note | example replaced by "einen Park", Café remark explains neuter | a.ts |
| [C] sein "sto male" | "ho la nausea, mi sento male" (text and card c5) | a.ts |
| [B] nomi -tum / -er / -us exceptions | table: -er neuter exceptions (Wasser, Fenster, Zimmer, Messer), -us masc., new paragraph on -tum (der Reichtum; das Eigentum) | a.2.ts |
| [B] nomi Ge- card | c3 now "tendenze", Ge- only a tendency (der Gesang, die Geschichte) | a.2.ts |
| [C] nomi Städte [SHTÈ-të] | [SHTE-të] short | a.2.ts |
| [C] nomi weak masculines "in -en" | "prendono -n o -en in tutti i casi tranne il nominativo" | a.2.ts |
| [B] presente am-Progressiv (lesson, header, q6 expl, c11) | colloquial am-Progressiv added everywhere "niente progressiva" appeared | a.2.ts |
| [C] presente "tre desinenze" | "quattro" | a.2.ts |
| [C] presente -est/-et list | added -gn (regnet) | a.2.ts |
| [C] presente GË-RA:-dë | gë-RA:-dë | a.2.ts |
| [C] quotidiano Nachfeld | "di norma alla fine", q1 expl notes the marked spoken variant | a.2.ts |
| [C] quotidiano inseparable list | added hinter-, voll-, wider- (rarer) | a.2.ts |
| [B] casi dative list | + außer, gegenüber, ab in lesson, card c(dativo), mnemonic noted partial | a.3.ts |
| [B] casi accusative list | bis, entlang in the lesson | a.3.ts |
| [C] casi aiutare/ringraziare/rispondere | rispondere removed from "transitivi"; anrufen vs telefonare a | a.3.ts |
| [C] casi q8 expl | anrufen added | a.3.ts |
| [B] perfekt extra sein verbs, schwimmen | geschehen, gelingen, misslingen, begegnen, folgen; schwimmen/tanzen/segeln note (meta vs attività) | a.3.ts |
| [C] perfekt "due vocali debole-forte" | gearbeitet [gë-AR-bai-tët] explained | a.3.ts |
| [C] praeteritum schwimmen/ziehen | "(s/h)" and "(s se traslocare)", legend line extended | a.3.ts |
| [C] praeteritum misti wording, ich = er | rewritten | a.3.ts |
| [B] futuro "non ich käme" | würde + infinito preferred, weak KII = Präteritum, strong verbs käme/ginge/bliebe/fände/wüsste/gäbe correct but formal | a.4.ts |
| [C] futuro "innaturale quasi sempre" | restricted to planned events | a.4.ts |
| [C] imperativo "infinito + Sie" | "terza persona plurale (come l'infinito, tranne Seien Sie)" in lesson and q4 expl | a.4.ts |
| [C] imperativo q5 expl Aufsteh | rewritten | a.4.ts |
| [C] imperativo -e rule | -tm, -dn, -gn (Atme! Ordne! Regne!) | a.4.ts |
| [B] riflessivi am größten | rule shows am heißesten; groß listed as the exception (lesson and c7) | a.4.ts |
| [C] riflessivi c1 | reflexive pronouns equal personal pronouns except sich | a.4.ts |
| [C] nebensaetze1 wenn | future single event added (lesson, table, c9) | a.4.ts |
| [C] nebensaetze1 deshalb/darum | "di solito la prima posizione", Mittelfeld example | a.4.ts |
| [B] nebensaetze2 V2 wording | subordinate occupies position 1, finite verb stays second | b.1.ts |
| [B] nebensaetze2 damit same subject | table, trappola, "Da ricordare", c2: damit obligatory with different subjects, possible with the same; only um...zu requires same | b.1.ts |
| [C] nebensaetze2 q7 (b -> p) | Auslautverhärtung of ob- | b.1.ts |
| [C] nebensaetze2 obwohl "nonostante" | "benché, sebbene (nonostante + nome = trotz + Gen.)" | b.1.ts |
| [C] nebensaetze2 notation E:/e:r | covered by the notation sweep | b.1.ts |

Skipped (all [C], judged not worth text): de-pron "a fine sillaba -> a" simplification (reviewer: not an error); de-perfekt "per ogni fatto passato" tendency wording; de-saluti "Struttura" (no error); de-quotidiano modal table and p3 (no error); de-casi nothing further. Not touched by brief: de-relativ and de-aggettivi [C] items other than notation.

## Notation (de-phonetics-r1.md), whole course

Scripted sweep (bracketed `word [pron]`, vsec rows, dl lines, quiz options) plus manual review of every changed line. Counts (token changes in the diff):

- ng: 22 split spellings joined (BRING-ën, JUNG-ë, gë-GANG-ën, FING-a, HUNG-a, AN-fang-ën, ENG-lant, VO:-nung-ën, ...) plus 6 in-syllable ng/n-only fixes (jung [JUNG], HUNG-riç); real g kept in an-/ein-/aus-ge- words (Angebot, angestellt).
- long e: ~185 plain E: converted, 171 now É: and 53 È: (ä/äh words: Käse, während, wäre, erklären, fährt, Verspätung, Universität, Täter, ...); Käse in the cheese entries fixed to KÈ:-zë.
- j: 14 (A files I -> J: Jahr, Januar, Juni, Juli, jung, Jot, ja).
- lowercase accented vowels: 7 (tsé:n, shté:, ...) -> unaccented lowercase e: in unstressed syllables.
- CAPS: stressed syllables normalised to full capitals (TÜ:r -> TÜ:R, HÖ:ç -> HÖ:Ç, VA:r -> VA:R, bë-FO:r -> bë-FO:R, nach-DÉ:m -> nach-DÉ:M) and unstressed words like ze:r/nu:r/hi:r/va:r capitalised; double caps removed (ü:-ba-NACH-tung, ü:-ba-RASHT, ü:-ba-VAI-zën, VA:R-shain-liç, ES-tset, gë-RA:-dë); compounds Großmütter/Großväter keep a secondary stress in capitals (GRO:S-MÜ-ta, GRO:S-FÈ:-ta).
- Word fixes (r1 section 2): Dusche [DU:-shë], gehabt [gë-HA:PT], Hähnchen [HÈ:N-çën], Gymnasium [güm-NA:-zi-um], Städte [SHTE-të], Metzger [METS-ga], England [ENG-lant], des [des], Ihrer [I:-ra], gestern [GES-tërn], sondern [ZON-dërn], hundert [HUN-dërt], zwar [TSVA:R], hoher [HO:-a], Mailand [MAI-lant], Großmütter/Großväter. Verified in context and left: Billett [bil-JET] (J already), Junge/jünger (ng), Deutscher [DOI-tsha] (already -a).
- Legend (pron.ts): rewritten PRON_FULL and PRON_SHORT with Straße [SHTRA:-ssë], Sonne [ZO-në], Lehrer [LÉ:-ra], É:/È:/E, ë, ng rule (no contradiction), z = s sonora di «rosa» (mai la z italiana), j = i di «ieri», CAPS rule for monosyllables/function words/compounds, glottal stop ʼ. The "Altre convenzioni" paragraph and the "lo scrivo n" note were removed from de-pron; the A-file header comment was updated.
- Kept on purpose: Kaffee [KA-fe] (full final e of the loan word, Austrian ka-FÉ: noted), distractor options that show a wrong respelling (MIT-te, HAT-te, TO:CH-ter, KOM-pu-ter) in quiz options, lowercase function words (der, die, und, zu, ich in B).

## de-pron additions

New section 10 (melodia, ritmo, colpo di glottide ʼ, verbi separabili in frase, ng practice, iPhone German voice line), quiz q14-q16, cards c16-c18, practice p7. Glottal stop ʼ used in section 5 and 10 examples only (bë-ʼO:-bach-tën, in ʼa-MÉ:-ri-ka, fer-ʼEN-dërn, ʼA:RTST).

## Test

`respell.test.ts` (8 tests): finds > 1000 transcriptions; no split ng (allowlist an-/ein-/aus-ge-), no lowercase é/è in brackets, no I+vowel for j, no plain E:, È: only for ä words, stressed syllables fully capitalised, no "-ter/-der/-ker" final er; `WRONG_ON_PURPOSE` allowlist for quiz distractors.

## Not verified / open

- A mechanical IPA cross-check (ROADMAP L19 f) is not part of this work; accuracy and phonetics scores of the fixed A1/A2 text were not re-measured by a reviewer.
- `npm run build` and `npm run check` fail only because of the untracked in-progress `courses/russo/` (unused imports, missing ./a.2 ./a.3, a failing russo respell test); tedesco compiles, lints and its tests pass.

## Round 2 (de-a1a2-review-r2.md)

Findings (B and C):

| Finding | Fix | Module |
|---|---|---|
| [B-S1] Entschuldigung [..-gun] | [ent-SHUL-di-gung] | de-saluti (a.ts) |
| [B-Q1] q1 second defensible answer | distractor "Ich stehe um auf sieben Uhr"; explanation says the standard is the particle at the end | de-quotidiano (a.2.ts) |
| [C-S2] zeç-tsé:n lowercase accented | ZEÇ-tse:n, ZI:P-tse:n, ZECHS-tse:n, ZEKS-tse:n, ZEÇ-se:n everywhere | de-saluti c12, q8, c-sweep |
| [C-S4] Januar/Februar | JA-nu-a:r, FÉ:-bru-a:r | de-saluti, de-varianti (b.4.ts) |
| [C-N1] Lehrerinnen | LÉ:-rë-ri-nën | de-nomi |
| [C-F1] vorgestern | FO:R-gës-tërn | de-perfekt |
| [C-L1/C-P2] final ss/ß | rule: "s" at word end and before consonants, "ss" only between vowels. Applied to FU:S, HAIS, FLUS, GRÜ:S, GRO:S, A:S, ZA:S, HI:S, fer-GA:S (a.ts, a.2, a.3, a.4, b.1, b.2, b.5); Straße, Wasser, größer keep ss; legend and de-pron sentence reworded | pron.ts, de-pron |
| [C-L2] Auf Wiedersehen double capitals | legend says some compounds have two capitals | pron.ts |
| [C-L3] ʼ only in de-pron | legend says "segno di studio, usato solo nel modulo di pronuncia" | pron.ts |
| [C-P1] q14 "calco" | "una tentazione da evitare" | de-pron |
| [C-I1] q8 "consonante doppia" | "due lettere consonantiche (ch)" | de-imperativo |
| [C-NS1] q11 "perché doppia" | both words end in a voiceless s, whatever the spelling | de-nebensaetze1 |
| [C-D1] anrufen twice | removed from the first list, kept in the parenthesis | de-casi |
| [C-E1] es gibt sentence | "il verbo resta sempre alla stessa forma (singolare), anche davanti a un nome plurale" | de-sein |
| [C-A1] zwanzig nach drei, [C-P3] lowercase secondary stress | skipped: reviewer calls them harmless / allowed by the legend | - |
| [C-S3] Grüezi | skipped (no change needed) | - |

Completeness gaps (ids and count unchanged, 30 modules):

| Gap | Fix | Module (new items) |
|---|---|---|
| colori (adjective endings as chunks) | vsec Colori + chunk paragraph (ein roter Pullover, eine rote Tasche, ein rotes Auto) | de-voc-vita: q11-q13, c10-c12, p6-p7 |
| stagioni | vsec Stagioni + im | de-voc-vita |
| misure, pesi, denaro, prezzi | vsec (Kilo, Pfund, Flasche, Euro, 2,50 €) + rule on measure without "di" | de-voc-vita |
| dieser / jener / welcher / was für ein | table + text | de-nomi: q11-q12, c13 |
| indefiniti (jemand, niemand, etwas, nichts, alle, viele, einige, wenige, ein paar, jeder) | table + negation note | de-nomi: q13-q14, c14, p6-p7 |
| possesso: Annas Buch, von + Dat. | section, genitive pointer to B1 | de-casi: q11-q12, c13, p6 |
| intensificatori sehr, zu, ziemlich, ganz | table + traps | de-riflessivi: q11, c13, p6 |
| espressioni di tempo (jeden Tag, nächste Woche, letztes Jahr, vor, seit, wie oft/lange) | table + accusative rule | de-riflessivi: q12-q13, c14, p7 |
| scrittura A1/A2 (modulo, SMS, email, messaggio appuntamento) with model answers | section with 4 models | de-esame: q42-q43, c10, p6-p7 |
| Start Deutsch 1 / Goethe A2 format | table with durations and parts, "indicativi, verifica sul sito ufficiale" | de-esame: q41, c9 |

Test: `respell.test.ts` now has 10 tests; the new ones check that "ss" is only used between vowels (final/pre-consonant voiceless s is "s") and that Januar/Februar and ZEÇ-tsé never come back.

Not done: no new reviewer pass was run, so the completeness score (target >= 92%) is estimated, not measured: all 8 gaps (items 26, 27, 29, 31, 32, 39, 40, 45, 48, 49) now have a lesson section plus quiz and card/practice items.
