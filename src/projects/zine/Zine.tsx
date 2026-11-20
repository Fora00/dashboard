import { useEffect, useRef } from 'react'
import { mountZine } from './editor'
import './fonts.css'
import './zine.css'

// ZINE//SPORCA, the A5 zine editor (tool page, public, works offline and signed out). The editor is plain DOM
// (editor.ts): React only owns the container and mounts/unmounts it.
export function Zine() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    return mountZine(el)
  }, [])
  return <div ref={ref} className="zine-scope zine-app" />
}
