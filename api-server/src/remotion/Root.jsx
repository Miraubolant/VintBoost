import React from 'react';
import { Composition } from 'remotion';
import { VintedVideo } from './compositions/VintedVideo';

// Default props for Remotion Studio preview
const defaultProps = {
  username: 'demo_user',
  clipDuration: 3.5,
  articles: [
    {
      id: '1',
      title: 'Robe vintage fleurie',
      brand: 'ZARA',
      price: '25',
      imageUrl: 'https://via.placeholder.com/1080x1920/FF6B6B/fff?text=Article+1',
    },
    {
      id: '2',
      title: 'Jean slim bleu',
      brand: 'LEVI\'S',
      price: '35',
      imageUrl: 'https://via.placeholder.com/1080x1920/4ECDC4/fff?text=Article+2',
    },
    {
      id: '3',
      title: 'Sac à main cuir',
      brand: 'MICHAEL KORS',
      price: '89',
      imageUrl: 'https://via.placeholder.com/1080x1920/A855F7/fff?text=Article+3',
    },
  ],
};

export const RemotionRoot = () => {
  const fps = 30;
  const introDuration = 2.5;
  const outroDuration = 2;
  const articleDuration = defaultProps.clipDuration;
  const totalDuration =
    introDuration +
    outroDuration +
    defaultProps.articles.length * articleDuration;

  return (
    <>
      <Composition
        id="VintedVideo"
        component={VintedVideo}
        durationInFrames={Math.round(totalDuration * fps)}
        fps={fps}
        width={1080}
        height={1920}
        defaultProps={defaultProps}
      />
    </>
  );
};
