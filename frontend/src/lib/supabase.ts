import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
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
