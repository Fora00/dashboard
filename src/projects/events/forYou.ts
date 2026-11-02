import { usePersistedState } from '../../lib/safeStorage'

// "Ordina per te": order each day of the All view by the interest score
// (interestScore.ts). Per device, guarded localStorage, default ON (owner, 2026-11-02, with 70+ signals). The
// switch only takes effect with enough signals (canOrderForYou); below that
// the stored choice is kept but ignored, so nothing is reordered.

export const FOR_YOU_KEY = 'dashboard:events-for-you'

export function useForYouSetting(): [boolean, (on: boolean) => void] {
  return usePersistedState<boolean>(FOR_YOU_KEY, true, (raw) => raw === true)
}
