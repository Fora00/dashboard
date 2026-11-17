// Downscaling a photo of the learner's sheet before it goes into Dexie: a
// phone camera shot is 3-12 MB, the diary only needs to show the drawing.

export const MAX_PHOTO_SIDE = 1600
export const PHOTO_QUALITY = 0.8

/** Size that fits within `max` on the long side, keeping the aspect ratio; never upscales. */
export function fitWithin(width: number, height: number, max = MAX_PHOTO_SIDE): { width: number; height: number } {
  if (!(width > 0) || !(height > 0)) return { width: 0, height: 0 }
  const scale = Math.min(1, max / Math.max(width, height))
  return { width: Math.max(1, Math.round(width * scale)), height: Math.max(1, Math.round(height * scale)) }
}

function loadImage(file: Blob): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(file)
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Immagine non leggibile'))
    img.src = url
  }).finally(() => URL.revokeObjectURL(url))
}

/**
 * JPEG, max MAX_PHOTO_SIDE px on the long side, quality PHOTO_QUALITY. Drawn
 * from an <img>, so browsers apply the camera's EXIF orientation. If the
 * browser cannot decode or re-encode it, the original file is kept as is
 * (better a big photo than a lost one).
 */
export async function resizePhoto(file: Blob): Promise<Blob> {
  try {
    const img = await loadImage(file)
    const { width, height } = fitWithin(img.naturalWidth, img.naturalHeight)
    if (width === 0) return file
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) return file
    ctx.drawImage(img, 0, 0, width, height)
    const out = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', PHOTO_QUALITY))
    return out ?? file
  } catch {
    return file
  }
}
