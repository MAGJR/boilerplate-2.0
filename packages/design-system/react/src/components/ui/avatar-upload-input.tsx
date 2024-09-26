'use client'

import { Loader2, Upload } from 'lucide-react'
import React, { useRef, useState } from 'react'
import { getInitialsFromName } from '../../helpers/get-initials-from-name'
import { useFileUpload } from '../../hooks/use-file-upload'
import { Button } from './button'
import { toast } from './use-toast'

interface AvatarUploadInputProps {
  context: 'tenants' | 'users' | 'shared'
  id: string
  onChange: (value: string | string[]) => void
  value: string | string[]
  placeholder?: string
}

export function AvatarUploadInput({ context, id, onChange, value, placeholder }: AvatarUploadInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [fileUrl, setFileUrl] = useState<string | string[] | null>(Array.isArray(value) ? value : value || null)
  const { uploadFile, deleteFile, isUploading, error } = useFileUpload({
    context,
    id,
    onChange,
    value,
  })

  const handleUploadClick = () => {
    inputRef.current?.click()
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      // Delete the previous file if it exists
      if (fileUrl) {
        await deleteFile(fileUrl)
      }

      const path = await uploadFile(file)
      setFileUrl(path)
      onChange(path)
      toast({
        title: 'File Upload Success',
        description: 'File uploaded successfully.',
      })
    } catch (err) {
      console.error('Upload error:', err)
      toast({
        title: 'File Upload Error',
        description: 'Failed to upload file.',
        variant: 'destructive',
      })
    }
  }

  

  return (
    <div>
      <div className="flex items-center space-x-2">
        <div className="relative flex items-center justify-center w-9 h-9">
          {isUploading && (
            <Loader2 className="absolute text-white h-6 w-6 animate-spin" />
          )}
          {fileUrl ? (
            <img
              src={fileUrl as string}
              alt="Profile"
              className={`w-full h-full object-cover rounded-md ${isUploading ? 'opacity-60' : ''}`}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
              <span className="text-gray-400 text-xs">
                {getInitialsFromName('User')}
              </span>
            </div>
          )}
        </div>

        <input
          type="file"
          ref={inputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
          accept="image/*"
        />

        <Button
          type="button"
          onClick={handleUploadClick}
          variant="outline"
        >
          <Upload className="w-3 h-3 mr-2" />
          {fileUrl ? 'Change' : 'Upload'}
        </Button>
      </div>

      {error && <span className="text-red-500 text-sm mt-4 block">{error}</span>}
    </div>
  )
}