import { Sparkles, Music, Layout, Type, Stamp, Lock, Crown, ChevronDown, MapPin, Zap, AlertCircle, Film } from 'lucide-react'
import type { VintedItem, UserInfo, VideoTemplate } from '../../types/vinted'

const API_URL = import.meta.env.VITE_SCRAPER_API_URL || 'http://localhost:3000'

interface CompactSidebarProps {
  // User info
  username?: string
  userInfo?: UserInfo
  totalItems: number
  // Video content
  selectedArticles: VintedItem[]
  profileScreenshotUrl?: string | null
  includeProfileScreenshot?: boolean
  // Configuration
  musicTrack: string
  template: string
  customText: string
  hasWatermark: boolean
  plan: 'free' | 'pro' | 'business'
  // Config handlers
  onMusicChange?: (track: string) => void
  onTemplateChange?: (template: VideoTemplate) => void
  onCustomTextChange?: (text: string) => void
  onWatermarkChange?: (hasWatermark: boolean) => void
  // Generation
  creditsRemaining: number
  onGenerate: () => void
  loading: boolean
  // Actions
  onUpgradeClick?: () => void
}

const templateOptions = [
  { id: 'classic' as VideoTemplate, name: 'Classique', color: '#1D3354', textColor: '#FFF' },
  { id: 'modern' as VideoTemplate, name: 'Moderne', color: '#9ED8DB', textColor: '#000' },
  { id: 'premium' as VideoTemplate, name: 'Premium', color: '#D64045', textColor: '#FFF' },
]

const musicOptions = [
  { id: '', name: 'Sans musique' },
  { id: 'upbeat', name: 'Upbeat' },
  { id: 'chill', name: 'Chill' },
  { id: 'fashion', name: 'Fashion' },
  { id: 'trendy', name: 'Trendy' },
]

export function CompactSidebar({
  username,
  userInfo,
  totalItems,
  selectedArticles,
  profileScreenshotUrl,
  includeProfileScreenshot = false,
  musicTrack,
  template,
  customText,
  hasWatermark,
  plan,
  onMusicChange,
  onTemplateChange,
  onCustomTextChange,
  onWatermarkChange,
  creditsRemaining,
  onGenerate,
  loading,
  onUpgradeClick,
}: CompactSidebarProps) {
  const canGenerate = selectedArticles.length > 0 && creditsRemaining > 0
  const isPremium = plan === 'pro' || plan === 'business'
  const totalValue = selectedArticles.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0)

  const fullScreenshotUrl = profileScreenshotUrl
    ? (profileScreenshotUrl.startsWith('http') ? profileScreenshotUrl : `${API_URL}${profileScreenshotUrl}`)
    : null
  const hasIntro = fullScreenshotUrl && includeProfileScreenshot

  return (
    <div className="h-full flex flex-col border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Header: User Profile Compact */}
      <div className="px-4 py-3 border-b-2 border-black" style={{ backgroundColor: '#1D3354' }}>
        <div className="flex items-center gap-3">
          {userInfo?.profilePicture ? (
            <div className="w-10 h-10 border-2 border-white overflow-hidden flex-shrink-0">
              <img src={userInfo.profilePicture} alt={username} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-10 h-10 border-2 border-white flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#9ED8DB' }}>
              <span className="font-display font-bold text-sm text-black">{(username || 'U')[0].toUpperCase()}</span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-display font-bold text-sm text-white truncate">@{username || 'Utilisateur'}</p>
            <div className="flex items-center gap-3 text-[10px] text-white/70">
              <span>{totalItems} articles</span>
              {userInfo?.city && (
                <span className="flex items-center gap-0.5">
                  <MapPin className="w-2.5 h-2.5" />
                  {userInfo.city}
                </span>
              )}
            </div>
          </div>
          {/* Credits badge */}
          <div
            className="flex items-center gap-1 px-2 py-1 border-2 border-white/30"
            style={{ backgroundColor: creditsRemaining > 0 ? '#9ED8DB' : '#D64045' }}
          >
            <Zap className={`w-3 h-3 ${creditsRemaining > 0 ? 'text-black' : 'text-white'}`} />
            <span className={`font-display font-bold text-sm ${creditsRemaining > 0 ? 'text-black' : 'text-white'}`}>
              {creditsRemaining}
            </span>
          </div>
        </div>
      </div>

      {/* Content Preview - Compact thumbnails */}
      <div className="px-4 py-3 border-b border-black/10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Film className="w-3.5 h-3.5 text-black/50" />
            <span className="font-display font-bold text-[10px] text-black/60">APERCU</span>
          </div>
          <span className="text-[10px] text-black/50">
            {hasIntro ? '1 intro + ' : ''}{selectedArticles.length} articles • {totalValue.toFixed(0)}€
          </span>
        </div>
        <div className="flex flex-wrap gap-1">
          {hasIntro && (
            <div className="w-8 h-8 border border-black overflow-hidden relative" style={{ backgroundColor: '#1D3354' }}>
              <img src={fullScreenshotUrl} alt="Intro" className="w-full h-full object-cover object-top" />
            </div>
          )}
          {selectedArticles.slice(0, hasIntro ? 8 : 9).map((item) => (
            <div key={item.id} className="w-8 h-8 border border-black overflow-hidden bg-gray-100">
              <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
            </div>
          ))}
          {selectedArticles.length > (hasIntro ? 8 : 9) && (
            <div className="w-8 h-8 border border-black flex items-center justify-center text-[9px] font-bold" style={{ backgroundColor: '#E8DFD5' }}>
              +{selectedArticles.length - (hasIntro ? 8 : 9)}
            </div>
          )}
          {selectedArticles.length === 0 && (
            <div className="w-full py-3 text-center text-[10px] text-black/40">
              Selectionne des articles
            </div>
          )}
        </div>
      </div>

      {/* Configuration - Ultra compact - Flex-1 to push generate button down */}
      <div className="px-4 py-3 space-y-3 flex-1">
        {/* Template - Inline buttons */}
        <div className="flex items-center gap-2">
          <Layout className="w-3.5 h-3.5 text-black/40 flex-shrink-0" />
          <div className="flex flex-1 gap-1">
            {templateOptions.map((t) => {
              const isAvailable = plan !== 'free' || t.id === 'classic'
              return (
                <button
                  key={t.id}
                  onClick={() => isAvailable && onTemplateChange?.(t.id)}
                  disabled={!isAvailable}
                  className={`
                    flex-1 py-1.5 border border-black font-display font-bold text-[9px] transition-all relative
                    ${template === t.id ? 'shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'opacity-70 hover:opacity-100'}
                    ${!isAvailable ? 'opacity-30 cursor-not-allowed' : ''}
                  `}
                  style={{ backgroundColor: t.color, color: t.textColor }}
                >
                  {t.name}
                  {!isAvailable && <Lock className="absolute top-0.5 right-0.5 w-2 h-2" />}
                </button>
              )
            })}
          </div>
        </div>

        {/* Music - Compact select */}
        <div className="flex items-center gap-2">
          <Music className="w-3.5 h-3.5 text-black/40 flex-shrink-0" />
          <div className="relative flex-1">
            <select
              value={musicTrack}
              onChange={(e) => onMusicChange?.(e.target.value)}
              className="w-full pl-2 pr-6 py-1.5 border border-black font-body text-xs appearance-none cursor-pointer bg-white text-black"
            >
              {musicOptions.map((track) => (
                <option key={track.id} value={track.id}>{track.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-black pointer-events-none" />
          </div>
        </div>

        {/* Custom Text - Compact input */}
        <div className="flex items-center gap-2">
          <Type className="w-3.5 h-3.5 text-black/40 flex-shrink-0" />
          <input
            type="text"
            value={customText}
            onChange={(e) => onCustomTextChange?.(e.target.value)}
            placeholder="-20% ce week-end !"
            maxLength={30}
            className="flex-1 px-2 py-1.5 border border-black font-body text-xs bg-white text-black placeholder:text-black/30"
          />
        </div>

        {/* Watermark - Compact toggle */}
        <div className="flex items-center gap-2">
          <Stamp className="w-3.5 h-3.5 text-black/40 flex-shrink-0" />
          <div className="flex flex-1 items-center justify-between">
            <div className="flex border border-black overflow-hidden">
              <button
                onClick={() => isPremium && onWatermarkChange?.(false)}
                disabled={!isPremium}
                className={`px-3 py-1 font-display font-bold text-[9px] transition-all ${!hasWatermark ? 'bg-[#9ED8DB]' : 'bg-white text-black/40'} ${!isPremium ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                SANS
              </button>
              <button
                onClick={() => isPremium && onWatermarkChange?.(true)}
                disabled={!isPremium}
                className={`px-3 py-1 font-display font-bold text-[9px] border-l border-black transition-all ${hasWatermark ? 'bg-[#1D3354] text-white' : 'bg-white text-black/40'} ${!isPremium ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                AVEC
              </button>
            </div>
            {!isPremium && (
              <button
                onClick={onUpgradeClick}
                className="flex items-center gap-1 px-2 py-1 bg-[#D64045] border border-black text-[9px] font-bold text-white"
              >
                <Crown className="w-2.5 h-2.5" />
                PRO
              </button>
            )}
          </div>
        </div>

        {/* Specs row */}
        <div className="flex items-center justify-between pt-2 border-t border-black/10">
          <div className="flex items-center gap-1">
            <span className="px-1.5 py-0.5 border border-black/30 text-[9px] font-bold" style={{ backgroundColor: plan === 'business' ? '#9ED8DB' : '#F5F5F5' }}>
              {plan === 'business' ? '4K' : '1080p'}
            </span>
            <span className="px-1.5 py-0.5 border border-black/30 text-[9px] font-bold bg-[#F5F5F5]">MP4</span>
            <span className="px-1.5 py-0.5 border border-black/30 text-[9px] font-bold bg-[#F5F5F5]">9:16</span>
          </div>
        </div>
      </div>

      {/* No credits warning */}
      {creditsRemaining === 0 && (
        <div className="px-4 py-2 border-t-2 border-black" style={{ backgroundColor: '#D64045' }}>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-white flex-shrink-0" />
            <p className="text-[10px] text-white">
              Plus de credits !{' '}
              <button onClick={onUpgradeClick} className="underline font-bold">Upgrader</button>
            </p>
          </div>
        </div>
      )}

      {/* Generate Button */}
      <div className="p-4 border-t-2 border-black" style={{ backgroundColor: '#E8DFD5' }}>
        <button
          onClick={onGenerate}
          disabled={!canGenerate || loading}
          className={`
            w-full px-4 py-3 border-2 border-black font-display font-bold text-sm text-white
            shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]
            transition-all
            ${canGenerate && !loading
              ? 'active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
              : 'opacity-50 cursor-not-allowed shadow-none'
            }
          `}
          style={{ backgroundColor: canGenerate && !loading ? '#D64045' : '#888' }}
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
