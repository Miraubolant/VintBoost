/**
 * VintBoost API - Point d'entrée
 */

const app = require('./src/app')
const config = require('./src/config')

app.listen(config.port, '0.0.0.0', () => {
  console.log(`🚀 VintBoost API running on port ${config.port}`)
  console.log(`📋 Allowed origins: ${config.cors.allowedOrigins.join(', ')}`)
})
