import { useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { CategoryBadge } from '../components/CategoryBadge'
import { CommentItem } from '../components/CommentItem'
import { getApiErrorMessage } from '../lib/api'
import {
  useComments,
  useCreateComment,
  useDeleteComment,
  useUpdateComment,
} from '../hooks/useComments'
import { useDeletePost, usePost, useToggleLike } from '../hooks/usePosts'

export function PostDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [commentBody, setCommentBody] = useState('')
  const [error, setError] = useState<string | null>(null)

  const { data: post, isLoading, isError } = usePost(id)
  const { data: comments } = useComments(id)
  const toggleLike = useToggleLike(id ?? '')
  const deletePost = useDeletePost()
  const createComment = useCreateComment(id ?? '')
  const updateComment = useUpdateComment(id ?? '')
  const deleteComment = useDeleteComment(id ?? '')

  if (isLoading) return <p className="py-10 text-center text-sm text-slate-500">불러오는 중...</p>
  if (isError || !post)
    return <p className="py-10 text-center text-sm text-rose-600">게시글을 찾을 수 없습니다.</p>

  const isOwner = user?.id === post.authorId

  async function handleDeletePost() {
    if (!id || !window.confirm('게시글을 삭제하시겠습니까?')) return
    try {
      await deletePost.mutateAsync(id)
      navigate('/')
    } catch (err) {
      setError(getApiErrorMessage(err))
    }
  }

  async function handleCreateComment(e: FormEvent) {
    e.preventDefault()
    if (!commentBody.trim()) return
    try {
      await createComment.mutateAsync(commentBody)
      setCommentBody('')
    } catch (err) {
      setError(getApiErrorMessage(err))
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-2 flex items-center gap-2">
        <CategoryBadge category={post.category} />
        <span className="text-sm text-slate-500">{post.author.displayName}</span>
      </div>
      <h1 className="mb-2 text-2xl font-bold text-slate-900">{post.title}</h1>
      <div className="mb-4 flex gap-3 text-xs text-slate-400">
        <span>{new Date(post.createdAt).toLocaleString('ko-KR')}</span>
        <span>조회 {post.viewCount}</span>
      </div>

      <p className="mb-6 whitespace-pre-wrap text-sm text-slate-800">{post.body}</p>

      <div className="mb-6 flex items-center gap-3">
        <button
          type="button"
          disabled={!user || toggleLike.isPending}
          onClick={() => toggleLike.mutate()}
          className="rounded border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100 disabled:opacity-50"
        >
          좋아요 {post.likeCount}
        </button>
        {isOwner && (
          <>
            <button
              type="button"
              onClick={() => navigate(`/posts/${post.id}/edit`)}
              className="rounded border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100"
            >
              수정
            </button>
            <button
              type="button"
              onClick={handleDeletePost}
              className="rounded border border-rose-200 px-3 py-1.5 text-sm text-rose-600 hover:bg-rose-50"
            >
              삭제
            </button>
          </>
        )}
      </div>

      {error && <p className="mb-4 text-sm text-rose-600">{error}</p>}

      <section>
        <h2 className="mb-3 text-base font-semibold text-slate-900">
          댓글 {comments?.total ?? 0}
        </h2>
        {user ? (
          <form onSubmit={handleCreateComment} className="mb-4 flex gap-2">
            <input
              type="text"
              value={commentBody}
              onChange={(e) => setCommentBody(e.target.value)}
              placeholder="댓글을 입력하세요"
              className="flex-1 rounded border border-slate-300 p-2 text-sm"
            />
            <button
              type="submit"
              disabled={createComment.isPending}
              className="rounded bg-slate-900 px-4 py-2 text-sm text-white disabled:opacity-50"
            >
              등록
            </button>
          </form>
        ) : (
          <p className="mb-4 text-sm text-slate-500">댓글을 작성하려면 로그인해주세요.</p>
        )}
        <ul>
          {comments?.items.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              canManage={user?.id === comment.authorId}
              onUpdate={(body) => updateComment.mutateAsync({ id: comment.id, body })}
              onDelete={() => deleteComment.mutateAsync(comment.id)}
            />
          ))}
        </ul>
      </section>
    </div>
  )
}
