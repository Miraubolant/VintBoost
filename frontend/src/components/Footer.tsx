import { Sparkles, Mail, MapPin } from 'lucide-react'

// TikTok icon
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 16 16" fill="currentColor" className={className}>
    <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z"/>
  </svg>
)

export function Footer() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer className="border-t-3 border-black mt-auto" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">

        {/* Main Footer Content */}
        <div className="py-4 sm:py-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            {/* Brand Section */}
            <div className="flex flex-col items-center lg:items-start gap-2">
              <a href="#" className="flex items-center gap-1.5 group">
                <div
                  className="w-7 h-7 sm:w-8 sm:h-8 border-2 border-black flex items-center justify-center transform -rotate-2 group-hover:rotate-0 transition-transform duration-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  style={{ backgroundColor: '#1D3354' }}
                >
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                </div>
                <div className="flex items-center gap-0.5">
                  <span className="inline-block bg-white border-2 border-black px-1 sm:px-1.5 py-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-display font-bold text-[10px] sm:text-xs text-black transform -rotate-2 group-hover:rotate-0 transition-transform duration-300">
                    VINT
                  </span>
                  <span className="inline-block border-2 border-black px-1 sm:px-1.5 py-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-display font-bold text-[10px] sm:text-xs text-white transform rotate-1 group-hover:rotate-0 transition-transform duration-300" style={{ backgroundColor: '#1D3354' }}>
                    BOOST
                  </span>
                </div>
              </a>

              {/* Made in France badge */}
              <div className="flex items-center gap-1 bg-white border-2 border-black px-1.5 py-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <MapPin className="w-2.5 h-2.5" style={{ color: '#1D3354' }} />
                <span className="font-body font-semibold text-[9px] sm:text-[10px] text-black">Made in France</span>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex justify-center lg:justify-end">
              <div className="flex flex-wrap gap-1.5 justify-center">
                <button
                  onClick={() => scrollToSection('hero')}
                  className="text-white font-display font-bold text-[9px] sm:text-[10px] uppercase px-1.5 py-1 sm:px-2 sm:py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
                  style={{ backgroundColor: '#1D3354' }}
                >
                  GÉNÉRER
                </button>
                <button
                  onClick={() => scrollToSection('pricing')}
                  className="text-white font-display font-bold text-[9px] sm:text-[10px] uppercase px-1.5 py-1 sm:px-2 sm:py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
                  style={{ backgroundColor: '#1D3354' }}
                >
                  TARIFS
                </button>
                <button
                  onClick={() => scrollToSection('faq')}
                  className="text-white font-display font-bold text-[9px] sm:text-[10px] uppercase px-1.5 py-1 sm:px-2 sm:py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
                  style={{ backgroundColor: '#1D3354' }}
                >
                  FAQ
                </button>
                <a
                  href="https://vintdress.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white font-display font-bold text-[9px] sm:text-[10px] uppercase px-1.5 py-1 sm:px-2 sm:py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
                  style={{ backgroundColor: '#D64045' }}
                >
                  VINTDRESS
                </a>
              </div>
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t-2 border-black py-3 sm:py-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

            {/* Copyright */}
            <div className="text-center sm:text-left">
              <span className="font-display font-bold text-[9px] sm:text-[10px] text-black">
                © 2025 VINTBOOST - Scrape & Generate Videos
              </span>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {/* Contact Link */}
              <a
                href="mailto:contact@vintboost.com"
                className="text-white font-display font-bold text-[9px] sm:text-[10px] px-1.5 py-1 sm:px-2 sm:py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 flex items-center gap-1"
                style={{ backgroundColor: '#1D3354' }}
              >
                <Mail className="w-2.5 h-2.5" />
                CONTACT
              </a>

              {/* TikTok Link */}
              <a
                href="https://www.tiktok.com/@vintboost"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black text-white font-display font-bold text-[9px] sm:text-[10px] px-1.5 py-1 sm:px-2 sm:py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:text-black hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 flex items-center gap-1"
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#D64045'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#000000'}
              >
                <TikTokIcon className="w-2.5 h-2.5" />
                TIKTOK
              </a>
            </div>
          </div>
        </div>

      </div>
    </footer>
  )
}
