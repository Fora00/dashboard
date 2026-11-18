/** 32-bit FNV-1a of the UTF-16 code units, as an unsigned number. Seeds shuffles, so never change the output. */
export function fnv1a(s: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

/** fnv1a as 8 hex digits. */
export const fnv1aHex = (s: string): string => fnv1a(s).toString(16).padStart(8, '0')
