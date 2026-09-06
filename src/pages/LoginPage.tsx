import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate, type Location } from 'react-router-dom'
import { z } from 'zod'
import { useAuth } from '../auth/AuthContext'
import { getApiErrorMessage } from '../lib/api'

const schema = z.object({
  email: z.string().email('올바른 이메일을 입력해주세요.'),
  password: z.string().min(1, '비밀번호를 입력해주세요.'),
})

type FormValues = z.infer<typeof schema>

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [error, setError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  async function onSubmit(values: FormValues) {
    setError(null)
    try {
      await login(values.email, values.password)
      const from = (location.state as { from?: Location } | null)?.from?.pathname ?? '/'
      navigate(from, { replace: true })
    } catch (err) {
      setError(getApiErrorMessage(err))
    }
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-6 text-xl font-bold text-slate-900">로그인</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">이메일</label>
          <input
            type="email"
            {...register('email')}
            className="w-full rounded border border-slate-300 p-2 text-sm"
          />
          {errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">비밀번호</label>
          <input
            type="password"
            {...register('password')}
            className="w-full rounded border border-slate-300 p-2 text-sm"
          />
          {errors.password && (
            <p className="mt-1 text-xs text-rose-600">{errors.password.message}</p>
          )}
        </div>
        {error && <p className="text-sm text-rose-600">{error}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded bg-slate-900 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          로그인
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-slate-500">
        계정이 없으신가요?{' '}
        <Link to="/register" className="text-slate-900 underline">
          회원가입
        </Link>
      </p>
    </div>
  )
}
