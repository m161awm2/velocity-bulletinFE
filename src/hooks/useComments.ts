import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import type { Comment, Page } from '../types'

export function useComments(postId: string | undefined, page = 1) {
  return useQuery({
    queryKey: ['comments', postId, page],
    queryFn: async () => {
      const res = await api.get<Page<Comment>>(`/posts/${postId}/comments`, {
        params: { page, size: 20 },
      })
      return res.data
    },
    enabled: Boolean(postId),
  })
}

export function useCreateComment(postId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (body: string) => {
      const res = await api.post<{ comment: Comment }>(`/posts/${postId}/comments`, { body })
      return res.data.comment
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] })
    },
  })
}

export function useUpdateComment(postId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, body }: { id: string; body: string }) => {
      const res = await api.put<{ comment: Comment }>(`/comments/${id}`, { body })
      return res.data.comment
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] })
    },
  })
}

export function useDeleteComment(postId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/comments/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] })
    },
  })
}
