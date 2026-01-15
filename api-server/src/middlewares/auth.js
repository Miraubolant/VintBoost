/**
 * Middleware d'authentification
 */

const crypto = require('crypto')
const config = require('../config')

/**
 * Timing-safe string comparison to prevent timing attacks
 */
const timingSafeEqual = (a, b) => {
  if (!a || !b) return false
  if (a.length !== b.length) {
    // Use dummy comparison to maintain constant time
    crypto.timingSafeEqual(Buffer.from(a), Buffer.from(a))
    return false
  }
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b))
}

const authMiddleware = (req, res, next) => {
  // CRITICAL: Always require API key in production
  if (!config.apiKey) {
    console.error('SECURITY WARNING: API_KEY is not configured!')
    return res.status(500).json({
      success: false,
      error: 'Server configuration error'
    })
  }

  const providedKey = req.headers['x-api-key']

  if (!providedKey || !timingSafeEqual(providedKey, config.apiKey)) {
    return res.status(401).json({
      success: false,
      error: 'API key invalide'
    })
  }

  next()
}

module.exports = authMiddleware
