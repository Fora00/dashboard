// Respelling legends per language: the SAME strings the courses show (one source of truth). The pron files import
// only the leaf ../courses/vocabTable.ts, so importing them does not pull any course content or word list in.
// LEGEND = the one-line version (dictionary); LEGEND_FULL = the full rules (the "Pronuncia" recap screen).
import { PRON_FULL as ES_FULL, PRON_SHORT as ES } from '../courses/spagnolo/pron'
import { PRON_FULL as FR_FULL, PRON_SHORT as FR } from '../courses/francese/b.pron'
import { PRON_FULL as DE_FULL, PRON_SHORT as DE } from '../courses/tedesco/pron'
import { PRON_FULL as RU_FULL, PRON_SHORT as RU } from '../courses/russo/pron'
import type { Lang } from './types'

export const LEGEND: Record<Lang, string> = { es: ES, fr: FR, de: DE, ru: RU }
export const LEGEND_FULL: Record<Lang, string> = { es: ES_FULL, fr: FR_FULL, de: DE_FULL, ru: RU_FULL }
