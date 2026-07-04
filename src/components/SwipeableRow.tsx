import { useRef, useState, type PointerEvent, type ReactNode } from 'react'

// Pointer-events swipe gesture for list rows — no new deps; Pointer Events
// unify touch and mouse, so mouse drag comes for free. Swipe right toggles
// done/complete, swipe left deletes (pairs with the undo snackbar). A row
// only starts swiping after ~10px of clearly horizontal movement
// (|dx| > |dy|); anything more vertical is left alone so the page scrolls
// and inner buttons keep working exactly as before (they're the fallback).

const INTENT_PX = 10
const THRESHOLD = 72

interface SwipeableRowProps {
  children: ReactNode
  /** Swiped right past the threshold — toggle done/complete. */
  onSwipeRight?: () => void
  /** Swiped left past the threshold — delete. */
  onSwipeLeft?: () => void
  className?: string
}

export function SwipeableRow({ children, onSwipeRight, onSwipeLeft, className = '' }: SwipeableRowProps) {
  const [dx, setDx] = useState(0)
  const [dragging, setDragging] = useState(false)
  const start = useRef<{ x: number; y: number } | null>(null)
  const intent = useRef<'none' | 'horizontal' | 'vertical'>('none')
  const activePointer = useRef<number | null>(null)

  function reset() {
    start.current = null
    intent.current = 'none'
    activePointer.current = null
    setDragging(false)
    setDx(0)
  }

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    if (activePointer.current !== null) return // one gesture at a time
    start.current = { x: e.clientX, y: e.clientY }
    intent.current = 'none'
    activePointer.current = e.pointerId
  }

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!start.current || e.pointerId !== activePointer.current) return
    const rawDx = e.clientX - start.current.x
    const rawDy = e.clientY - start.current.y

    if (intent.current === 'none') {
      if (Math.abs(rawDx) < INTENT_PX && Math.abs(rawDy) < INTENT_PX) return
      if (Math.abs(rawDx) <= Math.abs(rawDy)) {
        // Vertical intent — this is a page scroll, not a swipe; hands off.
        intent.current = 'vertical'
        return
      }
      intent.current = 'horizontal'
      setDragging(true)
      e.currentTarget.setPointerCapture(e.pointerId)
    }

    if (intent.current !== 'horizontal') return
    e.preventDefault()
    setDx(rawDx)
  }

  function onPointerUp(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerId !== activePointer.current) return
    if (intent.current === 'horizontal') {
      if (dx <= -THRESHOLD) onSwipeLeft?.()
      else if (dx >= THRESHOLD) onSwipeRight?.()
    }
    reset()
  }

  const revealRight = dx > 0
  const revealLeft = dx < 0
  const strength = Math.min(Math.abs(dx) / THRESHOLD, 1)

  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      <div
        aria-hidden
        className="absolute inset-0 flex items-center justify-between px-5 text-lg"
        style={{
          background: revealRight ? '#059669' : revealLeft ? '#e11d48' : 'transparent',
          opacity: strength,
        }}
      >
        <span>{revealRight ? '✓' : ''}</span>
        <span>{revealLeft ? '🗑' : ''}</span>
      </div>
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={reset}
        style={{
          transform: `translateX(${dx}px)`,
          transition: dragging ? 'none' : 'transform 200ms ease',
          touchAction: 'pan-y',
        }}
      >
        {children}
      </div>
    </div>
  )
}
