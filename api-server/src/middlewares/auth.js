/**
 * Middleware d'authentification
 */

const config = require('../config')

const authMiddleware = (req, res, next) => {
  if (config.apiKey && req.headers['x-api-key'] !== config.apiKey) {
    return res.status(401).json({
      success: false,
      error: 'API key invalide'
    })
  }
  next()
}

module.exports = authMiddleware
