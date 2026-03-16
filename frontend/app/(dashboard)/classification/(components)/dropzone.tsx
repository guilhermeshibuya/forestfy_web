'use client'

import { UploadCloud, X } from 'lucide-react'
import Image from 'next/image'
import { useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'

interface DropzoneProps {
  file: File | null
  onFileSelect: (file: File | null) => void
  button: React.ReactNode
}

export function Dropzone({ file, onFileSelect, button }: DropzoneProps) {
  const preview = file ? URL.createObjectURL(file) : null

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const selected = acceptedFiles[0]

      if (!selected) return

      onFileSelect(selected)
    },
    [onFileSelect],
  )

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: {
        'image/jpeg': ['.jpeg', '.jpg'],
        'image/png': ['.png'],
      },
      maxFiles: 1,
      maxSize: 5 * 1024 * 1024,
    })

  function handleRemoveFile(e: React.MouseEvent) {
    e.stopPropagation()
    onFileSelect(null)
  }

  return (
    <div className="p-4 bg-zinc-50 shadow-sm rounded-xl h-full flex flex-col">
      <h3 className="text-xl text-green-900 font-semibold">Envie uma imagem</h3>
      <p className="text-zinc-700 mt-2">
        Faça o upload de uma imagem da madeira que deseja identificar e nosso
        sistema irá classificar a espécie
      </p>

      <div
        {...getRootProps()}
        className={`mt-6 cursor-pointer border-2 border-dashed  rounded-lg p-6 flex flex-col items-center justify-center gap-4 w-full overflow-hidden flex-1
          ${isDragActive && 'border-green-500 bg-green-50'} 
          ${!isDragActive && 'border-zinc-300'}
          ${isDragReject && 'border-red-500 bg-red-50'}`}
      >
        <input {...getInputProps()} />

        {!preview ? (
          <div className="flex flex-col items-center gap-3 text-center">
            <UploadCloud className="text-zinc-500" size={40} />

            {isDragActive ? (
              <p className="text-green-700 font-medium">
                Solte a imagem aqui 📂
              </p>
            ) : (
              <p className="text-zinc-600">
                Arraste uma imagem ou
                <span className="text-green-700 font-medium">
                  {' '}
                  clique para selecionar
                </span>
              </p>
            )}
          </div>
        ) : (
          <div className="grid">
            <Image
              src={preview}
              alt="Preview"
              width={200}
              height={200}
              className="rounded-lg h-50 min-w-50 col-start-1 row-start-1 object-cover"
            />

            <button
              onClick={handleRemoveFile}
              className="flex justify-center items-center rounded-full size-6 bg-zinc-50/70 cursor-pointer col-start-1 row-start-1 self-start justify-self-end m-2"
            >
              <X size={18} className="text-red-500" />
            </button>
          </div>
        )}
        <span className="text-xs text-zinc-500">PNG ou JPG • máx 5MB</span>
      </div>

      {button}
    </div>
  )
}
