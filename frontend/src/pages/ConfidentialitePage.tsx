import { ArrowLeft, Shield, Cookie, Lock, Eye, Database, Trash2 } from 'lucide-react'
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
                VintBoost (ci-apres "nous", "notre", "VintBoost") s'engage a proteger la vie privee de ses utilisateurs. Cette politique de confidentialite explique comment nous collectons, utilisons, stockons et protegeons vos donnees personnelles conformement au Reglement General sur la Protection des Donnees (RGPD) et a la loi Informatique et Libertes.
              </p>
              <p className="mt-2">
                <strong>Responsable du traitement :</strong><br />
                Miraubolant - SIREN 995105442<br />
                113 rue Saint Honore, 75001 Paris<br />
                Email : contact@vintboost.com
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-lg text-black mb-3 flex items-center gap-2">
                <Database className="w-5 h-5" />
                2. Donnees collectees
              </h2>
              <p>Nous collectons les categories de donnees suivantes :</p>

              <div className="mt-3 space-y-3">
                <div className="p-3 border border-black/10 bg-black/5">
                  <p className="font-bold text-black text-sm">Donnees d'identification (via Google OAuth)</p>
                  <ul className="list-disc list-inside mt-1 text-xs">
                    <li>Nom et prenom</li>
                    <li>Adresse email</li>
                    <li>Photo de profil Google</li>
                    <li>Identifiant unique Google</li>
                  </ul>
                </div>

                <div className="p-3 border border-black/10 bg-black/5">
                  <p className="font-bold text-black text-sm">Donnees d'utilisation du service</p>
                  <ul className="list-disc list-inside mt-1 text-xs">
                    <li>Videos generees (stockees temporairement)</li>
                    <li>Articles selectionnes pour les videos</li>
                    <li>Preferences de configuration (template, musique)</li>
                    <li>Historique des generations</li>
                  </ul>
                </div>

                <div className="p-3 border border-black/10 bg-black/5">
                  <p className="font-bold text-black text-sm">Donnees techniques</p>
                  <ul className="list-disc list-inside mt-1 text-xs">
                    <li>Adresse IP</li>
                    <li>Type de navigateur et version</li>
                    <li>Systeme d'exploitation</li>
                    <li>Pages visitees et temps de navigation</li>
                  </ul>
                </div>

                <div className="p-3 border border-black/10 bg-black/5">
                  <p className="font-bold text-black text-sm">Donnees de paiement</p>
                  <ul className="list-disc list-inside mt-1 text-xs">
                    <li>Traitees exclusivement par notre prestataire de paiement</li>
                    <li>VintBoost ne stocke JAMAIS vos donnees bancaires</li>
                  </ul>
                </div>
              </div>

              <div className="mt-3 p-3 border-2 border-black/20" style={{ backgroundColor: '#9ED8DB30' }}>
                <p className="font-bold text-black text-xs">
                  DONNEES VINTED : VintBoost accede uniquement aux informations rendues PUBLIQUES par les utilisateurs sur Vinted (titre, prix, images des articles). Nous ne stockons pas ces donnees de maniere permanente et ne collectons AUCUN identifiant de connexion Vinted.
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-display font-bold text-lg text-black mb-3">3. Finalites du traitement</h2>
              <p>Vos donnees sont traitees pour les finalites suivantes :</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><strong>Fourniture du service</strong> : creation de compte, generation de videos, gestion des abonnements</li>
                <li><strong>Amelioration du service</strong> : analyse des usages, optimisation des performances</li>
                <li><strong>Communication</strong> : notifications de compte, informations sur le service</li>
                <li><strong>Securite</strong> : prevention des fraudes, protection contre les acces non autorises</li>
                <li><strong>Obligations legales</strong> : respect des reglementations applicables</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display font-bold text-lg text-black mb-3">4. Base legale du traitement</h2>
              <p>Le traitement de vos donnees repose sur les bases legales suivantes :</p>
              <div className="mt-2 space-y-2">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 mt-1.5 rounded-full" style={{ backgroundColor: '#1D3354' }}></div>
                  <p><strong>Execution du contrat</strong> : fourniture du service VintBoost</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 mt-1.5 rounded-full" style={{ backgroundColor: '#9ED8DB' }}></div>
                  <p><strong>Consentement</strong> : cookies non essentiels, communications marketing</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 mt-1.5 rounded-full" style={{ backgroundColor: '#D64045' }}></div>
                  <p><strong>Interet legitime</strong> : securite du service, amelioration continue</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 mt-1.5 rounded-full bg-black/50"></div>
                  <p><strong>Obligation legale</strong> : conservation de certaines donnees</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="font-display font-bold text-lg text-black mb-3 flex items-center gap-2">
                <Trash2 className="w-5 h-5" />
                5. Duree de conservation
              </h2>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 border border-black/10">
                  <span>Donnees de compte</span>
                  <span className="font-bold text-xs">Duree du compte + 30 jours</span>
                </div>
                <div className="flex justify-between items-center p-2 border border-black/10">
                  <span>Videos generees</span>
                  <span className="font-bold text-xs">30 jours</span>
                </div>
                <div className="flex justify-between items-center p-2 border border-black/10">
                  <span>Donnees de facturation</span>
                  <span className="font-bold text-xs">10 ans (obligation legale)</span>
                </div>
                <div className="flex justify-between items-center p-2 border border-black/10">
                  <span>Logs techniques</span>
                  <span className="font-bold text-xs">12 mois</span>
                </div>
                <div className="flex justify-between items-center p-2 border border-black/10">
                  <span>Cookies</span>
                  <span className="font-bold text-xs">13 mois maximum</span>
                </div>
              </div>
            </section>

            <section>
              <h2 className="font-display font-bold text-lg text-black mb-3">6. Destinataires des donnees</h2>
              <p>Vos donnees peuvent etre partagees avec les destinataires suivants :</p>
              <div className="mt-3 space-y-2">
                <div className="p-3 border border-black/10">
                  <p className="font-bold text-black">Supabase Inc.</p>
                  <p className="text-xs text-black/60">Hebergement base de donnees et authentification - USA (clauses contractuelles types)</p>
                </div>
                <div className="p-3 border border-black/10">
                  <p className="font-bold text-black">Hetzner Online GmbH</p>
                  <p className="text-xs text-black/60">Hebergement serveurs - Allemagne (UE)</p>
                </div>
                <div className="p-3 border border-black/10">
                  <p className="font-bold text-black">Prestataire de paiement</p>
                  <p className="text-xs text-black/60">Traitement securise des paiements - UE</p>
                </div>
              </div>
              <p className="mt-3 font-bold">
                Nous ne vendons JAMAIS vos donnees personnelles a des tiers.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-lg text-black mb-3 flex items-center gap-2">
                <Eye className="w-5 h-5" />
                7. Vos droits
              </h2>
              <p>Conformement au RGPD, vous disposez des droits suivants :</p>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="p-2 border border-black/10 bg-black/5">
                  <p className="font-bold text-black text-xs">Droit d'acces</p>
                  <p className="text-xs">Obtenir une copie de vos donnees</p>
                </div>
                <div className="p-2 border border-black/10 bg-black/5">
                  <p className="font-bold text-black text-xs">Droit de rectification</p>
                  <p className="text-xs">Corriger vos donnees inexactes</p>
                </div>
                <div className="p-2 border border-black/10 bg-black/5">
                  <p className="font-bold text-black text-xs">Droit a l'effacement</p>
                  <p className="text-xs">Supprimer vos donnees</p>
                </div>
                <div className="p-2 border border-black/10 bg-black/5">
                  <p className="font-bold text-black text-xs">Droit a la portabilite</p>
                  <p className="text-xs">Recevoir vos donnees en format structure</p>
                </div>
                <div className="p-2 border border-black/10 bg-black/5">
                  <p className="font-bold text-black text-xs">Droit d'opposition</p>
                  <p className="text-xs">Vous opposer au traitement</p>
                </div>
                <div className="p-2 border border-black/10 bg-black/5">
                  <p className="font-bold text-black text-xs">Droit de limitation</p>
                  <p className="text-xs">Limiter le traitement</p>
                </div>
              </div>
              <p className="mt-3">
                Pour exercer ces droits, contactez-nous a :{' '}
                <a href="mailto:contact@vintboost.com" className="underline" style={{ color: '#1D3354' }}>
                  contact@vintboost.com
                </a>
              </p>
              <p className="mt-2 text-xs">
                Nous repondrons a votre demande dans un delai de 30 jours. Vous pouvez egalement introduire une reclamation aupres de la CNIL (www.cnil.fr).
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-lg text-black mb-3 flex items-center gap-2">
                <Cookie className="w-5 h-5" />
                8. Cookies et traceurs
              </h2>

              <p className="mb-3">
                VintBoost utilise des cookies pour assurer le bon fonctionnement du site. Voici le detail des cookies utilises :
              </p>

              <div className="space-y-3">
                <div className="p-3 border-2 border-green-500/30 bg-green-50">
                  <p className="font-bold text-black text-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    Cookies strictement necessaires (pas de consentement requis)
                  </p>
                  <ul className="list-disc list-inside mt-2 text-xs space-y-1">
                    <li><strong>sb-auth-token</strong> : authentification Supabase (session)</li>
                    <li><strong>cookie-consent</strong> : memorisation de vos choix cookies (13 mois)</li>
                  </ul>
                </div>

                <div className="p-3 border-2 border-blue-500/30 bg-blue-50">
                  <p className="font-bold text-black text-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    Cookies fonctionnels (consentement requis)
                  </p>
                  <ul className="list-disc list-inside mt-2 text-xs space-y-1">
                    <li><strong>user-preferences</strong> : sauvegarde de vos preferences (template, duree) (12 mois)</li>
                  </ul>
                </div>

                <div className="p-3 border-2 border-black/10 bg-black/5">
                  <p className="font-bold text-black text-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                    Cookies publicitaires / tracking
                  </p>
                  <p className="text-xs mt-1">
                    <strong>AUCUN</strong> - VintBoost n'utilise pas de cookies publicitaires ou de tracking tiers.
                  </p>
                </div>
              </div>

              <p className="mt-3 text-xs">
                Vous pouvez modifier vos preferences cookies a tout moment en cliquant sur "Gerer les cookies" dans le pied de page.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-lg text-black mb-3 flex items-center gap-2">
                <Lock className="w-5 h-5" />
                9. Securite des donnees
              </h2>
              <p>
                Nous mettons en oeuvre des mesures de securite techniques et organisationnelles appropriees pour proteger vos donnees :
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><strong>Chiffrement</strong> : toutes les communications sont chiffrees (HTTPS/TLS 1.3)</li>
                <li><strong>Authentification securisee</strong> : OAuth 2.0 via Google</li>
                <li><strong>Acces restreint</strong> : seules les personnes autorisees accedent aux donnees</li>
                <li><strong>Hebergement securise</strong> : serveurs en Union Europeenne avec certifications</li>
                <li><strong>Sauvegardes</strong> : sauvegardes regulieres et chiffrees</li>
                <li><strong>Monitoring</strong> : surveillance continue des acces et anomalies</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display font-bold text-lg text-black mb-3">10. Transferts hors UE</h2>
              <p>
                Certaines donnees peuvent etre transferees vers des pays hors de l'Union Europeenne (notamment Supabase aux USA). Ces transferts sont encadres par :
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Les clauses contractuelles types de la Commission europeenne</li>
                <li>Des mesures supplementaires de securite</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display font-bold text-lg text-black mb-3">11. Modifications de la politique</h2>
              <p>
                Nous pouvons modifier cette politique de confidentialite a tout moment. En cas de modification substantielle, vous serez informe par email ou via une notification sur le site.
              </p>
              <p className="mt-2">
                La version en vigueur est toujours accessible sur cette page.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-lg text-black mb-3">12. Contact et reclamations</h2>
              <p>
                Pour toute question concernant cette politique ou pour exercer vos droits :{' '}
                <a href="mailto:contact@vintboost.com" className="underline" style={{ color: '#1D3354' }}>
                  contact@vintboost.com
                </a>
              </p>
              <p className="mt-2">
                Vous pouvez introduire une reclamation aupres de l'autorite de controle competente :
              </p>
              <div className="mt-2 p-3 border border-black/10 bg-black/5">
                <p className="font-bold text-black text-sm">CNIL</p>
                <p className="text-xs">Commission Nationale de l'Informatique et des Libertes</p>
                <p className="text-xs">3 Place de Fontenoy, TSA 80715, 75334 PARIS CEDEX 07</p>
                <p className="text-xs">www.cnil.fr</p>
              </div>
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
