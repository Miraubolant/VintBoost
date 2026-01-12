import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Sparkles, Menu, X, User, ChevronDown, LogOut, Video, Eye, CreditCard, MessageCircle, BookOpen, HelpCircle, Zap } from 'lucide-react'
import { AuthModal } from './AuthModal'
import { useAuth } from '../context/AuthContext'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const location = useLocation()

  // Use Supabase auth
  const { user, subscription, credits, signOut, loading } = useAuth()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Check if redirected from protected route with showAuth flag
  useEffect(() => {
    if (location.state?.showAuth) {
      setAuthModalOpen(true)
      // Clear the state
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [location.state])

  const scrollToTop = () => {
    if (location.pathname !== '/') {
      navigate('/')
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => {
        const element = document.getElementById(sectionId)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    } else {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
    setMobileMenuOpen(false)
    setDropdownOpen(false)
  }

  const handleLogout = async () => {
    try {
      await signOut()
      setMobileMenuOpen(false)
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  // Calculate remaining videos
  const remainingVideos = subscription
    ? Math.max(0, subscription.videosLimit - subscription.videosUsed) + credits
    : 0

  const navLinks = [
    { label: 'GENERER', action: () => scrollToSection('hero') },
    { label: 'AVANT/APRES', action: () => scrollToSection('before-after') },
    { label: 'TARIFS', action: () => scrollToSection('pricing') },
  ]

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[9999] border-b-3 border-black" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-12 sm:h-14">

            {/* Logo Neo-Brutalism */}
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 group shrink-0"
            >
              <div
                className="w-8 h-8 sm:w-9 sm:h-9 border-2 border-black flex items-center justify-center transform -rotate-2 group-hover:rotate-0 transition-transform duration-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                style={{ backgroundColor: '#1D3354' }}
              >
                <Sparkles className="text-white w-4 h-4 sm:w-5 sm:h-5" />
              </div>

              {/* Title */}
              <div className="flex items-center gap-0.5">
                <span className="inline-block bg-white border-2 border-black px-1.5 sm:px-2 py-0.5 sm:py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-display font-bold text-xs sm:text-sm text-black transform -rotate-2 group-hover:rotate-0 transition-transform duration-300">
                  VINT
                </span>
                <span className="inline-block border-2 border-black px-1.5 sm:px-2 py-0.5 sm:py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-display font-bold text-xs sm:text-sm text-white transform rotate-1 group-hover:rotate-0 transition-transform duration-300" style={{ backgroundColor: '#1D3354' }}>
                  BOOST
                </span>
              </div>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-0.5">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={link.action}
                  className="px-2.5 py-1.5 font-display font-bold text-xs uppercase border-2 border-transparent hover:text-white hover:border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1D3354'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  {link.label}
                </button>
              ))}
              {/* FAQ Link */}
              <Link
                to="/faq"
                className="px-2.5 py-1.5 font-display font-bold text-xs uppercase border-2 border-transparent hover:text-white hover:border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1D3354'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                FAQ
              </Link>
              {/* Dropdown AVIS */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-1 px-2.5 py-1.5 font-display font-bold text-xs uppercase border-2 border-transparent hover:border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1D3354'; e.currentTarget.style.color = 'white' }}
                  onMouseLeave={(e) => { if (!dropdownOpen) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'inherit' } }}
                  style={{ backgroundColor: dropdownOpen ? '#1D3354' : 'transparent', color: dropdownOpen ? 'white' : 'inherit' }}
                >
                  AVIS
                  <ChevronDown className={`w-3 h-3 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {dropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] z-50" style={{ backgroundColor: '#FFFFFF' }}>
                    <button
                      onClick={() => scrollToSection('testimonials')}
                      className="block w-full text-left px-3 py-2 font-display font-bold text-xs uppercase hover:text-white transition-colors"
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1D3354'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      TEMOIGNAGES
                    </button>
                  </div>
                )}
              </div>
              <button
                onClick={() => scrollToSection('blog')}
                className="px-2.5 py-1.5 font-display font-bold text-xs uppercase border-2 border-transparent hover:text-white hover:border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1D3354'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                BLOG
              </button>
              {/* VintDress Link */}
              <a
                href="https://vintdress.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1.5 font-display font-bold text-xs uppercase border-2 border-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
                style={{ backgroundColor: '#D64045' }}
              >
                VINTDRESS
              </a>
            </nav>

            {/* Auth Button */}
            <div className="hidden lg:flex items-center gap-1.5">
              {user ? (
                <>
                  {/* Credits display */}
                  <div
                    className="flex items-center gap-1.5 px-2.5 py-1 font-display font-bold text-xs border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    style={{ backgroundColor: '#9ED8DB' }}
                  >
                    <Zap className="w-3 h-3" />
                    {remainingVideos} vidéo{remainingVideos !== 1 ? 's' : ''}
                  </div>
                  {/* User avatar/email */}
                  <div
                    className="flex items-center gap-1.5 px-2.5 py-1 font-display font-bold text-xs border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    style={{ backgroundColor: '#FFFFFF' }}
                  >
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt="" className="w-5 h-5 rounded-full border border-black" />
                    ) : (
                      <User className="w-3 h-3" />
                    )}
                    <span className="max-w-[100px] truncate">{user.fullName || user.email.split('@')[0]}</span>
                  </div>
                  {/* Logout button */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 px-2.5 py-1 font-display font-bold text-xs border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
                    style={{ backgroundColor: '#D64045' }}
                  >
                    <LogOut className="w-3 h-3 text-white" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 font-display font-bold text-xs border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
                  style={{ backgroundColor: '#D64045', color: '#FFFFFF' }}
                >
                  <User className="w-3 h-3" />
                  CONNEXION
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={mobileMenuOpen}
              className="lg:hidden p-1.5 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
              style={{ backgroundColor: '#1D3354' }}
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4 text-white" />
              ) : (
                <Menu className="w-4 h-4 text-white" />
              )}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Menu - Bottom Sheet Style */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[9998]">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50 transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Bottom Sheet */}
          <div
            className="absolute bottom-0 left-0 right-0 bg-white border-t-4 border-black rounded-t-3xl transform transition-transform duration-300 ease-out animate-slide-up"
            style={{ maxHeight: '85vh' }}
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>

            {/* Header du menu */}
            <div className="px-5 pb-4 border-b-2 border-black/10">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-lg">Menu</h3>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                  style={{ backgroundColor: '#9ED8DB' }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Menu Content */}
            <div className="px-5 py-4 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 120px)' }}>
              {/* CTA Principal - Générer */}
              <button
                onClick={() => scrollToSection('hero')}
                className="w-full flex items-center gap-4 p-4 mb-4 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                style={{ backgroundColor: '#D64045' }}
              >
                <div className="w-12 h-12 bg-white border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <Video className="w-6 h-6 text-black" />
                </div>
                <div className="text-left">
                  <span className="font-display font-bold text-base text-white block">GÉNÉRER UNE VIDÉO</span>
                  <span className="text-xs text-white/80 font-body">Crée ta vidéo en 30 secondes</span>
                </div>
              </button>

              {/* Grid de navigation */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  onClick={() => scrollToSection('before-after')}
                  className="flex flex-col items-center gap-2 p-4 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                  style={{ backgroundColor: '#FFFFFF' }}
                >
                  <div className="w-10 h-10 border-2 border-black flex items-center justify-center" style={{ backgroundColor: '#9ED8DB' }}>
                    <Eye className="w-5 h-5" />
                  </div>
                  <span className="font-display font-bold text-xs">AVANT/APRÈS</span>
                </button>

                <button
                  onClick={() => scrollToSection('pricing')}
                  className="flex flex-col items-center gap-2 p-4 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                  style={{ backgroundColor: '#FFFFFF' }}
                >
                  <div className="w-10 h-10 border-2 border-black flex items-center justify-center" style={{ backgroundColor: '#9ED8DB' }}>
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <span className="font-display font-bold text-xs">TARIFS</span>
                </button>

                <button
                  onClick={() => scrollToSection('testimonials')}
                  className="flex flex-col items-center gap-2 p-4 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                  style={{ backgroundColor: '#FFFFFF' }}
                >
                  <div className="w-10 h-10 border-2 border-black flex items-center justify-center" style={{ backgroundColor: '#9ED8DB' }}>
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <span className="font-display font-bold text-xs">AVIS</span>
                </button>

                <button
                  onClick={() => scrollToSection('blog')}
                  className="flex flex-col items-center gap-2 p-4 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                  style={{ backgroundColor: '#FFFFFF' }}
                >
                  <div className="w-10 h-10 border-2 border-black flex items-center justify-center" style={{ backgroundColor: '#9ED8DB' }}>
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <span className="font-display font-bold text-xs">BLOG</span>
                </button>
              </div>

              {/* FAQ Link */}
              <Link
                to="/faq"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center gap-3 p-3 mb-3 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                style={{ backgroundColor: '#FFFFFF' }}
              >
                <div className="w-8 h-8 border-2 border-black flex items-center justify-center" style={{ backgroundColor: '#1D3354' }}>
                  <HelpCircle className="w-4 h-4 text-white" />
                </div>
                <span className="font-display font-bold text-sm">QUESTIONS FRÉQUENTES</span>
              </Link>

              {/* VintDress Link */}
              <a
                href="https://vintdress.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center gap-3 p-3 mb-4 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                style={{ backgroundColor: '#D64045' }}
              >
                <div className="w-8 h-8 border-2 border-black flex items-center justify-center" style={{ backgroundColor: '#FFFFFF' }}>
                  <Sparkles className="w-4 h-4 text-black" />
                </div>
                <div className="text-left">
                  <span className="font-display font-bold text-sm text-white block">VINTDRESS</span>
                  <span className="text-[10px] text-white/80 font-body">Besoin de photos portées ?</span>
                </div>
              </a>

              {/* Divider */}
              <div className="border-t-2 border-black/20 my-4" />

              {/* Auth Section */}
              {user ? (
                <div className="space-y-3">
                  {/* Credits badge */}
                  <div
                    className="flex items-center justify-between w-full p-3 border-2 border-black"
                    style={{ backgroundColor: '#9ED8DB' }}
                  >
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      <span className="font-display font-bold text-sm">{remainingVideos} vidéo{remainingVideos !== 1 ? 's' : ''} restante{remainingVideos !== 1 ? 's' : ''}</span>
                    </div>
                    <span className="font-body text-xs uppercase">{subscription?.plan || 'free'}</span>
                  </div>
                  {/* User info */}
                  <div
                    className="flex items-center gap-3 w-full p-3 border-2 border-black"
                    style={{ backgroundColor: '#FFFFFF' }}
                  >
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt="" className="w-10 h-10 rounded-full border-2 border-black" />
                    ) : (
                      <div className="w-10 h-10 bg-white border-2 border-black flex items-center justify-center">
                        <User className="w-5 h-5" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <span className="font-display font-bold text-sm block truncate">{user.fullName || 'Utilisateur'}</span>
                      <span className="font-body text-xs text-black/60 truncate block">{user.email}</span>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 w-full p-3 font-display font-bold text-sm text-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                    style={{ backgroundColor: '#D64045' }}
                  >
                    <LogOut className="w-4 h-4" />
                    DÉCONNEXION
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false)
                    setAuthModalOpen(true)
                  }}
                  className="flex items-center justify-center gap-2 w-full p-4 font-display font-bold text-sm text-white border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                  style={{ backgroundColor: '#1D3354' }}
                >
                  <User className="w-5 h-5" />
                  CONNEXION / INSCRIPTION
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  )
}
