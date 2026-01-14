import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWardrobe } from '../context/WardrobeContext'
import { useAuth } from '../context/AuthContext'
import { useVintedScraper } from '../hooks/useVintedScraper'
import { useVideoGeneration } from '../hooks/useVideoGeneration'
import type { VintedItem, VideoArticle, VideoResolution, VideoAspectRatio, VideoTemplate } from '../types/vinted'
import { Video, X, AlertCircle, ArrowLeft, User } from 'lucide-react'

// Decomposed components
import { ScrapingLoaderModal } from '../components/ScrapingLoaderModal'
import { ArticleSelector, ARTICLE_LIMITS } from '../components/ArticleSelector'
import { VideoConfigForm, PLAN_FEATURES } from '../components/VideoConfigForm'
import { VideoPreviewSummary } from '../components/VideoPreviewSummary'
import { VideoResultDisplay } from '../components/VideoResultDisplay'
import { VideoConfigPanel } from '../components/VideoConfigPanel'
import { PricingModal } from '../components/PricingModal'

export function ResultatPage() {
  const navigate = useNavigate()
  const { wardrobeData, setWardrobeData, clearWardrobeData, pendingUrl, setPendingUrl } = useWardrobe()
  const { subscription, credits, consumeVideoCredit, refreshUserData } = useAuth()
  const { scrapeWardrobe, data: scrapedData, loading: scraping, error: scrapeError } = useVintedScraper()

  // Video generation states
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [orderedArticles, setOrderedArticles] = useState<VintedItem[]>([])
  const [musicTrack, setMusicTrack] = useState('')
  const [template, setTemplate] = useState<VideoTemplate>('classic')
  const [customText, setCustomText] = useState('')
  const [resolution, setResolution] = useState<VideoResolution>('1080p')
  const [aspectRatio, setAspectRatio] = useState<VideoAspectRatio>('9:16')
  const [includeProfilePicture, setIncludeProfilePicture] = useState(true) // Par défaut inclure la photo de profil

  // Mobile panel state
  const [showMobilePanel, setShowMobilePanel] = useState(false)

  // Pricing modal state
  const [showPricingModal, setShowPricingModal] = useState(false)

  // Get plan info
  const plan = subscription?.plan || 'free'
  const features = PLAN_FEATURES[plan]
  const articleLimit = ARTICLE_LIMITS[plan]

  // Watermark is forced for free plan
  const [hasWatermark, setHasWatermark] = useState(plan === 'free')

  // All plans default to 1080p
  useEffect(() => {
    setResolution('1080p')
  }, [plan])

  // Calculate remaining credits
  const subscriptionCreditsRemaining = Math.max(0, (subscription?.videosLimit || 0) - (subscription?.videosUsed || 0))
  const totalCreditsRemaining = subscriptionCreditsRemaining + credits

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
      } else if (newSet.size < articleLimit) {
        newSet.add(itemId)
      }
      return newSet
    })
  }

  const selectAll = () => {
    const items = (wardrobeData?.items || []).slice(0, articleLimit)
    setSelectedItems(new Set(items.map(item => item.id)))
  }

  const deselectAll = () => {
    setSelectedItems(new Set())
  }

  const selectedArticles = useMemo(() => {
    return orderedArticles
  }, [orderedArticles])

  // Toggle profile picture for intro
  const handleToggleProfilePicture = () => {
    setIncludeProfilePicture(prev => !prev)
  }

  // Get profile picture URL from userInfo
  const profilePictureUrl = wardrobeData?.userInfo?.profilePicture || null

  const handleGenerateVideo = async () => {
    if (selectedArticles.length === 0) return
    if (totalCreditsRemaining <= 0) return

    const articles: VideoArticle[] = selectedArticles.map(item => ({
      id: item.id,
      title: item.title,
      price: item.price,
      imageUrl: item.imageUrl,
      brand: item.brand,
    }))

    const result = await generate({
      articles,
      musicTrack: musicTrack,
      title: customText || (wardrobeData?.username ? `@${wardrobeData.username}` : ''),
      template: template,
      customText: customText,
      hasWatermark: hasWatermark,
      resolution: resolution,
      aspectRatio: aspectRatio,
      username: wardrobeData?.username || '',
      profileScreenshot: includeProfilePicture ? profilePictureUrl : null, // Envoie l'URL, pas le base64
    })

    // Consume credit only after successful video generation
    if (result?.success) {
      const consumed = await consumeVideoCredit(articles.length)
      if (consumed) {
        await refreshUserData()
      }
    }
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

  const handleReset = () => {
    resetVideo()
  }

  // Loading state
  if (scraping || (!wardrobeData && pendingUrl)) {
    return <ScrapingLoaderModal />
  }

  // Error state
  if (scrapeError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#E8DFD5' }}>
        <div className="max-w-md w-full">
          <div className="border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6" style={{ backgroundColor: '#D64045' }}>
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-6 h-6 text-white" />
              <p className="font-display font-bold text-white text-base">Erreur</p>
            </div>
            <p className="font-body text-white text-sm mb-4">{scrapeError}</p>
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

  return (
    <div className="min-h-screen pb-24 lg:pb-4" style={{ backgroundColor: '#E8DFD5' }}>
      {/* Page Title - Desktop only */}
      <div className="hidden lg:block text-center pt-8 pb-6">
        <h1
          className="inline-block font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white border-3 border-black px-6 py-3 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]"
          style={{ backgroundColor: '#1D3354' }}
        >
          CONFIGURE TA VIDEO !
        </h1>
        <p className="font-body text-sm sm:text-base text-black/70 mt-4 max-w-xl mx-auto">
          <span className="font-bold" style={{ color: '#1D3354' }}>1.</span> Selectionne tes articles{' '}
          <span className="font-bold" style={{ color: '#1D3354' }}>2.</span> Configure ta video{' '}
          <span className="font-bold" style={{ color: '#1D3354' }}>3.</span> Genere et telecharge !
        </p>
      </div>

      {/* Main Content - 2 Columns + Sticky Sidebar Desktop */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 lg:pt-0">
        <div className="hidden lg:flex lg:gap-4">
          {/* Left Column: Articles + Configuration */}
          <div className="flex-1 min-w-0 space-y-4">
            {/* Articles Section with integrated header */}
            <div className="border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" style={{ backgroundColor: '#FFFFFF' }}>
              {/* Header with back button */}
              <div className="flex items-center gap-3 px-4 py-3 border-b-2 border-black" style={{ backgroundColor: '#1D3354' }}>
                <button
                  onClick={handleBack}
                  className="w-8 h-8 border-2 border-white/30 flex items-center justify-center transition-all hover:bg-white/10 flex-shrink-0"
                >
                  <ArrowLeft className="w-4 h-4 text-white" />
                </button>
                <h3 className="font-display font-bold text-white text-sm">SELECTION DES ARTICLES</h3>
              </div>
              <div className="p-4">
                <ArticleSelector
                  items={wardrobeData.items}
                  selectedItems={selectedItems}
                  onToggleItem={toggleItemSelection}
                  onSelectAll={selectAll}
                  onDeselectAll={deselectAll}
                  maxItems={articleLimit}
                  plan={plan}
                  onUpgradeClick={() => setShowPricingModal(true)}
                  profilePictureUrl={profilePictureUrl || undefined}
                  includeProfilePicture={includeProfilePicture}
                  onToggleProfilePicture={handleToggleProfilePicture}
                  username={wardrobeData.username}
                />
              </div>
            </div>

            {/* Configuration Section */}
            <div className="border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" style={{ backgroundColor: '#FFFFFF' }}>
              <div className="px-4 py-3 border-b-2 border-black" style={{ backgroundColor: '#1D3354' }}>
                <h3 className="font-display font-bold text-white text-sm">CONFIGURATION VIDEO</h3>
              </div>
              <div className="p-4">
                {videoResult ? (
                  <VideoResultDisplay
                    result={videoResult}
                    onDownload={() => downloadVideo(videoResult.videoId)}
                    onReset={handleReset}
                  />
                ) : (
                  <VideoConfigForm
                    musicTrack={musicTrack}
                    onMusicChange={setMusicTrack}
                    template={template}
                    onTemplateChange={setTemplate}
                    customText={customText}
                    onCustomTextChange={setCustomText}
                    hasWatermark={hasWatermark}
                    onWatermarkChange={setHasWatermark}
                    resolution={resolution}
                    onResolutionChange={setResolution}
                    aspectRatio={aspectRatio}
                    onAspectRatioChange={setAspectRatio}
                    plan={plan}
                    username={wardrobeData.username}
                    onUpgradeClick={() => setShowPricingModal(true)}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar: Preview & Generate (Sticky) */}
          <div className="w-80 flex-shrink-0">
            <div className="sticky top-8">
              <div className="border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" style={{ backgroundColor: '#FFFFFF' }}>
                <VideoPreviewSummary
                  selectedArticles={selectedArticles}
                  musicTrack={musicTrack}
                  template={template}
                  customText={customText}
                  hasWatermark={hasWatermark}
                  creditsRemaining={totalCreditsRemaining}
                  onGenerate={handleGenerateVideo}
                  loading={videoLoading}
                  plan={plan}
                  userInfo={wardrobeData.userInfo}
                  username={wardrobeData.username}
                  totalItems={wardrobeData.items.length}
                  onUpgradeClick={() => setShowPricingModal(true)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden">
          {/* Mobile Header with back button */}
          <div className="flex items-center gap-3 mb-4 px-1">
            <button
              onClick={handleBack}
              className="w-10 h-10 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all flex-shrink-0"
              style={{ backgroundColor: '#FFFFFF' }}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <h2 className="font-display font-bold text-base" style={{ color: '#1D3354' }}>
                Selection des articles
              </h2>
              <p className="text-xs text-black/50 font-body">
                {selectedItems.size}/{articleLimit} selectionnes
              </p>
            </div>
          </div>

          {/* Mobile Articles Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {/* Profile Picture Card - First position */}
            {profilePictureUrl && (
              <MobileProfilePictureCard
                imageUrl={profilePictureUrl}
                username={wardrobeData.username}
                isSelected={includeProfilePicture}
                onToggle={handleToggleProfilePicture}
              />
            )}

            {wardrobeData.items.map((item) => (
              <MobileArticleCard
                key={item.id}
                item={item}
                isSelected={selectedItems.has(item.id)}
                onToggle={() => toggleItemSelection(item.id)}
                isDisabled={!selectedItems.has(item.id) && selectedItems.size >= articleLimit}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Floating Action Button */}
      <div className="lg:hidden fixed bottom-4 left-4 right-4 z-50">
        <button
          onClick={() => setShowMobilePanel(true)}
          disabled={selectedItems.size === 0}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-display font-bold text-base text-white active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50"
          style={{ backgroundColor: selectedItems.size > 0 ? '#D64045' : '#888' }}
        >
          <Video className="w-6 h-6" />
          <span>CONFIGURER ({selectedItems.size}/{articleLimit})</span>
        </button>
      </div>

      {/* Mobile Bottom Sheet */}
      {showMobilePanel && (
        <MobileConfigPanel
          selectedArticles={selectedArticles}
          onArticlesReorder={handleArticlesReorder}
          onRemoveArticle={handleRemoveArticle}
          musicTrack={musicTrack}
          onMusicChange={setMusicTrack}
          template={template}
          onTemplateChange={setTemplate}
          customText={customText}
          onCustomTextChange={setCustomText}
          hasWatermark={hasWatermark}
          onWatermarkChange={setHasWatermark}
          canRemoveWatermark={features.canRemoveWatermark}
          onGenerate={handleGenerateVideo}
          loading={videoLoading}
          videoResult={videoResult}
          videoError={videoError}
          onDownload={() => videoResult && downloadVideo(videoResult.videoId)}
          onReset={handleReset}
          onClose={() => setShowMobilePanel(false)}
        />
      )}

      {/* Video Error Toast */}
      {videoError && (
        <div className="fixed bottom-20 left-4 right-4 lg:bottom-4 lg:left-auto lg:right-4 lg:w-96 z-50">
          <div className="border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" style={{ backgroundColor: '#D64045' }}>
            <p className="font-bold text-white text-sm">{videoError}</p>
          </div>
        </div>
      )}

      {/* Pricing Modal */}
      <PricingModal
        isOpen={showPricingModal}
        onClose={() => setShowPricingModal(false)}
      />
    </div>
  )
}

// Mobile Article Card Component
function MobileArticleCard({
  item,
  isSelected,
  onToggle,
  isDisabled,
}: {
  item: VintedItem
  isSelected: boolean
  onToggle: () => void
  isDisabled: boolean
}) {
  return (
    <div
      className={`
        border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] overflow-hidden
        transition-all cursor-pointer
        active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]
        ${isSelected ? 'ring-2 ring-offset-1 ring-[#1D3354]' : ''}
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      style={{ backgroundColor: '#FFFFFF' }}
      onClick={() => !isDisabled && onToggle()}
    >
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
          className="absolute top-1.5 right-1.5 w-6 h-6 border-2 border-black flex items-center justify-center font-bold text-xs shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
          style={{ backgroundColor: isSelected ? '#9ED8DB' : '#FFFFFF' }}
        >
          {isSelected ? '✓' : '+'}
        </div>

        {/* Price */}
        <div className="absolute bottom-1.5 left-1.5 border-2 border-black px-2 py-0.5" style={{ backgroundColor: '#1D3354' }}>
          <span className="font-bold text-white text-xs">{item.price}€</span>
        </div>

        {isSelected && (
          <div className="absolute inset-0 bg-[#1D3354]/10 pointer-events-none" />
        )}
      </div>

      <div className="p-2 border-t-2 border-black">
        <h4 className="font-display font-bold text-black truncate text-xs">{item.title}</h4>
        {item.brand && (
          <p className="text-[10px] font-bold truncate" style={{ color: '#1D3354' }}>{item.brand}</p>
        )}
      </div>
    </div>
  )
}

// Mobile Profile Picture Card Component
function MobileProfilePictureCard({
  imageUrl,
  username,
  isSelected,
  onToggle,
}: {
  imageUrl: string
  username?: string
  isSelected: boolean
  onToggle: () => void
}) {
  return (
    <div
      className={`
        border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] overflow-hidden
        transition-all cursor-pointer
        active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]
        ${isSelected ? 'ring-2 ring-offset-1 ring-[#1D3354]' : ''}
      `}
      style={{ backgroundColor: '#9ED8DB' }}
      onClick={onToggle}
    >
      <div className="aspect-square relative overflow-hidden" style={{ backgroundColor: '#9ED8DB' }}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Photo de profil"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <User className="w-10 h-10 text-black/30" />
          </div>
        )}

        {/* Selection indicator */}
        <div
          className="absolute top-1.5 right-1.5 w-6 h-6 border-2 border-black flex items-center justify-center font-bold text-xs shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
          style={{ backgroundColor: isSelected ? '#9ED8DB' : '#FFFFFF' }}
        >
          {isSelected ? '✓' : '+'}
        </div>

        {/* Intro badge */}
        <div className="absolute bottom-1.5 left-1.5 border-2 border-black px-2 py-0.5" style={{ backgroundColor: '#1D3354' }}>
          <span className="font-bold text-white text-[10px]">INTRO</span>
        </div>

        {isSelected && (
          <div className="absolute inset-0 bg-[#1D3354]/10 pointer-events-none" />
        )}
      </div>

      <div className="p-2 border-t-2 border-black" style={{ backgroundColor: '#FFFFFF' }}>
        <h4 className="font-display font-bold text-black truncate text-xs">Photo de profil</h4>
        {username && (
          <p className="text-[10px] font-bold truncate" style={{ color: '#1D3354' }}>@{username}</p>
        )}
      </div>
    </div>
  )
}

// Mobile Config Panel Component
function MobileConfigPanel({
  selectedArticles,
  onArticlesReorder,
  onRemoveArticle,
  musicTrack,
  onMusicChange,
  template,
  onTemplateChange,
  customText,
  onCustomTextChange,
  hasWatermark,
  onWatermarkChange,
  canRemoveWatermark,
  onGenerate,
  loading,
  videoResult,
  videoError,
  onDownload,
  onReset,
  onClose,
}: {
  selectedArticles: VintedItem[]
  onArticlesReorder: (articles: VintedItem[]) => void
  onRemoveArticle: (id: string) => void
  musicTrack: string
  onMusicChange: (t: string) => void
  template: VideoTemplate
  onTemplateChange: (t: VideoTemplate) => void
  customText: string
  onCustomTextChange: (t: string) => void
  hasWatermark: boolean
  onWatermarkChange: (w: boolean) => void
  canRemoveWatermark: boolean
  onGenerate: () => void
  loading: boolean
  videoResult: any
  videoError: string | null
  onDownload: () => void
  onReset: () => void
  onClose: () => void
}) {
  return (
    <div className="lg:hidden fixed inset-0 z-[9999]">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div
        className="absolute bottom-0 left-0 right-0 bg-white border-t-4 border-black rounded-t-3xl animate-slide-up"
        style={{ maxHeight: '90vh' }}
      >
        {/* Handle */}
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
                <p className="text-xs text-black/50">{selectedArticles.length} articles</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              style={{ backgroundColor: '#9ED8DB' }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-5 py-4 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 100px)' }}>
          {videoResult ? (
            <VideoResultDisplay
              result={videoResult}
              onDownload={onDownload}
              onReset={onReset}
              isMobile
            />
          ) : (
            <VideoConfigPanel
              selectedArticles={selectedArticles}
              onArticlesReorder={onArticlesReorder}
              onRemoveArticle={onRemoveArticle}
              musicTrack={musicTrack}
              onMusicChange={onMusicChange}
              template={template}
              onTemplateChange={onTemplateChange}
              customText={customText}
              onCustomTextChange={onCustomTextChange}
              hasWatermark={hasWatermark}
              onWatermarkChange={onWatermarkChange}
              canRemoveWatermark={canRemoveWatermark}
              onGenerate={onGenerate}
              loading={loading}
              isMobile
            />
          )}

          {videoError && (
            <div className="mt-4 border-2 border-black p-3" style={{ backgroundColor: '#D64045' }}>
              <p className="font-bold text-white text-sm">{videoError}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
