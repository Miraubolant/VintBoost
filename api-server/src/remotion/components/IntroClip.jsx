import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';

// Template configurations
const TEMPLATE_COLORS = {
  classic: {
    background: 'linear-gradient(135deg, #FFE66D 0%, #FF6B6B 100%)',
    cardBg: '#FFFFFF',
    textColor: '#1a1a2e',
    badgeBg: '#4ECDC4',
    badgeTextColor: '#1a1a2e',
    decorColor1: '#FFFFFF',
    decorColor2: '#A855F7',
    barGradient: 'linear-gradient(90deg, #FF6B6B, #A855F7, #4ECDC4)',
    customTextBg: 'rgba(255,255,255,0.95)',
    customTextColor: '#1a1a2e',
    customTextBorder: '#FF6B6B',
  },
  modern: {
    background: 'linear-gradient(180deg, #1D3354 0%, #467599 100%)',
    cardBg: '#FFFFFF',
    textColor: '#1D3354',
    badgeBg: '#D64045',
    badgeTextColor: '#FFFFFF',
    decorColor1: 'rgba(255,255,255,0.2)',
    decorColor2: '#9ED8DB',
    barGradient: 'linear-gradient(90deg, #D64045, #1D3354, #9ED8DB)',
    customTextBg: 'rgba(29,51,84,0.95)',
    customTextColor: '#FFFFFF',
    customTextBorder: '#D64045',
  },
  premium: {
    background: 'linear-gradient(135deg, #0D0D0D 0%, #1a1a1a 50%, #2d2d2d 100%)',
    cardBg: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
    textColor: '#D4AF37',
    badgeBg: 'linear-gradient(135deg, #D4AF37 0%, #F4E4BA 50%, #D4AF37 100%)',
    badgeTextColor: '#0D0D0D',
    decorColor1: 'rgba(212,175,55,0.3)',
    decorColor2: 'rgba(212,175,55,0.2)',
    barGradient: 'linear-gradient(90deg, #D4AF37, #F4E4BA, #D4AF37)',
    customTextBg: 'rgba(0,0,0,0.95)',
    customTextColor: '#D4AF37',
    customTextBorder: '#D4AF37',
  },
};

export const IntroClip = ({ username, template = 'classic', customText = '' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const colors = TEMPLATE_COLORS[template] || TEMPLATE_COLORS.classic;

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

  // Custom text animation
  const customTextSlide = spring({
    frame: frame - 35,
    fps,
    config: { damping: 12, stiffness: 80 },
  });

  const displayName = username ? `@${username}` : 'MON VESTIAIRE';

  return (
    <AbsoluteFill
      style={{
        background: colors.background,
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
          backgroundColor: colors.decorColor1,
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
          backgroundColor: colors.decorColor2,
          opacity: 0.3,
          transform: `scale(${decorScale})`,
        }}
      />

      {/* Main content card */}
      <div
        style={{
          background: colors.cardBg,
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
            color: colors.textColor,
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
            background: colors.badgeBg,
            color: colors.badgeTextColor,
            fontSize: 48,
            fontWeight: 700,
            padding: '20px 50px',
            borderRadius: 12,
            transform: `scale(${Math.max(0, badgeScale)})`,
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
          }}
        >
          VINTED
        </div>
      </div>

      {/* Custom text / Accroche */}
      {customText && customText.trim() !== '' && (
        <div
          style={{
            position: 'absolute',
            bottom: 80,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            transform: `translateY(${(1 - Math.max(0, customTextSlide)) * 50}px)`,
            opacity: Math.max(0, customTextSlide),
          }}
        >
          <div
            style={{
              background: colors.customTextBg,
              color: colors.customTextColor,
              fontSize: 28,
              fontWeight: 700,
              padding: '16px 40px',
              borderRadius: 12,
              borderLeft: `4px solid ${colors.customTextBorder}`,
              maxWidth: '80%',
              textAlign: 'center',
              boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
            }}
          >
            {customText}
          </div>
        </div>
      )}

      {/* Bottom decorative bar */}
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

export default IntroClip;
