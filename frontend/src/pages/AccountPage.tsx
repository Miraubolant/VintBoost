import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Video, BarChart3, CreditCard, Trash2, Download, TrendingUp, AlertTriangle, Image, Settings, Loader2, Calendar, Zap, Clock, Play, ExternalLink } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useStripe } from '../hooks/useStripe'
import { supabase } from '../lib/supabase'

interface UserVideo {
  id: string
  video_id: string
  video_url: string | null
  thumbnail_url: string | null
  title: string | null
  duration: number | null
  articles_count: number | null
  template: string | null
  created_at: string
}

interface UserAnalytics {
  total_videos_generated: number
  total_articles_used: number
  favorite_template: string | null
  last_generation_at: string | null
}

type TabType = 'statistics' | 'history'

export function AccountPage() {
  const navigate = useNavigate()
  const { user, subscription, credits, signOut, loading } = useAuth()
  const { openCustomerPortal, loading: stripeLoading } = useStripe()
  const [activeTab, setActiveTab] = useState<TabType>('statistics')
  const [videos, setVideos] = useState<UserVideo[]>([])
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null)
  const [loadingData, setLoadingData] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      navigate('/', { state: { showAuth: true } })
    }
  }, [user, loading, navigate])

  useEffect(() => {
    if (user) {
      fetchUserData()
    }
  }, [user])

  const fetchUserData = async () => {
    if (!user) return
    setLoadingData(true)

    try {
      // Fetch videos
      const { data: videosData } = await supabase
        .from('user_videos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50)

      if (videosData) {
        setVideos(videosData)
      }

      // Fetch or create analytics
      let { data: analyticsData, error: analyticsError } = await supabase
        .from('user_analytics')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (analyticsError && analyticsError.code === 'PGRST116') {
        // Create analytics record if it doesn't exist
        const { data: newAnalytics } = await supabase
          .from('user_analytics')
          .insert({
            user_id: user.id,
            total_videos_generated: 0,
            total_articles_used: 0,
          })
          .select()
          .single()

        analyticsData = newAnalytics
      }

      if (analyticsData) {
        setAnalytics(analyticsData)
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setLoadingData(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'SUPPRIMER' || !user) return

    setDeleting(true)
    try {
      // Delete user data (cascades will handle related tables)
      const { error } = await supabase.auth.admin.deleteUser(user.id)

      if (error) {
        // If admin delete fails, try signing out and showing message
        await signOut()
        navigate('/')
      } else {
        await signOut()
        navigate('/')
      }
    } catch (error) {
      console.error('Error deleting account:', error)
      // Sign out anyway
      await signOut()
      navigate('/')
    } finally {
      setDeleting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#E8DFD5' }}>
        <div className="w-12 h-12 border-4 border-black animate-spin" style={{ borderTopColor: '#1D3354' }} />
      </div>
    )
  }

  // Calculate credits from subscription
  const subscriptionCreditsRemaining = Math.max(0, (subscription?.videosLimit || 0) - (subscription?.videosUsed || 0))
  const totalCredits = subscriptionCreditsRemaining + credits
  const totalGenerated = analytics?.total_videos_generated || 0
  const totalArticlesUsed = analytics?.total_articles_used || 0
  const thisMonthUsed = subscription?.videosUsed || 0
  const thisMonthLimit = subscription?.videosLimit || 1

  return (
    <div className="min-h-screen py-8 px-4" style={{ backgroundColor: '#E8DFD5' }}>
      <div className="max-w-5xl mx-auto">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1
            className="inline-block font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white border-3 border-black px-6 py-3 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]"
            style={{ backgroundColor: '#1D3354' }}
          >
            MON COMPTE
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <button
            onClick={() => setActiveTab('statistics')}
            className={`flex items-center gap-2 px-4 py-2.5 border-2 border-black font-display font-bold text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all ${
              activeTab === 'statistics'
                ? 'translate-x-[-2px] translate-y-[-2px] shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]'
                : 'hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
            }`}
            style={{ backgroundColor: activeTab === 'statistics' ? '#1D3354' : '#FFFFFF', color: activeTab === 'statistics' ? '#FFFFFF' : '#000000' }}
          >
            <BarChart3 className="w-4 h-4" />
            STATISTIQUES
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-4 py-2.5 border-2 border-black font-display font-bold text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all ${
              activeTab === 'history'
                ? 'translate-x-[-2px] translate-y-[-2px] shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]'
                : 'hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
            }`}
            style={{ backgroundColor: activeTab === 'history' ? '#1D3354' : '#FFFFFF', color: activeTab === 'history' ? '#FFFFFF' : '#000000' }}
          >
            <Image className="w-4 h-4" />
            MES VIDEOS ({videos.length})
          </button>
        </div>

        {/* Statistics Tab */}
        {activeTab === 'statistics' && (
          <>
            {/* Main Stats Cards - 4 columns */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Credits disponibles */}
              <div
                className="border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4"
                style={{ backgroundColor: '#D64045' }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 border-2 border-black flex items-center justify-center bg-white">
                    <Zap className="w-4 h-4" />
                  </div>
                  <span className="font-display font-bold text-xs text-white">CREDITS</span>
                </div>
                <p className="font-display font-bold text-4xl text-white">{totalCredits}</p>
                <p className="font-body text-xs text-white/70 mt-1">disponibles</p>
              </div>

              {/* Videos generees ce mois */}
              <div
                className="border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4"
                style={{ backgroundColor: '#9ED8DB' }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 border-2 border-black flex items-center justify-center bg-white">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <span className="font-display font-bold text-xs">CE MOIS</span>
                </div>
                <p className="font-display font-bold text-4xl">{thisMonthUsed}</p>
                <p className="font-body text-xs text-black/70 mt-1">/ {thisMonthLimit} utilisees</p>
              </div>

              {/* Total videos generees */}
              <div
                className="border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4"
                style={{ backgroundColor: '#1D3354' }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 border-2 border-black flex items-center justify-center bg-white">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <span className="font-display font-bold text-xs text-white">TOTAL</span>
                </div>
                <p className="font-display font-bold text-4xl text-white">{totalGenerated}</p>
                <p className="font-body text-xs text-white/70 mt-1">videos generees</p>
              </div>

              {/* Articles utilises */}
              <div
                className="border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4"
                style={{ backgroundColor: '#FFFFFF' }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 border-2 border-black flex items-center justify-center" style={{ backgroundColor: '#9ED8DB' }}>
                    <Image className="w-4 h-4" />
                  </div>
                  <span className="font-display font-bold text-xs">ARTICLES</span>
                </div>
                <p className="font-display font-bold text-4xl">{totalArticlesUsed}</p>
                <p className="font-body text-xs text-black/70 mt-1">articles utilises</p>
              </div>
            </div>

            {/* Profile & Subscription Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
              {/* Profile Card */}
              <div
                className="border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
                style={{ backgroundColor: '#FFFFFF' }}
              >
                <div className="px-5 py-3 border-b-3 border-black" style={{ backgroundColor: '#9ED8DB' }}>
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    <h2 className="font-display font-bold text-sm">MON PROFIL</h2>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-4 mb-4">
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt="" className="w-14 h-14 rounded-full border-2 border-black" />
                    ) : (
                      <div className="w-14 h-14 border-2 border-black flex items-center justify-center bg-gray-100">
                        <User className="w-7 h-7 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <p className="font-display font-bold text-lg">{user.fullName || 'Utilisateur'}</p>
                      <p className="font-body text-sm text-black/60 break-all">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="px-3 py-1 border-2 border-black font-display font-bold text-xs"
                      style={{ backgroundColor: subscription?.plan === 'free' ? '#E8DFD5' : subscription?.plan === 'pro' ? '#D64045' : '#1D3354', color: subscription?.plan === 'free' ? '#000' : '#FFF' }}
                    >
                      {subscription?.plan?.toUpperCase() || 'FREE'}
                    </span>
                    <span
                      className="px-2 py-0.5 border border-black text-[10px] font-display font-bold"
                      style={{ backgroundColor: subscription?.status === 'active' ? '#9ED8DB' : '#F8B4B4' }}
                    >
                      {subscription?.status === 'active' ? 'ACTIF' : subscription?.status?.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Subscription Card */}
              <div
                className="border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
                style={{ backgroundColor: '#FFFFFF' }}
              >
                <div className="px-5 py-3 border-b-3 border-black" style={{ backgroundColor: '#1D3354' }}>
                  <div className="flex items-center gap-2 text-white">
                    <CreditCard className="w-5 h-5" />
                    <h2 className="font-display font-bold text-sm">MON ABONNEMENT</h2>
                  </div>
                </div>
                <div className="p-5">
                  {/* Usage bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-display font-bold text-xs text-black/60">UTILISATION CE MOIS</span>
                      <span className="font-display font-bold text-sm">{thisMonthUsed} / {thisMonthLimit}</span>
                    </div>
                    <div className="h-4 border-2 border-black overflow-hidden" style={{ backgroundColor: '#E8DFD5' }}>
                      <div
                        className="h-full transition-all duration-500"
                        style={{
                          width: `${Math.min(100, (thisMonthUsed / thisMonthLimit) * 100)}%`,
                          backgroundColor: thisMonthUsed >= thisMonthLimit ? '#D64045' : '#1D3354'
                        }}
                      />
                    </div>
                  </div>

                  {/* Extra credits */}
                  {credits > 0 && (
                    <div className="flex items-center justify-between p-2 border-2 border-black mb-4" style={{ backgroundColor: '#9ED8DB' }}>
                      <span className="font-display font-bold text-xs">CREDITS BONUS</span>
                      <span className="font-display font-bold text-lg">+{credits}</span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => {
                        navigate('/')
                        setTimeout(() => {
                          const pricing = document.getElementById('pricing')
                          if (pricing) pricing.scrollIntoView({ behavior: 'smooth' })
                        }, 100)
                      }}
                      className="flex-1 px-3 py-2.5 border-2 border-black font-display font-bold text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all"
                      style={{ backgroundColor: '#D64045', color: '#FFF' }}
                    >
                      {subscription?.plan === 'free' ? 'PASSER PRO' : 'ACHETER CREDITS'}
                    </button>
                    {subscription?.plan && subscription.plan !== 'free' && (
                      <button
                        onClick={openCustomerPortal}
                        disabled={stripeLoading}
                        className="flex items-center justify-center gap-2 px-3 py-2.5 border-2 border-black font-display font-bold text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all disabled:opacity-50"
                        style={{ backgroundColor: '#FFFFFF' }}
                      >
                        {stripeLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Settings className="w-3 h-3" />}
                        GERER
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Last Activity */}
            {analytics?.last_generation_at && (
              <div
                className="border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] p-4 mb-6 flex items-center gap-3"
                style={{ backgroundColor: '#FFFFFF' }}
              >
                <Clock className="w-5 h-5 text-black/50" />
                <div>
                  <span className="font-display font-bold text-xs text-black/50">DERNIERE GENERATION: </span>
                  <span className="font-body text-sm">{formatDateTime(analytics.last_generation_at)}</span>
                </div>
              </div>
            )}

            {/* Danger Zone */}
            <div className="border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-5" style={{ backgroundColor: '#FFFFFF' }}>
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5" style={{ color: '#D64045' }} />
                <h2 className="font-display font-bold text-lg" style={{ color: '#D64045' }}>ZONE DANGER</h2>
              </div>

              <p className="font-body text-sm text-black/70 mb-4">
                La suppression de votre compte est irreversible. Toutes vos donnees seront definitivement effacees.
              </p>

              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-2 px-4 py-2 border-2 border-black font-display font-bold text-sm text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                style={{ backgroundColor: '#D64045' }}
              >
                <Trash2 className="w-4 h-4" />
                SUPPRIMER MON COMPTE
              </button>
            </div>
          </>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div
            className="border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
            style={{ backgroundColor: '#FFFFFF' }}
          >
            {/* Header */}
            <div className="px-5 py-4 border-b-3 border-black flex items-center justify-between" style={{ backgroundColor: '#1D3354' }}>
              <div className="flex items-center gap-3">
                <Video className="w-5 h-5 text-white" />
                <h2 className="font-display font-bold text-lg text-white">MES VIDEOS</h2>
              </div>
              <span
                className="px-2 py-1 border-2 border-black font-display font-bold text-xs"
                style={{ backgroundColor: '#9ED8DB' }}
              >
                {videos.length} video{videos.length > 1 ? 's' : ''}
              </span>
            </div>

            {/* Content */}
            <div className="p-5">
              {loadingData ? (
                <div className="text-center py-12">
                  <Loader2 className="w-10 h-10 mx-auto mb-3 animate-spin text-black/30" />
                  <p className="font-body text-sm text-black/50">Chargement...</p>
                </div>
              ) : videos.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 mx-auto mb-4 border-3 border-black flex items-center justify-center" style={{ backgroundColor: '#E8DFD5' }}>
                    <Video className="w-10 h-10 text-black/30" />
                  </div>
                  <p className="font-display font-bold text-lg mb-2">Aucune video</p>
                  <p className="font-body text-sm text-black/60 mb-6">Tu n'as pas encore genere de video</p>
                  <button
                    onClick={() => navigate('/')}
                    className="px-6 py-3 border-2 border-black font-display font-bold text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all"
                    style={{ backgroundColor: '#D64045', color: '#FFFFFF' }}
                  >
                    CREER MA PREMIERE VIDEO
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {videos.map((video) => (
                    <div
                      key={video.id}
                      className="border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] overflow-hidden hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                      style={{ backgroundColor: '#FFFFFF' }}
                    >
                      <div className="flex flex-col sm:flex-row">
                        {/* Thumbnail */}
                        <div className="sm:w-48 h-32 sm:h-auto border-b-2 sm:border-b-0 sm:border-r-2 border-black flex-shrink-0 relative overflow-hidden" style={{ backgroundColor: '#1D3354' }}>
                          {video.thumbnail_url ? (
                            <img
                              src={video.thumbnail_url}
                              alt={video.title || 'Video'}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full min-h-[100px] flex items-center justify-center">
                              <Video className="w-10 h-10 text-white/30" />
                            </div>
                          )}
                          {/* Play overlay */}
                          {video.video_url && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
                              <div className="w-12 h-12 border-2 border-white rounded-full flex items-center justify-center bg-white/20">
                                <Play className="w-6 h-6 text-white fill-white" />
                              </div>
                            </div>
                          )}
                          {/* Duration badge */}
                          {video.duration && (
                            <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 text-white text-xs font-display font-bold">
                              {formatDuration(video.duration)}
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 p-4">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-display font-bold text-base mb-1 truncate">
                                {video.title || 'Video sans titre'}
                              </h3>
                              <div className="flex flex-wrap items-center gap-3 text-xs text-black/60">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  <span className="font-body">{formatDate(video.created_at)}</span>
                                </div>
                                {video.articles_count && (
                                  <div className="flex items-center gap-1">
                                    <Image className="w-3 h-3" />
                                    <span className="font-body">{video.articles_count} articles</span>
                                  </div>
                                )}
                                {video.template && (
                                  <span
                                    className="px-2 py-0.5 border border-black font-display font-bold text-[10px]"
                                    style={{ backgroundColor: '#E8DFD5' }}
                                  >
                                    {video.template}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                              {video.video_url && (
                                <>
                                  <a
                                    href={video.video_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 px-3 py-2 border-2 border-black font-display font-bold text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all"
                                    style={{ backgroundColor: '#9ED8DB' }}
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                    VOIR
                                  </a>
                                  <a
                                    href={video.video_url}
                                    download
                                    className="flex items-center gap-1.5 px-3 py-2 border-2 border-black font-display font-bold text-xs text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all"
                                    style={{ backgroundColor: '#1D3354' }}
                                  >
                                    <Download className="w-3 h-3" />
                                    TELECHARGER
                                  </a>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowDeleteModal(false)} />
            <div
              className="relative border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6 max-w-md w-full"
              style={{ backgroundColor: '#FFFFFF' }}
            >
              <h3 className="font-display font-bold text-lg mb-4" style={{ color: '#D64045' }}>
                Confirmer la suppression
              </h3>
              <p className="font-body text-sm text-black/70 mb-4">
                Cette action est irreversible. Tapez <strong>SUPPRIMER</strong> pour confirmer.
              </p>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Tapez SUPPRIMER"
                className="w-full px-3 py-2 border-2 border-black font-body text-sm mb-4"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false)
                    setDeleteConfirmText('')
                  }}
                  className="flex-1 px-4 py-2 border-2 border-black font-display font-bold text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  style={{ backgroundColor: '#FFFFFF' }}
                >
                  ANNULER
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmText !== 'SUPPRIMER' || deleting}
                  className="flex-1 px-4 py-2 border-2 border-black font-display font-bold text-sm text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
                  style={{ backgroundColor: '#D64045' }}
                >
                  {deleting ? 'SUPPRESSION...' : 'CONFIRMER'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
