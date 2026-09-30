// Tone of the option-row shape of <Chip>; also used by composite rows (a chip row
// with an extra button inside, e.g. the category + favourite rows of the events sheet).
/** Tone of the row shape; exported for composite rows (a chip row with an extra button inside). */
export const rowTone = (active: boolean): string =>
  active
    ? 'border-indigo-700 bg-indigo-600 text-white dark:border-indigo-300 dark:bg-indigo-500'
    : 'border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200'
