import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWardrobe } from '../context/WardrobeContext'
import { useAuth } from '../context/AuthContext'
import { useVintedScraper } from '../hooks/useVintedScraper'
import { useVideoGeneration } from '../hooks/useVideoGeneration'
import type { VintedItem, VideoArticle, VideoResolution, VideoAspectRatio, VideoTemplate } from '../types/vinted'
import { Video, X, AlertCircle, ArrowLeft, Smartphone, Check, Plus, ZoomIn } from 'lucide-react'

// Decomposed components
import { ScrapingLoaderModal } from '../components/ScrapingLoaderModal'
import { ArticleSelector, ARTICLE_LIMITS } from '../components/ArticleSelector'
import { VideoConfigForm, PLAN_FEATURES } from '../components/VideoConfigForm'
import { VideoPreviewSummary } from '../components/VideoPreviewSummary'
import { VideoResultDisplay } from '../components/VideoResultDisplay'
import { VideoConfigPanel } from '../components/VideoConfigPanel'
import { PricingModal } from '../components/PricingModal'
import { VideoSuccessModal } from '../components/VideoSuccessModal'

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
  const [includeProfileScreenshot, setIncludeProfileScreenshot] = useState(true)

  // Mobile panel state
  const [showMobilePanel, setShowMobilePanel] = useState(false)

  // Pricing modal state
  const [showPricingModal, setShowPricingModal] = useState(false)

  // Screenshot preview modal state
  const [showScreenshotModal, setShowScreenshotModal] = useState(false)

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

  // Toggle profile screenshot for intro
  const handleToggleProfileScreenshot = () => {
    setIncludeProfileScreenshot(prev => !prev)
  }

  // Get profile screenshot URL and ID from wardrobeData
  const profileScreenshotId = wardrobeData?.profileScreenshotId || null
  const profileScreenshotUrl = wardrobeData?.profileScreenshotUrl || null

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
      profileScreenshotId: includeProfileScreenshot ? profileScreenshotId : null,
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

  // Loading state - centered for mobile
  if (scraping || (!wardrobeData && pendingUrl)) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#E8DFD5' }}>
        <ScrapingLoaderModal />
      </div>
    )
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
      {/* Page Title & Tutorial - Desktop */}
      <div className="hidden lg:block text-center pt-8 pb-6">
        <h1
          className="inline-block font-display font-bold text-3xl lg:text-4xl text-white border-3 border-black px-6 py-3 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] mb-4"
          style={{ backgroundColor: '#1D3354' }}
        >
          CRÉE TA VIDÉO VINTED
        </h1>
        <p className="font-body text-sm text-black/70 max-w-2xl mx-auto mt-4 leading-relaxed">
          <span className="font-bold" style={{ color: '#1D3354' }}>1.</span> Sélectionne tes articles &nbsp;→&nbsp;
          <span className="font-bold" style={{ color: '#1D3354' }}>2.</span> Configure ta vidéo &nbsp;→&nbsp;
          <span className="font-bold" style={{ color: '#1D3354' }}>3.</span> Génère et télécharge !
        </p>
      </div>

      {/* Main Content - 2 Columns + Sticky Sidebar Desktop */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 lg:pt-0">
        <div className="hidden lg:flex lg:gap-4">
          {/* Left Column: Articles + Configuration */}
          <div className="flex-1 min-w-0 space-y-3">
            {/* Articles Section with integrated header */}
            <div className="border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" style={{ backgroundColor: '#FFFFFF' }}>
              {/* Header with back button */}
              <div className="flex items-center gap-3 px-3 py-2 border-b-2 border-black" style={{ backgroundColor: '#1D3354' }}>
                <button
                  onClick={handleBack}
                  className="w-7 h-7 border-2 border-white/30 flex items-center justify-center transition-all hover:bg-white/10 flex-shrink-0"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-white" />
                </button>
                <h3 className="font-display font-bold text-white text-xs">SÉLECTION DES ARTICLES</h3>
              </div>
              <div className="p-3">
                <ArticleSelector
                  items={wardrobeData.items}
                  selectedItems={selectedItems}
                  onToggleItem={toggleItemSelection}
                  onSelectAll={selectAll}
                  onDeselectAll={deselectAll}
                  maxItems={articleLimit}
                  plan={plan}
                  onUpgradeClick={() => setShowPricingModal(true)}
                />
              </div>
            </div>

            {/* Configuration Section - Compact 2-column layout */}
            <div className="border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" style={{ backgroundColor: '#FFFFFF' }}>
              <div className="px-3 py-2 border-b-2 border-black" style={{ backgroundColor: '#1D3354' }}>
                <h3 className="font-display font-bold text-white text-xs">CONFIGURATION VIDÉO</h3>
              </div>
              <div className="p-3">
                <div className="space-y-3">
                  {/* Intro Video Section - Integrated */}
                  {profileScreenshotUrl && (
                    <DesktopIntroSection
                      screenshotUrl={profileScreenshotUrl}
                      username={wardrobeData.username}
                      isIncluded={includeProfileScreenshot}
                      onToggle={handleToggleProfileScreenshot}
                      onPreview={() => setShowScreenshotModal(true)}
                    />
                  )}

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
                    compact
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Preview & Generate (Sticky) */}
          <div className="w-72 flex-shrink-0">
            <div className="sticky top-4">
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
          {/* Mobile Title & Tutorial */}
          <div className="text-center mb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <button
                onClick={handleBack}
                className="w-8 h-8 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
                style={{ backgroundColor: '#FFFFFF' }}
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h1
                className="font-display font-bold text-lg text-white border-2 border-black px-4 py-1.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                style={{ backgroundColor: '#1D3354' }}
              >
                CRÉE TA VIDÉO
              </h1>
            </div>
            <div className="flex items-center justify-center gap-1 text-[10px] text-black/60 font-body">
              <span className="px-1.5 py-0.5 border border-black/20 bg-white/50 font-bold">1. Sélectionne</span>
              <span>→</span>
              <span className="px-1.5 py-0.5 border border-black/20 bg-white/50 font-bold">2. Configure</span>
              <span>→</span>
              <span className="px-1.5 py-0.5 border border-black/20 bg-white/50 font-bold">3. Génère</span>
            </div>
          </div>

          {/* Mobile Selection Header */}
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="font-display font-bold text-sm" style={{ color: '#1D3354' }}>
              SÉLECTION ({selectedItems.size}/{articleLimit})
            </h2>
            <p className="text-xs text-black/50 font-body">
              Choisis tes articles
            </p>
          </div>

          {/* Mobile Articles Grid - WITH Screenshot Preview */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {/* Mobile Profile Screenshot Card - First position */}
            {profileScreenshotUrl && (
              <MobileProfileScreenshotCard
                screenshotUrl={profileScreenshotUrl}
                username={wardrobeData.username}
                isIncluded={includeProfileScreenshot}
                onToggle={handleToggleProfileScreenshot}
                onPreview={() => setShowScreenshotModal(true)}
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
          availableTemplates={features.templates}
          onGenerate={handleGenerateVideo}
          loading={videoLoading}
          videoResult={videoResult}
          videoError={videoError}
          onDownload={() => videoResult && downloadVideo(videoResult.videoId)}
          onReset={handleReset}
          onClose={() => setShowMobilePanel(false)}
          profileScreenshotUrl={profileScreenshotUrl}
          includeProfileScreenshot={includeProfileScreenshot}
          onToggleProfileScreenshot={handleToggleProfileScreenshot}
          username={wardrobeData.username}
        />
      )}

      {/* Screenshot Preview Modal */}
      {showScreenshotModal && profileScreenshotUrl && (
        <ScreenshotPreviewModal
          screenshotUrl={profileScreenshotUrl}
          onClose={() => setShowScreenshotModal(false)}
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

      {/* Video Success Modal */}
      {videoResult && (
        <VideoSuccessModal
          result={videoResult}
          onDownload={() => downloadVideo(videoResult.videoId)}
          onReset={handleReset}
          onClose={resetVideo}
        />
      )}
    </div>
  )
}

// Desktop Intro Section - Compact horizontal layout
function DesktopIntroSection({
  screenshotUrl,
  username,
  isIncluded,
  onToggle,
  onPreview,
}: {
  screenshotUrl: string
  username?: string
  isIncluded: boolean
  onToggle: () => void
  onPreview: () => void
}) {
  const API_URL = import.meta.env.VITE_SCRAPER_API_URL || 'http://localhost:3000'
  const fullUrl = screenshotUrl.startsWith('http') ? screenshotUrl : `${API_URL}${screenshotUrl}`

  return (
    <div
      className="flex items-center gap-3 p-2 border-2 border-black"
      style={{ backgroundColor: isIncluded ? '#9ED8DB20' : '#F5F5F5' }}
    >
      {/* Screenshot thumbnail */}
      <div
        className={`
          w-10 h-16 border-2 border-black overflow-hidden flex-shrink-0 cursor-pointer relative group
          ${!isIncluded ? 'opacity-50 grayscale' : ''}
        `}
        style={{ backgroundColor: '#000' }}
        onClick={onPreview}
      >
        <img
          src={fullUrl}
          alt="Screenshot profil"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <ZoomIn className="w-4 h-4 text-white" />
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Smartphone className="w-3.5 h-3.5" style={{ color: '#1D3354' }} />
          <span className="font-display font-bold text-xs">INTRO VIDÉO</span>
          {username && (
            <span className="text-[10px] text-black/50">@{username}</span>
          )}
        </div>
        <p className="text-[10px] text-black/50 mt-0.5">
          {isIncluded ? 'Sera affiche en debut de video' : 'Non inclus dans la video'}
        </p>
      </div>

      {/* Toggle */}
      <button
        onClick={onToggle}
        className={`
          px-2 py-1 border-2 border-black text-[10px] font-bold font-display
          shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
          active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]
          transition-all
        `}
        style={{ backgroundColor: isIncluded ? '#9ED8DB' : '#FFFFFF' }}
      >
        {isIncluded ? 'INCLUS' : 'EXCLURE'}
      </button>
    </div>
  )
}

// Screenshot Preview Modal
function ScreenshotPreviewModal({
  screenshotUrl,
  onClose,
}: {
  screenshotUrl: string
  onClose: () => void
}) {
  const API_URL = import.meta.env.VITE_SCRAPER_API_URL || 'http://localhost:3000'
  const fullUrl = screenshotUrl.startsWith('http') ? screenshotUrl : `${API_URL}${screenshotUrl}`

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
      onClick={onClose}
    >
      <div
        className="relative max-w-sm w-full max-h-[90vh] border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 w-8 h-8 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] z-10"
          style={{ backgroundColor: '#D64045' }}
        >
          <X className="w-4 h-4 text-white" />
        </button>

        {/* Image */}
        <img
          src={fullUrl}
          alt="Screenshot profil Vinted"
          className="w-full h-auto object-contain"
          style={{ backgroundColor: '#000' }}
        />
      </div>
    </div>
  )
}

// Mobile Profile Screenshot Card
function MobileProfileScreenshotCard({
  screenshotUrl,
  username,
  isIncluded,
  onToggle,
  onPreview,
}: {
  screenshotUrl: string
  username?: string
  isIncluded: boolean
  onToggle: () => void
  onPreview: () => void
}) {
  const API_URL = import.meta.env.VITE_SCRAPER_API_URL || 'http://localhost:3000'
  const fullUrl = screenshotUrl.startsWith('http') ? screenshotUrl : `${API_URL}${screenshotUrl}`

  return (
    <div
      className={`
        border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] overflow-hidden
        transition-all
        ${isIncluded ? 'ring-2 ring-offset-1 ring-[#1D3354]' : ''}
      `}
      style={{ backgroundColor: '#1D3354' }}
    >
      <div
        className="aspect-[9/16] relative overflow-hidden cursor-pointer"
        style={{ backgroundColor: '#000' }}
        onClick={onPreview}
      >
        <img
          src={fullUrl}
          alt="Screenshot profil Vinted"
          className={`w-full h-full object-cover object-top ${!isIncluded ? 'opacity-50 grayscale' : ''}`}
          loading="lazy"
        />

        {/* Zoom icon overlay */}
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 active:opacity-100 transition-opacity">
          <ZoomIn className="w-8 h-8 text-white" />
        </div>

        {/* Selection indicator */}
        <div
          className="absolute top-1.5 right-1.5 w-6 h-6 border-2 border-black flex items-center justify-center font-bold text-xs shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
          style={{ backgroundColor: isIncluded ? '#9ED8DB' : '#FFFFFF' }}
          onClick={(e) => { e.stopPropagation(); onToggle(); }}
        >
          {isIncluded ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
        </div>

        {/* Intro badge */}
        <div className="absolute bottom-1.5 left-1.5 border-2 border-black px-2 py-0.5" style={{ backgroundColor: '#9ED8DB' }}>
          <span className="font-bold text-black text-[10px]">INTRO</span>
        </div>

        {isIncluded && (
          <div className="absolute inset-0 bg-[#9ED8DB]/20 pointer-events-none" />
        )}
      </div>

      <div className="p-2 border-t-2 border-black" style={{ backgroundColor: '#FFFFFF' }}>
        <h4 className="font-display font-bold text-black truncate text-xs">Apercu Profil</h4>
        {username && (
          <p className="text-[10px] font-bold truncate" style={{ color: '#1D3354' }}>@{username}</p>
        )}
      </div>
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
  availableTemplates,
  onGenerate,
  loading,
  videoResult,
  videoError,
  onDownload,
  onReset,
  onClose,
  profileScreenshotUrl,
  includeProfileScreenshot,
  onToggleProfileScreenshot,
  username,
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
  availableTemplates: readonly VideoTemplate[]
  onGenerate: () => void
  loading: boolean
  videoResult: any
  videoError: string | null
  onDownload: () => void
  onReset: () => void
  onClose: () => void
  profileScreenshotUrl: string | null
  includeProfileScreenshot: boolean
  onToggleProfileScreenshot: () => void
  username?: string
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
            {/* RED close button */}
            <button
              onClick={onClose}
              className="p-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
              style={{ backgroundColor: '#D64045' }}
            >
              <X className="w-5 h-5 text-white" />
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
            <div className="space-y-4">
              {/* Intro Video Section for Mobile */}
              {profileScreenshotUrl && (
                <MobileIntroSection
                  screenshotUrl={profileScreenshotUrl}
                  username={username}
                  isIncluded={includeProfileScreenshot}
                  onToggle={onToggleProfileScreenshot}
                />
              )}

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
                availableTemplates={availableTemplates}
                onGenerate={onGenerate}
                loading={loading}
                isMobile
              />
            </div>
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

// Mobile Intro Section
function MobileIntroSection({
  screenshotUrl,
  username,
  isIncluded,
  onToggle,
}: {
  screenshotUrl: string
  username?: string
  isIncluded: boolean
  onToggle: () => void
}) {
  const API_URL = import.meta.env.VITE_SCRAPER_API_URL || 'http://localhost:3000'
  const fullUrl = screenshotUrl.startsWith('http') ? screenshotUrl : `${API_URL}${screenshotUrl}`

  return (
    <div
      className="flex items-center gap-3 p-3 border-2 border-black"
      style={{ backgroundColor: isIncluded ? '#9ED8DB20' : '#F5F5F5' }}
    >
      {/* Screenshot thumbnail */}
      <div
        className={`
          w-12 h-20 border-2 border-black overflow-hidden flex-shrink-0
          ${!isIncluded ? 'opacity-50 grayscale' : ''}
        `}
        style={{ backgroundColor: '#000' }}
      >
        <img
          src={fullUrl}
          alt="Screenshot profil"
          className="w-full h-full object-cover object-top"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4" style={{ color: '#1D3354' }} />
          <span className="font-display font-bold text-sm">INTRO VIDÉO</span>
        </div>
        {username && (
          <p className="text-xs text-black/50">Profil @{username}</p>
        )}
        <p className="text-[10px] text-black/40 mt-1">
          {isIncluded ? 'Inclus en debut de video' : 'Non inclus'}
        </p>
      </div>

      {/* Toggle */}
      <button
        onClick={onToggle}
        className={`
          px-3 py-2 border-2 border-black text-xs font-bold font-display
          shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
          active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]
          transition-all
        `}
        style={{ backgroundColor: isIncluded ? '#9ED8DB' : '#FFFFFF' }}
      >
        {isIncluded ? 'INCLUS' : 'EXCLURE'}
      </button>
    </div>
  )
}
