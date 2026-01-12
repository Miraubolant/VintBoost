/**
 * Routes Scraper
 */

const express = require('express')
const router = express.Router()
const scraperController = require('../controllers/scraper.controller')
const authMiddleware = require('../middlewares/auth')

// Health check
router.get('/health', scraperController.health.bind(scraperController))

// Scrape wardrobe (protégé par auth)
router.post('/scrape-wardrobe', authMiddleware, scraperController.scrapeWardrobe.bind(scraperController))

module.exports = router
