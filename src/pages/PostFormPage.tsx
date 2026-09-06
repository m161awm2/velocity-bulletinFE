import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { z } from 'zod'
import { useAuth } from '../auth/AuthContext'
import { CATEGORY_OPTIONS } from '../components/CategoryBadge'
import { ImageUploader } from '../components/ImageUploader'
import { getApiErrorMessage } from '../lib/api'
import { useCreatePost, usePost, useUpdatePost } from '../hooks/usePosts'
import type { Category, PostImage } from '../types'

const schema = z.object({
  title: z.string().min(2, '제목은 2자 이상이어야 합니다.').max(200, '제목은 200자 이하여야 합니다.'),
  body: z.string().min(1, '내용을 입력해주세요.'),
  category: z.enum(['GENERAL', 'QUESTION', 'NOTICE']),
})

type FormValues = z.infer<typeof schema>

export function PostFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const { user } = useAuth()
  const navigate = useNavigate()
  const [images, setImages] = useState<PostImage[]>([])
  const [error, setError] = useState<string | null>(null)

  const { data: existingPost } = usePost(id)
  const createPost = useCreatePost()
  const updatePost = useUpdatePost(id ?? '')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { category: 'GENERAL' },
  })

  useEffect(() => {
    if (existingPost) {
      reset({ title: existingPost.title, body: existingPost.body, category: existingPost.category })
      setImages(existingPost.images)
    }
  }, [existingPost, reset])

  if (isEdit && existingPost && existingPost.authorId !== user?.id) {
    return <p className="py-10 text-center text-sm text-rose-600">본인이 작성한 글만 수정할 수 있습니다.</p>
  }

  async function onSubmit(values: FormValues) {
    setError(null)
    try {
      const input = { ...values, images }
      const post = isEdit
        ? await updatePost.mutateAsync(input)
        : await createPost.mutateAsync(input)
      navigate(`/posts/${post.id}`)
    } catch (err) {
      setError(getApiErrorMessage(err))
    }
  }

  const categoryOptions = CATEGORY_OPTIONS.filter(
    (opt) => opt.value !== 'NOTICE' || user?.role === 'ADMIN',
  )

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-xl font-bold text-slate-900">{isEdit ? '글 수정' : '글쓰기'}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">카테고리</label>
          <select
            {...register('category')}
            className="w-full rounded border border-slate-300 p-2 text-sm"
          >
            {categoryOptions.map((opt) => (
              <option key={opt.value} value={opt.value as Category}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">제목</label>
          <input
            type="text"
            {...register('title')}
            className="w-full rounded border border-slate-300 p-2 text-sm"
          />
          {errors.title && <p className="mt-1 text-xs text-rose-600">{errors.title.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">내용</label>
          <textarea
            {...register('body')}
            rows={10}
            className="w-full rounded border border-slate-300 p-2 text-sm"
          />
          {errors.body && <p className="mt-1 text-xs text-rose-600">{errors.body.message}</p>}
        </div>
        <ImageUploader images={images} onChange={setImages} />
        {error && <p className="text-sm text-rose-600">{error}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded bg-slate-900 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {isEdit ? '수정 완료' : '등록'}
        </button>
      </form>
    </div>
  )
}
