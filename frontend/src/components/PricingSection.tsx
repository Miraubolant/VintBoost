import { Check, Zap, Sparkles, Shield, Clock } from 'lucide-react'

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
}

const plans: PricingPlan[] = [
  {
    name: 'GRATUIT',
    price: '0€',
    videos: '1 video',
    description: 'Pour decouvrir',
    features: [
      '1 video HD offerte',
      'Templates basiques',
      'Watermark VintBoost',
      'Export rapide',
    ],
    buttonText: 'ESSAYER GRATUIT',
    buttonStyle: 'navy',
    isFree: true,
  },
  {
    name: 'PRO',
    price: '3.99€',
    period: '/mois',
    videos: '15 videos',
    description: 'Le plus populaire',
    features: [
      '15 videos HD/mois',
      'Tous les templates',
      'Sans watermark',
      'Support prioritaire',
      'Export 1080p',
    ],
    buttonText: 'CHOISIR PRO',
    buttonStyle: 'red',
    popular: true,
    highlight: 'POPULAIRE',
  },
  {
    name: 'BUSINESS',
    price: '12.99€',
    period: '/mois',
    videos: '50 videos',
    description: 'Pour les pros',
    features: [
      '50 videos 4K/mois',
      'Tous les templates',
      'Sans watermark',
      'Support 24/7',
      'Export 4K',
    ],
    buttonText: 'CHOISIR BUSINESS',
    buttonStyle: 'navy',
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="py-8 sm:py-12 lg:py-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" style={{ backgroundColor: '#9ED8DB' }}>
            <Sparkles className="w-4 h-4" />
            <span className="font-display font-bold text-xs">PRIX IMBATTABLES</span>
          </div>

          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl mb-3">
            <span
              className="inline-block text-white border-2 border-black px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              style={{ backgroundColor: '#1D3354' }}
            >
              NOS TARIFS
            </span>
          </h2>
          <p className="text-sm sm:text-base text-black/70 font-body max-w-lg mx-auto mt-4">
            Teste <span style={{ color: '#D64045' }} className="font-semibold">gratuitement</span>, puis choisis le plan qui te correspond. Sans engagement, annule quand tu veux !
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative border-3 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] flex flex-col ${
                plan.popular ? 'md:-translate-y-4 md:scale-105' : ''
              }`}
              style={{ backgroundColor: plan.popular ? '#1D3354' : '#FFFFFF' }}
            >
              {/* Popular Ribbon */}
              {plan.popular && plan.highlight && (
                <div
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1.5 border-2 border-black font-display font-bold text-[10px] text-black whitespace-nowrap shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  style={{ backgroundColor: '#D64045' }}
                >
                  {plan.highlight}
                </div>
              )}

              {/* Card Content */}
              <div className="p-6 flex flex-col flex-1">
                {/* Plan Name */}
                <div className="text-center mb-4">
                  <h3 className={`font-display font-bold text-lg mb-1 ${plan.popular ? 'text-white' : 'text-black'}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-xs font-body ${plan.popular ? 'text-white/70' : 'text-black/50'}`}>
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="text-center mb-2">
                  <div className={`font-display font-bold text-4xl sm:text-5xl ${plan.popular ? 'text-white' : 'text-black'}`}>
                    {plan.price}
                    {plan.period && (
                      <span className="text-base font-normal">{plan.period}</span>
                    )}
                  </div>
                </div>

                {/* Videos Badge */}
                <div className="flex justify-center mb-6">
                  <div
                    className="px-4 py-2 border-2 border-black font-display font-bold text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    style={{ backgroundColor: '#9ED8DB' }}
                  >
                    {plan.videos}
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-6 flex-1">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <div
                        className="w-5 h-5 border-2 border-black flex items-center justify-center shrink-0"
                        style={{ backgroundColor: '#9ED8DB' }}
                      >
                        <Check className="w-3 h-3 text-black" />
                      </div>
                      <span className={`text-sm font-body ${plan.popular ? 'text-white' : 'text-black'}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  className={`w-full px-4 py-3 border-2 border-black font-display font-bold text-sm flex items-center justify-center gap-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all duration-200`}
                  style={{
                    backgroundColor: plan.buttonStyle === 'white' ? '#FFFFFF' : plan.buttonStyle === 'red' ? '#D64045' : plan.buttonStyle === 'navy' ? '#1D3354' : '#9ED8DB',
                    color: plan.buttonStyle === 'white' || plan.buttonStyle === 'cyan' ? '#000000' : '#FFFFFF'
                  }}
                >
                  <Zap className="w-4 h-4" />
                  {plan.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Cards - compact version */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-10">
          {/* Instant */}
          <div
            className="flex items-center gap-2 px-3 py-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            style={{ backgroundColor: '#9ED8DB' }}
          >
            <Clock className="w-4 h-4 text-black" />
            <span className="font-display font-bold text-xs text-black">INSTANT</span>
          </div>

          {/* Paiements securises */}
          <div
            className="flex items-center gap-2 px-3 py-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            style={{ backgroundColor: '#FFFFFF' }}
          >
            <div className="flex items-center gap-1">
              <div className="bg-[#1A1F71] text-white text-[7px] font-bold px-1.5 py-0.5 rounded-sm">VISA</div>
              <div className="flex">
                <div className="w-3 h-3 rounded-full bg-[#EB001B] -mr-1"></div>
                <div className="w-3 h-3 rounded-full bg-[#F79E1B]"></div>
              </div>
            </div>
            <span className="font-body text-xs text-black/70">Securise</span>
          </div>

          {/* 30s */}
          <div
            className="flex items-center gap-2 px-3 py-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            style={{ backgroundColor: '#1D3354' }}
          >
            <Zap className="w-4 h-4 text-white" />
            <span className="font-display font-bold text-xs text-white">30s</span>
          </div>

          {/* 24/7 */}
          <div
            className="flex items-center gap-2 px-3 py-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            style={{ backgroundColor: '#D64045' }}
          >
            <Shield className="w-4 h-4 text-white" />
            <span className="font-display font-bold text-xs text-white">24/7</span>
          </div>
        </div>
      </div>
    </section>
  )
}
