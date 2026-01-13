import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Home, RefreshCw, Search, Sparkles } from 'lucide-react'

const funMessages = [
  "Cette page a ete vendue sur Vinted... avant que tu arrives !",
  "404 : Page introuvable, comme cette paire de Louboutin a 5 euros...",
  "Oups ! Cette page a disparu plus vite qu'un article Nike en promo.",
  "Erreur 404 : La page est partie avant le facteur.",
  "Cette page n'existe pas... comme les Birkin a 50 euros.",
]

const funEmojis = ['👗', '👠', '👜', '🛍️', '✨', '💫', '🎀', '👒']

export function NotFoundPage() {
  const [message] = useState(() => funMessages[Math.floor(Math.random() * funMessages.length)])
  const [emoji] = useState(() => funEmojis[Math.floor(Math.random() * funEmojis.length)])
  const [rotation, setRotation] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleRefresh = () => {
    setIsSpinning(true)
    setRotation(prev => prev + 360)
    setTimeout(() => {
      window.location.reload()
    }, 500)
  }

  return (
    <div className="min-h-screen py-12 px-4 flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: '#E8DFD5' }}>
      {/* Floating decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-[10%] left-[5%] w-12 h-12 border-3 border-black transform rotate-12 animate-bounce"
          style={{ backgroundColor: '#9ED8DB', animationDelay: '0s', animationDuration: '3s' }}
        />
        <div
          className="absolute top-[20%] right-[10%] w-8 h-8 border-3 border-black transform -rotate-6 animate-bounce"
          style={{ backgroundColor: '#D64045', animationDelay: '0.5s', animationDuration: '2.5s' }}
        />
        <div
          className="absolute bottom-[15%] left-[15%] w-10 h-10 border-3 border-black transform rotate-45 animate-bounce"
          style={{ backgroundColor: '#1D3354', animationDelay: '1s', animationDuration: '3.5s' }}
        />
        <div
          className="absolute bottom-[25%] right-[5%] w-6 h-6 border-3 border-black rounded-full animate-bounce"
          style={{ backgroundColor: '#9ED8DB', animationDelay: '1.5s', animationDuration: '2s' }}
        />
      </div>

      <div className="max-w-lg w-full relative z-10">
        {/* Main Card */}
        <div
          className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          {/* Big 404 */}
          <div
            className="py-8 border-b-4 border-black relative overflow-hidden"
            style={{ backgroundColor: '#1D3354' }}
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-2 left-4 text-6xl">👗</div>
              <div className="absolute top-10 right-8 text-4xl">👠</div>
              <div className="absolute bottom-2 left-1/3 text-5xl">👜</div>
            </div>

            <div className="relative text-center">
              <div
                className="font-display font-bold text-8xl sm:text-9xl text-white transform"
                style={{
                  textShadow: '6px 6px 0px #D64045',
                  transition: 'transform 0.5s ease',
                  transform: `rotate(${rotation}deg)`
                }}
              >
                4
                <span className="inline-block text-6xl sm:text-7xl mx-2 animate-pulse">{emoji}</span>
                4
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Fun message */}
            <div className="text-center mb-6">
              <h1 className="font-display font-bold text-xl sm:text-2xl text-black mb-4">
                PAGE INTROUVABLE !
              </h1>
              <p className="font-body text-black/70 text-sm sm:text-base">
                {message}
              </p>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <button
                onClick={handleRefresh}
                disabled={isSpinning}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 border-3 border-black font-display font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50"
                style={{ backgroundColor: '#9ED8DB' }}
              >
                <RefreshCw className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
                RAFRAICHIR LA PAGE
              </button>

              <Link
                to="/"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 border-3 border-black font-display font-bold text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
                style={{ backgroundColor: '#D64045' }}
              >
                <Home className="w-5 h-5" />
                RETOUR A L'ACCUEIL
              </Link>

              <Link
                to="/faq"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 border-3 border-black font-display font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
                style={{ backgroundColor: '#FFFFFF' }}
              >
                <Search className="w-5 h-5" />
                CONSULTER LA FAQ
              </Link>
            </div>

            {/* CTA */}
            <div className="mt-6 pt-6 border-t-2 border-black/10 text-center">
              <p className="font-body text-xs text-black/50 mb-3">
                En attendant, pourquoi ne pas creer une video ?
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-4 py-2 border-2 border-black font-display font-bold text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all"
                style={{ backgroundColor: '#1D3354', color: '#FFFFFF' }}
              >
                <Sparkles className="w-4 h-4" />
                CREER MA VIDEO
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
