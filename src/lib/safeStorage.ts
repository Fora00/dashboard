import { useCallback, useState } from 'react'

// Guarded localStorage. Safari private mode / "block all cookies" makes
// localStorage ACCESS throw (not just return null), so every read and write
// goes through these helpers: a blocked or malformed store just behaves like
// an empty one, and a failed write is silently dropped (the choice simply
// doesn't survive a reload).

export function readString(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

export function writeString(key: string, value: string): void {
  try {
    localStorage.setItem(key, value)
  } catch {
    // Blocked or full: not remembered.
  }
}

export function removeKey(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch {
    // Blocked: nothing to remove.
  }
}

/**
 * JSON value under `key`, run through `sanitize` (which receives `unknown` and
 * must return a valid T, falling back itself for garbage). Missing key,
 * blocked storage, bad JSON or a throwing sanitizer all give `fallback`.
 */
export function readJSON<T>(key: string, sanitize: (raw: unknown) => T, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return fallback
    return sanitize(JSON.parse(raw))
  } catch {
    return fallback
  }
}

export function writeJSON(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Blocked or full: not remembered.
  }
}

export interface Codec<T> {
  /** Stored string (null = missing) to a valid value. */
  parse: (raw: string | null) => T
  serialize: (value: T) => string
}

/**
 * State mirrored to localStorage. Reads once on mount, writes on every set.
 * Defaults to JSON (`sanitize` validates the parsed value); pass a `codec`
 * to keep an existing plain-string storage format byte-compatible.
 */
export function usePersistedState<T>(
  key: string,
  initial: T,
  sanitize: (raw: unknown) => T = (raw) => raw as T,
  codec?: Codec<T>,
): [T, (next: T) => void] {
  const [value, setValue] = useState<T>(() =>
    codec ? codec.parse(readString(key)) : readJSON(key, sanitize, initial),
  )
  const set = useCallback(
    (next: T) => {
      setValue(next)
      if (codec) writeString(key, codec.serialize(next))
      else writeJSON(key, next)
    },
    [key, codec],
  )
  return [value, set]
}
