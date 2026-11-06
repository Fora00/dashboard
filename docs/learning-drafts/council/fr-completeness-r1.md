# French course completeness audit, round 1 (strict)

Scope: francese.* (27 modules, 4-8.5k chars lesson each, 5 practice items per module except fr-drills = 40, fr-esame = 40 quiz).
Method: read lesson text of pron, saluti, nomi, presente, quotidiano, passiva, connecteurs, trapas, voc-*, confronti, pronomi; grep-verified the rest.

## Score table (1 / 0.5 / 0)
### A. Rubric grammar (37)
| # | Item | Score | Where / note |
|---|---|---|---|
| 1 | pronuncia (nasali, liaison, e muta) | 1 | fr-pron |
| 2 | ortografia/accenti | 1 | fr-pron |
| 3 | saluti, numeri 70/80/90, data, ora | 1 | fr-saluti |
| 4 | être/avoir/il y a/c'est vs il est | 1 | fr-etre |
| 5 | articoli, partitivi, contrazioni | 1 | fr-nomi |
| 6 | genere/numero/aggettivi/possessivi/dimostrativi | 0.5 | one h3 for possessives+demonstratives; no systematic feminine rules (-eur/-euse, -teur/-trice, -if/-ive, -er/-ère, -on/-onne), no celui/celle |
| 7 | presente + irregolari + cambi ortografici | 0.5 | table has 11 verbs; no écrire, connaître, croire, vivre, recevoir, suivre, courir, partir/sortir/dormir conjugated |
| 8 | pronominali | 0.5 | one short h3 in fr-quotidiano; no se souvenir/se rappeler/s'asseoir, reciprocal, passé composé accord drill |
| 9 | negazione | 1 | pas/jamais/plus/rien/personne/que, de after negation (ni...ni, aucun absent: see extras) |
| 10 | domande (3 forme) | 1 | fr-quotidiano + fr-confronti (quel/lequel) |
| 11 | preposizioni + geografia (en/au/aux) | 0.5 | geography = one sentence in fr-saluti; no cities/regions/states/islands, no de/du/d' origin table |
| 12 | passé composé avoir/être + accordo | 1 | |
| 13 | imparfait + contrasto | 1 | |
| 14 | plus-que-parfait | 1 | |
| 15 | futur simple/proche/récent | 1 | |
| 16 | conditionnel | 1 | |
| 17 | si-clauses | 1 | |
| 18 | pronomi COD/COI/y/en + ordine | 1 | |
| 19 | tonici | 1 | |
| 20 | imperativo | 1 | |
| 21 | comparativi/superlativi | 1 | |
| 22 | quantità | 0.5 | beaucoup/peu/assez/trop only; plusieurs, quelques, chaque, chacun, tout/tous/toute, certains, aucun, n'importe absent; % and fractions barely |
| 23 | subjonctif presente | 1 | |
| 24 | subjonctif congiunzioni/passé | 1 | |
| 25 | futur antérieur / cond. passé / passé simple | 1 | |
| 26 | passiva/on/impersonale | 1 | |
| 27 | gérondif/participe présent | 1 | |
| 28 | relativi | 1 | qui/que/dont/où/lequel/ce qui/ce que/ce dont |
| 29 | faire + infinito | 1 | |
| 30 | discorso indiretto | 1 | |
| 31 | connettori | 1 | |
| 32 | enfasi/dislocazione | 1 | |
| 33 | registri/lettere | 1 | |
| 34 | francofonia | 1 | |
| 35 | falsi amici | 1 | |
| 36 | argot/verlan | 1 | |
| 37 | avverbi in -ment | 0 | no formation rule, no irregulars (évidemment, gentiment, vraiment), no position |
Subtotal: 33.5 / 37

### B. Rubric skills/content (12 lines; vocab split in 3)
| Item | Score | Note |
|---|---|---|
| Vocab: vita (casa, famiglia, corpo, cibo, vestiti, meteo, shopping) | 0.5 | all themes present with [pron], but ~10 words per theme (one 7.7k module for 7 themes); no verbs/collocations/usage per theme |
| Vocab: viaggi e città (trasporti, albergo, città, indicazioni, emergenze, banca/posta, divertimento) | 0.5 | same |
| Vocab: lavoro/studio/tech/opinioni/politica/economia/conversare | 0.5 | same; politics/economy lexicon is a handful of words, below B2 |
| Dialoghi per situazione | 1 | 9 dialogues with pron + IT |
| Traduzione IT->FR e FR->IT | 1 | fr-drills, 40 items |
| Produzione scritta (email, lettera, riassunto, opinione) | 0.5 | email/CV/reclamo yes (fr-registres); no riassunto/synthèse, no essai argumenté, only one h3 of models in fr-esame |
| Esame (formato, strategie, punteggi) | 1 | fr-esame, 40 quiz |
| Errori tipici degli italiani | 1 | trap section in every module + falsiamici |
| Pronuncia con approssimazioni italiane | 1 | (detailed in C) |
| Numerali e ordinali | 0.5 | cardinals/dates strong; ordinals only "premier", no deuxième...vingtième, fractions/percent, "mille/million" agreement, siècles |
| Espressioni idiomatiche/proverbi | 0.5 | 8 idioms + verlan; zero proverbs |
| Verbi + preposizione (penser à, rêver de, dépendre de) | 0.5 | 4-5 verbs in "Trappole di reggenza"; no systematic list (à / de / sur / avec / en, verbs without prep: chercher, attendre, écouter) |
Subtotal: 8.5 / 12
Depth check (>=2500 chars, h3, tables, traps, summary, model answers): 1 / 1 (all pass; weakness: only 5 practice per grammar module, and fr-passiva packs 6 topics into 5.1k chars)

### C. Phonetics / "how to say it" (scored, 10 lines)
| Item | Score | Note |
|---|---|---|
| Italian-based respelling legend, in every module | 1 | PRON_FULL/PRON_SHORT |
| Vowels, nasals, consonants with Italian approximations | 1 | fr-pron tables, ü/ö articulation tips, r |
| Liaison: obligatoire / interdite / facultative classification, h aspiré list | 0.5 | examples and "mai dopo et / h aspirata", no systematic categories, no list of h aspiré words |
| e muet / schwa: when it drops or stays (loi des trois consonnes) | 0.5 | only "ë debole, spesso cade"; no rule, no "petit à petit / je ne sais pas" drill |
| Intonation / rhythm groups (rise for yes/no question, fall, enumeration, focus) | 0.5 | rhythm explained; intonation only mentioned in fr-quotidiano |
| Minimal pairs drill | 1 | fr-pron + fr-drills |
| Numbers/dates/times with pronunciation | 1 | fr-saluti |
| Verb-ending and homophone sound traps (parle/parles/parlent, é/er/ez, il vit/vint) | 1 | |
| Final consonants / CaReFuL | 1 | |
| Spelling-sound exceptions (-ent in adverbs/nouns [amã], ex- [egz], -ti- [si], plus/tous/fils/sens/os, second [zgõ], oignon) | 0.5 | main correspondences covered, exceptions absent |
Subtotal: 8.0 / 10

### D. Référentiel items the rubric forgot (6, added honestly)
| Item | Score | Note |
|---|---|---|
| Indefinites: plusieurs, quelques, chaque/chacun, tout (adj/pron/adv), quelqu'un/quelque chose, n'importe, certains, autre/même | 0 | grep: "plusieurs" 0, "quelques" 0, "chacun" 0, n'importe 0 |
| Demonstrative pronouns: celui/celle/ceux, celui-ci, ceci/cela/ça | 0 | no "celui qui" anywhere |
| Grammatical homophones (a/à, ou/où, ce/se, c'est/s'est, ses/ces, on/ont, son/sont, et/est, leur/leurs, quel/qu'elle) | 0 | only é/er/ez in fr-trapas; essential for DELF written |
| Subjonctif imparfait/plus-que-parfait (recognition, B2 reading) | 0.5 | a couple of mentions only |
| Graded reading comprehension texts + questions (DELF B1/B2 compréhension écrite) | 0 | dialogues only |
| Negation extended: ni...ni, aucun/nul, pas encore/pas du tout, ne without pas, ne explétif, negation + infinitive | 0.5 | ne...que, rien, personne ok; rest absent |
Subtotal: 1.0 / 6

## TOTAL
Points 33.5 + 8.5 + 1 + 8.0 + 1.0 = **52.0 / 66 = 78.8%** (strict, no rounding). Target >= 90% = 59.4 points, so +7.4 needed.
Without the added extras (rubric items A+B+depth only): 43 / 50 = 86.0%.

## Prioritized additions to reach >= 90% (module id + what + size)
Each new module follows the house format (lesson >= 3500 chars with h3, [ ] respelling, trap section, say-box; 10 quiz, 10 cards, 8 practice).
1. **fr-determinants** (new, group b1, ~6000 chars): indefinites (plusieurs, quelques, chaque, chacun, tout 4 uses, quelqu'un, n'importe, certains, autre/même), demonstrative pronouns (celui/celle/ceux + de/qui/que, -ci/-là, ceci/cela/ça), adverbs in -ment (formation, évidemment/gentiment/vraiment, position), ordinals/fractions/percent/siècles/mille-million. Gains: items 37 (+1), 22 (+0.5), indefinites (+1), demonstratives (+1), numerali (+0.5) = **+4.0**.
2. **fr-pron2** (new, group a1 appendix, ~4500 chars): liaison obligatoire/interdite/facultative with h aspiré word list, e muet and loi des trois consonnes, 3 intonation contours with Italian-readable marks, spelling-sound exceptions list, 15 read-aloud sentences. Gains: 4 phonetics lines x 0.5 = **+2.0**.
3. **fr-ortho-lecture** (new, group b1/b2, ~5000 chars): grammatical homophones table + dictée-style practice (+1); 3 graded reading texts (B1, B1+, B2) with DELF-style questions and answers (+1); imparfait/plus-que-parfait du subjonctif recognition box (+0.5) = **+2.5**.
4. **fr-geo-reggenze** (new, group a2/b1, ~4500 chars): countries/cities/regions/US states/islands with à/en/au/aux/dans/de/du/d'/des (+0.5 item 11); verb+preposition list of ~50 verbs by pattern (à, de, sur, avec, en, none; chercher/attendre/écouter) with COI/pronoun consequences (+0.5) = **+1.0**.
Subtotal of 1-4: +9.5 -> 61.5 / 66 = **93.2%** (target met; denominator unchanged).
Optional to widen margin (each ~+0.5 to +1):
5. Extend fr-presente with a second irregular table (écrire, connaître, croire, vivre, recevoir, suivre, courir, partir, sortir, dormir, ouvrir) (+0.5 item 7); extend fr-quotidiano pronominaux (se souvenir de, se rappeler, s'asseoir, reciprocal, accord) (+0.5 item 8); extend fr-nomi with feminine/plural formation tables (+0.5 item 6); ~2500 chars total.
6. Extend fr-registres or fr-esame: riassunto/synthèse and essai argumenté model with connector checklist (+0.5 production); 20 proverbs/idioms with pron (+0.5); extended negation box in fr-quotidiano (+0.5).
7. Vocabulary depth: double each voc theme to ~20-25 words with verbs and a collocation sentence (+1.5 across three lines), 2 more practice items per voc module.
Also (quality, not score): raise practice from 5 to 8 in fr-passiva and fr-subj1/2, the densest modules.
