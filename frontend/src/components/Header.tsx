import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Sparkles, Menu, X, User, LogOut, Video, Eye, CreditCard, MessageCircle, BookOpen, HelpCircle, Zap, Settings } from 'lucide-react'
import { AuthModal } from './AuthModal'
import { useAuth } from '../context/AuthContext'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // Use Supabase auth
  const { user, subscription, credits, signOut } = useAuth()

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
    { label: 'GÉNÉRER', action: () => scrollToSection('hero') },
    { label: 'AVANT/APRÈS', action: () => scrollToSection('before-after') },
    { label: 'TARIFS', action: () => scrollToSection('pricing') },
  ]

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[9999] border-b-4 border-black" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">

            {/* Logo Neo-Brutalism */}
            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 group shrink-0"
            >
              <div
                className="w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 border-3 border-black flex items-center justify-center transform -rotate-2 group-hover:rotate-0 transition-transform duration-300 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                style={{ backgroundColor: '#1D3354' }}
              >
                <Sparkles className="text-white w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
              </div>

              {/* Title */}
              <div className="flex items-center gap-0.5 sm:gap-1">
                <span className="inline-block bg-white border-3 border-black px-1.5 sm:px-2 lg:px-2.5 py-0.5 sm:py-1 lg:py-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] font-display font-bold text-xs sm:text-sm lg:text-base text-black transform -rotate-2 group-hover:rotate-0 transition-transform duration-300">
                  VINT
                </span>
                <span className="inline-block border-3 border-black px-1.5 sm:px-2 lg:px-2.5 py-0.5 sm:py-1 lg:py-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] font-display font-bold text-xs sm:text-sm lg:text-base text-white transform rotate-1 group-hover:rotate-0 transition-transform duration-300" style={{ backgroundColor: '#1D3354' }}>
                  BOOST
                </span>
              </div>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={link.action}
                  className="px-3 py-2.5 font-display font-bold text-sm uppercase border-2 border-transparent hover:text-white hover:border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1D3354'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  {link.label}
                </button>
              ))}
              {/* FAQ Link */}
              <Link
                to="/faq"
                className="px-3 py-2.5 font-display font-bold text-sm uppercase border-2 border-transparent hover:text-white hover:border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1D3354'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                FAQ
              </Link>
              {/* AVIS Link */}
              <button
                onClick={() => scrollToSection('testimonials')}
                className="px-3 py-2.5 font-display font-bold text-sm uppercase border-2 border-transparent hover:text-white hover:border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1D3354'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                AVIS
              </button>
              <Link
                to="/blog"
                className="px-3 py-2.5 font-display font-bold text-sm uppercase border-2 border-transparent hover:text-white hover:border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1D3354'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                BLOG
              </Link>
            </nav>

            {/* Auth Button */}
            <div className="hidden lg:flex items-center gap-2 sm:gap-3 shrink-0">
              {user ? (
                <>
                  {/* Account button */}
                  <Link
                    to="/account"
                    className="flex items-center gap-2 px-3 py-2 font-display font-bold text-sm border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
                    style={{ backgroundColor: '#1D3354', color: '#FFFFFF' }}
                  >
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt="" className="w-5 h-5 rounded-full border border-white" />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                    MON COMPTE
                  </Link>
                  {/* Logout button */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2 font-display font-bold text-sm border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
                    style={{ backgroundColor: '#D64045' }}
                  >
                    <LogOut className="w-4 h-4 text-white" />
                    <span className="text-white">DÉCONNEXION</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 font-display font-bold text-sm border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
                  style={{ backgroundColor: '#D64045', color: '#FFFFFF' }}
                >
                  <User className="w-4 h-4" />
                  CONNEXION
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={mobileMenuOpen}
              className="lg:hidden p-2 sm:p-2.5 border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
              style={{ backgroundColor: '#1D3354' }}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              ) : (
                <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
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
            className="absolute bottom-0 left-0 right-0 bg-white border-t-3 border-black rounded-t-2xl transform transition-transform duration-300 ease-out animate-slide-up"
            style={{ maxHeight: '80vh' }}
          >
            {/* Close button */}
            <div className="flex items-center justify-end px-4 pt-2 pb-1">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                style={{ backgroundColor: '#1D3354' }}
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Menu Content */}
            <div className="px-4 py-3 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 50px)' }}>
              {/* CTA Principal - Générer */}
              <button
                onClick={() => scrollToSection('hero')}
                className="w-full flex items-center gap-3 p-3 mb-3 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                style={{ backgroundColor: '#D64045' }}
              >
                <div className="w-10 h-10 bg-white border-2 border-black flex items-center justify-center">
                  <Video className="w-5 h-5 text-black" />
                </div>
                <div className="text-left">
                  <span className="font-display font-bold text-sm text-white block">GÉNÉRER UNE VIDÉO</span>
                  <span className="text-[10px] text-white/80 font-body">Crée ta vidéo en 30 secondes</span>
                </div>
              </button>

              {/* Grid de navigation - Plus compact */}
              <div className="grid grid-cols-4 gap-2 mb-3">
                <button
                  onClick={() => scrollToSection('before-after')}
                  className="flex flex-col items-center gap-1 p-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
                  style={{ backgroundColor: '#FFFFFF' }}
                >
                  <div className="w-8 h-8 border-2 border-black flex items-center justify-center" style={{ backgroundColor: '#1D3354' }}>
                    <Eye className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-display font-bold text-[9px]">ÉTAPES</span>
                </button>

                <button
                  onClick={() => scrollToSection('pricing')}
                  className="flex flex-col items-center gap-1 p-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
                  style={{ backgroundColor: '#FFFFFF' }}
                >
                  <div className="w-8 h-8 border-2 border-black flex items-center justify-center" style={{ backgroundColor: '#1D3354' }}>
                    <CreditCard className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-display font-bold text-[9px]">TARIFS</span>
                </button>

                <button
                  onClick={() => scrollToSection('testimonials')}
                  className="flex flex-col items-center gap-1 p-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
                  style={{ backgroundColor: '#FFFFFF' }}
                >
                  <div className="w-8 h-8 border-2 border-black flex items-center justify-center" style={{ backgroundColor: '#1D3354' }}>
                    <MessageCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-display font-bold text-[9px]">AVIS</span>
                </button>

                <Link
                  to="/blog"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex flex-col items-center gap-1 p-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
                  style={{ backgroundColor: '#FFFFFF' }}
                >
                  <div className="w-8 h-8 border-2 border-black flex items-center justify-center" style={{ backgroundColor: '#1D3354' }}>
                    <BookOpen className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-display font-bold text-[9px]">BLOG</span>
                </Link>
              </div>

              {/* FAQ + VintDress - Ligne compacte */}
              <div className="flex gap-2 mb-3">
                <Link
                  to="/faq"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 flex items-center gap-2 p-2.5 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
                  style={{ backgroundColor: '#FFFFFF' }}
                >
                  <div className="w-7 h-7 border-2 border-black flex items-center justify-center" style={{ backgroundColor: '#1D3354' }}>
                    <HelpCircle className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="font-display font-bold text-xs">FAQ</span>
                </Link>

                <a
                  href="https://vintdress.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 flex items-center gap-2 p-2.5 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
                  style={{ backgroundColor: '#09B1BA' }}
                >
                  <div className="w-7 h-7 border-2 border-black flex items-center justify-center" style={{ backgroundColor: '#FFF8E7' }}>
                    <Sparkles className="w-3.5 h-3.5 text-black" />
                  </div>
                  <span className="font-display font-bold text-xs text-white">VINTDRESS</span>
                </a>
              </div>

              {/* Divider */}
              <div className="border-t-2 border-black/10 my-3" />

              {/* Auth Section */}
              {user ? (
                <div className="space-y-2">
                  {/* User info + Credits in one row */}
                  <div className="flex gap-2">
                    <div
                      className="flex items-center gap-2 flex-1 p-2 border-2 border-black"
                      style={{ backgroundColor: '#FFFFFF' }}
                    >
                      {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt="" className="w-8 h-8 rounded-full border border-black" />
                      ) : (
                        <div className="w-8 h-8 bg-white border-2 border-black flex items-center justify-center">
                          <User className="w-4 h-4" />
                        </div>
                      )}
                      <span className="font-display font-bold text-xs truncate">{user.fullName || user.email.split('@')[0]}</span>
                    </div>
                    <div
                      className="flex items-center gap-1.5 px-3 border-2 border-black"
                      style={{ backgroundColor: '#1D3354' }}
                    >
                      <Zap className="w-3.5 h-3.5 text-white" />
                      <span className="font-display font-bold text-xs text-white">{remainingVideos}</span>
                    </div>
                  </div>
                  {/* Account link */}
                  <Link
                    to="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full p-2.5 font-display font-bold text-xs text-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
                    style={{ backgroundColor: '#1D3354' }}
                  >
                    <Settings className="w-3.5 h-3.5" />
                    MON COMPTE
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 w-full p-2.5 font-display font-bold text-xs text-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
                    style={{ backgroundColor: '#D64045' }}
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    DÉCONNEXION
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false)
                    setAuthModalOpen(true)
                  }}
                  className="flex items-center justify-center gap-2 w-full p-3 font-display font-bold text-sm text-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                  style={{ backgroundColor: '#1D3354' }}
                >
                  <User className="w-4 h-4" />
                  CONNEXION
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
