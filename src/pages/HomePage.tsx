import { useState } from 'react'
import { CATEGORY_OPTIONS } from '../components/CategoryBadge'
import { Pagination } from '../components/Pagination'
import { PostCard } from '../components/PostCard'
import { usePosts } from '../hooks/usePosts'
import type { Category, SortOption } from '../types'

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'latest', label: '최신순' },
  { value: 'views', label: '조회순' },
  { value: 'likes', label: '좋아요순' },
]

export function HomePage() {
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [category, setCategory] = useState<Category | ''>('')
  const [sort, setSort] = useState<SortOption>('latest')
  const [page, setPage] = useState(1)

  const { data, isLoading, isError } = usePosts({ search, category, sort, page })

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          setSearch(searchInput)
          setPage(1)
        }}
        className="mb-4 flex gap-2"
      >
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="제목/내용 검색"
          className="flex-1 rounded border border-slate-300 p-2 text-sm"
        />
        <button
          type="submit"
          className="rounded bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-700"
        >
          검색
        </button>
      </form>

      <div className="mb-4 flex flex-wrap gap-2">
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value as Category | '')
            setPage(1)
          }}
          className="rounded border border-slate-300 p-2 text-sm"
        >
          <option value="">전체 카테고리</option>
          {CATEGORY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value as SortOption)
            setPage(1)
          }}
          className="rounded border border-slate-300 p-2 text-sm"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {isLoading && <p className="py-10 text-center text-sm text-slate-500">불러오는 중...</p>}
      {isError && (
        <p className="py-10 text-center text-sm text-rose-600">
          게시글을 불러오지 못했습니다. 백엔드 서버가 실행 중인지 확인해주세요.
        </p>
      )}
      {data && data.items.length === 0 && (
        <p className="py-10 text-center text-sm text-slate-500">게시글이 없습니다.</p>
      )}

      <div className="flex flex-col gap-3">
        {data?.items.map((post) => <PostCard key={post.id} post={post} />)}
      </div>

      {data && (
        <Pagination page={data.page} size={data.size} total={data.total} onChange={setPage} />
      )}
    </div>
  )
}
