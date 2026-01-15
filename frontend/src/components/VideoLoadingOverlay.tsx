import { ExternalLink, Sparkles, Clock, User, TrendingUp } from 'lucide-react'

// VintDress Color Palette
const VINTDRESS_COLORS = {
  primary: '#09B1BA',
  background: '#FFF8E7',
  accent: '#FFB3BA',
}

interface VideoLoadingOverlayProps {
  isVisible: boolean
}

export function VideoLoadingOverlay({ isVisible }: VideoLoadingOverlayProps) {
  if (!isVisible) return null

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center">
      {/* Blurred backdrop */}
      <div className="absolute inset-0 bg-white/60 backdrop-blur-md" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-lg mx-4">
        {/* Loading Card */}
        <div
          className="border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          {/* Header - Loading status */}
          <div
            className="px-4 py-3 border-b-3 border-black flex items-center justify-between"
            style={{ backgroundColor: '#1D3354' }}
          >
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span className="font-display font-bold text-sm text-white">GENERATION EN COURS...</span>
            </div>
            <span className="text-xs text-white/70 font-body">~1-2 min</span>
          </div>

          {/* Progress animation */}
          <div className="h-1.5 bg-gray-200 overflow-hidden">
            <div
              className="h-full animate-pulse"
              style={{
                backgroundColor: '#9ED8DB',
                animation: 'loading-progress 2s ease-in-out infinite',
              }}
            />
          </div>

          {/* VintDress Promo */}
          <div className="p-5">
            <div className="text-center mb-4">
              <p className="text-sm text-black/60 font-body mb-2">
                En attendant, decouvre notre autre outil
              </p>
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                style={{ backgroundColor: VINTDRESS_COLORS.primary }}
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span className="font-display font-bold text-xs text-white">PHOTOS IA</span>
              </div>
            </div>

            {/* Before/After Visual */}
            <div
              className="border-2 border-black overflow-hidden mb-4"
              style={{ backgroundColor: VINTDRESS_COLORS.background }}
            >
              <div className="grid grid-cols-2">
                <div className="p-2 border-r-2 border-black text-center">
                  <div
                    className="w-full aspect-[3/4] border-2 border-black mb-1.5 overflow-hidden"
                    style={{ backgroundColor: '#FFFFFF' }}
                  >
                    <img
                      src="https://i.imgur.com/CHRfv5a.jpg"
                      alt="Photo produit avant"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="font-display font-bold text-[9px] text-black/60">AVANT</span>
                </div>
                <div className="p-2 text-center" style={{ backgroundColor: VINTDRESS_COLORS.primary }}>
                  <div
                    className="w-full aspect-[3/4] border-2 border-black mb-1.5 overflow-hidden"
                    style={{ backgroundColor: '#FFFFFF' }}
                  >
                    <img
                      src="https://i.imgur.com/jfwCX0K.jpg"
                      alt="Photo portee IA apres"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="font-display font-bold text-[9px] text-white">APRES (IA)</span>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {[
                { icon: <Clock className="w-3 h-3" />, text: '30 secondes' },
                { icon: <User className="w-3 h-3" />, text: 'Avatars IA' },
                { icon: <Sparkles className="w-3 h-3" />, text: 'Qualite HD' },
                { icon: <TrendingUp className="w-3 h-3" />, text: '+300% ventes' },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 px-2 py-1.5 border border-black/20 bg-white/50"
                >
                  <div
                    className="w-5 h-5 border border-black flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: VINTDRESS_COLORS.accent }}
                  >
                    {feature.icon}
                  </div>
                  <span className="text-[10px] font-body text-black">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <a
              href="https://vintdress.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full px-4 py-3 border-2 border-black font-display font-bold text-sm text-white flex items-center justify-center gap-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
              style={{ backgroundColor: VINTDRESS_COLORS.primary }}
            >
              <ExternalLink className="w-4 h-4" />
              DECOUVRIR VINTDRESS
            </a>
          </div>
        </div>

        {/* Tip text */}
        <p className="text-center text-xs text-black/50 font-body mt-3">
          La generation peut prendre 1 a 2 minutes selon la charge du serveur
        </p>
      </div>

      {/* CSS for loading animation */}
      <style>{`
        @keyframes loading-progress {
          0% { transform: translateX(-100%); width: 100%; }
          50% { transform: translateX(0%); width: 100%; }
          100% { transform: translateX(100%); width: 100%; }
        }
      `}</style>
    </div>
  )
}
