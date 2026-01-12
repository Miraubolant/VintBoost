/**
 * Middleware CORS
 */

const cors = require('cors')
const config = require('../config')

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || config.cors.allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}

module.exports = cors(corsOptions)
