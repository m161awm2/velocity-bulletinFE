import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { api } from '../lib/api'
import type { PostImage, PresignedUpload } from '../types'

export function useUploadImage() {
  return useMutation({
    mutationFn: async (file: File): Promise<PostImage> => {
      const presign = await api.post<PresignedUpload>('/uploads/presign', {
        filename: file.name,
        contentType: file.type,
        size: file.size,
      })
      const { uploadUrl, objectKey, publicUrl, headers } = presign.data
      await axios.put(uploadUrl, file, { headers })
      return { objectKey, url: publicUrl }
    },
  })
}
