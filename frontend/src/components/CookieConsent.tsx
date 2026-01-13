import { useState, useEffect } from 'react'
import { Cookie, X, Check, Settings, ChevronDown, ChevronUp } from 'lucide-react'
import { Link } from 'react-router-dom'

interface CookiePreferences {
  necessary: boolean // Always true
  functional: boolean
}

const COOKIE_CONSENT_KEY = 'vintboost-cookie-consent'
const COOKIE_PREFERENCES_KEY = 'vintboost-cookie-preferences'

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    functional: false,
  })

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (!consent) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 1000)
      return () => clearTimeout(timer)
    } else {
      // Load saved preferences
      const savedPrefs = localStorage.getItem(COOKIE_PREFERENCES_KEY)
      if (savedPrefs) {
        try {
          setPreferences(JSON.parse(savedPrefs))
        } catch {
          // Invalid JSON, use defaults
        }
      }
    }
  }, [])

  const saveConsent = (prefs: CookiePreferences) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, new Date().toISOString())
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(prefs))
    setPreferences(prefs)
    setIsVisible(false)
  }

  const handleAcceptAll = () => {
    saveConsent({
      necessary: true,
      functional: true,
    })
  }

  const handleAcceptNecessary = () => {
    saveConsent({
      necessary: true,
      functional: false,
    })
  }

  const handleSavePreferences = () => {
    saveConsent(preferences)
  }

  // Function to open cookie settings (can be called from footer)
  const openSettings = () => {
    setIsVisible(true)
    setShowDetails(true)
  }

  // Expose openSettings globally for the footer link
  useEffect(() => {
    (window as unknown as { openCookieSettings: () => void }).openCookieSettings = openSettings
    return () => {
      delete (window as unknown as { openCookieSettings?: () => void }).openCookieSettings
    }
  }, [])

  if (!isVisible) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-[9998] animate-fade-in" />

      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 animate-slide-up">
        <div className="max-w-2xl mx-auto">
          <div
            className="border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
            style={{ backgroundColor: '#FFFFFF' }}
          >
            {/* Header */}
            <div
              className="p-4 border-b-2 border-black flex items-center justify-between"
              style={{ backgroundColor: '#1D3354' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white border-2 border-black flex items-center justify-center">
                  <Cookie className="w-5 h-5" />
                </div>
                <h2 className="font-display font-bold text-lg text-white">
                  GESTION DES COOKIES
                </h2>
              </div>
              <button
                onClick={() => setIsVisible(false)}
                className="w-8 h-8 bg-white border-2 border-black flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              <p className="font-body text-sm text-black/80 mb-4">
                VintBoost utilise des cookies pour assurer le bon fonctionnement du site et ameliorer votre experience.
                Nous respectons votre vie privee et n'utilisons <strong>aucun cookie publicitaire ou de tracking</strong>.
              </p>

              {/* Toggle details */}
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center gap-2 text-sm font-display font-bold mb-4 hover:underline"
                style={{ color: '#1D3354' }}
              >
                <Settings className="w-4 h-4" />
                Personnaliser mes choix
                {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {/* Cookie details */}
              {showDetails && (
                <div className="space-y-3 mb-4 p-3 border-2 border-black/10 bg-black/5">
                  {/* Necessary cookies */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        <p className="font-display font-bold text-sm text-black">Cookies necessaires</p>
                        <span className="text-[10px] px-2 py-0.5 bg-green-100 text-green-800 font-bold border border-green-300">
                          REQUIS
                        </span>
                      </div>
                      <p className="text-xs text-black/60 mt-1">
                        Essentiels au fonctionnement du site (authentification, securite). Ces cookies ne peuvent pas etre desactives.
                      </p>
                    </div>
                    <div className="w-12 h-6 bg-green-500 rounded-full flex items-center justify-end px-1 cursor-not-allowed">
                      <div className="w-4 h-4 bg-white rounded-full shadow"></div>
                    </div>
                  </div>

                  {/* Functional cookies */}
                  <div className="flex items-start justify-between gap-4 pt-3 border-t border-black/10">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        <p className="font-display font-bold text-sm text-black">Cookies fonctionnels</p>
                      </div>
                      <p className="text-xs text-black/60 mt-1">
                        Ameliorent votre experience en memorisant vos preferences (template, duree des videos).
                      </p>
                    </div>
                    <button
                      onClick={() => setPreferences(p => ({ ...p, functional: !p.functional }))}
                      className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                        preferences.functional ? 'bg-blue-500 justify-end' : 'bg-gray-300 justify-start'
                      }`}
                    >
                      <div className="w-4 h-4 bg-white rounded-full shadow"></div>
                    </button>
                  </div>
                </div>
              )}

              {/* Privacy link */}
              <p className="text-xs text-black/60 mb-4">
                Pour en savoir plus, consultez notre{' '}
                <Link to="/confidentialite" className="underline" style={{ color: '#1D3354' }}>
                  Politique de confidentialite
                </Link>.
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-2">
                {showDetails ? (
                  <button
                    onClick={handleSavePreferences}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-black font-display font-bold text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
                    style={{ backgroundColor: '#9ED8DB' }}
                  >
                    <Settings className="w-4 h-4" />
                    ENREGISTRER MES CHOIX
                  </button>
                ) : (
                  <button
                    onClick={handleAcceptNecessary}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-black font-display font-bold text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
                    style={{ backgroundColor: '#FFFFFF' }}
                  >
                    NECESSAIRES UNIQUEMENT
                  </button>
                )}
                <button
                  onClick={handleAcceptAll}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-black font-display font-bold text-sm text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
                  style={{ backgroundColor: '#D64045' }}
                >
                  <Check className="w-4 h-4" />
                  TOUT ACCEPTER
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animation styles */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.4s ease-out;
        }
      `}</style>
    </>
  )
}

// Hook to check cookie preferences
export function useCookiePreferences(): CookiePreferences {
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    functional: false,
  })

  useEffect(() => {
    const savedPrefs = localStorage.getItem(COOKIE_PREFERENCES_KEY)
    if (savedPrefs) {
      try {
        setPreferences(JSON.parse(savedPrefs))
      } catch {
        // Invalid JSON
      }
    }
  }, [])

  return preferences
}

// Function to open cookie settings from anywhere
export function openCookieSettings() {
  const win = window as unknown as { openCookieSettings?: () => void }
  if (win.openCookieSettings) {
    win.openCookieSettings()
  }
}
