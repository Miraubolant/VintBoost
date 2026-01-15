import { Sparkles, Lock, Crown, ChevronDown, MapPin, Zap, AlertCircle, Smartphone, Monitor, Square, Settings } from 'lucide-react'
import type { VintedItem, UserInfo, VideoTemplate, VideoAspectRatio } from '../../types/vinted'

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
  aspectRatio?: VideoAspectRatio
  plan: 'free' | 'pro' | 'business'
  // Config handlers
  onMusicChange?: (track: string) => void
  onTemplateChange?: (template: VideoTemplate) => void
  onCustomTextChange?: (text: string) => void
  onWatermarkChange?: (hasWatermark: boolean) => void
  onAspectRatioChange?: (ratio: VideoAspectRatio) => void
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

const aspectRatioOptions = [
  { id: '9:16' as VideoAspectRatio, label: '9:16', name: 'TikTok', icon: Smartphone },
  { id: '16:9' as VideoAspectRatio, label: '16:9', name: 'YouTube', icon: Monitor },
  { id: '1:1' as VideoAspectRatio, label: '1:1', name: 'Insta', icon: Square },
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
  aspectRatio = '9:16',
  plan,
  onMusicChange,
  onTemplateChange,
  onCustomTextChange,
  onWatermarkChange,
  onAspectRatioChange,
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
      {/* Header: User Profile */}
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

      {/* Preview Section */}
      <div className="px-4 py-3 border-b-2 border-black/10" style={{ backgroundColor: '#FAFAFA' }}>
        <div className="flex items-center justify-between mb-2">
          <span className="font-display font-bold text-[11px] text-black/70 uppercase tracking-wide">Apercu</span>
          <span className="text-[10px] text-black/50 font-body">
            {hasIntro ? '1 intro + ' : ''}{selectedArticles.length} articles - {totalValue.toFixed(0)}E
          </span>
        </div>
        <div className="flex flex-wrap gap-1">
          {hasIntro && (
            <div className="w-9 h-9 border-2 border-black overflow-hidden" style={{ backgroundColor: '#1D3354' }}>
              <img src={fullScreenshotUrl} alt="Intro" className="w-full h-full object-cover object-top" />
            </div>
          )}
          {selectedArticles.slice(0, hasIntro ? 7 : 8).map((item) => (
            <div key={item.id} className="w-9 h-9 border-2 border-black overflow-hidden bg-gray-100">
              <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
            </div>
          ))}
          {selectedArticles.length > (hasIntro ? 7 : 8) && (
            <div className="w-9 h-9 border-2 border-black flex items-center justify-center text-[10px] font-bold" style={{ backgroundColor: '#E8DFD5' }}>
              +{selectedArticles.length - (hasIntro ? 7 : 8)}
            </div>
          )}
          {selectedArticles.length === 0 && (
            <div className="w-full py-4 text-center text-xs text-black/40 font-body">
              Selectionne des articles a gauche
            </div>
          )}
        </div>
      </div>

      {/* Configuration Section */}
      <div className="flex-1 overflow-y-auto">
        {/* Section Header */}
        <div className="px-4 py-2 border-b border-black/10" style={{ backgroundColor: '#F5F5F5' }}>
          <div className="flex items-center gap-2">
            <Settings className="w-3.5 h-3.5 text-black/50" />
            <span className="font-display font-bold text-[11px] text-black/70 uppercase tracking-wide">Configuration</span>
          </div>
        </div>

        <div className="px-4 py-3 space-y-4">
          {/* Style / Template */}
          <ConfigRow label="Style">
            <div className="flex gap-1">
              {templateOptions.map((t) => {
                const isAvailable = plan !== 'free' || t.id === 'classic'
                const isSelected = template === t.id
                return (
                  <button
                    key={t.id}
                    onClick={() => isAvailable && onTemplateChange?.(t.id)}
                    disabled={!isAvailable}
                    className={`
                      flex-1 py-2 px-1 border-2 border-black font-display font-bold text-[10px] transition-all relative
                      ${isSelected ? 'shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] -translate-x-[1px] -translate-y-[1px]' : ''}
                      ${!isAvailable ? 'opacity-40 cursor-not-allowed' : 'hover:opacity-90'}
                    `}
                    style={{ backgroundColor: t.color, color: t.textColor }}
                  >
                    {t.name}
                    {!isAvailable && <Lock className="absolute top-1 right-1 w-2.5 h-2.5" />}
                  </button>
                )
              })}
            </div>
          </ConfigRow>

          {/* Format / Aspect Ratio */}
          <ConfigRow label="Format">
            <div className="flex gap-1">
              {aspectRatioOptions.map((ratio) => {
                const Icon = ratio.icon
                const isAvailable = isPremium || ratio.id === '9:16'
                const isSelected = aspectRatio === ratio.id
                return (
                  <button
                    key={ratio.id}
                    onClick={() => isAvailable && onAspectRatioChange?.(ratio.id)}
                    disabled={!isAvailable}
                    className={`
                      flex-1 py-2 border-2 border-black font-display font-bold text-[10px] transition-all flex flex-col items-center gap-0.5
                      ${isSelected
                        ? 'bg-[#1D3354] text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] -translate-x-[1px] -translate-y-[1px]'
                        : 'bg-white text-black/70 hover:bg-gray-50'}
                      ${!isAvailable ? 'opacity-40 cursor-not-allowed' : ''}
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{ratio.label}</span>
                    {!isAvailable && <Lock className="absolute top-1 right-1 w-2.5 h-2.5" />}
                  </button>
                )
              })}
            </div>
          </ConfigRow>

          {/* Music */}
          <ConfigRow label="Musique">
            <div className="relative">
              <select
                value={musicTrack}
                onChange={(e) => onMusicChange?.(e.target.value)}
                className="w-full pl-3 pr-8 py-2 border-2 border-black font-body text-xs appearance-none cursor-pointer bg-white text-black hover:bg-gray-50 transition-colors"
              >
                {musicOptions.map((track) => (
                  <option key={track.id} value={track.id}>{track.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-black pointer-events-none" />
            </div>
          </ConfigRow>

          {/* Custom Text */}
          <ConfigRow label="Texte promo">
            <input
              type="text"
              value={customText}
              onChange={(e) => onCustomTextChange?.(e.target.value)}
              placeholder="-20% ce week-end !"
              maxLength={30}
              className="w-full px-3 py-2 border-2 border-black font-body text-xs bg-white text-black placeholder:text-black/30 hover:bg-gray-50 focus:bg-white transition-colors"
            />
            <p className="text-[9px] text-black/40 mt-1 text-right">{customText.length}/30</p>
          </ConfigRow>

          {/* Watermark */}
          <ConfigRow label="Filigrane">
            <div className="flex items-center gap-2">
              <div className="flex border-2 border-black overflow-hidden flex-1">
                <button
                  onClick={() => isPremium && onWatermarkChange?.(false)}
                  disabled={!isPremium}
                  className={`
                    flex-1 py-2 font-display font-bold text-[10px] transition-all
                    ${!hasWatermark ? 'bg-[#9ED8DB] text-black' : 'bg-white text-black/40 hover:bg-gray-50'}
                    ${!isPremium ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  SANS
                </button>
                <button
                  onClick={() => isPremium && onWatermarkChange?.(true)}
                  disabled={!isPremium}
                  className={`
                    flex-1 py-2 font-display font-bold text-[10px] border-l-2 border-black transition-all
                    ${hasWatermark ? 'bg-[#1D3354] text-white' : 'bg-white text-black/40 hover:bg-gray-50'}
                    ${!isPremium ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  AVEC
                </button>
              </div>
              {!isPremium && (
                <button
                  onClick={onUpgradeClick}
                  className="flex items-center gap-1 px-3 py-2 bg-[#D64045] border-2 border-black text-[10px] font-bold text-white hover:bg-[#c53539] transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  <Crown className="w-3 h-3" />
                  PRO
                </button>
              )}
            </div>
          </ConfigRow>
        </div>

        {/* Specs Footer */}
        <div className="px-4 py-3 border-t-2 border-black/10" style={{ backgroundColor: '#F5F5F5' }}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-black/50 font-body">Sortie</span>
            <div className="flex items-center gap-1.5">
              <SpecBadge label={plan === 'business' ? '4K' : '1080p'} highlight={plan === 'business'} />
              <SpecBadge label="MP4" />
              <SpecBadge label={aspectRatio} />
            </div>
          </div>
        </div>
      </div>

      {/* No credits warning */}
      {creditsRemaining === 0 && (
        <div className="px-4 py-3 border-t-2 border-black" style={{ backgroundColor: '#D64045' }}>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-white flex-shrink-0" />
            <p className="text-xs text-white font-body">
              Plus de credits disponibles.{' '}
              <button onClick={onUpgradeClick} className="underline font-bold">Passer Pro</button>
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
            w-full px-4 py-3.5 border-2 border-black font-display font-bold text-sm text-white
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
              GENERATION EN COURS...
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

// Config Row Component
function ConfigRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] font-display font-bold text-black/60 uppercase tracking-wide mb-1.5">
        {label}
      </label>
      {children}
    </div>
  )
}

// Spec Badge Component
function SpecBadge({ label, highlight = false }: { label: string; highlight?: boolean }) {
  return (
    <span
      className="px-2 py-1 border-2 border-black text-[10px] font-display font-bold"
      style={{ backgroundColor: highlight ? '#9ED8DB' : '#FFFFFF' }}
    >
      {label}
    </span>
  )
}
