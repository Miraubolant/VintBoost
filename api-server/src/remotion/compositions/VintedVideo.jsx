import React from 'react';
import { Sequence, useVideoConfig } from 'remotion';
import { IntroClip } from '../components/IntroClip';
import { ArticleClip } from '../components/ArticleClip';
import { OutroClip } from '../components/OutroClip';

export const VintedVideo = ({ username, articles, clipDuration }) => {
  const { fps } = useVideoConfig();

  const introFrames = Math.round(2.5 * fps); // 2.5 seconds
  const outroFrames = Math.round(2 * fps);   // 2 seconds
  const articleFrames = Math.round(clipDuration * fps);

  let currentFrame = 0;

  return (
    <>
      {/* Intro */}
      <Sequence from={currentFrame} durationInFrames={introFrames}>
        <IntroClip username={username} />
      </Sequence>

      {currentFrame += introFrames}

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
            />
          </Sequence>
        );
      })}

      {/* Outro */}
      <Sequence from={currentFrame} durationInFrames={outroFrames}>
        <OutroClip username={username} />
      </Sequence>
    </>
  );
};

export default VintedVideo;
