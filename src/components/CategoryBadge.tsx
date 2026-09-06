import type { Category } from '../types'

const LABELS: Record<Category, string> = {
  GENERAL: '자유',
  QUESTION: '질문',
  NOTICE: '공지',
}

const STYLES: Record<Category, string> = {
  GENERAL: 'bg-slate-100 text-slate-700',
  QUESTION: 'bg-blue-100 text-blue-700',
  NOTICE: 'bg-rose-100 text-rose-700',
}

export function CategoryBadge({ category }: { category: Category }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${STYLES[category]}`}>
      {LABELS[category]}
    </span>
  )
}

export const CATEGORY_OPTIONS: { value: Category; label: string }[] = [
  { value: 'GENERAL', label: '자유' },
  { value: 'QUESTION', label: '질문' },
  { value: 'NOTICE', label: '공지' },
]
