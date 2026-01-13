import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

export const Watermark = ({ template = 'classic' }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  // Configuration du watermark selon le template
  const watermarkStyles = {
    classic: {
      bg: 'rgba(0,0,0,0.6)',
      textColor: '#FFFFFF',
    },
    modern: {
      bg: 'rgba(29,51,84,0.8)',
      textColor: '#FFFFFF',
    },
    premium: {
      bg: 'rgba(212,175,55,0.9)',
      textColor: '#0D0D0D',
    },
  };

  const style = watermarkStyles[template] || watermarkStyles.classic;

  // Animation subtile du watermark
  const opacity = interpolate(
    frame,
    [0, fps * 0.5, durationInFrames - fps * 0.5, durationInFrames],
    [0, 0.9, 0.9, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: style.bg,
        color: style.textColor,
        fontSize: 14,
        fontWeight: 700,
        fontFamily: 'Inter, Arial, sans-serif',
        padding: '8px 16px',
        borderRadius: 6,
        opacity,
        zIndex: 1000,
        letterSpacing: '0.5px',
        textTransform: 'uppercase',
      }}
    >
      VINTBOOST.COM
    </div>
  );
};

export default Watermark;
