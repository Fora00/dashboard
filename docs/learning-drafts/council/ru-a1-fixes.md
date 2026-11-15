# Russian A1: fixes applied after review round 1

Source: `ru-a1-review-r1.md`. Course folder: `src/projects/learning/courses/russo/`. Module count stays 15; `registry.ts`, `index.ts` (courses) and `languages.test.ts` untouched.

## A findings
| Finding | Fix | Module |
|---|---|---|
| A1 passato p2 `шёл` | model answer `Вчера́ я ходи́л в кино́`, explains that `шёл` = stavo andando | ru-passato (a.3.ts) |
| A2 `большо́я` | `больша́я [bal'-SHA-ia]` in the reading text | ru-esame (c.ts) |
| A3 `Вызови́те` | `Вы́зовите врача́! [VY-za-vi-tie vra-CIA]`, + `Вы́зовите ско́рую!`; rule "perfettivi in вы- = accento su вы-" in ru-passato and ru-voc-citta; quiz q10. Course-wide grep: no other вы- perfective | ru-voc-citta (b.ts), ru-passato |
| A4 presente q6 duplicate | distractor `Я хочу́ пи́ть.` -> `Я хо́чет пить.` | ru-presente (a.2.ts) |

## B findings
| Finding | Fix | Module |
|---|---|---|
| B1 `лю́бить` | `люби́ть` in p4 prompt | ru-presente |
| B2 `пи́сьмо` | `письмо́` in p5 prompt | ru-passato |
| B3 `Росси́` | `Ро́сси [RO-ssi]` | ru-nomi p4 |
| B4 y after ж ш ц | `мо́жешь/мо́жет/мо́жем/мо́жете` [MO-zhysh...], `ну́жен` [NU-zhyn] (x4), `ора́нжевый`, `инжене́р`, `скажи́те`, `официа́нт` (x2), `ста́нция`, `поли́ция`, `со́лнце`, `се́рдце`, `у́лице`; new test enforces it | ru-presente, ru-voc-vita, ru-voc-citta, ru-essere, ru-dialoghi, ru-pron, ru-casi1 |
| B5 unstressed а | rewritten: dura = a breve, after ч щ and soft = i (`часа́ [ci-SA]`) | ru-pron |
| B6 tens with ь | "5-20 e 30" | ru-saluti |
| B7 24-hour claim | 12-hour + `у́тра/дня/ве́чера/но́чи` (`утра́` has final stress as genitive), minutes, `полови́на восьмо́го` as recognition | ru-saluti |
| B8 `вре́мя` model | `окно́ -> окна́`, `мо́ре -> мо́ря`; `вре́мени` as separate irregular chunk | ru-essere |
| B9 d3/d4 | d3 `А есть подеше́вле?`, `Э́та сто́ит сто рубле́й`, `я возьму́ э́ту`; d4 passante now answers `Иди́те пря́мо...` before `Э́то далеко́?` | ru-dialoghi |
| B10 в авто́бусе / в метро́ | q4 now asks for "il mezzo" with distractors по/с/из авто́бус...; esame q15 distractors из/к/без метро́; explanation notes that в авто́бусе/в метро́ exist | ru-moto, ru-esame |
| B11 ь + vowel | one convention `C'-iV`: `семья́ [sim'-IA]`, `друзья́ [druz'-IA]`, `воскресе́нье [vas-kri-SIEN'-ie]` (бра́тья, пла́тье, италья́нец already so); new test | all |
| B-L1 legend | PRON_FULL: y after ж ш ц, -ться/-тся = tsa, assimilation, ь/ъ + vowel, a after ч щ, loanwords with hard consonant, bold warning on final c and z (non come zio); PRON_SHORT updated; ru-pron sign table +3 rows | pron.ts, ru-pron |
| B13 minima | 8 dialoghi, 40 quiz questions, A1 writing model | ru-dialoghi, ru-esame |

## C findings
| Finding | Fix |
|---|---|
| C1 acute on monosyllables | `парк`, `в Рим`, `Рим →`, `пи́ть` fixed; new test (no acute on one-vowel words) |
| C2 loanwords | `интерне́т [in-ter-NET]`, `су́пер [SU-per]` + one line in ru-alfabeto and ru-pron |
| C3 `экза́мен` | `[ig-ZA-min]` (also added to ru-voc-vita vocabulary) |
| C4 `дождь` | `[DOSHT']` |
| C5 `Пожа́луйста` | `[pa-ZHA-lus-ta]` everywhere (14 occurrences) + note in the table paragraph |
| C6 final c / z | bold warning in PRON_FULL, "(non come in zio)" in PRON_SHORT. Skipped: rewriting every final `c` as `c'` (about 40 occurrences, would also need a legend and test change); the warning is the review's stated alternative |
| C7 "sono d'Italia" | "vengo dall'Italia" in ru-saluti and d1 |
| C8 ru-pron wording | p4 answer ("il primo в di здра́вствуйте è muto"), q2 distractor `мать / мат`, §5 sentence rewritten |
| C9 ru-essere | "Alcune hanno una forma femminile (студе́нтка, учи́тельница), altre no"; possessor sentence replaced |
| C10 ru-aggettivi c4 | "Stesse quattro forme di мой: m, f, n e plurale" |
| C11 stress shift | closed group жить, быть, пить, дать, взять, нача́ть |
| C12 ru-moto | "A piedi + in corso"; "in treno" vs "sul treno" explained |
| C13 карто́фель / конфе́та | `карто́фель` = patate (collettivo) + `карто́шка`; конфе́та = caramella, cioccolatino |
| C14 bottega / 112 | note removed (quiz distractor now "panetteria"); 112 + 101/102/103; "Viaggiare Sicuri, il sito della Farnesina" |
| C15 `[ZA-mak]` | q21 explanation fixed |
| C16 cursive ш | "spesso", school convention, same for т (lesson and card) |
| C17 ru-casi1 | -ий -> `в санато́рии`; `па́пу`/`де́душку`; `Я тебя́ люблю́` neutral order; `в Ри́м` unaccented |
| C18 среда́ | `в сре́ду [f SRIE-du]` in lesson, quiz esame q29 |
| C19 нужны́ / нужно + inf | rows + sentences in ru-voc-citta, quiz q9, card c9, practice p6 |
| C20 ordering | `Мне ко́фе и во́ду, пожа́луйста` / `Мо́жно ко́фе?` in ru-voc-vita p4, d2, cards |

Also changed (found while testing): `вто́рник` -> `[FTOR-nik]` (в before a voiceless consonant is f), enforced by test.

## Completeness gaps closed inside the 15 modules
| Gap (table row) | Where | What |
|---|---|---|
| 6 hundreds | ru-saluti | сто ... девятьсо́т, ты́сяча, две ты́сячи; q9, c10, p6 |
| 7 time | ru-saluti | 12h + parte del giorno, minuti, полови́на recognition; q11, c12 |
| 9 ordinals + dates | ru-saluti | ordinals 1-10 (+ 11, 12, 20, 30), months in genitive, `в ма́е`, `в како́м году́?` as recognition, день рожде́ния; q10, c11, p7 |
| 10, 24, 31, 32 age, dative, нра́вится, на́до, нельзя́, до́лжен | ru-essere | new section 7 (dative pronouns as chunks); q9-q11, c9-c10, p6 |
| 25 instrumental | ru-casi1 | new section 4 (с + strumentale, занима́ться спо́ртом, рабо́тать врачо́м); q9-q10, c9-c10, p6 |
| 16 писа́ть, -овать, alternations, дава́ть, брать, спать | ru-presente | new section 5; q9-q10, c10-c12, p6 |
| 27 пойти́ / пое́хать, Пойдём! | ru-moto | new section 5; q9-q10, c9-c10, p6 |
| 33 и / а / но | ru-domande | section 7; q9, c9, p6 |
| 34 frequency | ru-domande | section 9; q10 |
| 28 imperative formation | ru-domande | section 10 (-й / -и́ / -те, -сь, не + impf.); q11, c11, p7 |
| 37 hobby / work vocabulary | ru-voc-vita | table of 21 words + model sentences; q9-q10, c9-c10, p6 |
| 38 dialogues | ru-dialoghi | d7 (ты, Пойдём в кино́?), d8 (hotel); q9-q11, c9-c10, p6 |
| 39 exam | ru-esame | 40 questions, A1 writing model (cartolina + анке́та), 2 extra error rows, c10-c11, p11-p12 |

## New mechanical checks (`respell.test.ts`)
No acute on one-vowel words; no `i` after zh/sh/ts (unstressed or stressed); no `cia/cio/ciu/shsha` in non-final unstressed syllables; ь + vowel needs `'-i`, ъ + vowel `-iV`; -ться/-тся = tsa; final voiced consonant devoiced; в + voiceless consonant = f.

## Not done
- C6: `c'` for final ч (see above).
- Not verified by a native speaker: `подеше́вле`, `утра́` (genitive), ordinals 11-30 stress, hotel dialogue phrasing; all are standard forms but worth one pass in the next review round.

## Round 2 (fix list of ru-a1-review-r2.md: all B and C items)
- B1 ru-dialoghi d8: floors translated as in Italy (305 = «secondo piano (in Russia: тре́тий эта́ж)», breakfast «al piano terra»); Da notare line explains that пе́рвый эта́ж = piano terra; ru-voc-citta эта́ж row glossed «piano (m; пе́рвый эта́ж = piano terra)». Hotel price «за ночь» [za NOC'].
- B2 ru-domande q8: distractor now «Кни́гу Ма́рко чита́ет.», explanation adjusted.
- C6: `${PRON_SHORT}` added after the lead of ru-saluti, ru-essere (a.ts), all of a.2.ts, a.3.ts and c.ts; PRON_SHORT now says «c = c di «ciao», anche a fine parola o prima di consonante: врач [VRAC], non k». No switch to c'.
- C items: дождь [DOSHT'] (b.ts), эта́ж [i-TASH], этаже́ [i-ta-ZHE], шестьсо́т [shys-SOT] (added to SKELETON_OK in respell.test.ts, since the т is silent), ва́нная [VAN-na-ia], Пожа́луйста alt. [pa-ZHA-la-sta], d3 Italian gender, dialoghi intro «sette dialoghi su otto», ru-essere c4 English -> lui/lei/loro, ru-casi1 intro/«Lo strumentale»/в словаре́/в вокза́л distractor, карто́шка gloss + trap note, -овать stress rule (lesson, q10 explanation, card c11), postcard Пока́! (lesson, card c10, p12), imperative -ь line (будь, отве́ть, встань), Дава́й пойдём «invito più esplicito», «(40, 50-90 e 100 no)», ru-pron §3 wording and пять contrast note, ru-nomi full stop before «Mnemonico».
- Completeness: ru-essere §7 new bullet «Dativo dei nomi (solo blocchi)» (к врачу́, звоню́ ма́ме, Помоги́те мне) + card c11.
- Skipped: C22 (esame p4 word order, optional); respell.test.ts check for initial-э reduction (not robust).
- Checks: `npm run check` and `npm run build` green.
