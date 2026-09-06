import { useMutation } from '@tanstack/react-query'
import { api } from '../lib/api'
import { useAuth } from '../auth/AuthContext'
import type { User } from '../types'

export function useUpdateProfile() {
  const { setUser } = useAuth()
  return useMutation({
    mutationFn: async (displayName: string) => {
      const res = await api.patch<{ user: User }>('/users/me', { displayName })
      return res.data.user
    },
    onSuccess: (user) => setUser(user),
  })
}

export function useDeleteAccount() {
  const { logout } = useAuth()
  return useMutation({
    mutationFn: async () => {
      await api.delete('/users/me')
    },
    onSuccess: () => logout(),
  })
}
