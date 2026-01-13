import { ArrowLeft, FileText, AlertTriangle, CheckCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'

export function CGUPage() {
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
              <FileText className="w-6 h-6" />
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-white">
              CONDITIONS GENERALES D'UTILISATION
            </h1>
          </div>
        </div>

        {/* Important Disclaimer Banner */}
        <div
          className="border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 mb-6 flex items-start gap-3"
          style={{ backgroundColor: '#D64045' }}
        >
          <AlertTriangle className="w-6 h-6 text-white flex-shrink-0 mt-0.5" />
          <p className="font-display font-bold text-sm text-white">
            VintBoost est un service INDEPENDANT et n'est pas affilie a Vinted UAB. L'utilisation de ce service implique l'acceptation pleine et entiere des presentes conditions.
          </p>
        </div>

        {/* Content */}
        <div className="border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6" style={{ backgroundColor: '#FFFFFF' }}>
          <div className="space-y-6 font-body text-sm text-black/80">
            <section>
              <h2 className="font-display font-bold text-lg text-black mb-3">1. Objet et acceptation</h2>
              <p>
                Les presentes Conditions Generales d'Utilisation (ci-apres "CGU") ont pour objet de definir les modalites et conditions d'utilisation du service VintBoost (ci-apres "le Service"), accessible a l'adresse vintboost.com.
              </p>
              <p className="mt-2">
                <strong>L'utilisation du Service implique l'acceptation sans reserve des presentes CGU.</strong> Si vous n'acceptez pas ces conditions, vous ne devez pas utiliser le Service.
              </p>
              <p className="mt-2">
                En utilisant le Service, vous reconnaissez avoir lu, compris et accepte l'integralite des presentes CGU ainsi que notre Politique de confidentialite.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-lg text-black mb-3">2. Description du Service</h2>
              <p>
                VintBoost est un service de generation automatique de videos promotionnelles destine aux vendeurs sur la plateforme Vinted. Le Service permet :
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>La recuperation des informations publiques de votre vestiaire Vinted via l'URL de votre profil</li>
                <li>La selection des articles a inclure dans la video</li>
                <li>La personnalisation de la video (template, musique, duree, texte personnalise)</li>
                <li>La generation et le telechargement de videos promotionnelles</li>
              </ul>
              <div className="mt-3 p-3 border-2 border-black/20 bg-black/5">
                <p className="font-bold text-black text-xs">
                  IMPORTANT : VintBoost accede uniquement aux donnees rendues publiques par les utilisateurs sur Vinted. Aucun identifiant de connexion Vinted n'est requis ou stocke.
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-display font-bold text-lg text-black mb-3">3. Non-affiliation avec Vinted</h2>
              <div className="p-4 border-2 border-black mb-3" style={{ backgroundColor: '#9ED8DB' }}>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-black">CLAUSE DE NON-AFFILIATION</p>
                    <p className="text-black/80 mt-1 text-xs">
                      VintBoost n'est PAS affilie, associe, autorise, approuve ou sponsorise par Vinted UAB ou ses filiales. Vinted est une marque deposee de Vinted UAB.
                    </p>
                  </div>
                </div>
              </div>
              <p>
                L'utilisateur reconnait et accepte que :
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>VintBoost est un service tiers totalement independant de Vinted</li>
                <li>L'utilisation de VintBoost n'implique aucune relation avec Vinted UAB</li>
                <li>Vinted n'est pas responsable du Service et n'offre aucune garantie a son egard</li>
                <li>Les conditions d'utilisation de Vinted s'appliquent independamment de VintBoost</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display font-bold text-lg text-black mb-3">4. Inscription et compte utilisateur</h2>
              <p>
                L'utilisation complete du Service necessite la creation d'un compte utilisateur via Google OAuth. En creant un compte, vous vous engagez a :
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Fournir des informations exactes et a jour</li>
                <li>Maintenir la confidentialite de vos identifiants de connexion</li>
                <li>Notifier immediatement VintBoost de toute utilisation non autorisee de votre compte</li>
                <li>Etre seul responsable de toutes les activites effectuees sous votre compte</li>
              </ul>
              <p className="mt-2">
                VintBoost se reserve le droit de suspendre ou supprimer tout compte en cas de violation des presentes CGU, sans preavis ni indemnite.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-lg text-black mb-3">5. Tarification et abonnements</h2>
              <p>VintBoost propose plusieurs formules d'abonnement :</p>
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2 p-2 border border-black/10">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span><strong>Gratuit</strong> : 1 video par mois avec watermark VintBoost</span>
                </div>
                <div className="flex items-center gap-2 p-2 border border-black/10" style={{ backgroundColor: '#9ED8DB20' }}>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span><strong>Pro (9.99€/mois)</strong> : 15 videos HD sans watermark</span>
                </div>
                <div className="flex items-center gap-2 p-2 border border-black/10" style={{ backgroundColor: '#D6404520' }}>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span><strong>Business (24.99€/mois)</strong> : 50 videos 4K sans watermark</span>
                </div>
              </div>
              <p className="mt-3">
                Les paiements sont securises et traites par notre prestataire de paiement. Les abonnements sont sans engagement et peuvent etre annules a tout moment depuis votre espace personnel.
              </p>
              <p className="mt-2">
                <strong>Droit de retractation :</strong> Conformement a l'article L221-28 du Code de la consommation, le droit de retractation ne s'applique pas aux contenus numeriques fournis sur un support immateriel dont l'execution a commence avec l'accord du consommateur.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-lg text-black mb-3">6. Propriete intellectuelle</h2>
              <p>
                <strong>Contenu de VintBoost :</strong> L'ensemble des elements du Service (interface, code, templates, musiques libres de droits, design) sont la propriete exclusive de VintBoost et sont proteges par les lois relatives a la propriete intellectuelle.
              </p>
              <p className="mt-2">
                <strong>Vos contenus :</strong> Vous conservez tous les droits sur les images de vos articles Vinted. Les videos generees par le Service vous appartiennent et peuvent etre utilisees librement pour promouvoir vos articles.
              </p>
              <p className="mt-2">
                <strong>Licence d'utilisation :</strong> VintBoost vous accorde une licence personnelle, non exclusive, non cessible et revocable d'utilisation du Service conformement aux presentes CGU.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-lg text-black mb-3">7. Obligations de l'utilisateur</h2>
              <p>En utilisant le Service, vous vous engagez a :</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Utiliser le Service uniquement pour promouvoir <strong>vos propres articles</strong> Vinted</li>
                <li>Ne pas utiliser le Service a des fins illegales, frauduleuses ou contraires aux bonnes moeurs</li>
                <li>Respecter les conditions d'utilisation de Vinted</li>
                <li>Ne pas tenter de contourner les limitations techniques du Service</li>
                <li>Ne pas utiliser de robots, scrapers ou outils automatises pour acceder au Service</li>
                <li>Ne pas revendre ou redistribuer le Service sans autorisation</li>
              </ul>
              <div className="mt-3 p-3 border-2 border-black/20 bg-black/5">
                <p className="font-bold text-black text-xs">
                  Vous etes seul responsable de l'utilisation des videos generees et de leur conformite avec les regles de la plateforme sur laquelle vous les publiez.
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-display font-bold text-lg text-black mb-3">8. Limitation de responsabilite</h2>
              <p className="font-bold">
                VintBoost ne peut en aucun cas etre tenu responsable :
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Des dommages directs ou indirects resultant de l'utilisation ou de l'impossibilite d'utiliser le Service</li>
                <li>De toute modification, suspension ou arret du Service</li>
                <li>De la perte de donnees ou de contenus</li>
                <li>De l'inexactitude des informations recuperees depuis Vinted</li>
                <li><strong>De toute action de Vinted UAB a l'encontre de votre compte Vinted</strong></li>
                <li>Des consequences de l'utilisation des videos generees sur des plateformes tierces</li>
                <li>De toute modification des conditions d'utilisation ou des politiques de Vinted</li>
              </ul>
              <p className="mt-3">
                <strong>En toute hypothese, la responsabilite de VintBoost ne saurait exceder le montant des sommes versees par l'utilisateur au cours des 12 derniers mois.</strong>
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-lg text-black mb-3">9. Garantie et disponibilite</h2>
              <p>
                Le Service est fourni "en l'etat" et "selon disponibilite", sans garantie d'aucune sorte, expresse ou implicite.
              </p>
              <p className="mt-2">
                VintBoost ne garantit pas que le Service sera ininterrompu, securise ou exempt d'erreurs. VintBoost se reserve le droit de modifier, suspendre ou interrompre le Service a tout moment, avec ou sans preavis.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-lg text-black mb-3">10. Donnees personnelles</h2>
              <p>
                Le traitement de vos donnees personnelles est decrit dans notre{' '}
                <Link to="/confidentialite" className="underline" style={{ color: '#1D3354' }}>
                  Politique de confidentialite
                </Link>.
              </p>
              <p className="mt-2">
                En utilisant le Service, vous consentez a ce traitement et garantissez l'exactitude des donnees fournies.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-lg text-black mb-3">11. Modification des CGU</h2>
              <p>
                VintBoost se reserve le droit de modifier les presentes CGU a tout moment. Les modifications prendront effet des leur publication sur le site.
              </p>
              <p className="mt-2">
                En cas de modification substantielle, les utilisateurs seront informes par email ou via une notification sur le site. La poursuite de l'utilisation du Service apres modification vaut acceptation des nouvelles CGU.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-lg text-black mb-3">12. Resiliation</h2>
              <p>
                Vous pouvez resilier votre compte a tout moment depuis votre espace personnel. La resiliation entraine la suppression de votre compte et de vos donnees dans un delai de 30 jours.
              </p>
              <p className="mt-2">
                VintBoost peut resilier votre compte en cas de violation des presentes CGU, sans preavis ni indemnite.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-lg text-black mb-3">13. Droit applicable et litiges</h2>
              <p>
                Les presentes CGU sont regies par le droit francais. En cas de litige, et apres tentative de resolution amiable, les tribunaux francais seront seuls competents.
              </p>
              <p className="mt-2">
                Conformement aux dispositions du Code de la consommation, vous pouvez recourir au service de mediation MEDICYS : 73 Boulevard de Clichy, 75009 Paris -{' '}
                <a href="https://www.medicys.fr" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: '#1D3354' }}>
                  www.medicys.fr
                </a>
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-lg text-black mb-3">14. Contact</h2>
              <p>
                Pour toute question concernant ces CGU, vous pouvez nous contacter a l'adresse :{' '}
                <a href="mailto:contact@vintboost.com" className="underline" style={{ color: '#1D3354' }}>
                  contact@vintboost.com
                </a>
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
