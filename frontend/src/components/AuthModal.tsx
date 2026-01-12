import { useState } from 'react'
import { Link } from 'react-router-dom'
import { X, Mail, Lock, Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

type AuthMode = 'login' | 'signup'

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth()
  const [mode, setMode] = useState<AuthMode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!email || !password) {
      setError('Veuillez remplir tous les champs')
      return
    }

    if (mode === 'signup' && password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères')
      return
    }

    setLoading(true)

    try {
      if (mode === 'login') {
        const { error } = await signInWithEmail(email, password)
        if (error) {
          setError(translateError(error))
          setLoading(false)
          return
        }
        // Success - close modal
        onClose()
        resetForm()
      } else {
        const result = await signUpWithEmail(email, password, fullName || undefined)

        if (result.error) {
          setError(translateError(result.error))
          setLoading(false)
          return
        }

        if (result.needsEmailConfirmation) {
          // Email confirmation required - show message
          setSuccess('Compte cree ! Verifie ton email pour confirmer ton inscription.')
          setLoading(false)
          return
        }

        // Success without email confirmation - close modal
        onClose()
        resetForm()
      }
    } catch {
      setError('Une erreur est survenue')
    }

    setLoading(false)
  }

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true)
    setError('')

    try {
      await signInWithGoogle()
      // The redirect will happen automatically
    } catch (err) {
      setError('Erreur de connexion avec Google')
      setGoogleLoading(false)
    }
  }

  const translateError = (error: string): string => {
    const errorMap: Record<string, string> = {
      'Invalid login credentials': 'Email ou mot de passe incorrect',
      'User already registered': 'Cet email est deja utilise',
      'Email not confirmed': 'Veuillez confirmer votre email',
      'Password should be at least 6 characters': 'Le mot de passe doit contenir au moins 6 caracteres',
      'Unable to validate email address: invalid format': 'Format d\'email invalide',
      'Signup requires a valid password': 'Mot de passe invalide',
      'To signup, please provide your email': 'Veuillez fournir une adresse email',
      'A user with this email address has already been registered': 'Cet email est deja utilise',
      'Email rate limit exceeded': 'Trop de tentatives, reessayez plus tard',
      'For security purposes, you can only request this once every 60 seconds': 'Attendez 60 secondes avant de reessayer',
    }
    // Check for partial matches
    for (const [key, value] of Object.entries(errorMap)) {
      if (error.toLowerCase().includes(key.toLowerCase())) {
        return value
      }
    }
    return error
  }

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setFullName('')
    setError('')
    setSuccess('')
  }

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode)
    resetForm()
  }

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-md border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
        style={{ backgroundColor: '#FFFFFF' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3 border-b-3 border-black"
          style={{ backgroundColor: '#1D3354' }}
        >
          <h2 className="font-display font-bold text-lg text-white">
            {mode === 'login' ? 'CONNEXION' : 'INSCRIPTION'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 border-2 border-black flex items-center justify-center font-bold text-xs hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
            style={{ backgroundColor: '#D64045' }}
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Google OAuth Button - Prominent Position */}
        <div className="p-5 border-b-2 border-black" style={{ backgroundColor: '#F5F5F5' }}>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full py-3 border-2 border-black font-display font-bold text-sm flex items-center justify-center gap-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50"
            style={{ backgroundColor: '#FFFFFF' }}
          >
            {googleLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                CONNEXION EN COURS...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                CONTINUER AVEC GOOGLE
              </>
            )}
          </button>
          <p className="text-center text-xs text-black/50 font-body mt-2">
            Recommande - Connexion rapide et securisee
          </p>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 px-5 py-3">
          <div className="flex-1 h-px bg-black/20" />
          <span className="text-xs font-body text-black/40">OU PAR EMAIL</span>
          <div className="flex-1 h-px bg-black/20" />
        </div>

        {/* Tabs */}
        <div className="flex border-b-2 border-black mx-5">
          <button
            onClick={() => switchMode('login')}
            className="flex-1 py-2 font-display font-bold text-xs transition-colors border-2 border-black border-b-0"
            style={{
              backgroundColor: mode === 'login' ? '#9ED8DB' : '#FFFFFF',
              borderRight: 'none',
              marginBottom: '-2px'
            }}
          >
            CONNEXION
          </button>
          <button
            onClick={() => switchMode('signup')}
            className="flex-1 py-2 font-display font-bold text-xs transition-colors border-2 border-black border-b-0"
            style={{
              backgroundColor: mode === 'signup' ? '#9ED8DB' : '#FFFFFF',
              marginBottom: '-2px'
            }}
          >
            INSCRIPTION
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3">
          {/* Full Name (signup only) */}
          {mode === 'signup' && (
            <div>
              <label className="block font-display font-bold text-xs text-black mb-1">
                NOM COMPLET
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ton nom"
                className="w-full px-3 py-2 border-2 border-black font-body text-sm placeholder:text-black/40 focus:outline-none"
                style={{ backgroundColor: '#FFFFFF' }}
              />
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block font-display font-bold text-xs text-black mb-1">
              EMAIL
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ton@email.com"
                className="w-full pl-10 pr-4 py-2 border-2 border-black font-body text-sm placeholder:text-black/40 focus:outline-none"
                style={{ backgroundColor: '#FFFFFF' }}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block font-display font-bold text-xs text-black mb-1">
              MOT DE PASSE
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 caractères"
                className="w-full pl-10 pr-10 py-2 border-2 border-black font-body text-sm placeholder:text-black/40 focus:outline-none"
                style={{ backgroundColor: '#FFFFFF' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 hover:text-black"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password (signup only) */}
          {mode === 'signup' && (
            <div>
              <label className="block font-display font-bold text-xs text-black mb-1">
                CONFIRMER MOT DE PASSE
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirme ton mot de passe"
                  className="w-full pl-10 pr-4 py-2 border-2 border-black font-body text-sm placeholder:text-black/40 focus:outline-none"
                  style={{ backgroundColor: '#FFFFFF' }}
                />
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div
              className="px-3 py-2 border-2 border-black text-xs font-bold"
              style={{ backgroundColor: '#D64045', color: '#FFFFFF' }}
            >
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div
              className="px-3 py-2 border-2 border-black text-xs font-bold flex items-center gap-2"
              style={{ backgroundColor: '#22C55E', color: '#FFFFFF' }}
            >
              <CheckCircle className="w-4 h-4" />
              {success}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 border-2 border-black font-display font-bold text-sm text-white flex items-center justify-center gap-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50"
            style={{ backgroundColor: '#1D3354' }}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                CHARGEMENT...
              </>
            ) : (
              mode === 'login' ? 'SE CONNECTER' : 'CREER MON COMPTE'
            )}
          </button>

          {/* Forgot Password (login only) */}
          {mode === 'login' && (
            <button
              type="button"
              className="w-full text-center text-xs font-body text-black/60 hover:text-black hover:underline"
            >
              Mot de passe oublie ?
            </button>
          )}
        </form>

        {/* Terms */}
        <div className="px-5 pb-4">
          <p className="text-[10px] text-black/50 font-body text-center">
            En continuant, tu acceptes nos{' '}
            <Link to="/cgu" onClick={onClose} className="underline hover:text-black">Conditions d'utilisation</Link>
            {' '}et notre{' '}
            <Link to="/confidentialite" onClick={onClose} className="underline hover:text-black">Politique de confidentialite</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
