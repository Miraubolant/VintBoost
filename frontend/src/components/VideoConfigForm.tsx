import { useRef } from 'react'
import {
  Music,
  Layout,
  Type,
  Clock,
  Stamp,
  Lock,
  Upload,
  Crown,
  ChevronDown,
} from 'lucide-react'

interface VideoConfigFormProps {
  videoDuration: 15 | 30 | 60
  onDurationChange: (duration: 15 | 30 | 60) => void
  musicTrack: string
  onMusicChange: (track: string) => void
  template: string
  onTemplateChange: (template: string) => void
  customText: string
  onCustomTextChange: (text: string) => void
  hasWatermark: boolean
  onWatermarkChange: (hasWatermark: boolean) => void
  plan: 'free' | 'pro' | 'business'
  username?: string
  onUpgradeClick?: () => void
}

// Plan-based restrictions
export const PLAN_FEATURES = {
  free: {
    durations: [15] as const,
    templates: ['classic'],
    canUploadMusic: false,
    canRemoveWatermark: false,
    resolution: '1080p',
  },
  pro: {
    durations: [15, 30, 60] as const,
    templates: ['classic', 'modern', 'premium'],
    canUploadMusic: true,
    canRemoveWatermark: true,
    resolution: '1080p',
  },
  business: {
    durations: [15, 30, 60] as const,
    templates: ['classic', 'modern', 'premium'],
    canUploadMusic: true,
    canRemoveWatermark: true,
    resolution: '4K',
  },
} as const

const musicTracks = [
  { id: '', name: 'Sans musique' },
  { id: 'upbeat', name: 'Upbeat Energy' },
  { id: 'chill', name: 'Chill Vibes' },
  { id: 'fashion', name: 'Fashion Forward' },
  { id: 'trendy', name: 'Trendy Beat' },
  { id: 'summer', name: 'Summer Days' },
  { id: 'elegant', name: 'Elegant Style' },
]

const templates = [
  { id: 'classic', name: 'Classique', color: '#1D3354', premium: false },
  { id: 'modern', name: 'Moderne', color: '#9ED8DB', premium: true },
  { id: 'premium', name: 'Premium', color: '#D64045', premium: true },
]

export function VideoConfigForm({
  videoDuration,
  onDurationChange,
  musicTrack,
  onMusicChange,
  template,
  onTemplateChange,
  customText,
  onCustomTextChange,
  hasWatermark,
  onWatermarkChange,
  plan,
  username,
  onUpgradeClick,
}: VideoConfigFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const features = PLAN_FEATURES[plan]
  const isPremium = plan === 'pro' || plan === 'business'

  return (
    <div className="space-y-4">
      {/* Duration - Compact inline */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 font-display font-bold text-xs text-black">
          <Clock className="w-4 h-4" />
          DUREE
        </label>
        <div className="flex gap-1">
          {([15, 30, 60] as const).map((d) => {
            const isAvailable = (features.durations as readonly number[]).includes(d)
            const isSelected = videoDuration === d
            return (
              <button
                key={d}
                onClick={() => isAvailable && onDurationChange(d)}
                disabled={!isAvailable}
                className={`
                  relative px-3 py-1.5 font-display font-bold text-xs border-2 border-black
                  ${isAvailable ? '' : 'opacity-40 cursor-not-allowed'}
                `}
                style={{ backgroundColor: isSelected ? '#9ED8DB' : '#FFFFFF' }}
              >
                {d}s
                {!isAvailable && <Lock className="absolute -top-1 -right-1 w-2.5 h-2.5" />}
              </button>
            )
          })}
        </div>
      </div>

      {/* Template - Compact horizontal */}
      <div>
        <label className="flex items-center gap-2 font-display font-bold text-xs text-black mb-2">
          <Layout className="w-4 h-4" />
          TEMPLATE
        </label>
        <div className="flex gap-2">
          {templates.map((t) => {
            const isAvailable = (features.templates as readonly string[]).includes(t.id)
            const isSelected = template === t.id
            return (
              <button
                key={t.id}
                onClick={() => isAvailable && onTemplateChange(t.id)}
                disabled={!isAvailable}
                className={`
                  relative flex-1 flex items-center justify-center gap-2 py-2 border-2 border-black
                  ${isSelected ? 'ring-2 ring-[#1D3354]' : ''}
                  ${!isAvailable ? 'opacity-40 cursor-not-allowed' : ''}
                `}
                style={{ backgroundColor: '#FFFFFF' }}
              >
                <div
                  className="w-4 h-4 border border-black"
                  style={{ backgroundColor: t.color }}
                />
                <span className="font-bold text-xs">{t.name}</span>
                {t.premium && !isAvailable && (
                  <Lock className="w-3 h-3 text-black/40" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Music - Dropdown select */}
      <div>
        <label className="flex items-center gap-2 font-display font-bold text-xs text-black mb-2">
          <Music className="w-4 h-4" />
          MUSIQUE
        </label>
        <div className="relative">
          <select
            value={musicTrack}
            onChange={(e) => onMusicChange(e.target.value)}
            className="w-full px-3 py-2 border-2 border-black font-body text-sm appearance-none cursor-pointer pr-10"
            style={{ backgroundColor: '#FFFFFF' }}
          >
            {musicTracks.map((track) => (
              <option key={track.id} value={track.id}>
                {track.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
        </div>

        {/* Upload custom - compact */}
        {features.canUploadMusic && (
          <div className="mt-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) onMusicChange('custom')
              }}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 py-1.5 border border-dashed border-black text-xs font-bold"
              style={{ backgroundColor: '#F5F5F5' }}
            >
              <Upload className="w-3 h-3" />
              Upload musique
            </button>
          </div>
        )}
      </div>

      {/* Custom Text - Compact */}
      <div>
        <label className="flex items-center gap-2 font-display font-bold text-xs text-black mb-2">
          <Type className="w-4 h-4" />
          ACCROCHE
          {username && (
            <span className="font-normal text-black/50">(@{username})</span>
          )}
        </label>
        <input
          type="text"
          value={customText}
          onChange={(e) => onCustomTextChange(e.target.value)}
          placeholder="SOLDES -50%, LIVRAISON OFFERTE..."
          maxLength={50}
          className="w-full px-3 py-2 border-2 border-black font-body text-sm placeholder:text-black/40"
          style={{ backgroundColor: '#FFFFFF' }}
        />
      </div>

      {/* Premium Options - Compact row */}
      <div
        className="flex items-center justify-between p-3 border-2 border-black"
        style={{ backgroundColor: isPremium ? '#FFFFFF' : '#F5F5F5' }}
      >
        <div className="flex items-center gap-4">
          {/* Watermark toggle */}
          <div className="flex items-center gap-2">
            <Stamp className="w-4 h-4" />
            <span className="font-bold text-xs">Watermark</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={hasWatermark}
                onChange={(e) => features.canRemoveWatermark && onWatermarkChange(e.target.checked)}
                disabled={!features.canRemoveWatermark}
                className="sr-only"
              />
              <div
                className={`
                  w-8 h-5 border-2 border-black relative
                  ${!features.canRemoveWatermark ? 'opacity-50' : ''}
                `}
                style={{ backgroundColor: hasWatermark ? '#1D3354' : '#FFFFFF' }}
              >
                <span
                  className={`
                    absolute top-[1px] left-[1px] w-3 h-3 border border-black transition-transform
                    ${hasWatermark ? 'translate-x-3' : ''}
                  `}
                  style={{ backgroundColor: '#FFFFFF' }}
                />
              </div>
            </label>
          </div>

          {/* Resolution badge */}
          <span
            className="px-2 py-0.5 border border-black font-bold text-[10px]"
            style={{ backgroundColor: features.resolution === '4K' ? '#9ED8DB' : '#FFFFFF' }}
          >
            {features.resolution}
          </span>
        </div>

        {!isPremium && (
          <button
            onClick={onUpgradeClick}
            className="flex items-center gap-1 text-[10px] font-bold hover:opacity-80 transition-opacity"
            style={{ color: '#1D3354' }}
          >
            <Crown className="w-3 h-3" />
            PRO
          </button>
        )}
      </div>
    </div>
  )
}
