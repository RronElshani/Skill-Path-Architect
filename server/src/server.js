import express from 'express'
import cors from 'cors'
import config from './config/index.js'
import connectDB from './config/db.js'
import routes from './routes/index.js'
import errorHandler from './middleware/errorHandler.js'

// Connect to MongoDB
connectDB()

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

// ——— Routes ———
app.use('/api', routes)

// ——— Error Handler (must be last) ———
app.use(errorHandler)

// ——— Start Server ———
app.listen(config.port, () => {
  console.log(`Server running in ${config.nodeEnv} mode on port ${config.port}`)
})

export default app
