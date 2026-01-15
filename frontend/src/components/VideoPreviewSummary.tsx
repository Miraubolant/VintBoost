import { Sparkles, Music, Layout, Type, Package, CreditCard, AlertCircle, ShoppingBag, Users, ThumbsUp, MapPin, Image, Stamp, Lock, ChevronDown } from 'lucide-react'
import type { VintedItem, UserInfo, VideoTemplate } from '../types/vinted'

const API_URL = import.meta.env.VITE_SCRAPER_API_URL || 'http://localhost:3000'

interface VideoPreviewSummaryProps {
  selectedArticles: VintedItem[]
  musicTrack: string
  template: string
  customText: string
  hasWatermark: boolean
  creditsRemaining: number
  onGenerate: () => void
  loading: boolean
  plan: 'free' | 'pro' | 'business'
  userInfo?: UserInfo
  username?: string
  totalItems?: number
  onUpgradeClick?: () => void
  // Intro screenshot props
  profileScreenshotUrl?: string | null
  includeProfileScreenshot?: boolean
  // Config change handlers
  onMusicChange?: (track: string) => void
  onTemplateChange?: (template: VideoTemplate) => void
  onCustomTextChange?: (text: string) => void
  onWatermarkChange?: (hasWatermark: boolean) => void
}

const templateOptions = [
  { id: 'classic' as VideoTemplate, name: 'Classique', color: '#FFFFFF' },
  { id: 'modern' as VideoTemplate, name: 'Moderne', color: '#9ED8DB' },
  { id: 'premium' as VideoTemplate, name: 'Premium', color: '#D64045' },
]

const musicOptions = [
  { id: '', name: 'Sans musique' },
  { id: 'upbeat', name: 'Upbeat' },
  { id: 'chill', name: 'Chill' },
  { id: 'fashion', name: 'Fashion' },
  { id: 'trendy', name: 'Trendy' },
]

export function VideoPreviewSummary({
  selectedArticles,
  musicTrack,
  template,
  customText,
  hasWatermark,
  creditsRemaining,
  onGenerate,
  loading,
  plan,
  userInfo,
  username,
  totalItems = 0,
  onUpgradeClick,
  profileScreenshotUrl,
  includeProfileScreenshot = false,
  onMusicChange,
  onTemplateChange,
  onCustomTextChange,
  onWatermarkChange,
}: VideoPreviewSummaryProps) {
  const canGenerate = selectedArticles.length > 0 && creditsRemaining > 0
  const totalValue = selectedArticles.reduce(
    (sum, item) => sum + (parseFloat(item.price) || 0),
    0
  )
  const isPremium = plan === 'pro' || plan === 'business'

  const fullScreenshotUrl = profileScreenshotUrl
    ? (profileScreenshotUrl.startsWith('http') ? profileScreenshotUrl : `${API_URL}${profileScreenshotUrl}`)
    : null

  return (
    <div className="border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden" style={{ backgroundColor: '#FFFFFF' }}>
      {/* User Profile Header */}
      <div className="px-4 py-3 border-b-2 border-black" style={{ backgroundColor: '#F8F8F8' }}>
        <div className="flex items-center gap-3">
          {userInfo?.profilePicture ? (
            <div className="w-10 h-10 border-2 border-black overflow-hidden flex-shrink-0">
              <img
                src={userInfo.profilePicture}
                alt={username}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div
              className="w-10 h-10 border-2 border-black flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: '#9ED8DB' }}
            >
              <span className="font-display font-bold text-sm text-black">
                {(username || 'U')[0].toUpperCase()}
              </span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-display font-bold truncate" style={{ color: '#1D3354' }}>
              @{username || 'Utilisateur'}
            </h3>
            {userInfo?.city && (
              <p className="text-[10px] text-black/60 flex items-center gap-1">
                <MapPin className="w-2.5 h-2.5" />
                {userInfo.city}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid - Compact */}
      {userInfo && (
        <div className="grid grid-cols-4 border-b-2 border-black" style={{ backgroundColor: '#F8F8F8' }}>
          <StatCompact
            icon={<Package className="w-3 h-3" />}
            value={totalItems}
            label="articles"
          />
          <StatCompact
            icon={<ShoppingBag className="w-3 h-3" />}
            value={userInfo.soldItemsCount}
            label="vendus"
          />
          <StatCompact
            icon={<Users className="w-3 h-3" />}
            value={userInfo.followersCount}
            label="abonnes"
          />
          <StatCompact
            icon={<ThumbsUp className="w-3 h-3" />}
            value={userInfo.positiveFeedbackCount}
            label="avis"
          />
        </div>
      )}

      {/* Content Preview */}
      <div className="p-3 space-y-3 border-b-2 border-black" style={{ backgroundColor: '#FFFFFF' }}>
        {/* Media Preview - Intro + Articles */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Image className="w-3.5 h-3.5 text-black/60" />
            <span className="font-display font-bold text-[11px] text-black/80">CONTENU VIDEO</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {/* Intro Screenshot Preview */}
            {fullScreenshotUrl && includeProfileScreenshot && (
              <div
                className="w-10 h-10 border-2 border-black overflow-hidden"
                style={{ backgroundColor: '#1D3354' }}
              >
                <img
                  src={fullScreenshotUrl}
                  alt="Intro"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            )}

            {/* Selected Articles */}
            {selectedArticles.slice(0, (fullScreenshotUrl && includeProfileScreenshot) ? 5 : 6).map((item) => (
              <div
                key={item.id}
                className="w-10 h-10 border border-black overflow-hidden"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}

            {/* More articles indicator */}
            {selectedArticles.length > ((fullScreenshotUrl && includeProfileScreenshot) ? 5 : 6) && (
              <div
                className="w-10 h-10 border border-black flex items-center justify-center text-[10px] font-bold"
                style={{ backgroundColor: '#E8DFD5' }}
              >
                +{selectedArticles.length - ((fullScreenshotUrl && includeProfileScreenshot) ? 5 : 6)}
              </div>
            )}
          </div>

          {/* Summary text */}
          <div className="flex items-center gap-2 mt-2 text-[10px] text-black/60 font-body">
            {includeProfileScreenshot && fullScreenshotUrl && (
              <span className="px-1.5 py-0.5 border border-black/20 bg-[#9ED8DB]/30">1 intro</span>
            )}
            <span>{selectedArticles.length} articles</span>
            <span>•</span>
            <span>{totalValue.toFixed(0)}€</span>
          </div>
        </div>
      </div>

      {/* Configuration Section */}
      <div
        className="px-3 py-2 border-b-2 border-black flex items-center gap-2"
        style={{ backgroundColor: '#9ED8DB' }}
      >
        <Sparkles className="w-3.5 h-3.5" />
        <h3 className="font-display font-bold text-black text-xs">
          CONFIGURATION
        </h3>
      </div>

      <div className="p-3 space-y-3" style={{ backgroundColor: '#FFFFFF' }}>
        {/* Template Selection */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Layout className="w-3.5 h-3.5 text-black/50" />
            <span className="font-display font-bold text-[10px] text-black/60">TEMPLATE</span>
          </div>
          <div className="flex gap-1.5">
            {templateOptions.map((t) => {
              const isAvailable = plan !== 'free' || t.id === 'classic'
              return (
                <button
                  key={t.id}
                  onClick={() => isAvailable && onTemplateChange?.(t.id)}
                  disabled={!isAvailable}
                  className={`
                    relative flex-1 py-2 border-2 border-black font-display font-bold text-[10px] transition-all
                    ${template === t.id ? 'ring-2 ring-[#1D3354] ring-offset-1' : 'hover:bg-black/5'}
                    ${!isAvailable ? 'opacity-40 cursor-not-allowed' : ''}
                  `}
                  style={{ backgroundColor: t.color, color: t.id === 'premium' ? '#FFF' : '#000' }}
                >
                  {t.name}
                  {!isAvailable && <Lock className="absolute top-0.5 right-0.5 w-2.5 h-2.5" />}
                </button>
              )
            })}
          </div>
        </div>

        {/* Music Selection */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Music className="w-3.5 h-3.5 text-black/50" />
            <span className="font-display font-bold text-[10px] text-black/60">MUSIQUE</span>
          </div>
          <div className="relative">
            <select
              value={musicTrack}
              onChange={(e) => onMusicChange?.(e.target.value)}
              className="w-full px-3 py-2 border-2 border-black font-body text-xs appearance-none cursor-pointer bg-white text-black hover:bg-gray-50 transition-all"
            >
              {musicOptions.map((track) => (
                <option key={track.id} value={track.id}>{track.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-black pointer-events-none" />
          </div>
        </div>

        {/* Custom Text */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Type className="w-3.5 h-3.5 text-black/50" />
            <span className="font-display font-bold text-[10px] text-black/60">TEXTE PERSONNALISE</span>
          </div>
          <input
            type="text"
            value={customText}
            onChange={(e) => onCustomTextChange?.(e.target.value)}
            placeholder="Ex: -20% ce week-end !"
            maxLength={30}
            className="w-full px-3 py-2 border-2 border-black font-body text-xs bg-white text-black placeholder:text-black/40 hover:bg-gray-50 focus:bg-gray-50 transition-all"
          />
        </div>

        {/* Watermark Toggle */}
        <div className="flex items-center justify-between py-2 px-3 border-2 border-black" style={{ backgroundColor: '#F8F8F8' }}>
          <div className="flex items-center gap-2">
            <Stamp className="w-3.5 h-3.5 text-black/50" />
            <span className="font-display font-bold text-[10px] text-black/60">WATERMARK</span>
          </div>
          <div className="flex items-center gap-2">
            {!isPremium && (
              <button
                onClick={onUpgradeClick}
                className="px-2 py-0.5 bg-[#D64045] border border-black text-[9px] font-bold text-white hover:bg-[#c53539] transition-all"
              >
                PRO
              </button>
            )}
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={hasWatermark}
                onChange={(e) => isPremium && onWatermarkChange?.(e.target.checked)}
                disabled={!isPremium}
                className="sr-only"
              />
              <div
                className={`w-10 h-5 border-2 border-black relative transition-all ${!isPremium ? 'opacity-50' : ''}`}
                style={{ backgroundColor: hasWatermark ? '#9ED8DB' : '#F5F5F5' }}
              >
                <span
                  className={`absolute top-[2px] left-[2px] w-3.5 h-3.5 bg-[#1D3354] transition-transform ${hasWatermark ? 'translate-x-[18px]' : ''}`}
                />
              </div>
            </label>
          </div>
        </div>

        {/* Technical specs */}
        <div className="flex items-center gap-1.5 text-[9px]">
          <span className="px-1.5 py-0.5 border border-black" style={{ backgroundColor: plan === 'business' ? '#9ED8DB' : '#F5F5F5' }}>
            {plan === 'business' ? '4K' : '1080p'}
          </span>
          <span className="px-1.5 py-0.5 border border-black bg-[#F5F5F5]">MP4</span>
          <span className="px-1.5 py-0.5 border border-black bg-[#F5F5F5]">9:16</span>
        </div>
      </div>

      {/* Credits & CTA Footer */}
      <div className="p-3 border-t-2 border-black" style={{ backgroundColor: '#F8F8F8' }}>
        {/* Credits indicator */}
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5 text-black/50" />
            <span className="font-display font-bold text-[10px] text-black/60">CREDITS RESTANTS</span>
          </div>
          <span
            className="px-2 py-0.5 border-2 border-black font-display font-bold text-sm"
            style={{
              backgroundColor: creditsRemaining > 0 ? '#9ED8DB' : '#D64045',
              color: creditsRemaining > 0 ? '#000' : '#FFF'
            }}
          >
            {creditsRemaining}
          </span>
        </div>

        {/* Warning if no credits */}
        {creditsRemaining === 0 && (
          <div
            className="flex items-center gap-2 px-2.5 py-1.5 mb-2.5 border-2 border-black"
            style={{ backgroundColor: '#D64045' }}
          >
            <AlertCircle className="w-3.5 h-3.5 text-white flex-shrink-0" />
            <p className="text-[10px] font-bold text-white">
              Plus de credits !{' '}
              <button onClick={onUpgradeClick} className="underline hover:opacity-80">
                Upgrader
              </button>
            </p>
          </div>
        )}

        {/* Generate Button */}
        <button
          onClick={onGenerate}
          disabled={!canGenerate || loading}
          className={`
            w-full px-4 py-2.5 border-2 border-black font-display font-bold text-sm text-white
            shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]
            transition-all
            ${canGenerate && !loading
              ? 'active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
              : 'opacity-50 cursor-not-allowed'
            }
          `}
          style={{ backgroundColor: '#D64045' }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              GENERATION...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              GENERER MA VIDEO
            </span>
          )}
        </button>
      </div>
    </div>
  )
}

function StatCompact({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode
  value: number | string
  label: string
}) {
  return (
    <div className="flex flex-col items-center justify-center py-2 border-r border-black/10 last:border-r-0">
      <div className="flex items-center gap-1 text-[#1D3354]">
        {icon}
        <span className="font-display font-bold text-xs">
          {value}
        </span>
      </div>
      <span className="text-[8px] text-black/50">{label}</span>
    </div>
  )
}
