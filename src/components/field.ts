// Shared form-field classes. One look for every raw <input>/<select>/<textarea>:
// 40px min height, accent focus ring (--accent-ring), light + dark, and
// text-base on phones so iOS Safari does not zoom on focus.
const BASE =
  'w-full rounded-lg border border-slate-300 bg-white text-base sm:text-sm focus:border-(color:--accent-ring) focus:outline-none focus-visible:ring-2 focus-visible:ring-(color:--accent-ring) dark:border-slate-700 dark:bg-slate-800'

export const INPUT = `min-h-10 px-3.5 placeholder:text-slate-500 ${BASE}`
export const SELECT = `min-h-10 px-3 ${BASE}`
export const DATE = `min-h-10 px-3 ${BASE}`
export const TEXTAREA = `px-3.5 py-2 placeholder:text-slate-500 ${BASE}`
