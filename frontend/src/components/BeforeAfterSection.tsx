import { useState, useRef, useEffect, useCallback } from 'react'
import { Sparkles, Copy, Link, CheckSquare, Settings, Download, ChevronLeft, ChevronRight, Hand } from 'lucide-react'

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
    color: '#1D3354',
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
    color: '#D64045',
  },
  {
    number: 5,
    title: 'TÉLÉCHARGE',
    description: 'Ta vidéo est prête en 30 secondes !',
    image: '/Etape5.png',
    icon: <Download className="w-4 h-4" />,
    color: '#1D3354',
  },
]

export function BeforeAfterSection() {
  const [activeStep, setActiveStep] = useState(0)
  const [showSwipeHint, setShowSwipeHint] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Handle scroll to update active step indicator
  const handleScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const scrollLeft = container.scrollLeft
      const containerWidth = container.clientWidth
      const newActiveStep = Math.round(scrollLeft / containerWidth)
      setActiveStep(Math.min(newActiveStep, steps.length - 1))

      // Hide swipe hint after first scroll
      if (scrollLeft > 20 && showSwipeHint) {
        setShowSwipeHint(false)
      }
    }
  }, [showSwipeHint])

  // Scroll to specific step
  const scrollToStep = (index: number) => {
    if (scrollContainerRef.current) {
      const containerWidth = scrollContainerRef.current.clientWidth
      scrollContainerRef.current.scrollTo({
        left: index * containerWidth,
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
  }, [handleScroll])

  // Auto-hide swipe hint after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowSwipeHint(false), 4000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section id="before-after" className="py-8 sm:py-12 lg:py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" style={{ backgroundColor: '#D64045' }}>
            <Sparkles className="w-4 h-4 text-white" />
            <span className="font-display font-bold text-xs text-white">COMMENT ÇA MARCHE</span>
          </div>

          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl mb-3">
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

        {/* Steps - Desktop: Horizontal, Tablet: Grid, Mobile: Full-width Carousel */}
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
                  className="border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden h-full flex flex-col hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
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

          {/* Tablet Layout - Better 2-3-2 or 3-2 grid */}
          <div className="hidden md:block lg:hidden">
            <div className="grid grid-cols-3 gap-4 mb-4">
              {steps.slice(0, 3).map((step) => (
                <StepCard key={step.number} step={step} />
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4 max-w-[66%] mx-auto">
              {steps.slice(3).map((step) => (
                <StepCard key={step.number} step={step} />
              ))}
            </div>
          </div>

          {/* Mobile Layout - Full Width Swipe Carousel */}
          <div className="md:hidden">
            {/* Navigation Row */}
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={navigatePrev}
                disabled={activeStep === 0}
                className="w-12 h-12 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-30 disabled:shadow-none active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
                style={{ backgroundColor: activeStep === 0 ? '#E8DFD5' : '#1D3354' }}
              >
                <ChevronLeft className={`w-6 h-6 ${activeStep === 0 ? 'text-black/30' : 'text-white'}`} />
              </button>

              {/* Step Counter with Title */}
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2">
                  <span
                    className="font-display font-bold text-2xl"
                    style={{ color: steps[activeStep].color }}
                  >
                    {activeStep + 1}
                  </span>
                  <span className="font-body text-black/40 text-lg">/</span>
                  <span className="font-body text-black/40">{steps.length}</span>
                </div>
                <span className="font-display font-bold text-xs text-black/70">
                  {steps[activeStep].title}
                </span>
              </div>

              <button
                onClick={navigateNext}
                disabled={activeStep === steps.length - 1}
                className="w-12 h-12 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-30 disabled:shadow-none active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
                style={{ backgroundColor: activeStep === steps.length - 1 ? '#E8DFD5' : '#D64045' }}
              >
                <ChevronRight className={`w-6 h-6 ${activeStep === steps.length - 1 ? 'text-black/30' : 'text-white'}`} />
              </button>
            </div>

            {/* Full Width Carousel Container */}
            <div className="relative">
              <div
                ref={scrollContainerRef}
                className="overflow-x-auto scrollbar-hide snap-x snap-mandatory"
                style={{ scrollSnapType: 'x mandatory' }}
              >
                <div className="flex">
                  {steps.map((step) => (
                    <div
                      key={step.number}
                      className="w-full flex-shrink-0 snap-center px-1"
                    >
                      <StepCardMobile step={step} isActive={activeStep === step.number - 1} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Swipe Hint Overlay */}
              {showSwipeHint && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div
                    className="flex items-center gap-2 px-4 py-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] animate-bounce"
                    style={{ backgroundColor: '#1D3354' }}
                  >
                    <Hand className="w-4 h-4 text-white animate-swipe" />
                    <span className="font-display font-bold text-xs text-white">SWIPE</span>
                    <ChevronRight className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}
            </div>

            {/* Dot indicators */}
            <div className="flex items-center justify-center gap-2 mt-4">
              {steps.map((step, i) => (
                <button
                  key={i}
                  onClick={() => scrollToStep(i)}
                  className={`transition-all duration-300 border-2 border-black ${
                    activeStep === i
                      ? 'w-8 h-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                      : 'w-3 h-3'
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
        <div className="mt-8 sm:mt-10 text-center">
          <div
            className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 px-4 sm:px-5 py-3 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            style={{ backgroundColor: '#1D3354' }}
          >
            <span className="font-display font-bold text-xs sm:text-sm text-white">RÉSULTAT :</span>
            <span className="font-display font-bold text-base sm:text-lg" style={{ color: '#D64045' }}>+300% DE VUES</span>
            <span className="font-display font-bold text-xs sm:text-sm text-white">EN MOYENNE</span>
          </div>
        </div>
      </div>

      {/* Swipe animation CSS */}
      <style>{`
        @keyframes swipe {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(8px); }
        }
        .animate-swipe {
          animation: swipe 1s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
}

// Reusable Step Card Component for Tablet
function StepCard({ step }: { step: Step }) {
  return (
    <div
      className="border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden h-full flex flex-col hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
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

// Enhanced Mobile Step Card - Full width
function StepCardMobile({ step, isActive }: { step: Step; isActive: boolean }) {
  return (
    <div
      className={`border-3 border-black overflow-hidden flex flex-col transition-all duration-300 ${
        isActive
          ? 'shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]'
          : 'shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] opacity-80 scale-[0.98]'
      }`}
      style={{ backgroundColor: '#FFFFFF' }}
    >
      {/* Step Header - More prominent */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b-3 border-black"
        style={{ backgroundColor: step.color }}
      >
        <div className="flex items-center gap-3">
          <span
            className="w-10 h-10 flex items-center justify-center border-2 border-black font-display font-bold text-lg bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            {step.number}
          </span>
          <span className="font-display font-bold text-base text-white">{step.title}</span>
        </div>
        <div className="w-8 h-8 border-2 border-black bg-white/20 flex items-center justify-center text-white">
          {step.icon}
        </div>
      </div>

      {/* Screenshot - Larger on mobile */}
      <div className="p-4 flex items-center justify-center" style={{ backgroundColor: '#E8DFD5' }}>
        <div className="border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] overflow-hidden bg-white w-full">
          <img
            src={step.image}
            alt={`Étape ${step.number}: ${step.title}`}
            className="w-full h-auto object-contain"
            style={{ maxHeight: '50vh' }}
          />
        </div>
      </div>

      {/* Description - More prominent */}
      <div className="px-4 py-4 border-t-2 border-black bg-white">
        <p className="text-base font-body text-black/80 text-center leading-relaxed">
          {step.description}
        </p>
      </div>
    </div>
  )
}
