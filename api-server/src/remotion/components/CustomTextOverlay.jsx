import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';

export const CustomTextOverlay = ({ text, template = 'classic' }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  if (!text || text.trim() === '') {
    return null;
  }

  // Configuration du texte selon le template
  const textStyles = {
    classic: {
      bg: 'rgba(255,255,255,0.95)',
      textColor: '#1a1a2e',
      borderColor: '#FF6B6B',
    },
    modern: {
      bg: 'rgba(29,51,84,0.95)',
      textColor: '#FFFFFF',
      borderColor: '#D64045',
    },
    premium: {
      bg: 'rgba(0,0,0,0.9)',
      textColor: '#D4AF37',
      borderColor: '#D4AF37',
    },
  };

  const style = textStyles[template] || textStyles.classic;

  // Animation d'entree avec spring
  const slideIn = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  // Animation de sortie
  const exitOpacity = interpolate(
    frame,
    [durationInFrames - 30, durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const translateY = interpolate(slideIn, [0, 1], [50, 0]);

  return (
    <div
      style={{
        position: 'absolute',
        top: 60,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        zIndex: 900,
        opacity: exitOpacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      <div
        style={{
          backgroundColor: style.bg,
          color: style.textColor,
          fontSize: 28,
          fontWeight: 700,
          fontFamily: 'Inter, Arial, sans-serif',
          padding: '16px 32px',
          borderRadius: 12,
          borderLeft: `4px solid ${style.borderColor}`,
          maxWidth: '80%',
          textAlign: 'center',
          boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
          lineHeight: 1.3,
        }}
      >
        {text}
      </div>
    </div>
  );
};

export default CustomTextOverlay;
