import React, { useEffect, useState } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Img, delayRender, continueRender } from 'remotion';
import { getTemplate } from '../config/templates';

/**
 * ProfileClip - Affiche le screenshot mobile du profil Vinted
 * Style Neo-Brutalism avec animation d'apparition
 * Affiche aussi le customText (accroche) si fourni
 */
export const ProfileClip = ({ screenshotUrl, username, template = 'classic', customText = '' }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [handle] = useState(() => delayRender('Loading profile screenshot'));

  const config = getTemplate(template).intro;

  useEffect(() => {
    if (!screenshotUrl) {
      setImageLoaded(true);
      continueRender(handle);
      return;
    }

    const img = new Image();
    img.onload = () => {
      setImageLoaded(true);
      continueRender(handle);
    };
    img.onerror = () => {
      console.error('Failed to load screenshot');
      setImageLoaded(true);
      continueRender(handle);
    };
    img.src = screenshotUrl;
  }, [screenshotUrl, handle]);

  // Animation d'apparition du phone
  const phoneSlide = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  const phoneY = interpolate(phoneSlide, [0, 1], [100, 0]);
  const phoneOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Animation du texte
  const textSlide = spring({
    frame: frame - 15,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const textY = interpolate(textSlide, [0, 1], [50, 0]);

  // Animation de sortie
  const exitOpacity = interpolate(
    frame,
    [durationInFrames - 10, durationInFrames],
    [1, 0],
    { extrapolateRight: 'clamp' }
  );

  // Decorative elements animation
  const decorScale = spring({
    frame: frame - 8,
    fps,
    config: { damping: 10, stiffness: 120 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: config.background,
        fontFamily: 'Inter, Arial, sans-serif',
      }}
    >
      {/* Screenshot en plein écran */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          transform: `translateY(${phoneY}px)`,
          opacity: phoneOpacity * exitOpacity,
        }}
      >
        {imageLoaded && screenshotUrl ? (
          <Img
            src={screenshotUrl}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'top',
            }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#F5F5F5',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 20,
            }}
          >
            <span style={{ fontSize: 80 }}>📱</span>
            <span style={{ fontSize: 24, color: '#666', fontWeight: 600 }}>Vinted</span>
          </div>
        )}
      </div>

      {/* Overlay gradient pour meilleure lisibilité du texte */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 30%, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0.6) 100%)',
          opacity: phoneOpacity * exitOpacity,
        }}
      />

      {/* Decorative squares - Neo-Brutalism */}
      <div
        style={{
          position: 'absolute',
          top: 80,
          right: 30,
          width: 50,
          height: 50,
          backgroundColor: config.accentColor,
          border: `${config.borderWidth}px solid ${config.borderColor}`,
          transform: `scale(${decorScale}) rotate(-15deg)`,
          boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
          opacity: exitOpacity,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 150,
          left: 25,
          width: 40,
          height: 40,
          backgroundColor: config.cardBg,
          border: `${config.borderWidth}px solid ${config.borderColor}`,
          transform: `scale(${decorScale}) rotate(12deg)`,
          boxShadow: '3px 3px 0px 0px rgba(0,0,0,1)',
          opacity: exitOpacity,
        }}
      />

      {/* Username label - En haut */}
      <div
        style={{
          position: 'absolute',
          top: 60,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          transform: `translateY(${textY}px)`,
          opacity: Math.max(0, textSlide) * exitOpacity,
        }}
      >
        <div
          style={{
            backgroundColor: config.cardBg,
            color: config.textColor,
            fontSize: 32,
            fontWeight: 800,
            fontFamily: 'Inter, Arial, sans-serif',
            padding: '14px 40px',
            border: `${config.borderWidth}px solid ${config.borderColor}`,
            boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)',
            textTransform: 'uppercase',
          }}
        >
          @{username || 'VINTED'}
        </div>
      </div>

      {/* Custom text / Accroche - Neo-Brutalism en bas (si fourni) */}
      {customText && customText.trim() !== '' && (
        <div
          style={{
            position: 'absolute',
            bottom: 80,
            left: 20,
            right: 20,
            display: 'flex',
            justifyContent: 'center',
            transform: `translateY(${textY}px)`,
            opacity: Math.max(0, textSlide) * exitOpacity,
          }}
        >
          <div
            style={{
              backgroundColor: config.accentColor,
              color: config.textColor,
              fontSize: 24,
              fontWeight: 700,
              fontFamily: 'Inter, Arial, sans-serif',
              padding: '16px 32px',
              border: `${config.borderWidth}px solid ${config.borderColor}`,
              boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)',
              maxWidth: '90%',
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
          height: 8,
          backgroundColor: config.accentColor,
          opacity: exitOpacity,
        }}
      />

      {/* Bottom accent bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 8,
          backgroundColor: config.accentColor,
          opacity: exitOpacity,
        }}
      />
    </AbsoluteFill>
  );
};

export default ProfileClip;
