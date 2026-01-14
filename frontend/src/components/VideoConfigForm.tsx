import { useRef } from 'react'
import {
  Music,
  Layout,
  Type,
  Stamp,
  Lock,
  Upload,
  Crown,
  ChevronDown,
  Monitor,
  Smartphone,
  Square,
} from 'lucide-react'
import type { VideoResolution, VideoAspectRatio, VideoTemplate } from '../types/vinted'

interface VideoConfigFormProps {
  musicTrack: string
  onMusicChange: (track: string) => void
  template: VideoTemplate
  onTemplateChange: (template: VideoTemplate) => void
  customText: string
  onCustomTextChange: (text: string) => void
  hasWatermark: boolean
  onWatermarkChange: (hasWatermark: boolean) => void
  resolution: VideoResolution
  onResolutionChange: (resolution: VideoResolution) => void
  aspectRatio: VideoAspectRatio
  onAspectRatioChange: (ratio: VideoAspectRatio) => void
  plan: 'free' | 'pro' | 'business'
  username?: string
  onUpgradeClick?: () => void
  compact?: boolean // For desktop 2-column layout
}

// Plan-based restrictions
export const PLAN_FEATURES = {
  free: {
    templates: ['classic'] as VideoTemplate[],
    resolutions: ['1080p'] as VideoResolution[],
    aspectRatios: ['9:16'] as VideoAspectRatio[],
    canUploadMusic: false,
    canRemoveWatermark: false,
  },
  pro: {
    templates: ['classic', 'modern', 'premium'] as VideoTemplate[],
    resolutions: ['720p', '1080p'] as VideoResolution[],
    aspectRatios: ['9:16', '16:9', '1:1'] as VideoAspectRatio[],
    canUploadMusic: true,
    canRemoveWatermark: true,
  },
  business: {
    templates: ['classic', 'modern', 'premium'] as VideoTemplate[],
    resolutions: ['720p', '1080p', '4K'] as VideoResolution[],
    aspectRatios: ['9:16', '16:9', '1:1'] as VideoAspectRatio[],
    canUploadMusic: true,
    canRemoveWatermark: true,
  },
} as const

const aspectRatioOptions = [
  { id: '9:16' as VideoAspectRatio, name: 'Vertical', icon: Smartphone, description: 'TikTok' },
  { id: '16:9' as VideoAspectRatio, name: 'Horizontal', icon: Monitor, description: 'YouTube' },
  { id: '1:1' as VideoAspectRatio, name: 'Carre', icon: Square, description: 'Instagram' },
]

const resolutionOptions = [
  { id: '720p' as VideoResolution, name: '720p' },
  { id: '1080p' as VideoResolution, name: '1080p' },
  { id: '4K' as VideoResolution, name: '4K' },
]

const musicTracks = [
  { id: '', name: 'Sans musique' },
  { id: 'upbeat', name: 'Upbeat Energy' },
  { id: 'chill', name: 'Chill Vibes' },
  { id: 'fashion', name: 'Fashion Forward' },
  { id: 'trendy', name: 'Trendy Beat' },
  { id: 'summer', name: 'Summer Days' },
  { id: 'elegant', name: 'Elegant Style' },
]

const templates: { id: VideoTemplate; name: string; color: string; premium: boolean }[] = [
  { id: 'classic', name: 'Classique', color: '#1D3354', premium: false },
  { id: 'modern', name: 'Moderne', color: '#9ED8DB', premium: true },
  { id: 'premium', name: 'Premium', color: '#D64045', premium: true },
]

export function VideoConfigForm({
  musicTrack,
  onMusicChange,
  template,
  onTemplateChange,
  customText,
  onCustomTextChange,
  hasWatermark,
  onWatermarkChange,
  resolution,
  onResolutionChange,
  aspectRatio,
  onAspectRatioChange,
  plan,
  username,
  onUpgradeClick,
  compact = false,
}: VideoConfigFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const features = PLAN_FEATURES[plan]
  const isPremium = plan === 'pro' || plan === 'business'

  // Compact 2-column layout for desktop
  if (compact) {
    return (
      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
        {/* Left Column */}
        <div className="space-y-3">
          {/* Template */}
          <div>
            <label className="flex items-center gap-1.5 font-display font-bold text-[10px] text-black mb-1.5">
              <Layout className="w-3 h-3" />
              TEMPLATE
            </label>
            <div className="flex gap-1">
              {templates.map((t) => {
                const isAvailable = (features.templates as readonly string[]).includes(t.id)
                const isSelected = template === t.id
                return (
                  <button
                    key={t.id}
                    onClick={() => isAvailable && onTemplateChange(t.id)}
                    disabled={!isAvailable}
                    className={`
                      relative flex-1 flex items-center justify-center gap-1 py-1.5 border-2 border-black
                      ${isSelected ? 'ring-1 ring-[#1D3354]' : ''}
                      ${!isAvailable ? 'opacity-40 cursor-not-allowed' : ''}
                    `}
                    style={{ backgroundColor: '#FFFFFF' }}
                  >
                    <div
                      className="w-3 h-3 border border-black"
                      style={{ backgroundColor: t.color }}
                    />
                    <span className="font-bold text-[9px]">{t.name}</span>
                    {t.premium && !isAvailable && (
                      <Lock className="w-2 h-2 text-black/40" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Music */}
          <div>
            <label className="flex items-center gap-1.5 font-display font-bold text-[10px] text-black mb-1.5">
              <Music className="w-3 h-3" />
              MUSIQUE
            </label>
            <div className="relative">
              <select
                value={musicTrack}
                onChange={(e) => onMusicChange(e.target.value)}
                className="w-full px-2 py-1.5 border-2 border-black font-body text-xs appearance-none cursor-pointer pr-8"
                style={{ backgroundColor: '#FFFFFF' }}
              >
                {musicTracks.map((track) => (
                  <option key={track.id} value={track.id}>
                    {track.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none" />
            </div>
          </div>

          {/* Custom Text */}
          <div>
            <label className="flex items-center gap-1.5 font-display font-bold text-[10px] text-black mb-1.5">
              <Type className="w-3 h-3" />
              ACCROCHE
              {username && (
                <span className="font-normal text-black/50 text-[9px]">(@{username})</span>
              )}
            </label>
            <input
              type="text"
              value={customText}
              onChange={(e) => onCustomTextChange(e.target.value)}
              placeholder="SOLDES -50%..."
              maxLength={50}
              className="w-full px-2 py-1.5 border-2 border-black font-body text-xs placeholder:text-black/40"
              style={{ backgroundColor: '#FFFFFF' }}
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-3">
          {/* Aspect Ratio */}
          <div>
            <label className="flex items-center gap-1.5 font-display font-bold text-[10px] text-black mb-1.5">
              <Monitor className="w-3 h-3" />
              FORMAT
            </label>
            <div className="flex gap-1">
              {aspectRatioOptions.map((opt) => {
                const isAvailable = features.aspectRatios.includes(opt.id)
                const isSelected = aspectRatio === opt.id
                const Icon = opt.icon
                return (
                  <button
                    key={opt.id}
                    onClick={() => isAvailable && onAspectRatioChange(opt.id)}
                    disabled={!isAvailable}
                    className={`
                      relative flex-1 flex flex-col items-center py-1.5 border-2 border-black
                      ${isSelected ? 'ring-1 ring-[#1D3354]' : ''}
                      ${!isAvailable ? 'opacity-40 cursor-not-allowed' : ''}
                    `}
                    style={{ backgroundColor: isSelected ? '#9ED8DB' : '#FFFFFF' }}
                  >
                    <Icon className="w-3 h-3" />
                    <span className="font-bold text-[8px]">{opt.name}</span>
                    {!isAvailable && <Lock className="absolute -top-1 -right-1 w-2 h-2" />}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Resolution */}
          <div>
            <label className="flex items-center gap-1.5 font-display font-bold text-[10px] text-black mb-1.5">
              RESOLUTION
            </label>
            <div className="flex gap-1">
              {resolutionOptions.map((opt) => {
                const isAvailable = features.resolutions.includes(opt.id)
                const isSelected = resolution === opt.id
                return (
                  <button
                    key={opt.id}
                    onClick={() => isAvailable && onResolutionChange(opt.id)}
                    disabled={!isAvailable}
                    className={`
                      relative flex-1 py-1.5 border-2 border-black font-display font-bold text-[9px]
                      ${!isAvailable ? 'opacity-40 cursor-not-allowed' : ''}
                    `}
                    style={{ backgroundColor: isSelected ? '#9ED8DB' : '#FFFFFF' }}
                  >
                    {opt.name}
                    {!isAvailable && <Lock className="absolute -top-1 -right-1 w-2 h-2" />}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Watermark */}
          <div>
            <label className="flex items-center gap-1.5 font-display font-bold text-[10px] text-black mb-1.5">
              WATERMARK
            </label>
            <div
              className="flex items-center gap-2 px-2 py-1.5 border-2 border-black"
              style={{ backgroundColor: isPremium ? '#FFFFFF' : '#F5F5F5' }}
            >
              <Stamp className="w-3 h-3" />
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
                    w-7 h-4 border-2 border-black relative
                    ${!features.canRemoveWatermark ? 'opacity-50' : ''}
                  `}
                  style={{ backgroundColor: hasWatermark ? '#1D3354' : '#FFFFFF' }}
                >
                  <span
                    className={`
                      absolute top-[1px] left-[1px] w-2.5 h-2.5 border border-black transition-transform
                      ${hasWatermark ? 'translate-x-2.5' : ''}
                    `}
                    style={{ backgroundColor: '#FFFFFF' }}
                  />
                </div>
              </label>
              <span className="text-[9px] font-bold">{hasWatermark ? 'ON' : 'OFF'}</span>
              {!features.canRemoveWatermark && (
                <button
                  onClick={onUpgradeClick}
                  className="flex items-center gap-0.5 text-[9px] font-bold hover:opacity-80 transition-opacity ml-auto"
                  style={{ color: '#1D3354' }}
                >
                  <Crown className="w-2.5 h-2.5" />
                  PRO
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Standard vertical layout (for mobile)
  return (
    <div className="space-y-4">
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

      {/* Aspect Ratio */}
      <div>
        <label className="flex items-center gap-2 font-display font-bold text-xs text-black mb-2">
          <Monitor className="w-4 h-4" />
          FORMAT
        </label>
        <div className="flex gap-2">
          {aspectRatioOptions.map((opt) => {
            const isAvailable = features.aspectRatios.includes(opt.id)
            const isSelected = aspectRatio === opt.id
            const Icon = opt.icon
            return (
              <button
                key={opt.id}
                onClick={() => isAvailable && onAspectRatioChange(opt.id)}
                disabled={!isAvailable}
                className={`
                  relative flex-1 flex flex-col items-center gap-1 py-2 border-2 border-black
                  ${isSelected ? 'ring-2 ring-[#1D3354]' : ''}
                  ${!isAvailable ? 'opacity-40 cursor-not-allowed' : ''}
                `}
                style={{ backgroundColor: isSelected ? '#9ED8DB' : '#FFFFFF' }}
              >
                <Icon className="w-4 h-4" />
                <span className="font-bold text-[10px]">{opt.name}</span>
                <span className="text-[8px] text-black/50">{opt.description}</span>
                {!isAvailable && <Lock className="absolute -top-1 -right-1 w-2.5 h-2.5" />}
              </button>
            )
          })}
        </div>
      </div>

      {/* Resolution & Watermark Row */}
      <div className="flex gap-3">
        {/* Resolution */}
        <div className="flex-1">
          <label className="flex items-center gap-2 font-display font-bold text-xs text-black mb-2">
            RESOLUTION
          </label>
          <div className="flex gap-1">
            {resolutionOptions.map((opt) => {
              const isAvailable = features.resolutions.includes(opt.id)
              const isSelected = resolution === opt.id
              return (
                <button
                  key={opt.id}
                  onClick={() => isAvailable && onResolutionChange(opt.id)}
                  disabled={!isAvailable}
                  className={`
                    relative flex-1 py-1.5 border-2 border-black font-display font-bold text-[10px]
                    ${!isAvailable ? 'opacity-40 cursor-not-allowed' : ''}
                  `}
                  style={{ backgroundColor: isSelected ? '#9ED8DB' : '#FFFFFF' }}
                >
                  {opt.name}
                  {!isAvailable && <Lock className="absolute -top-1 -right-1 w-2 h-2" />}
                </button>
              )
            })}
          </div>
        </div>

        {/* Watermark toggle */}
        <div>
          <label className="flex items-center gap-2 font-display font-bold text-xs text-black mb-2">
            WATERMARK
          </label>
          <div
            className="flex items-center gap-2 px-3 py-1.5 border-2 border-black"
            style={{ backgroundColor: isPremium ? '#FFFFFF' : '#F5F5F5' }}
          >
            <Stamp className="w-4 h-4" />
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
            {!features.canRemoveWatermark && (
              <button
                onClick={onUpgradeClick}
                className="flex items-center gap-1 text-[10px] font-bold hover:opacity-80 transition-opacity"
                style={{ color: '#1D3354' }}
              >
                <Crown className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
