import { useState } from 'react'
import { useUploadImage } from '../hooks/useUpload'
import { getApiErrorMessage } from '../lib/api'
import type { PostImage } from '../types'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE = 5 * 1024 * 1024
const MAX_IMAGES = 5

interface ImageUploaderProps {
  images: PostImage[]
  onChange: (images: PostImage[]) => void
}

export function ImageUploader({ images, onChange }: ImageUploaderProps) {
  const upload = useUploadImage()
  const [error, setError] = useState<string | null>(null)

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    setError(null)
    const remaining = MAX_IMAGES - images.length
    const selected = Array.from(files).slice(0, remaining)

    for (const file of selected) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        setError('JPEG, PNG, WebP 이미지만 업로드할 수 있습니다.')
        continue
      }
      if (file.size > MAX_SIZE) {
        setError('이미지는 5MB 이하만 업로드할 수 있습니다.')
        continue
      }
      try {
        const image = await upload.mutateAsync(file)
        onChange([...images, image])
      } catch (err) {
        setError(getApiErrorMessage(err))
      }
    }
  }

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        이미지 (최대 {MAX_IMAGES}장, 장당 5MB 이하)
      </label>
      <input
        type="file"
        accept={ALLOWED_TYPES.join(',')}
        multiple
        disabled={images.length >= MAX_IMAGES || upload.isPending}
        onChange={(e) => handleFiles(e.target.files)}
        className="text-sm"
      />
      {upload.isPending && <p className="mt-1 text-xs text-slate-500">업로드 중...</p>}
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
      {images.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-3">
          {images.map((image, index) => (
            <li key={image.objectKey} className="relative">
              <img
                src={image.url}
                alt=""
                className="h-24 w-24 rounded object-cover"
              />
              <button
                type="button"
                onClick={() => onChange(images.filter((_, i) => i !== index))}
                className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs text-white"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
