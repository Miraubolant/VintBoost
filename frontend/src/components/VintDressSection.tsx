import { Sparkles, ExternalLink, User, Clock, TrendingUp, Camera } from 'lucide-react'

// VintDress Color Palette
const VINTDRESS_COLORS = {
  primary: '#09B1BA',    // Vinted Blue
  background: '#FFF8E7', // Cream
  accent: '#FFB3BA',     // Pink Pastel
}

export function VintDressSection() {
  return (
    <section id="vintdress" className="py-8 sm:py-12 lg:py-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" style={{ backgroundColor: VINTDRESS_COLORS.primary }}>
            <Camera className="w-4 h-4 text-white" />
            <span className="font-display font-bold text-xs text-white">PHOTOS IA</span>
          </div>

          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl xl:text-6xl tracking-tight">
            <div className="text-black transform -rotate-2 mb-4 relative">
              <span className="inline-block bg-white border-4 border-black px-6 sm:px-8 py-3 sm:py-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                BESOIN DE PHOTOS
              </span>
            </div>
            <div className="text-white transform rotate-2 relative">
              <span className="inline-block border-4 border-black px-6 sm:px-8 py-3 sm:py-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" style={{ backgroundColor: VINTDRESS_COLORS.primary }}>
                PORTÉES ?
              </span>
            </div>
          </h2>
          <p className="text-sm sm:text-base text-black/70 font-body max-w-lg mx-auto mt-4">
            <a href="https://vintdress.com" target="_blank" rel="noopener noreferrer" className="font-semibold underline hover:no-underline" style={{ color: VINTDRESS_COLORS.primary }}>VintDress.com</a> génère des photos réalistes de tes vêtements portés par des <span style={{ color: VINTDRESS_COLORS.primary }} className="font-semibold">mannequins IA</span> en 30 secondes !
          </p>
        </div>

        {/* Main Card */}
        <div
          className="relative border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          {/* Header bar */}
          <div
            className="flex items-center justify-between px-4 sm:px-6 py-3 border-b-3 border-black"
            style={{ backgroundColor: VINTDRESS_COLORS.primary }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                style={{ backgroundColor: '#FFFFFF' }}
              >
                <User className="w-4 h-4 text-black" />
              </div>
              <span className="font-display font-bold text-sm sm:text-base text-white">VINTDRESS.COM</span>
            </div>
            <div
              className="px-2 py-1 border-2 border-black font-display font-bold text-[10px] sm:text-xs"
              style={{ backgroundColor: VINTDRESS_COLORS.accent, color: '#000000' }}
            >
              +300% VENTES
            </div>
          </div>

          {/* Content */}
          <div className="p-5 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
              {/* Left - Description */}
              <div>
                <h3 className="font-display font-bold text-xl sm:text-2xl mb-4" style={{ color: VINTDRESS_COLORS.primary }}>
                  Des photos portées sans mannequin réel
                </h3>
                <p className="text-sm sm:text-base text-black/70 font-body mb-6 leading-relaxed">
                  VintDress génère des photos réalistes de tes vêtements portés par des avatars IA.
                  Plus besoin de mannequins ou de séances photo - booste tes ventes Vinted instantanément !
                </p>

                {/* Features list */}
                <div className="space-y-3 mb-6">
                  {[
                    { icon: <Clock className="w-4 h-4" />, text: 'Génération en 30 secondes' },
                    { icon: <User className="w-4 h-4" />, text: 'Avatars personnalisables (genre, morphologie, teint)' },
                    { icon: <Sparkles className="w-4 h-4" />, text: 'Qualité HD professionnelle' },
                    { icon: <TrendingUp className="w-4 h-4" />, text: 'Augmente tes ventes jusqu\'à +300%' },
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 border-2 border-black flex items-center justify-center shrink-0"
                        style={{ backgroundColor: VINTDRESS_COLORS.accent }}
                      >
                        {feature.icon}
                      </div>
                      <span className="text-sm font-body text-black">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right - Visual + CTA */}
              <div className="flex flex-col justify-center">
                {/* Visual representation - Before/After style */}
                <div
                  className="relative border-2 border-black overflow-hidden mb-6"
                  style={{ backgroundColor: VINTDRESS_COLORS.background }}
                >
                  <div className="grid grid-cols-2">
                    {/* Before - Flat lay */}
                    <div className="p-3 border-r-2 border-black text-center">
                      <div
                        className="w-full aspect-[3/4] border-2 border-black mb-2 overflow-hidden"
                        style={{ backgroundColor: '#FFFFFF' }}
                      >
                        <img
                          src="https://i.imgur.com/CHRfv5a.jpg"
                          alt="Photo produit avant"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-display font-bold text-[10px] text-black/60">AVANT</span>
                    </div>
                    {/* After - Worn */}
                    <div className="p-3 text-center" style={{ backgroundColor: VINTDRESS_COLORS.primary }}>
                      <div
                        className="w-full aspect-[3/4] border-2 border-black mb-2 overflow-hidden"
                        style={{ backgroundColor: '#FFFFFF' }}
                      >
                        <img
                          src="https://i.imgur.com/jfwCX0K.jpg"
                          alt="Photo portée IA après"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-display font-bold text-[10px] text-white">APRÈS (IA)</span>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <a
                  href="https://vintdress.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full px-6 py-4 border-3 border-black font-display font-bold text-sm sm:text-base text-white flex items-center justify-center gap-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
                  style={{ backgroundColor: VINTDRESS_COLORS.primary }}
                >
                  <ExternalLink className="w-5 h-5" />
                  ESSAYER VINTDRESS
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
