import React, { useEffect, useState } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Img, delayRender, continueRender } from 'remotion';
import { getTemplate } from '../config/templates';

/**
 * ProfileClip - Affiche le screenshot mobile du profil Vinted
 * Style Neo-Brutalism avec animation d'apparition
 */
export const ProfileClip = ({ screenshotUrl, username, template = 'classic' }) => {
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
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Inter, Arial, sans-serif',
      }}
    >
      {/* Decorative squares - Neo-Brutalism */}
      <div
        style={{
          position: 'absolute',
          top: 60,
          right: 40,
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
          bottom: 100,
          left: 30,
          width: 40,
          height: 40,
          backgroundColor: config.cardBg,
          border: `${config.borderWidth}px solid ${config.borderColor}`,
          transform: `scale(${decorScale}) rotate(12deg)`,
          boxShadow: '3px 3px 0px 0px rgba(0,0,0,1)',
          opacity: exitOpacity,
        }}
      />

      {/* Phone mockup with screenshot */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 20,
          transform: `translateY(${phoneY}px)`,
          opacity: phoneOpacity * exitOpacity,
        }}
      >
        {/* Phone frame - Neo-Brutalism style */}
        <div
          style={{
            position: 'relative',
            width: 220,
            height: 450,
            backgroundColor: '#000000',
            border: `${config.borderWidth}px solid ${config.borderColor}`,
            boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)',
            padding: 8,
            overflow: 'hidden',
          }}
        >
          {/* Phone notch */}
          <div
            style={{
              position: 'absolute',
              top: 8,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 80,
              height: 20,
              backgroundColor: '#000000',
              borderRadius: 10,
              zIndex: 10,
            }}
          />

          {/* Screenshot content */}
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#FFFFFF',
              overflow: 'hidden',
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
                  gap: 10,
                }}
              >
                <span style={{ fontSize: 40 }}>📱</span>
                <span style={{ fontSize: 12, color: '#666' }}>Vinted</span>
              </div>
            )}
          </div>
        </div>

        {/* Username label */}
        <div
          style={{
            backgroundColor: config.cardBg,
            color: config.textColor,
            fontSize: 28,
            fontWeight: 800,
            fontFamily: 'Inter, Arial, sans-serif',
            padding: '12px 32px',
            border: `${config.borderWidth}px solid ${config.borderColor}`,
            boxShadow: '5px 5px 0px 0px rgba(0,0,0,1)',
            textTransform: 'uppercase',
            transform: `translateY(${textY}px)`,
            opacity: Math.max(0, textSlide),
          }}
        >
          @{username || 'VINTED'}
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
          height: 6,
          backgroundColor: config.accentColor,
          opacity: exitOpacity,
        }}
      />
    </AbsoluteFill>
  );
};

export default ProfileClip;
