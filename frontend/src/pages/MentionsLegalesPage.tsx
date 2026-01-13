import { ArrowLeft, Scale, AlertTriangle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'

export function MentionsLegalesPage() {
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
              <Scale className="w-6 h-6" />
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-white">
              MENTIONS LEGALES
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
            IMPORTANT : VintBoost n'est pas affilie, associe, autorise, approuve par, ou de quelque maniere que ce soit officiellement lie a Vinted UAB ou a ses filiales. Le nom Vinted ainsi que les noms associes, marques, emblemes et images sont des marques deposees de leurs proprietaires respectifs.
          </p>
        </div>

        {/* Content */}
        <div className="border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6" style={{ backgroundColor: '#FFFFFF' }}>
          <div className="space-y-6 font-body text-sm text-black/80">
            <section>
              <h2 className="font-display font-bold text-lg text-black mb-3">1. Editeur du site</h2>
              <p>
                Le site VintBoost (vintboost.com) est edite par :<br />
                <strong>Miraubolant</strong><br />
                SIREN : 995105442<br />
                Siege social : 113 rue Saint Honore, 75001 Paris<br />
                Email : contact@vintboost.com
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-lg text-black mb-3">2. Directeur de la publication</h2>
              <p>
                Directeur de la publication : Miraubolant<br />
                Contact : contact@vintboost.com
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-lg text-black mb-3">3. Hebergement</h2>
              <p>
                Le site est heberge par :<br />
                <strong>Hetzner Online GmbH</strong><br />
                Industriestr. 25, 91710 Gunzenhausen, Allemagne<br />
                Localisation des serveurs : Union Europeenne
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-lg text-black mb-3">4. Non-affiliation avec Vinted</h2>
              <div className="p-3 border-2 border-black/20 bg-black/5 mb-3">
                <p className="font-bold text-black">
                  VintBoost est un service INDEPENDANT et n'est en AUCUN CAS affilie, partenaire, sponsorise ou approuve par Vinted UAB.
                </p>
              </div>
              <p>
                Le service VintBoost est un outil tiers destine a aider les vendeurs Vinted a promouvoir leurs articles. Nous ne sommes pas lies contractuellement ou commercialement a Vinted.
              </p>
              <p className="mt-2">
                L'utilisation du nom "Vinted" sur notre site est faite uniquement a des fins descriptives pour indiquer la compatibilite de notre service. Vinted est une marque deposee de Vinted UAB.
              </p>
              <p className="mt-2">
                Nous ne pretendons pas representer, parler au nom de, ou agir pour le compte de Vinted UAB ou de toute entite affiliee.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-lg text-black mb-3">5. Nature du service</h2>
              <p>
                VintBoost est un service de creation de contenu video base sur des informations publiquement accessibles. Notre service :
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Accede uniquement aux informations rendues publiques par les utilisateurs sur Vinted</li>
                <li>Ne stocke pas de donnees sensibles des comptes Vinted</li>
                <li>Ne necessite pas d'identifiants de connexion Vinted</li>
                <li>Genere des videos a partir d'images publiques des articles</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display font-bold text-lg text-black mb-3">6. Propriete intellectuelle</h2>
              <p>
                L'ensemble du contenu du site VintBoost (textes, images, logos, videos, code source, design) est protege par le droit d'auteur et constitue la propriete exclusive de VintBoost, sauf mention contraire.
              </p>
              <p className="mt-2">
                Les images des articles utilises pour la generation de videos restent la propriete de leurs proprietaires respectifs (les vendeurs Vinted). VintBoost n'acquiert aucun droit sur ces images.
              </p>
              <p className="mt-2">
                Toute reproduction, representation, modification ou exploitation non autorisee de tout ou partie du site est interdite et peut faire l'objet de poursuites conformement au Code de la propriete intellectuelle.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-lg text-black mb-3">7. Limitation de responsabilite</h2>
              <p>
                VintBoost s'efforce de fournir des informations exactes et a jour. Toutefois, nous ne pouvons garantir l'exactitude, l'exhaustivite ou l'actualite des informations diffusees sur le site.
              </p>
              <p className="mt-2 font-bold">
                VintBoost ne saurait etre tenu responsable :
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Des dommages directs ou indirects resultant de l'utilisation du service</li>
                <li>De toute modification des conditions d'utilisation de Vinted</li>
                <li>De toute suspension ou fermeture de compte Vinted liee a l'utilisation de videos generees</li>
                <li>De l'interruption du service ou de la perte de donnees</li>
                <li>De l'exactitude des informations recuperees depuis les pages Vinted</li>
              </ul>
              <p className="mt-2">
                L'utilisateur reconnait utiliser le service sous sa seule responsabilite et s'engage a respecter les conditions d'utilisation de Vinted.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-lg text-black mb-3">8. Liens externes</h2>
              <p>
                Le site peut contenir des liens vers d'autres sites web, notamment Vinted. VintBoost n'exerce aucun controle sur ces sites et decline toute responsabilite quant a leur contenu, leurs pratiques de confidentialite ou leur disponibilite.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-lg text-black mb-3">9. Donnees personnelles</h2>
              <p>
                Pour toute information concernant le traitement de vos donnees personnelles, veuillez consulter notre{' '}
                <Link to="/confidentialite" className="underline hover:text-black" style={{ color: '#1D3354' }}>
                  Politique de confidentialite
                </Link>.
              </p>
              <p className="mt-2">
                Conformement au RGPD, vous disposez d'un droit d'acces, de rectification, de suppression et de portabilite de vos donnees.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-lg text-black mb-3">10. Cookies</h2>
              <p>
                Le site utilise des cookies essentiels au fonctionnement du service. Pour plus d'informations, consultez notre{' '}
                <Link to="/confidentialite" className="underline hover:text-black" style={{ color: '#1D3354' }}>
                  Politique de confidentialite
                </Link>{' '}
                (section Cookies).
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-lg text-black mb-3">11. Droit applicable et juridiction</h2>
              <p>
                Les presentes mentions legales sont regies par le droit francais. En cas de litige relatif a l'interpretation ou l'execution des presentes, et a defaut d'accord amiable, les tribunaux francais seront seuls competents.
              </p>
              <p className="mt-2">
                Conformement aux dispositions du Code de la consommation concernant le reglement amiable des litiges, l'utilisateur peut recourir au service de mediation MEDICYS : 73 Boulevard de Clichy, 75009 Paris - www.medicys.fr
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-lg text-black mb-3">12. Contact</h2>
              <p>
                Pour toute question concernant ces mentions legales, vous pouvez nous contacter a l'adresse :{' '}
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
