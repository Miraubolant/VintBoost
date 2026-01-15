import { useState, useEffect } from 'react'
import { ChevronDown, ArrowLeft, MessageCircle, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'

interface FAQItem {
  question: string
  answer: string
  category: string
}

const faqItems: FAQItem[] = [
  {
    category: 'GENERAL',
    question: "Comment fonctionne VintBoost ?",
    answer: "VintBoost recupere automatiquement les articles de ton vestiaire Vinted a partir de ton lien profil, puis genere une video promotionnelle professionnelle avec tes produits. Tu n'as qu'a coller ton lien et cliquer sur generer !"
  },
  {
    category: 'GENERAL',
    question: "Combien de temps prend la generation d'une video ?",
    answer: "La generation d'une video prend environ 30 secondes a 2 minutes selon le nombre d'articles et la qualite choisie. Tu recevras une notification des que ta video sera prete."
  },
  {
    category: 'FONCTIONNALITES',
    question: "Puis-je personnaliser mes videos ?",
    answer: "Oui ! Tu peux selectionner jusqu'a 10 articles de ton vestiaire, choisir la duree de la video (15s, 30s, 45s ou 60s), et avec les plans payants, acceder a des templates premium et la qualite HD/4K."
  },
  {
    category: 'FONCTIONNALITES',
    question: "Les videos ont-elles un watermark ?",
    answer: "Le plan gratuit inclut un watermark VintBoost discret. Les plans Pro et Business permettent de generer des videos sans aucun watermark pour un rendu 100% professionnel."
  },
  {
    category: 'UTILISATION',
    question: "Comment utiliser mes videos ?",
    answer: "Une fois generees, tu peux telecharger tes videos et les partager sur TikTok, Instagram Reels, Stories ou directement dans tes annonces Vinted pour attirer plus d'acheteurs."
  },
  {
    category: 'UTILISATION',
    question: "Est-ce compatible avec tous les comptes Vinted ?",
    answer: "Oui, VintBoost fonctionne avec tous les comptes Vinted publics. Il te suffit de coller le lien de ton profil ou de ton vestiaire pour commencer."
  },
  {
    category: 'TARIFS',
    question: "Quel plan choisir ?",
    answer: "Le plan Gratuit te permet de tester avec 1 vidéo. Le Pack Pro à 2,99€ (achat unique) est idéal pour les vendeurs occasionnels avec 5 vidéos HD incluses. L'abonnement Business à 5,99€/mois convient aux vendeurs professionnels avec 15 vidéos 4K/mois."
  },
  {
    category: 'TARIFS',
    question: "Quelle est la différence entre Pack et Abonnement ?",
    answer: "Le Pack Pro est un achat unique : tu paies une fois 2,99€ et tu obtiens 5 vidéos à utiliser quand tu veux. L'abonnement Business te donne 15 vidéos chaque mois avec renouvellement automatique à 5,99€/mois."
  },
  {
    category: 'TECHNIQUE',
    question: "Quels formats de video sont disponibles ?",
    answer: "Toutes les videos sont exportees en MP4, optimisees pour les reseaux sociaux. Les plans payants offrent la qualite 1080p (Pro) ou 4K (Business)."
  },
  {
    category: 'TECHNIQUE',
    question: "Combien de temps sont conservées mes vidéos ?",
    answer: "La durée de conservation dépend de ton plan : 1 jour pour le plan Gratuit, 7 jours pour le Pack Pro, et 30 jours pour l'abonnement Business. Pense à télécharger tes vidéos avant expiration !"
  },
]

const categories = ['TOUS', 'GENERAL', 'FONCTIONNALITES', 'UTILISATION', 'TARIFS', 'TECHNIQUE']

export function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [activeCategory, setActiveCategory] = useState('TOUS')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const filteredItems = activeCategory === 'TOUS'
    ? faqItems
    : faqItems.filter(item => item.category === activeCategory)

  return (
    <div className="min-h-screen pt-16 sm:pt-20 pb-16" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 mb-8 px-4 py-2 border-2 border-black font-display font-bold text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          <ArrowLeft className="w-4 h-4" />
          RETOUR
        </Link>

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl xl:text-6xl tracking-tight">
            <div className="text-black transform -rotate-2 mb-4 relative">
              <span className="inline-block bg-white border-4 border-black px-6 sm:px-8 py-3 sm:py-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                QUESTIONS
              </span>
            </div>
            <div className="text-white transform rotate-2 relative">
              <span className="inline-block border-4 border-black px-6 sm:px-8 py-3 sm:py-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" style={{ backgroundColor: '#1D3354' }}>
                FREQUENTES
              </span>
            </div>
          </h1>
          <p className="text-base sm:text-lg text-black/70 font-body max-w-lg mx-auto mt-4">
            Tout ce que tu dois savoir sur VintBoost
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className="px-3 py-1.5 border-2 border-black font-display font-bold text-xs transition-all"
              style={{
                backgroundColor: activeCategory === category ? '#1D3354' : '#FFFFFF',
                color: activeCategory === category ? '#FFFFFF' : '#000000',
                boxShadow: activeCategory === category ? '2px 2px 0px 0px rgba(0,0,0,1)' : 'none'
              }}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="space-y-3 mb-12">
          {filteredItems.map((item, index) => (
            <div
              key={index}
              className="border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
              style={{ backgroundColor: '#FFFFFF' }}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-4 py-4 flex items-center justify-between text-left hover:bg-black/5 transition-colors"
              >
                <div className="flex items-center gap-3 pr-4">
                  <span
                    className="px-2 py-0.5 text-[9px] font-display font-bold border border-black"
                    style={{ backgroundColor: '#9ED8DB' }}
                  >
                    {item.category}
                  </span>
                  <span className="font-display font-bold text-sm sm:text-base text-black">
                    {item.question}
                  </span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-black shrink-0 transition-transform duration-200 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-4 pb-4 pt-0 border-t border-black/10">
                  <p className="text-sm text-black/70 font-body leading-relaxed pt-3">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div
          className="border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 text-center"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          <h2 className="font-display font-bold text-lg mb-2">Tu n'as pas trouve ta reponse ?</h2>
          <p className="text-sm text-black/70 font-body mb-4">
            Notre equipe est la pour t'aider
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="mailto:contact@vintboost.com"
              className="inline-flex items-center gap-2 px-4 py-2 border-2 border-black font-display font-bold text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all"
              style={{ backgroundColor: '#FFFFFF' }}
            >
              <Mail className="w-4 h-4" />
              EMAIL
            </a>
            <button
              className="inline-flex items-center gap-2 px-4 py-2 border-2 border-black font-display font-bold text-xs text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all"
              style={{ backgroundColor: '#1D3354' }}
            >
              <MessageCircle className="w-4 h-4" />
              CHAT
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
