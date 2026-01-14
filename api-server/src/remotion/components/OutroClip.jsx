import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { getTemplate } from '../config/templates';

/**
 * OutroClip - Neo-Brutalism Style
 * - Bordures noires épaisses
 * - Pas de coins arrondis
 * - Ombres décalées
 * - CTA "Disponible sur Vinted"
 */
export const OutroClip = ({ username, template = 'classic' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const config = getTemplate(template).outro;

  // Card animation
  const cardScale = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const cardY = interpolate(frame, [0, 15], [60, 0], {
    extrapolateRight: 'clamp',
  });

  const opacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // CTA button animation
  const ctaScale = spring({
    frame: frame - 15,
    fps,
    config: { damping: 12, stiffness: 120 },
  });

  // Decorative elements
  const decorScale = spring({
    frame: frame - 8,
    fps,
    config: { damping: 10, stiffness: 100 },
  });

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
          top: 100,
          right: 60,
          width: 70,
          height: 70,
          backgroundColor: config.cardBg,
          border: `${config.borderWidth}px solid ${config.borderColor}`,
          transform: `scale(${decorScale}) rotate(-10deg)`,
          boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 140,
          left: 50,
          width: 50,
          height: 50,
          backgroundColor: config.ctaBg,
          border: `${config.borderWidth}px solid ${config.borderColor}`,
          transform: `scale(${decorScale}) rotate(15deg)`,
          boxShadow: '3px 3px 0px 0px rgba(0,0,0,1)',
        }}
      />

      {/* Main card - Neo-Brutalism */}
      <div
        style={{
          backgroundColor: config.cardBg,
          padding: '45px 60px',
          border: `${config.borderWidth}px solid ${config.borderColor}`,
          boxShadow: '10px 10px 0px 0px rgba(0,0,0,1)',
          transform: `translateY(${cardY}px) scale(${cardScale})`,
          textAlign: 'center',
          maxWidth: 750,
          opacity,
        }}
      >
        {/* Main text */}
        <h1
          style={{
            fontSize: 42,
            fontWeight: 800,
            color: config.textColor,
            margin: 0,
            marginBottom: 24,
            textTransform: 'uppercase',
          }}
        >
          DISPONIBLE
        </h1>

        {/* CTA Button - Neo-Brutalism */}
        <div
          style={{
            display: 'inline-block',
            backgroundColor: config.ctaBg,
            color: config.ctaTextColor,
            fontSize: 36,
            fontWeight: 800,
            padding: '16px 44px',
            border: `${config.borderWidth}px solid ${config.borderColor}`,
            boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)',
            transform: `scale(${Math.max(0, ctaScale)})`,
          }}
        >
          SUR VINTED !
        </div>

        {/* Username */}
        {username && (
          <p
            style={{
              fontSize: 28,
              color: config.textColor,
              marginTop: 28,
              marginBottom: 0,
              fontWeight: 700,
              opacity,
            }}
          >
            @{username}
          </p>
        )}
      </div>

      {/* Top accent bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 6,
          backgroundColor: config.ctaBg,
        }}
      />

      {/* Bottom accent bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 6,
          backgroundColor: config.ctaBg,
        }}
      />
    </AbsoluteFill>
  );
};

export default OutroClip;
