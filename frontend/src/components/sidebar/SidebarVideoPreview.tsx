import { Film, ImageIcon } from 'lucide-react'
import type { VintedItem } from '../../types/vinted'

const API_URL = import.meta.env.VITE_SCRAPER_API_URL || 'http://localhost:3000'

interface SidebarVideoPreviewProps {
  selectedArticles: VintedItem[]
  profileScreenshotUrl?: string | null
  includeProfileScreenshot?: boolean
}

export function SidebarVideoPreview({
  selectedArticles,
  profileScreenshotUrl,
  includeProfileScreenshot = false,
}: SidebarVideoPreviewProps) {
  const totalValue = selectedArticles.reduce(
    (sum, item) => sum + (parseFloat(item.price) || 0),
    0
  )

  const fullScreenshotUrl = profileScreenshotUrl
    ? (profileScreenshotUrl.startsWith('http') ? profileScreenshotUrl : `${API_URL}${profileScreenshotUrl}`)
    : null

  const hasIntro = fullScreenshotUrl && includeProfileScreenshot
  const totalScenes = selectedArticles.length + (hasIntro ? 1 : 0)

  return (
    <div className="border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Header */}
      <div className="px-4 py-3 border-b-2 border-black flex items-center justify-between" style={{ backgroundColor: '#9ED8DB' }}>
        <div className="flex items-center gap-2">
          <Film className="w-4 h-4" />
          <span className="font-display font-bold text-sm">APERÇU VIDEO</span>
        </div>
        <span className="font-display font-bold text-xs px-2 py-0.5 border-2 border-black bg-white">
          {totalScenes} scenes
        </span>
      </div>

      {/* Preview Grid */}
      <div className="p-4">
        {selectedArticles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-16 h-16 border-2 border-dashed border-black/30 flex items-center justify-center mb-3" style={{ backgroundColor: '#F5F5F5' }}>
              <ImageIcon className="w-8 h-8 text-black/30" />
            </div>
            <p className="font-display font-bold text-sm text-black/50">Aucun article</p>
            <p className="text-xs text-black/40 mt-1">Selectionne des articles pour creer ta video</p>
          </div>
        ) : (
          <>
            {/* Thumbnails Grid */}
            <div className="flex flex-wrap gap-2">
              {/* Intro thumbnail */}
              {hasIntro && (
                <div className="relative">
                  <div
                    className="w-14 h-14 border-2 border-black overflow-hidden"
                    style={{ backgroundColor: '#1D3354' }}
                  >
                    <img
                      src={fullScreenshotUrl}
                      alt="Intro"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 text-[8px] font-bold border border-black bg-[#9ED8DB]">
                    INTRO
                  </span>
                </div>
              )}

              {/* Article thumbnails */}
              {selectedArticles.slice(0, hasIntro ? 6 : 7).map((item, index) => (
                <div key={item.id} className="relative">
                  <div className="w-14 h-14 border-2 border-black overflow-hidden bg-gray-100">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 flex items-center justify-center text-[9px] font-bold border border-black bg-white">
                    {index + 1 + (hasIntro ? 1 : 0)}
                  </span>
                </div>
              ))}

              {/* More indicator */}
              {selectedArticles.length > (hasIntro ? 6 : 7) && (
                <div
                  className="w-14 h-14 border-2 border-black flex items-center justify-center"
                  style={{ backgroundColor: '#E8DFD5' }}
                >
                  <span className="font-display font-bold text-sm">
                    +{selectedArticles.length - (hasIntro ? 6 : 7)}
                  </span>
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="flex items-center gap-3 mt-4 pt-3 border-t border-black/10">
              <div className="flex-1">
                <p className="text-xs text-black/60 font-body">
                  {hasIntro && <span className="font-bold text-[#1D3354]">1 intro + </span>}
                  <span className="font-bold text-black">{selectedArticles.length}</span> articles
                </p>
              </div>
              <div className="px-3 py-1 border-2 border-black" style={{ backgroundColor: '#1D3354' }}>
                <span className="font-display font-bold text-sm text-white">{totalValue.toFixed(0)}€</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
