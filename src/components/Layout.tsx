import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="min-h-svh bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <Link to="/" className="text-lg font-bold text-slate-900">
            Velocity Bulletin
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <NavLink to="/" end className="text-slate-600 hover:text-slate-900">
              게시판
            </NavLink>
            {user ? (
              <>
                <Link to="/posts/new" className="text-slate-600 hover:text-slate-900">
                  글쓰기
                </Link>
                {user.role === 'ADMIN' && (
                  <Link to="/admin/users" className="text-slate-600 hover:text-slate-900">
                    관리자
                  </Link>
                )}
                <Link to="/profile" className="text-slate-600 hover:text-slate-900">
                  {user.displayName}
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    logout()
                    navigate('/')
                  }}
                  className="rounded bg-slate-900 px-3 py-1.5 text-white hover:bg-slate-700"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-slate-600 hover:text-slate-900">
                  로그인
                </Link>
                <Link
                  to="/register"
                  className="rounded bg-slate-900 px-3 py-1.5 text-white hover:bg-slate-700"
                >
                  회원가입
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
