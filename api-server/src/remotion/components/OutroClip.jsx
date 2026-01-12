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

export const OutroClip = ({ username }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const textOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const badgeScale = spring({
    frame: frame - 20,
    fps,
    config: { damping: 10, stiffness: 80 },
  });

  const pulseScale = interpolate(
    frame % 30,
    [0, 15, 30],
    [1, 1.05, 1],
    { extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${COLORS.pink} 0%, ${COLORS.purple} 100%)`,
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Inter, Arial, sans-serif',
      }}
    >
      {/* Animated background circles */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: 200,
          height: 200,
          borderRadius: '50%',
          backgroundColor: COLORS.white,
          opacity: 0.1,
          transform: `scale(${pulseScale})`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '25%',
          right: '15%',
          width: 150,
          height: 150,
          borderRadius: '50%',
          backgroundColor: COLORS.accent,
          opacity: 0.2,
          transform: `scale(${pulseScale})`,
        }}
      />

      {/* Main card */}
      <div
        style={{
          backgroundColor: COLORS.white,
          borderRadius: 24,
          padding: '50px 70px',
          boxShadow: '0 30px 100px rgba(0,0,0,0.4)',
          transform: `scale(${cardScale})`,
          textAlign: 'center',
          maxWidth: 850,
        }}
      >
        {/* Main text */}
        <h1
          style={{
            fontSize: 52,
            fontWeight: 700,
            color: COLORS.dark,
            margin: 0,
            marginBottom: 20,
            opacity: textOpacity,
          }}
        >
          RETROUVE-MOI
        </h1>

        {/* CTA Badge */}
        <div
          style={{
            display: 'inline-block',
            background: `linear-gradient(135deg, ${COLORS.secondary} 0%, ${COLORS.primary} 100%)`,
            color: COLORS.white,
            fontSize: 44,
            fontWeight: 800,
            padding: '22px 50px',
            borderRadius: 16,
            transform: `scale(${Math.max(0, badgeScale)})`,
            boxShadow: '0 12px 40px rgba(78, 205, 196, 0.5)',
          }}
        >
          SUR VINTED!
        </div>

        {/* Username if available */}
        {username && (
          <p
            style={{
              fontSize: 32,
              color: COLORS.purple,
              marginTop: 30,
              marginBottom: 0,
              fontWeight: 600,
              opacity: textOpacity,
            }}
          >
            @{username}
          </p>
        )}
      </div>

      {/* Bottom gradient bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 8,
          background: `linear-gradient(90deg, ${COLORS.accent}, ${COLORS.secondary}, ${COLORS.primary})`,
        }}
      />
    </AbsoluteFill>
  );
};

export default OutroClip;
