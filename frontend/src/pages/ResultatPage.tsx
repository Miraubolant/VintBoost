import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWardrobe } from '../context/WardrobeContext'
import { useAuth } from '../context/AuthContext'
import { useVintedScraper } from '../hooks/useVintedScraper'
import { useVideoGeneration } from '../hooks/useVideoGeneration'
import type { VintedItem, VideoArticle } from '../types/vinted'
import { Video, ThumbsUp, MapPin, ArrowLeft, X, Sparkles, Download, RefreshCw, Loader2 } from 'lucide-react'
import { VideoConfigPanel } from '../components/VideoConfigPanel'

export function ResultatPage() {
  const navigate = useNavigate()
  const { wardrobeData, setWardrobeData, clearWardrobeData, pendingUrl, setPendingUrl } = useWardrobe()
  const { subscription } = useAuth()
  const { scrapeWardrobe, data: scrapedData, loading: scraping, error: scrapeError } = useVintedScraper()

  // Video generation states
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [orderedArticles, setOrderedArticles] = useState<VintedItem[]>([])
  const [showVideoPanel, setShowVideoPanel] = useState(true) // Visible by default
  const [videoDuration, setVideoDuration] = useState<15 | 30 | 45 | 60>(30)
  const [musicTrack, setMusicTrack] = useState('')
  const [template, setTemplate] = useState('classic')
  const [customText, setCustomText] = useState('')

  // Watermark is forced for free plan
  const canRemoveWatermark = subscription?.plan === 'pro' || subscription?.plan === 'business'
  const [hasWatermark, setHasWatermark] = useState(!canRemoveWatermark)

  const {
    generate,
    downloadVideo,
    loading: videoLoading,
    error: videoError,
    result: videoResult,
    reset: resetVideo,
  } = useVideoGeneration()

  // Start scraping when page loads with pending URL
  useEffect(() => {
    if (pendingUrl && !wardrobeData && !scraping) {
      scrapeWardrobe(pendingUrl)
    }
  }, [pendingUrl, wardrobeData, scraping, scrapeWardrobe])

  // Store scraped data in context
  useEffect(() => {
    if (scrapedData?.success) {
      setWardrobeData(scrapedData)
      setPendingUrl(null)
    }
  }, [scrapedData, setWardrobeData, setPendingUrl])

  // Redirect if no URL and no data
  useEffect(() => {
    if (!pendingUrl && !wardrobeData && !scraping) {
      navigate('/')
    }
  }, [pendingUrl, wardrobeData, scraping, navigate])

  // Sync orderedArticles with selectedItems
  useEffect(() => {
    if (wardrobeData?.items) {
      const selected = wardrobeData.items.filter(item => selectedItems.has(item.id))
      const existingIds = new Set(orderedArticles.map(a => a.id))
      const newItems = selected.filter(item => !existingIds.has(item.id))
      const keptItems = orderedArticles.filter(item => selectedItems.has(item.id))
      setOrderedArticles([...keptItems, ...newItems])
    }
  }, [selectedItems, wardrobeData?.items])

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(itemId)) {
        newSet.delete(itemId)
      } else if (newSet.size < 10) {
        newSet.add(itemId)
      }
      return newSet
    })
  }

  const selectAll = () => {
    const items = (wardrobeData?.items || []).slice(0, 10)
    setSelectedItems(new Set(items.map(item => item.id)))
  }

  const deselectAll = () => {
    setSelectedItems(new Set())
  }

  const selectedArticles = useMemo(() => {
    return orderedArticles
  }, [orderedArticles])

  const handleGenerateVideo = async () => {
    if (selectedArticles.length === 0) return

    const articles: VideoArticle[] = selectedArticles.map(item => ({
      id: item.id,
      title: item.title,
      price: item.price,
      imageUrl: item.imageUrl,
      brand: item.brand,
    }))

    await generate({
      articles,
      duration: videoDuration,
      musicTrack: musicTrack,
      title: customText || (wardrobeData?.username ? `@${wardrobeData.username}` : ''),
      template: template,
      hasWatermark: hasWatermark,
    })
  }

  const handleRemoveArticle = (id: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev)
      newSet.delete(id)
      return newSet
    })
  }

  const handleArticlesReorder = (articles: VintedItem[]) => {
    setOrderedArticles(articles)
  }

  const handleBack = () => {
    clearWardrobeData()
    navigate('/')
  }

  // Loading state - Modal style
  if (scraping || (!wardrobeData && pendingUrl)) {
    return <ScrapingLoaderModal />
  }

  // Error state
  if (scrapeError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#E8DFD5' }}>
        <div className="max-w-md w-full">
          <div className="border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6" style={{ backgroundColor: '#D64045' }}>
            <p className="font-display font-bold text-white text-base mb-4">{scrapeError}</p>
            <button
              onClick={handleBack}
              className="w-full px-4 py-3 border-2 border-black font-display font-bold text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
              style={{ backgroundColor: '#FFFFFF' }}
            >
              RETOUR
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!wardrobeData) {
    return null
  }

  const data = wardrobeData

  return (
    <div className="min-h-screen pb-24 lg:pb-4" style={{ backgroundColor: '#E8DFD5' }}>
      {/* Header - User Info (Not fixed on desktop) */}
      <div className="border-b-3 border-black" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          {/* Row 1: User Info */}
          <div className="flex items-center gap-3 mb-3">
            {/* Back Button */}
            <button
              onClick={handleBack}
              className="w-10 h-10 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all flex-shrink-0"
              style={{ backgroundColor: '#FFFFFF' }}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            {/* Profile Picture */}
            {data.userInfo?.profilePicture ? (
              <div className="w-12 h-12 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex-shrink-0">
                <img
                  src={data.userInfo.profilePicture}
                  alt={data.username}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div
                className="w-12 h-12 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#9ED8DB' }}
              >
                <span className="font-display font-bold text-lg text-black">
                  {(data.username || 'U')[0].toUpperCase()}
                </span>
              </div>
            )}

            {/* User Name + City */}
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-display font-bold text-black truncate">
                @{data.username || 'Utilisateur'}
              </h3>
              {data.userInfo?.city && (
                <p className="text-xs text-black/50 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {data.userInfo.city}
                </p>
              )}
            </div>

            {/* Desktop: Video Panel Toggle */}
            <button
              onClick={() => setShowVideoPanel(!showVideoPanel)}
              className="hidden lg:flex px-4 py-2 border-2 border-black font-display font-bold text-sm items-center gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all"
              style={{ backgroundColor: showVideoPanel ? '#9ED8DB' : '#FFFFFF' }}
            >
              <Video className="w-4 h-4" />
              {showVideoPanel ? 'MASQUER OPTIONS' : 'OPTIONS VIDEO'}
            </button>
          </div>

          {/* Stats Row - Horizontal */}
          <div className="flex gap-2 flex-wrap">
            <div className="text-center px-4 py-2 border-2 border-black" style={{ backgroundColor: '#FFFFFF' }}>
              <p className="text-lg font-display font-bold" style={{ color: '#1D3354' }}>
                {data.items.length}
              </p>
              <p className="text-[10px] font-bold text-black/50">ARTICLES</p>
            </div>
            {data.userInfo && (
              <>
                <div className="text-center px-4 py-2 border-2 border-black" style={{ backgroundColor: '#FFFFFF' }}>
                  <p className="text-lg font-display font-bold" style={{ color: '#D64045' }}>
                    {data.userInfo.soldItemsCount}
                  </p>
                  <p className="text-[10px] font-bold text-black/50">VENDUS</p>
                </div>
                <div className="text-center px-4 py-2 border-2 border-black" style={{ backgroundColor: '#FFFFFF' }}>
                  <p className="text-lg font-display font-bold" style={{ color: '#9ED8DB' }}>
                    {data.userInfo.followersCount}
                  </p>
                  <p className="text-[10px] font-bold text-black/50">ABONNES</p>
                </div>
                {data.userInfo.feedbackCount > 0 && (
                  <div className="text-center px-4 py-2 border-2 border-black" style={{ backgroundColor: '#FFFFFF' }}>
                    <p className="text-lg font-display font-bold flex items-center justify-center gap-1" style={{ color: '#1D3354' }}>
                      {data.userInfo.positiveFeedbackCount}
                      <ThumbsUp className="w-3 h-3" />
                    </p>
                    <p className="text-[10px] font-bold text-black/50">AVIS</p>
                  </div>
                )}
              </>
            )}
            <div className="text-center px-4 py-2 border-2 border-black" style={{ backgroundColor: '#1D3354' }}>
              <p className="text-lg font-display font-bold text-white">
                {data.items.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0).toFixed(0)}€
              </p>
              <p className="text-[10px] font-bold text-white/70">VALEUR</p>
            </div>
          </div>
        </div>
      </div>

      {/* Selection Controls - Sticky */}
      <div className="sticky top-12 sm:top-14 z-40 border-b-2 border-black" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-display font-bold" style={{ color: '#1D3354' }}>{selectedItems.size}</span>
                <span className="text-sm text-black/40 font-display">/10 selectionnes</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={selectAll}
                  className="text-xs font-bold font-display px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
                  style={{ backgroundColor: '#9ED8DB' }}
                >
                  TOUT
                </button>
                <button
                  onClick={deselectAll}
                  className="text-xs font-bold text-black/70 font-display px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
                  style={{ backgroundColor: '#FFFFFF' }}
                >
                  AUCUN
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4">
        <div className="flex gap-6 flex-col lg:flex-row">
          {/* Articles Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {data.items.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  isSelected={selectedItems.has(item.id)}
                  onToggle={() => toggleItemSelection(item.id)}
                  selectionDisabled={!selectedItems.has(item.id) && selectedItems.size >= 10}
                />
              ))}
            </div>
          </div>

          {/* Desktop Video Panel - Not fixed */}
          {showVideoPanel && (
            <div className="hidden lg:block w-80 xl:w-96 flex-shrink-0">
              <div className="border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden" style={{ backgroundColor: '#FFFFFF' }}>
                {/* Panel Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b-2 border-black" style={{ backgroundColor: '#1D3354' }}>
                  <div className="flex items-center gap-2">
                    <Video className="w-5 h-5 text-white" />
                    <h3 className="text-sm font-display font-bold text-white">CREER MA VIDEO</h3>
                  </div>
                  <button
                    onClick={() => setShowVideoPanel(false)}
                    className="w-7 h-7 border-2 border-black flex items-center justify-center font-bold text-xs hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                    style={{ backgroundColor: '#D64045', color: '#FFFFFF' }}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4">
                  {/* Video Result */}
                  {videoResult && (
                    <div className="mb-4">
                      <div className="border-2 border-black p-3 mb-3 flex items-center gap-2" style={{ backgroundColor: '#9ED8DB' }}>
                        <Sparkles className="w-4 h-4" />
                        <p className="font-bold text-black text-sm">VIDEO GENEREE !</p>
                      </div>
                      <video
                        src={videoResult.videoUrl}
                        controls
                        className="w-full border-2 border-black mb-3"
                        poster={videoResult.thumbnailUrl}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => downloadVideo(videoResult.videoId)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 border-2 border-black font-display font-bold text-xs text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all"
                          style={{ backgroundColor: '#D64045' }}
                        >
                          <Download className="w-4 h-4" />
                          TELECHARGER
                        </button>
                        <button
                          onClick={resetVideo}
                          className="px-3 py-2.5 border-2 border-black font-display font-bold text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all"
                          style={{ backgroundColor: '#FFFFFF' }}
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Video Error */}
                  {videoError && (
                    <div className="mb-4 border-2 border-black p-3" style={{ backgroundColor: '#D64045' }}>
                      <p className="font-bold text-white text-xs">{videoError}</p>
                    </div>
                  )}

                  {/* Video Config Panel */}
                  {!videoResult && (
                    <VideoConfigPanel
                      selectedArticles={selectedArticles}
                      onArticlesReorder={handleArticlesReorder}
                      onRemoveArticle={handleRemoveArticle}
                      videoDuration={videoDuration}
                      onDurationChange={setVideoDuration}
                      musicTrack={musicTrack}
                      onMusicChange={setMusicTrack}
                      template={template}
                      onTemplateChange={setTemplate}
                      customText={customText}
                      onCustomTextChange={setCustomText}
                      hasWatermark={hasWatermark}
                      onWatermarkChange={setHasWatermark}
                      canRemoveWatermark={canRemoveWatermark}
                      onGenerate={handleGenerateVideo}
                      loading={videoLoading}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Floating Action Button */}
      <div className="lg:hidden fixed bottom-4 left-4 right-4 z-50">
        <button
          onClick={() => setShowVideoPanel(true)}
          disabled={selectedItems.size === 0}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-display font-bold text-base text-white active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50"
          style={{ backgroundColor: selectedItems.size > 0 ? '#D64045' : '#888' }}
        >
          <Video className="w-6 h-6" />
          <span>CREER LA VIDEO ({selectedItems.size} articles)</span>
        </button>
      </div>

      {/* Mobile Video Panel - Bottom Sheet */}
      {showVideoPanel && (
        <div className="lg:hidden fixed inset-0 z-[9999]">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setShowVideoPanel(false)}
          />

          {/* Bottom Sheet */}
          <div
            className="absolute bottom-0 left-0 right-0 bg-white border-t-4 border-black rounded-t-3xl animate-slide-up"
            style={{ maxHeight: '90vh' }}
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>

            {/* Header */}
            <div className="px-5 pb-4 border-b-2 border-black/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 border-2 border-black flex items-center justify-center" style={{ backgroundColor: '#D64045' }}>
                    <Video className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg">Creer ma video</h3>
                    <p className="text-xs text-black/50">{selectedItems.size} articles selectionnes</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowVideoPanel(false)}
                  className="p-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                  style={{ backgroundColor: '#9ED8DB' }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="px-5 py-4 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 100px)' }}>
              {/* Video Result */}
              {videoResult && (
                <div className="mb-4">
                  <div className="border-2 border-black p-3 mb-4 flex items-center gap-2" style={{ backgroundColor: '#9ED8DB' }}>
                    <Sparkles className="w-4 h-4" />
                    <p className="font-display font-bold text-black text-sm">VIDEO GENEREE AVEC SUCCES !</p>
                  </div>
                  <video
                    src={videoResult.videoUrl}
                    controls
                    className="w-full border-2 border-black mb-4 rounded"
                    poster={videoResult.thumbnailUrl}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => downloadVideo(videoResult.videoId)}
                      className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-black font-display font-bold text-sm text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                      style={{ backgroundColor: '#D64045' }}
                    >
                      <Download className="w-5 h-5" />
                      TELECHARGER
                    </button>
                    <button
                      onClick={resetVideo}
                      className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-black font-display font-bold text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                      style={{ backgroundColor: '#FFFFFF' }}
                    >
                      <RefreshCw className="w-5 h-5" />
                      NOUVELLE
                    </button>
                  </div>
                  <p className="text-xs font-bold text-black/50 mt-3 text-center">
                    {videoResult.duration}s - {videoResult.fileSize}
                  </p>
                </div>
              )}

              {/* Video Error */}
              {videoError && (
                <div className="mb-4 border-2 border-black p-3" style={{ backgroundColor: '#D64045' }}>
                  <p className="font-bold text-white text-sm">{videoError}</p>
                </div>
              )}

              {/* Video Config Panel */}
              {!videoResult && (
                <VideoConfigPanel
                  selectedArticles={selectedArticles}
                  onArticlesReorder={handleArticlesReorder}
                  onRemoveArticle={handleRemoveArticle}
                  videoDuration={videoDuration}
                  onDurationChange={setVideoDuration}
                  musicTrack={musicTrack}
                  onMusicChange={setMusicTrack}
                  template={template}
                  onTemplateChange={setTemplate}
                  customText={customText}
                  onCustomTextChange={setCustomText}
                  hasWatermark={hasWatermark}
                  onWatermarkChange={setHasWatermark}
                  canRemoveWatermark={canRemoveWatermark}
                  onGenerate={handleGenerateVideo}
                  loading={videoLoading}
                  isMobile={true}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ItemCard({
  item,
  isSelected,
  onToggle,
  selectionDisabled
}: {
  item: VintedItem
  isSelected: boolean
  onToggle: () => void
  selectionDisabled: boolean
}) {
  return (
    <div
      className={`border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] overflow-hidden transition-all group cursor-pointer active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] ${
        isSelected ? 'ring-2 ring-offset-1 ring-[#1D3354]' : ''
      } ${selectionDisabled && !isSelected ? 'opacity-50' : ''}`}
      style={{
        backgroundColor: '#FFFFFF'
      }}
      onClick={onToggle}
    >
      {/* Image */}
      <div className="aspect-square relative overflow-hidden" style={{ backgroundColor: '#F5F5F5' }}>
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-black/30 font-bold text-xs">
            NO IMG
          </div>
        )}

        {/* Selection indicator */}
        <div
          className="absolute top-1.5 right-1.5 w-7 h-7 border-2 border-black flex items-center justify-center font-bold text-xs transition-colors shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
          style={{ backgroundColor: isSelected ? '#9ED8DB' : '#FFFFFF' }}
        >
          {isSelected ? '✓' : '+'}
        </div>

        {/* Price */}
        <div className="absolute bottom-1.5 left-1.5 border-2 border-black px-2 py-0.5" style={{ backgroundColor: '#1D3354' }}>
          <span className="font-bold text-white text-xs">{item.price}€</span>
        </div>

        {/* Selected overlay */}
        {isSelected && (
          <div className="absolute inset-0 bg-[#1D3354]/10 pointer-events-none" />
        )}
      </div>

      {/* Info */}
      <div className="p-2 border-t-2 border-black">
        <h4 className="font-display font-bold text-black truncate text-xs" title={item.title}>
          {item.title}
        </h4>
        {item.brand && (
          <p className="text-[10px] font-bold truncate" style={{ color: '#1D3354' }}>{item.brand}</p>
        )}
      </div>
    </div>
  )
}

// Simple Modal Loader
function ScrapingLoaderModal() {
  const [messageIndex, setMessageIndex] = useState(0)

  const messages = [
    'Connexion a Vinted...',
    'Recuperation du vestiaire...',
    'Analyse des articles...',
    'Chargement des images...',
    'Presque termine...',
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
      <div
        className="w-full max-w-sm border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6"
        style={{ backgroundColor: '#FFFFFF' }}
      >
        {/* Loader Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 border-3 border-black flex items-center justify-center" style={{ backgroundColor: '#1D3354' }}>
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        </div>

        {/* Title */}
        <h3 className="font-display font-bold text-lg text-center mb-2">CHARGEMENT</h3>

        {/* Message */}
        <p className="font-body text-sm text-center text-black/70 mb-4">
          {messages[messageIndex]}
        </p>

        {/* Progress dots */}
        <div className="flex justify-center gap-2">
          {messages.map((_, idx) => (
            <div
              key={idx}
              className="w-2.5 h-2.5 border border-black transition-colors"
              style={{ backgroundColor: idx <= messageIndex ? '#1D3354' : '#E8DFD5' }}
            />
          ))}
        </div>

        {/* Tip */}
        <p className="text-[10px] text-black/40 text-center mt-4 font-body">
          Les videos augmentent tes ventes jusqu'a +300%
        </p>
      </div>
    </div>
  )
}
