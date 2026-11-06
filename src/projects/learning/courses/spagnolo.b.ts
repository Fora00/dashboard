import type { CourseModule } from '../types'
import { esCond, esConnettori, esPassiva } from './spagnolo.b.2'
import { esFalsiamici, esLatam, esRegistri } from './spagnolo.b.3'
import { esVocLavoro, esVocViaggi, esVocVita } from './spagnolo.b.4'
import { esDialoghi, esDrills } from './spagnolo.b.5'
import { esEsame } from './spagnolo.b.6'
import { esSubj1, esSubj2, esTrapas } from './spagnolo.b.1'

// Spanish course, B1 -> B2, vocabulary and training modules (for an Italian speaker).
//
// CLAIMS I AM NOT SURE ABOUT (reviewers: please check):
// - DELE: exact durations, number of tasks per level, word counts and pass mark (about 60% per group, Grupo 1 / Grupo 2)
//   in es-esame; the 2025-26 reform may have changed the format. Only the general structure is stated.
// - es-latam: which countries use voseo (Chile informal, parts of Colombia, Central America), and the claim that perfecto
//   is used more in Mexico/Andean areas for open situations; "ahorita" = soon/right now (MX); "esfero" (CO); "pelado" (CO);
//   "mazorca" (CO); "habichuelas" (CO); "camión" = bus (MX); "chido/padre" (MX); "copado" (AR); Argentine sheísmo as "sc".
// - es-latam: "coger" being vulgar in Argentina and Mexico (true; Colombia/Spain use it neutrally).
// - es-cond: "querría" as less common than "quisiera/me gustaría" for polite wishes; "si + condicional" heard colloquially
//   in some regions but considered an error.
// - es-passiva: "Se necesitan camareros" / "Se busca a un camarero" (verb stays singular with personal a); "estar por + inf." means
//   "sto per" in parts of Latin America but "ho voglia di / è ancora da fare" in Spain: the course teaches a punto de as the safe form.
// - es-connettori: "aun así", "por que" (per cui) and "porqué" usage; accent explanations for por qué/porque.
// - es-registri: "chao" widespread in America; "hoja de reclamaciones" is a Spain-specific official form;
//   -ico diminutives in Aragón, Colombia, Costa Rica; "ventanilla"/"bocadillo" as lexicalised diminutives.
// - es-falsiamici: "bravo" and "extrañar" were left out on purpose; "constipado"/"costipato" regionally varies in Italy;
//   "cuarto" = stanza/quarto; "sentir" for hearing is not used (oír) but "sentir un ruido" appears in some varieties.
// - Pronunciation: all B modules use the single convention of spagnolo.pron.ts (ss, dh, y, th, h = jota, sce for Rioplatense).
// - Vocabulary modules: only Spain pronunciation (distinción th) is transcribed; America pronounces th as s.

export const spagnoloB: CourseModule[] = [
  esSubj1,
  esSubj2,
  esTrapas,
  esCond,
  esPassiva,
  esConnettori,
  esRegistri,
  esLatam,
  esFalsiamici,
  esVocVita,
  esVocViaggi,
  esVocLavoro,
  esDialoghi,
  esDrills,
  esEsame,
]
