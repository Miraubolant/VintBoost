import React from 'react';
import { Sequence, useVideoConfig, AbsoluteFill } from 'remotion';
import { IntroClip } from '../components/IntroClip';
import { ArticleClip } from '../components/ArticleClip';
import { OutroClip } from '../components/OutroClip';
import { Watermark } from '../components/Watermark';
import { ProfileClip } from '../components/ProfileClip';

export const VintedVideo = ({
  username,
  articles,
  clipDuration,
  template = 'classic',
  customText = '',
  hasWatermark = true,
  profileScreenshotUrl = null, // URL du screenshot mobile du profil Vinted
}) => {
  const { fps } = useVideoConfig();

  // Si screenshot profil inclus: ProfileClip avec customText (remplace l'intro classique)
  // Sinon: IntroClip classique
  const hasProfileIntro = !!profileScreenshotUrl;
  const introFrames = hasProfileIntro ? Math.round(3.5 * fps) : Math.round(2.5 * fps); // 3.5s pour profile, 2.5s pour classique
  const outroFrames = Math.round(2 * fps);   // 2 seconds
  const articleFrames = Math.round(clipDuration * fps);

  let currentFrame = 0;

  return (
    <AbsoluteFill>
      {/* Intro: soit ProfileClip avec customText, soit IntroClip classique */}
      {hasProfileIntro ? (
        <>
          <Sequence from={currentFrame} durationInFrames={introFrames}>
            <ProfileClip
              screenshotUrl={profileScreenshotUrl}
              username={username}
              template={template}
              customText={customText}
            />
          </Sequence>
          {currentFrame += introFrames}
        </>
      ) : (
        <>
          <Sequence from={currentFrame} durationInFrames={introFrames}>
            <IntroClip username={username} template={template} customText={customText} />
          </Sequence>
          {currentFrame += introFrames}
        </>
      )}

      {/* Article clips */}
      {articles.map((article, index) => {
        const startFrame = currentFrame;
        currentFrame += articleFrames;

        return (
          <Sequence
            key={article.id || index}
            from={startFrame}
            durationInFrames={articleFrames}
          >
            <ArticleClip
              article={article}
              index={index}
              imageUrl={article.localImagePath || article.imageUrl}
              template={template}
            />
          </Sequence>
        );
      })}

      {/* Outro */}
      <Sequence from={currentFrame} durationInFrames={outroFrames}>
        <OutroClip username={username} template={template} />
      </Sequence>

      {/* Watermark (persiste sur toute la video si active) */}
      {hasWatermark && (
        <Watermark template={template} />
      )}
    </AbsoluteFill>
  );
};

export default VintedVideo;
