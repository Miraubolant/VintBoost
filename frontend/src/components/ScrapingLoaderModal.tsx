import { useState, useEffect } from 'react'
import { Loader2, ExternalLink, Camera, Sparkles } from 'lucide-react'

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
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-center lg:items-start max-w-3xl w-full">
        {/* Loader Card */}
        <div
          className="w-full max-w-sm border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          {/* Loader Icon */}
          <div className="flex justify-center mb-4">
            <div
              className="w-16 h-16 border-3 border-black flex items-center justify-center"
              style={{ backgroundColor: '#1D3354' }}
            >
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          </div>

          {/* Title */}
          <h3 className="font-display font-bold text-lg text-center mb-2">
            CHARGEMENT
          </h3>

          {/* Message */}
          <p className="font-body text-sm text-center text-black/70 mb-4">
            {messages[messageIndex]}
          </p>

          {/* Progress dots */}
          <div className="flex justify-center gap-2">
            {messages.map((_, idx) => (
              <div
                key={idx}
                className="w-2.5 h-2.5 border border-black transition-colors"
                style={{ backgroundColor: idx <= messageIndex ? '#1D3354' : '#E8DFD5' }}
              />
            ))}
          </div>

          {/* Tip */}
          <p className="text-[10px] text-black/40 text-center mt-4 font-body">
            Les videos augmentent tes ventes jusqu'a +300%
          </p>
        </div>

        {/* VintDress Ad Card - Responsive */}
        <div
          className="w-full max-w-sm border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-2.5 border-b-2 border-black"
            style={{ backgroundColor: VINTDRESS_COLORS.primary }}
          >
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-white" />
              <span className="font-display font-bold text-xs text-white">VINTDRESS.COM</span>
            </div>
            <div
              className="px-2 py-0.5 border-2 border-black font-display font-bold text-[10px]"
              style={{ backgroundColor: VINTDRESS_COLORS.accent }}
            >
              PHOTOS IA
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Visual - Before/After */}
            <div
              className="border-2 border-black overflow-hidden mb-4"
              style={{ backgroundColor: VINTDRESS_COLORS.background }}
            >
              <div className="grid grid-cols-2">
                {/* Before */}
                <div className="p-2 border-r border-black text-center">
                  <div
                    className="aspect-[3/4] border border-black mb-1.5 overflow-hidden"
                    style={{ backgroundColor: '#FFFFFF' }}
                  >
                    <img
                      src="https://i.imgur.com/CHRfv5a.jpg"
                      alt="Avant"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="font-display font-bold text-[9px] text-black/50">AVANT</span>
                </div>
                {/* After */}
                <div className="p-2 text-center" style={{ backgroundColor: VINTDRESS_COLORS.primary }}>
                  <div
                    className="aspect-[3/4] border border-black mb-1.5 overflow-hidden"
                    style={{ backgroundColor: '#FFFFFF' }}
                  >
                    <img
                      src="https://i.imgur.com/jfwCX0K.jpg"
                      alt="Apres"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="font-display font-bold text-[9px] text-white">APRES (IA)</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-black/70 font-body mb-3 text-center leading-relaxed">
              <span className="font-semibold" style={{ color: VINTDRESS_COLORS.primary }}>VintDress</span> genere des photos de tes vetements portes par des{' '}
              <span className="font-semibold" style={{ color: VINTDRESS_COLORS.primary }}>mannequins IA</span> en 30 secondes !
            </p>

            {/* Features - Compact */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="flex items-center gap-1.5 text-[10px] font-bold">
                <div
                  className="w-5 h-5 border border-black flex items-center justify-center"
                  style={{ backgroundColor: VINTDRESS_COLORS.accent }}
                >
                  <Sparkles className="w-3 h-3" />
                </div>
                <span>HD</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold">
                <div
                  className="w-5 h-5 border border-black flex items-center justify-center"
                  style={{ backgroundColor: VINTDRESS_COLORS.accent }}
                >
                  ⚡
                </div>
                <span>30s</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold">
                <div
                  className="w-5 h-5 border border-black flex items-center justify-center"
                  style={{ backgroundColor: VINTDRESS_COLORS.accent }}
                >
                  📈
                </div>
                <span>+300%</span>
              </div>
            </div>

            {/* CTA */}
            <a
              href="https://vintdress.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-black font-display font-bold text-sm text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all"
              style={{ backgroundColor: VINTDRESS_COLORS.primary }}
            >
              <ExternalLink className="w-4 h-4" />
              DECOUVRIR VINTDRESS
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
