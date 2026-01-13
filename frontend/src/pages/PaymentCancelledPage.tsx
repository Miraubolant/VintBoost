import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { XCircle, ArrowLeft, RefreshCw, CreditCard, HelpCircle } from 'lucide-react'

export function PaymentCancelledPage() {
  const [searchParams] = useSearchParams()
  const reason = searchParams.get('reason') // 'cancelled' | 'failed' | null

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const isFailed = reason === 'failed'

  return (
    <div className="min-h-screen py-12 px-4 flex items-center justify-center" style={{ backgroundColor: '#E8DFD5' }}>
      <div className="max-w-md w-full">
        {/* Main Card */}
        <div
          className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          {/* Header */}
          <div
            className="p-6 border-b-4 border-black flex flex-col items-center"
            style={{ backgroundColor: isFailed ? '#D64045' : '#1D3354' }}
          >
            <div
              className="w-20 h-20 border-4 border-black flex items-center justify-center transform rotate-6 mb-4"
              style={{ backgroundColor: '#FFFFFF' }}
            >
              <XCircle className="w-10 h-10" style={{ color: isFailed ? '#D64045' : '#1D3354' }} />
            </div>
            <h1 className="font-display font-bold text-2xl text-white text-center">
              {isFailed ? 'PAIEMENT ECHOUE' : 'PAIEMENT ANNULE'}
            </h1>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="text-center mb-6">
              <p className="font-body text-black/70 mb-4">
                {isFailed ? (
                  <>
                    Oups ! Le paiement n'a pas pu etre traite.<br />
                    Verifie tes informations bancaires et reessaie.
                  </>
                ) : (
                  <>
                    Tu as annule le processus de paiement.<br />
                    Pas de souci, tu peux reessayer quand tu veux !
                  </>
                )}
              </p>

              {/* Info box */}
              <div
                className="p-4 border-2 border-black mb-6"
                style={{ backgroundColor: '#9ED8DB20' }}
              >
                <p className="font-body text-sm text-black/60">
                  {isFailed ? (
                    <>
                      <strong>Causes possibles :</strong><br />
                      • Fonds insuffisants<br />
                      • Carte expiree ou bloquee<br />
                      • Limite de paiement atteinte
                    </>
                  ) : (
                    <>
                      <strong>Bon a savoir :</strong><br />
                      Tu peux tester VintBoost gratuitement avec 1 video offerte avant de t'abonner !
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <Link
                to="/#pricing"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 border-3 border-black font-display font-bold text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
                style={{ backgroundColor: '#D64045' }}
              >
                {isFailed ? (
                  <>
                    <RefreshCw className="w-5 h-5" />
                    REESSAYER
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    VOIR LES TARIFS
                  </>
                )}
              </Link>

              <Link
                to="/"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 border-3 border-black font-display font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
                style={{ backgroundColor: '#FFFFFF' }}
              >
                <ArrowLeft className="w-5 h-5" />
                RETOUR A L'ACCUEIL
              </Link>
            </div>

            {/* Help link */}
            <div className="mt-6 text-center">
              <a
                href="mailto:contact@vintboost.com"
                className="inline-flex items-center gap-2 font-body text-sm hover:underline"
                style={{ color: '#1D3354' }}
              >
                <HelpCircle className="w-4 h-4" />
                Besoin d'aide ? Contacte-nous
              </a>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div
          className="hidden md:block absolute top-20 left-10 w-8 h-8 border-3 border-black transform rotate-12"
          style={{ backgroundColor: '#9ED8DB' }}
        />
        <div
          className="hidden md:block absolute bottom-20 right-10 w-6 h-6 border-3 border-black transform -rotate-6"
          style={{ backgroundColor: '#D64045' }}
        />
      </div>
    </div>
  )
}
