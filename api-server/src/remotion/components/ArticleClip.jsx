import React, { useEffect, useState } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Img, delayRender, continueRender } from 'remotion';

const ACCENT_COLORS = [
  '#FF6B6B', // Rouge corail
  '#4ECDC4', // Turquoise
  '#FFE66D', // Jaune
  '#A855F7', // Violet
  '#EC4899', // Rose
  '#84CC16', // Lime
];

export const ArticleClip = ({ article, index, imageUrl }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [handle] = useState(() => delayRender(`Loading image ${index}`));

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

  const accentColor = ACCENT_COLORS[index % ACCENT_COLORS.length];

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
            background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%)',
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
          color: '#000',
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
              color: '#000',
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
              color: '#fff',
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
            backgroundColor: '#fff',
            color: '#000',
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
          backgroundColor: accentColor,
          opacity: exitOpacity,
        }}
      />
    </AbsoluteFill>
  );
};

export default ArticleClip;
