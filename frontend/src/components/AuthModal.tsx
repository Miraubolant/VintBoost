import { useState, useEffect } from 'react'
import { X, User, Copy, Check, AlertTriangle, Loader2, LogIn, UserPlus, Mail, Lock, Eye, EyeOff } from 'lucide-react'
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

type AuthTab = 'signin' | 'signup'

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth()
  const [activeTab, setActiveTab] = useState<AuthTab>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
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

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setFullName('')
    setShowPassword(false)
    setError(null)
    setSuccessMessage(null)
    setIsLoading(false)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleTabChange = (tab: AuthTab) => {
    setActiveTab(tab)
    setError(null)
    setSuccessMessage(null)
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password: string) => {
    return password.length >= 6
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

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateEmail(email)) {
      setError('Adresse email invalide')
      return
    }

    if (!validatePassword(password)) {
      setError('Le mot de passe doit contenir au moins 6 caractères')
      return
    }

    if (activeTab === 'signup' && !fullName.trim()) {
      setError('Le nom complet est requis')
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      setSuccessMessage(null)

      if (activeTab === 'signin') {
        const result = await signInWithEmail(email, password)
        if (result.error) {
          if (result.error.includes('Invalid login credentials')) {
            setError('Email ou mot de passe incorrect')
          } else if (result.error.includes('Email not confirmed')) {
            setError('Veuillez confirmer votre email avant de vous connecter')
          } else {
            setError(result.error)
          }
        } else {
          handleClose()
        }
      } else {
        const result = await signUpWithEmail(email, password, fullName.trim())
        if (result.error) {
          if (result.error.includes('User already registered')) {
            setError('Cette adresse email est déjà utilisée')
          } else {
            setError(result.error)
          }
        } else if (result.needsEmailConfirmation) {
          setSuccessMessage('Un email de confirmation a été envoyé. Vérifie ta boîte de réception !')
          resetForm()
        } else {
          handleClose()
        }
      }
    } catch (error: any) {
      setError(error.message || 'Une erreur est survenue')
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
              {activeTab === 'signin' ? 'CONNEXION' : 'INSCRIPTION'}
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

        {/* Tabs */}
        <div className="flex gap-1 p-2 sm:p-3 border-b-3 sm:border-b-4 border-black" style={{ backgroundColor: '#E8DFD5' }}>
          <button
            onClick={() => handleTabChange('signin')}
            className={`flex-1 py-2 px-2 sm:px-3 font-display font-bold text-xs sm:text-sm transition-all duration-200 border-2 sm:border-3 border-black ${
              activeTab === 'signin'
                ? 'text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] translate-y-[-2px]'
                : 'bg-white text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-50 hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
            }`}
            style={{ backgroundColor: activeTab === 'signin' ? '#1D3354' : undefined }}
          >
            <div className="flex items-center justify-center gap-1 sm:gap-2">
              <LogIn className="w-3 h-3 sm:w-4 sm:h-4" />
              CONNEXION
            </div>
          </button>
          <button
            onClick={() => handleTabChange('signup')}
            className={`flex-1 py-2 px-2 sm:px-3 font-display font-bold text-xs sm:text-sm transition-all duration-200 border-2 sm:border-3 border-black ${
              activeTab === 'signup'
                ? 'text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] translate-y-[-2px]'
                : 'bg-white text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-50 hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
            }`}
            style={{ backgroundColor: activeTab === 'signup' ? '#9ED8DB' : undefined }}
          >
            <div className="flex items-center justify-center gap-1 sm:gap-2">
              <UserPlus className="w-3 h-3 sm:w-4 sm:h-4" />
              INSCRIPTION
            </div>
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
                    Utilisez email/mot de passe ou ouvrez ce lien dans Safari/Chrome.
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

          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 p-3 border-2 sm:border-3 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" style={{ backgroundColor: '#9ED8DB' }}>
              <p className="font-body text-xs sm:text-sm text-black text-center">{successMessage}</p>
            </div>
          )}

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
            className={`w-full flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-white text-black border-3 sm:border-4 border-black font-display font-bold text-sm sm:text-base shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 mb-4 ${
              isLoading || inAppBrowser.isInApp
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-gray-50 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] sm:hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]'
            }`}
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {activeTab === 'signin' ? 'Connexion avec Google' : 'Inscription avec Google'}
          </button>

          {/* Separator */}
          <div className="flex items-center mb-4">
            <div className="flex-1 h-0.5 bg-black"></div>
            <span className="px-3 sm:px-4 font-display font-bold text-xs sm:text-sm text-gray-600">OU</span>
            <div className="flex-1 h-0.5 bg-black"></div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailAuth} className="space-y-3 sm:space-y-4">
            {/* Full Name (only for signup) */}
            {activeTab === 'signup' && (
              <div>
                <label className="block font-display font-bold text-xs sm:text-sm text-black mb-1 sm:mb-2">
                  Nom complet
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2.5 sm:pl-3 flex items-center pointer-events-none">
                    <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm border-2 sm:border-3 border-black font-body shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-x-[-1px] focus:translate-y-[-1px] focus:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
                    placeholder="Ton nom complet"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block font-display font-bold text-xs sm:text-sm text-black mb-1 sm:mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 sm:pl-3 flex items-center pointer-events-none">
                  <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm border-2 sm:border-3 border-black font-body shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-x-[-1px] focus:translate-y-[-1px] focus:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
                  placeholder="ton@email.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block font-display font-bold text-xs sm:text-sm text-black mb-1 sm:mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 sm:pl-3 flex items-center pointer-events-none">
                  <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-8 sm:pl-10 pr-10 sm:pr-12 py-2 sm:py-2.5 text-sm border-2 sm:border-3 border-black font-body shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-x-[-1px] focus:translate-y-[-1px] focus:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-2.5 sm:pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 hover:text-gray-700" />
                  ) : (
                    <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 hover:text-gray-700" />
                  )}
                </button>
              </div>
              {activeTab === 'signup' && (
                <p className="text-[10px] sm:text-xs text-gray-600 mt-1 font-body">
                  Minimum 6 caractères
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2.5 sm:py-3 px-3 sm:px-4 text-white border-2 sm:border-3 border-black font-display font-bold text-xs sm:text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 ${
                isLoading
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
              }`}
              style={{ backgroundColor: activeTab === 'signin' ? '#1D3354' : '#D64045' }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {activeTab === 'signin' ? 'Connexion...' : 'Inscription...'}
                </div>
              ) : (
                activeTab === 'signin' ? 'SE CONNECTER' : 'S\'INSCRIRE'
              )}
            </button>
          </form>

          {/* Switch Tab Link */}
          <div className="mt-4 sm:mt-5 text-center">
            <p className="text-[10px] sm:text-xs text-gray-600 font-body">
              {activeTab === 'signin' ? (
                <>
                  Pas encore de compte ?{' '}
                  <button
                    onClick={() => handleTabChange('signup')}
                    className="font-bold hover:underline"
                    style={{ color: '#1D3354' }}
                  >
                    Inscris-toi
                  </button>
                </>
              ) : (
                <>
                  Déjà un compte ?{' '}
                  <button
                    onClick={() => handleTabChange('signin')}
                    className="font-bold hover:underline"
                    style={{ color: '#1D3354' }}
                  >
                    Connecte-toi
                  </button>
                </>
              )}
            </p>
          </div>

          {/* Secure badge */}
          <div className="flex justify-center mt-4 sm:mt-5">
            <div className="flex items-center gap-2 px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" style={{ backgroundColor: '#9ED8DB' }}>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <span className="font-display font-bold text-xs">CONNEXION SÉCURISÉE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
