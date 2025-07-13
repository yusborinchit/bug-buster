function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onloadend = () => {
      const result = reader.result as string
      if (typeof result !== "string") return reject()
      return resolve(result)
    }
    reader.onerror = reject

    reader.readAsDataURL(blob)
  })
}

export async function cropScreenshot(
  screenshot: string,
  x: number,
  y: number,
  width: number,
  height: number
): Promise<string> {
  const response = await fetch(screenshot)

  const blob = await response.blob()
  const imageBitmap = await createImageBitmap(blob)

  console.log("Image size:", imageBitmap.width, imageBitmap.height)
  console.log("Cropping at:", x, y, width, height)

  const offscreen = new OffscreenCanvas(width, height)
  const ctx = offscreen.getContext("2d")

  if (!ctx) throw new Error("Failed to get 2D context")

  ctx.drawImage(imageBitmap, x, y, width, height, 0, 0, width, height)

  const croppedBlob = await offscreen.convertToBlob()
  const base64 = await blobToBase64(croppedBlob)

  return base64
}
