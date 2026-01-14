import { Check, Plus, GripVertical, X, User } from 'lucide-react'
import type { VintedItem } from '../types/vinted'

interface ArticleSelectorProps {
  items: VintedItem[]
  selectedItems: Set<string>
  onToggleItem: (itemId: string) => void
  onSelectAll: () => void
  onDeselectAll: () => void
  maxItems: number
  plan: 'free' | 'pro' | 'business'
  onUpgradeClick?: () => void
  // Profile picture props
  profilePictureUrl?: string
  includeProfilePicture?: boolean
  onToggleProfilePicture?: () => void
  username?: string
}

// Plan-based article limits
export const ARTICLE_LIMITS = {
  free: 5,
  pro: 10,
  business: 20,
} as const

export function ArticleSelector({
  items,
  selectedItems,
  onToggleItem,
  onSelectAll,
  onDeselectAll,
  maxItems,
  plan,
  onUpgradeClick,
  profilePictureUrl,
  includeProfilePicture = false,
  onToggleProfilePicture,
  username,
}: ArticleSelectorProps) {
  const planLimit = ARTICLE_LIMITS[plan]
  const effectiveMax = Math.min(maxItems, planLimit)

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-black/10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span
              className="text-2xl font-display font-bold"
              style={{ color: '#1D3354' }}
            >
              {selectedItems.size}
            </span>
            <span className="text-sm text-black/40 font-display">
              /{effectiveMax}
            </span>
          </div>
          <span className="text-xs text-black/50 font-body">
            articles selectionnes
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onSelectAll}
            disabled={selectedItems.size >= effectiveMax}
            className="text-xs font-bold font-display px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#9ED8DB' }}
          >
            TOUT
          </button>
          <button
            onClick={onDeselectAll}
            disabled={selectedItems.size === 0}
            className="text-xs font-bold text-black/70 font-display px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#FFFFFF' }}
          >
            AUCUN
          </button>
        </div>
      </div>

      {/* Plan Limit Warning */}
      {plan === 'free' && (
        <div
          className="mb-3 px-3 py-2 border-2 border-black text-xs font-body"
          style={{ backgroundColor: '#9ED8DB' }}
        >
          <span className="font-bold">Plan Free :</span> {planLimit} articles max.{' '}
          <button
            onClick={onUpgradeClick}
            className="underline font-bold hover:opacity-80 transition-opacity"
            style={{ color: '#1D3354' }}
          >
            Passer a Pro
          </button>{' '}
          pour {ARTICLE_LIMITS.pro} articles.
        </div>
      )}

      {/* Articles Grid */}
      <div className="flex-1 overflow-y-auto max-h-[400px]">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {/* Profile Picture Card - First position */}
          {profilePictureUrl && onToggleProfilePicture && (
            <ProfilePictureCard
              imageUrl={profilePictureUrl}
              username={username}
              isSelected={includeProfilePicture}
              onToggle={onToggleProfilePicture}
            />
          )}

          {items.map((item) => {
            const isSelected = selectedItems.has(item.id)
            const isDisabled = !isSelected && selectedItems.size >= effectiveMax

            return (
              <ArticleCard
                key={item.id}
                item={item}
                isSelected={isSelected}
                isDisabled={isDisabled}
                onToggle={() => onToggleItem(item.id)}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Profile Picture Card Component
interface ProfilePictureCardProps {
  imageUrl: string
  username?: string
  isSelected: boolean
  onToggle: () => void
}

function ProfilePictureCard({ imageUrl, username, isSelected, onToggle }: ProfilePictureCardProps) {
  return (
    <div
      className={`
        border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] overflow-hidden
        transition-all cursor-pointer
        active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]
        ${isSelected ? 'ring-2 ring-offset-1 ring-[#1D3354]' : ''}
        hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]
      `}
      style={{ backgroundColor: '#9ED8DB' }}
      onClick={onToggle}
    >
      {/* Image */}
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
            <User className="w-12 h-12 text-black/30" />
          </div>
        )}

        {/* Selection indicator */}
        <div
          className="absolute top-1.5 right-1.5 w-6 h-6 border-2 border-black flex items-center justify-center font-bold text-xs transition-colors shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
          style={{ backgroundColor: isSelected ? '#9ED8DB' : '#FFFFFF' }}
        >
          {isSelected ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
        </div>

        {/* Intro badge */}
        <div
          className="absolute bottom-1.5 left-1.5 border-2 border-black px-2 py-0.5"
          style={{ backgroundColor: '#1D3354' }}
        >
          <span className="font-bold text-white text-[10px]">INTRO</span>
        </div>

        {/* Selected overlay */}
        {isSelected && (
          <div className="absolute inset-0 bg-[#1D3354]/10 pointer-events-none" />
        )}
      </div>

      {/* Info */}
      <div className="p-2 border-t-2 border-black" style={{ backgroundColor: '#FFFFFF' }}>
        <h4 className="font-display font-bold text-black truncate text-xs">
          Photo de profil
        </h4>
        {username && (
          <p className="text-[10px] font-bold truncate" style={{ color: '#1D3354' }}>
            @{username}
          </p>
        )}
      </div>
    </div>
  )
}

interface ArticleCardProps {
  item: VintedItem
  isSelected: boolean
  isDisabled: boolean
  onToggle: () => void
}

function ArticleCard({ item, isSelected, isDisabled, onToggle }: ArticleCardProps) {
  return (
    <div
      className={`
        border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] overflow-hidden
        transition-all cursor-pointer
        active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]
        ${isSelected ? 'ring-2 ring-offset-1 ring-[#1D3354]' : ''}
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'}
      `}
      style={{ backgroundColor: '#FFFFFF' }}
      onClick={() => !isDisabled && onToggle()}
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

        {/* Selection indicator */}
        <div
          className="absolute top-1.5 right-1.5 w-6 h-6 border-2 border-black flex items-center justify-center font-bold text-xs transition-colors shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
          style={{ backgroundColor: isSelected ? '#9ED8DB' : '#FFFFFF' }}
        >
          {isSelected ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
        </div>

        {/* Price */}
        <div
          className="absolute bottom-1.5 left-1.5 border-2 border-black px-2 py-0.5"
          style={{ backgroundColor: '#1D3354' }}
        >
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
          <p className="text-[10px] font-bold truncate" style={{ color: '#1D3354' }}>
            {item.brand}
          </p>
        )}
      </div>
    </div>
  )
}

// Compact list view for mobile
interface ArticleListItemProps {
  item: VintedItem
  isSelected: boolean
  isDisabled: boolean
  onToggle: () => void
  onRemove?: () => void
}

export function ArticleListItem({ item, isSelected, isDisabled, onToggle, onRemove }: ArticleListItemProps) {
  return (
    <div
      className={`
        flex items-center gap-3 p-2 border-2 border-black
        transition-all
        ${isSelected ? 'bg-[#9ED8DB]/20' : 'bg-white'}
        ${isDisabled ? 'opacity-50' : ''}
      `}
    >
      {/* Drag handle (for reordering) */}
      {isSelected && (
        <GripVertical className="w-4 h-4 text-black/30 cursor-grab flex-shrink-0" />
      )}

      {/* Thumbnail */}
      <div
        className="w-12 h-12 border border-black flex-shrink-0 overflow-hidden"
        onClick={() => !isDisabled && onToggle()}
      >
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-[8px] text-black/30">
            NO IMG
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0" onClick={() => !isDisabled && onToggle()}>
        <p className="font-display font-bold text-xs truncate">{item.title}</p>
        <p className="text-[10px] text-black/50">{item.brand || 'Sans marque'}</p>
      </div>

      {/* Price */}
      <div
        className="px-2 py-1 border border-black text-xs font-bold flex-shrink-0"
        style={{ backgroundColor: '#1D3354', color: 'white' }}
      >
        {item.price}€
      </div>

      {/* Selection/Remove */}
      {onRemove ? (
        <button
          onClick={onRemove}
          className="w-6 h-6 border border-black flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: '#D64045' }}
        >
          <X className="w-3 h-3 text-white" />
        </button>
      ) : (
        <div
          className={`
            w-6 h-6 border border-black flex items-center justify-center flex-shrink-0 cursor-pointer
            ${isSelected ? 'bg-[#9ED8DB]' : 'bg-white'}
          `}
          onClick={() => !isDisabled && onToggle()}
        >
          {isSelected ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
        </div>
      )}
    </div>
  )
}
