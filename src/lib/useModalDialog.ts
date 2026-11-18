import { useEffect, type RefObject } from 'react'

/** Native <dialog> driven by `open`: showModal/close plus a body scroll lock while open.
 *  `onOpen` runs just before showModal (e.g. reset state). */
export function useModalDialog(ref: RefObject<HTMLDialogElement | null>, open: boolean, onOpen?: () => void) {
  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) {
      onOpen?.()
      d.showModal()
    } else if (!open && d.open) d.close()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])
}
