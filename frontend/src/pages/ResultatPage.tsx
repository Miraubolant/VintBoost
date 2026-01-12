import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWardrobe } from '../context/WardrobeContext'
import { useVintedScraper } from '../hooks/useVintedScraper'
import { useVideoGeneration } from '../hooks/useVideoGeneration'
import type { VintedItem, VideoArticle } from '../types/vinted'
import { Video, Grid, Layers, ThumbsUp, MapPin, ArrowLeft, X, Sparkles, Download, RefreshCw } from 'lucide-react'
import { PhotoCarousel } from '../components/PhotoCarousel'
import { VideoConfigPanel } from '../components/VideoConfigPanel'

export function ResultatPage() {
  const navigate = useNavigate()
  const { wardrobeData, setWardrobeData, clearWardrobeData, pendingUrl, setPendingUrl } = useWardrobe()
  const { scrapeWardrobe, data: scrapedData, loading: scraping, error: scrapeError } = useVintedScraper()

  // Video generation states
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [orderedArticles, setOrderedArticles] = useState<VintedItem[]>([])
  const [showVideoPanel, setShowVideoPanel] = useState(false) // Hidden by default on mobile
  const [videoDuration, setVideoDuration] = useState<15 | 30 | 45 | 60>(30)
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('grid')
  const [musicTrack, setMusicTrack] = useState('')
  const [template, setTemplate] = useState('classic')
  const [customText, setCustomText] = useState('')

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
      hasWatermark: false,
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

  // Loading state
  if (scraping || (!wardrobeData && pendingUrl)) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#E8DFD5' }}>
        <div className="text-center">
          <div className="relative inline-block mb-6">
            <div
              className="w-20 h-20 border-4 border-black animate-spin"
              style={{ borderTopColor: '#1D3354' }}
            />
            <div
              className="absolute inset-3 border-4 border-black animate-spin"
              style={{ borderTopColor: '#9ED8DB', animationDirection: 'reverse', animationDuration: '0.8s' }}
            />
          </div>
          <p className="font-display font-bold text-black text-lg mb-2">Scraping en cours...</p>
          <p className="text-sm text-black/60 font-body">Récupération de ton vestiaire</p>
        </div>
      </div>
    )
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
      {/* Fixed Header - Compact on Mobile */}
      <div className="sticky top-12 sm:top-14 z-50 border-b-3 border-black" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-3">
          {/* Row 1: User Info - Mobile Optimized */}
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            {/* Back Button */}
            <button
              onClick={handleBack}
              className="w-9 h-9 sm:w-10 sm:h-10 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all flex-shrink-0"
              style={{ backgroundColor: '#FFFFFF' }}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            {/* Profile Picture */}
            {data.userInfo?.profilePicture ? (
              <div className="w-9 h-9 sm:w-10 sm:h-10 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex-shrink-0">
                <img
                  src={data.userInfo.profilePicture}
                  alt={data.username}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div
                className="w-9 h-9 sm:w-10 sm:h-10 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#9ED8DB' }}
              >
                <span className="font-display font-bold text-base text-black">
                  {(data.username || 'U')[0].toUpperCase()}
                </span>
              </div>
            )}

            {/* User Name + City */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm sm:text-base font-display font-bold text-black truncate">
                @{data.username || 'Utilisateur'}
              </h3>
              {data.userInfo?.city && (
                <p className="text-[10px] sm:text-xs text-black/50 flex items-center gap-0.5">
                  <MapPin className="w-3 h-3" />
                  {data.userInfo.city}
                </p>
              )}
            </div>

            {/* Desktop: Video Panel Toggle */}
            <button
              onClick={() => setShowVideoPanel(!showVideoPanel)}
              className="hidden lg:flex px-3 py-1.5 border-2 border-black font-display font-bold text-xs items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all"
              style={{ backgroundColor: showVideoPanel ? '#9ED8DB' : '#FFFFFF' }}
            >
              <Video className="w-4 h-4" />
              {showVideoPanel ? 'MASQUER' : 'VIDEO'}
            </button>
          </div>

          {/* Stats Row - Horizontal Scroll on Mobile */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-3 px-3 scrollbar-hide">
            <div className="text-center px-3 py-1.5 border-2 border-black flex-shrink-0" style={{ backgroundColor: '#FFFFFF' }}>
              <p className="text-base sm:text-lg font-display font-bold" style={{ color: '#1D3354' }}>
                {data.items.length}
              </p>
              <p className="text-[8px] sm:text-[9px] font-bold text-black/50 whitespace-nowrap">ARTICLES</p>
            </div>
            {data.userInfo && (
              <>
                <div className="text-center px-3 py-1.5 border-2 border-black flex-shrink-0" style={{ backgroundColor: '#FFFFFF' }}>
                  <p className="text-base sm:text-lg font-display font-bold" style={{ color: '#D64045' }}>
                    {data.userInfo.soldItemsCount}
                  </p>
                  <p className="text-[8px] sm:text-[9px] font-bold text-black/50 whitespace-nowrap">VENDUS</p>
                </div>
                <div className="text-center px-3 py-1.5 border-2 border-black flex-shrink-0" style={{ backgroundColor: '#FFFFFF' }}>
                  <p className="text-base sm:text-lg font-display font-bold" style={{ color: '#9ED8DB' }}>
                    {data.userInfo.followersCount}
                  </p>
                  <p className="text-[8px] sm:text-[9px] font-bold text-black/50 whitespace-nowrap">ABONNÉS</p>
                </div>
                {data.userInfo.feedbackCount > 0 && (
                  <div className="text-center px-3 py-1.5 border-2 border-black flex-shrink-0" style={{ backgroundColor: '#FFFFFF' }}>
                    <p className="text-base sm:text-lg font-display font-bold flex items-center justify-center gap-1" style={{ color: '#1D3354' }}>
                      {data.userInfo.positiveFeedbackCount}
                      <ThumbsUp className="w-3 h-3" />
                    </p>
                    <p className="text-[8px] sm:text-[9px] font-bold text-black/50 whitespace-nowrap">AVIS</p>
                  </div>
                )}
              </>
            )}
            <div className="text-center px-3 py-1.5 border-2 border-black flex-shrink-0" style={{ backgroundColor: '#1D3354' }}>
              <p className="text-base sm:text-lg font-display font-bold text-white">
                {data.items.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0).toFixed(0)}€
              </p>
              <p className="text-[8px] sm:text-[9px] font-bold text-white/70 whitespace-nowrap">VALEUR</p>
            </div>
          </div>

          {/* Row 3: Selection Controls */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-black/10">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-xl font-display font-bold" style={{ color: '#1D3354' }}>{selectedItems.size}</span>
                <span className="text-sm text-black/40 font-display">/10</span>
              </div>
              {viewMode === 'grid' && (
                <div className="flex gap-2">
                  <button
                    onClick={selectAll}
                    className="text-xs font-bold font-display px-2 py-1 border border-black/20 rounded active:bg-black/5"
                    style={{ color: '#1D3354' }}
                  >
                    TOUT
                  </button>
                  <button
                    onClick={deselectAll}
                    className="text-xs font-bold text-black/50 font-display px-2 py-1 border border-black/20 rounded active:bg-black/5"
                  >
                    AUCUN
                  </button>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              {/* View Toggle */}
              <div className="flex border-2 border-black">
                <button
                  onClick={() => setViewMode('carousel')}
                  className="w-9 h-9 flex items-center justify-center transition-colors"
                  style={{ backgroundColor: viewMode === 'carousel' ? '#9ED8DB' : '#FFFFFF' }}
                >
                  <Layers className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className="w-9 h-9 flex items-center justify-center border-l-2 border-black transition-colors"
                  style={{ backgroundColor: viewMode === 'grid' ? '#9ED8DB' : '#FFFFFF' }}
                >
                  <Grid className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4">
        <div className="flex gap-4 flex-col lg:flex-row">
          {/* Main Content - Articles Grid */}
          <div className="flex-1">
            {viewMode === 'carousel' ? (
              <PhotoCarousel
                items={data.items}
                selectedItems={selectedItems}
                onToggle={toggleItemSelection}
                maxSelection={10}
              />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
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
            )}
          </div>

          {/* Desktop Video Panel */}
          {showVideoPanel && (
            <div className="hidden lg:block w-80 xl:w-96 flex-shrink-0">
              <div className="border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] p-4 sticky top-40" style={{ backgroundColor: '#FFFFFF' }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-display font-bold text-black">CRÉER MA VIDÉO</h3>
                  <button
                    onClick={() => setShowVideoPanel(false)}
                    className="w-6 h-6 border-2 border-black flex items-center justify-center font-bold text-xs hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                    style={{ backgroundColor: '#D64045', color: '#FFFFFF' }}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>

                {/* Video Result */}
                {videoResult && (
                  <div className="mb-4">
                    <div className="border-2 border-black p-2 mb-3" style={{ backgroundColor: '#9ED8DB' }}>
                      <p className="font-bold text-black text-xs">VIDÉO GÉNÉRÉE !</p>
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
                        className="flex-1 px-3 py-2 border-2 border-black font-display font-bold text-xs text-white hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                        style={{ backgroundColor: '#D64045' }}
                      >
                        TÉLÉCHARGER
                      </button>
                      <button
                        onClick={resetVideo}
                        className="px-3 py-2 border-2 border-black font-display font-bold text-xs hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                        style={{ backgroundColor: '#FFFFFF' }}
                      >
                        NEW
                      </button>
                    </div>
                  </div>
                )}

                {/* Video Error */}
                {videoError && (
                  <div className="mb-4 border-2 border-black p-2" style={{ backgroundColor: '#D64045' }}>
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
                    onGenerate={handleGenerateVideo}
                    loading={videoLoading}
                  />
                )}
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
          <span>CRÉER LA VIDÉO ({selectedItems.size} articles)</span>
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
                    <h3 className="font-display font-bold text-lg">Créer ma vidéo</h3>
                    <p className="text-xs text-black/50">{selectedItems.size} articles sélectionnés</p>
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
                  <div className="border-2 border-black p-3 mb-4" style={{ backgroundColor: '#9ED8DB' }}>
                    <p className="font-display font-bold text-black text-sm flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      VIDÉO GÉNÉRÉE AVEC SUCCÈS !
                    </p>
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
                      TÉLÉCHARGER
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
                    {videoResult.duration}s • {videoResult.fileSize}
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

        {/* Selection indicator - Larger on mobile */}
        <div
          className="absolute top-1.5 right-1.5 w-7 h-7 sm:w-6 sm:h-6 border-2 border-black flex items-center justify-center font-bold text-xs transition-colors shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
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
