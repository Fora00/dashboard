# STATUS (read first): INTERRUPTED at usage limit, 2026-11-06
Covered: legend + conventions (tedesco.pron.ts, header of tedesco.a.ts and tedesco.b.ts); de-pron lesson read in full; script-based check of ALL ~1,800 bracketed transcriptions in all 30 modules (unique list in scratchpad/council/uniq.txt, extraction in all.tsv / de-pairs.json, scripts de_pairs.py / align.py / rules.py / uniq.py, compiled course in de-phon-course.json); all unique word/respelling pairs eyeballed for modules de-saluti ... de-esame.
NOT yet done: (a) quiz/card/practice items of each module not read for pronunciation explanations (only the transcriptions inside them were checked); (b) the "unsure" items in section 2 must be verified in context (grep the word in tedesco.*.ts); (c) other lesson prose about pronunciation in B modules (de-esame stress pairs, de-varianti AT/CH sounds) not read in full; (d) section 4 (intonation etc.) is based on de-pron only, other modules not grepped for 'intonazione'.

# German course: phonetics review, round 1 (council role PHONETICS)

Method: all 30 modules rendered to data (lesson HTML, quiz, cards, practice); ~2000 bracketed transcriptions extracted by script (council/all.tsv) and tuple rows (vsec/dl/tbl) recorded by instrumentation; legend and conventions read in tedesco.pron.ts, tedesco.a.ts header + de-pron lesson, tedesco.b.ts header. Findings appended below as I go.

## 0. Convention inventory (what the course actually does)

LEGEND (tedesco.pron.ts, shown at top of de-pron, short form PRON_SHORT in every B module): CAPS = stressed syllable; sh; ç; ch; ts; **z = voiced s** (not German z); ss; ü ö; ë = schwa; -er = "a"; ":" = long vowel; w=v, v=f; j = i consonantica; "ng = one nasal sound, no g (ging [GING])"; ß = ss; ä = e (long "è:"); tsch = tsh.
EXTRA conventions in de-pron (not in the legend but in the lesson text): É: = closed long e, E = short open e, È: = long ä, "ng" written "n", tsh.
EXTRA conventions in tedesco.b.ts header (not shown to the learner anywhere): Austrian initial s written plain "s"; sp/st after prefix = shp/sht.

Numeric picture (script count over ~1800 transcriptions): A uses É:/È: (31 + 23 + 9 accents), B uses neither (0 È:, 0 É:, 176 "E:"). A writes j as I (IA:R), B as J (JA:R). A writes ng as "n" in headers but "ng" in GING/TSAI-tung/gë-GAN-gën; B always keeps "ng"/"n-g". B lowercases unstressed function words and some monosyllables (iç, de:r, va:r, TÜ:r); A capitalises monosyllables (IÇ, DAS, VA:R).

## 1. Consistency findings (question 1) - confirmed by script + reading

Item ids are module:location (lesson = lesson text).

**A-level (misleading)**
1. NG. The legend says "ng = un solo suono nasale senza g" but then writes the example with the g: `ging [GING]`. de-pron says "lo scrivo n" (header of tedesco.a.ts) yet the course writes: `Zeitung [TSAI-tung]` (de-plusquam), `gegangen [gë-GAN-gën]` (de-perfekt) and `[gë-GA-ngën]` (de-plusquam), `bringen [BRI-ngën]`, `ginge [GI-ngën]`/`[GI-ngë]`, `solange [zo-LA-ngë]`, `Junge [IUN-gë]` (de-nomi) vs `Junge [JU-ngë]` (de-relativ) vs `jung [IUN]` (same root, two spellings), `jünger [IÜN-ga]`, `Hunger [HU-nga]`, `Finger [FI-nga]`, `Wohnungen [VO:-nun-gën]`, `Rechnungen [REÇ-nun-gën]`, `Ausgänge [AUS-gen-gë]`, `England [EN-glant]` (German has no g: [EN-lant]), `hungrig [HUN-griç]`. An Italian reads "ng" as the /ng/ of "lungo": he WILL add a g to every one of these. Splitting "n|gë" across the syllable break makes it worse (the g becomes the onset of the next syllable). Fix: one symbol, e.g. "ŋ" or "n̄", or the rule "ng si scrive sempre 'nk' senza k" does not work; best is a dedicated letter (ñ) with the explicit warning "nessuna g: Zeitung = TSAI-tuñ, Junge = IU-ñë, Finger = FI-ña" and use it everywhere. Count: ~75 B transcriptions + ~15 A.
2. Legend example contradicts its own rules: `Straße [SHTRA-se]` (legend) - the legend itself says ß = "ss" and long a = ":" - correct would be [SHTRA:-ssë]; de-pron body uses [SHTRA:-ssë], a quiz option uses [SHTRAS-së]. An Italian (north) reads "se" between vowels voiced -> wrong. Also `Sonne [ZO-ne]` in legend vs `[ZO-në]` later; `Lehrer [LÉ-ra]` (legend) vs `[LÉ:-ra]` (de-pron section 6, 3 times) - legend has no colon on a long vowel, no accent explained (É is NOT in the legend, only in the de-pron lesson).

**B-level (inconsistent convention across A/B)**
3. Long open ä: A writes È: (Käse [KÈ:-zë], Mädchen [MÈ:T-çën], Väter [FÈ:-ta], wäre [VÈ:-rë], nächste [NÈ:ÇS-të], spät [SHPÈ:T], erklären [er-KLÈ:-rën]); B writes plain E: (Käse [KE:-zë] voc-vita, Mädchen [ME:T-çën] falsiamici/voc-vita, Väter [FE:-ta], wäre [VE:-rë] konj2, erklären [er-KLE:-rë] nebensaetze2, während [VE:-rënt]). B has no accent letters at all, so the closed/open e distinction taught in de-pron (É: vs È:) is silently dropped: in B "E:" stands for both Lehre (closed) and Käse/während (open). Pick one.
4. Closed long e: A É: (sehen [ZÉ:-ën], verstehen [fer-SHTÉ:-ën], wer [VÉ:R], gehen [GÉ:-gën]), B E: (sehen [ZE:-ën], gehen [GE:-ën], verstehen [fer-SHTE:-ën]). Plus stray lowercase accented vowels in A: dreizehn [DRAI-tsé:n], vierzehn [FIR-tsé:n], aufstehen [AUF-shté:-ën], Italienisch [i-ta-LIÉ:-nish] - lowercase accented letters appear in no legend.
5. j: A writes I (Ja [IA:], Jahr [IA:R], Januar [IA-nu-ar], Juni [IU:-ni], jung [IUN]); B writes J (Jahr [JA:R] falsiamici, Jahre [JA:-rë], Januar [JA-nu-ar] varianti, Jänner [JE-na], jeden [JE:-dën], Projekt [pro-JEKT], Jacke [JA-kë], Billett [bil-JET], je [JE:], ja [JA:]). An Italian reading J gets /dʒ/ or /j/ at random (in "Jacke" many say "giacche"); and A's I-for-j ("IA:R") is read /i-a:r/ with two syllables by some. Pick ONE: "i" is safer but add "(j = i breve, una sola sillaba)".
6. Case: B writes unstressed AND some stressed monosyllables in lowercase (iç, de:r, va:r, ze:r, e:r, fo:r, bi:n..., `TÜ:r`, `O:r`, `VA:r`, `VA:rst` in de-plusquam, `fer-FÜ:-gung`); A writes monosyllables in CAPS (IÇ, DAS, VA:R, TÜ:R). Rule "CAPS = stressed" is therefore violated: de-plusquam `war [VA:r]`, voc-vita `die Tür [TÜ:r]`, `das Ohr [O:r]` (stressed nouns in lowercase r). Also gerade `GË-RA:-dë` (de-presente, two caps syllables), `Ü:-ba-NACH-tung` (two caps), `ES-TSET` (both caps), `HÖ:ç-stën`/`NE:ç-stën` (lowercase ç in a stressed syllable, de-aggettivi).
7. Final -er: A and most of B write "a" (Lehrer [LÉ:-ra], Wasser [VA-ssa]); exceptions: `Ihrer [I:-rër]` (de-esame, twice), `gestern [GES-tern]` (de-perfekt) vs `[GES-tërn]` (B), `sondern [ZON-dern]` (de-nebensaetze1) vs `[ZON-dërn]` (de-konnektoren), `hundert [HUN-dert]`, `Eltern [EL-tërn]`. Schwa ë vs plain e in final -e: `Kaffee [KA-fe]`, `Straße [SHTRA-se]`, `Sonne [ZO-ne]` (legend, de-pron, de-varianti) vs [-të] everywhere else; Grüezi [GRÜ-e-tsi] (saluti) vs [GRÜ-ë-tsi] (varianti).
8. ß: de-pron says Fuß [FU:SS], heiß [HAISS], aß [A:SS] but heißt [HAIST], weiß [VAIS], weißt [VAIST], heiß [HAIS] (voc-vita), Grüß [GRÜ:S] (varianti) vs [GRÜ:SS] (saluti), Maßnahmen [MA:S-na:-mën] vs Maße [MA:-ssë]. Word-final/before-consonant single S is harmless for an Italian; only intervocalic matters. But then the legend rule "ß = ss" should be restated as "ss fra vocali, s a fine parola" or applied uniformly. (C)
9. ts/z: consistent as ts; BUT "z" is used for German /z/ (Sonne [ZO-ne], reisen [RAI-zën]). Italians read the letter z as /ts/ or /dz/ (zona): the legend only compensates with "z = s sonora di rosa". Risk of [dz]: B. Never confused with German z in the text itself (always "ts"). Metzger [MET-tsga] (varianti) has spurious "tt" for tz (Italian doubles it).
10. ç/ch: consistent rule, one exception in case: lowercase ç in stressed syllables (point 6). `Chuchichäschtli [CHU-chi-CHESHT-li]` (x-Laut, ok). `höchsten [HÖ:ç-stën]`, `nächsten [NE:ç-stën]`: ç before st is right.
11. sh/shp/sht: consistent. Austrian "plain s" convention exists only in the b.ts source comment, never explained to the learner (de-varianti shows [SO-në] for CH/AT).
12. Auslautverhärtung: consistent everywhere (Tag [TA:K], Hund [HUNT], gab [GA:P], -ig [-iç]). Only exception ng/Entschuldigung [ent-SHUL-di-gun] (saluti) vs [-gung] (viaggi, dialoghi).
13. Syllabification of pf: Apfel [AP-fël] (de-pron) vs [A-pfël] (voc-vita, falsiamici) vs Erdapfel [ERT-a-pfël]; Köpfe [KÖ-pfë]. Cosmetic (C) but the legend says "pf = insieme".
14. "tsh": "tsch" -> TSH (Tschüss [TSHÜS]) ok; "Deutsch [DOITSH]" ok.
15. Colon: Gehabt [gë-HA:PT] (A, de-perfekt) vs [gë-HAPT] (B, de-konj2) - the latter is wrong (see section 2). Legend omits the colon on long vowels in its own examples (Straße, Lehrer).

## 2. Pronunciation accuracy (question 2): spot-checked ~600 unique word/respelling pairs (the full unique list is in council/uniq.txt); ~95% correct. Wrong or doubtful (TO VERIFY IN CONTEXT where marked):

**Confident**
- A: `Junge [IUN-gë]`/`[JU-ngë]`, `jünger [IÜN-ga]`, `Finger/Hunger [FI-nga]/[HU-nga]`, `Ausgänge [AUS-gen-gë]`, `Wohnungen [VO:-nun-gën]`: g added (see 1.1).
- B: `Dusche [DU-shë]` (de-quotidiano) - long u: [DU:-shë].
- B: `gehabt [gë-HAPT]` (de-konj2) - long a [gë-HA:PT].
- B: `Hähnchen [HEN-çën]` (de-varianti) - long open ä: [HÈ:N-çën].
- B: `Gymnasium [gim-NA:-zi-um]` (de-falsiamici) - first syllable has ü: [güm-NA:-zi-um].
- B: `Städte [SHTE:-të]` (de-voc-viaggi) - short ä; de-nomi has the right [SHTÈ-të]. (verify it was not a different word)
- B: `Metzger [MET-tsga]` -> [MEts-ga]; `Billett [bil-JET]` j (see 1.5).
- B: `England [EN-glant]` -> [EN-lant]; `Hunger/Finger [-nga]` (g). 
- B: `des [dës]` (de-relativ): vowel is /e/ not schwa: [DES].
- B: `Ihrer [I:-rër]` -> [I:-ra].
**Unsure, check in context (not yet verified)**
- `zwar [TSVAR]` (de-konnektoren): standard long [TSVA:R]. 
- `hoher [HO:-ha]` (de-aggettivi): h is silent here, [HO:-a]; the "h" in the respelling makes Italians aspirate it.
- `Mailand [mai-LANT]` (de-plusquam): stress is on the first syllable [MAI-lant].
- `Großmütter [GRO:S-mu-ta]` / `Großväter [GRO:S-fa:-ta]` (de-voc-vita): ü missing / ä missing -> [GRO:S-mü-ta], [GRO:S-fe:-ta]. 
- `Deutscher [DOI-tshë]` (de-aggettivi) - if it is the masculine noun, [DOI-tsha].
- `Hallo [HA-lo]`: standard greeting stress is ha-LO: or HA-lo (both in Duden): C.

**Stress/length checks that passed** (examples): Entschuldigung, Übernachtung, Verantwortung, wahrscheinlich, vielleicht, einundzwanzig, Italienisch, Österreich, überSETZEN/ÜBERsetzen, umFAHren/UMfahren, MOdern/moDERN, AUgust/auGUST, Student, Musik, Kaffee DE/AT, Café, Hotel, Computer (voc-lavoro [kom-PJU:-ta], but a B1 table uses [kom-pu-TER]: inconsistent, C).

## 3. Italian traps coverage (question 3) - only de-pron lesson read in full

Covered well: double consonant = short vowel (section 1, pairs Miete/Mitte, Staat/Stadt, Ofen/offen, Wiesen/wissen), ch/ç and -chen/-ig, sch/sp/st, ts/z/tz, s sonora, w/v/f, r and -er, Auslautverhärtung (Rad/Rat), ei/ie (Wein/Wien), ü/ö pairs, h initial vs silent, glottal stop (Knacklaut: only 1 sentence, beobachten), pf, qu, compound stress, separable vs inseparable stress.
Gaps:
- ng (see 1.1) - the single worst gap: no "ng = no g" practice words, and the legend contradicts itself.
- Legend never says z vs s: a minimal "zona" warning for the voiced-s symbol.
- /ɪç/ vs /ɪk/: "-ig" ok. "-ich" in Italian reading (Kirche vs Kirsche covered).
- Vowel reduction: "ë" is explained but the real quality (schwa) is not demonstrated; Italians pronounce the e fully (bë-KO-mën -> "be-ko-men"). A one-line "e muta/brevissima" is there only as "e debole".
- Aspiration of p/t/k: stated "in words but not marked" (no examples with minimal pairs like Pass/Bass, Tier/dir).
- Consonant clusters tz, ts (Zitrone), pf-initial (Pfeffer), kn- (Knie: Italians say "kinie"), gn- not exist; "kn" and "ps" are in the course? not checked. 
- Initial "sp/st" is covered; "s + consonant inside words" partly.
- No minimal pairs for short vs long a (Bahn/Bann, Staat/Stadt only), for ö/e (Höhle/Hölle yes, Söhne/Sehne no), ü/i (Tür/Tier - no, only Hüte/Hütte).
- Final devoicing of s: "Haus [HAUS]" ok.
- v in foreign words: Vase / Klavier ok.

## 4. "Say it right" - what is missing (question 4) - partial

- Sentence intonation (statement falls, yes/no question rises, Wh- question falls), contrastive stress, no module. Absent from de-pron.
- Rhythm: German is stress-timed, vowels reduced; Italians syllable-time (full vowels), so "ë" must be shown as reduction. No mention.
- Word stress in compounds: covered (first element); but not "dreiteilige" patterns (Hauptbahnhof, Krankenversicherung secondary stress) and the respellings mark TWO caps in some compounds inconsistently (see 1.6).
- Separable verbs in sentences (Ich rufe dich AN - stress on the particle, verb at the end): not stated in the V2 modules; only the infinitive is shown.
- Stress on connectors/function words in sentences (nicht, doch, ja, mal) is only in de-registri without respelling.
- Glottal stop (Knacklaut) needs a notation (e.g. ʼ ) - "nicht marcato" so learners cannot see it (verändern, beobachten, in Amerika).
- Minimal pairs: some in de-pron (good). More needed for -ig/-ich, Staat/Stadt, Bett/Beet ok, Kamm/Kahm, schon/schön ok, Mus/Müs no, ach/ich ok, Wahl/Wal, Miete/Mitte ok.
- Audio none (text-only), so a short "provalo con il sintetizzatore vocale dell'iPhone" suggestion (Settings > Spoken Content, German voice) would help; nothing stated.

## 5. Fixes list (priority order)

1. Replace the ng convention with ONE letter (e.g. ñ) used in A and B (about 90 occurrences); delete "ging [GING]" from the legend and fix the note in de-pron. Add practice words.
2. Fix the legend examples: Straße [SHTRA:-ssë], Sonne [ZO-në], Lehrer [LÉ:-ra]; move the É:/È:/ë/tsh/ng notes from the de-pron lesson into PRON_SHORT / PRON_FULL (they are not in the legend that B modules show).
3. Decide E: / É: / È: and apply to B (or drop É/È entirely and note long ä = "E:" everywhere). Lowercase accented vowels (tsé:n, shté:) -> uppercase/unaccented.
4. j: choose I or J and sweep ~30 B items.
5. Capitalisation of stressed monosyllables (VA:r, TÜ:r, O:r, fo:r when stressed) and the double-caps (GË-RA:-dë, ES-TSET, Ü:-ba-NACH-tung).
6. Individual corrections in section 2 (Dusche, gehabt, Hähnchen, Gymnasium, Städte, Metzger, England, des, Ihrer, + the unsure ones after verification).
7. Add a short intonation/rhythm/glottal-stop block to de-pron.

## 6. Provisional counts

A: 1 systemic (ng/g, ~90 items + legend contradiction) plus the legend example Straße [SHTRA-se] (A also for legend = 2 total).
B: ~14 items: È:/E: split, É/E split, j/J split, case/stress marking, Dusche, gehabt, Hähnchen, Gymnasium, Städte, Metzger, England, Ihrer, Billett, des; plus 5 unsure (zwar, hoher, Mailand, Großmütter/Großväter, Deutscher).
C: ~10 (ß single s, pf syllabification, Entschuldigung gun/gung, Kaffee [KA-fe], Hallo, lowercase ç, Computer, Austrian s, ES-TSET, Grüezi).
Score (provisional, based on ~65% of the course read): 6.5/10. Content accuracy ~95%, but the notation is not one convention and the ng rule teaches the opposite of what it states.
