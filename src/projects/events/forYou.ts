import { usePersistedState } from '../../lib/safeStorage'

// "Ordina per te": order each day of the All view by the interest score
// (interestScore.ts). Per device, guarded localStorage, default OFF. The
// switch only takes effect with enough signals (canOrderForYou); below that
// the stored choice is kept but ignored, so nothing is reordered.

export const FOR_YOU_KEY = 'dashboard:events-for-you'

export function useForYouSetting(): [boolean, (on: boolean) => void] {
  return usePersistedState<boolean>(FOR_YOU_KEY, false, (raw) => raw === true)
}
