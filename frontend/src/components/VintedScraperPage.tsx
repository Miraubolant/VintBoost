import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWardrobe } from '../context/WardrobeContext'
import { useAuth } from '../context/AuthContext'
import { Zap, Star } from 'lucide-react'
import { AuthModal } from './AuthModal'
import { NoCreditModal } from './NoCreditModal'

export function VintedScraperPage() {
  const [url, setUrl] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showNoCreditModal, setShowNoCreditModal] = useState(false)
  const { setPendingUrl } = useWardrobe()
  const { user, canGenerateVideo } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedUrl = url.trim()

    if (!trimmedUrl) return

    // Validate URL
    if (!trimmedUrl.includes('vinted') || !trimmedUrl.includes('/member')) {
      setError('URL invalide. Utilisez un lien de vestiaire Vinted.')
      return
    }

    // Check if user is logged in
    if (!user) {
      setShowAuthModal(true)
      return
    }

    // Check if user has credits
    if (!canGenerateVideo()) {
      setShowNoCreditModal(true)
      return
    }

    // Store URL and redirect immediately
    setPendingUrl(trimmedUrl)
    navigate('/resultat')
  }

  const handleNavigateToPricing = () => {
    setShowNoCreditModal(false)
    const pricingSection = document.getElementById('pricing')
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="pt-8 sm:pt-16 lg:pt-20 pb-6 px-4" id="hero">
      <div className="max-w-7xl mx-auto relative">
        {/* Decorative elements - like VintDress */}
        <div
          className="hidden lg:block absolute -left-8 top-4 w-10 h-10 border-3 border-black transform rotate-12 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
          style={{ backgroundColor: '#D64045' }}
        />
        <div
          className="hidden lg:block absolute -left-4 top-24 w-6 h-6 border-2 border-black transform -rotate-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          style={{ backgroundColor: '#1D3354' }}
        />
        <div
          className="hidden lg:block absolute -right-8 top-8 w-12 h-12 border-3 border-black transform rotate-12 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
          style={{ backgroundColor: '#1D3354' }}
        />
        <div
          className="hidden lg:block absolute right-16 top-48 w-8 h-8 border-2 border-black rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          style={{ backgroundColor: '#D64045' }}
        />
        <div
          className="hidden lg:block absolute left-8 bottom-32 w-8 h-8 border-2 border-black transform rotate-45 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          style={{ backgroundColor: '#1D3354' }}
        />

        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="font-display font-bold text-[1.75rem] sm:text-4xl md:text-5xl lg:text-6xl tracking-tight mb-4">
            <div className="mb-1.5">
              <span
                className="inline-block bg-white text-black border-2 sm:border-3 border-black px-2 sm:px-3 py-1 sm:py-1.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                CRÉE DES VIDÉOS
              </span>
            </div>
            <div className="mb-1.5">
              <span
                className="inline-block text-white border-2 sm:border-3 border-black px-2 sm:px-3 py-1 sm:py-1.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                style={{ backgroundColor: '#1D3354' }}
              >
                VINTED PARFAITES
              </span>
            </div>
            <div>
              <span
                className="inline-block text-black border-2 sm:border-3 border-black px-2 sm:px-3 py-1 sm:py-1.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                style={{ backgroundColor: '#FFFFFF' }}
              >
                EN 30 SECONDES !
              </span>
            </div>
          </h1>

          <p className="text-sm sm:text-base text-black/70 max-w-lg mx-auto font-body mb-6">
            Génère des vidéos promo de ton vestiaire en 30 secondes.{' '}
            <span style={{ color: '#1D3354' }} className="font-semibold">
              Pas de montage, pas de compétences - juste des vidéos qui vendent !
            </span>
          </p>
        </div>

        {/* Search Form - VintDress style */}
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="max-w-2xl mx-auto">
            <div
              className="border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 sm:p-5"
              style={{ backgroundColor: '#FFFFFF' }}
            >
              {/* Input field */}
              <div className="mb-3">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value)
                    setError(null)
                  }}
                  placeholder="Colle ton lien Vinted ici..."
                  className="w-full px-3 py-2.5 border-2 border-black font-body text-sm placeholder:text-gray-400 focus:outline-none"
                  style={{ backgroundColor: '#FFFFFF' }}
                />
              </div>

              {/* CTA Button */}
              <button
                type="submit"
                className="w-full px-4 py-2.5 border-2 border-black font-display font-bold text-xs sm:text-sm text-white flex items-center justify-center gap-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 animate-bounce-subtle"
                style={{ backgroundColor: '#D64045' }}
              >
                <Zap className="w-4 h-4" />
                IMPORTER TON VESTIAIRE
              </button>

              {/* Error */}
              {error && (
                <p className="mt-2 text-xs font-bold text-black">{error}</p>
              )}
            </div>
          </div>
        </form>

        {/* CTA Stats Section */}
        <div className="flex items-center justify-center gap-4 sm:gap-8 mb-4 sm:mb-6 lg:mb-10">
          {/* Rating */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1">
              <span className="font-display font-bold text-lg sm:text-3xl text-black">4.9</span>
              <div className="flex gap-0.5 sm:gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="w-3 h-3 sm:w-5 sm:h-5"
                    style={{ color: '#FFD700', fill: '#FFD700' }}
                  />
                ))}
              </div>
            </div>
            <span className="font-body text-[10px] sm:text-xs text-black/60 uppercase tracking-wide">NOTE MOYENNE</span>
          </div>

          {/* Divider */}
          <div className="h-10 sm:h-12 w-px bg-black/20" />

          {/* Counter */}
          <div className="flex flex-col items-center">
            <span className="font-display font-bold text-lg sm:text-3xl text-black">+10 000</span>
            <span className="font-body text-[10px] sm:text-xs text-black/60 uppercase tracking-wide">VIDEOS GENEREES</span>
          </div>

          {/* Divider */}
          <div className="h-10 sm:h-12 w-px bg-black/20" />

          {/* HD Badge */}
          <div className="flex flex-col items-center">
            <span className="font-display font-bold text-lg sm:text-3xl text-black">HD</span>
            <span className="font-body text-[10px] sm:text-xs text-black/60 uppercase tracking-wide">QUALITE VIDEO</span>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      {/* No Credit Modal */}
      <NoCreditModal
        isOpen={showNoCreditModal}
        onClose={() => setShowNoCreditModal(false)}
        onNavigateToPricing={handleNavigateToPricing}
      />
    </div>
  )
}
