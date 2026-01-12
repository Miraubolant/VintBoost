import { Sparkles, ExternalLink, User, Clock, TrendingUp, Camera } from 'lucide-react'

export function VintDressSection() {
  return (
    <section id="vintdress" className="py-8 sm:py-12 lg:py-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" style={{ backgroundColor: '#D64045' }}>
            <Camera className="w-4 h-4 text-white" />
            <span className="font-display font-bold text-xs text-white">PHOTOS IA</span>
          </div>

          <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl mb-3">
            <div className="mb-1.5">
              <span
                className="inline-block bg-white text-black border-2 border-black px-3 py-1.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
              >
                BESOIN DE PHOTOS
              </span>
            </div>
            <div>
              <span
                className="inline-block text-white border-2 border-black px-3 py-1.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                style={{ backgroundColor: '#D64045' }}
              >
                PORTÉES ?
              </span>
            </div>
          </h2>
          <p className="text-sm sm:text-base text-black/70 font-body max-w-lg mx-auto mt-4">
            <a href="https://vintdress.com" target="_blank" rel="noopener noreferrer" className="font-semibold underline hover:no-underline" style={{ color: '#1D3354' }}>VintDress.com</a> génère des photos réalistes de tes vêtements portés par des <span style={{ color: '#D64045' }} className="font-semibold">mannequins IA</span> en 30 secondes !
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
            style={{ backgroundColor: '#9ED8DB' }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                style={{ backgroundColor: '#1D3354' }}
              >
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-sm sm:text-base">VINTDRESS.COM</span>
            </div>
            <div
              className="px-2 py-1 border-2 border-black font-display font-bold text-[10px] sm:text-xs"
              style={{ backgroundColor: '#D64045', color: '#FFFFFF' }}
            >
              +300% VENTES
            </div>
          </div>

          {/* Content */}
          <div className="p-5 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
              {/* Left - Description */}
              <div>
                <h3 className="font-display font-bold text-xl sm:text-2xl mb-4" style={{ color: '#1D3354' }}>
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
                        style={{ backgroundColor: '#9ED8DB' }}
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
                  style={{ backgroundColor: '#E8DFD5' }}
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
                    <div className="p-3 text-center" style={{ backgroundColor: '#9ED8DB' }}>
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
                      <span className="font-display font-bold text-[10px] text-black">APRÈS (IA)</span>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <a
                  href="https://vintdress.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full px-6 py-4 border-3 border-black font-display font-bold text-sm sm:text-base text-white flex items-center justify-center gap-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
                  style={{ backgroundColor: '#D64045' }}
                >
                  <ExternalLink className="w-5 h-5" />
                  ESSAYER VINTDRESS
                </a>
              </div>
            </div>
          </div>

          {/* Bottom stats bar */}
          <div
            className="flex flex-wrap items-center justify-center gap-4 px-4 py-4 border-t-3 border-black"
            style={{ backgroundColor: '#1D3354' }}
          >
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-lg sm:text-xl text-white">30s</span>
              <span className="font-body text-xs text-white/70">par photo</span>
            </div>
            <div className="w-px h-6 bg-white/30" />
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-lg sm:text-xl text-white">HD</span>
              <span className="font-body text-xs text-white/70">qualité export</span>
            </div>
            <div className="w-px h-6 bg-white/30" />
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-lg sm:text-xl text-white">3.99€</span>
              <span className="font-body text-xs text-white/70">10 photos</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
