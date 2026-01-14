import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { getTemplate } from '../config/templates';

/**
 * IntroClip - Neo-Brutalism Style
 * - Bordures noires épaisses
 * - Pas de coins arrondis
 * - Ombres décalées
 * - Texte personnalisé mis en avant
 */
export const IntroClip = ({ username, template = 'classic', customText = '' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const config = getTemplate(template).intro;

  // Animations
  const cardScale = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const cardY = interpolate(frame, [0, 15], [80, 0], {
    extrapolateRight: 'clamp',
  });

  const opacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Custom text slide from bottom
  const customTextSlide = spring({
    frame: frame - 20,
    fps,
    config: { damping: 12, stiffness: 80 },
  });

  const customTextY = interpolate(customTextSlide, [0, 1], [60, 0]);

  // Decorative elements
  const decorScale = spring({
    frame: frame - 10,
    fps,
    config: { damping: 10, stiffness: 120 },
  });

  const displayName = username ? `@${username}` : 'MON DRESSING';

  return (
    <AbsoluteFill
      style={{
        backgroundColor: config.background,
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Inter, Arial, sans-serif',
      }}
    >
      {/* Decorative squares - Neo-Brutalism */}
      <div
        style={{
          position: 'absolute',
          top: 80,
          left: 40,
          width: 60,
          height: 60,
          backgroundColor: config.accentColor,
          border: `${config.borderWidth}px solid ${config.borderColor}`,
          transform: `scale(${decorScale}) rotate(12deg)`,
          boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 120,
          right: 50,
          width: 80,
          height: 80,
          backgroundColor: config.cardBg,
          border: `${config.borderWidth}px solid ${config.borderColor}`,
          transform: `scale(${decorScale}) rotate(-8deg)`,
          boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 200,
          right: 80,
          width: 40,
          height: 40,
          backgroundColor: config.accentColor,
          border: `${config.borderWidth}px solid ${config.borderColor}`,
          transform: `scale(${decorScale}) rotate(20deg)`,
          boxShadow: '3px 3px 0px 0px rgba(0,0,0,1)',
        }}
      />

      {/* Main content card - Neo-Brutalism */}
      <div
        style={{
          backgroundColor: config.cardBg,
          padding: '50px 70px',
          border: `${config.borderWidth}px solid ${config.borderColor}`,
          boxShadow: '10px 10px 0px 0px rgba(0,0,0,1)',
          opacity,
          transform: `translateY(${cardY}px) scale(${cardScale})`,
          textAlign: 'center',
          maxWidth: 800,
        }}
      >
        {/* Username */}
        <h1
          style={{
            fontSize: 52,
            fontWeight: 800,
            color: config.textColor,
            margin: 0,
            marginBottom: 24,
            textTransform: 'uppercase',
            letterSpacing: '-1px',
          }}
        >
          {displayName}
        </h1>

        {/* VINTED badge - Neo-Brutalism */}
        <div
          style={{
            display: 'inline-block',
            backgroundColor: config.accentColor,
            color: config.textColor,
            fontSize: 36,
            fontWeight: 800,
            padding: '14px 40px',
            border: `${config.borderWidth}px solid ${config.borderColor}`,
            boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)',
          }}
        >
          VINTED
        </div>
      </div>

      {/* Custom text / Accroche - Neo-Brutalism */}
      {customText && customText.trim() !== '' && (
        <div
          style={{
            position: 'absolute',
            bottom: 60,
            left: 30,
            right: 30,
            display: 'flex',
            justifyContent: 'center',
            transform: `translateY(${customTextY}px)`,
            opacity: Math.max(0, customTextSlide),
          }}
        >
          <div
            style={{
              backgroundColor: config.cardBg,
              color: config.textColor,
              fontSize: 24,
              fontWeight: 700,
              padding: '16px 32px',
              border: `${config.borderWidth}px solid ${config.borderColor}`,
              boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)',
              maxWidth: '85%',
              textAlign: 'center',
            }}
          >
            {customText}
          </div>
        </div>
      )}

      {/* Top accent bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 6,
          backgroundColor: config.accentColor,
        }}
      />
    </AbsoluteFill>
  );
};

export default IntroClip;
