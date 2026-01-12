import { Star } from 'lucide-react'

interface Testimonial {
  name: string
  username: string
  initials: string
  rating: number
  text: string
  result: string
  resultLabel: string
}

const testimonials: Testimonial[] = [
  {
    name: 'Marie L.',
    username: '@marie_vinted',
    initials: 'ML',
    rating: 5,
    text: "Incroyable ! J'ai doublé mes ventes depuis que j'utilise VintBoost. Les vidéos attirent vraiment plus d'acheteurs.",
    result: '+150%',
    resultLabel: 'de vues',
  },
  {
    name: 'Thomas B.',
    username: '@tom_vintage',
    initials: 'TB',
    rating: 5,
    text: "Super facile à utiliser. En 30 secondes j'ai une vidéo pro pour mes articles. Je recommande à tous les vendeurs !",
    result: '+80',
    resultLabel: 'ventes/mois',
  },
  {
    name: 'Sophie M.',
    username: '@sophie_mode',
    initials: 'SM',
    rating: 5,
    text: "Le plan Pro est parfait pour moi. Les templates premium font vraiment la différence sur TikTok et Instagram.",
    result: '2K+',
    resultLabel: 'followers',
  },
  {
    name: 'Lucas D.',
    username: '@lucas_deals',
    initials: 'LD',
    rating: 5,
    text: "Très bon outil ! Mes articles partent beaucoup plus vite depuis que je poste des vidéos sur mes réseaux.",
    result: '+200%',
    resultLabel: 'de ventes',
  },
  {
    name: 'Emma R.',
    username: '@emma_vintage',
    initials: 'ER',
    rating: 5,
    text: "J'étais sceptique au début mais les résultats parlent d'eux-mêmes. Mes vidéos font le buzz sur TikTok !",
    result: '50K',
    resultLabel: 'vues TikTok',
  },
  {
    name: 'Antoine P.',
    username: '@antoine_mode',
    initials: 'AP',
    rating: 5,
    text: "Parfait pour mettre en valeur mes articles. La qualité des vidéos est vraiment professionnelle.",
    result: '+300%',
    resultLabel: 'engagement',
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-8 sm:py-12 lg:py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl mb-3">
            <span
              className="inline-block text-white border-2 border-black px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              style={{ backgroundColor: '#1D3354' }}
            >
              ILS ADORENT VINTBOOST
            </span>
          </h2>
          <p className="text-sm sm:text-base text-black/70 font-body max-w-lg mx-auto mt-4">
            <span style={{ color: '#1D3354' }} className="font-semibold">+10 000 vendeurs</span> ont déjà boosté leurs ventes. Découvre leurs témoignages !
          </p>
        </div>

        {/* Testimonials Grid - 3 columns on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="card-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-5 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 flex flex-col"
            >
              {/* Header with Avatar and Info */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {/* Avatar with Initials */}
                  <div
                    className="w-12 h-12 border-2 border-black flex items-center justify-center font-display font-bold text-sm text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    style={{ backgroundColor: '#1D3354' }}
                  >
                    {testimonial.initials}
                  </div>
                  <div>
                    <p className="font-display font-bold text-sm text-black">{testimonial.name}</p>
                    <p className="text-xs text-black/50 font-body">{testimonial.username}</p>
                  </div>
                </div>
                {/* Rating Stars */}
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-4 h-4"
                      style={{
                        color: star <= testimonial.rating ? '#FFD700' : '#E5E5E5',
                        fill: star <= testimonial.rating ? '#FFD700' : '#E5E5E5',
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Testimonial Text */}
              <p className="text-sm text-black/80 font-body leading-relaxed flex-1 mb-4">
                "{testimonial.text}"
              </p>

              {/* Result Badge */}
              <div className="flex items-center gap-2">
                <div
                  className="px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  style={{ backgroundColor: '#9ED8DB' }}
                >
                  <span className="font-display font-bold text-sm text-black">{testimonial.result}</span>
                </div>
                <span className="text-xs font-body text-black/60">{testimonial.resultLabel}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-10">
          <p className="font-body text-sm text-black/60 mb-3">
            Tu veux les mêmes résultats ?
          </p>
          <button
            onClick={() => {
              const hero = document.getElementById('hero')
              if (hero) hero.scrollIntoView({ behavior: 'smooth' })
            }}
            className="px-6 py-3 border-2 border-black font-display font-bold text-sm text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
            style={{ backgroundColor: '#D64045' }}
          >
            ESSAYER GRATUITEMENT
          </button>
        </div>
      </div>
    </section>
  )
}
