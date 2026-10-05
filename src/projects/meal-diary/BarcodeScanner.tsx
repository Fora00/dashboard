import { useEffect, useRef, useState } from 'react'
import { Button } from '../../components/Button'
import { isBarcode } from './openFoodFacts'

// Camera barcode scanner (EAN-13/8, UPC-A/E) for the product lookup. iOS Safari
// has no BarcodeDetector, so this decodes video frames with ZXing, loaded only
// when the scanner opens (its own chunk). Everything is optional: no camera, a
// denied permission or an offline first load just show a message, and the
// barcode can always be typed. The camera stops on close/unmount.

interface Props {
  onDetect: (code: string) => void
  onClose: () => void
}

export default function BarcodeScanner({ onDetect, onClose }: Props) {
  const video = useRef<HTMLVideoElement>(null)
  const [error, setError] = useState<string | null>(null)
  // Latest callback without restarting the camera on every parent render.
  const detect = useRef(onDetect)
  detect.current = onDetect

  useEffect(() => {
    let stop: (() => void) | null = null
    let cancelled = false

    async function start() {
      if (!navigator.mediaDevices?.getUserMedia) {
        setError('This browser cannot use the camera here.')
        return
      }
      try {
        const [{ BrowserMultiFormatReader }, { BarcodeFormat, DecodeHintType }] = await Promise.all([
          import('@zxing/browser'),
          import('@zxing/library'),
        ])
        const hints = new Map()
        hints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.EAN_13, BarcodeFormat.EAN_8, BarcodeFormat.UPC_A, BarcodeFormat.UPC_E])
        const reader = new BrowserMultiFormatReader(hints, { delayBetweenScanAttempts: 150 })
        const controls = await reader.decodeFromConstraints(
          { video: { facingMode: { ideal: 'environment' } }, audio: false },
          video.current ?? undefined,
          (result) => {
            const code = result?.getText() ?? ''
            if (isBarcode(code)) detect.current(code)
          },
        )
        if (cancelled) controls.stop()
        else stop = () => controls.stop()
      } catch (e) {
        const name = (e as Error).name
        setError(
          name === 'NotAllowedError' || name === 'SecurityError'
            ? 'Camera access was denied. Allow it in the browser settings, or type the barcode.'
            : name === 'NotFoundError' || name === 'OverconstrainedError'
              ? 'No camera found. Type the barcode instead.'
              : 'Could not start the scanner (offline on first use?). Type the barcode instead.',
        )
      }
    }
    void start()
    return () => {
      cancelled = true
      stop?.()
    }
  }, [])

  return (
    <div className="space-y-2">
      {error ? (
        <p className="text-xs text-rose-700 dark:text-rose-400">{error}</p>
      ) : (
        <>
          <video ref={video} playsInline muted className="aspect-[4/3] w-full rounded-lg bg-black object-cover" aria-label="Camera preview" />
          <p className="text-xs text-slate-500">Point the camera at the barcode on the package.</p>
        </>
      )}
      <Button type="button" variant="ghost" onClick={onClose}>
        Close scanner
      </Button>
    </div>
  )
}
