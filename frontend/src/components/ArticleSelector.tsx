import { useState } from 'react'
import { Check, Plus, GripVertical, X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'
import type { VintedItem } from '../types/vinted'

const API_URL = import.meta.env.VITE_SCRAPER_API_URL || 'http://localhost:3000'

interface ArticleSelectorProps {
  items: VintedItem[]
  selectedItems: Set<string>
  onToggleItem: (itemId: string) => void
  onSelectAll: () => void
  onDeselectAll: () => void
  maxItems: number
  plan: 'free' | 'pro' | 'business'
  onUpgradeClick?: () => void
  // Profile screenshot props (optional)
  profileScreenshotUrl?: string | null
  includeProfileScreenshot?: boolean
  onToggleProfileScreenshot?: () => void
  onPreviewScreenshot?: () => void
  username?: string
}

// Plan-based article limits
export const ARTICLE_LIMITS = {
  free: 5,
  pro: 10,
  business: 20,
} as const

// Items per page for desktop pagination (5 rows of 6 columns = 30)
const ITEMS_PER_PAGE = 30

export function ArticleSelector({
  items,
  selectedItems,
  onToggleItem,
  onSelectAll,
  onDeselectAll,
  maxItems,
  plan,
  onUpgradeClick,
  profileScreenshotUrl,
  includeProfileScreenshot = false,
  onToggleProfileScreenshot,
  onPreviewScreenshot,
  username,
}: ArticleSelectorProps) {
  const planLimit = ARTICLE_LIMITS[plan]
  const effectiveMax = Math.min(maxItems, planLimit)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedItems = items.slice(startIndex, endIndex)

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

      {/* Articles Grid - No scroll, pagination instead */}
      <div className="flex-1">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {/* Profile Screenshot Card - First position on page 1 */}
          {currentPage === 1 && profileScreenshotUrl && onToggleProfileScreenshot && onPreviewScreenshot && (
            <ProfileScreenshotCard
              screenshotUrl={profileScreenshotUrl}
              username={username}
              isIncluded={includeProfileScreenshot}
              onToggle={onToggleProfileScreenshot}
              onPreview={onPreviewScreenshot}
            />
          )}

          {paginatedItems.map((item) => {
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-4 pt-4 border-t-2 border-black/10">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-8 h-8 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            style={{ backgroundColor: '#FFFFFF' }}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 border-2 border-black font-display font-bold text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all ${
                  currentPage === page
                    ? ''
                    : 'hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                }`}
                style={{
                  backgroundColor: currentPage === page ? '#1D3354' : '#FFFFFF',
                  color: currentPage === page ? '#FFFFFF' : '#000000',
                }}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="w-8 h-8 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            style={{ backgroundColor: '#FFFFFF' }}
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <span className="text-xs text-black/50 font-body ml-2">
            {startIndex + 1}-{Math.min(endIndex, items.length)} sur {items.length}
          </span>
        </div>
      )}
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

// Profile Screenshot Card for desktop grid
interface ProfileScreenshotCardProps {
  screenshotUrl: string
  username?: string
  isIncluded: boolean
  onToggle: () => void
  onPreview: () => void
}

function ProfileScreenshotCard({ screenshotUrl, username, isIncluded, onToggle, onPreview }: ProfileScreenshotCardProps) {
  const fullUrl = screenshotUrl.startsWith('http') ? screenshotUrl : `${API_URL}${screenshotUrl}`

  return (
    <div
      className={`
        border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] overflow-hidden
        transition-all
        ${isIncluded ? 'ring-2 ring-offset-1 ring-[#1D3354]' : ''}
        hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]
      `}
      style={{ backgroundColor: '#1D3354' }}
    >
      {/* Image - 9:16 aspect ratio for screenshot */}
      <div
        className="aspect-square relative overflow-hidden cursor-pointer group"
        style={{ backgroundColor: '#000' }}
        onClick={onPreview}
      >
        <img
          src={fullUrl}
          alt="Screenshot profil Vinted"
          className={`w-full h-full object-cover object-top ${!isIncluded ? 'opacity-50 grayscale' : ''}`}
          loading="lazy"
        />

        {/* Zoom overlay on hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <ZoomIn className="w-6 h-6 text-white" />
        </div>

        {/* Selection indicator */}
        <div
          className="absolute top-1.5 right-1.5 w-6 h-6 border-2 border-black flex items-center justify-center font-bold text-xs transition-colors shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
          style={{ backgroundColor: isIncluded ? '#9ED8DB' : '#FFFFFF' }}
          onClick={(e) => { e.stopPropagation(); onToggle(); }}
        >
          {isIncluded ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
        </div>

        {/* INTRO badge */}
        <div
          className="absolute bottom-1.5 left-1.5 border-2 border-black px-2 py-0.5"
          style={{ backgroundColor: '#9ED8DB' }}
        >
          <span className="font-bold text-black text-xs">INTRO</span>
        </div>

        {/* Selected overlay */}
        {isIncluded && (
          <div className="absolute inset-0 bg-[#9ED8DB]/20 pointer-events-none" />
        )}
      </div>

      {/* Info */}
      <div className="p-2 border-t-2 border-black" style={{ backgroundColor: '#FFFFFF' }}>
        <h4 className="font-display font-bold text-black truncate text-xs" title="Aperçu Profil">
          Aperçu Profil
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
