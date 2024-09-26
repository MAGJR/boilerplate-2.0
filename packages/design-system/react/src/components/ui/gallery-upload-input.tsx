'use client'

import { Loader2, PlusCircle, X } from 'lucide-react'
import React, { useRef, useState } from 'react'
import { useFileUpload } from '../../hooks/use-file-upload'

interface GalleryValue {
  file: File | null
  url: string
  uploading: boolean
}

interface GalleryUploadInputProps {
  context: 'tenants' | 'users' | 'shared'
  id: string
  onChange: (value: string[]) => void
  value: string[]
}

export function GalleryUploadInput({
  context,
  id,
  onChange,
  value = [],
}: GalleryUploadInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const { uploadFile, deleteFile, isUploading } = useFileUpload({
    context,
    id,
    onChange,
    value,
  })

  const [files, setFiles] = useState<GalleryValue[]>(
    value.map((item) => ({
      file: null,
      uploading: false,
      url: item,
    })),
  )

  const handleAddImage = () => {
    inputRef.current?.click()
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const filesToUpload = Array.from(e.target.files || [])
    const newFiles = filesToUpload.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      uploading: true,
    }))

    const newValue = [...files, ...newFiles]
    setFiles(newValue)

    for (const [index, file] of filesToUpload.entries()) {
      try {
        const path = await uploadFile(file)
        newValue[index].url = path
        newValue[index].uploading = false
        setFiles([...newValue])
        onChange(newValue.map((item) => item.url))
      } catch (err) {
        console.error('Error uploading image:', err)
      }
    }
  }

  const handleRemoveImage = async (index: number) => {
    const fileToRemove = files[index]
    if (fileToRemove.url) {
      await deleteFile(fileToRemove.url)
    }
    const newValue = [...files]
    newValue.splice(index, 1)
    setFiles(newValue)
    onChange(newValue.map((item) => item.url))
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      {files.map((item, index) => (
        <GalleryUploadInputImage
          item={item}
          key={index}
          index={index}
          onRemove={() => handleRemoveImage(index)}
        />
      ))}
      <GalleryUploadInputAddNewButton onClick={handleAddImage} />
      <input
        type="file"
        multiple
        ref={inputRef}
        style={{ display: 'none' }}
        onChange={handleImageChange}
      />
    </div>
  )
}

function GalleryUploadInputAddNewButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      className="h-32 flex flex-col items-center justify-center border-dotted border-2 border-zinc-200 rounded-md hover:bg-zinc-100"
      onClick={onClick}
    >
      <PlusCircle className="w-4 h-4 opacity-60 mb-1" />
      <span className="font-semibold text-sm opacity-60">Adicionar</span>
    </button>
  )
}

function GalleryUploadInputImage({
  item,
  index,
  onRemove,
}: {
  item: GalleryValue
  index: number
  onRemove: () => void
}) {
  return (
    <button
      type="button"
      className="h-32 flex flex-col overflow-hidden items-center justify-center rounded-md hover:bg-zinc-100 relative"
    >
      {item.uploading && (
        <Loader2 className="absolute text-white h-6 w-6 animate-spin" />
      )}

      <img
        src={item.url}
        alt="Imagem de teste"
        className="w-full h-full object-cover rounded-md pointer-events-none"
      />

      {!item.uploading && (
        <button
          className="absolute top-3 right-3 bg-white h-6 w-6 rounded-full flex items-center justify-center"
          onClick={onRemove}
          type="button"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </button>
  )
}