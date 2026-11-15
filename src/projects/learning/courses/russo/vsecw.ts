import { vsecWFor } from '../vocabTable'
import { words } from './words'

// Course vocabulary table from ./words.ts: vsecW('Heading', ['id', ...]) renders the same HTML as vsec (see
// ../vocabTable.ts). Import it only from course modules (the vocab page loads ./words.ts on its own).
export const vsecW = vsecWFor('Russo', words)
