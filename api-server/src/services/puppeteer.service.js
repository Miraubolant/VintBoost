/**
 * Service Puppeteer
 * Gère le lancement et la configuration du navigateur
 */

const puppeteer = require('puppeteer')
const config = require('../config')

// Configuration iPhone 14 Pro Max pour émulation mobile
const IPHONE_14_PRO_MAX = {
  name: 'iPhone 14 Pro Max',
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
  viewport: {
    width: 430,
    height: 932,
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    isLandscape: false
  }
}

class PuppeteerService {
  /**
   * Lance une instance de navigateur
   */
  async launchBrowser() {
    return puppeteer.launch({
      headless: config.puppeteer.headless,
      executablePath: config.puppeteer.executablePath,
      args: config.puppeteer.args
    })
  }

  /**
   * Crée une page avec configuration standard
   */
  async createPage(browser) {
    const page = await browser.newPage()
    await page.setUserAgent(config.scraper.userAgent)
    return page
  }

  /**
   * Crée une page mobile (iPhone 14 Pro Max)
   */
  async createMobilePage(browser) {
    const page = await browser.newPage()
    await page.setUserAgent(IPHONE_14_PRO_MAX.userAgent)
    await page.setViewport(IPHONE_14_PRO_MAX.viewport)
    return page
  }

  /**
   * Configure l'interception des requêtes pour bloquer les ressources inutiles
   */
  async setupRequestInterception(page) {
    await page.setRequestInterception(true)
    page.on('request', req => {
      const blocked = ['font', 'media']
      blocked.includes(req.resourceType()) ? req.abort() : req.continue()
    })
  }

  /**
   * Capture un screenshot mobile d'un profil Vinted
   */
  async captureProfileScreenshot(url) {
    const browser = await this.launchBrowser()

    try {
      const page = await this.createMobilePage(browser)

      console.log(`[SCREENSHOT] Capturing mobile screenshot of ${url}`)

      // Aller sur la page
      await page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: 30000
      })

      // Attendre que le contenu soit chargé
      await new Promise(r => setTimeout(r, 2000))

      // Fermer les popups/modales éventuelles (cookies, etc.)
      try {
        await page.evaluate(() => {
          // Fermer modal cookies si présent
          const cookieButtons = document.querySelectorAll('button')
          cookieButtons.forEach(btn => {
            if (btn.textContent?.toLowerCase().includes('accept') ||
                btn.textContent?.toLowerCase().includes('continuer') ||
                btn.textContent?.toLowerCase().includes('refuser')) {
              btn.click()
            }
          })

          // Fermer autres modales
          const closeButtons = document.querySelectorAll('[aria-label="Close"], [data-testid*="close"]')
          closeButtons.forEach(btn => btn.click())
        })
        await new Promise(r => setTimeout(r, 500))
      } catch (e) {
        // Pas de popup à fermer
      }

      // Prendre le screenshot
      const screenshot = await page.screenshot({
        type: 'png',
        fullPage: false, // Juste la partie visible
        encoding: 'base64'
      })

      console.log('[SCREENSHOT] Screenshot captured successfully')

      return {
        success: true,
        screenshot: `data:image/png;base64,${screenshot}`,
        width: IPHONE_14_PRO_MAX.viewport.width,
        height: IPHONE_14_PRO_MAX.viewport.height
      }

    } finally {
      await browser.close()
    }
  }
}

module.exports = new PuppeteerService()
