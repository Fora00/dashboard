# Spanish course (spagnolo.*) - PHONETICS review, round 2

Role: phonetician, Spanish for Italians. Re-verification after the fix round that followed r1.

Method: extracted 2009 bracket items (`word [RESPELLING]`, vocabulary rows and phrase transcriptions) from all `spagnolo.*.ts` files with a script, then ran mechanical checks: intervocalic s without `ss`, soft d without `dh` (any d not word-initial and not after n/l), j / z / sh / cha / gue / gui, `c` vs `ch` count, and stress (Spanish accent rules vs capitalised syllable on 854 single-word items). Findings were then read sound by sound as an Italian reader. Items that were deliberately wrong quiz distractors were excluded.

## Verdict

Score: **9/10** after the fixes below (8.5 before them). The r1 problems are resolved: half A and half B now use the same notation (`ss`, `dh`, `y`, `sce`, `CIAO`, `MU-cia`, `du-CIAR-se`, `ye-GHE`, `a-BLA-bais`, `THIEN-to`, `por KE` all verified). Stress: 0 real errors in 854 single-word items. Remaining weakness: the `dr` cluster is written with a plain d (see C1), a documented simplification.

## 1. r1 findings re-checked

| r1 item | Status |
|---|---|
| chao [CAO], mucha [MU-cha], ducharse, llegué [ye-GUE], hablabais | fixed |
| B used no ss / dh, j for ll/y, "gi di gita" | fixed (no `j`, no `she`, no "gi" left; only wrong-answer distractors keep them) |
| Rioplatense `she`; aspirated -s forms | unified (`sce`, `loh a-MI-goh`) |
| `por-KE` hyphen, `ciento [THIEN]`, esa/ese | fixed |
| dh/ss slips in A (todo, verde, médico, idioma, veintidós, tarde, dieciséis, Dáselo, Siéntese) | all fixed |

## 2. Coverage of the r1 missing traps

All present: g softening, voiced s before voiced consonants (table row s), final-r tap and r in clusters, gn/ll/ss/rr length, final consonants without vowel, y strong after n/l, triphthongs and weak+weak diphthongs, hiatus with silent h, tilde of monosyllables, -mente, solo/aun, indirect interrogatives, verb+clitic, término/termino/terminó (all in es-pron `spagnolo.a.ts` l.36-100). Linking, syllable division, rhythm, intonation, minimal pairs (8), trabalenguas (3) and a reading check are in `es-fonetica2` (`spagnolo.a.5.ts`). Nothing missing.

## 3. Findings

### A (wrong, would mislead) - 0 found

### B (inconsistent with the convention / imprecise) - 19 found, all fixed

Soft d written plain (rule: d after a vowel, r, s is `dh`; after n/l and word-initial it stays `d`):
1. `spagnolo.b.4.ts:32` jardín [har-DIN] -> [har-DHIN]
2. `spagnolo.b.4.ts:102` verdura [ber-DU-ra] -> [ber-DHU-ra]
3. `spagnolo.b.4.ts:349,355,389` perdido [per-DI-dho] -> [per-DHI-dho] (3x)
4. `spagnolo.b.4.ts:389,475`, `spagnolo.b.5.ts:51,358` perdone [per-DO-ne] -> [per-DHO-ne] (4x)
5. `spagnolo.b.4.ts:544` estudiar [es-tu-DIAR] -> [es-tu-DHIAR]
6. `spagnolo.b.4.ts:567` guardar [guar-DAR] -> [guar-DHAR]
7. `spagnolo.b.4.ts:596` presidente [pre-si-DEN-te] -> [pre-ssi-DHEN-te] (also ss)
8. `spagnolo.b.5.ts:32,33` desde [DES-de] -> [DES-dhe] (es-pron has DES-dhe)

Intervocalic s written plain (would be read /z/ by Northern Italians):
9. `spagnolo.b.4.ts:370` comisión [ko-mi-SION] -> [ko-mi-SSION]
10. `spagnolo.b.4.ts:381` exposición [eks-po-si-THION] -> [eks-po-ssi-THION]
11. `spagnolo.b.4.ts:542` profesor/profesora -> [pro-fe-SSOR / pro-fe-SSO-ra]
12. `spagnolo.b.4.ts:568` impresora [im-pre-SO-ra] -> [im-pre-SSO-ra]
13. `spagnolo.b.3.ts:178` vos imperative decí [de-SI] -> [de-SSI] (seseo, Rioplatense)

Other:
14. `spagnolo.b.1.ts:199` llegues [YE-gues] -> [YE-ghes] (Italian "gue" = /gwe/)
15. `spagnolo.b.3.ts` voseo table sos [sos] -> [SOS] (content word, capitalised per the legend rule)

(Items 3, 4, 8 count several occurrences; 19 edits in total across 17 distinct words.)

### C (minor)

- C1. The `dr` cluster keeps a plain d: madre [MA-dre], padre, Madrid [ma-DRIDH], podré [po-DRE], catedral [ka-te-DRAL] (about 25 occurrences in A and B). In real Spanish this d is a weak approximant. Left as is on purpose (uniform in both halves, changing it would add `dhr` clusters hard to read); the es-pron d row (`spagnolo.a.ts` l.~66) now says so, and the `spagnolo.pron.ts` header comment was corrected (it said "after r/l"; the rule is r/s, not after n/l).
- C2. `[KO-moes-TAS]`, `[e-ne-lo-TEL]` in es-fonetica2 fuse words without a hyphen: intentional (sinalefa), readable.
- C3. dieciocho [die-thi-O-cio] / veintiuno [bein-ti-U-no] use a hiatus reading; many speakers say a diphthong. Acceptable for learners.

## 4. Uniformity A vs B

Checked by script across the whole course after the fixes: intervocalic s (only wrong-answer distractors remain without ss), soft d (only dr cluster and distractors remain), ll/y (all `y`), jota (all `h`, no `j`), c/z (th for Spain, ce/ci only for ch; 0 mismatches), gu/gh (0 real mismatches), Rioplatense (`sce` only), aspirated -s (`h`, one form). No residual A/B divergence.

## 5. Doubts

- Rioplatense `sce` (voiceless) vs voiced `zhe`: lesson already says "per alcuni parlanti sonora".
- `dr` policy (C1) is a deliberate simplification, owner may prefer `dhr`.
- The check covers respellings in brackets; pronunciation prose in other modules was spot-read, not exhaustively.

Tests: `npx vitest run src/projects/learning` 50/50 pass; `npx tsc --noEmit -p tsconfig.app.json` clean.
