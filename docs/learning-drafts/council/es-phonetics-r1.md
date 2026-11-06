# Spanish course (spagnolo.*) — PHONETICS review, round 1

Reviewer role: phonetician teaching Spanish to Italians. Read-only review. Course files: `src/projects/learning/courses/spagnolo.*.ts`.

Method: extracted every `word [RESPELLING]` pair from the 10 content files (about 1,460 pairs; machine-readable list in `scratchpad/council/es-pairs.txt`, format `file:line<TAB>word<TAB>[pron]`; file key `a`=spagnolo.a.ts, `a.2`, `a.3`, `a.4`, `b.1`..`b.6`). Then:
- read the whole es-pron lesson, es-saluti, the pronunciation sections of es-latam, es-esame and the legends of the vocabulary/dialogue modules;
- read about 250 transcriptions sound by sound as an Italian reader would read them;
- ran regex checks on the whole set (intervocalic s, intervocalic d, "cha", "gue", j/y, ss/dh usage);
- ran a mechanical stress check on 487 single-word transcriptions (Spanish accent rules vs the capitalised syllable).

## Verdict

- Stress placement is very good: 487 single-word transcriptions checked mechanically, 1 real error (hablabais).
- Sounds are well chosen when the legend is applied; there are 5 plain respelling errors, all in half A.
- The convention is NOT one convention. Half B (spagnolo.b.*) uses a different, poorer notation from half A: it drops `ss` and `dh` entirely and writes ll/y as `j` (A writes `y`). The same word is respelled two ways in the same course (`desayuno` is `[de-ssa-YU-no]` in A and `[de-sa-JU-no]` in B). Worse, B's missing `ss` brings back exactly the trap A teaches against (s read as z).
- Coverage of Italian traps is good in es-pron (it covers about 80%). Missing: g softening, voiced s before voiced consonants, the final-r tap, gn/ll length, linking between words, intonation, minimal pairs, syllable division, triphthongs.

Score: half A 8/10, half B 5/10, course as a whole 6.5/10 (the inconsistency is what pulls it down).

Errors: A (wrong, would mislead) 9 items; B (imprecise/incomplete) 14 items; C (minor) 9 items.

---

## 1. Convention coherence: A vs B

There are 5 legends: course intro (`spagnolo.ts`), es-pron table (`spagnolo.a.ts` ~l.40-52), `LEGEND` const in `spagnolo.b.4.ts` l.9, headers of b.5 and b.6, and the comment in `spagnolo.b.ts` (which says "Align with the es-pron legend if it differs"; it does differ). Differences, all verified:

| Feature | Half A (es-pron, a.*) | Half B (b.4, b.5, b.6, part of b.3) | Impact |
|---|---|---|---|
| s between vowels | `ss`: `KA-ssa`, `ME-ssa`, `de-ssa-YU-no` (taught as the key trap) | plain `s`: `ka-MI-sa`, `KE-so`, `ME-sa`, `de-sa-JU-no`, `ki-SIE-ra`... | An Italian from the North reads B's `s` as /z/ = the error A teaches against. About 30 occurrences in B (below). |
| soft d | `dh`: `NA-dha`, `ber-DADH`, `ma-DRIDH`, `ma-DHE-ra` | no `dh` at all: `ber-DAD`, `ma-RI-do`, `nu-BLA-do`, `ko-MI-da`, `thiu-DAD` | About 55 occurrences. B teaches a hard Italian d everywhere. |
| ll / y | `y` (i consonantica as in "ieri"): `KA-ye`, `YA-be`, `a-YER` | `j` ("come la gi di gita"): `KA-je`, `JA-be`, `a-JUN-ta-MIEN-to`, `SE-jo`, `TA-ja`; yet `y` still used for the words yo/ya (`yo ke tu`) | 33+ occurrences. Two symbols for the same sound, and "gi di gita" (an affricate /dʒ/) is a worse model than "ieri". |
| jota | `h` (`HEN-te`) | `h` (same) but the legend also says "j = ll/y", so `j` and `h` swap roles relative to Spanish spelling | A learner who sees `jamón [ha-MON]` and `llave [JA-be]` has to unlearn the Spanish letters. |
| ch | `ci/ce` | `ci/ce` (same) | OK in both, but see errors `CAO`, `MU-cha`, `du-CAR-se` (A). |
| g hard | `gh` | `gh` (b.5 `no CUEL-ghe`); `gue` appears as an error in A (`ye-GUE`) | |
| Rioplatense ll/y | `KA-she` (a.ts l.97) | `KA-sce`, `yo [scio]` (b.3 l.213) | "she" cannot be read by an Italian (sh does not exist). `sce` is right. |
| aspirated -s | `[loh a-MI-goh]` (a.ts l.100ish) | `[loh a-MI-gohs]`, `estás [eh-TAH]` (b.3 l.213) | Two incompatible versions (A drops the s, B keeps it). |
| "por qué" | `[por KE]` (space) | `[por-KE]` (hyphen: reads as one word) b.2:321, b.2:422 | |
| legend placement | full legend in es-pron only; module intros point to it | b.4 has its own different `LEGEND`; b.3 and b.2 have none; b.6 uses `[h]`, `[j]`, `[ci]`, `[th]` as meta-notation inside brackets | Brackets are used both as transcription and as letter names. |
| `ss` and `dh` in legends | present | absent from b.4 LEGEND, b.5, b.6 | The author of B does not know these two rules exist. |

No accent marks, ñ or IPA inside brackets in either half (checked by regex): good, this point is consistent.

### Inventory of B-half words that contradict A (fix list, with location)

`ss` missing (intervocalic s must be `ss`):
- es-voc-vita (b.4): queso l.62, desayuno l.74, camisa l.85, 
- es-voc-viaggi (b.4): pasaporte l.232, retraso l.237, reserva l.244, iglesia l.259, museo l.261, `reservado` in l.413 phrase, quisiera l.423 phrase.
- es-voc-lavoro (b.4): empresa l.440, clase l.455, asignatura l.457, contraseña l.470/l.541/l.581 (q4), nervioso l.486, orgulloso l.487, crisis l.496, `no pasa nada` l.508.
- es-dialoghi (b.5): `desea` l.114, `pasa` l.120.
- es-esame (b.6): l.29 `casa [KA-sa]`, `mesa [ME-sa]` — this is the exam module's own pronunciation drill, and it contradicts es-pron (`KA-ssa`); repeated in the practice answer at l.378.
- es-latam (b.3): `ra-SON` l.175, `ser-BE-sa`, `GRA-sias` (seseo) l.213/306. Note that A also writes `GRA-sias` (a.ts l.97, 167, 348): for a Northern Italian seseo `s` is also read z, so use `GRA-ssias`, `ser-BE-ssa`.

`dh` missing (about 55 occurrences). Examples: es-voc-vita `marido`, `pescado`, `comida`, `tenedor`, `vestido`, `nublado`; es-voc-viaggi `parada`, `ida y vuelta`, `aire acondicionado`, `edificio`, `izquierda` (ith-KIER-da: d after r and l counts too), `todo recto`, `lado`, `robado`, `perdido`, `guardia` (GUAR-dia, after r), `quedar`, `entrada`; es-voc-lavoro `despedir`, `universidad` (`-DAD` final), `estudiante`, `ordenador`, `teclado`, `navegador`, `enfadado`, `preocupado`, `acuerdo`, `verdad`, `modo`, `todas`; es-dialoghi `desPAthio` (des-pa-THIO: d before s ok but `PUE-de` should be `PUE-dhe`), `quedamos`; es-esame l.29 and l.378 `ciudad [thiu-DAD]` (A: `thiu-DADH`).

`j` for ll/y (change to `y`): `llave`, `calle`, `pollo`, `cuchillo`, `talla`, `billete`, `sello`, `toalla`, `ayuntamiento`, `llueve`, `desayuno`, `orgulloso`, `pantalla`, `caballo` (b.6 l.29, l.378), plus quiz keys b.4 q4 `[JA-be]`, b.6 q26 `[KA-je]`, b.5 p32 key `llave [JA-be]`, b.6 l.217 `[KA-je]`.

### Inconsistencies inside half A

- `dh` missing in A, although the module itself teaches it: `todo [TO-do]` (es-pron l.52, taught in the same lesson as `nada [NA-dha]`), `verde [BER-de]` (es-ser, 3x), `médica/médico [ME-di-ka]/[ME-di-ko]` (es-ser, es-presente, es-futuro, es-passato phrases), `idioma [i-DIO-ma]` (es-nomi), `veintidós [bein-ti-DOS]`, `tarde [TAR-de]` (a.2 l.374, a.3 l.51) vs `buenas tardes [TAR-dhes]` (es-saluti). Same word, two respellings.
- `ss` missing in A: `dieciséis`, `diecisiete`, `veintiséis` (es-saluti l.265, 281, 393), `esa/eso [E-se]/[E-so]` (es-nomi l.53), `Dáselo [DA-se-lo]` (es-pronomi l.25), `Siéntese [SIEN-te-se]` (es-imperativo l.197), `visitar [bi-si-TAR]` (es-futuro l.530), `GRA-sias`.
- `ss` used where not needed (after n: `PIEN-sso`, `pen-SSAR`, `kan-SSA-dho`, `des-kan-SSAR`) while words like `sen-TAR` have none: harmless for sound, but the rule "ss = intervocalic" is not what is applied.
- Monosyllables are capitalised inconsistently: `[OI es LU-nes]` (es lowercase) vs `[ES la U-na]` (ES capitalised); `[KO-mo se YA-ma us-TEDH]`. Rule needed: function words (articles, short prepositions, possessives, unstressed pronouns, que, y, es/ser forms in a phrase) lowercase; content monosyllables (hay, soy, doy) capitalised.
- `ciento [THIEN]` card (es-saluti c6, a.ts l.366): ciento is [THIEN-to] (cien is [THIEN]).
- `esa/ese [E-se]` and `aquel/aquella [a-KEL]` are shorthand that conflates forms (esa = [E-sa]). Acceptable, but should read `ese [E-se], esa [E-sa]`.

---

## 2. Would an Italian pronounce it right? (spot-check results)

About 250 transcriptions read sound by sound, stress included. Real errors (all would produce a wrong sound):

| # | Severity | Where | Wrong | Correct | Why |
|---|---|---|---|---|---|
| 1 | A | es-pron l.75 ("ce/ci" bullet), es-saluti table l.239, es-saluti card l.371: `chao [CAO]` | CAO | `[CIAO]` | Italian "cao" is /kao/. The legend says c before ci/ce = ch, but "ao" has no i/e: written with c, a is read /k/. |
| 2 | A | es-nomi l.55, l.56, l.132 (card c10): `mucha [MU-cha]` (4 occurrences) | MU-cha | `[MU-cia]` | "cha" is not an Italian grapheme; read as /ka/. Same word is `[MU-cio]` elsewhere. |
| 3 | A | es-quotidiano l.351: `ducharse [du-CAR-se]` | CAR | `[du-CIAR-se]` | /kar/ instead of /tʃar/. The reflexive paradigm two lines up has `me ducho [me DU-cio]`. |
| 4 | A | es-passato l.202: `llegué ... [ye-GUE]` (inside the sentence) | GUE | `[ye-GHE]` | Italian "gue" = /gwe/; same page writes `[ye-GHE]` (l.~58). |
| 5 | A | es-imperfecto l.179: `hablabais [a-bla-BAIS]` | stress on -BAIS | `[a-BLA-bais]` | No tilde, ends in s -> penultimate syllable (bla). Its neighbours `ibais [I-bais]`, `erais [E-rais]` are right. The only stress error found in 487 words. |
| 6 | B | es-voc-viaggi l.413, l.423 and every `s` between vowels in b.4/b.5/b.6 (see inventory) | ...SI.. read /z/ | ...SSI.. | Northern Italian reads intervocalic s voiced: `ki-SIE-ra` -> "kiziera". |
| 7 | B | all half-B hard d | `ber-DAD`, ... | `ber-DADH` | |
| 8 | B | es-latam l.213 | `calle [KA-sce]` / `yo [scio]` voiceless vs es-pron "sc sonora" | one convention | Both exist; modern Rioplatense is mostly voiceless /ʃ/ among younger speakers. Say it once, write `sce` everywhere, drop `she`. |

Other findings:

- **`h` collision (design risk, B).** In the respelling `h` = jota (`HEN-te`, `HUE-bes`), while in Italian h is silent. A reader who skims the legend reads `HEN-te` as "EN-te" and `HUE-bes` ("jueves") as `UE-bo`-like (`huevo` is `UE-bo`). The legend handles it, but it is the one place where the Italian-based scheme fights Italian reading habits, and it affects 400+ transcriptions. Recommendation: keep it (changing now costs more than it saves), but print the legend line "h = jota (NON muta come in italiano; la h muta dello spagnolo non si scrive)" at the top of every module that has transcriptions, in the same words, and make jueves/huevo a minimal pair in es-pron. The same applies to `th` (read as "t") and `dh` (read as "d") for a reader who ignores the legend.
- **Aspirated s in B/es-pron: `[loh a-MI-goh]`**, `eh-TAH`: the `h` here is the Italian-silent h again; add "qui h = aspirazione" in the line.
- `PIEN-sso` etc.: Italian reads `ss` as a long (geminate) /ss/ even when the lesson says "non è una doppia". The text must say "leggi la ss breve e sorda". Same for `gn` (Italian gn is always long: `A-gno` -> "aɲɲo") and `rr`/`ll`. These are not wrong, they are risks; one line in es-pron fixes them.
- `cc [ak-THION]`, `nn [in-NA-to]`: good.
- `s sempre sorda` is slightly inexact: before a voiced consonant Spanish s is voiced too (`mismo`, `desde`, `los dos`). Teaching "sempre sorda" is the right simplification for Italians (Italian does the same, so there is no trap there); add in the s row of the table "(davanti a consonante sonora, come in italiano: mismo)" and keep `MIS-mo` as is.
- Quiz/keys check: all pronunciation quiz keys were verified; wrong answers are plausible distractors; explanation for b.4 `llave` ("una gi leggera") and b.6 q26 ("come una gi leggera") propagate the "gi" error from the B legend.
- es-pron claim "Una debole accentata + forte rompe il dittongo ... (día, país, río, maíz)" — país and maíz are strong + stressed weak: write "vocale debole accentata vicino a una forte (in qualsiasi ordine)". Quiz q6 ("país [pa-IS]: la tilde serve a separare") is fine but país would need the tilde anyway by the general rule (aguda in -s); say both. (C)
- Hiatus with silent h (`prohibir [pro-i-BIR]`, `ahí`, `ahorro`) not mentioned beyond `ahora`/`ahí`. (C)
- b.6 l.29 says "Le uniche doppie sono rr (vibrante) e cc/nn rare", while es-pron says rr is a letter, not a double. (C)
- b.6 l.29 "non cantare come in napoletano": unhelpful/stereotyping; replace with "la voce non sale e scende a ogni sillaba". (C)

---

## 3. Italian-specific traps: coverage

| Trap | Covered? | Where | Gap |
|---|---|---|---|
| Doppie non allungate | Yes (strong) | es-pron "Consonanti identiche" | Add gn/ll/ss reading length (see above). |
| b/v same sound | Yes | es-pron, card c4 | Add that between vowels b is a soft approximant (said in a clause, never transcribed). |
| s sonora (casa) | Yes (strong, quiz q2, p6, card c8) | es-pron | B ignores it (inventory). |
| gli / gn | Yes | es-pron "Trappole italiane" | None (only the length note above). |
| c/g before e/i | Yes | es-pron | Fine; `gh` fine; `chao` error. |
| Final consonants (Italians add a vowel / geminate: `ciudad` -> "ciudade") | Partly: d final and -z, -j shown | | Add one sentence: "le parole spagnole possono finire in -d -l -r -z -n -s: non aggiungere vocale". |
| Intervocalic d softening | Yes in A (dh) | es-pron | B fails; A has 15 slips. |
| Intervocalic g softening (`amigo`, `lago`, `agua` -> /ɣ/) | **No** | | Add to es-pron (Italians use hard g; harmless but audible) as `g tra vocali più morbida`, no new symbol. |
| Diphthongs vs hiatus | Yes | es-pron | Add triphthongs (`estudiáis`, `buey`, `Uruguay`), and weak+weak (`ciudad`, `cuidado`: diptongo, stress on the second). |
| Tilde rules | Yes (3 tables) | es-pron | Add monosyllables (`fue`, `dio`, `vio` no tilde), `-mente` adverbs, `sólo/aún` (post-2010 no tilde), interrogatives in indirect questions (`no sé qué`). |
| j/g | Yes | | |
| ll/y | Yes (A); contradictory (B) | | Fix per section 1. Add: after n/l or when emphatic, y is a stronger affricate (`un yate`, `el yeso`). |
| r / rr | Yes | | Add: final r (`hablar`) is a single, weak tap, not rolled; r in clusters (`tres`, `tren`, `libro`) is a single tap: Italians often roll these. |
| Seseo / distinción | Yes | es-pron, es-latam | Fine; make `ss` apply to seseo respellings. |
| Rioplatense sh/zh | Yes (es-latam) | | Fix notation (`sce`). |
| Aspirated -s | Yes (es-latam) | | Unify with es-pron. |
| x | Yes | | Add `texto [TEKS-to]` / pre-consonant x often /s/; low priority. |
| Spanish vowels pure | Yes | | Good. |

---

## 4. What is missing for "how to say it right"

1. **Intonation** (one sentence in es-quotidiano is all there is). Add a short section to es-pron: statements fall; yes/no questions rise on the last stressed syllable and are otherwise like statements; wh-questions start high and fall; ¿...? marks the whole question, so intonation starts at the beginning of the question not at the end. Include 4 sentences with arrows or caps.
2. **Linking between words (enlace/sinalefe)**: the transcriptions are word-by-word, but real speech is not: `mi amigo` -> /mia-MI-go/, `los amigos` -> /lo-sa-MI-gos/, `hola, ¿cómo estás?` -> /KO-mo-es-TAS/, `va a ir`, `en el hotel`. Add the rule "una consonante finale passa alla vocale iniziale seguente; due vocali uguali o diverse formano una sillaba" with 6 examples, and say that bracketed phrases keep word spaces for readability but are said without pauses.
3. **Syllable division**: only p4 (6 words). Add rules: single consonant goes with the next vowel; ch, ll, rr are never split; consonant clusters pr/pl/br/bl/tr/dr/cr/cl/gr/gl/fr/fl stay together (`a-BRIR`, `ins-tru-MEN-to`); other pairs split (`ac-ción`, `mu-cho`). Needed because transcriptions are hyphenated and the user may wonder why `ak-THION` has k and th apart.
4. **Stress rules**: well covered (table). Add: stress of verb + enclitic (`dámelo`, `cómpralo`), shift in the plural (`joven`/`jóvenes` present; add `carácter`/`caracteres`, `régimen`/`regímenes`), and the **trio `término / termino / terminó`** [TER-mi-no / ter-MI-no / ter-mi-NO], plus `papa/papá`, `canto/cantó`, `público/publico/publicó`.
5. **Minimal pairs for ear training** (only `pero/perro` and `hablo/habló`): add a table of 8-10 pairs Italians confuse — `caro/carro`, `pena/peña`, `ano/año`, `cana/caña`, `casa/caza` (Spain: KA-ssa / KA-tha), `cien/sien`, `jueves/huevos`, `poro/porro`, `busca/busqué`, `sé/se`. Pairs `casa/caza`, `cesta/siesta`, `cena/sena` show the distinción.
6. **Rhythm**: only one line in es-esame ("ogni sillaba dura quasi uguale"). Add a note in es-pron: Spanish is syllable-timed, unstressed vowels never reduce; unlike Italian, the stressed syllable is not lengthened (no `PEr-ro`).
7. **Tongue twisters / practice texts**: none. Add 3 short trabalenguas (`tres tristes tigres`, `pablito clavó un clavito`, `erre con erre cigarro`) after the r/rr section, with respelling, to drill rr and clusters.
8. **Reading practice for the legend**: one short paragraph transcribed twice (a, b) so the learner can check the conventions, and a self-test (3 questions) on `h`, `ss` and `dh`.
9. **Vocabulary modules (b.4)**: only Spain `th`; the legend says "in America si dice s", fine. Add the 3 most common LATAM differences in one line per module (`zapatos` -> SA-PA-tos).

---

## Fix list (prioritised)

**Must fix (A):**
1. `chao [CAO]` -> `[CIAO]` (es-pron l.75, es-saluti l.239 table, l.371 card c11).
2. `mucha [MU-cha]` -> `[MU-cia]` (es-nomi l.55 x2, l.56, l.132).
3. `ducharse [du-CAR-se]` -> `[du-CIAR-se]` (es-quotidiano l.351).
4. `llegué ... [ye-GUE]` -> `[ye-GHE]` (es-passato l.202).
5. `hablabais [a-bla-BAIS]` -> `[a-BLA-bais]` (es-imperfecto l.179).
6. Unify to one convention (A's), applying it to all of half B. One legend constant exported from `spagnolo.a.ts` and used by b.4, b.5, b.6, b.3 and the course intro. B changes: `s` between vowels -> `ss` (about 30 words); `d` soft -> `dh` (about 55); `j` -> `y` (33+); drop "j = ll/y" and "gi di gita" from the b.4 `LEGEND`, b.5 intro, b.6 comment and b.6 l.29 text, and from quiz explanations b.4 q4 and b.6 q26 (use "i consonantica come in «ieri»").
7. Rioplatense: pick `sce` (b.3 style) and use it in es-pron (`KA-she` -> `KA-sce`, add `yo [SCIO]`).
8. Aspirated s: use one form in es-pron and es-latam (suggest `[loh a-MI-gohs]` (s weak or lost), `[eh-TAH]`; and say "h = aspirazione, non muta come in italiano").
9. Fix A's `dh`/`ss` slips: `todo`, `verde`, `médica/médico`, `idioma`, `veintidós`, `tarde`; `dieciséis/diecisiete/veintiséis`, `esa/eso`, `Dáselo`, `Siéntese`, `visitar`.

**Should fix (B):**
10. Add to es-pron: reading note "ss, gn, rr, ll si leggono brevi" and an `h` box ("h = jota, MAI muta") plus a quiz question.
11. Add g softening, final-r tap, final consonants without added vowel, triphthongs, tilde of monosyllables and of -mente adverbs.
12. Add a "frasi e ritmo" section: intonation, linking, syllable division, minimal pairs, trabalenguas (section 4 above).
13. Teach s before voiced consonants in one sentence; keep `MIS-mo`.
14. Add `por qué`: `[por KE]` (space) in b.2:321 and b.2:422 (not hyphen).
15. Make the card `ciento` = `[THIEN-to]`; `esa [E-sa]`.
16. Make function-word capitalisation consistent (rule in the legend).
17. Add an automated test in `languages.test.ts` to keep the convention (all transcriptions inside `[...]` in spagnolo.*): fail if (a) contains `cha|che|chi|cho|chu` or ends in `CAO`; (b) `gue|gui` not preceded by `ü` words (allow `GUEN-tha`, `GUI-no` only via an allow-list); (c) `[aeiou]-?s-?[aeiou]` appears (case-insensitive) outside `ss`; (d) `[aeiou]-?d-?[aeiou]` or `[rl]d` without `dh`; (e) contains `j`. This test would have caught 100% of items 1-9. (The check (c) must exclude the seseo example `[GRA-ssias]` after the fix.)

**Minor (C):** país wording; b.6 "rr come doppia"; "non cantare come in napoletano"; `PIEN-sso`-type unnecessary `ss`; `ciento`; shorthand `ese/esa`; b.4 legend still says "k = c/qu duri" (A uses k too, keep, but put it in the single legend).

## Unsure (mark for a native check)

- `calle [KA-sce]` / `yo [SCIO]`: voiced vs voiceless in current Rioplatense. Both are heard; the voiceless /ʃ/ is now the majority among younger speakers (Buenos Aires). I recommend writing `sce` and saying "(o `zhe` sonoro in alcuni parlanti)" in words, not a second respelling.
- `recepción [re-thep-THION]`: Spain often says [re-thep-THION] with a weak first th; fine for learners.
- `ek-SA-men`: many speakers say /eg-SA-men/ (voiced). Teaching `ek-SA` is fine and conventional.
- `Europa [eu-RO-pa]`, `reunión [rreu-NION]`: eu as diphthong correct; some speakers use hiatus. OK.
- Statement "oltre il 90% degli ispanofoni" (seseo) in es-pron: plausible but unverified; "la grande maggioranza" is safer.
