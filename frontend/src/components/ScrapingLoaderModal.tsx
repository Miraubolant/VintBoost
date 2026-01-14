import { useState, useEffect } from 'react'
import { Loader2, ExternalLink, Camera, Sparkles, Zap, TrendingUp } from 'lucide-react'

const messages = [
  'Connexion a Vinted...',
  'Recuperation du vestiaire...',
  'Analyse des articles...',
  'Chargement des images...',
  'Presque termine...',
]

// VintDress Color Palette
const VINTDRESS_COLORS = {
  primary: '#09B1BA',
  background: '#FFF8E7',
  accent: '#FFB3BA',
}

export function ScrapingLoaderModal() {
  const [messageIndex, setMessageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
    >
      {/* Single unified card */}
      <div
        className="w-full max-w-sm border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
        style={{ backgroundColor: '#FFFFFF' }}
      >
        {/* Loader Section */}
        <div className="p-5 border-b-2 border-black">
          {/* Loader Icon */}
          <div className="flex justify-center mb-3">
            <div
              className="w-14 h-14 border-3 border-black flex items-center justify-center"
              style={{ backgroundColor: '#1D3354' }}
            >
              <Loader2 className="w-7 h-7 text-white animate-spin" />
            </div>
          </div>

          {/* Title */}
          <h3 className="font-display font-bold text-base text-center mb-1">
            CHARGEMENT
          </h3>

          {/* Message */}
          <p className="font-body text-sm text-center text-black/70 mb-3">
            {messages[messageIndex]}
          </p>

          {/* Progress dots */}
          <div className="flex justify-center gap-2">
            {messages.map((_, idx) => (
              <div
                key={idx}
                className="w-2 h-2 border border-black transition-colors"
                style={{ backgroundColor: idx <= messageIndex ? '#1D3354' : '#E8DFD5' }}
              />
            ))}
          </div>
        </div>

        {/* VintDress Section - Integrated */}
        <div style={{ backgroundColor: VINTDRESS_COLORS.background }}>
          {/* Sponsored Header */}
          <div
            className="flex items-center justify-between px-4 py-2 border-b border-black/20"
          >
            <div className="flex items-center gap-2">
              <Camera className="w-3.5 h-3.5" style={{ color: VINTDRESS_COLORS.primary }} />
              <span className="font-display font-bold text-[10px]" style={{ color: VINTDRESS_COLORS.primary }}>
                SPONSORISE PAR VINTDRESS.COM
              </span>
            </div>
            <div
              className="px-1.5 py-0.5 border border-black font-display font-bold text-[8px]"
              style={{ backgroundColor: VINTDRESS_COLORS.accent }}
            >
              PHOTOS IA
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Visual - Before/After Compact */}
            <div className="flex gap-3 mb-3">
              {/* Before */}
              <div className="flex-1">
                <div
                  className="aspect-[3/4] border-2 border-black overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  style={{ backgroundColor: '#FFFFFF' }}
                >
                  <img
                    src="https://i.imgur.com/CHRfv5a.jpg"
                    alt="Avant"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="font-display font-bold text-[8px] text-center mt-1 text-black/50">AVANT</p>
              </div>
              {/* Arrow */}
              <div className="flex items-center justify-center">
                <div
                  className="w-8 h-8 border-2 border-black flex items-center justify-center font-bold text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  style={{ backgroundColor: VINTDRESS_COLORS.primary }}
                >
                  →
                </div>
              </div>
              {/* After */}
              <div className="flex-1">
                <div
                  className="aspect-[3/4] border-2 border-black overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  style={{ backgroundColor: '#FFFFFF' }}
                >
                  <img
                    src="https://i.imgur.com/jfwCX0K.jpg"
                    alt="Apres"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="font-display font-bold text-[8px] text-center mt-1" style={{ color: VINTDRESS_COLORS.primary }}>APRES (IA)</p>
              </div>
            </div>

            {/* Description */}
            <p className="text-[11px] text-black/70 font-body mb-3 text-center">
              Photos de vetements portes par <span className="font-semibold" style={{ color: VINTDRESS_COLORS.primary }}>mannequins IA</span> en 30s !
            </p>

            {/* Features inline */}
            <div className="flex items-center justify-center gap-4 mb-3">
              <div className="flex items-center gap-1 text-[9px] font-bold">
                <Sparkles className="w-3 h-3" style={{ color: VINTDRESS_COLORS.primary }} />
                <span>HD</span>
              </div>
              <div className="flex items-center gap-1 text-[9px] font-bold">
                <Zap className="w-3 h-3" style={{ color: VINTDRESS_COLORS.primary }} />
                <span>30s</span>
              </div>
              <div className="flex items-center gap-1 text-[9px] font-bold">
                <TrendingUp className="w-3 h-3" style={{ color: VINTDRESS_COLORS.primary }} />
                <span>+300%</span>
              </div>
            </div>

            {/* CTA */}
            <a
              href="https://vintdress.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 border-2 border-black font-display font-bold text-xs text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all"
              style={{ backgroundColor: VINTDRESS_COLORS.primary }}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              DECOUVRIR VINTDRESS.COM
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
