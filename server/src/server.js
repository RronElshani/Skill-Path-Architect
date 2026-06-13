import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import config from './config/index.js'
import connectDB from './config/db.js'
import routes from './routes/index.js'
import errorHandler from './middleware/errorHandler.js'
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './config/swagger.js'


const app = express()

// ——— Middleware ———

// CORS — only allow authorized origins
app.use(
  cors({
    origin: config.clientUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)

// Body parsers
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Reject requests until MongoDB is connected (avoids Mongoose buffer timeouts)
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    return next()
  }
  return res.status(503).json({
    success: false,
    message: 'Database is starting up. Please try again in a moment.',
  })
})

// ——— API Documentation ———
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// ——— Routes ———
app.use('/api', routes)

// ——— Error Handler (must be last) ———
app.use(errorHandler)

const startServer = async () => {
  if (config.nodeEnv === 'production') {
    if (!config.jwt.accessSecret || !config.jwt.refreshSecret) {
      console.error('JWT_ACCESS_SECRET and JWT_REFRESH_SECRET are required in production.')
      process.exit(1)
    }
  } else if (!config.jwt.accessSecret || !config.jwt.refreshSecret) {
    console.warn('Warning: JWT secrets are not set. Authentication will not work reliably.')
  }

  await connectDB()

  app.listen(config.port, () => {
    console.log(`Server running in ${config.nodeEnv} mode on port ${config.port}`)
    console.log(`API documentation available at http://localhost:${config.port}/api-docs`)
  })
}

startServer().catch((error) => {
  console.error('Failed to start server:', error.message)
  process.exit(1)
})

export default app
