import { Sparkles, CreditCard, AlertCircle, Zap } from 'lucide-react'

interface SidebarGenerateButtonProps {
  canGenerate: boolean
  creditsRemaining: number
  loading: boolean
  onGenerate: () => void
  onUpgradeClick?: () => void
}

export function SidebarGenerateButton({
  canGenerate,
  creditsRemaining,
  loading,
  onGenerate,
  onUpgradeClick,
}: SidebarGenerateButtonProps) {
  return (
    <div className="border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Credits Display */}
      <div className="p-4 border-b-2 border-black" style={{ backgroundColor: '#F8F8F8' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-black/50" />
            <span className="font-display font-bold text-xs text-black/70">CREDITS DISPONIBLES</span>
          </div>
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 border-2 border-black"
            style={{
              backgroundColor: creditsRemaining > 0 ? '#9ED8DB' : '#D64045',
            }}
          >
            <Zap className={`w-4 h-4 ${creditsRemaining > 0 ? 'text-black' : 'text-white'}`} />
            <span
              className="font-display font-bold text-lg"
              style={{ color: creditsRemaining > 0 ? '#000' : '#FFF' }}
            >
              {creditsRemaining}
            </span>
          </div>
        </div>

        {/* No credits warning */}
        {creditsRemaining === 0 && (
          <div
            className="flex items-start gap-2 mt-3 p-3 border-2 border-black"
            style={{ backgroundColor: '#D64045' }}
          >
            <AlertCircle className="w-4 h-4 text-white flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-white">Plus de credits disponibles !</p>
              <button
                onClick={onUpgradeClick}
                className="text-xs text-white/90 underline hover:text-white mt-1"
              >
                Passer a un plan superieur →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Generate Button */}
      <div className="p-4" style={{ backgroundColor: creditsRemaining > 0 ? '#E8DFD5' : '#F5F5F5' }}>
        <button
          onClick={onGenerate}
          disabled={!canGenerate || loading}
          className={`
            w-full px-6 py-4 border-3 border-black font-display font-bold text-base text-white
            shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
            transition-all
            ${canGenerate && !loading
              ? 'active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]'
              : 'opacity-50 cursor-not-allowed shadow-none'
            }
          `}
          style={{ backgroundColor: canGenerate && !loading ? '#D64045' : '#888' }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-3">
              <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
              GENERATION EN COURS...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-3">
              <Sparkles className="w-5 h-5" />
              GENERER MA VIDEO
            </span>
          )}
        </button>

        {!canGenerate && creditsRemaining > 0 && (
          <p className="text-center text-xs text-black/50 mt-3 font-body">
            Selectionne au moins 1 article pour generer
          </p>
        )}
      </div>
    </div>
  )
}
