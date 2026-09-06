import { useState } from 'react'
import type { Comment } from '../types'

interface CommentItemProps {
  comment: Comment
  canManage: boolean
  onUpdate: (body: string) => Promise<unknown>
  onDelete: () => Promise<unknown>
}

export function CommentItem({ comment, canManage, onUpdate, onDelete }: CommentItemProps) {
  const [editing, setEditing] = useState(false)
  const [body, setBody] = useState(comment.body)
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    try {
      await onUpdate(body)
      setEditing(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <li className="border-b border-slate-100 py-3">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-800">{comment.author.displayName}</span>
        <span className="text-xs text-slate-400">
          {new Date(comment.createdAt).toLocaleString('ko-KR')}
        </span>
      </div>
      {editing ? (
        <div className="flex flex-col gap-2">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full rounded border border-slate-300 p-2 text-sm"
            rows={2}
          />
          <div className="flex gap-2 text-xs">
            <button
              type="button"
              disabled={saving}
              onClick={handleSave}
              className="rounded bg-slate-900 px-2 py-1 text-white disabled:opacity-50"
            >
              저장
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(false)
                setBody(comment.body)
              }}
              className="rounded border border-slate-300 px-2 py-1"
            >
              취소
            </button>
          </div>
        </div>
      ) : (
        <p className="whitespace-pre-wrap text-sm text-slate-700">{comment.body}</p>
      )}
      {canManage && !editing && (
        <div className="mt-1 flex gap-3 text-xs text-slate-400">
          <button type="button" onClick={() => setEditing(true)} className="hover:text-slate-700">
            수정
          </button>
          <button type="button" onClick={() => onDelete()} className="hover:text-rose-600">
            삭제
          </button>
        </div>
      )}
    </li>
  )
}
