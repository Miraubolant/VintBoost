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
    text: "Incroyable ! J'ai double mes ventes depuis que j'utilise VintBoost. Les videos attirent vraiment plus d'acheteurs.",
    result: '+150%',
    resultLabel: 'de vues',
  },
  {
    name: 'Thomas B.',
    username: '@tom_vintage',
    initials: 'TB',
    rating: 5,
    text: "Super facile a utiliser. En 30 secondes j'ai une video pro pour mes articles. Je recommande a tous les vendeurs !",
    result: '+80',
    resultLabel: 'ventes/mois',
  },
  {
    name: 'Sophie M.',
    username: '@sophie_mode',
    initials: 'SM',
    rating: 5,
    text: "Le plan Pro est parfait pour moi. Les templates premium font vraiment la difference sur TikTok et Instagram.",
    result: '2K+',
    resultLabel: 'followers',
  },
  {
    name: 'Lucas D.',
    username: '@lucas_deals',
    initials: 'LD',
    rating: 5,
    text: "Tres bon outil ! Mes articles partent beaucoup plus vite depuis que je poste des videos sur mes reseaux.",
    result: '+200%',
    resultLabel: 'de ventes',
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-8 sm:py-12 lg:py-16 px-4 relative overflow-hidden">
      {/* Decorative elements - Desktop only */}
      <div
        className="hidden lg:block absolute -left-6 top-16 w-10 h-10 border-2 border-black transform -rotate-12 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
        style={{ backgroundColor: '#1D3354' }}
      />
      <div
        className="hidden lg:block absolute left-16 top-32 w-6 h-6 border-2 border-black rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
        style={{ backgroundColor: '#D64045' }}
      />
      <div
        className="hidden lg:block absolute -right-6 top-24 w-8 h-8 border-2 border-black transform rotate-45 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
        style={{ backgroundColor: '#D64045' }}
      />
      <div
        className="hidden lg:block absolute right-20 bottom-32 w-5 h-5 border-2 border-black rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
        style={{ backgroundColor: '#1D3354' }}
      />
      <div
        className="hidden lg:block absolute left-8 bottom-20 w-7 h-7 border-2 border-black transform rotate-12 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
        style={{ backgroundColor: '#1D3354' }}
      />

      <div className="max-w-5xl mx-auto relative">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl xl:text-6xl tracking-tight">
            <div className="text-black transform -rotate-2 mb-4 relative">
              <span className="inline-block bg-white border-4 border-black px-6 sm:px-8 py-3 sm:py-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                ILS ADORENT
              </span>
            </div>
            <div className="text-white transform rotate-2 relative">
              <span className="inline-block border-4 border-black px-6 sm:px-8 py-3 sm:py-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" style={{ backgroundColor: '#1D3354' }}>
                VINTBOOST
              </span>
            </div>
          </h2>
          <p className="text-sm sm:text-base text-black/70 font-body max-w-lg mx-auto mt-4">
            <span style={{ color: '#1D3354' }} className="font-semibold">+10 000 vendeurs</span> ont deja booste leurs ventes. Decouvre leurs temoignages !
          </p>
        </div>

        {/* Testimonials Grid - 2x2 on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
            Tu veux les memes resultats ?
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
