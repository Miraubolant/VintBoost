import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Custom storage adapter using localStorage directly
// This avoids issues with cookie-blocker extensions
const customStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key)
    } catch {
      return null
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value)
    } catch {
      console.warn('Failed to save auth state to localStorage')
    }
  },
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key)
    } catch {
      console.warn('Failed to remove auth state from localStorage')
    }
  },
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: customStorage,
    storageKey: 'vintboost-auth',
    flowType: 'pkce',
  },
})

// Types for database tables
export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Subscription {
  id: string
  user_id: string
  plan: 'free' | 'pro' | 'business'
  status: 'active' | 'cancelled' | 'expired'
  videos_limit: number
  videos_used: number
  period_start: string | null
  period_end: string | null
  created_at: string
  updated_at: string
}

export interface Credits {
  id: string
  user_id: string
  amount: number
  created_at: string
  updated_at: string
}

export interface UserVideo {
  id: string
  user_id: string
  video_id: string
  video_url: string | null
  thumbnail_url: string | null
  title: string | null
  duration: number | null
  file_size: string | null
  template: string | null
  articles_count: number | null
  created_at: string
}

export interface UserAnalytics {
  id: string
  user_id: string
  total_videos_generated: number
  total_articles_used: number
  favorite_template: string | null
  last_generation_at: string | null
  created_at: string
  updated_at: string
}

// Storage helper functions
export async function uploadVideoToStorage(
  userId: string,
  videoId: string,
  videoBlob: Blob,
  thumbnailBlob?: Blob
): Promise<{ videoUrl: string | null; thumbnailUrl: string | null }> {
  const videoPath = `${userId}/${videoId}.mp4`
  const thumbnailPath = `${userId}/${videoId}-thumb.jpg`

  let videoUrl: string | null = null
  let thumbnailUrl: string | null = null

  // Upload video
  const { error: videoError } = await supabase.storage
    .from('videos')
    .upload(videoPath, videoBlob, {
      contentType: 'video/mp4',
      upsert: true,
    })

  if (!videoError) {
    const { data } = supabase.storage.from('videos').getPublicUrl(videoPath)
    videoUrl = data.publicUrl
  }

  // Upload thumbnail if provided
  if (thumbnailBlob) {
    const { error: thumbError } = await supabase.storage
      .from('videos')
      .upload(thumbnailPath, thumbnailBlob, {
        contentType: 'image/jpeg',
        upsert: true,
      })

    if (!thumbError) {
      const { data } = supabase.storage.from('videos').getPublicUrl(thumbnailPath)
      thumbnailUrl = data.publicUrl
    }
  }

  return { videoUrl, thumbnailUrl }
}

export async function deleteVideoFromStorage(userId: string, videoId: string): Promise<boolean> {
  const videoPath = `${userId}/${videoId}.mp4`
  const thumbnailPath = `${userId}/${videoId}-thumb.jpg`

  const { error: videoError } = await supabase.storage
    .from('videos')
    .remove([videoPath, thumbnailPath])

  return !videoError
}

export function getVideoPublicUrl(userId: string, videoId: string): string {
  const { data } = supabase.storage.from('videos').getPublicUrl(`${userId}/${videoId}.mp4`)
  return data.publicUrl
}

export function getThumbnailPublicUrl(userId: string, videoId: string): string {
  const { data } = supabase.storage.from('videos').getPublicUrl(`${userId}/${videoId}-thumb.jpg`)
  return data.publicUrl
}

// Database type for Supabase
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at' | 'updated_at'>
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>
      }
      subscriptions: {
        Row: Subscription
        Insert: Omit<Subscription, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Subscription, 'id' | 'created_at'>>
      }
      credits: {
        Row: Credits
        Insert: Omit<Credits, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Credits, 'id' | 'created_at'>>
      }
      user_videos: {
        Row: UserVideo
        Insert: Omit<UserVideo, 'id' | 'created_at'>
        Update: Partial<Omit<UserVideo, 'id' | 'created_at'>>
      }
      user_analytics: {
        Row: UserAnalytics
        Insert: Omit<UserAnalytics, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<UserAnalytics, 'id' | 'created_at'>>
      }
    }
  }
}
