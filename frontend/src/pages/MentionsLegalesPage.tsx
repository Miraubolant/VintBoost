import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ArrowLeft, Scale, FileText, Shield, AlertTriangle, CheckCircle, Cookie, Lock, Eye, Database, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'

type TabType = 'mentions' | 'cgu' | 'confidentialite'

export function MentionsLegalesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const tabParam = searchParams.get('tab') as TabType | null
  const [activeTab, setActiveTab] = useState<TabType>(tabParam || 'mentions')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [activeTab])

  useEffect(() => {
    if (tabParam && ['mentions', 'cgu', 'confidentialite'].includes(tabParam)) {
      setActiveTab(tabParam)
    }
  }, [tabParam])

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab)
    setSearchParams({ tab })
  }

  const tabs = [
    { id: 'mentions' as TabType, label: 'Mentions legales', icon: Scale },
    { id: 'cgu' as TabType, label: 'CGU', icon: FileText },
    { id: 'confidentialite' as TabType, label: 'Confidentialite', icon: Shield },
  ]

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
              INFORMATIONS LEGALES
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
            IMPORTANT : VintBoost n'est pas affilie, associe, autorise, approuve par, ou de quelque maniere que ce soit officiellement lie a Vinted UAB ou a ses filiales. Vinted est une marque deposee de Vinted UAB.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 border-2 border-black font-display font-bold text-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all ${
                  activeTab === tab.id
                    ? 'translate-x-[2px] translate-y-[2px] shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
                    : 'hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                }`}
                style={{
                  backgroundColor: activeTab === tab.id ? '#1D3354' : '#FFFFFF',
                  color: activeTab === tab.id ? '#FFFFFF' : '#000000',
                }}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Content */}
        <div className="border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6" style={{ backgroundColor: '#FFFFFF' }}>
          {activeTab === 'mentions' && <MentionsLegalesContent />}
          {activeTab === 'cgu' && <CGUContent />}
          {activeTab === 'confidentialite' && <ConfidentialiteContent />}
        </div>
      </div>
    </div>
  )
}

function MentionsLegalesContent() {
  return (
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
      </section>

      <section>
        <h2 className="font-display font-bold text-lg text-black mb-3">7. Limitation de responsabilite</h2>
        <p className="font-bold">
          VintBoost ne saurait etre tenu responsable :
        </p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Des dommages directs ou indirects resultant de l'utilisation du service</li>
          <li>De toute modification des conditions d'utilisation de Vinted</li>
          <li>De toute suspension ou fermeture de compte Vinted liee a l'utilisation de videos generees</li>
          <li>De l'interruption du service ou de la perte de donnees</li>
          <li>De l'exactitude des informations recuperees depuis les pages Vinted</li>
        </ul>
      </section>

      <section>
        <h2 className="font-display font-bold text-lg text-black mb-3">8. Droit applicable et juridiction</h2>
        <p>
          Les presentes mentions legales sont regies par le droit francais. En cas de litige, les tribunaux francais seront seuls competents.
        </p>
        <p className="mt-2">
          Mediation : MEDICYS - 73 Boulevard de Clichy, 75009 Paris - www.medicys.fr
        </p>
      </section>

      <section>
        <h2 className="font-display font-bold text-lg text-black mb-3">9. Contact</h2>
        <p>
          Pour toute question : {' '}
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
  )
}

function CGUContent() {
  return (
    <div className="space-y-6 font-body text-sm text-black/80">
      <section>
        <h2 className="font-display font-bold text-lg text-black mb-3">1. Objet et acceptation</h2>
        <p>
          Les presentes Conditions Generales d'Utilisation (CGU) definissent les modalites d'utilisation du service VintBoost.
        </p>
        <p className="mt-2">
          <strong>L'utilisation du Service implique l'acceptation sans reserve des presentes CGU.</strong>
        </p>
      </section>

      <section>
        <h2 className="font-display font-bold text-lg text-black mb-3">2. Description du Service</h2>
        <p>
          VintBoost permet de generer des videos promotionnelles pour vos articles Vinted :
        </p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Recuperation des informations publiques de votre vestiaire Vinted</li>
          <li>Personnalisation de la video (template, musique, duree)</li>
          <li>Generation et telechargement de videos</li>
        </ul>
        <div className="mt-3 p-3 border-2 border-black/20 bg-black/5">
          <p className="font-bold text-black text-xs">
            VintBoost accede uniquement aux donnees publiques. Aucun identifiant Vinted n'est requis.
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
                VintBoost n'est PAS affilie, associe, autorise, approuve ou sponsorise par Vinted UAB.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-display font-bold text-lg text-black mb-3">4. Tarification</h2>
        <div className="space-y-2">
          <div className="flex items-center gap-2 p-2 border border-black/10">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span><strong>Gratuit</strong> : 1 video/mois avec watermark</span>
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
        <p className="mt-2 text-xs">
          Abonnements sans engagement, annulables a tout moment.
        </p>
      </section>

      <section>
        <h2 className="font-display font-bold text-lg text-black mb-3">5. Obligations de l'utilisateur</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Utiliser le Service uniquement pour promouvoir <strong>vos propres articles</strong></li>
          <li>Respecter les conditions d'utilisation de Vinted</li>
          <li>Ne pas utiliser le Service a des fins illegales</li>
          <li>Ne pas tenter de contourner les limitations du Service</li>
        </ul>
        <div className="mt-3 p-3 border-2 border-black/20 bg-black/5">
          <p className="font-bold text-black text-xs">
            Vous etes seul responsable de l'utilisation des videos generees.
          </p>
        </div>
      </section>

      <section>
        <h2 className="font-display font-bold text-lg text-black mb-3">6. Limitation de responsabilite</h2>
        <p className="font-bold">VintBoost ne peut etre tenu responsable :</p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Des dommages resultant de l'utilisation du Service</li>
          <li>De l'inexactitude des informations depuis Vinted</li>
          <li><strong>De toute action de Vinted UAB a l'encontre de votre compte</strong></li>
          <li>De toute modification des politiques de Vinted</li>
        </ul>
        <p className="mt-2 text-xs">
          <strong>Responsabilite limitee au montant verse sur 12 mois.</strong>
        </p>
      </section>

      <section>
        <h2 className="font-display font-bold text-lg text-black mb-3">7. Propriete intellectuelle</h2>
        <p>
          <strong>VintBoost :</strong> propriete exclusive de VintBoost (interface, templates, musiques).
        </p>
        <p className="mt-2">
          <strong>Vos contenus :</strong> vous conservez tous les droits sur vos images et videos generees.
        </p>
      </section>

      <section>
        <h2 className="font-display font-bold text-lg text-black mb-3">8. Resiliation</h2>
        <p>
          Vous pouvez resilier votre compte a tout moment. VintBoost peut suspendre tout compte en violation des CGU.
        </p>
      </section>

      <section>
        <h2 className="font-display font-bold text-lg text-black mb-3">9. Droit applicable</h2>
        <p>
          CGU regies par le droit francais. Tribunaux francais competents.
        </p>
        <p className="mt-2 text-xs">
          Mediation : MEDICYS - www.medicys.fr
        </p>
      </section>

      <div className="pt-4 border-t-2 border-black/10">
        <p className="text-xs text-black/50">
          Derniere mise a jour : Janvier 2026
        </p>
      </div>
    </div>
  )
}

function ConfidentialiteContent() {
  return (
    <div className="space-y-6 font-body text-sm text-black/80">
      <section>
        <h2 className="font-display font-bold text-lg text-black mb-3">1. Responsable du traitement</h2>
        <p>
          <strong>Miraubolant</strong> - SIREN 995105442<br />
          113 rue Saint Honore, 75001 Paris<br />
          Email : contact@vintboost.com
        </p>
      </section>

      <section>
        <h2 className="font-display font-bold text-lg text-black mb-3 flex items-center gap-2">
          <Database className="w-5 h-5" />
          2. Donnees collectees
        </h2>
        <div className="space-y-2">
          <div className="p-3 border border-black/10 bg-black/5">
            <p className="font-bold text-black text-sm">Identification (Google OAuth)</p>
            <p className="text-xs">Nom, email, photo de profil</p>
          </div>
          <div className="p-3 border border-black/10 bg-black/5">
            <p className="font-bold text-black text-sm">Utilisation</p>
            <p className="text-xs">Videos generees, preferences, historique</p>
          </div>
          <div className="p-3 border border-black/10 bg-black/5">
            <p className="font-bold text-black text-sm">Techniques</p>
            <p className="text-xs">IP, navigateur, appareil</p>
          </div>
        </div>
        <div className="mt-3 p-3 border-2 border-black/20" style={{ backgroundColor: '#9ED8DB30' }}>
          <p className="font-bold text-black text-xs">
            VINTED : Acces uniquement aux donnees PUBLIQUES. Aucun identifiant Vinted collecte.
          </p>
        </div>
      </section>

      <section>
        <h2 className="font-display font-bold text-lg text-black mb-3">3. Finalites</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Fourniture du service</li>
          <li>Amelioration du service</li>
          <li>Communication</li>
          <li>Securite</li>
        </ul>
      </section>

      <section>
        <h2 className="font-display font-bold text-lg text-black mb-3 flex items-center gap-2">
          <Trash2 className="w-5 h-5" />
          4. Conservation
        </h2>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between p-2 border border-black/10">
            <span>Compte</span><span className="font-bold">Duree + 30j</span>
          </div>
          <div className="flex justify-between p-2 border border-black/10">
            <span>Videos</span><span className="font-bold">30 jours</span>
          </div>
          <div className="flex justify-between p-2 border border-black/10">
            <span>Facturation</span><span className="font-bold">10 ans</span>
          </div>
          <div className="flex justify-between p-2 border border-black/10">
            <span>Cookies</span><span className="font-bold">13 mois max</span>
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-display font-bold text-lg text-black mb-3">5. Destinataires</h2>
        <div className="space-y-2 text-xs">
          <div className="p-2 border border-black/10">
            <strong>Supabase</strong> - Base de donnees (USA, clauses types)
          </div>
          <div className="p-2 border border-black/10">
            <strong>Hetzner</strong> - Hebergement (Allemagne, UE)
          </div>
        </div>
        <p className="mt-2 font-bold text-xs">Nous ne vendons JAMAIS vos donnees.</p>
      </section>

      <section>
        <h2 className="font-display font-bold text-lg text-black mb-3 flex items-center gap-2">
          <Eye className="w-5 h-5" />
          6. Vos droits (RGPD)
        </h2>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 border border-black/10 bg-black/5">
            <strong>Acces</strong> - copie des donnees
          </div>
          <div className="p-2 border border-black/10 bg-black/5">
            <strong>Rectification</strong> - corriger
          </div>
          <div className="p-2 border border-black/10 bg-black/5">
            <strong>Effacement</strong> - supprimer
          </div>
          <div className="p-2 border border-black/10 bg-black/5">
            <strong>Portabilite</strong> - export
          </div>
        </div>
        <p className="mt-2 text-xs">
          Contact : contact@vintboost.com | Reclamation : CNIL (www.cnil.fr)
        </p>
      </section>

      <section>
        <h2 className="font-display font-bold text-lg text-black mb-3 flex items-center gap-2">
          <Cookie className="w-5 h-5" />
          7. Cookies
        </h2>
        <div className="space-y-2">
          <div className="p-2 border-2 border-green-500/30 bg-green-50">
            <p className="font-bold text-black text-xs">Necessaires (pas de consentement)</p>
            <p className="text-xs">Authentification, choix cookies</p>
          </div>
          <div className="p-2 border-2 border-blue-500/30 bg-blue-50">
            <p className="font-bold text-black text-xs">Fonctionnels (avec consentement)</p>
            <p className="text-xs">Preferences utilisateur</p>
          </div>
          <div className="p-2 border border-black/10 bg-black/5">
            <p className="font-bold text-black text-xs">Publicitaires</p>
            <p className="text-xs"><strong>AUCUN</strong> - Pas de tracking</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-display font-bold text-lg text-black mb-3 flex items-center gap-2">
          <Lock className="w-5 h-5" />
          8. Securite
        </h2>
        <ul className="list-disc list-inside space-y-1 text-xs">
          <li>Chiffrement HTTPS/TLS 1.3</li>
          <li>OAuth 2.0 (Google)</li>
          <li>Hebergement UE securise</li>
          <li>Sauvegardes chiffrees</li>
        </ul>
      </section>

      <div className="pt-4 border-t-2 border-black/10">
        <p className="text-xs text-black/50">
          Derniere mise a jour : Janvier 2026
        </p>
      </div>
    </div>
  )
}
