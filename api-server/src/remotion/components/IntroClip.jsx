import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';

const COLORS = {
  primary: '#FF6B6B',
  secondary: '#4ECDC4',
  accent: '#FFE66D',
  dark: '#1a1a2e',
  white: '#FFFFFF',
  purple: '#A855F7',
  pink: '#EC4899',
};

export const IntroClip = ({ username }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animations
  const titleScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const titleY = interpolate(frame, [0, 20], [100, 0], {
    extrapolateRight: 'clamp',
  });

  const badgeScale = spring({
    frame: frame - 15,
    fps,
    config: { damping: 10, stiffness: 80 },
  });

  const opacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Decorative elements animation
  const decorScale = spring({
    frame: frame - 25,
    fps,
    config: { damping: 8, stiffness: 100 },
  });

  const displayName = username ? `@${username}` : 'MON VESTIAIRE';

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${COLORS.accent} 0%, ${COLORS.primary} 100%)`,
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Inter, Arial, sans-serif',
      }}
    >
      {/* Decorative circles */}
      <div
        style={{
          position: 'absolute',
          top: 100,
          left: 80,
          width: 120,
          height: 120,
          borderRadius: '50%',
          backgroundColor: COLORS.white,
          opacity: 0.2,
          transform: `scale(${decorScale})`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 150,
          right: 60,
          width: 180,
          height: 180,
          borderRadius: '50%',
          backgroundColor: COLORS.purple,
          opacity: 0.3,
          transform: `scale(${decorScale})`,
        }}
      />

      {/* Main content card */}
      <div
        style={{
          backgroundColor: COLORS.white,
          borderRadius: 24,
          padding: '60px 80px',
          boxShadow: '0 25px 80px rgba(0,0,0,0.3)',
          opacity,
          transform: `translateY(${titleY}px) scale(${titleScale})`,
          textAlign: 'center',
          maxWidth: 900,
        }}
      >
        {/* Username */}
        <h1
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: COLORS.dark,
            margin: 0,
            marginBottom: 30,
            textTransform: 'uppercase',
            letterSpacing: '-2px',
          }}
        >
          {displayName}
        </h1>

        {/* VINTED badge */}
        <div
          style={{
            display: 'inline-block',
            backgroundColor: COLORS.secondary,
            color: COLORS.dark,
            fontSize: 48,
            fontWeight: 700,
            padding: '20px 50px',
            borderRadius: 12,
            transform: `scale(${Math.max(0, badgeScale)})`,
            boxShadow: '0 8px 30px rgba(78, 205, 196, 0.4)',
          }}
        >
          VINTED
        </div>
      </div>

      {/* Bottom decorative bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 8,
          background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.purple}, ${COLORS.secondary})`,
        }}
      />
    </AbsoluteFill>
  );
};

export default IntroClip;
