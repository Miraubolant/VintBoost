/**
 * Application Express
 */

const express = require('express')
const path = require('path')
const corsMiddleware = require('./middlewares/cors')
const scraperRoutes = require('./routes/scraper.routes')
const videoRoutes = require('./routes/video.routes')

const app = express()

// Middlewares globaux
app.use(corsMiddleware)
app.use(express.json())

// Servir fichiers statiques (vidéos générées)
app.use('/output', express.static(path.join(__dirname, '../output')))

// Servir les images temporaires pour Remotion
app.use('/temp', express.static(path.join(__dirname, '../temp')))

// Routes
app.use('/api', scraperRoutes)
app.use('/api/video', videoRoutes)

// Route racine
app.get('/', (req, res) => {
  res.json({
    name: 'VintBoost API',
    version: '1.0.0',
    status: 'running'
  })
})

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error('[ERROR]', err)
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error'
  })
})

module.exports = app
