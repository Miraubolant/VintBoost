import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { getTemplate } from '../config/templates';

/**
 * Watermark - Neo-Brutalism Style
 */
export const Watermark = ({ template = 'classic' }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  const config = getTemplate(template).watermark;

  // Animation subtile du watermark
  const opacity = interpolate(
    frame,
    [0, fps * 0.5, durationInFrames - fps * 0.5, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 16,
        right: 16,
        backgroundColor: config.bg,
        color: config.textColor,
        fontSize: 12,
        fontWeight: 700,
        fontFamily: 'Inter, Arial, sans-serif',
        padding: '6px 12px',
        border: `2px solid ${config.borderColor}`,
        boxShadow: '2px 2px 0px 0px rgba(0,0,0,1)',
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
