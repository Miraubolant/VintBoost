/**
 * Configuration centralisée de l'application
 */

module.exports = {
  port: process.env.PORT || 3000,
  apiKey: process.env.API_KEY || '',

  cors: {
    allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:5173,http://localhost:5174,http://localhost:5175,http://localhost:5176')
      .split(',')
      .map(o => o.trim())
  },

  puppeteer: {
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu'
    ]
  },

  scraper: {
    perPage: 96,
    maxPages: 20,
    requestDelay: 500,
    scrollDelay: 1500,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  }
}
