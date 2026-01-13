import { useState } from 'react'
import { ChevronDown, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

interface FAQItem {
  question: string
  answer: string
}

const faqItems: FAQItem[] = [
  {
    question: "Comment fonctionne VintBoost ?",
    answer: "VintBoost récupère automatiquement les articles de ton vestiaire Vinted à partir de ton lien profil, puis génère une vidéo promotionnelle professionnelle avec tes produits. Tu n'as qu'à coller ton lien et cliquer sur générer !"
  },
  {
    question: "Combien de temps prend la génération d'une vidéo ?",
    answer: "La génération d'une vidéo prend environ 30 secondes à 2 minutes selon le nombre d'articles et la qualité choisie. Tu recevras une notification dès que ta vidéo sera prête."
  },
  {
    question: "Puis-je personnaliser mes vidéos ?",
    answer: "Oui ! Tu peux sélectionner jusqu'à 10 articles de ton vestiaire, choisir la durée de la vidéo (15s, 30s, 45s ou 60s), et avec les plans payants, accéder à des templates premium et la qualité HD/4K."
  },
  {
    question: "Les vidéos ont-elles un watermark ?",
    answer: "Le plan gratuit inclut un watermark VintBoost discret. Les plans Pro et Business permettent de générer des vidéos sans aucun watermark pour un rendu 100% professionnel."
  },
  {
    question: "Comment utiliser mes vidéos ?",
    answer: "Une fois générées, tu peux télécharger tes vidéos et les partager sur TikTok, Instagram Reels, Stories ou directement dans tes annonces Vinted pour attirer plus d'acheteurs."
  },
  {
    question: "Est-ce compatible avec tous les comptes Vinted ?",
    answer: "Oui, VintBoost fonctionne avec tous les comptes Vinted publics. Il te suffit de coller le lien de ton profil ou de ton vestiaire pour commencer."
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="py-12 px-4 relative overflow-hidden">
      {/* Decorative elements - Desktop only */}
      <div
        className="hidden lg:block absolute -left-4 top-16 w-7 h-7 border-2 border-black transform rotate-12 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
        style={{ backgroundColor: '#1D3354' }}
      />
      <div
        className="hidden lg:block absolute left-20 top-36 w-5 h-5 border-2 border-black rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
        style={{ backgroundColor: '#D64045' }}
      />
      <div
        className="hidden lg:block absolute -right-6 top-24 w-8 h-8 border-2 border-black rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
        style={{ backgroundColor: '#D64045' }}
      />
      <div
        className="hidden lg:block absolute right-16 bottom-24 w-6 h-6 border-2 border-black transform -rotate-12 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
        style={{ backgroundColor: '#1D3354' }}
      />

      <div className="max-w-3xl mx-auto relative">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl mb-3">
            <span
              className="inline-block text-white border-2 border-black px-3 py-1 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
              style={{ backgroundColor: '#1D3354' }}
            >
              QUESTIONS FREQUENTES
            </span>
          </h2>
          <p className="text-sm sm:text-base text-black/70 font-body max-w-md mx-auto">
            Tout ce que tu dois savoir sur VintBoost
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-3">
          {faqItems.map((item, index) => (
            <div
              key={index}
              className="border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
              style={{ backgroundColor: '#FFFFFF' }}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-black/5 transition-colors"
              >
                <span className="font-display font-bold text-sm sm:text-base text-black pr-4">
                  {item.question}
                </span>
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
                <div className="px-4 pb-4 pt-0">
                  <p className="text-sm text-black/70 font-body leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* See All Link */}
        <div className="text-center mt-8">
          <Link
            to="/faq"
            className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-black font-display font-bold text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
            style={{ backgroundColor: '#1D3354', color: '#FFFFFF' }}
          >
            VOIR TOUTES LES QUESTIONS
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
