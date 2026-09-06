import { useState } from 'react'
import { Pagination } from '../components/Pagination'
import { useAdminUsers, useSetUserStatus } from '../hooks/useAdmin'

export function AdminUsersPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useAdminUsers(page)
  const setStatus = useSetUserStatus()

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-slate-900">사용자 관리</h1>
      {isLoading && <p className="text-sm text-slate-500">불러오는 중...</p>}
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs text-slate-500">
            <tr>
              <th className="px-4 py-2">이메일</th>
              <th className="px-4 py-2">닉네임</th>
              <th className="px-4 py-2">권한</th>
              <th className="px-4 py-2">상태</th>
              <th className="px-4 py-2">작업</th>
            </tr>
          </thead>
          <tbody>
            {data?.items.map((u) => (
              <tr key={u.id} className="border-b border-slate-100">
                <td className="px-4 py-2">{u.email}</td>
                <td className="px-4 py-2">{u.displayName}</td>
                <td className="px-4 py-2">{u.role === 'ADMIN' ? '관리자' : '일반'}</td>
                <td className="px-4 py-2">
                  <span className={u.active ? 'text-emerald-600' : 'text-rose-600'}>
                    {u.active ? '활성' : '비활성'}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <button
                    type="button"
                    disabled={setStatus.isPending || u.role === 'ADMIN'}
                    onClick={() => setStatus.mutate({ id: u.id, active: !u.active })}
                    className="rounded border border-slate-300 px-2 py-1 text-xs hover:bg-slate-100 disabled:opacity-40"
                  >
                    {u.active ? '비활성화' : '활성화'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data && (
        <Pagination page={data.page} size={data.size} total={data.total} onChange={setPage} />
      )}
    </div>
  )
}
