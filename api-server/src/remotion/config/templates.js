/**
 * Configuration des templates de couleurs pour les vidéos
 */

const TEMPLATES = {
  // Template Classique - Couleurs VintBoost originales
  classic: {
    name: 'Classique',
    intro: {
      background: 'linear-gradient(135deg, #FFE66D 0%, #FF6B6B 100%)',
      cardBg: '#FFFFFF',
      textColor: '#1a1a2e',
      accentColor: '#4ECDC4',
      badgeBg: '#4ECDC4',
    },
    article: {
      accentColors: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#A855F7', '#EC4899', '#84CC16'],
      gradientOverlay: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%)',
      priceBg: '#FFFFFF',
      priceColor: '#000000',
      topBarColor: null, // Uses accent color
    },
    outro: {
      background: 'linear-gradient(135deg, #EC4899 0%, #A855F7 100%)',
      cardBg: '#FFFFFF',
      textColor: '#1a1a2e',
      ctaGradient: 'linear-gradient(135deg, #4ECDC4 0%, #FF6B6B 100%)',
      ctaTextColor: '#FFFFFF',
    },
    watermark: {
      bg: 'rgba(0,0,0,0.6)',
      textColor: '#FFFFFF',
    },
  },

  // Template Moderne - Style minimaliste et elegant
  modern: {
    name: 'Moderne',
    intro: {
      background: 'linear-gradient(180deg, #1D3354 0%, #467599 100%)',
      cardBg: '#FFFFFF',
      textColor: '#1D3354',
      accentColor: '#D64045',
      badgeBg: '#D64045',
    },
    article: {
      accentColors: ['#D64045', '#1D3354', '#9ED8DB', '#467599', '#E8DFD5', '#1D3354'],
      gradientOverlay: 'linear-gradient(to top, rgba(29,51,84,0.95) 0%, rgba(29,51,84,0) 100%)',
      priceBg: '#D64045',
      priceColor: '#FFFFFF',
      topBarColor: '#1D3354',
    },
    outro: {
      background: 'linear-gradient(180deg, #467599 0%, #1D3354 100%)',
      cardBg: '#FFFFFF',
      textColor: '#1D3354',
      ctaGradient: 'linear-gradient(135deg, #D64045 0%, #FF6B6B 100%)',
      ctaTextColor: '#FFFFFF',
    },
    watermark: {
      bg: 'rgba(29,51,84,0.8)',
      textColor: '#FFFFFF',
    },
  },

  // Template Premium - Style luxueux et dore
  premium: {
    name: 'Premium',
    intro: {
      background: 'linear-gradient(135deg, #0D0D0D 0%, #1a1a1a 50%, #2d2d2d 100%)',
      cardBg: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      textColor: '#D4AF37',
      accentColor: '#D4AF37',
      badgeBg: 'linear-gradient(135deg, #D4AF37 0%, #F4E4BA 50%, #D4AF37 100%)',
    },
    article: {
      accentColors: ['#D4AF37', '#C0C0C0', '#B76E79', '#8B4513', '#D4AF37', '#C0C0C0'],
      gradientOverlay: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0) 100%)',
      priceBg: 'linear-gradient(135deg, #D4AF37 0%, #F4E4BA 50%, #D4AF37 100%)',
      priceColor: '#0D0D0D',
      topBarColor: '#D4AF37',
    },
    outro: {
      background: 'linear-gradient(135deg, #1a1a1a 0%, #0D0D0D 100%)',
      cardBg: 'linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)',
      textColor: '#D4AF37',
      ctaGradient: 'linear-gradient(135deg, #D4AF37 0%, #F4E4BA 50%, #D4AF37 100%)',
      ctaTextColor: '#0D0D0D',
    },
    watermark: {
      bg: 'rgba(212,175,55,0.9)',
      textColor: '#0D0D0D',
    },
  },
};

/**
 * Obtenir la configuration d'un template
 */
function getTemplate(templateName) {
  return TEMPLATES[templateName] || TEMPLATES.classic;
}

/**
 * Obtenir la couleur d'accent pour un article
 */
function getAccentColor(templateName, index) {
  const template = getTemplate(templateName);
  const colors = template.article.accentColors;
  return colors[index % colors.length];
}

module.exports = {
  TEMPLATES,
  getTemplate,
  getAccentColor,
};
