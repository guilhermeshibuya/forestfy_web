export async function normalizeImage(file: File): Promise<File> {
  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!

      canvas.width = img.width
      canvas.height = img.height

      ctx.drawImage(img, 0, 0)

      canvas.toBlob((blob) => {
        URL.revokeObjectURL(url)

        resolve(new File([blob!], file.name, { type: file.type }))
      })
    }
    img.src = url
  })
}
