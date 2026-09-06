import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="py-20 text-center">
      <p className="mb-4 text-lg font-semibold text-slate-900">페이지를 찾을 수 없습니다.</p>
      <Link to="/" className="text-sm text-slate-500 underline">
        홈으로 돌아가기
      </Link>
    </div>
  )
}
