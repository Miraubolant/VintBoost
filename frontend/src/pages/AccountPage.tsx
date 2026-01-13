import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Video, BarChart3, CreditCard, Trash2, Download, TrendingUp, AlertTriangle, Image, Settings, Loader2 } from 'lucide-react'
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

    try {
      // Fetch videos
      const { data: videosData } = await supabase
        .from('user_videos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20)

      if (videosData) {
        setVideos(videosData)
      }

      // Fetch analytics
      const { data: analyticsData } = await supabase
        .from('user_analytics')
        .select('*')
        .eq('user_id', user.id)
        .single()

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

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#E8DFD5' }}>
        <div className="w-12 h-12 border-4 border-black animate-spin" style={{ borderTopColor: '#1D3354' }} />
      </div>
    )
  }

  // Calculate total credits (subscription + extra credits)
  const totalCredits = Math.max(0, (subscription?.videosLimit || 0) - (subscription?.videosUsed || 0)) + credits
  const totalGenerated = analytics?.total_videos_generated || 0
  const thisMonthGenerated = subscription?.videosUsed || 0

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
            HISTORIQUE DES VIDEOS
          </button>
        </div>

        {/* Statistics Tab */}
        {activeTab === 'statistics' && (
          <>
            {/* Stats Cards - 3 columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              {/* Profile Card */}
              <div
                className="border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-5"
                style={{ backgroundColor: '#9ED8DB' }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 border-2 border-black flex items-center justify-center bg-white">
                    <User className="w-5 h-5" />
                  </div>
                  <h2 className="font-display font-bold text-lg">PROFIL</h2>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="font-display font-bold text-xs text-black/60">EMAIL:</p>
                    <p className="font-body text-sm break-all">{user.email}</p>
                  </div>
                  <div>
                    <p className="font-display font-bold text-xs text-black/60">NOM:</p>
                    <p className="font-body text-sm">{user.fullName || 'Non renseigne'}</p>
                  </div>
                  <div>
                    <p className="font-display font-bold text-xs text-black/60">PLAN:</p>
                    <p className="font-display font-bold text-sm uppercase" style={{ color: '#1D3354' }}>
                      {subscription?.plan || 'Free'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Credits Card */}
              <div
                className="border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-5"
                style={{ backgroundColor: '#F8B4B4' }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 border-2 border-black flex items-center justify-center bg-white">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <h2 className="font-display font-bold text-lg">CREDITS DISPONIBLES</h2>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="font-display font-bold text-xs text-black/60">TOTAL:</p>
                    <p className="font-display font-bold text-4xl" style={{ color: '#D64045' }}>{totalCredits}</p>
                  </div>
                  <div>
                    <p className="font-display font-bold text-xs text-black/60">PLAN ACTIF:</p>
                    <p className="font-display font-bold text-2xl">{subscription?.plan === 'free' ? 'Gratuit' : subscription?.plan?.toUpperCase() || 'Gratuit'}</p>
                  </div>
                  <button
                    onClick={() => {
                      navigate('/')
                      setTimeout(() => {
                        const pricing = document.getElementById('pricing')
                        if (pricing) pricing.scrollIntoView({ behavior: 'smooth' })
                      }, 100)
                    }}
                    className="w-full px-3 py-2 border-2 border-black font-display font-bold text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all"
                    style={{ backgroundColor: '#FFFFFF' }}
                  >
                    ACHETER DES CREDITS
                  </button>
                </div>
              </div>

              {/* Generations Card */}
              <div
                className="border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-5"
                style={{ backgroundColor: '#1D3354' }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 border-2 border-black flex items-center justify-center bg-white">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <h2 className="font-display font-bold text-lg text-white">GENERATIONS</h2>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="font-display font-bold text-xs text-white/60">TOTAL:</p>
                    <p className="font-display font-bold text-4xl" style={{ color: '#9ED8DB' }}>{totalGenerated}</p>
                  </div>
                  <div>
                    <p className="font-display font-bold text-xs text-white/60">CE MOIS:</p>
                    <p className="font-display font-bold text-4xl" style={{ color: '#9ED8DB' }}>{thisMonthGenerated}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Subscription Section */}
            <div
              className="border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-5 mb-8"
              style={{ backgroundColor: '#FFFFFF' }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 border-2 border-black flex items-center justify-center" style={{ backgroundColor: '#9ED8DB' }}>
                  <CreditCard className="w-5 h-5" />
                </div>
                <h2 className="font-display font-bold text-lg">MON ABONNEMENT</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  className="border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] p-4"
                  style={{ backgroundColor: '#9ED8DB' }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-display font-bold text-sm">PLAN {subscription?.plan?.toUpperCase() || 'GRATUIT'}</span>
                    <span
                      className="px-2 py-0.5 border border-black text-[10px] font-display font-bold"
                      style={{ backgroundColor: '#FFFFFF' }}
                    >
                      ACTIF
                    </span>
                  </div>
                  <p className="font-display font-bold text-xs text-black/60">CREDITS RESTANTS:</p>
                  <p className="font-display font-bold text-3xl">{totalCredits}</p>
                  <p className="font-body text-xs text-black/60 mt-2">
                    {subscription?.videosUsed || 0} / {subscription?.videosLimit || 1} utilises ce mois
                  </p>
                </div>

                {/* Manage Subscription Button - Only for paid plans */}
                {subscription?.plan && subscription.plan !== 'free' && (
                  <div className="flex items-end">
                    <button
                      onClick={openCustomerPortal}
                      disabled={stripeLoading}
                      className="flex items-center gap-2 px-4 py-2.5 border-2 border-black font-display font-bold text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50"
                      style={{ backgroundColor: '#1D3354', color: '#FFFFFF' }}
                    >
                      {stripeLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Settings className="w-4 h-4" />
                      )}
                      GERER MON ABONNEMENT
                    </button>
                  </div>
                )}
              </div>
            </div>

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
            className="border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-5"
            style={{ backgroundColor: '#FFFFFF' }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 border-2 border-black flex items-center justify-center" style={{ backgroundColor: '#9ED8DB' }}>
                <Video className="w-5 h-5" />
              </div>
              <h2 className="font-display font-bold text-lg">MES VIDEOS</h2>
            </div>

            {loadingData ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-10 h-10 border-3 border-black animate-spin" style={{ borderTopColor: '#1D3354' }} />
              </div>
            ) : videos.length === 0 ? (
              <div className="text-center py-12">
                <Video className="w-16 h-16 mx-auto mb-4 text-black/20" />
                <p className="font-body text-sm text-black/60 mb-4">Aucune video generee pour le moment</p>
                <button
                  onClick={() => navigate('/')}
                  className="px-5 py-2.5 border-2 border-black font-display font-bold text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all"
                  style={{ backgroundColor: '#1D3354', color: '#FFFFFF' }}
                >
                  CREER MA PREMIERE VIDEO
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {videos.map((video) => (
                  <div
                    key={video.id}
                    className="border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] overflow-hidden hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all"
                    style={{ backgroundColor: '#9ED8DB' }}
                  >
                    <div className="aspect-video bg-black/10 flex items-center justify-center border-b-2 border-black">
                      {video.thumbnail_url ? (
                        <img src={video.thumbnail_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Video className="w-10 h-10 text-black/30" />
                      )}
                    </div>
                    <div className="p-3">
                      <p className="font-display font-bold text-xs truncate mb-1">{video.title || 'Video sans titre'}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-body text-[10px] text-black/60">{formatDate(video.created_at)}</span>
                        {video.video_url && (
                          <a
                            href={video.video_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 border-2 border-black bg-white hover:bg-black/5 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                          >
                            <Download className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
