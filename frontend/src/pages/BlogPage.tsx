import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Clock, ArrowRight, BookOpen, Search } from 'lucide-react'
import { blogPosts, getAllCategories } from '../data/blogPosts'
import { Helmet } from 'react-helmet-async'

export function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const categories = getAllCategories()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = !selectedCategory || post.category === selectedCategory
    const matchesSearch = !searchQuery ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  return (
    <>
      <Helmet>
        <title>Blog VintBoost - Conseils et astuces pour vendre sur Vinted</title>
        <meta name="description" content="Découvre tous nos conseils pour booster tes ventes Vinted : photos, vidéos TikTok, profil optimisé, tendances mode seconde main. Guide complet du vendeur Vinted." />
        <meta name="keywords" content="vinted conseils, vendre vinted, astuces vinted, photos vinted, tiktok vinted, mode seconde main" />
        <link rel="canonical" href="https://vintboost.com/blog" />
        <meta property="og:title" content="Blog VintBoost - Conseils pour vendre sur Vinted" />
        <meta property="og:description" content="Découvre tous nos conseils pour booster tes ventes Vinted : photos, vidéos, profil optimisé." />
        <meta property="og:url" content="https://vintboost.com/blog" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen py-8 px-4" style={{ backgroundColor: '#E8DFD5' }}>
        <div className="max-w-5xl mx-auto">
          {/* Back button */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 mb-6 px-3 py-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all font-display font-bold text-xs"
            style={{ backgroundColor: '#FFFFFF' }}
          >
            <ArrowLeft className="w-4 h-4" />
            RETOUR
          </Link>

          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" style={{ backgroundColor: '#D64045' }}>
              <BookOpen className="w-4 h-4 text-white" />
              <span className="font-display font-bold text-xs text-white">RESSOURCES</span>
            </div>

            <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl xl:text-6xl tracking-tight">
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
            </h1>
            <p className="text-sm sm:text-base text-black/70 font-body max-w-lg mx-auto mt-4">
              Astuces, guides et tendances pour booster tes ventes Vinted
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md mx-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Rechercher un article..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-3 border-black font-body shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-x-[-1px] focus:translate-y-[-1px] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 border-2 border-black font-display font-bold text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all ${
                !selectedCategory ? 'text-white' : 'bg-white text-black'
              }`}
              style={{ backgroundColor: !selectedCategory ? '#1D3354' : undefined }}
            >
              TOUS
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 border-2 border-black font-display font-bold text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all ${
                  selectedCategory === category ? 'text-white' : 'bg-white text-black'
                }`}
                style={{ backgroundColor: selectedCategory === category ? '#D64045' : undefined }}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Blog Grid */}
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <article
                  key={post.id}
                  className="border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 group"
                  style={{ backgroundColor: '#FFFFFF' }}
                >
                  <Link to={`/blog/${post.slug}`}>
                    {/* Image */}
                    <div className="h-48 overflow-hidden border-b-3 border-black">
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-5">
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
                      <h2 className="font-display font-bold text-base mb-2 text-black group-hover:underline line-clamp-2">
                        {post.title}
                      </h2>

                      {/* Excerpt */}
                      <p className="text-sm font-body text-black/60 leading-relaxed mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 text-[10px] font-body border border-black/20 bg-gray-100"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Read More */}
                      <div className="flex items-center gap-1 text-sm font-display font-bold" style={{ color: '#1D3354' }}>
                        <span>LIRE L'ARTICLE</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="border-3 border-black p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" style={{ backgroundColor: '#FFFFFF' }}>
                <p className="font-display font-bold text-lg text-black mb-2">Aucun article trouvé</p>
                <p className="font-body text-sm text-black/60">Essaie avec d'autres mots-clés ou catégories</p>
              </div>
            </div>
          )}

          {/* Newsletter CTA */}
          <div className="mt-12 text-center">
            <div className="border-4 border-black p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]" style={{ backgroundColor: '#1D3354' }}>
              <h3 className="font-display font-bold text-xl sm:text-2xl text-white mb-3">
                Envie de plus de conseils ?
              </h3>
              <p className="font-body text-sm text-white/80 mb-4 max-w-md mx-auto">
                Utilise VintBoost pour créer des vidéos pro et booster tes ventes dès maintenant !
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-5 py-3 text-black border-3 border-black font-display font-bold text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
                style={{ backgroundColor: '#FFFFFF' }}
              >
                ESSAYER VINTBOOST
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
