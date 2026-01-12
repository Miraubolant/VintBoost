/**
 * Contrôleur Vidéo
 * Gère les requêtes HTTP pour la génération vidéo
 */

const videoService = require('../services/video.service')
const path = require('path')
const fs = require('fs')

class VideoController {
  /**
   * Générer une vidéo
   * POST /api/video/generate
   */
  async generate(req, res) {
    const {
      articles,
      duration = 30,
      musicTrack,
      title,
      hasWatermark = true,
      username
    } = req.body

    // Validation basique
    if (!articles || !Array.isArray(articles) || articles.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Articles array is required and must not be empty'
      })
    }

    if (articles.length > 10) {
      return res.status(400).json({
        success: false,
        error: 'Maximum 10 articles allowed'
      })
    }

    if (![15, 30, 45, 60].includes(duration)) {
      return res.status(400).json({
        success: false,
        error: 'Duration must be 15, 30, 45, or 60 seconds'
      })
    }

    // Valider que chaque article a les champs requis
    for (const article of articles) {
      if (!article.id || !article.title || !article.price || !article.imageUrl) {
        return res.status(400).json({
          success: false,
          error: 'Each article must have: id, title, price, imageUrl'
        })
      }
    }

    try {
      console.log(`[API] Video generation request: ${articles.length} articles, ${duration}s`)

      const result = await videoService.generateVideo({
        articles,
        duration,
        musicTrack,
        title,
        hasWatermark,
        username
      })

      console.log(`[API] Video generated successfully: ${result.videoId}`)

      res.json(result)

    } catch (error) {
      console.error('[API] Video generation error:', error)

      res.status(500).json({
        success: false,
        error: error.message || 'Video generation failed'
      })
    }
  }

  /**
   * Télécharger une vidéo
   * GET /api/video/:videoId/download
   */
  async download(req, res) {
    const { videoId } = req.params

    if (!videoId) {
      return res.status(400).json({
        success: false,
        error: 'Video ID is required'
      })
    }

    const videoPath = path.join(__dirname, `../../output/${videoId}.mp4`)

    if (!fs.existsSync(videoPath)) {
      return res.status(404).json({
        success: false,
        error: 'Video not found'
      })
    }

    try {
      // Envoyer le fichier en téléchargement
      res.download(videoPath, `vintboost-${videoId}.mp4`, (err) => {
        if (err) {
          console.error('[API] Download error:', err)
          if (!res.headersSent) {
            res.status(500).json({
              success: false,
              error: 'Failed to download video'
            })
          }
        }
      })
    } catch (error) {
      console.error('[API] Download error:', error)
      res.status(500).json({
        success: false,
        error: error.message
      })
    }
  }

  /**
   * Obtenir les infos d'une vidéo
   * GET /api/video/:videoId
   */
  async getInfo(req, res) {
    const { videoId } = req.params

    try {
      const info = await videoService.getVideoInfo(videoId)
      res.json({
        success: true,
        ...info
      })
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message
      })
    }
  }

  /**
   * Lister toutes les vidéos
   * GET /api/video/list
   */
  async list(req, res) {
    try {
      const videos = await videoService.listVideos()
      res.json({
        success: true,
        count: videos.length,
        videos
      })
    } catch (error) {
      console.error('[API] List videos error:', error)
      res.status(500).json({
        success: false,
        error: error.message
      })
    }
  }

  /**
   * Supprimer une vidéo
   * DELETE /api/video/:videoId
   */
  async delete(req, res) {
    const { videoId } = req.params

    try {
      await videoService.deleteVideo(videoId)
      res.json({
        success: true,
        message: 'Video deleted successfully'
      })
    } catch (error) {
      console.error('[API] Delete video error:', error)
      res.status(500).json({
        success: false,
        error: error.message
      })
    }
  }

  /**
   * Obtenir la bibliothèque musicale
   * GET /api/video/music
   */
  async getMusicLibrary(req, res) {
    try {
      const tracks = videoService.getMusicLibrary()
      res.json({
        success: true,
        count: tracks.length,
        tracks
      })
    } catch (error) {
      console.error('[API] Get music library error:', error)
      res.status(500).json({
        success: false,
        error: error.message
      })
    }
  }
}

module.exports = new VideoController()
