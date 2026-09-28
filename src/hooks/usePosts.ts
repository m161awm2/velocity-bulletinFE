import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import type { Category, Page, Post, SortOption } from '../types'

export interface PostFilter {
  search?: string
  category?: Category | ''
  sort?: SortOption
  page?: number
  size?: number
}

export function usePosts(filter: PostFilter) {
  return useQuery({
    queryKey: ['posts', filter],
    queryFn: async () => {
      const res = await api.get<Page<Post>>('/posts', {
        params: {
          search: filter.search || undefined,
          category: filter.category || undefined,
          sort: filter.sort ?? 'latest',
          page: filter.page ?? 1,
          size: filter.size ?? 20,
        },
      })
      return res.data
    },
    placeholderData: (previous) => previous,
  })
}

export function usePost(id: string | undefined) {
  return useQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      const res = await api.get<{ post: Post }>(`/posts/${id}`)
      return res.data.post
    },
    enabled: Boolean(id),
  })
}

export interface PostInput {
  title: string
  body: string
  category: Category
}

export function useCreatePost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: PostInput) => {
      const res = await api.post<{ post: Post }>('/posts', input)
      return res.data.post
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}

export function useUpdatePost(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: PostInput) => {
      const res = await api.put<{ post: Post }>(`/posts/${id}`, input)
      return res.data.post
    },
    onSuccess: (post) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      queryClient.setQueryData(['post', id], post)
    },
  })
}

export function useDeletePost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/posts/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}

export function useToggleLike(postId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      const res = await api.post<{ liked: boolean; likeCount: number }>(
        `/posts/${postId}/likes/toggle`,
      )
      return res.data
    },
    onSuccess: (result) => {
      queryClient.setQueryData(['post', postId], (post: Post | undefined) =>
        post ? { ...post, likeCount: result.likeCount } : post,
      )
    },
  })
}
