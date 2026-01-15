import { useState } from 'react'
import { Check, X, Crown, Zap, Loader2, LogIn } from 'lucide-react'
import { useStripe } from '../hooks/useStripe'
import { useAuth } from '../context/AuthContext'

interface PricingModalProps {
  isOpen: boolean
  onClose: () => void
}

const plans = [
  {
    name: 'PACK PRO',
    price: '2.99€',
    period: ' unique',
    videos: '5 videos',
    features: [
      '5 videos HD',
      '10 articles/video',
      'Sans watermark',
      'Tous les templates',
    ],
    buttonText: 'ACHETER LE PACK',
    popular: true,
    stripePlan: 'pro' as const,
    icon: Crown,
    bgColor: '#1D3354',
  },
  {
    name: 'BUSINESS',
    price: '5.99€',
    period: '/mois',
    videos: '15 videos',
    features: [
      '15 videos 4K/mois',
      '20 articles/video',
      'Sans watermark',
      'Support prioritaire',
    ],
    buttonText: 'S\'ABONNER',
    popular: false,
    stripePlan: 'business' as const,
    icon: Zap,
    bgColor: '#FFFFFF',
  },
]

export function PricingModal({ isOpen, onClose }: PricingModalProps) {
  const { createCheckoutSession, loading } = useStripe()
  const { user, signInWithGoogle } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)

  if (!isOpen) return null

  const handlePlanClick = async (stripePlan: 'pro' | 'business') => {
    if (!user) {
      setShowAuthModal(true)
      return
    }
    await createCheckoutSession(stripePlan)
  }

  const handleGoogleSignIn = async () => {
    setShowAuthModal(false)
    await signInWithGoogle()
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[10000] p-4">
      <div
        className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-2xl w-full relative max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: '#E8DFD5' }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all z-10"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          <X className="w-4 h-4 text-black" />
        </button>

        {/* Header */}
        <div className="text-center pt-6 pb-4 px-4">
          <h2
            className="inline-block font-display font-bold text-xl sm:text-2xl text-white border-3 border-black px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            style={{ backgroundColor: '#1D3354' }}
          >
            PASSER AU NIVEAU SUPERIEUR
          </h2>
          <p className="font-body text-sm text-black/70 mt-3">
            Debloquez plus d'articles, de videos et de fonctionnalites !
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid sm:grid-cols-2 gap-4 p-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative border-3 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
                plan.popular ? 'ring-2 ring-offset-2 ring-[#D64045]' : ''
              }`}
              style={{ backgroundColor: plan.bgColor }}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div
                    className="text-white px-3 py-1 border-2 border-black font-display font-bold text-[10px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    style={{ backgroundColor: '#D64045' }}
                  >
                    POPULAIRE
                  </div>
                </div>
              )}

              {/* Header */}
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  style={{ backgroundColor: plan.popular ? '#D64045' : '#9ED8DB' }}
                >
                  <plan.icon className={`w-5 h-5 ${plan.popular ? 'text-white' : 'text-black'}`} />
                </div>
                <div>
                  <h3 className={`font-display font-bold text-lg ${plan.popular ? 'text-white' : 'text-black'}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-xs ${plan.popular ? 'text-white/60' : 'text-black/50'}`}>
                    {plan.videos}/mois
                  </p>
                </div>
              </div>

              {/* Price */}
              <div
                className="mb-3 p-3 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                style={{ backgroundColor: '#FFFFFF' }}
              >
                <div className="text-center">
                  <span className="font-display font-bold text-2xl text-black">{plan.price}</span>
                  <span className="font-body text-sm text-black/60">{plan.period}</span>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-2 mb-4">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div
                      className="w-5 h-5 border border-black flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: plan.popular ? '#9ED8DB' : '#9ED8DB' }}
                    >
                      <Check className="w-3 h-3 text-black" />
                    </div>
                    <span className={`font-body text-xs ${plan.popular ? 'text-white' : 'text-black'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                onClick={() => handlePlanClick(plan.stripePlan)}
                disabled={loading}
                className={`w-full px-4 py-2.5 border-2 border-black font-display font-bold text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                style={{
                  backgroundColor: plan.popular ? '#D64045' : '#1D3354',
                  color: '#FFFFFF',
                }}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                ) : !user ? (
                  'SE CONNECTER'
                ) : (
                  plan.buttonText
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-4 pb-4">
          <div className="flex items-center justify-center gap-2 text-xs text-black/50">
            <span>Paiement securise par</span>
            <img
              src="https://js.stripe.com/v3/fingerprinted/img/visa-729c05c240c4bdb47b03ac81d9945bfe.svg"
              alt="Visa"
              className="h-4"
            />
            <img
              src="https://js.stripe.com/v3/fingerprinted/img/mastercard-4d8844094130711885b5e41b28c9848f.svg"
              alt="Mastercard"
              className="h-4"
            />
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[10001] p-4">
          <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] max-w-sm w-full">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-3 right-3 w-8 h-8 border-2 border-black flex items-center justify-center"
              style={{ backgroundColor: '#E8DFD5' }}
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex justify-center mb-4">
              <div
                className="w-14 h-14 border-3 border-black flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                style={{ backgroundColor: '#1D3354' }}
              >
                <LogIn className="w-7 h-7 text-white" />
              </div>
            </div>

            <h3 className="font-display font-bold text-xl text-center text-black mb-2">
              Connexion requise
            </h3>
            <p className="font-body text-sm text-black/60 text-center mb-4">
              Connecte-toi pour souscrire
            </p>

            <button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border-3 border-black font-display font-bold text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all mb-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>

            <button
              onClick={() => setShowAuthModal(false)}
              className="w-full text-center font-body text-sm text-black/50 hover:text-black"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
