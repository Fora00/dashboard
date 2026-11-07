import type { CourseModule } from '../../types'
import { esIndefiniti } from './c.1'
import { esCambi, esNumeri2 } from './c.2'
import { esFunciones, esRelativi } from './c.3'
import { esNatura } from './c.4'
import { esCultura, esTempoLibero } from './c.5'

// Spanish course, part C: extra modules from the completeness audit (L19d). es-fonetica2 lives in spagnolo.a.5.ts.
// Groups: a2 (es-indefiniti, es-numeri2), b1 (es-cambi, es-relativi), b2 (es-funciones), voc (es-natura, es-tempolibero, es-cultura).
export const spagnoloC: CourseModule[] = [
  esIndefiniti,
  esNumeri2,
  esCambi,
  esRelativi,
  esFunciones,
  esNatura,
  esTempoLibero,
  esCultura,
]
