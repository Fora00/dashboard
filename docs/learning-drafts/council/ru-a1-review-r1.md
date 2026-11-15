# Russian A1: ACCURACY + PHONETICS + COMPLETENESS review, round 1

Status: DONE. Legend + 15/15 modules reviewed (ru-alfabeto, ru-pron, ru-saluti, ru-essere, ru-nomi, ru-aggettivi, ru-presente, ru-casi1, ru-domande, ru-passato, ru-moto, ru-voc-vita, ru-voc-citta, ru-dialoghi, ru-esame). Scores at the end.

Method: fresh dump (throwaway vitest, deleted) of every lesson, quiz option + key + explanation, card and practice item of the 15 modules, read in full. Stress checked word by word on the full list of ~600 distinct stressed forms (the mechanical test only checks presence and agreement with the CAPS syllable, not whether the stress is right). Respellings checked against standard Moscow pronunciation and against the legend in pron.ts / ru-pron.

## Builder doubts (header of a.ts and brief)
- ма́ленький, пятьдеся́т, шестьдеся́т, се́мьдесят, во́семьдесят, ты́сяча: stress correct. Respellings [MA-lin'-kii], [pid-di-SIAT], [shyz-di-SIAT], [SIEM'-di-sit], [VO-sim'-di-sit], [TY-si-cia] correct. (ме́дленно is not used anywhere in the content.)
- мужчи́на [mu-SHSHI-na]: correct (жч = щ).
- Cursive: и like u, т like m, д like g (or ∂): correct. ш with a line underneath (and т with a line on top) is a common school convention, not obligatory: say "spesso" (C16).
- TORFL/ТЭУ A1: five subtests (лексика-грамматика, чтение, письмо, аудирование, говорение) and 66% per subtest: correct as indicative; the hedging is appropriate.
- 112: correct as the single emergency number in Russia; add the still-used 101/102/103 (fire/police/ambulance) and replace "Ministero degli Esteri" with "Viaggiare Sicuri (Farnesina)" (C14).
- «Вам ну́жно лека́рство»: correct (лека́рство is neuter, so ну́жно). «Мне ну́жен биле́т / Мне нужна́ ка́рта»: correct, stresses ну́жен / нужна́ / ну́жно right. Missing: нужны́ (plural) and ну́жно + infinitive, promised by the ru-voc-citta intro (C19).

## Legend (pron.ts PRON_FULL / PRON_SHORT, repeated in ru-pron)
Clear and usable for an Italian: syllables, CAPS, sh/zh/shsh/ts/h/y, ia/ie/iu/io, akanie/ikanie examples are good, and the sounds chosen are close to Moscow norm.
- B-L1 (gaps): PRON_FULL does not state three rules that the course applies (and the pron.ts code comment does state): (a) unstressed е (and и) after ж ш ц = y; (b) -ться/-тся = tsa; (c) voicing assimilation inside words (вход [FHOT], сде́лать [ZDIE-lat'], футбо́л [fud-BOL]); and (d) nothing on ь/ъ + vowel (семья́, бра́тья, подъе́зд). Add one line each.
- C6 (usability): final or preconsonantal ч written as bare "c" ([VRAC], [NOC], [KLIUC], [DOC], [RUC-ka]) is read "k" by every Italian; the legend defines it, but consider "c'" ([VRAC'], [NOC']: ч is always soft, so ' is coherent) or at least a bold warning. Same for z = з: an Italian reads z as ts/dz (zio); the legend says "rosa", fine, but repeat it in PRON_SHORT with "(non come zio)".

## ru-alfabeto (a.ts, 8 q, 9 c, 5 p)
Accuracy: all 33 letters accounted for (5 identical, 6 false friends, 18 new, е ё ю я in the vowel table); hard/soft pairs, ё always stressed, ь/ъ correct. Quiz keys single-correct (q1 [NOC] distractor fine).
- C1: p3 writes «па́рк» with an acute on a monosyllable (nowhere else); drop it.
- C16: cursive ш "ha una riga alla base": say "spesso" (school convention, like the line over т).
Phonetics:
- C2: интерне́т [in-tir-NIET]: the norm (and common speech) is hard т and н: [in-ter-NET]. су́пер [SU-pir]: hard п, [SU-per]. Loanwords with hard consonants before е deserve one line in the legend or in ru-pron §3.
- Everything else right (у́хо [U-ha], го́род [GO-rat], жена́ [zhy-NA], подъе́зд [pad-IEST], я́блоко [IA-bla-ka], футбо́л [fud-BOL], метро́ [mit-RO]).

## ru-pron (a.ts, 8 q, 9 c, 5 p)
Accuracy: free/mobile stress, за́мок/замо́к, мука́/му́ка, akanie, ikanie, е after ж ш ц = y, hard/soft pairs (брат/брать, у́гол/у́голь, лук/люк, был/бил), ж ш ц always hard / ч щ й always soft, devoicing, -ого = -ова, что [SHTO], коне́чно [ka-NIESH-na], silent consonants (здра́вствуйте, со́лнце, се́рдце), IK-1 / IK-3 / wh-question intonation: all correct. Keys single-correct.
- B5: §2 "Le vocali а, у, ы, и, э atone non cambiano molto (а diventa più breve)" is wrong for а after soft consonants and ч/щ, which becomes i (часы́ [ci-SY], and the course itself writes часа́ [ci-SA], часо́в [ci-SOF]); post-tonic а is a schwa. Reword: "а atona dopo consonante dura = a breve; dopo ч, щ e consonante morbida = i (часа́ [ci-SA])".
- C8: p4 answer "в e silenziose in здра́вствуйте" is garbled (only the first в is silent); q2 distractor "мать / мать" is the same word twice; §5 "Non è un problema di ascolto, ma di scrittura" is unclear (meaning: the spelling keeps the letter of the form with a vowel).
Phonetics: transcriptions correct. One nit: со́лнце [SON-tsie], се́рдце [SIER-tsie]: ц is always hard and final unstressed е after ц is [ə]/y per the legend; write [SON-tsy], [SIER-tsy] (see B4).

## ru-saluti (a.ts, 8 q, 9 c, 5 p)
Accuracy: greetings, ты/вы, Меня́ зову́т, nationality pairs, numbers 0-100 (all stresses right), 1/2 gender, час/часа́/часо́в, days and months (stress and lowercase), в + accusative for days: correct. Keys single-correct.
- B6: "Alcuni numeri (5-20 e le decine) terminano con la ь": among the tens only 20 and 30 do; 40, 50-80 (-десят), 90 do not. Fix to "5-20 e 30".
- B7: "Il russo usa spesso le 24 ore a voce" is true for timetables, not for conversation, where 12-hour time + у́тра / дня / ве́чера / но́чи is the norm (в семь часо́в ве́чера). Add those four words, полови́на (полови́на восьмо́го) as recognition, and "в семь три́дцать" stays fine.
- C18: say that среда́ shifts stress in в сре́ду [f SRIE-du] (classic trap; the lesson lists в понеде́льник / в пя́тницу / в суббо́ту only).
- C7: "Я из Ита́лии = sono d'Italia" is not natural Italian: "vengo dall'Italia" (also ru-dialoghi d1).
Phonetics:
- C5: Пожа́луйста [pa-ZHA-lui-sta] spells out a й that is normally not heard; the Moscow norm is [pa-ZHA-lus-ta] (or [pa-ZHA-li-sta] fast). Note it once in the table.
- C: numbers inside phrases lowercase (три часа́ [tri ci-SA], пять часо́в [piat' ci-SOF]) while со́рок пять [SO-rak PIAT'] is capped: acceptable phrase stress, keep but be consistent.
- Everything else right (оди́ннадцать [a-DIN-na-tsat'], шестна́дцать [shys-NA-tsat'], сейча́с [si-CIAS], ве́чер [VIE-cir], янва́рь [in-VAR'], четве́рг [cit-VIERK]).

## ru-essere (a.ts, 8 q, 8 c, 5 p)
Accuracy: zero copula, dash rule, это, у + genitive + есть, н- after prepositions, нет + genitive, быть past/future: correct. Keys single-correct.
- B8: genitive table "neutro -а/-я (вре́мя → вре́мени)": вре́мя is the irregular -мя type, not an example of -о → -а / -е → -я. Give окно́ → окна́, мо́ре → мо́ря, and keep вре́мени as a separate chunk.
- C9: "La maggior parte ha una forma femminile in -ка" is too strong (учи́тельница, not *учи́телька; по́вар has no neutral feminine); "il possessore va a sinistra, non il verbo" is garbled.
Phonetics (part of B4):
- инжене́р [in-zhi-NIER] -> [in-zhy-NIER] (unstressed е after ж = y, the legend's own rule).
- официа́нт [a-fi-tsi-ANT] -> [a-fi-tsy-ANT] (и after ц = y).

## ru-nomi (a.2.ts, 8 q, 8 c, 5 p)
Accuracy: gender by ending, masculine -а nouns (па́па, де́душка, дя́дя, мужчи́на), indeclinable loans (кафе́, метро́... neuter, ко́фе masculine), surprising genders, nominative plurals (сёстры, о́кна, моря́, слова́, -а́ plurals дома́/города́/глаза́/номера́/учителя́, suppletive лю́ди/де́ти/друзья́/бра́тья/дни), seven-letter rule and жи-ши/ча-ща mnemonic, false friends: correct. Keys single-correct.
- B3: p4 «Моя́ фами́лия — Росси́ [ra-SSI]»: the Italian surname Rossi keeps its Italian stress in Russian: Ро́сси [RO-ssi]. The learner would mispronounce his own type of surname.
- C13 (shared with voc-vita): конфе́та is mainly a chocolate sweet ("cioccolatino, caramella"); fine as false friend of confetto.
Phonetics:
- B11 (ь + vowel inconsistency, course-wide): семья́ [si-MIA], друзья́ [dru-ZIA] vs бра́тья [BRAT'-ia], пла́тье [PLAT'-ie], италья́нец [i-tal'-IA-nits]. The sound is the same (soft consonant + й + vowel). Use one notation everywhere ([sim'-IA], [druz'-IA]) and state it in the legend (B-L1 d).
- яйцо́ [ii-TSO]: acceptable approximation of [jɪj-].

## ru-aggettivi (a.2.ts, 8 q, 8 c, 5 p)
Accuracy: nominative endings for the four types, stressed -ой, soft -ий, after ш ж ч щ, short list of adjectives (all stresses right: ма́ленький, краси́вый, дешёвый, дорого́й, интере́сный, вку́сный), predicative "Дом большо́й", possessives incl. invariable его́/её/их, чей/чья/чьё/чьи, э́тот/э́та/э́то/э́ти vs invariable э́то: correct. Keys single-correct.
- C10: c4 "Con il plurale e il neutro di nostro/vostro" is garbled; rewrite "наш/ваш: stesse quattro forme, на́ша/на́ше/на́ши".
Phonetics: correct (но́вое [NO-va-ia], хоро́шее [ha-RO-shy-ia], на́ше [NA-shy], её [i-IO]).

## ru-presente (a.2.ts, 8 q, 9 c, 5 p)
Accuracy: one present for simple/progressive, 1st and 2nd conjugation tables, mobile stress (смотрю́/смо́тришь, люблю́/лю́бишь), irregular жить/хоте́ть/мочь/идти́/е́хать/есть/пить, есть "eat" vs есть "there is", -ся/-сь: correct.
- A4: q6 options include «Я хочу́ пить.» (key) and «Я хочу́ пи́ть.» (distractor): the only difference is an acute on a monosyllable, so the distractor is the same correct sentence. Two correct options. Replace with e.g. «Я хочу́ пила́.» or «Я хо́чет пить.».
- B1: p4 prompt "(лю́бить)": wrong stress on the infinitive (люби́ть); the answer note has it right, but the prompt teaches the wrong one.
- Gap (completeness): no verb with consonant alternation or -у/-ешь type (писа́ть: пишу́, пи́шешь; ви́деть: ви́жу; ходи́ть: хожу́ appears only in ru-moto), none of -ова́ть (рисова́ть: рису́ю), дава́ть/брать/спать. ru-esame p10 uses Я пишу́ письмо́ without it ever being taught.
Phonetics (part of B4): мо́жешь, мо́жет, мо́жем, мо́жете [MO-zhish, MO-zhit, MO-zhim, MO-zhi-tie] -> [MO-zhysh, MO-zhyt, MO-zhym, MO-zhy-tie] (also in p3 [my MO-zhim]). -ться [tsa] correct.

## ru-casi1 (a.2.ts, 8 q, 8 c, 5 p)
Accuracy: prepositional -е/-и, в vs на lists, -у́ locatives (аэропорту́, саду́, лесу́, мосту́), adjective -ом/-ой, о/об; accusative -у/-ю, animate masculine = genitive, -ую/-юю, accusative pronouns, где/куда́, домо́й/до́ма: correct. Keys single-correct.
- C17: prepositional -ии also for masculine -ий (санато́рий → в санато́рии); masculine animates in -а (па́па → па́пу) take -у like feminines; "в Ри́м" carries an acute on a monosyllable (C1); mention that the neutral spoken order is Я тебя́ люблю́ (q8 key Я люблю́ тебя́ is fine).
Phonetics: correct (в шко́ле [f SHKO-lie], на у́лице [na U-li-tsie] -> by the legend [na U-li-tsy], part of B4).

## ru-domande (a.3.ts, 8 q, 8 c, 5 p)
Accuracy: question words (почему́ vs заче́м), intonation questions, мо́жно + gen./acc., ли as recognition, не/нет, compulsory double negation (никто́ не, никого́ нет), word order and focus, потому́ что: correct and natural. Keys single-correct. No error found.
Phonetics: correct (отку́да [at-KU-da], когда́ [kag-DA], потому́ что [pa-ta-MU shta], никого́ [ni-ka-VO]).

## ru-passato (a.3.ts, 8 q, 8 c, 5 p)
Accuracy: -л/-ла/-ло/-ли, irregular шёл/мог/ел, aspect pairs (all pairs and stresses right), бу́ду + inf, perfective present = future: correct. Keys single-correct.
- A1: p2 "Ieri sono andato al cinema (a piedi)" -> model answer «Вчера́ я шёл в кино́ (in corso)». Wrong: шёл = "stavo andando"; the Italian means a completed round trip = Вчера́ я ходи́л в кино́ (exactly what ru-moto teaches, and ru-moto p4/q8 say шёл would be wrong). Fix the answer to ходи́л (or пошёл "sono uscito per andare").
- B2: p5 prompt «Он ___ (писа́ть) пи́сьмо»: wrong stress (письмо́), corrected only in the answer.
- C11: "Molti verbi regolari spostano l'accento nelle forme femminili (жил, жила́, жи́ло)": it is a small closed set (жить, быть, пить, дать, взять, нача́ть...), not "many regular verbs"; regular -ать/-ить verbs keep the stress.
Phonetics: correct (шёл [SHOL], могла́ [mag-LA], сде́лать [ZDIE-lat'], посмотре́ть [pas-mat-RIET'], позвони́ть [paz-va-NIT']).

## ru-moto (a.3.ts, 8 q, 8 c, 5 p)
Accuracy: 2×2 scheme, four presents (е́зжу), pasts, round-trip meaning of ходи́л/е́здил, на + prepositional for vehicles, пешко́м, destination в/на + acc.: correct.
- B10: q4 «Come si dice "in autobus"?» with distractor «в авто́бусе»: в авто́бусе is correct Russian ("sull'autobus", "Я в авто́бусе", "е́хать в авто́бусе" is also used). Same in ru-esame q15 (в метро́ is extremely common: "е́хать в метро́", "Я в метро́"). Ask "come mezzo di trasporto (Vado ... )" or replace the distractor with a wrong case (на авто́бус).
- C12: "Pied(i) + in corso" typo; "l'italiano «in treno» non ha una preposizione equivalente" is wrong (it has "in"; the point is that Russian uses на + prepositional).
- Gap: пойти́ / пое́хать (and Пойдём! / Дава́й пойдём) not present at all; they are A1 chunks.
Phonetics: correct (е́зжу [IEZH-zhu], на по́езде [na PO-iz-die], пешко́м [pish-KOM]).

## ru-voc-vita (b.ts, 8 q, 8 c, 5 p)
Accuracy: about 99 words in 7 themed tables, genders right, all stresses checked right; обе́д/у́жин, ма́сло, рука́/нога́, си́ний/голубо́й, Идёт дождь traps correct. Keys single-correct.
- C13: карто́фель is the collective "patate"; "una patata" = карто́шка / карто́фелина.
- C20 (also ru-dialoghi d2): ordering with «Я хочу́ ко́фе и во́ду» is understood but blunt; add the natural «Мне ко́фе, пожа́луйста» / «Мо́жно ко́фе?».
- Gap: no hobby / free time / sport / work-study set (спорт, му́зыка, кино́ are scattered; занима́ться спо́ртом needs the instrumental).
Phonetics:
- C4: дождь [DOSHT] -> [DOSHT'] (final т is soft: [doʂtʲ]).
- ора́нжевый [a-RAN-zhi-vyi] -> [a-RAN-zhy-vyi] (B4). се́рдце, со́лнце -tsie (B4).

## ru-voc-citta (b.ts, 8 q, 8 c, 5 p)
Accuracy: places, transport, shopping, restaurant, directions, emergencies: correct words and genders; ну́жен/нужна́ agreement, рубле́й after 5+: correct. Keys single-correct.
- A3: «Вызови́те врача́! [vy-za-VI-tie vra-CIA]»: wrong stress. Perfective verbs with the prefix вы- always stress вы-: Вы́зовите врача́! [VY-za-vi-tie vra-CIA]. A learner who says vyzaVIte in an emergency is understood, but this is a high-frequency formula taught wrong.
- C14: "апте́ка ... non una «bottega»" makes no sense to a learner (drop it); 112 note: see builder doubts.
- C19: the intro promises Мне ну́жно; add ну́жно + infinitive (Мне ну́жно купи́ть биле́т) and нужны́ (plural).
Phonetics (B4): ста́нция [STAN-tsi-ia] -> [STAN-tsy-ia]; поли́ция [pa-LI-tsi-ia] -> [pa-LI-tsy-ia]; официа́нт (as above); Мне ну́жен [NU-zhin] -> [NU-zhyn]. Rest correct (пло́щадь [PLO-shshit'], по́езд [PO-ist], по́мощь [PO-mashsh], Прия́тного аппети́та [pri-IAT-na-va a-pi-TI-ta], дёшево [DIO-shy-va]).

## ru-dialoghi (c.ts, 8 q, 8 c, 5 p)
Accuracy: grammar of all six dialogues correct; d1, d2, d5, d6 natural (Что вы бу́дете?, Э́то всё?, Вам ну́жно лека́рство, биле́т до Москвы́, На како́е число́?). Keys single-correct.
- B9: d3 «У вас есть дешёвая?» for "Ne ha una più economica?" and «Она́ сто рубле́й» are not what a native says: «А есть подеше́вле?» (recognition chunk) and «Э́та сто́ит сто рубле́й» / «Вот э́та, сто рубле́й». d4: the passer-by says «Вокза́л недалеко́» and Marco then asks «Э́то далеко́?»: swap the order or drop the first sentence.
- B13: 6 dialogues; the brief asks 8+ for dialoghi modules (missing natural candidates: telephone/appointment, hotel check-in, at the market with numbers, meeting a friend with ты).
- C7: "Sono d'Italia" (see ru-saluti).
Phonetics: correct (Э́то всё [E-ta FSIO], Сто пятьдеся́т рубле́й [STO pid-di-SIAT rub-LIEI], Скажи́те [ska-ZHI-tie] -> [ska-ZHY-tie] by the legend, B4).

## ru-esame (c.ts, 24 q, 9 c, 10 p)
Accuracy: level mapping, format (indicative, well hedged), can-do list, strategies, typical errors table, translations: correct. Keys single-correct except the B10 ambiguity in q15.
- A2: reading text «Моя́ семья́ большо́я [bal'-SHO-ia]»: not a Russian word; семья́ is feminine: больша́я [bal'-SHA-ia]. In the exam module's model text this is the worst place for a form error.
- B13: 24 quiz questions; the brief asks 40 mixed questions for the esame module. No A1 writing model (cartolina / short message / анке́та) although the can-do list mentions it.
- C15: q21 explanation "Za-mak e za-MOK": write [ZA-mak] and [za-MOK].
- p10 uses Я пишу́ (never taught; see ru-presente gap).
Phonetics:
- C3: экза́мен [ek-ZA-min] -> [ig-ZA-min] (к voiced before з; initial unstressed э reduced). Элемента́рный [e-li-min-TAR-nyi] fine.

## A1 completeness (TORFL ТЭУ / Элементарный lexical-grammatical minimum)

| # | Item | Score | Where / note |
|---|------|-------|--------------|
| 1 | Alphabet + cursive | 1 | ru-alfabeto |
| 2 | Stress, reduction, hard/soft, devoicing | 1 | ru-pron |
| 3 | Intonation IK-1 / IK-3 / wh | 1 | ru-pron, ru-domande |
| 4 | Greetings, politeness, ты/вы | 1 | ru-saluti |
| 5 | Numbers 0-100 | 1 | ru-saluti |
| 6 | Hundreds to 1000 (две́сти, три́ста, четы́реста, пятьсо́т...) | 0.5 | only сто, три́ста (dialogue), ты́сяча |
| 7 | Time (час/часа́/часо́в, в + time, у́тра/ве́чера, minutes, полови́на) | 0.5 | no у́тра/ве́чера, minutes, half |
| 8 | Days, months, seasons | 1 | ru-saluti, ru-voc-vita |
| 9 | Ordinals + dates (пе́рвый..., пе́рвое ма́я, в ма́е, в како́м году́ as recognition) | 0 | absent; Како́е сего́дня число́? is asked but cannot be answered |
| 10 | Age (Мне два́дцать пять лет, Ско́лько тебе́ лет?) | 0 | absent although listed in ru-esame can-do |
| 11 | Personal pronouns nom + acc + у меня́ | 1 | ru-essere, ru-casi1 |
| 12 | Gender, nominative plural | 1 | ru-nomi |
| 13 | Adjective agreement | 1 | ru-aggettivi (+ prep/acc in casi1) |
| 14 | Possessives, чей, э́тот | 1 | ru-aggettivi |
| 15 | Present 1st/2nd conjugation | 1 | ru-presente |
| 16 | Key irregulars + alternations (писа́ть пишу́, ви́деть ви́жу, -ова́ть, дава́ть, брать, спать) | 0.5 | only жить/хоте́ть/мочь/идти́/е́хать/есть/пить |
| 17 | -ся verbs | 1 | ru-presente |
| 18 | Past | 1 | ru-passato |
| 19 | Future бу́ду + inf, perfective future | 1 | ru-passato, ru-essere |
| 20 | Aspect pairs intro | 1 | ru-passato |
| 21 | Prepositional (location, о) | 1 | ru-casi1 |
| 22 | Accusative (object, direction, в + day) | 1 | ru-casi1, ru-saluti |
| 23 | Genitive chunks (нет, у, из, до, after numbers) | 1 | ru-essere, ru-saluti, ru-dialoghi |
| 24 | Dative basics (мне/тебе́ pronouns, мне нра́вится, мне на́до, к врачу́, age) | 0 | only unexplained chunks (мне пло́хо, мне ну́жен) |
| 25 | Instrumental basics (с + instr.: ко́фе с молоко́м, с дру́гом; занима́ться спо́ртом) | 0 | absent |
| 26 | Motion verbs идти́/ходи́ть/е́хать/е́здить | 1 | ru-moto |
| 27 | пойти́ / пое́хать, Пойдём! / Дава́й... | 0 | absent |
| 28 | Imperative (chunks + formation -й/-и/-те) | 0.5 | chunks only (Повтори́те, Иди́те, Скажи́те, Помоги́те) |
| 29 | Question words | 1 | ru-domande |
| 30 | Negation + ни- | 1 | ru-domande |
| 31 | Likes: люби́ть + inf, мне нра́вится | 0.5 | нра́вится absent |
| 32 | Modals: хоте́ть, мочь, мо́жно, ну́жно/на́до, нельзя́ | 0.5 | на́до, нельзя́, до́лжен absent |
| 33 | Conjunctions и / а / но (Italian trap: а), что, потому́ что, поэ́тому | 0.5 | only потому́ что; а vs и vs но never explained |
| 34 | Time/frequency adverbs (всегда́, ча́сто, иногда́, обы́чно, ка́ждый день) | 0.5 | only ка́ждый день, вчера́/за́втра |
| 35 | Vocab family/house/food/body/clothes/weather | 1 | ru-voc-vita |
| 36 | Vocab city/transport/shops/restaurant/emergencies | 1 | ru-voc-citta |
| 37 | Vocab work/study/free time/sport/hobby | 0.5 | professions only (ru-essere) |
| 38 | Situational dialogues (8+) | 0.5 | 6 |
| 39 | Exam: format, strategies, A1 writing model, 40 mixed questions | 0.5 | no writing model, 24 q |
| 40 | Translations IT↔RU + typical Italian errors | 1 | ru-esame, practice everywhere |

Total 29.5 / 40 = **74%**.

Where to add the gaps (smallest effort first):
1. ru-saluti: hundreds row (сто, две́сти, три́ста, четы́реста, пятьсо́т ... девятьсо́т, ты́сяча), у́тра/дня/ве́чера/но́чи, minutes (в семь два́дцать), полови́на as recognition; ordinals 1-31 neuter for dates (пе́рвое, второ́е, тре́тье... Сего́дня пя́тое ма́я), в ма́е (prepositional of months).
2. ru-essere (or a new short h3 in ru-casi1): dative pronouns мне/тебе́/ему́/ей/нам/вам/им with four chunks: Мне два́дцать лет (год/го́да/лет), Мне нра́вится / нра́вятся, Мне на́до / ну́жно + inf, Мне хо́лодно; нельзя́.
3. ru-casi1: short h3 "с + strumentale (solo blocchi)": с дру́гом, с ма́мой, ко́фе с молоко́м, чай с лимо́ном; занима́ться спо́ртом / му́зыкой as recognition.
4. ru-presente: one table for писа́ть (пишу́, пи́шешь, пи́шут) and ви́деть/ходи́ть alternation, one for -ова́ть (рисова́ть: рису́ю), plus дава́ть, брать, спать; ru-moto: пойти́ / пое́хать (пойду́, пое́ду; пошёл) and Пойдём!.
5. ru-domande: h3 "и, а, но" (а = contrast/switch, typical Italian error), что/где as subordinators (Я зна́ю, что...), поэ́тому; frequency adverbs.
6. ru-voc-vita: hobby / sport / work-study table (20 words).
7. ru-dialoghi: two more dialogues (ты with a friend + Пойдём в кино́?, hotel or phone); ru-esame: 16 more quiz items + an A1 writing model (cartolina / анке́та).
8. Imperative: short h3 (formation from the present stem: чита́й(те), говори́(те), сади́тесь) in ru-domande or ru-moto.

## Final tally
- Severity counts: **A = 4, B = 13, C = 20**.
  - A (4): A1 ru-passato p2 шёл for "sono andato al cinema"; A2 ru-esame reading text большо́я; A3 ru-voc-citta Вызови́те (= Вы́зовите); A4 ru-presente q6 two correct options (пить / пи́ть).
  - B (13): B1 лю́бить prompt (ru-presente p4); B2 пи́сьмо prompt (ru-passato p5); B3 Росси́ -> Ро́сси (ru-nomi p4); B4 е/и after ж and ц written i/ie against the legend (мо́жешь..., ну́жен, ора́нжевый, инжене́р, скажи́те, официа́нт, ста́нция, поли́ция, со́лнце, се́рдце, у́лице); B5 ru-pron "а atona non cambia"; B6 "le decine terminano con ь"; B7 24-hour claim + no у́тра/ве́чера; B8 вре́мя as neuter genitive model; B9 ru-dialoghi d3/d4 naturalness; B10 в авто́бусе / в метро́ distractors are correct Russian (ru-moto q4, ru-esame q15); B11 ь + vowel notation inconsistent; B-L1 legend gaps (y after ж ш ц, -ться, assimilation, ь + vowel); B13 brief minima (6 dialogues, 24 exam questions, no writing model).
  - C (20): C1 acute on monosyllables (па́рк, Ри́м, пи́ть); C2 интерне́т/су́пер hard consonants; C3 экза́мен [ig-ZA-min]; C4 дождь [DOSHT']; C5 пожа́луйста [pa-ZHA-lus-ta] note; C6 final ч "c" read as k, z vs zio; C7 "sono d'Italia"; C8 ru-pron p4/q2/§5 wording; C9 ru-essere -ка and possessor wording; C10 ru-aggettivi c4; C11 "molti verbi regolari" stress shift; C12 ru-moto typos/"in treno"; C13 карто́фель, конфе́та; C14 bottega + 101/102/103; C15 q21 Za-mak; C16 cursive "spesso"; C17 ru-casi1 -ий, па́пу, Я тебя́ люблю́; C18 в сре́ду; C19 нужны́ / ну́жно + inf; C20 ordering with Я хочу́.
- Stress: of ~600 distinct stressed forms, only вызови́те, лю́бить, пи́сьмо, Росси́ and the non-word большо́я are wrong (plus three acutes on monosyllables). All builder doubt words correct. Quiz keys: 136 items checked, all single-correct except presente q6 (A4) and the в/на ambiguity (B10).
- **Accuracy score: 88/100** (four A items, each easy to fix; grammar explanations otherwise sound and natural).
- **Phonetics score: 8/10** (legend good and transcriptions largely right, stress and akanie/ikanie consistent; minus one systematic legend violation after ж/ц, the ь + vowel inconsistency and legend gaps).
- **Completeness: 74%** (29.5/40).

## Numbered fix list
1. a.3.ts ru-passato p2: «Вчера́ я ходи́л в кино́.» (remove "(in corso)"); explain that шёл = stavo andando.
2. c.ts ru-esame reading text: большо́я [bal'-SHO-ia] -> больша́я [bal'-SHA-ia].
3. b.ts:323 ru-voc-citta: Вы́зовите врача́! [VY-za-vi-tie vra-CIA].
4. a.2.ts:408 ru-presente q6: replace the «Я хочу́ пи́ть.» distractor with a wrong sentence.
5. a.2.ts:468 лю́бить -> люби́ть; a.3.ts:298 пи́сьмо -> письмо́; a.2.ts ru-nomi p4 Росси́ [ra-SSI] -> Ро́сси [RO-ssi]; drop acutes on па́рк (a.ts:195), Ри́м (a.2.ts, c.ts:208), пи́ть.
6. Course-wide respelling sweep (B4): unstressed е/и after ж and ц = y: [MO-zhysh], [MO-zhyt], [MO-zhym], [MO-zhy-tie], [NU-zhyn], [a-RAN-zhy-vyi], [in-zhy-NIER], [ska-ZHY-tie], [a-fi-tsy-ANT], [STAN-tsy-ia], [pa-LI-tsy-ia], [SON-tsy], [SIER-tsy], [na U-li-tsy]. Consider a respell.test.ts check: after zh/ts, an "i"/"ie" in the respelling is an error.
7. ь + vowel (B11): one notation (consonant + ' + ia/ie/iu): семья́ [sim'-IA], друзья́ [druz'-IA], keep бра́тья [BRAT'-ia], пла́тье [PLAT'-ie].
8. pron.ts PRON_FULL (+ ru-pron): add y after ж ш ц, -ться/-тся = tsa, assimilation (вход [FHOT], сде́лать [ZDIE-lat']), ь/ъ + vowel; fix §2 on unstressed а (after ч щ and soft consonants = i, часа́ [ci-SA]); decide on final ч (c' or a bold warning) and z "non come zio".
9. a.ts ru-saluti: "5-20 e 30" for final ь; replace the 24-hour sentence with 12-hour + у́тра/дня/ве́чера/но́чи; в сре́ду stress; "vengo dall'Italia".
10. a.ts ru-essere: genitive neuter example окно́ → окна́, мо́ре → мо́ря; вре́мени as a separate chunk; инжене́р/официа́нт respelling.
11. c.ts ru-dialoghi d3: «А есть подеше́вле?», «Э́та сто́ит сто рубле́й»; d4 fix the недалеко́/далеко́ order; add two dialogues (8 total).
12. a.3.ts ru-moto q4 and c.ts ru-esame q15: ask for the means of transport explicitly or replace в авто́бусе / в метро́ distractors.
13. Small wording (C list): ru-pron p4/q2/§5, ru-essere -ка + possessor sentence, ru-aggettivi c4, ru-passato "molti verbi regolari", ru-moto "Pied(i)" + "in treno", ru-voc-vita карто́фель, ru-voc-citta bottega + 101/102/103 + Viaggiare Sicuri, ru-esame q21 [ZA-mak], loanwords интерне́т [in-ter-NET] / су́пер [SU-per], экза́мен [ig-ZA-min], дождь [DOSHT'], пожа́луйста note.
14. Completeness (74% -> ~90%): ordinals + dates and hundreds (ru-saluti); age, мне нра́вится, на́до, нельзя́ via dative pronouns (ru-essere); с + instrumental chunks (ru-casi1); писа́ть/-ова́ть/alternations (ru-presente); пойти́/пое́хать (ru-moto); и/а/но + frequency adverbs (ru-domande); imperative formation; hobby/work vocab (b.ts); 16 more exam questions + A1 writing model (ru-esame).
