/**
 * Routes Vidéo
 */

const express = require('express')
const router = express.Router()
const videoController = require('../controllers/video.controller')
const authMiddleware = require('../middlewares/auth')

// Bibliothèque musicale (public)
router.get('/music', videoController.getMusicLibrary.bind(videoController))

// Générer une vidéo (protégé)
router.post('/generate', authMiddleware, videoController.generate.bind(videoController))

// Lister les vidéos (protégé)
router.get('/list', authMiddleware, videoController.list.bind(videoController))

// Infos vidéo (protégé)
router.get('/:videoId', authMiddleware, videoController.getInfo.bind(videoController))

// Télécharger vidéo (protégé)
router.get('/:videoId/download', authMiddleware, videoController.download.bind(videoController))

// Supprimer vidéo (protégé)
router.delete('/:videoId', authMiddleware, videoController.delete.bind(videoController))

module.exports = router
