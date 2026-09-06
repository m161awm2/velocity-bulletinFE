import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { useAuth } from '../auth/AuthContext'
import { getApiErrorMessage } from '../lib/api'
import { useDeleteAccount, useUpdateProfile } from '../hooks/useUsers'

const schema = z.object({
  displayName: z
    .string()
    .min(2, '닉네임은 2자 이상이어야 합니다.')
    .max(40, '닉네임은 40자 이하여야 합니다.'),
})

type FormValues = z.infer<typeof schema>

export function ProfilePage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const updateProfile = useUpdateProfile()
  const deleteAccount = useDeleteAccount()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { displayName: user?.displayName },
  })

  if (!user) return null

  async function onSubmit(values: FormValues) {
    setError(null)
    setSuccess(false)
    try {
      await updateProfile.mutateAsync(values.displayName)
      setSuccess(true)
    } catch (err) {
      setError(getApiErrorMessage(err))
    }
  }

  async function handleDeleteAccount() {
    if (!window.confirm('정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return
    try {
      await deleteAccount.mutateAsync()
      navigate('/')
    } catch (err) {
      setError(getApiErrorMessage(err))
    }
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-6 text-xl font-bold text-slate-900">내 정보</h1>
      <dl className="mb-6 text-sm text-slate-600">
        <div className="mb-1 flex justify-between">
          <dt>이메일</dt>
          <dd>{user.email}</dd>
        </div>
        <div className="flex justify-between">
          <dt>권한</dt>
          <dd>{user.role === 'ADMIN' ? '관리자' : '일반 사용자'}</dd>
        </div>
      </dl>

      <form onSubmit={handleSubmit(onSubmit)} className="mb-8 flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">닉네임</label>
          <input
            type="text"
            {...register('displayName')}
            className="w-full rounded border border-slate-300 p-2 text-sm"
          />
          {errors.displayName && (
            <p className="mt-1 text-xs text-rose-600">{errors.displayName.message}</p>
          )}
        </div>
        {success && <p className="text-sm text-emerald-600">저장되었습니다.</p>}
        {error && <p className="text-sm text-rose-600">{error}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded bg-slate-900 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          저장
        </button>
      </form>

      <div className="flex justify-between border-t border-slate-200 pt-4">
        <button type="button" onClick={logout} className="text-sm text-slate-500 underline">
          로그아웃
        </button>
        <button
          type="button"
          onClick={handleDeleteAccount}
          className="text-sm text-rose-600 underline"
        >
          회원 탈퇴
        </button>
      </div>
    </div>
  )
}
