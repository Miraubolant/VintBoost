import { useState, useRef, useEffect } from 'react'
import { Sparkles, Copy, Link, CheckSquare, Settings, Download, ChevronLeft, ChevronRight } from 'lucide-react'

interface Step {
  number: number
  title: string
  description: string
  image: string
  icon: React.ReactNode
  color: string
}

const steps: Step[] = [
  {
    number: 1,
    title: 'COPIE L\'URL',
    description: 'Va sur Vinted et copie le lien de ton vestiaire',
    image: '/Etape1.png',
    icon: <Copy className="w-4 h-4" />,
    color: '#9ED8DB',
  },
  {
    number: 2,
    title: 'COLLE L\'URL',
    description: 'Colle ton lien dans VintBoost',
    image: '/Etape2.png',
    icon: <Link className="w-4 h-4" />,
    color: '#D64045',
  },
  {
    number: 3,
    title: 'SÉLECTIONNE',
    description: 'Choisis les articles à mettre en avant',
    image: '/Etape3.png',
    icon: <CheckSquare className="w-4 h-4" />,
    color: '#1D3354',
  },
  {
    number: 4,
    title: 'PERSONNALISE',
    description: 'Règle durée, musique et template',
    image: '/Etape4.png',
    icon: <Settings className="w-4 h-4" />,
    color: '#9ED8DB',
  },
  {
    number: 5,
    title: 'TÉLÉCHARGE',
    description: 'Ta vidéo est prête en 30 secondes !',
    image: '/Etape5.png',
    icon: <Download className="w-4 h-4" />,
    color: '#D64045',
  },
]

export function BeforeAfterSection() {
  const [activeStep, setActiveStep] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Handle scroll to update active step indicator
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollLeft = scrollContainerRef.current.scrollLeft
      const cardWidth = 280 + 16 // card width + gap
      const newActiveStep = Math.round(scrollLeft / cardWidth)
      setActiveStep(Math.min(newActiveStep, steps.length - 1))
    }
  }

  // Scroll to specific step
  const scrollToStep = (index: number) => {
    if (scrollContainerRef.current) {
      const cardWidth = 280 + 16
      scrollContainerRef.current.scrollTo({
        left: index * cardWidth,
        behavior: 'smooth'
      })
    }
  }

  // Navigate to previous/next step
  const navigatePrev = () => {
    const newIndex = Math.max(0, activeStep - 1)
    scrollToStep(newIndex)
  }

  const navigateNext = () => {
    const newIndex = Math.min(steps.length - 1, activeStep + 1)
    scrollToStep(newIndex)
  }

  useEffect(() => {
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <section id="before-after" className="py-8 sm:py-12 lg:py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" style={{ backgroundColor: '#D64045' }}>
            <Sparkles className="w-4 h-4 text-white" />
            <span className="font-display font-bold text-xs text-white">COMMENT ÇA MARCHE</span>
          </div>

          <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl mb-3">
            <div className="mb-1.5">
              <span
                className="inline-block bg-white text-black border-2 border-black px-3 py-1.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
              >
                CRÉE TA VIDÉO
              </span>
            </div>
            <div>
              <span
                className="inline-block text-white border-2 border-black px-3 py-1.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                style={{ backgroundColor: '#1D3354' }}
              >
                EN 5 ÉTAPES
              </span>
            </div>
          </h2>
          <p className="text-sm sm:text-base text-black/70 font-body max-w-lg mx-auto mt-4">
            Pas de compétences requises. <span style={{ color: '#D64045' }} className="font-semibold">30 secondes</span> suffisent pour créer une vidéo pro !
          </p>
        </div>

        {/* Steps - Desktop: Horizontal, Mobile: Carousel */}
        <div className="relative">
          {/* Desktop Layout - 5 columns */}
          <div className="hidden lg:grid lg:grid-cols-5 gap-4">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="absolute top-16 -right-2 w-4 h-0.5 bg-black z-10" />
                )}

                <div
                  className="border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden h-full flex flex-col"
                  style={{ backgroundColor: '#FFFFFF' }}
                >
                  {/* Step Header */}
                  <div
                    className="flex items-center justify-between px-3 py-2 border-b-3 border-black"
                    style={{ backgroundColor: step.color }}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-6 h-6 flex items-center justify-center border-2 border-black font-display font-bold text-xs bg-white"
                      >
                        {step.number}
                      </span>
                      <span className="font-display font-bold text-[10px] text-white">{step.title}</span>
                    </div>
                    <div className="text-white">{step.icon}</div>
                  </div>

                  {/* Screenshot */}
                  <div className="flex-1 p-2 flex items-center justify-center" style={{ backgroundColor: '#E8DFD5' }}>
                    <div className="border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] overflow-hidden bg-white">
                      <img
                        src={step.image}
                        alt={`Étape ${step.number}: ${step.title}`}
                        className="w-full h-auto max-h-[280px] object-contain"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="px-3 py-2 border-t-2 border-black bg-white">
                    <p className="text-[10px] font-body text-black/70 text-center leading-tight">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tablet Layout - 3 + 2 */}
          <div className="hidden md:grid lg:hidden md:grid-cols-3 gap-4 mb-4">
            {steps.slice(0, 3).map((step) => (
              <StepCard key={step.number} step={step} />
            ))}
          </div>
          <div className="hidden md:grid lg:hidden md:grid-cols-2 gap-4 max-w-md mx-auto">
            {steps.slice(3).map((step) => (
              <StepCard key={step.number} step={step} />
            ))}
          </div>

          {/* Mobile Layout - Improved Carousel */}
          <div className="md:hidden">
            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={navigatePrev}
                disabled={activeStep === 0}
                className="w-10 h-10 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-30 disabled:shadow-none active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
                style={{ backgroundColor: activeStep === 0 ? '#E8DFD5' : '#1D3354' }}
              >
                <ChevronLeft className={`w-5 h-5 ${activeStep === 0 ? 'text-black/30' : 'text-white'}`} />
              </button>

              {/* Step Counter */}
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-lg" style={{ color: '#1D3354' }}>
                  {activeStep + 1}
                </span>
                <span className="font-body text-black/50">/</span>
                <span className="font-body text-black/50">{steps.length}</span>
              </div>

              <button
                onClick={navigateNext}
                disabled={activeStep === steps.length - 1}
                className="w-10 h-10 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-30 disabled:shadow-none active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
                style={{ backgroundColor: activeStep === steps.length - 1 ? '#E8DFD5' : '#D64045' }}
              >
                <ChevronRight className={`w-5 h-5 ${activeStep === steps.length - 1 ? 'text-black/30' : 'text-white'}`} />
              </button>
            </div>

            {/* Carousel Container */}
            <div
              ref={scrollContainerRef}
              className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory"
              style={{ scrollSnapType: 'x mandatory' }}
            >
              <div className="flex gap-4" style={{ width: 'max-content' }}>
                {steps.map((step) => (
                  <div
                    key={step.number}
                    className="w-[280px] flex-shrink-0 snap-center"
                  >
                    <StepCardMobile step={step} isActive={activeStep === step.number - 1} />
                  </div>
                ))}
              </div>
            </div>

            {/* Progress Dots */}
            <div className="flex items-center justify-center gap-2 mt-3">
              {steps.map((step, i) => (
                <button
                  key={i}
                  onClick={() => scrollToStep(i)}
                  className={`w-3 h-3 border-2 border-black transition-all ${
                    activeStep === i
                      ? 'scale-125 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
                      : ''
                  }`}
                  style={{
                    backgroundColor: activeStep === i ? step.color : '#E8DFD5'
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 text-center">
          <div
            className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 px-4 sm:px-5 py-3 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            style={{ backgroundColor: '#9ED8DB' }}
          >
            <span className="font-display font-bold text-xs sm:text-sm">RÉSULTAT :</span>
            <span className="font-display font-bold text-base sm:text-lg" style={{ color: '#D64045' }}>+300% DE VUES</span>
            <span className="font-display font-bold text-xs sm:text-sm">EN MOYENNE</span>
          </div>
        </div>
      </div>
    </section>
  )
}

// Reusable Step Card Component for Tablet
function StepCard({ step }: { step: Step }) {
  return (
    <div
      className="border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden h-full flex flex-col"
      style={{ backgroundColor: '#FFFFFF' }}
    >
      {/* Step Header */}
      <div
        className="flex items-center justify-between px-3 py-2 border-b-3 border-black"
        style={{ backgroundColor: step.color }}
      >
        <div className="flex items-center gap-2">
          <span
            className="w-7 h-7 flex items-center justify-center border-2 border-black font-display font-bold text-sm bg-white"
          >
            {step.number}
          </span>
          <span className="font-display font-bold text-xs text-white">{step.title}</span>
        </div>
        <div className="text-white">{step.icon}</div>
      </div>

      {/* Screenshot */}
      <div className="flex-1 p-3 flex items-center justify-center" style={{ backgroundColor: '#E8DFD5' }}>
        <div className="border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] overflow-hidden bg-white">
          <img
            src={step.image}
            alt={`Étape ${step.number}: ${step.title}`}
            className="w-full h-auto max-h-[320px] object-contain"
          />
        </div>
      </div>

      {/* Description */}
      <div className="px-3 py-2.5 border-t-2 border-black bg-white">
        <p className="text-xs font-body text-black/70 text-center">
          {step.description}
        </p>
      </div>
    </div>
  )
}

// Enhanced Mobile Step Card with larger image
function StepCardMobile({ step, isActive }: { step: Step; isActive: boolean }) {
  return (
    <div
      className={`border-3 border-black overflow-hidden flex flex-col transition-all duration-300 ${
        isActive
          ? 'shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] scale-[1.02]'
          : 'shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] opacity-90'
      }`}
      style={{ backgroundColor: '#FFFFFF' }}
    >
      {/* Step Header */}
      <div
        className="flex items-center justify-between px-4 py-2.5 border-b-3 border-black"
        style={{ backgroundColor: step.color }}
      >
        <div className="flex items-center gap-3">
          <span
            className="w-8 h-8 flex items-center justify-center border-2 border-black font-display font-bold text-base bg-white"
          >
            {step.number}
          </span>
          <span className="font-display font-bold text-sm text-white">{step.title}</span>
        </div>
        <div className="text-white">{step.icon}</div>
      </div>

      {/* Screenshot - Larger on mobile */}
      <div className="p-3 flex items-center justify-center" style={{ backgroundColor: '#E8DFD5' }}>
        <div className="border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] overflow-hidden bg-white">
          <img
            src={step.image}
            alt={`Étape ${step.number}: ${step.title}`}
            className="w-full h-auto max-h-[380px] object-contain"
          />
        </div>
      </div>

      {/* Description */}
      <div className="px-4 py-3 border-t-2 border-black bg-white">
        <p className="text-sm font-body text-black/70 text-center">
          {step.description}
        </p>
      </div>
    </div>
  )
}
