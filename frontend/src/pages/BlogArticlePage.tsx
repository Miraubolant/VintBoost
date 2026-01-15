import { useEffect, useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { ArrowLeft, Clock, Calendar, User, ArrowRight, Share2, Twitter, Facebook, Linkedin, ChevronDown, Sparkles, BookOpen, Tag } from 'lucide-react'
import { getPostBySlug, blogPosts } from '../data/blogPosts'
import { Helmet } from 'react-helmet-async'
import ReactMarkdown from 'react-markdown'

// VintBoost Color Palette
const COLORS = {
  navy: '#1D3354',
  red: '#D64045',
  cyan: '#9ED8DB',
  cream: '#E8DFD5',
  white: '#FFFFFF',
}

// FAQ Accordion Component
function FAQAccordion({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-2 border-black overflow-hidden mb-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between text-left font-display font-bold text-sm"
        style={{ backgroundColor: isOpen ? COLORS.cyan : COLORS.white }}
      >
        <span>{question}</span>
        <ChevronDown
          className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="px-4 py-3 border-t-2 border-black bg-white">
          <p className="text-sm font-body text-black/80 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  )
}

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
    .slice(0, 3)

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

  // Extract FAQ from content if exists
  const extractFAQs = (content: string): { question: string; answer: string }[] => {
    const faqSection = content.match(/## FAQ[\s\S]*?(?=##|$)/i) ||
                       content.match(/## Questions frequentes[\s\S]*?(?=##|$)/i)
    if (!faqSection) return []

    const faqText = faqSection[0]
    const faqs: { question: string; answer: string }[] = []
    const faqMatches = faqText.matchAll(/\*\*(.+?)\*\*\s*\n+([^*]+?)(?=\*\*|$)/g)

    for (const match of faqMatches) {
      faqs.push({
        question: match[1].trim(),
        answer: match[2].trim()
      })
    }

    return faqs
  }

  const faqs = extractFAQs(post.content)

  return (
    <>
      <Helmet>
        <title>{post.title} | VintBoost</title>
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

      <div className="min-h-screen" style={{ backgroundColor: COLORS.cream }}>
        {/* Hero Section with Image */}
        <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[450px] overflow-hidden">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          {/* Overlay */}
          <div
            className="absolute inset-0"
            style={{ backgroundColor: 'rgba(29, 51, 84, 0.75)' }}
          />

          {/* Content over hero */}
          <div className="absolute inset-0 flex flex-col justify-center items-center px-4">
            {/* Back button */}
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 px-3 py-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all font-display font-bold text-xs"
                style={{ backgroundColor: COLORS.white }}
              >
                <ArrowLeft className="w-4 h-4" />
                RETOUR AU BLOG
              </Link>
            </div>

            {/* Category Badge */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mb-4"
              style={{ backgroundColor: COLORS.red }}
            >
              <BookOpen className="w-4 h-4 text-white" />
              <span className="font-display font-bold text-xs text-white">{post.category}</span>
            </div>

            {/* Title */}
            <h1 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-white text-center max-w-4xl leading-tight px-4">
              {post.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-sm text-white/80">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span className="font-body">{post.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span className="font-body">{formatDate(post.publishedAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span className="font-body">{post.readTime} de lecture</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 -mt-8 relative z-10 pb-12">
          {/* Introduction Card */}
          <div
            className="border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-5 sm:p-6 mb-8"
            style={{ backgroundColor: COLORS.cyan }}
          >
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 border-2 border-black flex items-center justify-center shrink-0"
                style={{ backgroundColor: COLORS.white }}
              >
                <Sparkles className="w-5 h-5" style={{ color: COLORS.navy }} />
              </div>
              <div>
                <h2 className="font-display font-bold text-lg mb-2" style={{ color: COLORS.navy }}>
                  En bref
                </h2>
                <p className="text-sm sm:text-base font-body leading-relaxed" style={{ color: COLORS.navy }}>
                  {post.excerpt}
                </p>
              </div>
            </div>
          </div>

          {/* Tags Section */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <Tag className="w-4 h-4" style={{ color: COLORS.navy }} />
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs font-display font-bold border-2 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                style={{ backgroundColor: COLORS.white }}
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Article Content */}
          <div
            className="border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden mb-8"
            style={{ backgroundColor: COLORS.white }}
          >
            {/* Content Header Bar */}
            <div
              className="px-4 sm:px-6 py-3 border-b-4 border-black flex items-center gap-2"
              style={{ backgroundColor: COLORS.navy }}
            >
              <BookOpen className="w-5 h-5 text-white" />
              <span className="font-display font-bold text-sm text-white">ARTICLE COMPLET</span>
            </div>

            {/* Content Body */}
            <div className="p-5 sm:p-8">
              <div className="prose prose-lg max-w-none font-body text-black/80">
                <ReactMarkdown
                  components={{
                    h2: ({ children }) => (
                      <h2
                        className="font-display font-bold text-xl sm:text-2xl mt-10 mb-4 pb-3 border-b-4 border-black"
                        style={{ color: COLORS.navy }}
                      >
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3
                        className="font-display font-bold text-lg sm:text-xl mt-8 mb-3"
                        style={{ color: COLORS.navy }}
                      >
                        {children}
                      </h3>
                    ),
                    p: ({ children }) => (
                      <p className="mb-4 leading-relaxed text-black/80">{children}</p>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-none pl-0 mb-4 space-y-2">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal pl-6 mb-4 space-y-2">{children}</ol>
                    ),
                    li: ({ children }) => (
                      <li className="leading-relaxed flex items-start gap-2">
                        <span
                          className="inline-block w-2 h-2 mt-2 shrink-0 border border-black"
                          style={{ backgroundColor: COLORS.red }}
                        />
                        <span>{children}</span>
                      </li>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-bold" style={{ color: COLORS.navy }}>{children}</strong>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote
                        className="border-l-4 pl-4 my-6 py-2"
                        style={{ borderColor: COLORS.navy, backgroundColor: `${COLORS.cyan}40` }}
                      >
                        <div className="italic text-black/70">{children}</div>
                      </blockquote>
                    ),
                    a: ({ href, children }) => (
                      <a
                        href={href}
                        className="font-semibold underline decoration-2 hover:no-underline transition-all"
                        style={{ color: COLORS.navy, textDecorationColor: COLORS.red }}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {children}
                      </a>
                    ),
                    hr: () => (
                      <hr className="my-8 border-t-2 border-black/20" />
                    ),
                  }}
                >
                  {post.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>

          {/* FAQ Section if exists */}
          {faqs.length > 0 && (
            <div className="mb-8">
              <div
                className="border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
                style={{ backgroundColor: COLORS.white }}
              >
                <div
                  className="px-4 sm:px-6 py-3 border-b-4 border-black"
                  style={{ backgroundColor: COLORS.cyan }}
                >
                  <h2 className="font-display font-bold text-lg" style={{ color: COLORS.navy }}>
                    Questions Fréquentes
                  </h2>
                </div>
                <div className="p-4 sm:p-6">
                  {faqs.map((faq, index) => (
                    <FAQAccordion key={index} question={faq.question} answer={faq.answer} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Share Section */}
          <div
            className="border-3 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8"
            style={{ backgroundColor: COLORS.white }}
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5" style={{ color: COLORS.navy }} />
                <span className="font-display font-bold text-sm" style={{ color: COLORS.navy }}>
                  PARTAGER CET ARTICLE
                </span>
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
              <h2
                className="font-display font-bold text-xl sm:text-2xl mb-6 pb-3 border-b-4 border-black"
                style={{ color: COLORS.navy }}
              >
                Articles similaires
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    to={`/blog/${relatedPost.slug}`}
                    className="border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 group"
                    style={{ backgroundColor: COLORS.white }}
                  >
                    <div className="h-36 overflow-hidden border-b-3 border-black">
                      <img
                        src={relatedPost.imageUrl}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4">
                      <span
                        className="inline-block px-2 py-0.5 text-[10px] font-display font-bold border border-black mb-2"
                        style={{ backgroundColor: COLORS.cyan }}
                      >
                        {relatedPost.category}
                      </span>
                      <h3
                        className="font-display font-bold text-sm group-hover:underline line-clamp-2 mb-2"
                        style={{ color: COLORS.navy }}
                      >
                        {relatedPost.title}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-black/50">
                        <Clock className="w-3 h-3" />
                        <span className="font-body">{relatedPost.readTime}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* CTA Section */}
          <div
            className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
            style={{ backgroundColor: COLORS.navy }}
          >
            <div className="p-6 sm:p-10 text-center">
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mb-6"
                style={{ backgroundColor: COLORS.red }}
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span className="font-display font-bold text-xs text-white">GRATUIT</span>
              </div>

              <h3 className="font-display font-bold text-2xl sm:text-3xl text-white mb-4">
                Prêt à booster tes ventes Vinted ?
              </h3>
              <p className="font-body text-base text-white/80 mb-6 max-w-lg mx-auto">
                Crée des vidéos professionnelles de tes articles en 30 secondes avec VintBoost.
                Ta première vidéo est gratuite !
              </p>

              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-4 border-3 border-black font-display font-bold text-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
                style={{ backgroundColor: COLORS.white, color: COLORS.navy }}
              >
                ESSAYER VINTBOOST GRATUITEMENT
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
