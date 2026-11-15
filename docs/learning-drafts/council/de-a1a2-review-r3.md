# German A1-A2: ACCURACY + PHONETICS + COMPLETENESS review, round 3 (delta)

Scope: the round-2 fix log items only. Read-only on code. Checked: every new/changed sentence, quiz key (exactly one correct option), card, practice answer and [ ] transcription in de-nomi (dieser/welcher, indefinites), de-casi (possession, anrufen), de-riflessivi (intensifiers, time expressions, am-heissesten rule), de-futuro/imperativo/nebensaetze1 wording, de-voc-vita (colours, seasons, measures, money), de-esame (Start Deutsch 1 / Goethe A2, 4 writing models), pron.ts legend, and the s/ss + tse:n + Januar/Februar sweeps. `respell.test.ts`: 10/10 pass. A mechanical scan of every bracketed transcription and every vocabulary row in all tedesco files was run for: ss outside V_V, lone s between vowels, split ng, plain E:, lowercase accented e/e, -er finals, dropped g, and umlaut mismatches between word and transcription.

## Round-2 findings: verification
All 14 fixed items verified in the files: Entschuldigung [ent-SHUL-di-gung]; q1 distractor "Ich stehe um auf sieben Uhr" (now one correct); ZEÇ-tse:n / ZI:P-tse:n / ZECHS-tse:n / ZEKS-tse:n / ZEÇ-se:n everywhere; JA-nu-a:r / FÉ:-bru-a:r; Lehrerinnen [LÉ:-rë-ri-nën]; vorgestern [FO:R-gës-tërn]; s at word end and before consonants, ss only between vowels (Fluss [FLUS], Fuß [FU:S], heiß [HAIS], Straße [SHTRA:-ssë], Wasser [VA-ssa]; scan found no ss outside V_V and no lone intervocalic s except deliberate distractors and the legend's own rule); legend now allows two capitals in compounds and describes ʼ as a study sign; q14 "tentazione"; imperativo q8 "ch"; nebensaetze1 q11; anrufen deduplicated; es gibt reworded. Legend is internally consistent (Zeitung, Fluss, Haus, Straße, an-geben all follow its own rules).

## Findings

### A (wrong content)
None.

### B (real errors, fix before release)
- **B-V1 (phonetics, regression from the sweep) b.5 de-voc-vita, Famiglia rows.** `die Großmutter ... 'GRO:S-MÜ-ta'` and `der Großvater ... 'GRO:S-FÈ:-ta'`. These are the PLURAL vowels (Großmütter, Großväter) applied to the singular: Großmutter has u, Großvater has a. Round 1 had the correct 'GRO:S-mu-ta' / 'GRO:S-fa:-ta'. Fix: `GRO:S-MU-ta` and `GRO:S-FA:-ta` (secondary stress capital is optional; the plural can be added in parentheses as in the Vater row: GRO:S-MU-ta (GRO:S-MÜ-ta)). Only two rows in the whole course have an umlaut in the transcription without one in the word (scan result), so this is isolated.

### C (cosmetic / minor)
- C-R1 de-presente q6 explanation: "Essend esiste come participio..." is capitalised and says nothing useful; reword ("essend" is only the present participle, not used for a progressive).
- C-R2 de-voc-vita Stagioni paragraph: "(non «in primavera» con in + articolo da sola)" is garbled. Say "im = in dem, mai «in Frühling»".
- C-R3 de-esame dialogue (Reisender): `NÈ:Ç-stë` for nächste; everywhere else NÈ:ÇS-të. Align.
- C-R4 b.5 Vorstellungsgespräch [FO:R-shte-lungs-gë-shpre:ç]: lowercase long "e:" for ä; legend defines only È: (and unstressed lowercase e is short). Use shprè:ç or SHPRÈ:ç. Same with b.4 FERN-ze:-a / b.2 TAIL-ne:-mën etc. where lowercase e: is a real long e (acceptable under "secondary stress can be lowercase"); only the ä case is off.
- C-R5 de-esame exam table: the Goethe A2 Lesen row says "5 parti"; the A2 reading module is, to my knowledge, 4 parts (Hören 4, Schreiben 2, Sprechen 3 fine). The text correctly marks the numbers "indicativi, verifica sul sito"; change to 4 or drop the number.
- C-R6 orange [o-RAN-shë]: the note says the sh is voiced like French j; the legend gives sh = sc of «scena». Disclosed approximation, fine; optionally write [o-RAN-zhë] is not in the legend, so keep.
- C-R7 (carried) lowercase secondary-stress notation (C-P3 of r2) and "zwanzig nach drei": skipped by choice, still harmless.

New content accuracy (all verified correct): dieser/welcher declension and "welchen Film"; jener raro; was für ein (für non regge il caso); jemand/niemand/etwas/nichts/alle/alles/viele/einige/wenige/ein paar vs ein Paar/jeder; niemanden; Annas Buch, Max' Auto, Hans' Haus, von + Dativ, ein Freund von mir; sehr/zu/ziemlich/ganz/ein bisschen/nicht so (ganz gut = abbastanza); jeden Tag/nächste Woche/letztes Jahr (accusative of time), vor + Dat., seit + Dat., wie oft/lange, zweimal pro Woche; am größten exception; colours with ein- endings (ein roter Pullover, eine rote Tasche, ein rotes Auto, rote Schuhe), rosa/lila invariable, das Blau; seasons all masculine with im; Kilo/Pfund (500 g), invariable masculine/neuter measures, feminine -n, no "di", prices read "zwei Euro fünfzig"; writing models (form, SMS, informal email, formal appointment note) and their grammar (weil with verb last, Liebe/Sehr geehrter, Grüße); exam table (Start Deutsch 1 = A1; 60 points; Schreiben A1 Formular + short message, A2 SMS + email).
Quiz keys: 18 new items (de-nomi q11-q14; de-casi q11-q12; de-riflessivi q11-q13; de-voc-vita q11-q13; de-esame q41-q43) each have exactly one correct option; distractors are plainly wrong. Cards and practice answers: no error.
Transcriptions in new content (A1-A2 and b.5/b.6 dialogues): all follow the legend (ng never split, É:/È:/E, j, ë, final -a, ss/s rule, z = voiced s: DI:-za, ZO-ma, DO:-zë, KÈ:-zë), except B-V1 and C-R3/R4.

## Completeness re-score (same 52 items, same weights)

| # | Item | r2 | r3 | Justification |
|---|---|---|---|---|
| 26 | demonstratives, welcher, was für ein | 0.5 | 1 | table, rule, trap, q11-q12, c13, p7 in de-nomi |
| 27 | indefinites and quantifiers | 0.5 | 1 | table, negation/accusative notes, q13-q14, c14, p6 |
| 29 | possession | 0.5 | 1 | Annas Buch, Max', von + Dat., genitive pointer to B1; q11-q12, c13, p6 |
| 31 | particles and intensifiers | 0.5 | 1 | intensifier table and traps added (de-riflessivi); doch/mal/denn already in imperativo/b.3 |
| 32 | time expressions | 0.5 | 1 | table, accusative-of-time rule, q12-q13, c14, p7 |
| 39 | meteo and stagioni | 0.5 | 1 | Stagioni vsec, im rule, q12, c11 |
| 40 | colori | 0 | 1 | vsec, adjective-ending chunks, q13, c10, p7 |
| 45 | quantità, misure, denaro | 0.5 | 1 | vsec, no-"di" rule, q11, c12, p6 |
| 48 | scrittura breve | 0.5 | 0.75 | four models with structure; no postcard, no quiz on form-filling |
| 49 | exam format A1/A2 | 0.5 | 0.75 | table + points + parts, labelled indicative; one doubtful number (C-R5), no Hören task detail |
| all others | | unchanged | unchanged | no regression found |

Total 46.5 + 5.0 = **51.5 / 52 = 99%** (r2: 89%). Remaining 0.5: postcard / form-fill exercise, exam-format detail.

## Final tally
- Severity counts: **A = 0, B = 1 (two rows), C = 6** (plus the two r2 skips carried).
- **Accuracy: 97/100** (r2 96): all r2 items closed, 18 new quiz items and ~30 new paragraphs/cards correct; small deduction for the exam-table number and two garbled sentences.
- **Phonetics: 9/10** (r2 9): sweep clean, legend consistent, but the sweep introduced the Großmutter/Großvater plural-vowel regression and one ä written as e:. Fixing B-V1 and C-R3/R4 gives 10/10.
- **Completeness: 99%** (51.5/52).

## Fix list
1. b.5.ts lines 48-49: `GRO:S-MÜ-ta` -> `GRO:S-MU-ta`, `GRO:S-FÈ:-ta` -> `GRO:S-FA:-ta` (optionally add the plural in parentheses). Add a respell.test check: a transcription may contain Ü/Ö/È only if the headword (before the parenthesis) has an umlaut.
2. b.6.ts dialogue: `NÈ:Ç-stë` -> `NÈ:ÇS-të`; b.5 Vorstellungsgespräch `shpre:ç` -> `SHPRÈ:ç`-style long ä.
3. de-esame table: Goethe A2 Lesen parts 5 -> 4 (or remove the number).
4. de-presente q6 explanation: reword the "Essend" sentence; Stagioni paragraph: reword the "in primavera" parenthesis.
