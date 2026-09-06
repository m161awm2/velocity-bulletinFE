import axios from 'axios'
import type { ApiErrorBody } from '../types'

export const TOKEN_STORAGE_KEY = 'velocity-bulletin.accessToken'

export const api = axios.create({
  baseURL: '/api/v1',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    return error.response?.data?.error?.message ?? '요청 처리 중 오류가 발생했습니다.'
  }
  return '알 수 없는 오류가 발생했습니다.'
}
