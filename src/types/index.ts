export type Role = 'USER' | 'ADMIN'
export type Category = 'GENERAL' | 'QUESTION' | 'NOTICE'
export type SortOption = 'latest' | 'views' | 'likes'

export interface User {
  id: string
  email: string
  displayName: string
  role: Role
  active: boolean
  createdAt?: string
  updatedAt?: string
}

export interface PublicAuthor {
  id: string
  displayName: string
}

export interface PostImage {
  id?: string
  objectKey: string
  url: string
  position?: number
}

export interface Post {
  id: string
  authorId: string
  author: PublicAuthor
  title: string
  body: string
  category: Category
  viewCount: number
  likeCount: number
  images: PostImage[]
  createdAt: string
  updatedAt: string
}

export interface Comment {
  id: string
  postId: string
  authorId: string
  author: PublicAuthor
  body: string
  createdAt: string
  updatedAt: string
}

export interface Page<T> {
  items: T[]
  page: number
  size: number
  total: number
}

export interface AuthResponse {
  user: User
  accessToken: string
  expiresAt: string
}

export interface ApiErrorBody {
  error: { code: string; message: string }
  requestId: string
}

export interface PresignedUpload {
  uploadUrl: string
  objectKey: string
  publicUrl: string
  headers: Record<string, string>
  expiresAt: string
}
