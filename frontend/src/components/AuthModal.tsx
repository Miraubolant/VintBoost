import { useState, useEffect } from 'react'
import { X, User, Copy, Check, AlertTriangle, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

// Détection des navigateurs in-app (TikTok, Instagram, Facebook, etc.)
const isInAppBrowser = (): { isInApp: boolean; appName: string } => {
  const ua = navigator.userAgent || navigator.vendor || (window as any).opera || ''

  // TikTok
  if (/BytedanceWebview|TikTok/i.test(ua)) {
    return { isInApp: true, appName: 'TikTok' }
  }
  // Instagram
  if (/Instagram/i.test(ua)) {
    return { isInApp: true, appName: 'Instagram' }
  }
  // Facebook
  if (/FBAN|FBAV|FB_IAB/i.test(ua)) {
    return { isInApp: true, appName: 'Facebook' }
  }
  // Snapchat
  if (/Snapchat/i.test(ua)) {
    return { isInApp: true, appName: 'Snapchat' }
  }
  // Twitter
  if (/Twitter/i.test(ua)) {
    return { isInApp: true, appName: 'Twitter' }
  }
  // LinkedIn
  if (/LinkedInApp/i.test(ua)) {
    return { isInApp: true, appName: 'LinkedIn' }
  }
  // Pinterest
  if (/Pinterest/i.test(ua)) {
    return { isInApp: true, appName: 'Pinterest' }
  }
  // WeChat
  if (/MicroMessenger/i.test(ua)) {
    return { isInApp: true, appName: 'WeChat' }
  }
  // Generic WebView detection
  if (/wv|WebView/i.test(ua)) {
    return { isInApp: true, appName: 'une application' }
  }

  return { isInApp: false, appName: '' }
}

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { signInWithGoogle } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [inAppBrowser, setInAppBrowser] = useState<{ isInApp: boolean; appName: string }>({ isInApp: false, appName: '' })
  const [copied, setCopied] = useState(false)

  // Détecter le navigateur in-app au montage
  useEffect(() => {
    setInAppBrowser(isInAppBrowser())
  }, [])

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback pour les navigateurs qui ne supportent pas clipboard
      const textArea = document.createElement('textarea')
      textArea.value = window.location.href
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!isOpen) return null

  const handleClose = () => {
    setError(null)
    setIsLoading(false)
    onClose()
  }

  const handleGoogleAuth = async () => {
    try {
      setIsLoading(true)
      setError(null)
      await signInWithGoogle()
      handleClose()
    } catch (error: any) {
      setError(error.message || 'Erreur lors de la connexion avec Google')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000] p-2 sm:p-4">
      <div className="bg-white border-3 sm:border-4 border-black max-w-md w-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-h-[95vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b-3 sm:border-b-4 border-black" style={{ backgroundColor: '#1D3354' }}>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white border-2 sm:border-3 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
            </div>
            <h2 className="font-display font-bold text-base sm:text-xl text-white">
              CONNEXION
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="w-7 h-7 sm:w-8 sm:h-8 border-2 border-black flex items-center justify-center shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] sm:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:rotate-90 transition-all duration-300"
            style={{ backgroundColor: '#D64045' }}
          >
            <X className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6" style={{ backgroundColor: '#E8DFD5' }}>
          {/* In-App Browser Warning */}
          {inAppBrowser.isInApp && (
            <div className="mb-4 sm:mb-5 p-3 bg-yellow-100 border-2 sm:border-3 border-yellow-500 shadow-[2px_2px_0px_0px_rgba(234,179,8,1)]">
              <div className="flex items-start gap-2 sm:gap-3">
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-display font-bold text-xs sm:text-sm text-yellow-800 mb-1.5 sm:mb-2">
                    Connexion Google impossible
                  </p>
                  <p className="font-body text-[10px] sm:text-xs text-yellow-700 mb-2 sm:mb-3">
                    Le navigateur de {inAppBrowser.appName} bloque la connexion Google.
                    Ouvrez ce lien dans Safari ou Chrome pour vous connecter.
                  </p>
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-yellow-500 text-white border-2 border-yellow-700 font-display font-bold text-[10px] sm:text-xs shadow-[2px_2px_0px_0px_rgba(161,98,7,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(161,98,7,1)] transition-all duration-200"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                        Lien copié !
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                        Copier le lien
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="text-center mb-5 sm:mb-6">
            <p className="font-body text-sm sm:text-base text-black/70">
              Connecte-toi avec Google pour accéder à toutes les fonctionnalités de <span className="font-semibold" style={{ color: '#1D3354' }}>VintBoost</span>.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 border-2 sm:border-3 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" style={{ backgroundColor: '#D64045' }}>
              <p className="font-body text-xs sm:text-sm text-white text-center">{error}</p>
            </div>
          )}

          {/* Google Button */}
          <button
            onClick={handleGoogleAuth}
            disabled={isLoading || inAppBrowser.isInApp}
            className={`w-full flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-white text-black border-3 sm:border-4 border-black font-display font-bold text-sm sm:text-base shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 ${
              isLoading || inAppBrowser.isInApp
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-gray-50 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] sm:hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Connexion en cours...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Se connecter avec Google
              </>
            )}
          </button>

          {/* Secure badge */}
          <div className="flex justify-center mt-5 sm:mt-6">
            <div className="flex items-center gap-2 px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" style={{ backgroundColor: '#9ED8DB' }}>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <span className="font-display font-bold text-xs">CONNEXION SECURISEE</span>
            </div>
          </div>

          {/* Cancel link */}
          <button
            onClick={handleClose}
            className="w-full text-center font-body text-sm text-black/50 hover:text-black transition-colors mt-4"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  )
}
