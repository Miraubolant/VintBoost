import { useState } from 'react'
import { X, LogIn, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { signInWithGoogle } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError('')

    try {
      await signInWithGoogle()
      // The redirect will happen automatically
    } catch {
      setError('Erreur de connexion avec Google')
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[10000] p-4">
      <div className="bg-white border-4 border-black p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-md w-full relative">
        {/* Bouton fermer */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 border-3 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
          style={{ backgroundColor: '#E8DFD5' }}
        >
          <X className="w-4 h-4 text-black" />
        </button>

        {/* Icône */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 border-4 border-black flex items-center justify-center transform rotate-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" style={{ backgroundColor: '#1D3354' }}>
            <LogIn className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Titre */}
        <h3 className="font-display font-bold text-xl sm:text-2xl text-center text-black mb-3">
          Connexion
        </h3>

        {/* Message */}
        <p className="font-body text-gray-700 text-center mb-6">
          Connecte-toi avec Google pour acceder a toutes les fonctionnalites de VintBoost.
        </p>

        {/* Error */}
        {error && (
          <div
            className="px-4 py-3 border-3 border-black text-sm font-bold mb-4 text-center"
            style={{ backgroundColor: '#D64045', color: '#FFFFFF' }}
          >
            {error}
          </div>
        )}

        {/* Bouton Google */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border-4 border-black font-display font-bold text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Connexion en cours...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Se connecter avec Google
            </>
          )}
        </button>

        {/* Badge sécurisé */}
        <div className="flex justify-center">
          <div className="flex items-center gap-2 px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" style={{ backgroundColor: '#9ED8DB' }}>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <span className="font-display font-bold text-xs">CONNEXION SECURISEE</span>
          </div>
        </div>

        {/* Lien annuler */}
        <button
          onClick={onClose}
          className="w-full text-center font-body text-gray-500 hover:text-black transition-colors mt-4"
        >
          Annuler
        </button>
      </div>
    </div>
  )
}
