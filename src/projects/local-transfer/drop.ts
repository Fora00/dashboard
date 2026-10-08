// Drag-and-drop helpers for Local Transfer. Pure, so the rules are testable
// without a DOM.

/** Does this drag carry files (and not, say, selected text or a link)? */
export function hasFiles(types: readonly string[] | null | undefined): boolean {
  return Array.from(types ?? []).includes('Files')
}

interface FileLike {
  name: string
  size: number
  lastModified: number
}

/** Drops exact repeats (same name, size and date) within one drop, keeping order. */
export function uniqueFiles<T extends FileLike>(files: readonly T[]): T[] {
  const seen = new Set<string>()
  const out: T[] = []
  for (const f of files) {
    const key = `${f.name}\u0000${f.size}\u0000${f.lastModified}`
    if (seen.has(key)) continue
    seen.add(key)
    out.push(f)
  }
  return out
}

/**
 * The real files of a drop. Folders are skipped (the browser gives no content
 * for them), which `dataTransfer.files` alone cannot tell apart from an empty
 * file; the items list can.
 */
export function filesFromTransfer(dt: DataTransfer): File[] {
  const items = Array.from(dt.items ?? [])
  if (items.length > 0 && items.every((i) => typeof i.webkitGetAsEntry === 'function')) {
    const out: File[] = []
    for (const item of items) {
      if (item.kind !== 'file') continue
      if (item.webkitGetAsEntry()?.isDirectory) continue
      const f = item.getAsFile()
      if (f) out.push(f)
    }
    return uniqueFiles(out)
  }
  return uniqueFiles(Array.from(dt.files))
}
