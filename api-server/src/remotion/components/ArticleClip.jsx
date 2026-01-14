import React, { useEffect, useState } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Img, delayRender, continueRender } from 'remotion';
import { getTemplate } from '../config/templates';

/**
 * ArticleClip - Neo-Brutalism Style
 * - Bordures noires 3px
 * - Pas de coins arrondis
 * - Tailles texte moyennes (24-32px)
 * - Animation slide depuis le bas
 */
export const ArticleClip = ({ article, index, imageUrl, template = 'classic' }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [handle] = useState(() => delayRender(`Loading image ${index}`));

  const config = getTemplate(template).article;

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageLoaded(true);
      continueRender(handle);
    };
    img.onerror = () => {
      console.error(`Failed to load image: ${imageUrl}`);
      setImageLoaded(true);
      continueRender(handle);
    };
    img.src = imageUrl;
  }, [imageUrl, handle]);

  // Ken Burns effect - subtle zoom
  const imageScale = interpolate(
    frame,
    [0, durationInFrames],
    [1, 1.05],
    { extrapolateRight: 'clamp' }
  );

  // Slide in animation for info panel (from bottom)
  const slideProgress = spring({
    frame: frame - 5,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const slideY = interpolate(slideProgress, [0, 1], [120, 0]);

  // Price pop animation
  const priceScale = spring({
    frame: frame - 12,
    fps,
    config: { damping: 12, stiffness: 150 },
  });

  // Exit fade
  const exitOpacity = interpolate(
    frame,
    [durationInFrames - 8, durationInFrames],
    [1, 0],
    { extrapolateRight: 'clamp' }
  );

  // Article number fade in
  const numberOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#000000' }}>
      {/* Background image with Ken Burns effect */}
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
              backgroundColor: config.overlayBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontSize: 80, color: '#fff' }}>📷</span>
          </div>
        )}
      </AbsoluteFill>

      {/* Article number badge - Neo-Brutalism style */}
      <div
        style={{
          position: 'absolute',
          top: 30,
          left: 30,
          backgroundColor: config.priceBg,
          color: config.priceColor,
          fontSize: 28,
          fontWeight: 800,
          fontFamily: 'Inter, Arial, sans-serif',
          padding: '10px 18px',
          border: `${config.borderWidth}px solid ${config.borderColor}`,
          boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
          opacity: numberOpacity * exitOpacity,
        }}
      >
        {String(index + 1).padStart(2, '0')}
      </div>

      {/* Gradient overlay for text readability */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '50%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%)',
          opacity: exitOpacity,
        }}
      />

      {/* Info panel at bottom - No card, direct on image */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '0 24px 40px',
          transform: `translateY(${slideY}px)`,
          opacity: exitOpacity,
        }}
      >
        {/* Brand + Size row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
          {/* Brand tag */}
          {article.brand && (
            <div
              style={{
                backgroundColor: config.brandBg,
                color: config.brandColor,
                fontSize: 16,
                fontWeight: 700,
                fontFamily: 'Inter, Arial, sans-serif',
                padding: '5px 12px',
                border: `2px solid ${config.borderColor}`,
                boxShadow: '2px 2px 0px 0px rgba(0,0,0,1)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              {article.brand}
            </div>
          )}

          {/* Size tag */}
          {article.size && (
            <div
              style={{
                backgroundColor: 'rgba(255,255,255,0.9)',
                color: '#000000',
                fontSize: 14,
                fontWeight: 600,
                fontFamily: 'Inter, Arial, sans-serif',
                padding: '5px 10px',
                border: '2px solid #000000',
                boxShadow: '2px 2px 0px 0px rgba(0,0,0,1)',
                textTransform: 'uppercase',
              }}
            >
              {article.size}
            </div>
          )}
        </div>

        {/* Title */}
        {article.title && (
          <p
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: '#FFFFFF',
              fontFamily: 'Inter, Arial, sans-serif',
              margin: 0,
              marginBottom: 14,
              lineHeight: 1.3,
              maxWidth: '90%',
              textShadow: '1px 1px 3px rgba(0,0,0,0.8)',
            }}
          >
            {article.title.length > 40
              ? article.title.substring(0, 37) + '...'
              : article.title}
          </p>
        )}

        {/* Price - Neo-Brutalism style */}
        <div
          style={{
            display: 'inline-block',
            backgroundColor: config.priceBg,
            color: config.priceColor,
            fontSize: 28,
            fontWeight: 800,
            fontFamily: 'Inter, Arial, sans-serif',
            padding: '10px 24px',
            border: `${config.borderWidth}px solid ${config.borderColor}`,
            boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
            transform: `scale(${Math.max(0, priceScale)})`,
          }}
        >
          {article.price} €
        </div>
      </div>

      {/* Top accent bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 5,
          backgroundColor: config.accentColors[0],
          opacity: exitOpacity,
        }}
      />
    </AbsoluteFill>
  );
};

export default ArticleClip;
