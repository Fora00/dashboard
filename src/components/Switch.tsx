import { FOCUS_RING } from './focus'

/** The track + knob only (decorative). Use inside a row that is already a switch button. */
export function SwitchTrack({ checked }: { checked: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
        checked ? 'bg-(--accent)' : 'bg-slate-300 dark:bg-slate-600'
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </span>
  )
}

interface SwitchProps {
  checked: boolean
  onChange: (next: boolean) => void
  disabled?: boolean
  /** Needed unless the switch sits inside a <label> that names it. */
  'aria-label'?: string
  'aria-describedby'?: string
}

/** Accessible on/off switch: role=switch button with a 40px-high touch target. */
export function Switch({ checked, onChange, disabled, ...aria }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`flex min-h-10 min-w-11 shrink-0 items-center justify-center rounded-full disabled:cursor-not-allowed disabled:opacity-50 ${FOCUS_RING}`}
      {...aria}
    >
      <SwitchTrack checked={checked} />
    </button>
  )
}
