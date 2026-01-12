import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase, Profile, Subscription, Credits } from '../lib/supabase'

interface AuthUser {
  id: string
  email: string
  fullName: string | null
  avatarUrl: string | null
}

interface UserSubscription {
  plan: 'free' | 'pro' | 'business'
  status: 'active' | 'cancelled' | 'expired'
  videosLimit: number
  videosUsed: number
  periodEnd: Date | null
}

interface AuthContextType {
  user: AuthUser | null
  subscription: UserSubscription | null
  credits: number
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>
  signUpWithEmail: (email: string, password: string, fullName?: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  canGenerateVideo: () => boolean
  consumeVideoCredit: () => Promise<boolean>
  refreshUserData: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [subscription, setSubscription] = useState<UserSubscription | null>(null)
  const [credits, setCredits] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  // Fetch user profile, subscription, and credits
  const fetchUserData = async (userId: string) => {
    try {
      // Fetch profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (profile) {
        setUser({
          id: profile.id,
          email: profile.email,
          fullName: profile.full_name,
          avatarUrl: profile.avatar_url,
        })
      }

      // Fetch subscription
      const { data: sub } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (sub) {
        setSubscription({
          plan: sub.plan as 'free' | 'pro' | 'business',
          status: sub.status as 'active' | 'cancelled' | 'expired',
          videosLimit: sub.videos_limit,
          videosUsed: sub.videos_used,
          periodEnd: sub.period_end ? new Date(sub.period_end) : null,
        })
      }

      // Fetch credits
      const { data: cred } = await supabase
        .from('credits')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (cred) {
        setCredits(cred.amount)
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  // Initialize auth state
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserData(session.user.id)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await fetchUserData(session.user.id)
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          setSubscription(null)
          setCredits(0)
        }
        setLoading(false)
      }
    )

    return () => {
      authSubscription.unsubscribe()
    }
  }, [])

  // Sign in with Google OAuth
  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    })

    if (error) {
      console.error('Error signing in with Google:', error)
      throw error
    }
  }

  // Sign in with email/password
  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return { error: error.message }
    }

    return { error: null }
  }

  // Sign up with email/password
  const signUpWithEmail = async (email: string, password: string, fullName?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (error) {
      return { error: error.message }
    }

    return { error: null }
  }

  // Sign out
  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error signing out:', error)
      throw error
    }
  }

  // Check if user can generate a video
  const canGenerateVideo = (): boolean => {
    if (!subscription) return false

    // Check subscription limit
    if (subscription.videosUsed < subscription.videosLimit) {
      return true
    }

    // Check extra credits
    if (credits > 0) {
      return true
    }

    return false
  }

  // Consume a video credit
  const consumeVideoCredit = async (): Promise<boolean> => {
    if (!user || !subscription) return false

    // Try subscription first
    if (subscription.videosUsed < subscription.videosLimit) {
      const { error } = await supabase
        .from('subscriptions')
        .update({ videos_used: subscription.videosUsed + 1 })
        .eq('user_id', user.id)

      if (!error) {
        setSubscription({
          ...subscription,
          videosUsed: subscription.videosUsed + 1,
        })

        // Update analytics
        await supabase
          .from('user_analytics')
          .update({
            total_videos_generated: (await supabase.from('user_analytics').select('total_videos_generated').eq('user_id', user.id).single()).data?.total_videos_generated ?? 0 + 1,
            last_generation_at: new Date().toISOString()
          })
          .eq('user_id', user.id)

        return true
      }
    }

    // Then extra credits
    if (credits > 0) {
      const { error } = await supabase
        .from('credits')
        .update({ amount: credits - 1 })
        .eq('user_id', user.id)

      if (!error) {
        setCredits(credits - 1)
        return true
      }
    }

    return false
  }

  // Refresh user data
  const refreshUserData = async () => {
    if (user) {
      await fetchUserData(user.id)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        subscription,
        credits,
        loading,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        canGenerateVideo,
        consumeVideoCredit,
        refreshUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
