import { ArrowLeft, Shield } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'

export function ConfidentialitePage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen py-8 px-4" style={{ backgroundColor: '#E8DFD5' }}>
      <div className="max-w-3xl mx-auto">
        {/* Back button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 mb-6 px-3 py-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-display font-bold text-xs">RETOUR</span>
        </Link>

        {/* Header */}
        <div className="border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6 mb-6" style={{ backgroundColor: '#1D3354' }}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white border-2 border-black flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-white">
              POLITIQUE DE CONFIDENTIALITE
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6" style={{ backgroundColor: '#FFFFFF' }}>
          <div className="space-y-6 font-body text-sm text-black/80">
            <section>
              <h2 className="font-display font-bold text-lg text-black mb-3">1. Introduction</h2>
              <p>
                VintBoost s'engage a proteger la vie privee de ses utilisateurs. Cette politique
                de confidentialite explique comment nous collectons, utilisons et protegeons
                vos donnees personnelles conformement au RGPD.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-lg text-black mb-3">2. Donnees collectees</h2>
              <p>Nous collectons les donnees suivantes :</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><strong>Donnees d'identification</strong> : nom, email, photo de profil (via Google OAuth)</li>
                <li><strong>Donnees d'utilisation</strong> : videos generees, articles selectionnes, preferences</li>
                <li><strong>Donnees techniques</strong> : adresse IP, navigateur, appareil</li>
                <li><strong>Donnees de paiement</strong> : traitees de maniere securisee par notre prestataire</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display font-bold text-lg text-black mb-3">3. Finalite du traitement</h2>
              <p>Vos donnees sont utilisees pour :</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Fournir et ameliorer nos services</li>
                <li>Gerer votre compte et vos abonnements</li>
                <li>Vous contacter concernant votre compte ou nos services</li>
                <li>Assurer la securite du service</li>
                <li>Respecter nos obligations legales</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display font-bold text-lg text-black mb-3">4. Base legale</h2>
              <p>Le traitement de vos donnees repose sur :</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>L'execution du contrat (fourniture du service)</li>
                <li>Votre consentement (cookies, communications marketing)</li>
                <li>Notre interet legitime (securite, amelioration du service)</li>
                <li>Nos obligations legales</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display font-bold text-lg text-black mb-3">5. Conservation des donnees</h2>
              <p>
                Vos donnees sont conservees pendant la duree de votre compte, puis supprimees
                dans un delai de 30 jours apres la suppression de votre compte, sauf obligation
                legale de conservation plus longue.
              </p>
              <p className="mt-2">
                Les videos generees sont conservees sur nos serveurs pendant 30 jours,
                puis automatiquement supprimees.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-lg text-black mb-3">6. Partage des donnees</h2>
              <p>Vos donnees peuvent etre partagees avec :</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><strong>Supabase</strong> : hebergement de la base de donnees et authentification</li>
                <li><strong>Prestataires de paiement</strong> : traitement securise des paiements</li>
                <li><strong>Autorites competentes</strong> : en cas d'obligation legale</li>
              </ul>
              <p className="mt-2">
                Nous ne vendons jamais vos donnees personnelles a des tiers.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-lg text-black mb-3">7. Vos droits</h2>
              <p>Conformement au RGPD, vous disposez des droits suivants :</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><strong>Droit d'acces</strong> : obtenir une copie de vos donnees</li>
                <li><strong>Droit de rectification</strong> : corriger vos donnees inexactes</li>
                <li><strong>Droit a l'effacement</strong> : supprimer vos donnees</li>
                <li><strong>Droit a la portabilite</strong> : recevoir vos donnees dans un format structure</li>
                <li><strong>Droit d'opposition</strong> : vous opposer au traitement de vos donnees</li>
                <li><strong>Droit de limitation</strong> : limiter le traitement de vos donnees</li>
              </ul>
              <p className="mt-2">
                Pour exercer ces droits, contactez-nous a :
                <a href="mailto:contact@vintboost.com" className="underline ml-1" style={{ color: '#1D3354' }}>contact@vintboost.com</a>
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-lg text-black mb-3">8. Cookies</h2>
              <p>
                Nous utilisons des cookies essentiels au fonctionnement du site (authentification,
                preferences). Ces cookies ne necessitent pas votre consentement.
              </p>
              <p className="mt-2">
                Aucun cookie publicitaire ou de tracking n'est utilise sur VintBoost.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-lg text-black mb-3">9. Securite</h2>
              <p>
                Nous mettons en oeuvre des mesures de securite appropriees pour proteger
                vos donnees contre tout acces non autorise, modification, divulgation ou destruction.
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Chiffrement des donnees en transit (HTTPS)</li>
                <li>Authentification securisee (OAuth 2.0)</li>
                <li>Acces restreint aux donnees</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display font-bold text-lg text-black mb-3">10. Contact</h2>
              <p>
                Pour toute question concernant cette politique de confidentialite ou pour exercer
                vos droits, contactez-nous a :
                <a href="mailto:contact@vintboost.com" className="underline ml-1" style={{ color: '#1D3354' }}>contact@vintboost.com</a>
              </p>
              <p className="mt-2">
                Vous pouvez egalement introduire une reclamation aupres de la CNIL si vous
                estimez que vos droits ne sont pas respectes.
              </p>
            </section>

            <div className="pt-4 border-t-2 border-black/10">
              <p className="text-xs text-black/50">
                Derniere mise a jour : Janvier 2026
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
