/**
 * Service de rendu Remotion
 * Génère des vidéos en utilisant Remotion au lieu de FFmpeg
 */

const { bundle } = require('@remotion/bundler');
const { renderMedia, selectComposition } = require('@remotion/renderer');
const path = require('path');
const fs = require('fs');

// Cache du bundle pour éviter de rebuilder à chaque rendu
let bundleLocation = null;
let bundlePromise = null;

/**
 * Initialiser le bundle Remotion (une seule fois)
 */
async function ensureBundle() {
  if (bundleLocation) {
    return bundleLocation;
  }

  if (bundlePromise) {
    return bundlePromise;
  }

  console.log('[REMOTION] Building bundle...');

  bundlePromise = bundle({
    entryPoint: path.join(__dirname, 'index.js'),
    webpackOverride: (config) => {
      return {
        ...config,
        resolve: {
          ...config.resolve,
          alias: {
            ...config.resolve?.alias,
          },
        },
      };
    },
  });

  bundleLocation = await bundlePromise;
  console.log('[REMOTION] Bundle ready at:', bundleLocation);

  return bundleLocation;
}

/**
 * Calculer la durée totale en frames
 * Si screenshot profil inclus: ProfileClip (3.5s) remplace IntroClip
 * Sinon: IntroClip classique (2.5s)
 */
function calculateTotalFrames(articlesCount, clipDuration, fps = 30, hasProfileScreenshot = false) {
  // Intro: soit ProfileClip (3.5s) soit IntroClip classique (2.5s)
  const introDuration = hasProfileScreenshot ? 3.5 : 2.5;
  const outroDuration = 2;
  const totalSeconds = introDuration + outroDuration + articlesCount * clipDuration;
  return Math.round(totalSeconds * fps);
}

/**
 * Calculer les dimensions de la vidéo en fonction de la résolution et du ratio
 */
function calculateDimensions(resolution, aspectRatio) {
  // Base heights for each resolution
  const resolutionHeights = {
    '720p': 720,
    '1080p': 1080,
    '4K': 2160,
  };

  // Parse aspect ratio
  const [widthRatio, heightRatio] = aspectRatio.split(':').map(Number);
  const baseHeight = resolutionHeights[resolution] || 1080;

  let width, height;

  if (aspectRatio === '9:16') {
    // Portrait (TikTok/Reels style)
    height = baseHeight;
    width = Math.round(height * (widthRatio / heightRatio));
  } else if (aspectRatio === '16:9') {
    // Landscape
    height = baseHeight;
    width = Math.round(height * (widthRatio / heightRatio));
  } else {
    // Square (1:1)
    width = baseHeight;
    height = baseHeight;
  }

  // Ensure dimensions are even (required for video encoding)
  width = Math.round(width / 2) * 2;
  height = Math.round(height / 2) * 2;

  return { width, height };
}

/**
 * Rendre une vidéo avec Remotion
 */
async function renderVideo(config) {
  const {
    articles,
    username = '',
    clipDuration = 3.5,
    outputPath,
    onProgress,
    template = 'classic',
    customText = '',
    hasWatermark = true,
    resolution = '1080p',
    aspectRatio = '9:16',
    profileScreenshotUrl = null, // URL du screenshot mobile du profil Vinted
  } = config;

  const fps = 30;
  const totalFrames = calculateTotalFrames(articles.length, clipDuration, fps, !!profileScreenshotUrl);
  const { width, height } = calculateDimensions(resolution, aspectRatio);

  console.log(`[REMOTION] Starting render: ${articles.length} articles, ${clipDuration}s each`);
  console.log(`[REMOTION] Resolution: ${width}x${height} (${resolution} ${aspectRatio})`);
  console.log(`[REMOTION] Template: ${template}, Watermark: ${hasWatermark}`);
  console.log(`[REMOTION] Profile screenshot URL: ${profileScreenshotUrl || 'None'}`);
  console.log(`[REMOTION] Total duration: ${totalFrames / fps}s (${totalFrames} frames)`);

  try {
    // S'assurer que le bundle est prêt
    const bundled = await ensureBundle();

    // Préparer les props pour la composition
    const inputProps = {
      username,
      clipDuration,
      template,
      customText,
      hasWatermark,
      profileScreenshotUrl,
      articles: articles.map((article) => {
        const imgUrl = article.localImagePath || article.imageUrl;
        console.log(`[REMOTION] Article ${article.id} image: ${imgUrl}`);
        return {
          id: article.id,
          title: article.title || '',
          brand: article.brand || '',
          size: article.size || '',
          price: article.price,
          imageUrl: article.imageUrl,
          localImagePath: imgUrl,
        };
      }),
    };

    console.log('[REMOTION] Selecting composition...');

    // Sélectionner la composition
    const composition = await selectComposition({
      serveUrl: bundled,
      id: 'VintedVideo',
      inputProps,
    });

    // Override la durée et les dimensions avec nos calculs
    const compositionWithDuration = {
      ...composition,
      durationInFrames: totalFrames,
      width,
      height,
    };

    console.log('[REMOTION] Rendering video...');

    // Rendre la vidéo
    await renderMedia({
      composition: compositionWithDuration,
      serveUrl: bundled,
      codec: 'h264',
      outputLocation: outputPath,
      inputProps,
      timeoutInMilliseconds: 120000, // 2 minutes timeout
      delayRenderTimeoutInMilliseconds: 60000, // 1 minute pour charger les images
      chromiumOptions: {
        enableMultiProcessOnLinux: true,
      },
      onProgress: ({ progress }) => {
        const percent = Math.round(progress * 100);
        if (percent % 10 === 0) {
          console.log(`[REMOTION] Progress: ${percent}%`);
        }
        if (onProgress) {
          onProgress(percent);
        }
      },
    });

    console.log(`[REMOTION] Video rendered: ${outputPath}`);

    // Obtenir les infos du fichier
    const stats = fs.statSync(outputPath);
    const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);

    return {
      success: true,
      outputPath,
      duration: totalFrames / fps,
      fileSize: fileSizeMB,
    };
  } catch (error) {
    console.error('[REMOTION] Render error:', error);
    throw error;
  }
}

/**
 * Générer une thumbnail depuis une frame de la vidéo
 */
async function renderThumbnail(config) {
  const {
    articles,
    username = '',
    clipDuration = 3.5,
    outputPath,
    frame = 75, // Frame 2.5s (après l'intro)
    template = 'classic',
    customText = '',
    hasWatermark = true,
    resolution = '1080p',
    aspectRatio = '9:16',
  } = config;

  try {
    const bundled = await ensureBundle();
    const fps = 30;
    const totalFrames = calculateTotalFrames(articles.length, clipDuration, fps);
    const { width, height } = calculateDimensions(resolution, aspectRatio);

    const inputProps = {
      username,
      clipDuration,
      template,
      customText,
      hasWatermark,
      articles: articles.map((article) => ({
        id: article.id,
        title: article.title || '',
        brand: article.brand || '',
        price: article.price,
        imageUrl: article.imageUrl,
        localImagePath: article.localImagePath || article.imageUrl,
      })),
    };

    const composition = await selectComposition({
      serveUrl: bundled,
      id: 'VintedVideo',
      inputProps,
    });

    const { renderStill } = require('@remotion/renderer');

    await renderStill({
      composition: {
        ...composition,
        durationInFrames: totalFrames,
        width,
        height,
      },
      serveUrl: bundled,
      output: outputPath,
      inputProps,
      frame: Math.min(frame, totalFrames - 1),
    });

    console.log(`[REMOTION] Thumbnail created: ${outputPath}`);

    return { success: true, outputPath };
  } catch (error) {
    console.error('[REMOTION] Thumbnail error:', error);
    throw error;
  }
}

/**
 * Précharger le bundle au démarrage
 */
async function preloadBundle() {
  try {
    await ensureBundle();
    console.log('[REMOTION] Bundle preloaded successfully');
  } catch (error) {
    console.error('[REMOTION] Failed to preload bundle:', error);
  }
}

module.exports = {
  renderVideo,
  renderThumbnail,
  preloadBundle,
  calculateTotalFrames,
  calculateDimensions,
};
