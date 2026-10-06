import { useEffect, useRef, type ReactNode } from 'react'

interface Props {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  footer?: ReactNode
}

/**
 * Bottom sheet on phones, centred panel from `sm:` up. Built on the native
 * <dialog> (focus trap, Esc and top layer for free). The dialog element is a
 * transparent full-screen container; a click on it (outside the panel) is a
 * backdrop tap.
 */
export function Sheet({ open, onClose, title, children, footer }: Props) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) d.showModal()
    else if (!open && d.open) d.close()
  }, [open])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose()
      }}
      aria-label={title}
      className="fixed inset-0 m-0 h-full max-h-none w-full max-w-none bg-transparent p-0 text-slate-900 backdrop:bg-black/50 open:flex open:items-end open:justify-center sm:open:items-center dark:text-slate-100"
    >
      <div className="flex max-h-[85dvh] w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-xl sm:max-w-md sm:rounded-2xl dark:bg-slate-900">
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-1 dark:border-slate-700">
          <h2 className="text-base font-semibold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex size-10 items-center justify-center rounded-lg text-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            ✕
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-3">{children}</div>
        {footer && <div className="shrink-0 border-t border-slate-200 px-4 pt-3 dark:border-slate-700">{footer}</div>}
        <div className="shrink-0" style={{ height: 'env(safe-area-inset-bottom)' }} />
      </div>
    </dialog>
  )
}
