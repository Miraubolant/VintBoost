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

      {/* Info panel at bottom - Neo-Brutalism style */}
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
        {/* Info card with Neo-Brutalism border */}
        <div
          style={{
            backgroundColor: config.overlayBg,
            padding: '20px 24px',
            border: `${config.borderWidth}px solid ${config.borderColor}`,
            boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)',
          }}
        >
          {/* Brand + Size row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            {/* Brand tag */}
            {article.brand && (
              <div
                style={{
                  backgroundColor: config.brandBg,
                  color: config.brandColor,
                  fontSize: 18,
                  fontWeight: 700,
                  fontFamily: 'Inter, Arial, sans-serif',
                  padding: '6px 14px',
                  border: `2px solid ${config.borderColor}`,
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
                  backgroundColor: 'transparent',
                  color: config.sizeColor,
                  fontSize: 16,
                  fontWeight: 600,
                  fontFamily: 'Inter, Arial, sans-serif',
                  padding: '6px 12px',
                  border: `2px solid ${config.sizeColor}`,
                  textTransform: 'uppercase',
                }}
              >
                Taille {article.size}
              </div>
            )}
          </div>

          {/* Title - smaller for Neo-Brutalism */}
          {article.title && (
            <p
              style={{
                fontSize: 20,
                fontWeight: 500,
                color: config.titleColor,
                fontFamily: 'Inter, Arial, sans-serif',
                margin: 0,
                marginBottom: 16,
                lineHeight: 1.3,
                maxWidth: '90%',
              }}
            >
              {article.title.length > 45
                ? article.title.substring(0, 42) + '...'
                : article.title}
            </p>
          )}

          {/* Price - Neo-Brutalism style */}
          <div
            style={{
              display: 'inline-block',
              backgroundColor: config.priceBg,
              color: config.priceColor,
              fontSize: 32,
              fontWeight: 800,
              fontFamily: 'Inter, Arial, sans-serif',
              padding: '12px 28px',
              border: `${config.borderWidth}px solid ${config.borderColor}`,
              boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
              transform: `scale(${Math.max(0, priceScale)})`,
            }}
          >
            {article.price} €
          </div>
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
