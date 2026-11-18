import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

export type LinkDecode = { ok: true; text: string } | { ok: false; errors: string[] }

/** Pure part: the over-long check, then the screen's decoder. */
export function decodeLinkParam(
  param: string,
  maxChars: number,
  decode: (param: string) => LinkDecode,
  tooLarge: string,
): LinkDecode {
  return param.length > maxChars ? { ok: false, errors: [tooLarge] } : decode(param)
}

/**
 * The "?d=<link> -> strip it from the URL -> preview -> Save" screens: reads `d` once per change, removes it from
 * the URL (replace, so it does not linger in history), and exposes the decoded text (or the errors). Nothing is
 * saved here. A bad link clears the text so its error shows instead of a stale preview.
 */
export function useLinkImport(opts: { maxChars: number; decode: (param: string) => LinkDecode; tooLarge: string }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [text, setText] = useState('')
  const [linkErrors, setLinkErrors] = useState<string[] | null>(null)
  const linkParam = searchParams.get('d')

  useEffect(() => {
    if (!linkParam) return
    const decoded = decodeLinkParam(linkParam, opts.maxChars, opts.decode, opts.tooLarge)
    setSearchParams({}, { replace: true })
    setText(decoded.ok ? decoded.text : '')
    setLinkErrors(decoded.ok ? null : decoded.errors)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linkParam])

  return { text, setText, linkErrors, setLinkErrors }
}
