/**
 * Service de génération vidéo avec Remotion
 * Orchestre le processus complet de création d'une vidéo
 */

const { v4: uuidv4 } = require('uuid')
const path = require('path')
const fs = require('fs')
const fileUtils = require('../utils/file.utils')
const remotionService = require('../remotion/render.service')
const appConfig = require('../config')

class VideoService {
  constructor() {
    // Précharger le bundle Remotion au démarrage
    this.initPromise = this.init()
  }

  async init() {
    try {
      await remotionService.preloadBundle()
      console.log('[VIDEO] Remotion bundle ready')
    } catch (error) {
      console.error('[VIDEO] Failed to preload Remotion bundle:', error.message)
    }
  }

  /**
   * Générer une vidéo complète depuis des articles Vinted
   */
  async generateVideo(config) {
    const {
      articles,
      duration = 30,
      musicTrack,
      title = 'Ma vidéo VintBoost',
      hasWatermark = true,
      username = ''
    } = config

    // Validation
    if (!articles || articles.length === 0) {
      throw new Error('No articles provided')
    }

    if (articles.length > 10) {
      throw new Error('Maximum 10 articles allowed')
    }

    const jobId = uuidv4()
    console.log(`[VIDEO] Starting Remotion generation job ${jobId}`)
    console.log(`[VIDEO] Config: ${articles.length} articles, ${duration}s target, watermark=${hasWatermark}`)

    let tempDirs = null

    try {
      // 1. Créer dossiers temporaires
      tempDirs = await fileUtils.createTempDir(jobId)
      const { tempDir } = tempDirs

      // 2. Télécharger les images
      console.log(`[VIDEO] Downloading ${articles.length} images...`)
      const downloadedArticles = await fileUtils.downloadImages(articles, tempDir)

      if (downloadedArticles.length === 0) {
        throw new Error('Failed to download any images')
      }

      console.log(`[VIDEO] Successfully downloaded ${downloadedArticles.length} images`)

      // 3. Calculer durée par article
      const introOutroDuration = 4.5 // 2.5s intro + 2s outro
      const minClipDuration = 3.5 // Minimum 3.5 secondes par article

      let clipDuration = (duration - introOutroDuration) / downloadedArticles.length

      if (clipDuration < minClipDuration) {
        clipDuration = minClipDuration
        console.log(`[VIDEO] Extending video duration for better visibility`)
      }

      console.log(`[VIDEO] Clip duration: ${clipDuration.toFixed(2)}s per article`)

      // 4. Préparer les articles avec les URLs HTTP des images
      // Les images sont servies via Express sur /temp/{jobId}/images/
      const baseUrl = `http://localhost:${appConfig.port}`
      const articlesWithImages = downloadedArticles.map(({ article, imagePath }) => {
        // Extraire le chemin relatif depuis temp/
        const relativePath = imagePath.split('temp')[1].replace(/\\/g, '/')
        const imageUrl = `${baseUrl}/temp${relativePath}`
        console.log(`[VIDEO] Image URL: ${imageUrl}`)
        return {
          ...article,
          localImagePath: imageUrl,
        }
      })

      // 5. Chemins de sortie
      const outputDir = path.join(__dirname, '../../output')
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true })
      }

      const outputPath = path.join(outputDir, `${jobId}.mp4`)
      const thumbnailPath = path.join(outputDir, `${jobId}-thumb.jpg`)

      // 6. Rendre la vidéo avec Remotion
      console.log(`[VIDEO] Rendering video with Remotion...`)

      const renderResult = await remotionService.renderVideo({
        articles: articlesWithImages,
        username,
        clipDuration,
        outputPath,
        onProgress: (percent) => {
          // Optionnel: callback de progression
        },
      })

      // 7. Générer la thumbnail
      console.log(`[VIDEO] Generating thumbnail...`)

      try {
        await remotionService.renderThumbnail({
          articles: articlesWithImages,
          username,
          clipDuration,
          outputPath: thumbnailPath,
          frame: 90, // Frame après l'intro (3 secondes)
        })
      } catch (thumbError) {
        console.warn('[VIDEO] Thumbnail generation failed:', thumbError.message)
      }

      console.log(`[VIDEO] Video generated successfully!`)
      console.log(`[VIDEO] Duration: ${renderResult.duration.toFixed(2)}s, Size: ${renderResult.fileSize}MB`)

      // 8. Cleanup
      await fileUtils.cleanup(tempDir)

      return {
        success: true,
        videoId: jobId,
        videoPath: outputPath,
        videoUrl: `/output/${jobId}.mp4`,
        thumbnailUrl: fs.existsSync(thumbnailPath) ? `/output/${jobId}-thumb.jpg` : null,
        duration: Math.round(renderResult.duration),
        fileSize: parseFloat(renderResult.fileSize),
        articlesCount: downloadedArticles.length,
        title,
        hasWatermark,
        createdAt: new Date().toISOString()
      }

    } catch (error) {
      console.error(`[VIDEO] Generation failed:`, error)

      // Cleanup en cas d'erreur
      if (tempDirs) {
        await fileUtils.cleanup(tempDirs.tempDir)
      }

      throw error
    }
  }

  /**
   * Lister les musiques disponibles
   */
  getMusicLibrary() {
    return fileUtils.getMusicTracks()
  }

  /**
   * Obtenir les informations d'une vidéo générée
   */
  async getVideoInfo(videoId) {
    const videoPath = path.join(__dirname, '../../output', `${videoId}.mp4`)

    if (!fileUtils.fileExists(videoPath)) {
      throw new Error('Video not found')
    }

    const stats = fs.statSync(videoPath)
    const fileSize = (stats.size / (1024 * 1024)).toFixed(2)
    const thumbnailPath = path.join(__dirname, '../../output', `${videoId}-thumb.jpg`)

    // Estimation de la durée basée sur la taille (approximatif)
    // Une meilleure approche serait d'utiliser ffprobe si disponible
    const estimatedDuration = Math.round(stats.size / 500000) // Estimation grossière

    return {
      videoId,
      videoUrl: `/output/${videoId}.mp4`,
      thumbnailUrl: fileUtils.fileExists(thumbnailPath) ? `/output/${videoId}-thumb.jpg` : null,
      duration: estimatedDuration,
      fileSize: parseFloat(fileSize),
      exists: true
    }
  }

  /**
   * Supprimer une vidéo
   */
  async deleteVideo(videoId) {
    const videoPath = path.join(__dirname, '../../output', `${videoId}.mp4`)
    const thumbnailPath = path.join(__dirname, '../../output', `${videoId}-thumb.jpg`)

    const fsPromises = require('fs').promises

    try {
      if (fileUtils.fileExists(videoPath)) {
        await fsPromises.unlink(videoPath)
      }

      if (fileUtils.fileExists(thumbnailPath)) {
        await fsPromises.unlink(thumbnailPath)
      }

      console.log(`[VIDEO] Deleted video ${videoId}`)
      return { success: true }

    } catch (error) {
      console.error(`[VIDEO] Error deleting video:`, error)
      throw error
    }
  }

  /**
   * Lister toutes les vidéos générées
   */
  async listVideos() {
    const outputDir = path.join(__dirname, '../../output')

    if (!fs.existsSync(outputDir)) {
      return []
    }

    const files = fs.readdirSync(outputDir)
    const videoFiles = files.filter(f => f.endsWith('.mp4'))

    const videos = await Promise.all(
      videoFiles.map(async (filename) => {
        const videoId = filename.replace('.mp4', '')
        try {
          const info = await this.getVideoInfo(videoId)
          const stats = fs.statSync(path.join(outputDir, filename))

          return {
            ...info,
            createdAt: stats.mtime.toISOString()
          }
        } catch (error) {
          return null
        }
      })
    )

    return videos
      .filter(v => v !== null)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }
}

module.exports = new VideoService()
