import { MAX_IMAGE_LENGTH, fitWithin } from './custom'

// Client-side downscale for hand-added event images (browser only: canvas).
// The result is stored inline in the custom_events row as a JPEG data URL, so
// it must stay under MAX_IMAGE_LENGTH (mirrored by the SQL check). Tries
// 800 px at quality 0.7 first, then lower quality, then smaller sizes.

const ATTEMPTS: { max: number; quality: number }[] = [
  { max: 800, quality: 0.7 },
  { max: 800, quality: 0.6 },
  { max: 800, quality: 0.5 },
  { max: 640, quality: 0.5 },
  { max: 480, quality: 0.5 },
  { max: 360, quality: 0.45 },
]

function loadImage(file: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('This image could not be read.'))
    }
    img.src = url
  })
}

/** Downscale + JPEG-encode a picked image. Throws a user-facing message. */
export async function compressImage(file: Blob): Promise<string> {
  if (!file.type.startsWith('image/')) throw new Error('Pick an image file.')
  const img = await loadImage(file)
  const w = img.naturalWidth
  const h = img.naturalHeight
  if (!w || !h) throw new Error('This image could not be read.')
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Images are not supported on this device.')
  for (const { max, quality } of ATTEMPTS) {
    const size = fitWithin(w, h, max)
    canvas.width = size.width
    canvas.height = size.height
    // JPEG has no alpha: paint white under transparent PNGs.
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, size.width, size.height)
    ctx.drawImage(img, 0, 0, size.width, size.height)
    const out = canvas.toDataURL('image/jpeg', quality)
    if (out.startsWith('data:image/jpeg') && out.length <= MAX_IMAGE_LENGTH) return out
  }
  throw new Error('This image is too large even after shrinking it.')
}
