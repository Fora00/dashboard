import { buttonClass, ICON_BUTTON } from '../../components/Button'
import { INPUT, SELECT, TEXTAREA } from '../../components/field'
import { FOCUS_RING, FOCUS_RING_INSET } from '../../components/focus'
import { segmentClass } from '../../components/SegmentedTabs'
import { SECTION_TITLE } from '../../components/SectionTitle'

// The dashboard design system for the Zine editor, whose DOM is built by hand (editor.ts) and so cannot use
// the React components. Every class here comes from src/components, or is plain Tailwind on the same
// slate + --accent tokens: change a component and the editor follows. zine.css only does layout.
export const ui = {
  btn: buttonClass('ghost'),
  primary: buttonClass('primary'),
  danger: buttonClass('danger'),
  icon: ICON_BUTTON,
  /** Single-choice toggle in a row (page colour, text alignment): SegmentedTabs' chips. */
  toggle: (on: boolean) => `${segmentClass('chips', on)} px-3`,
  input: INPUT,
  select: SELECT,
  textarea: TEXTAREA,
  color:
    'h-10 w-full cursor-pointer rounded-lg border border-slate-300 bg-white p-1 dark:border-slate-700 dark:bg-slate-800',
  check: 'size-5 shrink-0 accent-(--accent)',
  range: 'w-full accent-(--accent)',
  heading: SECTION_TITLE,
  label: 'text-xs font-medium text-slate-500 dark:text-slate-400',
  hint: 'text-xs text-slate-500 dark:text-slate-400',
  info: 'rounded-lg bg-slate-100 p-3 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  /** Bottom tab bar item (phone): icon above a small label. */
  tab: `flex min-h-13 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-lg text-[11px] font-medium text-slate-500 active:bg-slate-100 dark:text-slate-400 dark:active:bg-slate-800 ${FOCUS_RING_INSET}`,
  /** ⋯ menu panel. */
  menu: 'flex-col gap-0.5 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg dark:border-slate-800 dark:bg-slate-900',
  /** Round button floating over the page area (phone pager). */
  floating: `flex size-10 items-center justify-center rounded-full bg-white text-xl text-slate-700 shadow-sm active:bg-slate-100 dark:bg-slate-800 dark:text-slate-200 dark:active:bg-slate-700 ${FOCUS_RING}`,
  /** Small label pill over the page area (phone pager). */
  pill: 'rounded-full bg-white px-3 py-1.5 text-[13px] font-medium text-slate-800 shadow-sm dark:bg-slate-800 dark:text-slate-100',
  /** ⋯ menu row. */
  menuItem: `flex min-h-11 w-full items-center rounded-lg px-3 text-left text-[15px] text-slate-800 hover:bg-slate-100 active:bg-slate-200 dark:text-slate-200 dark:hover:bg-slate-800 dark:active:bg-slate-700 ${FOCUS_RING_INSET}`,
  thumb: (cur: boolean) =>
    `thumb block w-full rounded-lg border-2 p-1 ${FOCUS_RING_INSET} ${
      cur
        ? 'border-(color:--accent-border) bg-(--accent-soft)'
        : 'border-transparent hover:bg-slate-100 dark:hover:bg-slate-800'
    }`,
  swatch: (on: boolean) =>
    `sw size-7 shrink-0 rounded-lg border border-slate-900/20 dark:border-white/20 ${
      on ? 'ring-2 ring-(color:--accent-ring) ring-offset-2 ring-offset-white dark:ring-offset-slate-900' : ''
    }`,
  dialog:
    'm-auto w-[min(28rem,calc(100vw-2rem))] max-h-[calc(100dvh-2rem)] overflow-auto rounded-2xl bg-white p-5 text-slate-900 shadow-xl backdrop:bg-black/50 dark:bg-slate-900 dark:text-slate-100',
  dialogTitle: 'mb-4 text-base font-semibold',
} as const
