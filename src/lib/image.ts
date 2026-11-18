/** Size that fits within `max` on the long side, keeping the aspect ratio; never upscales. 0x0 for bad input. */
export function fitWithin(width: number, height: number, max: number): { width: number; height: number } {
  if (!(width > 0) || !(height > 0)) return { width: 0, height: 0 }
  const scale = Math.min(1, max / Math.max(width, height))
  return { width: Math.max(1, Math.round(width * scale)), height: Math.max(1, Math.round(height * scale)) }
}

/** Decodes a picked image; the object URL is released once it loaded (or failed). */
export function loadImage(file: Blob, errorMessage = 'Image could not be read'): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(file)
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(errorMessage))
    img.src = url
  }).finally(() => URL.revokeObjectURL(url))
}
