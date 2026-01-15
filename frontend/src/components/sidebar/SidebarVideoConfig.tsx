import { Settings, Layout, Music, Type, Stamp, Lock, Crown, ChevronDown } from 'lucide-react'
import type { VideoTemplate } from '../../types/vinted'

interface SidebarVideoConfigProps {
  musicTrack: string
  template: string
  customText: string
  hasWatermark: boolean
  plan: 'free' | 'pro' | 'business'
  onMusicChange?: (track: string) => void
  onTemplateChange?: (template: VideoTemplate) => void
  onCustomTextChange?: (text: string) => void
  onWatermarkChange?: (hasWatermark: boolean) => void
  onUpgradeClick?: () => void
}

const templateOptions = [
  { id: 'classic' as VideoTemplate, name: 'Classique', color: '#FFFFFF', textColor: '#000' },
  { id: 'modern' as VideoTemplate, name: 'Moderne', color: '#9ED8DB', textColor: '#000' },
  { id: 'premium' as VideoTemplate, name: 'Premium', color: '#D64045', textColor: '#FFF' },
]

const musicOptions = [
  { id: '', name: 'Sans musique', emoji: '🔇' },
  { id: 'upbeat', name: 'Upbeat', emoji: '🎵' },
  { id: 'chill', name: 'Chill', emoji: '🎶' },
  { id: 'fashion', name: 'Fashion', emoji: '✨' },
  { id: 'trendy', name: 'Trendy', emoji: '🔥' },
]

export function SidebarVideoConfig({
  musicTrack,
  template,
  customText,
  hasWatermark,
  plan,
  onMusicChange,
  onTemplateChange,
  onCustomTextChange,
  onWatermarkChange,
  onUpgradeClick,
}: SidebarVideoConfigProps) {
  const isPremium = plan === 'pro' || plan === 'business'

  return (
    <div className="border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Header */}
      <div className="px-4 py-3 border-b-2 border-black flex items-center gap-2" style={{ backgroundColor: '#1D3354' }}>
        <Settings className="w-4 h-4 text-white" />
        <span className="font-display font-bold text-sm text-white">CONFIGURATION</span>
      </div>

      <div className="p-4 space-y-5">
        {/* Template Selection */}
        <ConfigSection icon={<Layout className="w-4 h-4" />} label="Style de video">
          <div className="grid grid-cols-3 gap-2">
            {templateOptions.map((t) => {
              const isAvailable = plan !== 'free' || t.id === 'classic'
              const isSelected = template === t.id
              return (
                <button
                  key={t.id}
                  onClick={() => isAvailable && onTemplateChange?.(t.id)}
                  disabled={!isAvailable}
                  className={`
                    relative py-2.5 border-2 border-black font-display font-bold text-xs transition-all
                    ${isSelected ? 'shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] -translate-x-0.5 -translate-y-0.5' : 'shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5'}
                    ${!isAvailable ? 'opacity-40 cursor-not-allowed' : ''}
                  `}
                  style={{ backgroundColor: t.color, color: t.textColor }}
                >
                  {t.name}
                  {!isAvailable && (
                    <Lock className="absolute top-1 right-1 w-3 h-3" />
                  )}
                </button>
              )
            })}
          </div>
          {plan === 'free' && (
            <p className="text-[10px] text-black/50 mt-2 flex items-center gap-1">
              <Lock className="w-3 h-3" />
              Templates Moderne et Premium disponibles en Pro
            </p>
          )}
        </ConfigSection>

        {/* Music Selection */}
        <ConfigSection icon={<Music className="w-4 h-4" />} label="Musique de fond">
          <div className="relative">
            <select
              value={musicTrack}
              onChange={(e) => onMusicChange?.(e.target.value)}
              className="w-full px-4 py-2.5 border-2 border-black font-body text-sm appearance-none cursor-pointer bg-white text-black hover:bg-gray-50 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              {musicOptions.map((track) => (
                <option key={track.id} value={track.id}>
                  {track.emoji} {track.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-black pointer-events-none" />
          </div>
        </ConfigSection>

        {/* Custom Text */}
        <ConfigSection icon={<Type className="w-4 h-4" />} label="Texte promotionnel">
          <input
            type="text"
            value={customText}
            onChange={(e) => onCustomTextChange?.(e.target.value)}
            placeholder="Ex: -20% ce week-end !"
            maxLength={30}
            className="w-full px-4 py-2.5 border-2 border-black font-body text-sm bg-white text-black placeholder:text-black/40 hover:bg-gray-50 focus:bg-gray-50 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          />
          <p className="text-[10px] text-black/40 mt-1.5 text-right">
            {customText.length}/30 caracteres
          </p>
        </ConfigSection>

        {/* Watermark Toggle */}
        <ConfigSection icon={<Stamp className="w-4 h-4" />} label="Filigrane VintBoost">
          <div
            className="flex items-center justify-between p-3 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            style={{ backgroundColor: '#F8F8F8' }}
          >
            <div className="flex-1">
              <p className="font-display font-bold text-xs text-black">
                {hasWatermark ? 'Avec filigrane' : 'Sans filigrane'}
              </p>
              <p className="text-[10px] text-black/50 mt-0.5">
                {isPremium
                  ? 'Vous pouvez desactiver le filigrane'
                  : 'Passez Pro pour retirer le filigrane'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {!isPremium && (
                <button
                  onClick={onUpgradeClick}
                  className="flex items-center gap-1 px-2.5 py-1.5 bg-[#D64045] border-2 border-black text-[10px] font-bold text-white hover:bg-[#c53539] transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5"
                >
                  <Crown className="w-3 h-3" />
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
                  className={`w-12 h-6 border-2 border-black relative transition-all ${!isPremium ? 'opacity-50 cursor-not-allowed' : ''}`}
                  style={{ backgroundColor: hasWatermark ? '#9ED8DB' : '#E8DFD5' }}
                >
                  <span
                    className={`absolute top-[3px] left-[3px] w-4 h-4 bg-[#1D3354] transition-transform ${hasWatermark ? 'translate-x-[22px]' : ''}`}
                  />
                </div>
              </label>
            </div>
          </div>
        </ConfigSection>

        {/* Technical Specs */}
        <div className="flex items-center justify-between pt-3 border-t border-black/10">
          <span className="text-xs text-black/50 font-body">Specifications</span>
          <div className="flex items-center gap-1.5">
            <SpecBadge label={plan === 'business' ? '4K' : '1080p'} highlight={plan === 'business'} />
            <SpecBadge label="MP4" />
            <SpecBadge label="9:16" />
          </div>
        </div>
      </div>
    </div>
  )
}

function ConfigSection({
  icon,
  label,
  children
}: {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2.5">
        <span className="text-black/50">{icon}</span>
        <span className="font-display font-bold text-xs text-black/70">{label}</span>
      </div>
      {children}
    </div>
  )
}

function SpecBadge({ label, highlight = false }: { label: string; highlight?: boolean }) {
  return (
    <span
      className="px-2 py-1 border border-black text-[10px] font-display font-bold"
      style={{ backgroundColor: highlight ? '#9ED8DB' : '#F5F5F5' }}
    >
      {label}
    </span>
  )
}
