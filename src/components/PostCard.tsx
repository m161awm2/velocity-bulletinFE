import { Link } from 'react-router-dom'
import type { Post } from '../types'
import { CategoryBadge } from './CategoryBadge'

export function PostCard({ post }: { post: Post }) {
  return (
    <Link
      to={`/posts/${post.id}`}
      className="block rounded-lg border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:shadow-sm"
    >
      <div className="mb-2 flex items-center gap-2">
        <CategoryBadge category={post.category} />
        <span className="text-xs text-slate-400">{post.author.displayName}</span>
      </div>
      <h3 className="mb-1 truncate text-base font-semibold text-slate-900">{post.title}</h3>
      <p className="line-clamp-2 text-sm text-slate-500">{post.body}</p>
      <div className="mt-3 flex gap-3 text-xs text-slate-400">
        <span>조회 {post.viewCount}</span>
        <span>좋아요 {post.likeCount}</span>
        <span>{new Date(post.createdAt).toLocaleDateString('ko-KR')}</span>
      </div>
    </Link>
  )
}
