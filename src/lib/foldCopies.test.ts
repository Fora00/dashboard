import { describe, expect, it } from 'vitest'
import { normalize } from './fuzzy'
import { normalizeText } from '../projects/events/filters'
import { driveMinutes } from '../projects/events/distance'
import { keyPart } from '../projects/events/featureKeys'
import { filmKey } from '../projects/events/screenings'
import { normalize as vocabNormalize } from '../projects/learning/vocab/search'

describe('accent fold, one source', () => {
  it('fuzzy.normalize folds accents and case', () => {
    expect(normalize('Caffè Ñandú')).toBe('caffe nandu')
  })
  it('the local wrappers keep their extra steps', () => {
    expect(normalizeText('  Caffè ')).toBe('caffe')
    expect(driveMinutes('Milano (MI)')).not.toBeNull()
    expect(keyPart('Riva  del Gàrda!')).toBe('riva del garda')
    expect(filmKey('Hen – Storia di una Gallina')).toBe('hen')
    expect(vocabNormalize('  L’Été   é ')).toBe("l'ete e")
  })
})
