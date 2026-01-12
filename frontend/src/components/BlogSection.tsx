import { ArrowRight, Clock } from 'lucide-react'

interface BlogPost {
  id: string
  title: string
  excerpt: string
  category: string
  readTime: string
  imageUrl: string
}

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: '10 astuces pour vendre plus vite sur Vinted',
    excerpt: 'Decouvre les secrets des top vendeurs pour booster tes ventes et attirer plus d\'acheteurs.',
    category: 'CONSEILS',
    readTime: '5 min',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
  },
  {
    id: '2',
    title: 'Comment creer des videos virales pour TikTok',
    excerpt: 'Les meilleures pratiques pour creer du contenu qui cartonne sur les reseaux sociaux.',
    category: 'TIKTOK',
    readTime: '4 min',
    imageUrl: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=300&fit=crop',
  },
  {
    id: '3',
    title: 'Guide complet : photographier ses vetements',
    excerpt: 'Apprends a prendre des photos professionnelles de tes articles avec ton smartphone.',
    category: 'PHOTOS',
    readTime: '6 min',
    imageUrl: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=300&fit=crop',
  },
]

export function BlogSection() {
  return (
    <section id="blog" className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl mb-3">
            <span
              className="inline-block text-white border-2 border-black px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              style={{ backgroundColor: '#1D3354' }}
            >
              BLOG & CONSEILS
            </span>
          </h2>
          <p className="text-sm sm:text-base text-black/70 font-body max-w-md mx-auto mt-4">
            Astuces et guides pour booster tes ventes Vinted
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 cursor-pointer group"
              style={{ backgroundColor: '#FFFFFF' }}
            >
              {/* Image */}
              <div className="h-40 overflow-hidden border-b-2 border-black">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Category & Read Time */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="px-2 py-1 text-[10px] font-display font-bold border-2 border-black"
                    style={{ backgroundColor: '#D64045' }}
                  >
                    {post.category}
                  </span>
                  <div className="flex items-center gap-1 text-black/50">
                    <Clock className="w-3 h-3" />
                    <span className="text-xs font-body">{post.readTime}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-display font-bold text-sm mb-2 text-black group-hover:underline">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-xs font-body text-black/60 leading-relaxed mb-3">
                  {post.excerpt}
                </p>

                {/* Read More */}
                <div className="flex items-center gap-1 text-xs font-display font-bold" style={{ color: '#1D3354' }}>
                  <span>LIRE L'ARTICLE</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* See All Button */}
        <div className="text-center mt-10">
          <button
            className="px-6 py-3 border-2 border-black font-display font-bold text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
            style={{ backgroundColor: '#FFFFFF' }}
          >
            VOIR TOUS LES ARTICLES
          </button>
        </div>
      </div>
    </section>
  )
}
