import { useState, useEffect } from 'react'
import { Check, Zap, Sparkles, Shield, Clock, Loader2, Crown, X, LogIn } from 'lucide-react'
import { useStripe } from '../hooks/useStripe'
import { useAuth } from '../context/AuthContext'

interface PricingPlan {
  name: string
  price: string
  period?: string
  videos: string
  description: string
  features: string[]
  buttonText: string
  buttonStyle: 'white' | 'red' | 'cyan' | 'navy'
  popular?: boolean
  highlight?: string
  isFree?: boolean
  stripePlan?: 'pro' | 'business'
  icon: typeof Sparkles
}

const plans: PricingPlan[] = [
  {
    name: 'GRATUIT',
    price: '0€',
    videos: '1 vidéo',
    description: 'Pour découvrir',
    features: [
      '1 vidéo HD offerte',
      'Template Classic',
      'Watermark VintBoost',
      '5 articles max',
      'Sauvegarde 1 jour',
    ],
    buttonText: 'ESSAYER GRATUIT',
    buttonStyle: 'navy',
    isFree: true,
    icon: Sparkles,
  },
  {
    name: 'PACK PRO',
    price: '2,99€',
    videos: '5 vidéos',
    description: 'Achat unique',
    features: [
      '5 vidéos HD incluses',
      'Tous les templates',
      'Sans watermark',
      '10 articles max',
      'Sauvegarde 7 jours',
      'Export 1080p',
    ],
    buttonText: 'ACHETER LE PACK',
    buttonStyle: 'red',
    popular: true,
    highlight: 'POPULAIRE',
    stripePlan: 'pro',
    icon: Crown,
  },
  {
    name: 'BUSINESS',
    price: '5,99€',
    period: '/mois',
    videos: '15 vidéos/mois',
    description: 'Abonnement mensuel',
    features: [
      '15 vidéos 4K/mois',
      'Tous les templates',
      'Sans watermark',
      '20 articles max',
      'Sauvegarde 30 jours',
      'Export 4K',
    ],
    buttonText: 'S\'ABONNER',
    buttonStyle: 'navy',
    stripePlan: 'business',
    icon: Zap,
  },
]

export function PricingSection() {
  const { createCheckoutSession, loading } = useStripe()
  const { user, signInWithGoogle } = useAuth()
  const [shouldPulsePopular, setShouldPulsePopular] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)

  // Animation de pulsation après 3 secondes
  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldPulsePopular(true)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  const handleStopPulsePopular = () => setShouldPulsePopular(false)

  const handlePlanClick = async (plan: PricingPlan) => {
    if (plan.isFree) {
      const hero = document.getElementById('hero')
      if (hero) hero.scrollIntoView({ behavior: 'smooth' })
      return
    }

    if (!user) {
      setShowAuthModal(true)
      return
    }

    if (plan.stripePlan) {
      await createCheckoutSession(plan.stripePlan)
    }
  }

  const handleGoogleSignIn = async () => {
    setShowAuthModal(false)
    await signInWithGoogle()
  }

  return (
    <section id="pricing" className="relative py-16 lg:py-20 overflow-hidden" style={{ backgroundColor: '#E8DFD5' }}>
      {/* Formes décoratives neo-brutalism */}
      <div className="hidden md:block absolute top-16 left-12 w-12 h-12 border-4 border-black transform rotate-12 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] pointer-events-none" style={{ backgroundColor: '#D64045' }} />
      <div className="hidden md:block absolute top-1/3 right-8 w-10 h-10 border-3 border-black rounded-full shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] pointer-events-none" style={{ backgroundColor: '#9ED8DB' }} />
      <div className="hidden md:block absolute bottom-32 left-20 w-14 h-14 border-4 border-black transform -rotate-45 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] pointer-events-none" style={{ backgroundColor: '#1D3354' }} />
      <div className="hidden md:block absolute bottom-20 right-1/4 w-8 h-8 border-3 border-black transform rotate-12 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] pointer-events-none" style={{ backgroundColor: '#D64045' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Neo-Brutalism */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl xl:text-6xl tracking-tight">
            <div className="text-black transform -rotate-2 mb-4 relative">
              <span className="inline-block bg-white border-4 border-black px-6 sm:px-8 py-3 sm:py-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                NOS TARIFS
              </span>
            </div>
            <div className="text-white transform rotate-2 relative">
              <span className="inline-block border-4 border-black px-6 sm:px-8 py-3 sm:py-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" style={{ backgroundColor: '#1D3354' }}>
                POUR TOI
              </span>
            </div>
          </h2>

          <div className="max-w-2xl mx-auto pt-8 pb-4">
            <p className="font-body font-semibold text-base sm:text-lg text-gray-700">
              Teste <span className="font-bold" style={{ color: '#D64045' }}>gratuitement</span>, puis choisis le plan qui te correspond. Sans engagement !
            </p>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-12 lg:mb-16">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative border-4 border-black p-5 sm:p-6 lg:p-8 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transform hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[7px_7px_0px_0px_rgba(0,0,0,1)] sm:hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 ${
                plan.popular ? 'md:scale-105 mt-6 md:mt-0' : ''
              }`}
              style={{
                backgroundColor: plan.popular ? '#1D3354' : '#FFFFFF'
              }}
            >
              {/* Badge populaire */}
              {plan.popular && plan.highlight && (
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="text-white px-4 sm:px-6 py-1.5 sm:py-2 border-3 sm:border-4 border-black font-display font-bold text-xs sm:text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform rotate-2" style={{ backgroundColor: '#D64045' }}>
                    {plan.highlight}
                  </div>
                </div>
              )}

              {/* Header avec icône et nom */}
              <div className="text-center mb-6 lg:mb-8">
                <div className={`w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 border-4 border-black flex items-center justify-center transform ${plan.popular ? 'rotate-6' : 'rotate-12'} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}
                  style={{ backgroundColor: plan.popular ? '#D64045' : index === 2 ? '#1D3354' : '#9ED8DB' }}
                >
                  <plan.icon className={`w-7 h-7 sm:w-8 sm:h-8 ${index === 2 || plan.popular ? 'text-white' : 'text-black'}`} />
                </div>
                <h3 className={`font-display font-bold text-xl sm:text-2xl ${plan.popular ? 'text-white' : 'text-black'}`}>{plan.name}</h3>
                <p className={`text-xs sm:text-sm font-body mt-1 ${plan.popular ? 'text-white/70' : 'text-black/50'}`}>{plan.description}</p>
              </div>

              {/* Prix en vedette */}
              <div className="mb-6 lg:mb-8 p-4 sm:p-6 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" style={{ backgroundColor: '#E8DFD5' }}>
                <div className="text-center">
                  <div className="font-display font-bold text-3xl sm:text-4xl text-black mb-1">
                    {plan.price}
                    {plan.period && <span className="text-base sm:text-lg font-normal">{plan.period}</span>}
                  </div>
                  <div className="font-display font-bold text-xs sm:text-sm text-black uppercase">
                    {plan.period ? 'Par mois' : plan.isFree ? 'Pour toujours' : 'Achat unique'}
                  </div>
                  {plan.popular && (
                    <div className="mt-2 px-3 py-1 text-white border-2 border-black font-display font-bold text-xs inline-block transform rotate-2" style={{ backgroundColor: '#1D3354' }}>
                      MEILLEURE VALEUR
                    </div>
                  )}
                </div>
              </div>

              {/* Badge videos */}
              <div className="flex justify-center mb-6">
                <div className="px-4 py-2 border-3 border-black font-display font-bold text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" style={{ backgroundColor: '#9ED8DB' }}>
                  {plan.videos}
                </div>
              </div>

              {/* Fonctionnalités */}
              <ul className="space-y-3 sm:space-y-4 mb-8 lg:mb-10">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3 sm:gap-4">
                    <div className={`w-6 h-6 sm:w-7 sm:h-7 border-3 border-black flex items-center justify-center flex-shrink-0 transform rotate-12 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}
                      style={{ backgroundColor: plan.popular ? '#D64045' : index === 2 ? '#1D3354' : '#9ED8DB' }}
                    >
                      <Check className={`w-3 h-3 sm:w-4 sm:h-4 ${index === 2 || plan.popular ? 'text-white' : 'text-black'}`} />
                    </div>
                    <span className={`font-body font-semibold text-sm sm:text-base leading-relaxed ${plan.popular ? 'text-white' : 'text-black'}`}>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Bouton d'abonnement */}
              <button
                onClick={() => {
                  if (plan.popular) handleStopPulsePopular()
                  handlePlanClick(plan)
                }}
                onMouseEnter={() => {
                  if (plan.popular) handleStopPulsePopular()
                }}
                disabled={loading && !plan.isFree}
                className={`w-full px-5 sm:px-6 py-3 sm:py-4 border-4 border-black font-display font-bold text-base sm:text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                  plan.popular && shouldPulsePopular ? 'animate-pulse' : ''
                }`}
                style={{
                  backgroundColor: plan.buttonStyle === 'white' ? '#FFFFFF' : plan.buttonStyle === 'red' ? '#D64045' : plan.buttonStyle === 'navy' ? '#1D3354' : '#9ED8DB',
                  color: plan.buttonStyle === 'white' || plan.buttonStyle === 'cyan' ? '#000000' : '#FFFFFF'
                }}
              >
                <span className="flex items-center justify-center gap-2 sm:gap-3">
                  {loading && !plan.isFree ? (
                    <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
                  ) : (
                    <plan.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  )}
                  {!user && !plan.isFree ? 'SE CONNECTER' : plan.buttonText}
                </span>
              </button>
            </div>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-12 lg:mb-16">
          {/* Instant */}
          <div className="text-center h-full">
            <div className="border-4 border-black p-3 sm:p-4 lg:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 h-full min-h-[100px] sm:min-h-[120px] flex flex-col justify-center" style={{ backgroundColor: '#9ED8DB' }}>
              <div className="flex justify-center mb-2">
                <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-black" />
              </div>
              <div className="font-display font-bold text-lg sm:text-2xl lg:text-3xl mb-1 text-black">INSTANT</div>
              <div className="font-body font-semibold text-xs sm:text-sm text-black/70">Génération rapide</div>
            </div>
          </div>

          {/* Paiements sécurisés */}
          <div className="text-center h-full">
            <div className="border-4 border-black p-3 sm:p-4 lg:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 h-full min-h-[100px] sm:min-h-[120px] flex flex-col justify-center" style={{ backgroundColor: '#FFFFFF' }}>
              <div className="flex flex-wrap justify-center items-center gap-1 sm:gap-2 mb-2">
                <img src="https://js.stripe.com/v3/fingerprinted/img/visa-729c05c240c4bdb47b03ac81d9945bfe.svg" alt="Visa" className="h-5 sm:h-6 lg:h-7" />
                <img src="https://js.stripe.com/v3/fingerprinted/img/mastercard-4d8844094130711885b5e41b28c9848f.svg" alt="Mastercard" className="h-5 sm:h-6 lg:h-7" />
                <img src="https://js.stripe.com/v3/fingerprinted/img/amex-a49b82f46c5cd6a96a6e418a6ca1717c.svg" alt="Amex" className="h-5 sm:h-6 lg:h-7" />
              </div>
              <div className="font-body font-semibold text-xs sm:text-sm text-black/70">Paiement sécurisé</div>
            </div>
          </div>

          {/* 30s */}
          <div className="text-center h-full">
            <div className="border-4 border-black p-3 sm:p-4 lg:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 h-full min-h-[100px] sm:min-h-[120px] flex flex-col justify-center" style={{ backgroundColor: '#1D3354' }}>
              <div className="flex justify-center mb-2">
                <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="font-display font-bold text-lg sm:text-2xl lg:text-3xl mb-1 text-white">30s</div>
              <div className="font-body font-semibold text-xs sm:text-sm text-white/70">Par vidéo</div>
            </div>
          </div>

          {/* 24/7 */}
          <div className="text-center h-full">
            <div className="border-4 border-black p-3 sm:p-4 lg:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 h-full min-h-[100px] sm:min-h-[120px] flex flex-col justify-center" style={{ backgroundColor: '#D64045' }}>
              <div className="flex justify-center mb-2">
                <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="font-display font-bold text-lg sm:text-2xl lg:text-3xl mb-1 text-white">24/7</div>
              <div className="font-body font-semibold text-xs sm:text-sm text-white/70">Disponible</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="inline-block bg-white border-4 border-black p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="font-display font-bold text-xl sm:text-2xl text-black mb-4">
              Prêt à booster tes ventes ?
            </h3>
            <button
              onClick={() => {
                const heroSection = document.getElementById('hero')
                if (heroSection) {
                  heroSection.scrollIntoView({ behavior: 'smooth' })
                }
              }}
              className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 text-white border-3 border-black font-display font-bold text-sm sm:text-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
              style={{ backgroundColor: '#D64045' }}
            >
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              CRÉER MA VIDÉO
            </button>
          </div>
        </div>
      </div>

      {/* Modal de connexion requise */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[10000] p-4">
          <div className="bg-white border-4 border-black p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-md w-full relative">
            {/* Bouton fermer */}
            <button
              onClick={() => setShowAuthModal(false)}
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
              Connexion requise
            </h3>

            {/* Message */}
            <p className="font-body text-gray-700 text-center mb-6">
              Connecte-toi avec Google pour souscrire à un abonnement.
            </p>

            {/* Bouton Google */}
            <button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border-4 border-black font-display font-bold text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 mb-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Se connecter avec Google
            </button>

            {/* Lien annuler */}
            <button
              onClick={() => setShowAuthModal(false)}
              className="w-full text-center font-body text-gray-500 hover:text-black transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
