/**
 * Service Puppeteer
 * Gère le lancement et la configuration du navigateur
 */

const puppeteer = require('puppeteer')
const config = require('../config')

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
   * Configure l'interception des requêtes pour bloquer les ressources inutiles
   */
  async setupRequestInterception(page) {
    await page.setRequestInterception(true)
    page.on('request', req => {
      const blocked = ['font', 'media']
      blocked.includes(req.resourceType()) ? req.abort() : req.continue()
    })
  }
}

module.exports = new PuppeteerService()
