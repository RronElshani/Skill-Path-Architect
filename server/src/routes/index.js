import { Router } from 'express'
import mongoose from 'mongoose'
import authRoutes from './authRoutes.js'
import userRoutes from './userRoutes.js'
import reviewRoutes from './reviewRoutes.js'
import config from '../config/index.js'
import { dbStorageMode, usingInMemoryDb } from '../config/db.js'

const router = Router()

router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/reviews', reviewRoutes)

// Health check
router.get('/health', (req, res) => {
  const dbState = mongoose.connection.readyState
  const dbStatus = dbState === 1 ? 'connected' : dbState === 2 ? 'connecting' : 'disconnected'
  const persistent = dbStorageMode === 'remote' || dbStorageMode === 'local-file'

  res.status(dbState === 1 ? 200 : 503).json({
    success: dbState === 1,
    message: dbState === 1 ? 'API is running' : 'API is up but database is not ready',
    timestamp: new Date().toISOString(),
    database: {
      status: dbStatus,
      name: mongoose.connection.name || null,
      expectedName: config.mongodbDatabase,
      nameMatches: mongoose.connection.name === config.mongodbDatabase,
      host: mongoose.connection.host || null,
      persistent,
      mode: dbStorageMode,
      legacyInMemoryFlag: usingInMemoryDb,
    },
  })
})

export default router
