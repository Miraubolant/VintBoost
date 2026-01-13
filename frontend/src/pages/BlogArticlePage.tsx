import { useEffect } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { ArrowLeft, Clock, Calendar, User, ArrowRight, Share2, Twitter, Facebook, Linkedin } from 'lucide-react'
import { getPostBySlug, blogPosts } from '../data/blogPosts'
import { Helmet } from 'react-helmet-async'
import ReactMarkdown from 'react-markdown'

export function BlogArticlePage() {
  const { slug } = useParams<{ slug: string }>()
  const post = slug ? getPostBySlug(slug) : undefined

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  if (!post) {
    return <Navigate to="/blog" replace />
  }

  const shareUrl = `https://vintboost.com/blog/${post.slug}`
  const shareText = post.title

  const handleShare = (platform: string) => {
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    }
    window.open(urls[platform], '_blank', 'width=600,height=400')
  }

  // Get related posts (same category, excluding current)
  const relatedPosts = blogPosts
    .filter(p => p.category === post.category && p.id !== post.id)
    .slice(0, 2)

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  // JSON-LD Schema for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.metaDescription,
    image: post.imageUrl,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      '@type': 'Organization',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'VintBoost',
      logo: {
        '@type': 'ImageObject',
        url: 'https://vintboost.com/logo-120.svg',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': shareUrl,
    },
  }

  return (
    <>
      <Helmet>
        <title>{post.title} | Blog VintBoost</title>
        <meta name="description" content={post.metaDescription} />
        <meta name="keywords" content={post.tags.join(', ')} />
        <link rel="canonical" href={shareUrl} />

        {/* Open Graph */}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.metaDescription} />
        <meta property="og:image" content={post.imageUrl} />
        <meta property="og:url" content={shareUrl} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={post.publishedAt} />
        <meta property="article:author" content={post.author} />
        <meta property="article:tag" content={post.tags.join(', ')} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.metaDescription} />
        <meta name="twitter:image" content={post.imageUrl} />

        {/* JSON-LD */}
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="min-h-screen py-8 px-4" style={{ backgroundColor: '#E8DFD5' }}>
        <article className="max-w-3xl mx-auto">
          {/* Back button */}
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 mb-6 px-3 py-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all font-display font-bold text-xs"
            style={{ backgroundColor: '#FFFFFF' }}
          >
            <ArrowLeft className="w-4 h-4" />
            RETOUR AU BLOG
          </Link>

          {/* Header Image */}
          <div className="border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden mb-6">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-64 sm:h-80 object-cover"
            />
          </div>

          {/* Article Header */}
          <header className="mb-8">
            {/* Category */}
            <div className="flex items-center gap-3 mb-4">
              <span
                className="px-3 py-1 text-xs font-display font-bold border-2 border-black text-white"
                style={{ backgroundColor: '#D64045' }}
              >
                {post.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-black mb-4 leading-tight">
              {post.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-black/60 font-body">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.publishedAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{post.readTime} de lecture</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs font-body border border-black/20 bg-white"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </header>

          {/* Article Content */}
          <div
            className="border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6 sm:p-8 mb-8"
            style={{ backgroundColor: '#FFFFFF' }}
          >
            <div className="prose prose-lg max-w-none font-body text-black/80">
              <ReactMarkdown
                components={{
                  h2: ({ children }) => (
                    <h2 className="font-display font-bold text-xl sm:text-2xl text-black mt-8 mb-4 pb-2 border-b-2 border-black/10">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="font-display font-bold text-lg sm:text-xl text-black mt-6 mb-3">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="mb-4 leading-relaxed">{children}</p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal pl-6 mb-4 space-y-2">{children}</ol>
                  ),
                  li: ({ children }) => (
                    <li className="leading-relaxed">{children}</li>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-bold text-black">{children}</strong>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-black pl-4 italic my-4 text-black/70">
                      {children}
                    </blockquote>
                  ),
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      className="underline hover:no-underline"
                      style={{ color: '#1D3354' }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {children}
                    </a>
                  ),
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </div>

          {/* Share Section */}
          <div className="border-3 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8" style={{ backgroundColor: '#FFFFFF' }}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5" />
                <span className="font-display font-bold text-sm">PARTAGER CET ARTICLE</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleShare('twitter')}
                  className="w-10 h-10 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all"
                  style={{ backgroundColor: '#1DA1F2' }}
                  aria-label="Partager sur Twitter"
                >
                  <Twitter className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={() => handleShare('facebook')}
                  className="w-10 h-10 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all"
                  style={{ backgroundColor: '#4267B2' }}
                  aria-label="Partager sur Facebook"
                >
                  <Facebook className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={() => handleShare('linkedin')}
                  className="w-10 h-10 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all"
                  style={{ backgroundColor: '#0077B5' }}
                  aria-label="Partager sur LinkedIn"
                >
                  <Linkedin className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Related Articles */}
          {relatedPosts.length > 0 && (
            <section className="mb-8">
              <h2 className="font-display font-bold text-xl mb-4 text-black">Articles similaires</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    to={`/blog/${relatedPost.slug}`}
                    className="border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] overflow-hidden hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 group"
                    style={{ backgroundColor: '#FFFFFF' }}
                  >
                    <div className="h-32 overflow-hidden border-b-2 border-black">
                      <img
                        src={relatedPost.imageUrl}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-display font-bold text-sm text-black group-hover:underline line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      <div className="flex items-center gap-1 mt-2 text-xs text-black/50">
                        <Clock className="w-3 h-3" />
                        <span>{relatedPost.readTime}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* CTA */}
          <div className="border-4 border-black p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]" style={{ backgroundColor: '#1D3354' }}>
            <div className="text-center">
              <h3 className="font-display font-bold text-xl sm:text-2xl text-white mb-3">
                Prêt à booster tes ventes Vinted ?
              </h3>
              <p className="font-body text-sm text-white/80 mb-4 max-w-md mx-auto">
                Crée des vidéos professionnelles en 30 secondes avec VintBoost !
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
        </article>
      </div>
    </>
  )
}
