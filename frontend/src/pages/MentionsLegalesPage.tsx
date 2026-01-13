import { ArrowLeft, Scale } from 'lucide-react'
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
              <h2 className="font-display font-bold text-lg text-black mb-3">2. Hebergement</h2>
              <p>
                Le site est heberge par :<br />
                <strong>Coolify / Hetzner</strong><br />
                Localisation : Europe
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-lg text-black mb-3">3. Propriete intellectuelle</h2>
              <p>
                L'ensemble du contenu du site VintBoost (textes, images, logos, videos, code source)
                est protege par le droit d'auteur et constitue la propriete exclusive de VintBoost,
                sauf mention contraire.
              </p>
              <p className="mt-2">
                Toute reproduction, representation, modification ou exploitation non autorisee
                de tout ou partie du site est interdite et peut faire l'objet de poursuites.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-lg text-black mb-3">4. Responsabilite</h2>
              <p>
                VintBoost s'efforce de fournir des informations exactes et a jour.
                Toutefois, nous ne pouvons garantir l'exactitude, l'exhaustivite ou
                l'actualite des informations diffusees sur le site.
              </p>
              <p className="mt-2">
                VintBoost ne saurait etre tenu responsable des dommages directs ou indirects
                resultant de l'utilisation du site ou de l'impossibilite d'y acceder.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-lg text-black mb-3">5. Liens externes</h2>
              <p>
                Le site peut contenir des liens vers d'autres sites web. VintBoost n'exerce
                aucun controle sur ces sites et decline toute responsabilite quant a leur contenu.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-lg text-black mb-3">6. Donnees personnelles</h2>
              <p>
                Pour toute information concernant le traitement de vos donnees personnelles,
                veuillez consulter notre{' '}
                <Link to="/confidentialite" className="underline hover:text-black" style={{ color: '#1D3354' }}>
                  Politique de confidentialite
                </Link>.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-lg text-black mb-3">7. Droit applicable</h2>
              <p>
                Les presentes mentions legales sont regies par le droit francais.
                En cas de litige, les tribunaux francais seront seuls competents.
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
