/**
 * Configuration des templates Neo-Brutalism pour les vidéos
 * Style: Bordures noires épaisses, couleurs vives, pas de coins arrondis
 */

const TEMPLATES = {
  // Template Classique - Navy #1D3354
  classic: {
    name: 'Classique',
    intro: {
      background: '#1D3354',
      cardBg: '#FFFFFF',
      textColor: '#1D3354',
      accentColor: '#9ED8DB',
      borderColor: '#000000',
      borderWidth: 3,
    },
    article: {
      accentColors: ['#9ED8DB', '#1D3354', '#FFFFFF'],
      overlayBg: '#1D3354',
      overlayOpacity: 0.95,
      priceBg: '#FFFFFF',
      priceColor: '#1D3354',
      brandBg: '#9ED8DB',
      brandColor: '#000000',
      titleColor: '#FFFFFF',
      sizeColor: '#9ED8DB',
      borderColor: '#000000',
      borderWidth: 3,
    },
    outro: {
      background: '#1D3354',
      cardBg: '#FFFFFF',
      textColor: '#1D3354',
      ctaBg: '#D64045',
      ctaTextColor: '#FFFFFF',
      borderColor: '#000000',
      borderWidth: 3,
    },
    watermark: {
      bg: 'rgba(29,51,84,0.9)',
      textColor: '#FFFFFF',
      borderColor: '#000000',
    },
  },

  // Template Moderne - Cyan #9ED8DB (style frais)
  modern: {
    name: 'Moderne',
    intro: {
      background: '#9ED8DB',
      cardBg: '#FFFFFF',
      textColor: '#1D3354',
      accentColor: '#1D3354',
      borderColor: '#000000',
      borderWidth: 3,
    },
    article: {
      accentColors: ['#1D3354', '#9ED8DB', '#FFFFFF'],
      overlayBg: '#FFFFFF',
      overlayOpacity: 0.95,
      priceBg: '#1D3354',
      priceColor: '#FFFFFF',
      brandBg: '#9ED8DB',
      brandColor: '#000000',
      titleColor: '#1D3354',
      sizeColor: '#1D3354',
      borderColor: '#000000',
      borderWidth: 3,
    },
    outro: {
      background: '#9ED8DB',
      cardBg: '#FFFFFF',
      textColor: '#1D3354',
      ctaBg: '#D64045',
      ctaTextColor: '#FFFFFF',
      borderColor: '#000000',
      borderWidth: 3,
    },
    watermark: {
      bg: 'rgba(158,216,219,0.9)',
      textColor: '#1D3354',
      borderColor: '#000000',
    },
  },

  // Template Premium - Rouge #D64045
  premium: {
    name: 'Premium',
    intro: {
      background: '#D64045',
      cardBg: '#FFFFFF',
      textColor: '#D64045',
      accentColor: '#FFFFFF',
      borderColor: '#000000',
      borderWidth: 3,
    },
    article: {
      accentColors: ['#D64045', '#FFFFFF', '#1D3354'],
      overlayBg: '#D64045',
      overlayOpacity: 0.95,
      priceBg: '#FFFFFF',
      priceColor: '#D64045',
      brandBg: '#FFFFFF',
      brandColor: '#D64045',
      titleColor: '#FFFFFF',
      sizeColor: '#FFFFFF',
      borderColor: '#000000',
      borderWidth: 3,
    },
    outro: {
      background: '#D64045',
      cardBg: '#FFFFFF',
      textColor: '#D64045',
      ctaBg: '#1D3354',
      ctaTextColor: '#FFFFFF',
      borderColor: '#000000',
      borderWidth: 3,
    },
    watermark: {
      bg: 'rgba(214,64,69,0.9)',
      textColor: '#FFFFFF',
      borderColor: '#000000',
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
