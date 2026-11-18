import { useEffect, useRef, useState } from 'react'
import { useConfirmRequest } from '../lib/confirm'
import { Button } from './Button'
import { Sheet } from './Sheet'

/** Renders the dialog behind `useConfirm()`; mounted once in Layout. */
export function ConfirmHost() {
  const req = useConfirmRequest()
  // Keep the last request's text while the dialog closes (no empty flash).
  const [last, setLast] = useState(req)
  if (req && req !== last) setLast(req)
  const shown = req ?? last
  const safeRef = useRef<HTMLButtonElement>(null)
  const okRef = useRef<HTMLButtonElement>(null)

  // Runs after Sheet's own effect (showModal), so it overrides the default focus.
  useEffect(() => {
    if (!req) return
    ;(req.danger ? safeRef : okRef).current?.focus()
  }, [req])

  return (
    <Sheet
      open={req !== null}
      onClose={() => req?.resolve(false)}
      title={shown?.title ?? 'Confirm'}
      footer={
        <div className="flex justify-end gap-2 pb-3">
          <Button ref={safeRef} variant="ghost" onClick={() => req?.resolve(false)}>
            Cancel
          </Button>
          <Button
            ref={okRef}
            variant={shown?.danger ? 'danger' : 'primary'}
            onClick={() => req?.resolve(true)}
            className={shown?.danger ? 'font-semibold' : ''}
          >
            {shown?.confirmLabel ?? 'OK'}
          </Button>
        </div>
      }
    >
      {shown?.body && <p className="text-sm whitespace-pre-line text-slate-700 dark:text-slate-300">{shown.body}</p>}
    </Sheet>
  )
}
