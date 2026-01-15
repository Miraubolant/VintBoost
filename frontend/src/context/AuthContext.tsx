import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '../lib/supabase'

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

interface SignUpResult {
  error: string | null
  needsEmailConfirmation: boolean
}

interface AuthContextType {
  user: AuthUser | null
  subscription: UserSubscription | null
  credits: number
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>
  signUpWithEmail: (email: string, password: string, fullName?: string) => Promise<SignUpResult>
  signOut: () => Promise<void>
  canGenerateVideo: () => boolean
  consumeVideoCredit: (articlesCount?: number) => Promise<boolean>
  refreshUserData: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [subscription, setSubscription] = useState<UserSubscription | null>(null)
  const [credits, setCredits] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  // Fetch user profile, subscription, and credits
  const fetchUserData = async (userId: string, userEmail?: string) => {
    try {
      // FIRST: Get auth user data and ALWAYS set user state
      const { data: { user: authUser } } = await supabase.auth.getUser()

      if (authUser) {
        // Always set user from auth data first - this ensures user appears logged in
        const authUserData: AuthUser = {
          id: authUser.id,
          email: authUser.email || userEmail || '',
          fullName: authUser.user_metadata?.full_name || authUser.user_metadata?.name || null,
          avatarUrl: authUser.user_metadata?.avatar_url || null,
        }
        setUser(authUserData)

        // Set default subscription immediately (will be overwritten if DB has data)
        setSubscription({
          plan: 'free',
          status: 'active',
          videosLimit: 1,
          videosUsed: 0,
          periodEnd: null,
        })
        setCredits(0)
      }

      // THEN: Try to fetch/create database records
      // Fetch profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (profileError && profileError.code === 'PGRST116') {
        // Profile doesn't exist, create it
        await supabase
          .from('profiles')
          .insert({
            id: userId,
            email: userEmail || authUser?.email || '',
            full_name: authUser?.user_metadata?.full_name || authUser?.user_metadata?.name || null,
            avatar_url: authUser?.user_metadata?.avatar_url || null,
          })
      } else if (profile) {
        // Update user with profile data
        setUser({
          id: profile.id,
          email: profile.email,
          fullName: profile.full_name,
          avatarUrl: profile.avatar_url,
        })
      }

      // Fetch subscription
      const { data: sub, error: subError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (subError && subError.code === 'PGRST116') {
        // Create default free subscription
        await supabase
          .from('subscriptions')
          .insert({
            user_id: userId,
            plan: 'free',
            status: 'active',
            videos_limit: 1,
            videos_used: 0,
            period_start: new Date().toISOString(),
          })
      } else if (sub) {
        setSubscription({
          plan: sub.plan as 'free' | 'pro' | 'business',
          status: sub.status as 'active' | 'cancelled' | 'expired',
          videosLimit: sub.videos_limit,
          videosUsed: sub.videos_used,
          periodEnd: sub.period_end ? new Date(sub.period_end) : null,
        })
      }

      // Fetch credits
      const { data: cred, error: credError } = await supabase
        .from('credits')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (credError && credError.code === 'PGRST116') {
        // Create default credits
        await supabase
          .from('credits')
          .insert({ user_id: userId, amount: 0 })
      } else if (cred) {
        setCredits(cred.amount)
      }
    } catch {
      // Even on error, try to set user from auth if we haven't already
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser()
        if (authUser && !user) {
          setUser({
            id: authUser.id,
            email: authUser.email || userEmail || '',
            fullName: authUser.user_metadata?.full_name || null,
            avatarUrl: authUser.user_metadata?.avatar_url || null,
          })
          setSubscription({
            plan: 'free',
            status: 'active',
            videosLimit: 1,
            videosUsed: 0,
            periodEnd: null,
          })
        }
      } catch {
        // Silently fail
      }
    }
  }

  // Initialize auth state
  useEffect(() => {
    let mounted = true

    // Get initial session - use getSession first, then listen for changes
    const initSession = async () => {
      try {
        // First try to get existing session from storage
        const { data: { session }, error } = await supabase.auth.getSession()

        if (error) {
          console.error('Session error:', error)
        }

        if (session?.user && mounted) {
          // Immediately set user from session to avoid flash
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            fullName: session.user.user_metadata?.full_name || session.user.user_metadata?.name || null,
            avatarUrl: session.user.user_metadata?.avatar_url || null,
          })
          // Then fetch full data
          await fetchUserData(session.user.id, session.user.email || undefined)
        }
      } catch (err) {
        console.error('Init session error:', err)
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    initSession()

    // Listen for auth changes
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Auth state change event (email removed for security)

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') {
          if (session?.user && mounted) {
            // Immediately set user from session
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              fullName: session.user.user_metadata?.full_name || session.user.user_metadata?.name || null,
              avatarUrl: session.user.user_metadata?.avatar_url || null,
            })
            // Then fetch full data in background
            fetchUserData(session.user.id, session.user.email || undefined).catch(console.error)
          }
        } else if (event === 'SIGNED_OUT') {
          if (mounted) {
            setUser(null)
            setSubscription(null)
            setCredits(0)
          }
        }

        if (mounted) {
          setLoading(false)
        }
      }
    )

    return () => {
      mounted = false
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
      throw error
    }
  }

  // Sign in with email/password
  const signInWithEmail = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return { error: error.message }
    }

    // Set user immediately from auth data so UI updates right away
    if (data.user) {
      setUser({
        id: data.user.id,
        email: data.user.email || email,
        fullName: data.user.user_metadata?.full_name || null,
        avatarUrl: data.user.user_metadata?.avatar_url || null,
      })
      setSubscription({
        plan: 'free',
        status: 'active',
        videosLimit: 1,
        videosUsed: 0,
        periodEnd: null,
      })
    }

    // Fetch full user data in background (don't await)
    if (data.session && data.user) {
      fetchUserData(data.user.id, data.user.email || undefined).catch(() => {})
    }

    return { error: null }
  }

  // Sign up with email/password
  const signUpWithEmail = async (email: string, password: string, fullName?: string): Promise<SignUpResult> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: window.location.origin,
      },
    })

    if (error) {
      return { error: error.message, needsEmailConfirmation: false }
    }

    // Check if email confirmation is required
    // If user exists but no session, email confirmation is needed
    const needsEmailConfirmation = data.user && !data.session

    // If we have a session, set user immediately
    if (data.session && data.user) {
      setUser({
        id: data.user.id,
        email: data.user.email || email,
        fullName: data.user.user_metadata?.full_name || fullName || null,
        avatarUrl: data.user.user_metadata?.avatar_url || null,
      })
      setSubscription({
        plan: 'free',
        status: 'active',
        videosLimit: 1,
        videosUsed: 0,
        periodEnd: null,
      })

      // Fetch full user data in background (don't await)
      fetchUserData(data.user.id, data.user.email || undefined).catch(() => {})
    }

    return { error: null, needsEmailConfirmation: !!needsEmailConfirmation }
  }

  // Sign out
  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
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
  const consumeVideoCredit = async (articlesCount: number = 1): Promise<boolean> => {
    if (!user || !subscription) return false

    // Helper function to update analytics
    const updateAnalytics = async () => {
      try {
        // First get current analytics
        const { data: currentAnalytics } = await supabase
          .from('user_analytics')
          .select('total_videos_generated, total_articles_used')
          .eq('user_id', user.id)
          .single()

        const currentVideos = currentAnalytics?.total_videos_generated ?? 0
        const currentArticles = currentAnalytics?.total_articles_used ?? 0

        // Update with incremented values
        await supabase
          .from('user_analytics')
          .upsert({
            user_id: user.id,
            total_videos_generated: currentVideos + 1,
            total_articles_used: currentArticles + articlesCount,
            last_generation_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id' })
      } catch (err) {
        console.error('Failed to update analytics:', err)
      }
    }

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
        await updateAnalytics()

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

        // Update analytics for extra credits too
        await updateAnalytics()

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
