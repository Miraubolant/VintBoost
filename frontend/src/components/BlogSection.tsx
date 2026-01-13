import { ArrowRight, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { blogPosts } from '../data/blogPosts'

export function BlogSection() {
  // Show only first 3 posts on homepage
  const displayPosts = blogPosts.slice(0, 3)

  return (
    <section id="blog" className="py-16 px-4 relative overflow-hidden">
      {/* Decorative elements - Desktop only */}
      <div
        className="hidden lg:block absolute -left-6 top-20 w-8 h-8 border-2 border-black rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
        style={{ backgroundColor: '#D64045' }}
      />
      <div
        className="hidden lg:block absolute left-16 top-44 w-6 h-6 border-2 border-black transform rotate-12 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
        style={{ backgroundColor: '#1D3354' }}
      />
      <div
        className="hidden lg:block absolute -right-4 top-28 w-9 h-9 border-2 border-black transform -rotate-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
        style={{ backgroundColor: '#1D3354' }}
      />
      <div
        className="hidden lg:block absolute right-20 bottom-28 w-5 h-5 border-2 border-black rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
        style={{ backgroundColor: '#D64045' }}
      />
      <div
        className="hidden lg:block absolute left-12 bottom-20 w-7 h-7 border-2 border-black transform rotate-45 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
        style={{ backgroundColor: '#D64045' }}
      />

      <div className="max-w-6xl mx-auto relative">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl xl:text-6xl tracking-tight">
            <div className="text-black transform -rotate-2 mb-4 relative">
              <span className="inline-block bg-white border-4 border-black px-6 sm:px-8 py-3 sm:py-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                BLOG &
              </span>
            </div>
            <div className="text-white transform rotate-2 relative">
              <span className="inline-block border-4 border-black px-6 sm:px-8 py-3 sm:py-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" style={{ backgroundColor: '#1D3354' }}>
                CONSEILS
              </span>
            </div>
          </h2>
          <p className="text-sm sm:text-base text-black/70 font-body max-w-md mx-auto mt-4">
            Astuces et guides pour booster tes ventes Vinted
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayPosts.map((post) => (
            <article
              key={post.id}
              className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 group"
              style={{ backgroundColor: '#FFFFFF' }}
            >
              <Link to={`/blog/${post.slug}`}>
                {/* Image */}
                <div className="h-40 overflow-hidden border-b-2 border-black">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>

                {/* Content */}
                <div className="p-4">
                  {/* Category & Read Time */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="px-2 py-1 text-[10px] font-display font-bold border-2 border-black text-white"
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
              </Link>
            </article>
          ))}
        </div>

        {/* See All Button */}
        <div className="text-center mt-10">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-black font-display font-bold text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
            style={{ backgroundColor: '#FFFFFF' }}
          >
            VOIR TOUS LES ARTICLES
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
