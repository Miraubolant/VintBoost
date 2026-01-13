import { Sparkles, Clock, Music, Layout, Type, Package, CreditCard, AlertCircle, ShoppingBag, Users, ThumbsUp, MapPin } from 'lucide-react'
import type { VintedItem, UserInfo } from '../types/vinted'

interface VideoPreviewSummaryProps {
  selectedArticles: VintedItem[]
  videoDuration: number
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
}

const templateNames: Record<string, string> = {
  classic: 'Classique',
  modern: 'Moderne',
  premium: 'Premium',
}

const musicNames: Record<string, string> = {
  '': 'Sans musique',
  upbeat: 'Upbeat Energy',
  chill: 'Chill Vibes',
  fashion: 'Fashion Forward',
  trendy: 'Trendy Beat',
  summer: 'Summer Days',
  elegant: 'Elegant Style',
  custom: 'Musique personnalisee',
}

export function VideoPreviewSummary({
  selectedArticles,
  videoDuration,
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
}: VideoPreviewSummaryProps) {
  const canGenerate = selectedArticles.length > 0 && creditsRemaining > 0
  const totalValue = selectedArticles.reduce(
    (sum, item) => sum + (parseFloat(item.price) || 0),
    0
  )

  return (
    <div className="h-full flex flex-col">
      {/* User Profile + Stats Section */}
      <div className="px-4 py-3 border-b-2 border-black" style={{ backgroundColor: '#E8DFD5' }}>
        {/* User Info */}
        <div className="flex items-center gap-3 mb-3">
          {userInfo?.profilePicture ? (
            <div className="w-12 h-12 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex-shrink-0">
              <img
                src={userInfo.profilePicture}
                alt={username}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div
              className="w-12 h-12 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: '#9ED8DB' }}
            >
              <span className="font-display font-bold text-lg text-black">
                {(username || 'U')[0].toUpperCase()}
              </span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-display font-bold text-black truncate">
              @{username || 'Utilisateur'}
            </h3>
            {userInfo?.city && (
              <p className="text-[10px] text-black/50 flex items-center gap-1">
                <MapPin className="w-2.5 h-2.5" />
                {userInfo.city}
              </p>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        {userInfo && (
          <div className="grid grid-cols-2 gap-1.5">
            <StatMini
              icon={<Package className="w-3 h-3" />}
              value={totalItems}
              label="articles"
              color="#1D3354"
            />
            <StatMini
              icon={<ShoppingBag className="w-3 h-3" />}
              value={userInfo.soldItemsCount}
              label="vendus"
              color="#D64045"
            />
            <StatMini
              icon={<Users className="w-3 h-3" />}
              value={userInfo.followersCount}
              label="abonnes"
              color="#1D3354"
            />
            <StatMini
              icon={<ThumbsUp className="w-3 h-3" />}
              value={userInfo.positiveFeedbackCount}
              label="avis"
              color="#1D3354"
            />
          </div>
        )}
      </div>

      {/* Header */}
      <div
        className="px-4 py-3 border-b-2 border-black"
        style={{ backgroundColor: '#1D3354' }}
      >
        <h3 className="font-display font-bold text-white text-sm">
          RESUME DE LA VIDEO
        </h3>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto" style={{ backgroundColor: '#FFFFFF' }}>
        {/* Articles Preview */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-4 h-4" />
            <span className="font-display font-bold text-xs">ARTICLES</span>
          </div>
          {selectedArticles.length > 0 ? (
            <>
              <div className="flex flex-wrap gap-1 mb-2">
                {selectedArticles.slice(0, 6).map((item) => (
                  <div
                    key={item.id}
                    className="w-9 h-9 border border-black overflow-hidden"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                {selectedArticles.length > 6 && (
                  <div
                    className="w-9 h-9 border border-black flex items-center justify-center text-[10px] font-bold"
                    style={{ backgroundColor: '#E8DFD5' }}
                  >
                    +{selectedArticles.length - 6}
                  </div>
                )}
              </div>
              <p className="text-[10px] text-black/60 font-body">
                {selectedArticles.length} articles - {totalValue.toFixed(0)}€
              </p>
            </>
          ) : (
            <p className="text-xs text-black/40 font-body italic">
              Aucun article selectionne
            </p>
          )}
        </div>

        {/* Configuration Summary */}
        <div className="space-y-1.5">
          <SummaryItem
            icon={<Clock className="w-3.5 h-3.5" />}
            label="Duree"
            value={`${videoDuration}s`}
          />
          <SummaryItem
            icon={<Layout className="w-3.5 h-3.5" />}
            label="Template"
            value={templateNames[template] || template}
          />
          <SummaryItem
            icon={<Music className="w-3.5 h-3.5" />}
            label="Musique"
            value={musicNames[musicTrack] || 'Aucune'}
          />
          {customText && (
            <SummaryItem
              icon={<Type className="w-3.5 h-3.5" />}
              label="Texte"
              value={customText}
            />
          )}
        </div>

        {/* Watermark & Resolution */}
        <div className="flex items-center gap-2 text-[10px]">
          {hasWatermark && (
            <span className="px-2 py-0.5 border border-black bg-gray-100">Watermark</span>
          )}
          <span className="px-2 py-0.5 border border-black" style={{ backgroundColor: plan === 'business' ? '#9ED8DB' : '#FFFFFF' }}>
            {plan === 'business' ? '4K' : '1080p'}
          </span>
          <span className="px-2 py-0.5 border border-black">MP4</span>
        </div>
      </div>

      {/* Credits & CTA */}
      <div className="p-4 border-t-2 border-black" style={{ backgroundColor: '#FFFFFF' }}>
        {/* Credits indicator */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            <span className="font-display font-bold text-xs">CREDITS</span>
          </div>
          <span
            className={`
              px-2 py-1 border border-black font-display font-bold text-sm
              ${creditsRemaining > 0 ? '' : 'text-white'}
            `}
            style={{ backgroundColor: creditsRemaining > 0 ? '#9ED8DB' : '#D64045' }}
          >
            {creditsRemaining}
          </span>
        </div>

        {/* Warning if no credits */}
        {creditsRemaining === 0 && (
          <div
            className="flex items-center gap-2 px-3 py-2 mb-3 border-2 border-black"
            style={{ backgroundColor: '#D64045' }}
          >
            <AlertCircle className="w-4 h-4 text-white flex-shrink-0" />
            <p className="text-xs font-bold text-white">
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
            w-full px-4 py-3 border-3 border-black font-display font-bold text-sm text-white
            shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
            transition-all
            ${canGenerate && !loading
              ? 'active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]'
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

function SummaryItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-center justify-between px-2 py-1.5 border border-black/10">
      <div className="flex items-center gap-1.5 text-black/50">
        {icon}
        <span className="text-[10px] font-body">{label}</span>
      </div>
      <span className="font-display font-bold text-[11px] truncate max-w-[120px]">{value}</span>
    </div>
  )
}

function StatMini({
  icon,
  value,
  label,
  color,
}: {
  icon: React.ReactNode
  value: number | string
  label: string
  color: string
}) {
  return (
    <div className="flex items-center gap-1.5 px-2 py-1 border border-black bg-white">
      <span style={{ color }}>{icon}</span>
      <span className="font-display font-bold text-xs" style={{ color }}>
        {value}
      </span>
      <span className="text-[9px] text-black/50">{label}</span>
    </div>
  )
}
