// Shared keyboard-focus styles (visible only for keyboard focus, never on tap).
// FOCUS_RING sits outside the element; use FOCUS_RING_INSET inside scroll
// containers (overflow clips an outer ring) or on full-bleed rows.
// Ring colour = --accent-ring (project accent, indigo off-project; index.css).
export const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(color:--accent-ring) focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900'

export const FOCUS_RING_INSET =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(color:--accent-ring)'

/** For raw <input>/<textarea>/<select>: ring on keyboard focus, next to the existing border tint. */
export const FOCUS_RING_FIELD = 'focus-visible:ring-2 focus-visible:ring-(color:--accent-ring)'
