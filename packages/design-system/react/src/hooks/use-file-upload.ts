import axios from 'axios'
import { useCallback, useState } from 'react'

interface UseFileUploadProps {
  context: 'tenants' | 'users' | 'shared'
  id: string
  onChange: (value: string | string[]) => void
  value: string | string[]
}

interface UseFileUploadReturn {
  uploadFile: (file: File | File[]) => Promise<string | string[]>
  deleteFile: (path: string | string[]) => Promise<void>
  listFiles: () => Promise<string[]>
  deleteAllFiles: () => Promise<void>
  isUploading: boolean
  error: string | null
}

export function useFileUpload({ context, id, onChange, value }: UseFileUploadProps): UseFileUploadReturn {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const uploadFile = useCallback(async (file: File | File[]): Promise<string | string[]> => {
    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      if (Array.isArray(file)) {
        file.forEach((f) => formData.append('file', f))
      } else {
        formData.append('file', file)
      }

      const response = await axios.post(`/api/storage/${context}/${id}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        params: {
          context,
          id,
        },
      })

      const newPath = response.data.path
      onChange(Array.isArray(value) ? [...value, newPath] : newPath)
      return newPath
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setIsUploading(false)
    }
  }, [context, id, onChange, value])

  const deleteFile = useCallback(async (path: string | string[]): Promise<void> => {
    setIsUploading(true)
    setError(null)

    try {
      if (Array.isArray(path)) {
        await Promise.all(path.map((p) => axios.delete(`/api/storage/${context}/${id}/delete`, { 
          data: { path: p },
          params: { context, id },
        })))
        if (Array.isArray(value)) {
          onChange(value.filter((item) => !path.includes(item)))
        }
      } else {
        await axios.delete(`/api/storage/${context}/${id}/delete`, { 
          data: { path },
          params: { context, id },
        })
        if (Array.isArray(value)) {
          onChange(value.filter((item) => item !== path))
        }
      }
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setIsUploading(false)
    }
  }, [context, id, onChange, value])

  const listFiles = useCallback(async (): Promise<string[]> => {
    setIsUploading(true)
    setError(null)

    try {
      const response = await axios.get(`/api/storage/${context}/${id}/list`, {
        params: { context, id },
      })
      return response.data.files
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setIsUploading(false)
    }
  }, [context, id])

  const deleteAllFiles = useCallback(async (): Promise<void> => {
    setIsUploading(true)
    setError(null)

    try {
      await axios.delete(`/api/storage/${context}/${id}/delete-all`, {
        params: { context, id },
      })
      onChange([])
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setIsUploading(false)
    }
  }, [context, id, onChange])

  return {
    uploadFile,
    deleteFile,
    listFiles,
    deleteAllFiles,
    isUploading,
    error,
  }
}