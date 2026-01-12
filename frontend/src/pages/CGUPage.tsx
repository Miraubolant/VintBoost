import { ArrowLeft, FileText } from 'lucide-react'
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

        {/* Content */}
        <div className="border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6" style={{ backgroundColor: '#FFFFFF' }}>
          <div className="space-y-6 font-body text-sm text-black/80">
            <section>
              <h2 className="font-display font-bold text-lg text-black mb-3">1. Objet</h2>
              <p>
                Les presentes Conditions Generales d'Utilisation (CGU) ont pour objet de definir
                les modalites et conditions d'utilisation du service VintBoost, ainsi que les
                droits et obligations des utilisateurs.
              </p>
              <p className="mt-2">
                VintBoost est un service de generation automatique de videos promotionnelles
                pour les vendeurs sur la plateforme Vinted.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-lg text-black mb-3">2. Acceptation des CGU</h2>
              <p>
                L'utilisation du service VintBoost implique l'acceptation pleine et entiere
                des presentes CGU. Si vous n'acceptez pas ces conditions, vous ne devez pas
                utiliser le service.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-lg text-black mb-3">3. Description du service</h2>
              <p>VintBoost propose les services suivants :</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Recuperation des articles de votre vestiaire Vinted</li>
                <li>Generation automatique de videos promotionnelles</li>
                <li>Personnalisation des videos (musique, template, duree)</li>
                <li>Telechargement des videos generees</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display font-bold text-lg text-black mb-3">4. Inscription et compte</h2>
              <p>
                Pour utiliser le service, vous devez creer un compte en fournissant des
                informations exactes et a jour. Vous etes responsable de la confidentialite
                de vos identifiants de connexion.
              </p>
              <p className="mt-2">
                VintBoost se reserve le droit de suspendre ou supprimer tout compte en cas
                de violation des presentes CGU.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-lg text-black mb-3">5. Tarification</h2>
              <p>VintBoost propose plusieurs formules :</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><strong>Gratuit</strong> : 1 video par mois avec watermark</li>
                <li><strong>Pro (3.99€/mois)</strong> : 15 videos HD sans watermark</li>
                <li><strong>Business (12.99€/mois)</strong> : 50 videos 4K sans watermark</li>
              </ul>
              <p className="mt-2">
                Les paiements sont securises et effectues via notre prestataire de paiement.
                Les abonnements sont sans engagement et peuvent etre annules a tout moment.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-lg text-black mb-3">6. Propriete intellectuelle</h2>
              <p>
                Les videos generees par VintBoost restent votre propriete. Vous conservez
                tous les droits sur les images de vos articles Vinted.
              </p>
              <p className="mt-2">
                Toutefois, VintBoost conserve la propriete de ses templates, musiques
                et outils de generation.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-lg text-black mb-3">7. Utilisation acceptable</h2>
              <p>Vous vous engagez a :</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Utiliser le service uniquement pour promouvoir vos propres articles</li>
                <li>Ne pas utiliser le service a des fins illegales ou frauduleuses</li>
                <li>Ne pas tenter de contourner les limitations du service</li>
                <li>Respecter les conditions d'utilisation de Vinted</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display font-bold text-lg text-black mb-3">8. Limitation de responsabilite</h2>
              <p>
                VintBoost ne peut etre tenu responsable des dommages directs ou indirects
                resultant de l'utilisation du service, notamment en cas d'interruption
                du service ou de perte de donnees.
              </p>
              <p className="mt-2">
                VintBoost n'est pas affilie a Vinted et n'est pas responsable des
                eventuelles modifications des conditions d'utilisation de Vinted.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-lg text-black mb-3">9. Modification des CGU</h2>
              <p>
                VintBoost se reserve le droit de modifier les presentes CGU a tout moment.
                Les utilisateurs seront informes de toute modification importante.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-lg text-black mb-3">10. Contact</h2>
              <p>
                Pour toute question concernant ces CGU, vous pouvez nous contacter a
                l'adresse : <a href="mailto:contact@vintboost.com" className="underline" style={{ color: '#1D3354' }}>contact@vintboost.com</a>
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
