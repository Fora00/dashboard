// Native share sheet / clipboard / download helpers, shared by every page
// that hands text or a file to the OS. All browser APIs are guarded.

export type ShareOutcome = 'shared' | 'copied' | 'cancelled'

function isAbort(err: unknown): boolean {
  return (err instanceof DOMException || err instanceof Error) && err.name === 'AbortError'
}

/**
 * Native share sheet when available, clipboard otherwise. Resolves to what
 * happened so the caller can confirm it ("Copied"); a dismissed share sheet
 * is 'cancelled', never an error. Rejects only if the clipboard fallback fails.
 */
export async function shareOrCopy(text: string, extra: { title?: string; url?: string } = {}): Promise<ShareOutcome> {
  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try {
      await navigator.share({ text, ...extra })
      return 'shared'
    } catch (err) {
      if (isAbort(err)) return 'cancelled'
      // Share unavailable in this context (e.g. no user activation left) —
      // fall through to the clipboard.
    }
  }
  const clip = extra.url ? `${text}\n${extra.url}` : text
  await navigator.clipboard.writeText(clip)
  return 'copied'
}

/**
 * Share a file through the OS share sheet. Resolves 'shared' / 'cancelled',
 * or 'unsupported' when files can't be shared here (caller downloads instead).
 */
export async function shareFile(file: File, title?: string): Promise<ShareOutcome | 'unsupported'> {
  if (
    typeof navigator === 'undefined' ||
    typeof navigator.share !== 'function' ||
    typeof navigator.canShare !== 'function' ||
    !navigator.canShare({ files: [file] })
  ) {
    return 'unsupported'
  }
  try {
    await navigator.share(title ? { files: [file], title } : { files: [file] })
    return 'shared'
  } catch (err) {
    if (isAbort(err)) return 'cancelled'
    return 'unsupported'
  }
}
