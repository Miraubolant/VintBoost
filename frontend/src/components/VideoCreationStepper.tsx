import { Check, Package, Settings, Sparkles, ArrowLeft } from 'lucide-react'

interface Step {
  id: number
  label: string
  icon: React.ReactNode
}

interface VideoCreationStepperProps {
  currentStep: number
  onStepClick?: (step: number) => void
  onBack?: () => void
}

const steps: Step[] = [
  { id: 1, label: 'Articles', icon: <Package className="w-3.5 h-3.5" /> },
  { id: 2, label: 'Configuration', icon: <Settings className="w-3.5 h-3.5" /> },
  { id: 3, label: 'Generation', icon: <Sparkles className="w-3.5 h-3.5" /> },
]

export function VideoCreationStepper({ currentStep, onStepClick, onBack }: VideoCreationStepperProps) {
  return (
    <div className="w-full">
      {/* Desktop Stepper */}
      <div className="hidden sm:flex items-center gap-3">
        {/* Back Button */}
        {onBack && (
          <button
            onClick={onBack}
            className="w-9 h-9 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-gray-50 flex-shrink-0"
            style={{ backgroundColor: '#FFFFFF' }}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}

        {/* Steps - aligned left, not centered */}
        <div className="flex items-center gap-1">
          {steps.map((step, index) => {
            const isCompleted = currentStep > step.id
            const isCurrent = currentStep === step.id
            const isClickable = onStepClick && step.id <= currentStep

            return (
              <div key={step.id} className="flex items-center">
                {/* Step Button */}
                <button
                  onClick={() => isClickable && onStepClick?.(step.id)}
                  disabled={!isClickable}
                  className={`
                    flex items-center gap-1.5 px-3 py-1.5 border-2 border-black font-display font-bold text-xs
                    transition-all duration-200 whitespace-nowrap
                    ${isClickable ? 'cursor-pointer' : 'cursor-default'}
                    ${isCompleted
                      ? 'bg-[#9ED8DB] text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                      : isCurrent
                        ? 'bg-[#1D3354] text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                        : 'bg-white text-black/40 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                    }
                    ${isClickable ? 'hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]' : ''}
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <span className="w-3.5 h-3.5 flex items-center justify-center">{step.icon}</span>
                  )}
                  <span>{step.label}</span>
                </button>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div
                    className={`w-4 h-0.5 mx-0.5 border-t-2 border-dashed ${
                      currentStep > step.id ? 'border-[#1D3354]' : 'border-black/20'
                    }`}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Mobile Stepper - Progress Bar Style */}
      <div className="sm:hidden">
        <div className="flex items-center gap-3 mb-2">
          {/* Back Button Mobile */}
          {onBack && (
            <button
              onClick={onBack}
              className="w-8 h-8 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all flex-shrink-0"
              style={{ backgroundColor: '#FFFFFF' }}
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div className="flex-1 flex items-center justify-between">
            <span className="font-display font-bold text-sm">
              Etape {currentStep}/3
            </span>
            <span className="text-xs text-black/60 font-body">
              {steps.find(s => s.id === currentStep)?.label}
            </span>
          </div>
        </div>
        <div className="flex gap-1">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`
                flex-1 h-2 border border-black transition-colors
                ${currentStep >= step.id ? 'bg-[#1D3354]' : 'bg-white'}
              `}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
