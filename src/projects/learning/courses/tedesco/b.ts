import type { CourseModule } from '../../types'
import { deNebensaetze2, deRelativ, deAggettivi } from './b.1'
import { dePlusquam, deKonj2, dePassiv } from './b.2'
import { deKonj1, deKonnektoren, deRegistri } from './b.3'
import { deVarianti, deFalsiamici } from './b.4'
import { deVocVita, deVocViaggi, deVocLavoro } from './b.5'
import { deDialoghi, deDrills, deEsame } from './b.6'

// UNSURE CLAIMS TO REVIEW (tedesco B1-B2, written by the builder, not checked by a native speaker):
// - PRONUNCIATION NOTATION: built only from the legend in tedesco.pron.ts, plus these conventions NOT in the legend:
//   initial h is written "h" and must be aspirated; "ng" is one nasal sound (no separate g); "r" is written "r" except
//   final unstressed -er = "a" (Lehrer [LE-ra]); final b/d/g are written as p/t/k (Tag [TA:K]); ß = ss; ä = e (long with ":");
//   "j" = i consonantica; ç is also used after consonants (durch [DURÇ], Milch [MILÇ]); sp/st inside words after prefixes = shp/sht.
//   Austrian/Swiss initial s is voiceless and written plain "s" (SO-në). Stressed syllable in capitals, also Ç/CH/SH.
// - de-nebensaetze2: "weil ... hat kommen können" (haben before the double infinitive) presented as correct but rare;
//   "dass" omitted -> V2 order accepted in spoken/written standard.
// - de-relativ: "wegen dem" labelled colloquial; genitive "des Namens" for Name; Herr -> den Herrn; "wo" as relative for places labelled spoken.
// - de-aggettivi: genitive masc/neut zero article "guten Weines/Brotes" (some grammars give "guten Weins"); "alles Gute" takes -e,
//   "etwas/nichts/viel/wenig + -es" (rule simplified).
// - de-plusquam: Kaffee [KA-fe] (DE) vs [ka-FE:] (AT) both given; "Futur II" for supposition labelled rare;
//   "nachdem + Perfekt / Präsens" pairing presented as the standard spoken counterpart.
// - de-konj2: "hättest/wärst" short forms (wärest/hättest variants not listed); "als wäre er" (V2) alternative; "dürfte".
// - de-passiv: list of verb + preposition + case (e.g. "sich freuen auf+Akk/über+Akk", "fragen nach+Dat", "bitten um+Akk",
//   "teilnehmen an+Dat", "sich beschäftigen mit"); bekommen-Passiv example.
// - de-konj1: K I forms, "sie kämen / hätten" as K II substitutions; deictic shifts (heute -> an diesem Tag...); "Laut Polizei sei" style.
// - de-konnektoren: "zumal / sofern / soweit / wobei / wohingegen" glosses; Funktionsverbgefüge meanings; "Maßnahmen" [MA:S-na:-mën].
// - de-registri: abbreviations (ggf., bzw., u. a.), idioms (Tomaten auf den Augen, Fettnäpfchen...), "Wiederhören" on the phone,
//   "MfG" labelled not for formal emails (opinions differ); Partikeln glosses are simplified.
// - de-varianti: AT/CH vocabulary (Weggli, Härdöpfel, Rüebli, Billett, Perron, Abwart, Sackerl, Hendl, Faschiertes, Fleischhauer,
//   Rauchfangkehrer, Kren, Topfen, Obers, Palatschinken, Ordination, Matura), "das E-Mail" in AT/CH, Perfekt with sein for
//   stehen/sitzen/liegen in the South/AT/CH, -ig as [ik] in AT, Chemie/China [k] in the South, s initial voiceless in AT/CH,
//   Glace/Poulet in CH, Tschau; each is regionally variable.
// - de-falsiamici: glosses of ~60 false friends (Kost, Sorte, Pension, Lehre, Station, Praxis, Kur, Mal, Gang, brav, konsequent...).
// - de-voc-*: plurals and genders typed from memory (e.g. die Schmerzen / Plural only, das Wasser plural, der Käse, die Wirtschaft);
//   emergency numbers: EU 112, DE 110, AT 133 / 144, CH 117 / 118 / 144; "zweiter Stock" = second floor above ground.
// - de-esame: Goethe A2/B1/B2 timings (A2 30/30/30/15; B1 65/40/60/15; B2 65/40/75/15), pass mark 60% per module,
//   writing word counts (A2 ~30; B1 ~80/~80/~40; B2 ~150/~100), ÖSD structure "very similar": CHECK on goethe.de and oesd.at.
//   Stress pairs: ÜBERsetzen/überSETZEN, UMfahren/umFAHren, WIEderholen/wiederHOlen, MOdern/moDERN, der AUgust/der auGUST.

export const tedescoB: CourseModule[] = [
  deNebensaetze2,
  deRelativ,
  deAggettivi,
  dePlusquam,
  deKonj2,
  dePassiv,
  deKonj1,
  deKonnektoren,
  deRegistri,
  deVarianti,
  deFalsiamici,
  deVocVita,
  deVocViaggi,
  deVocLavoro,
  deDialoghi,
  deDrills,
  deEsame,
]
