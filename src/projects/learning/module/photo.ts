// Downscaling a photo of the learner's sheet before it goes into Dexie: a
// phone camera shot is 3-12 MB, the diary only needs to show the drawing.

import { fitWithin, loadImage } from '../../../lib/image'

export const MAX_PHOTO_SIDE = 1600
export const PHOTO_QUALITY = 0.8

/** Size that fits within `max` (default MAX_PHOTO_SIDE) on the long side; never upscales. */
export const fitPhoto = (width: number, height: number, max = MAX_PHOTO_SIDE) => fitWithin(width, height, max)

/**
 * JPEG, max MAX_PHOTO_SIDE px on the long side, quality PHOTO_QUALITY. Drawn
 * from an <img>, so browsers apply the camera's EXIF orientation. If the
 * browser cannot decode or re-encode it, the original file is kept as is
 * (better a big photo than a lost one).
 */
export async function resizePhoto(file: Blob): Promise<Blob> {
  try {
    const img = await loadImage(file, 'Immagine non leggibile')
    const { width, height } = fitPhoto(img.naturalWidth, img.naturalHeight)
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
