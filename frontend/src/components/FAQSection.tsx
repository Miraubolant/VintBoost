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
    answer: "C'est simple ! Colle le lien de ton profil Vinted, sélectionne les articles à mettre en avant (5 à 20 selon ton plan), personnalise ta vidéo (durée, musique, template), et génère ta vidéo promo en quelques secondes !"
  },
  {
    question: "Combien de temps prend la génération ?",
    answer: "La génération prend environ 30 secondes à 2 minutes selon le nombre d'articles. Une fois générée, tu peux télécharger ta vidéo immédiatement."
  },
  {
    question: "Quelles durées de vidéo sont disponibles ?",
    answer: "Tu peux créer des vidéos de 15s, 30s ou 60s. Les formats courts sont parfaits pour TikTok et Reels, le format long pour des présentations plus complètes."
  },
  {
    question: "Les vidéos ont-elles un watermark ?",
    answer: "Le plan Gratuit inclut un watermark VintBoost. Les plans Pro et Business permettent de le désactiver pour un rendu 100% professionnel."
  },
  {
    question: "Quel plan choisir ?",
    answer: "Gratuit : 1 vidéo pour tester. Pack Pro (2,99€) : 5 vidéos HD, achat unique. Business (5,99€/mois) : 15 vidéos 4K/mois pour les pros."
  },
  {
    question: "Combien de temps sont conservées mes vidéos ?",
    answer: "1 jour (Gratuit), 7 jours (Pro), ou 30 jours (Business). Un badge t'indique le temps restant pour télécharger tes vidéos."
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
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl xl:text-6xl tracking-tight">
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
          </h2>
          <p className="text-sm sm:text-base text-black/70 font-body max-w-md mx-auto mt-4">
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
