import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Video, BarChart3, CreditCard, Trash2, Download, Calendar, Zap, AlertTriangle, ArrowLeft, Crown } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
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

export function AccountPage() {
  const navigate = useNavigate()
  const { user, subscription, credits, signOut, loading } = useAuth()
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

  const remainingVideos = subscription
    ? Math.max(0, subscription.videosLimit - subscription.videosUsed) + credits
    : 0

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#E8DFD5' }}>
        <div className="w-12 h-12 border-4 border-black animate-spin" style={{ borderTopColor: '#1D3354' }} />
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4" style={{ backgroundColor: '#E8DFD5' }}>
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 mb-6 px-3 py-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-display font-bold text-xs">RETOUR</span>
        </button>

        {/* Header */}
        <div className="border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6 mb-6" style={{ backgroundColor: '#1D3354' }}>
          <div className="flex items-center gap-4">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt="" className="w-16 h-16 rounded-full border-3 border-black" />
            ) : (
              <div className="w-16 h-16 bg-white border-3 border-black flex items-center justify-center">
                <User className="w-8 h-8" />
              </div>
            )}
            <div className="flex-1">
              <h1 className="font-display font-bold text-xl text-white">{user.fullName || 'Utilisateur'}</h1>
              <p className="font-body text-sm text-white/70">{user.email}</p>
            </div>
            <div
              className="px-4 py-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              style={{ backgroundColor: subscription?.plan === 'free' ? '#FFFFFF' : '#D64045' }}
            >
              <div className="flex items-center gap-2">
                <Crown className={`w-4 h-4 ${subscription?.plan === 'free' ? 'text-black' : 'text-white'}`} />
                <span className={`font-display font-bold text-sm uppercase ${subscription?.plan === 'free' ? 'text-black' : 'text-white'}`}>
                  {subscription?.plan || 'Free'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] p-4" style={{ backgroundColor: '#FFFFFF' }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 border-2 border-black flex items-center justify-center" style={{ backgroundColor: '#9ED8DB' }}>
                <Zap className="w-4 h-4" />
              </div>
            </div>
            <p className="font-display font-bold text-2xl">{remainingVideos}</p>
            <p className="font-body text-xs text-black/60">Vidéos restantes</p>
          </div>

          <div className="border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] p-4" style={{ backgroundColor: '#FFFFFF' }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 border-2 border-black flex items-center justify-center" style={{ backgroundColor: '#1D3354' }}>
                <Video className="w-4 h-4 text-white" />
              </div>
            </div>
            <p className="font-display font-bold text-2xl">{analytics?.total_videos_generated || 0}</p>
            <p className="font-body text-xs text-black/60">Vidéos générées</p>
          </div>

          <div className="border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] p-4" style={{ backgroundColor: '#FFFFFF' }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 border-2 border-black flex items-center justify-center" style={{ backgroundColor: '#D64045' }}>
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
            </div>
            <p className="font-display font-bold text-2xl">{analytics?.total_articles_used || 0}</p>
            <p className="font-body text-xs text-black/60">Articles utilisés</p>
          </div>

          <div className="border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] p-4" style={{ backgroundColor: '#FFFFFF' }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 border-2 border-black flex items-center justify-center" style={{ backgroundColor: '#9ED8DB' }}>
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <p className="font-display font-bold text-sm">
              {analytics?.last_generation_at ? formatDate(analytics.last_generation_at) : '-'}
            </p>
            <p className="font-body text-xs text-black/60">Dernière vidéo</p>
          </div>
        </div>

        {/* Subscription Card */}
        <div className="border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-5 mb-6" style={{ backgroundColor: '#FFFFFF' }}>
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-5 h-5" />
            <h2 className="font-display font-bold text-lg">MON ABONNEMENT</h2>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-body text-sm text-black/70">Plan actuel</p>
              <p className="font-display font-bold text-xl uppercase" style={{ color: '#1D3354' }}>
                {subscription?.plan || 'Free'}
              </p>
            </div>
            <div>
              <p className="font-body text-sm text-black/70">Utilisation ce mois</p>
              <p className="font-display font-bold text-xl">
                {subscription?.videosUsed || 0} / {subscription?.videosLimit || 1}
              </p>
            </div>
            {subscription?.periodEnd && (
              <div>
                <p className="font-body text-sm text-black/70">Renouvellement</p>
                <p className="font-display font-bold text-xl">
                  {formatDate(subscription.periodEnd.toISOString())}
                </p>
              </div>
            )}
            <button
              onClick={() => {
                const pricing = document.getElementById('pricing')
                if (pricing) {
                  navigate('/')
                  setTimeout(() => pricing.scrollIntoView({ behavior: 'smooth' }), 100)
                }
              }}
              className="px-4 py-2 border-2 border-black font-display font-bold text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
              style={{ backgroundColor: '#D64045', color: '#FFFFFF' }}
            >
              CHANGER DE PLAN
            </button>
          </div>
        </div>

        {/* Videos History */}
        <div className="border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-5 mb-6" style={{ backgroundColor: '#FFFFFF' }}>
          <div className="flex items-center gap-2 mb-4">
            <Video className="w-5 h-5" />
            <h2 className="font-display font-bold text-lg">MES VIDÉOS</h2>
          </div>

          {loadingData ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-3 border-black animate-spin" style={{ borderTopColor: '#1D3354' }} />
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-8">
              <Video className="w-12 h-12 mx-auto mb-3 text-black/30" />
              <p className="font-body text-sm text-black/60">Aucune vidéo générée pour le moment</p>
              <button
                onClick={() => navigate('/')}
                className="mt-4 px-4 py-2 border-2 border-black font-display font-bold text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all"
                style={{ backgroundColor: '#1D3354', color: '#FFFFFF' }}
              >
                CRÉER MA PREMIÈRE VIDÉO
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {videos.map((video) => (
                <div
                  key={video.id}
                  className="border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
                >
                  <div className="aspect-video bg-black/10 flex items-center justify-center">
                    {video.thumbnail_url ? (
                      <img src={video.thumbnail_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <Video className="w-8 h-8 text-black/30" />
                    )}
                  </div>
                  <div className="p-3">
                    <p className="font-display font-bold text-xs truncate">{video.title || 'Vidéo sans titre'}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-body text-[10px] text-black/60">{formatDate(video.created_at)}</span>
                      {video.video_url && (
                        <a
                          href={video.video_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 border border-black hover:bg-black/5"
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

        {/* Danger Zone */}
        <div className="border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-5" style={{ backgroundColor: '#FFFFFF' }}>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5" style={{ color: '#D64045' }} />
            <h2 className="font-display font-bold text-lg" style={{ color: '#D64045' }}>ZONE DANGER</h2>
          </div>

          <p className="font-body text-sm text-black/70 mb-4">
            La suppression de votre compte est irréversible. Toutes vos données seront définitivement effacées.
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
                Cette action est irréversible. Tapez <strong>SUPPRIMER</strong> pour confirmer.
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
