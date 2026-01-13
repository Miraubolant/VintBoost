import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';

// Template configurations for outro
const TEMPLATE_COLORS = {
  classic: {
    background: 'linear-gradient(135deg, #EC4899 0%, #A855F7 100%)',
    cardBg: '#FFFFFF',
    textColor: '#1a1a2e',
    ctaGradient: 'linear-gradient(135deg, #4ECDC4 0%, #FF6B6B 100%)',
    ctaTextColor: '#FFFFFF',
    usernameColor: '#A855F7',
    decorColor1: '#FFFFFF',
    decorColor2: '#FFE66D',
    barGradient: 'linear-gradient(90deg, #FFE66D, #4ECDC4, #FF6B6B)',
  },
  modern: {
    background: 'linear-gradient(180deg, #467599 0%, #1D3354 100%)',
    cardBg: '#FFFFFF',
    textColor: '#1D3354',
    ctaGradient: 'linear-gradient(135deg, #D64045 0%, #FF6B6B 100%)',
    ctaTextColor: '#FFFFFF',
    usernameColor: '#1D3354',
    decorColor1: 'rgba(255,255,255,0.2)',
    decorColor2: '#9ED8DB',
    barGradient: 'linear-gradient(90deg, #9ED8DB, #1D3354, #D64045)',
  },
  premium: {
    background: 'linear-gradient(135deg, #1a1a1a 0%, #0D0D0D 100%)',
    cardBg: 'linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)',
    textColor: '#D4AF37',
    ctaGradient: 'linear-gradient(135deg, #D4AF37 0%, #F4E4BA 50%, #D4AF37 100%)',
    ctaTextColor: '#0D0D0D',
    usernameColor: '#F4E4BA',
    decorColor1: 'rgba(212,175,55,0.2)',
    decorColor2: 'rgba(212,175,55,0.3)',
    barGradient: 'linear-gradient(90deg, #D4AF37, #F4E4BA, #D4AF37)',
  },
};

export const OutroClip = ({ username, template = 'classic' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const colors = TEMPLATE_COLORS[template] || TEMPLATE_COLORS.classic;

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
        background: colors.background,
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
          backgroundColor: colors.decorColor1,
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
          backgroundColor: colors.decorColor2,
          opacity: 0.2,
          transform: `scale(${pulseScale})`,
        }}
      />

      {/* Main card */}
      <div
        style={{
          background: colors.cardBg,
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
            color: colors.textColor,
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
            background: colors.ctaGradient,
            color: colors.ctaTextColor,
            fontSize: 44,
            fontWeight: 800,
            padding: '22px 50px',
            borderRadius: 16,
            transform: `scale(${Math.max(0, badgeScale)})`,
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)',
          }}
        >
          SUR VINTED!
        </div>

        {/* Username if available */}
        {username && (
          <p
            style={{
              fontSize: 32,
              color: colors.usernameColor,
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
          background: colors.barGradient,
        }}
      />
    </AbsoluteFill>
  );
};

export default OutroClip;
