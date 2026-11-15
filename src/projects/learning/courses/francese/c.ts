import type { CourseModule } from '../../types'
import { fDeterminants, fGeoReggenze } from './c.1'
import { fGenrePronom, fIrreguliers, fNegation2 } from './c.2'

// French course, part C: extra modules from the completeness audit (council round 2).
// Groups: a2 (fr-determinants, fr-geo-reggenze, fr-irreguliers, fr-genre-pronom), b1 (fr-negation2).
export const franceseC: CourseModule[] = [fDeterminants, fGeoReggenze, fIrreguliers, fGenrePronom, fNegation2]
