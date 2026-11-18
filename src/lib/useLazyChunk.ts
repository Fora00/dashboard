import { useEffect, useState } from 'react'

export type ChunkStatus = 'loading' | 'ready' | 'missing'

/**
 * A lazily loaded chunk of content: sync when it is already cached, otherwise loads it once and re-renders.
 * `cached` reads the loaded value (undefined until loaded), `known` is false for an unknown key (-> 'missing'),
 * `load` starts the dynamic import (rejections -> 'missing').
 */
export function useLazyChunk<T>(
  key: string | undefined,
  cached: T | undefined,
  known: boolean,
  load: (key: string) => Promise<unknown>,
): { value?: T; status: ChunkStatus } {
  const [, bump] = useState(0)
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    if (!key || cached || !known) return
    let live = true
    load(key).then(
      () => live && bump((n) => n + 1),
      () => live && setFailed(true),
    )
    return () => {
      live = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, cached, known])
  if (cached) return { value: cached, status: 'ready' }
  if (!known || failed) return { status: 'missing' }
  return { status: 'loading' }
}
