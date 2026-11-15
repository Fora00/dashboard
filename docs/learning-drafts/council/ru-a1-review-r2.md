# Russian A1: ACCURACY + PHONETICS + COMPLETENESS review, round 2

Status: DONE. Legend + 15/15 modules reviewed (ru-alfabeto, ru-pron, ru-saluti, ru-essere, ru-nomi, ru-aggettivi, ru-presente, ru-casi1, ru-domande, ru-passato, ru-moto, ru-voc-vita, ru-voc-citta, ru-dialoghi, ru-esame). Scores and fix list at the end.

Method: fresh dump (throwaway vitest under src/, deleted afterwards) of every lesson, quiz option + key + explanation, card and practice item of the 15 modules in src/projects/learning/courses/russo/, read in full. The hardest focus was on the content listed in ru-a1-fixes.md. Stress was checked word by word on all 834 distinct stressed forms (the mechanical test checks only that the stress mark is present and matches the CAPS syllable, not that it is right). Respellings were checked against standard Moscow pronunciation and against the legend as now written (pron.ts PRON_FULL / PRON_SHORT, ru-pron). `npx vitest run src/projects/learning/courses/russo`: 11/11 pass.

## Round 1 fixes: verification
All 4 A, 13 B and 20 C items from round 1 are applied as the fix log says, except two small leftovers: дождь is still [DOSHT] in one sentence (C4, see ru-voc-vita), and C6 was deliberately skipped (decision below). The A fixes are correct: ходи́л in passato p2, больша́я in the esame text, Вы́зовите (lesson, quiz q10 and the вы- rule), and presente q6 now has a single correct option. The B4 sweep (y after ж ш ц) and the B11 sweep (C'-iV) are consistent across the course.

## Builder doubts (from the fix log)
- **подеше́вле**: stress right (по-де-ШЕВ-ле); [pa-di-SHEV-lie] is right and consistent with шесть [SHEST'] (stressed е after ш = e). «А есть подеше́вле?» is exactly what a native says.
- **утра́ (genitive)**: right. в де́сять часо́в утра́, до утра́, с утра́ all have final stress, while the nominative is у́тро (До́брое у́тро [U-tra] is also right). The lesson and card c12 use утра́ consistently; у́тра appears nowhere.
- **Ordinals 11-30**: оди́ннадцатое, двена́дцатое, двадца́тое, тридца́тое are right (the stress moves in 20 and 30 and stays in 11 and 12). The other ordinals are right too: пе́рвое, второ́е, тре́тье [TRIET'-ie], четвёртое, пя́тое, шесто́е, седьмо́е [sid'-MO-ia], восьмо́е, девя́тое, деся́тое. All month genitives are right (января́ ... декабря́, ма́рта, апре́ля, ма́я, ию́ня, ию́ля, а́вгуста).
- **Hotel dialogue phrasing**: grammatical and mostly natural (У вас есть свобо́дный но́мер?, На ско́лько дней?, Где за́втрак?). Two issues: the Italian translation of the floor numbers is wrong (B1 below), and hotels quote prices «за ночь» or «в су́тки» rather than «в день» (C).
- **Пожа́луйста [pa-ZHA-lus-ta]**: acceptable. The normal spoken form is [pɐˈʐaləstə], so the closest notation would be [pa-ZHA-la-sta]. «lus» is a reading of the spelling, not wrong enough to change everywhere. Do change the alternative in the ru-saluti note: «a volte [pa-ZHA-li-sta]» should read [pa-ZHA-la-sta] (the vowel is a schwa after hard л, not i) (C).

## C6 decision (final ч written "c")
**The warning alone is not enough.** The bold warning is shown only in ru-pron (PRON_FULL) and in the two vocabulary modules (PRON_SHORT). About 20 final or pre-consonant "c" respellings sit in modules that show no legend at all: [VRAC] (ru-essere, ru-domande), [NOC], [MOC], [RUC-ka], [RUC-ki], [na POC-tie] (ru-nomi, ru-presente, ru-casi1), [a-BYC-na] (ru-domande), [at-LIC-na] (ru-dialoghi d7), [piat' TY-siac] (ru-saluti), [KLIUC], [DOC] (ru-voc-vita). An Italian who opens ru-domande directly reads [a-BYC-na] as "abik-na". Two options:
- Minimum (zero risk, recommended now): insert `${PRON_SHORT}` at the top of every lesson in a.2.ts, a.3.ts and c.ts, and of ru-saluti and ru-essere in a.ts.
- Better (optional): write final or pre-consonant ч as **c'** ([VRAC'], [NOC'], [RUC'-ka]). It fits the system (ч is always soft) and Italian intuition (c' as in c'è = "ci" elided). It needs one legend line, a change to the "' never after ч" rule in pron.ts and respell.test.ts, and about 20 edits.
I keep it as a C, because ru-pron teaches the rule in bold.

## Legend (pron.ts PRON_FULL / PRON_SHORT, mirrored in ru-pron)
Complete and accurate now: y after ж ш ц (unstressed е/и, plus stressed и), -ться/-тся = tsa, assimilation, ь/ъ + vowel = C'-iV, пью/пьёшь as one syllable, unstressed а after ч щ and soft consonants = i, hard consonants in loanwords, z "non come zio", bold warning on c. Nothing incorrect. One gap: initial unstressed э is reduced (экза́мен [ig-ZA-min] follows it, but эта́ж [e-TASH] does not). Either add the rule or leave it and fix the two words (C, see ru-voc-vita / ru-dialoghi).

## ru-alfabeto (a.ts, 8 q, 9 c, 5 p)
Accuracy: clean. Loanword line (интерне́т [in-ter-NET], су́пер [SU-per]) right; cursive note now says «spesso ... convenzione scolastica»; па́рк acute gone. Keys single-correct.
Phonetics: clean.
No findings.

## ru-pron (a.ts, 8 q, 9 c, 5 p)
Accuracy: §2 now right (а after ч щ / soft consonants = i, часа́ [ci-SA]); p4 answer, q2 distractor (мать / мат) and §5 sentence fixed. The sign table rows ('-ia, y dopo ж ш ц, tsa) are right. Keys single-correct.
- C1: §3, last sentence: «Dopo ь, ъ o vocale la parola si scompone come in семья́...»: "o vocale" is confusing (after a vowel nothing gets split). Say «Dopo ь o ъ la vocale iotizzata apre una nuova sillaba».
- C2: §2: «пять [PIAT'] (cinque, accentata)» as an ikanie example is odd (it is stressed, so no reduction). It works only as a contrast with де́сять; either say "contrasto" or drop it.
Phonetics: clean (со́лнце [SON-tsy], се́рдце [SIER-tsy], ши́на [SHY-na], шесто́й [shys-TOI], но́чью [NO-ciu]).

## ru-saluti (a.ts, 11 q, 12 c, 7 p)
Accuracy: the new content is right. Hundreds сто ... девятьсо́т, ты́сяча, две ты́сячи, пять ты́сяч (stresses right). 12-hour time with утра́ / дня / ве́чера / но́чи, minutes, полови́на восьмо́го as recognition (right: 7:30). Ordinals and dates (neuter ordinal + month genitive), в ма́е / в январе́, в како́м году́ as recognition, день рожде́ния, в сре́ду. q9-q11 keys single-correct (q11 на семь часо́в ве́чера is a booking formula, "per le sette", so it is acceptable as wrong for "alle sette").
- C3: «I numeri da 5 a 20 e 30 terminano con la ь morbida (40, 90 e 100 no)»: the parenthesis forgets 50-80 (пятьдеся́т ... во́семьдесят end in -т). Write «(40, 50-90 e 100 no)».
- C4: Пожа́луйста alternative [pa-ZHA-li-sta] -> [pa-ZHA-la-sta] (see doubts).
Phonetics:
- C5: шестьсо́т [shyst-SOT]: the т is not pronounced ([ʂɨsʲˈsot]), so [shys-SOT]. (пятьсо́т [pit-SOT] and девятьсо́т [di-vit-SOT] are right as written.)
- Everything else right: две́сти [DVIE-sti], четы́реста [ci-TY-ri-sta], семьсо́т [sim'-SOT], восьмо́го [vas'-MO-va], в де́сять [v DIE-sit'], в два [v DVA] vs в три [f tri], января́ [in-va-RIA], сентября́ [sin-tib-RIA], рожде́ния [razh-DIE-ni-ia], в сре́ду [f SRIE-du].

## ru-essere (a.ts, 11 q, 10 c, 6 p)
Accuracy: the new §7 is right and natural. Dative pronouns мне / тебе́ / ему́ / ей / нам / вам / им; age with год / го́да / лет; нра́вится / нра́вятся with the thing liked as subject; на́до / ну́жно + infinitive; до́лжен / должна́ [dalzh-NA]; нельзя́ / мо́жно; хо́лодно / жа́рко / пло́хо / хорошо́. The genitive table is fixed (окно́ → окна́, мо́ре → мо́ря, вре́мени separate). Feminine professions and the possessor sentence are fixed. q9-q11 keys single-correct.
- C6: card c4: «Dopo preposizione **he/she/they** prendono н-»: English in an Italian course. Write «lui/lei/loro (его́, её, их) prendono н-».
Phonetics: clean (нельзя́ [nil'-ZIA], до́лжен [DOL-zhyn], идти́ [it-TI], инжене́р [in-zhy-NIER], официа́нт [a-fi-tsy-ANT]).

## ru-nomi (a.2.ts, 8 q, 8 c, 5 p)
Accuracy: Ро́сси, семья́ / друзья́ C'-iV and конфе́та gloss are fixed. Keys single-correct.
- C7: §4: «...ма́льчики [MAL'-ci-ki], Mnemonico scolastico»: a comma where a full stop should be (the list runs into the next sentence).
Phonetics: clean.

## ru-aggettivi (a.2.ts, 8 q, 8 c, 5 p)
Accuracy: c4 fixed. Keys single-correct. No findings.
Phonetics: clean.

## ru-presente (a.2.ts, 10 q, 12 c, 6 p)
Accuracy: the new §5 is right. Alternations с→ш (писа́ть, ш in all persons), д→ж (ви́деть, ходи́ть, 1st person only), б→бл, п→пл (спать: сплю, спишь, спи́те), т→ч, г→ж. Tables for писа́ть, ви́деть, спать, дава́ть (даю́ ... даю́т), брать (беру́ ... беру́т); -овать → -у́ю (рису́ю, танцу́ю). Every form and stress is right. q9 and q10 keys single-correct. The A4 fix is right (Я хо́чет пить).
- C8: «-овать / -евать cambiano il suffisso in **-у́-**» (lesson, q10 explanation, card c11): the acute overgeneralizes. The stress lands on у only when the infinitive is stressed on -ова́ть (рисова́ть, танцева́ть); in чу́вствовать → чу́вствую it stays on the stem. Write «-у-» and add «(accento su у se l'infinito è in -ова́ть)».
Phonetics: clean (пи́шешь [PI-shysh], спи́те [SPI-tie], танцева́ть [tan-tsy-VAT'], беру́ [bi-RU]).

## ru-casi1 (a.2.ts, 10 q, 10 c, 6 p)
Accuracy: the new §4 is right. с + instrumental chunks with -ом / -ой (-ем / -ей), с дру́гом [z DRU-gam], с семьёй, ко́фе с молоко́м, чай с лимо́ном, занима́ться спо́ртом / му́зыкой, рабо́тать врачо́м, Кем вы рабо́таете?. Round-1 items (-ии for -ий, па́пу, Я тебя́ люблю́) are fixed. q9 and q10 keys single-correct.
- C9: the intro still says «In A1 bastano tre (casi)» while the module now teaches a fourth one, and §4 opens with «Il quarto caso». Instrumental is the fifth in the traditional order the intro itself lists. Write «Lo strumentale risponde a...» and make the intro «tre casi completi più alcuni blocchi di genitivo, dativo e strumentale».
- C10: §1 «i maschili in -ь prendono -е: в учи́теле» ("inside the teacher") is a semantically odd example. Use в словаре́, в Кремле́ or об учи́теле.
- C11: q4 distractor у вокза́ла («presso la stazione») can honestly be read as "alla stazione" (Встре́тимся у вокза́ла). Replace it with в вокза́л or на вокза́лу.
Phonetics: clean.

## ru-domande (a.3.ts, 11 q, 11 c, 7 p)
Accuracy: the new §7-§10 are right and natural. и / а / но, with а after a negation (the classic Italian error); что / где as subordinators with a comma; поэ́тому; frequency adverbs with the right stresses (всегда́ [fsig-DA], ре́дко [RIET-ka]); imperative from the они́ stem, -й vs -и́ by 1st-person stress, -те, -сь / -тесь, не + imperfective. All imperative forms are right (пиши́ [pi-SHY], скажи́ [ska-ZHY], сади́тесь [sa-DI-tis']). q9-q11 keys single-correct.
- **B2**: q8 «Quale frase risponde a "Что чита́ет Ма́рко?"»: the explanation's criterion («la risposta termina con кни́гу») also fits the distractor «Чита́ет Ма́рко кни́гу.» (VS-O, possible in Russian, and it ends with кни́гу). So the key is not unique by the module's own rule. Replace the distractor with «Кни́гу Ма́рко чита́ет.».
- C12: the imperative rule covers -й and -и́ only. Consonant stems with stem stress take -ь (встать → встань, отве́тить → отве́ть, быть → будь). Add one line «(se l'accento è sul tema: -ь, будь, отве́ть: da riconoscere)» so the learner does not produce *отве́ти.
Phonetics: clean, apart from [a-BYC-na] (C6).

## ru-passato (a.3.ts, 8 q, 8 c, 5 p)
Accuracy: A1 (ходи́л), B2 (письмо́), C11 (closed group жить, быть, пить, дать, взять, нача́ть) and the вы- rule are fixed. Keys single-correct. No findings.
Phonetics: clean (вы́пить [VY-pit'], Вы́зовите [VY-za-vi-tie]).

## ru-moto (a.3.ts, 10 q, 10 c, 6 p)
Accuracy: the new §5 is right. пойти́ / пое́хать present = future with full tables (пойду́ [pai-DU] ... пое́дут); пошёл / пошла́ [pash-LA] / пошли́; Он пошёл в магази́н vs ходи́л; Пойдём!, Дава́й(те) пойдём, Пое́хали!. q4 (на авто́бусе vs с / из / по) is now unambiguous; q9 and q10 single-correct; the «in treno» note is fixed.
- C13: q9 explanation: «Дава́й пойдём è ancora più colloquiale»: Пойдём! is already colloquial; Дава́й пойдём is more explicit as an invitation, not more colloquial. Write «Дава́й пойдём è un invito ancora più esplicito».
Phonetics: clean.

## ru-voc-vita (b.ts, 10 q, 10 c, 6 p)
Accuracy: the new table of 21 hobby / work / study words is right (genders, stresses, колле́га m/f, учёба, экза́мен [ig-ZA-min]). Model sentences are right: игра́ть в + acc. for sports, на + prep. for instruments; Мне ко́фе и во́ду, пожа́луйста. q9 and q10 single-correct.
- C14: карто́шка «una patata (f, parlato)», and the trap note «"una patata" è карто́шка»: карто́шка is first of all the colloquial collective "patate" (жа́реная карто́шка, купи́ карто́шку); one potato is карто́фелина (or одна́ карто́шка in speech). Gloss: «patate (parlato; anche una patata)», and drop the contrast in the trap note. (Round 1 suggested this pairing loosely; the correction is mine.)
Phonetics:
- C15: «Идёт дождь. [i-DIOT DOSHT]» (b.ts:132): the round-1 C4 fix was applied in the table ([DOSHT']) but not here. Use [DOSHT'] in both places.
- C16: эта́ж [e-TASH] (b.ts:48): initial unstressed э is reduced, [i-TASH] (same logic as экза́мен [ig-ZA-min]); same for этаже́ in ru-dialoghi.
- C17: ва́нная [VA-na-ia]: [VAN-na-ia] for consistency with оди́ннадцать [a-DIN-na-tsat'] (long н).

## ru-voc-citta (b.ts, 11 q, 10 c, 6 p)
Accuracy: нужны́ / ну́жно + infinitive rows, q9, c9 and p6 are right; Вы́зовите врача́ / ско́рую; 112 + 101 / 102 / 103 + Viaggiare Sicuri; bottega note removed. Keys single-correct. No findings.
Phonetics: clean (ста́нция [STAN-tsy-ia], поли́ция [pa-LI-tsy-ia], Мне ну́жен [NU-zhyn], нужны́ [nuzh-NY], докуме́нты [da-ku-MIEN-ty]).

## ru-dialoghi (c.ts, 11 q, 10 c, 6 p)
Accuracy: d3 and d4 fixes are natural (А есть подеше́вле?, Э́та сто́ит сто рубле́й, Я возьму́ э́ту; the passer-by now gives directions first). d7 (ты) is natural and idiomatic: То́же хорошо́, Ничего́ осо́бенного, идёт фильм, До ве́чера!. d8 hotel: see doubts. q9-q11 single-correct (q10 distractors попро́ще / подо́льше / побыстре́е are well chosen).
- **B1**: d8 «тре́тий эта́ж» = «terzo piano» and «на пе́рвом этаже́» = «al primo piano» (c.ts:170, 173, 175): in Russia floors are counted from the ground, so пе́рвый эта́ж is the Italian **piano terra** and тре́тий эта́ж the Italian **secondo piano**. The translations teach a false equivalence on exactly the point a traveller needs. Translate «secondo piano (in Russia: terzo)», «al piano terra», and add one line to «Da notare»: «In Russia il пе́рвый эта́ж è il piano terra».
- C18: d3 Italian translation: кни́га is feminine but «libro» is masculine, so «Ne ha **uno** più economic**o**?», «Sì, quest**o**. Quest**o** costa cento rubli», «Bene, prendo quest**o**» (c.ts:63, 69, 71).
- C19: the intro says «sei dialoghi su otto sono in registro formale; il settimo è tra amici, l'ottavo di nuovo formale»: that makes seven formal ones. Write «sette dialoghi su otto sono formali; il settimo è tra amici (ты)».
- C20: d8 «Ты́сяча пятьсо́т рубле́й в день»: hotels say «за ночь» or «в су́тки». Use «Ты́сяча пятьсо́т рубле́й за ночь.» [za NOC'] (or keep в день, which is understood).
Phonetics:
- этаже́ [e-ta-ZHE] -> [i-ta-ZHE], эта́ж [e-TASH] -> [i-TASH] (C16).
- [at-LIC-na] (C6). Everything else right (подеше́вле [pa-di-SHEV-lie], возьму́ [vaz'-MU], осо́бенного [a-SO-bin-na-va], свобо́дный [sva-BOD-nyi], тре́тий [TRIE-tii]).

## ru-esame (c.ts, 40 q, 11 c, 12 p)
Accuracy: 40 questions, every key checked and single-correct (q15 is now unambiguous; q33 has distractors that differ by stress (пи́сьмо, пи́шу), but they are genuinely wrong, so this is acceptable; q40 distractors are fine). The A1 writing model (cartolina + анке́та) is right and well chosen. The error table's two new rows are right (не дом, а шко́ла; Мне два́дцать лет). Reading text fixed (больша́я).
- C21: postcard model and p12: «Приве́т, А́нна! ... До свида́ния!»: the closing does not match the register. До свида́ния is formal; to a friend write «Пока́!» or «Целу́ю!» (Пока́ [pa-KA] is already taught). Same in card c10.
- C22 (optional): p4 «У меня́ нет вре́мени сего́дня» is grammatical; the neutral order is «Сего́дня у меня́ нет вре́мени».
Phonetics: clean (анке́та [an-KIE-ta], во́зраст [VOZ-rast], сдать [ZDAT'], вчера́ [fci-RA]).

## A1 completeness (TORFL ТЭУ / Элементарный lexical-grammatical minimum), re-scored

| # | Item | R1 | R2 | Justification |
|---|------|----|----|---------------|
| 1 | Alphabet + cursive | 1 | 1 | |
| 2 | Stress, reduction, hard/soft, devoicing | 1 | 1 | legend now complete |
| 3 | Intonation | 1 | 1 | |
| 4 | Greetings, ты/вы | 1 | 1 | |
| 5 | Numbers 0-100 | 1 | 1 | |
| 6 | Hundreds to 1000 | 0.5 | 1 | сто ... девятьсо́т, ты́сяча, две ты́сячи, пять ты́сяч; q9, c10, p6 |
| 7 | Time | 0.5 | 1 | 12 h + утра́ / дня / ве́чера / но́чи, minutes, полови́на recognition; q11, c12, esame q28 |
| 8 | Days, months, seasons | 1 | 1 | + в сре́ду |
| 9 | Ordinals + dates | 0 | 1 | ordinals 1-10 + 11, 12, 20, 30 + compound rule, months in genitive, в ма́е, в како́м году́ recognition, день рожде́ния |
| 10 | Age | 0 | 1 | Мне ... лет, год / го́да / лет, Ско́лько тебе́ / вам лет? |
| 11-15 | Pronouns, gender/plural, adjectives, possessives, present | 5 | 5 | |
| 16 | Irregulars + alternations | 0.5 | 1 | писа́ть, ви́деть, спать, дава́ть, брать, -овать |
| 17-23 | -ся, past, future, aspect, prepositional, accusative, genitive chunks | 7 | 7 | |
| 24 | Dative basics | 0 | 0.5 | pronouns + age / нра́вится / на́до / хо́лодно are complete; still no dative of **nouns** (к врачу́, звони́ть ма́ме, дать дру́гу), which the ТЭУ minimum includes as chunks |
| 25 | Instrumental basics | 0 | 1 | с + instr., занима́ться, рабо́тать кем |
| 26 | Motion verbs | 1 | 1 | |
| 27 | пойти́ / пое́хать, Пойдём! | 0 | 1 | full tables, past, invitations |
| 28 | Imperative | 0.5 | 1 | formation rule (-ь type missing, C12) |
| 29-30 | Question words, negation | 2 | 2 | |
| 31 | Likes | 0.5 | 1 | нра́вится / нра́вятся |
| 32 | Modals | 0.5 | 1 | на́до, нельзя́, до́лжен added |
| 33 | Conjunctions | 0.5 | 1 | и / а / но, что, поэ́тому |
| 34 | Frequency adverbs | 0.5 | 1 | six adverbs + position |
| 35-36 | Vocab life / city | 2 | 2 | |
| 37 | Vocab work / study / hobby | 0.5 | 1 | 21-word table + игра́ть в / на |
| 38 | Dialogues (8+) | 0.5 | 1 | 8 |
| 39 | Exam: format, strategies, writing model, 40 q | 0.5 | 1 | all present |
| 40 | Translations + typical errors | 1 | 1 | |

Total **39.5 / 40 = 99%** (round 1: 29.5 / 40 = 74%). The only half point: dative of nouns. A 3-line chunk box in ru-essere §7 would close it: к врачу́ / к дру́гу (к + dat.), звоню́ ма́ме, Дай мне..., Помоги́те мне.

## Final tally
- Severity counts: **A = 0, B = 2, C = 22** (plus C6 carried over as a design decision).
  - B (2): B1 ru-dialoghi d8 floor numbering translated literally (пе́рвый эта́ж = piano terra); B2 ru-domande q8 second option fits the explanation's own criterion.
  - C (22): C1-C2 ru-pron wording; C3 «40, 90 e 100 no»; C4 [pa-ZHA-li-sta] alternative; C5 шестьсо́т [shys-SOT]; C6 English «he/she/they» in ru-essere c4; C7 ru-nomi punctuation; C8 -у́- overgeneralized; C9 «In A1 bastano tre» / «Il quarto caso»; C10 в учи́теле; C11 у вокза́ла distractor; C12 imperative -ь type; C13 Дава́й пойдём «più colloquiale»; C14 карто́шка gloss; C15 [DOSHT] leftover; C16 эта́ж / этаже́ initial э; C17 ва́нная nn; C18 d3 Italian gender (questo libro); C19 «sei dialoghi su otto»; C20 «в день» in the hotel; C21 Приве́т ... До свида́ния in the postcard; C22 word order in esame p4 (optional).
- Stress: 834 distinct stressed forms checked; **no wrong stress** in the teaching content (the wrong stresses that remain are deliberate distractors: хо́чу, жи́вешь, пи́шу, пи́сьмо, вызови́те ...). Quiz keys: 175 items checked, all single-correct except domande q8 (B2).
- **Accuracy: 95/100** (round 1: 88). No A errors; the two B items are one-line fixes; the new grammar (dative, instrumental, alternations, пойти́, imperative, dates) is accurate and natural.
- **Phonetics: 9/10** (round 1: 8). Legend complete and applied consistently (y after ж ш ц, C'-iV, tsa, assimilation, вт = ft); the leftovers are small: [DOSHT], initial э in эта́ж, шестьсо́т, ва́нная, and final ч as bare "c" in modules without a legend (C6).
- **Completeness: 99%** (39.5/40).

## Numbered fix list
1. c.ts ru-dialoghi d8 (lines ~169-175): «terzo piano» -> «secondo piano (in Russia: тре́тий эта́ж)»; «al primo piano» -> «al piano terra»; add to Da notare: «In Russia il пе́рвый эта́ж è il piano terra: si conta da terra.» (B1)
2. a.3.ts:129 ru-domande q8: replace the distractor «Чита́ет Ма́рко кни́гу.» with «Кни́гу Ма́рко чита́ет.». (B2)
3. C6: insert `${PRON_SHORT}` at the top of the lessons in a.2.ts, a.3.ts and c.ts (and ru-saluti, ru-essere in a.ts), so the «c finale = ч» warning is in every module. Optional later: switch to c' (legend + respell.test.ts + about 20 edits).
4. b.ts:132: «Идёт дождь. [i-DIOT DOSHT]» -> [i-DIOT DOSHT']. b.ts:48 эта́ж [e-TASH] -> [i-TASH]; c.ts:169, 173 [e-TASH] -> [i-TASH], [e-ta-ZHE] -> [i-ta-ZHE]; b.ts:38 ва́нная [VA-na-ia] -> [VAN-na-ia]; a.ts:439 шестьсо́т [shyst-SOT] -> [shys-SOT]; a.ts:401 alternative [pa-ZHA-li-sta] -> [pa-ZHA-la-sta].
5. c.ts:63, 69, 71 ru-dialoghi d3 Italian: «Ne ha uno più economico?», «Sì, questo. Questo costa cento rubli.», «Bene, prendo questo.». c.ts:16 intro: «sette dialoghi su otto sono formali». d8: optionally «за ночь» instead of «в день».
6. a.ts:788 ru-essere card c4: «he/she/they» -> «lui/lei/loro (его́, её, их)».
7. a.2.ts ru-casi1: intro «tre casi completi più blocchi di genitivo, dativo e strumentale»; a.2.ts:548 «Il quarto caso» -> «Lo strumentale»; a.2.ts:522 в учи́теле -> в словаре́ (or об учи́теле); a.2.ts:580 q4 distractor у вокза́ла -> в вокза́л.
8. a.2.ts:371, 448, 478 ru-presente: «-у́-» -> «-у- (accentata se l'infinito è in -ова́ть: рису́ю, танцу́ю)».
9. b.ts:65, 74 ru-voc-vita: карто́шка = «patate (parlato; anche una patata)»; drop «"una patata" è карто́шка» from the trap note.
10. c.ts ru-esame: postcard model, card c10 and p12: «До свида́ния!» -> «Пока́!» (to a friend); optional p4 order «Сего́дня у меня́ нет вре́мени».
11. a.3.ts ru-domande §10: one line on the -ь imperative (будь, отве́ть, встань) as recognition. ru-moto q9 explanation: «invito più esplicito» instead of «più colloquiale».
12. a.ts ru-saluti: «(40, 50-90 e 100 no)». ru-pron §3 last sentence and §2 пять example (C1-C2). a.2.ts ru-nomi §4: full stop before «Mnemonico».
13. Completeness (last half point): ru-essere §7, a 3-line box «Dativo dei nomi (solo blocchi)»: к врачу́, к дру́гу; Я звоню́ ма́ме; Помоги́те мне; Дай мне, пожа́луйста... .
