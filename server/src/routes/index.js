import { Router } from 'express'
import authRoutes from './authRoutes.js'
import userRoutes from './userRoutes.js'

const router = Router()

router.use('/auth', authRoutes)
router.use('/users', userRoutes)

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  })
})

export default router
