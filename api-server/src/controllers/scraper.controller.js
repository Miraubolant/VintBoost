/**
 * Contrôleur Scraper
 * Gère les requêtes HTTP pour le scraping
 */

const scraperService = require('../services/scraper.service')

class ScraperController {
  /**
   * Route de health check
   */
  async health(req, res) {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString()
    })
  }

  /**
   * Scrape un vestiaire Vinted
   */
  async scrapeWardrobe(req, res) {
    const { wardrobeUrl } = req.body

    // Validation
    if (!wardrobeUrl?.includes('vinted') || !wardrobeUrl.includes('/member')) {
      return res.status(400).json({
        success: false,
        error: 'URL invalide'
      })
    }

    try {
      console.log(`[API] Scrape request for ${wardrobeUrl}`)
      const result = await scraperService.scrape(wardrobeUrl)
      console.log(`[API] Scrape complete: ${result.totalItems} items`)
      res.json(result)
    } catch (error) {
      console.error('[API] Scrape error:', error)
      res.status(500).json({
        success: false,
        error: error.message
      })
    }
  }
}

module.exports = new ScraperController()
