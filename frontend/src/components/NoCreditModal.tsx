import { X, CreditCard, Zap } from 'lucide-react'

interface NoCreditModalProps {
  isOpen: boolean
  onClose: () => void
  onNavigateToPricing: () => void
}

export function NoCreditModal({ isOpen, onClose, onNavigateToPricing }: NoCreditModalProps) {
  if (!isOpen) return null

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
          style={{ backgroundColor: '#D64045' }}
        >
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-white" />
            <h2 className="font-display font-bold text-lg text-white">
              CREDITS EPUISES
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 border-2 border-black flex items-center justify-center font-bold text-xs hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
            style={{ backgroundColor: '#FFFFFF' }}
          >
            <X className="w-4 h-4 text-black" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <div
              className="w-16 h-16 mx-auto mb-4 border-3 border-black flex items-center justify-center"
              style={{ backgroundColor: '#9ED8DB' }}
            >
              <CreditCard className="w-8 h-8 text-black" />
            </div>
            <p className="font-body text-sm text-black/70 mb-2">
              Tu as utilise tous tes credits de generation de videos.
            </p>
            <p className="font-body text-sm text-black/70">
              Passe a un abonnement pour continuer a creer des videos !
            </p>
          </div>

          {/* Plans summary */}
          <div className="space-y-2 mb-6">
            <div className="flex items-center justify-between px-3 py-2 border-2 border-black" style={{ backgroundColor: '#F5F5F5' }}>
              <span className="font-display font-bold text-xs">PRO</span>
              <span className="font-display font-bold text-sm" style={{ color: '#1D3354' }}>3.99€/mois - 15 videos</span>
            </div>
            <div className="flex items-center justify-between px-3 py-2 border-2 border-black" style={{ backgroundColor: '#F5F5F5' }}>
              <span className="font-display font-bold text-xs">BUSINESS</span>
              <span className="font-display font-bold text-sm" style={{ color: '#1D3354' }}>12.99€/mois - 50 videos</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-2">
            <button
              onClick={onNavigateToPricing}
              className="w-full py-3 border-2 border-black font-display font-bold text-sm text-white flex items-center justify-center gap-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all"
              style={{ backgroundColor: '#1D3354' }}
            >
              <CreditCard className="w-4 h-4" />
              VOIR LES TARIFS
            </button>
            <button
              onClick={onClose}
              className="w-full py-2 font-body text-xs text-black/60 hover:text-black hover:underline"
            >
              Plus tard
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
