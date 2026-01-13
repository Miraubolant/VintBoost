import React, { useEffect, useState } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Img, delayRender, continueRender } from 'remotion';

// Template configurations for article clips
const TEMPLATE_CONFIGS = {
  classic: {
    accentColors: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#A855F7', '#EC4899', '#84CC16'],
    gradientOverlay: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%)',
    priceBg: '#FFFFFF',
    priceColor: '#000000',
    brandTextColor: '#000000',
    titleColor: '#FFFFFF',
    badgeColor: '#000000',
    topBarColor: null, // Uses accent color
  },
  modern: {
    accentColors: ['#D64045', '#1D3354', '#9ED8DB', '#467599', '#E8DFD5', '#1D3354'],
    gradientOverlay: 'linear-gradient(to top, rgba(29,51,84,0.95) 0%, rgba(29,51,84,0) 100%)',
    priceBg: '#D64045',
    priceColor: '#FFFFFF',
    brandTextColor: '#FFFFFF',
    titleColor: '#FFFFFF',
    badgeColor: '#FFFFFF',
    topBarColor: '#1D3354',
  },
  premium: {
    accentColors: ['#D4AF37', '#C0C0C0', '#B76E79', '#8B4513', '#D4AF37', '#C0C0C0'],
    gradientOverlay: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0) 100%)',
    priceBg: 'linear-gradient(135deg, #D4AF37 0%, #F4E4BA 50%, #D4AF37 100%)',
    priceColor: '#0D0D0D',
    brandTextColor: '#0D0D0D',
    titleColor: '#F4E4BA',
    badgeColor: '#0D0D0D',
    topBarColor: '#D4AF37',
  },
};

export const ArticleClip = ({ article, index, imageUrl, template = 'classic' }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [handle] = useState(() => delayRender(`Loading image ${index}`));

  const config = TEMPLATE_CONFIGS[template] || TEMPLATE_CONFIGS.classic;

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageLoaded(true);
      continueRender(handle);
    };
    img.onerror = () => {
      console.error(`Failed to load image: ${imageUrl}`);
      setImageLoaded(true); // Continue anyway
      continueRender(handle);
    };
    img.src = imageUrl;
  }, [imageUrl, handle]);

  const accentColor = config.accentColors[index % config.accentColors.length];

  // Entry animations
  const slideIn = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  const imageScale = interpolate(
    frame,
    [0, durationInFrames],
    [1, 1.08],
    { extrapolateRight: 'clamp' }
  );

  const infoSlide = spring({
    frame: frame - 8,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const priceScale = spring({
    frame: frame - 15,
    fps,
    config: { damping: 10, stiffness: 120 },
  });

  const numberOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Exit animation
  const exitOpacity = interpolate(
    frame,
    [durationInFrames - 10, durationInFrames],
    [1, 0],
    { extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0a0a' }}>
      {/* Background image with zoom effect */}
      <AbsoluteFill style={{ opacity: exitOpacity }}>
        {imageLoaded && imageUrl ? (
          <Img
            src={imageUrl}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: `scale(${imageScale})`,
            }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: accentColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontSize: 100, color: '#fff' }}>📷</span>
          </div>
        )}

        {/* Gradient overlay for text readability */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '50%',
            background: config.gradientOverlay,
          }}
        />
      </AbsoluteFill>

      {/* Article number badge */}
      <div
        style={{
          position: 'absolute',
          top: 40,
          left: 40,
          backgroundColor: accentColor,
          color: config.badgeColor,
          fontSize: 36,
          fontWeight: 800,
          fontFamily: 'Inter, Arial, sans-serif',
          padding: '15px 25px',
          borderRadius: 12,
          opacity: numberOpacity * exitOpacity,
          boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
        }}
      >
        {String(index + 1).padStart(2, '0')}
      </div>

      {/* Info panel at bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '0 40px 50px',
          transform: `translateY(${(1 - Math.max(0, infoSlide)) * 100}px)`,
          opacity: exitOpacity,
        }}
      >
        {/* Brand tag */}
        {article.brand && (
          <div
            style={{
              display: 'inline-block',
              backgroundColor: accentColor,
              color: config.brandTextColor,
              fontSize: 28,
              fontWeight: 700,
              fontFamily: 'Inter, Arial, sans-serif',
              padding: '10px 24px',
              borderRadius: 8,
              marginBottom: 16,
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            {article.brand}
          </div>
        )}

        {/* Title */}
        {article.title && (
          <h2
            style={{
              fontSize: 38,
              fontWeight: 600,
              color: config.titleColor,
              fontFamily: 'Inter, Arial, sans-serif',
              margin: 0,
              marginBottom: 20,
              textShadow: '0 2px 10px rgba(0,0,0,0.5)',
              maxWidth: '80%',
              lineHeight: 1.2,
            }}
          >
            {article.title.length > 50
              ? article.title.substring(0, 47) + '...'
              : article.title}
          </h2>
        )}

        {/* Price */}
        <div
          style={{
            display: 'inline-block',
            background: config.priceBg,
            color: config.priceColor,
            fontSize: 56,
            fontWeight: 800,
            fontFamily: 'Inter, Arial, sans-serif',
            padding: '18px 40px',
            borderRadius: 16,
            transform: `scale(${Math.max(0, priceScale)})`,
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
          }}
        >
          {article.price} EUR
        </div>
      </div>

      {/* Top accent bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 6,
          backgroundColor: config.topBarColor || accentColor,
          opacity: exitOpacity,
        }}
      />
    </AbsoluteFill>
  );
};

export default ArticleClip;
