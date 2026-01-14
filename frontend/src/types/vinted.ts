export interface VintedItem {
  id: string
  title: string
  price: string
  currency: string
  imageUrl: string
  images: string[]
  itemUrl: string
  brand: string
  size: string
  color: string
  condition: string
  status: 'active' | 'sold' | 'reserved' | 'hidden'
  isSold: boolean
  isReserved: boolean
}

export interface UserVerifications {
  email: boolean
  phone: boolean
  facebook: boolean
  google: boolean
}

export interface UserInfo {
  profilePicture: string
  followersCount: number
  followingCount: number
  itemsCount: number
  soldItemsCount: number
  feedbackCount: number
  positiveFeedbackCount: number
  feedbackReputation: number
  verifications: UserVerifications
  city: string
  countryCode: string
  lastLogged: string | null
  createdAt: string | null
}

export interface WardrobeData {
  success: boolean
  username: string
  userId: string
  userInfo?: UserInfo
  totalItems: number
  scrapedAt: string
  items: VintedItem[]
  error?: string
}

// Types pour la génération vidéo
export type VideoResolution = '720p' | '1080p' | '4K'
export type VideoAspectRatio = '9:16' | '16:9' | '1:1'
export type VideoTemplate = 'classic' | 'modern' | 'premium'

export interface VideoConfig {
  articles: VideoArticle[]
  duration?: number
  musicTrack: string
  title?: string
  template: VideoTemplate
  customText?: string
  hasWatermark: boolean
  resolution: VideoResolution
  aspectRatio: VideoAspectRatio
  username?: string
  profileScreenshot?: string | null // base64 data URL du screenshot mobile
}

export interface VideoArticle {
  id: string
  title: string
  price: string
  imageUrl: string
  brand?: string
}

export interface MusicTrack {
  id: string
  name: string
  filename: string
}

export interface VideoGenerationResult {
  success: boolean
  videoId: string
  videoUrl: string
  thumbnailUrl: string
  duration: number
  fileSize: string
  error?: string
}

export interface VideoInfo {
  id: string
  videoUrl: string
  thumbnailUrl: string
  downloadUrl: string
  duration: number
  fileSize: string
  createdAt: string
}
