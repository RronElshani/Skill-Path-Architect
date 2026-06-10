import { Router } from 'express'
import authController from '../controllers/authController.js'
import { authenticate } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import {
  registerValidation,
  loginValidation,
  refreshTokenValidation,
} from '../validators/authValidator.js'

const router = Router()

// Public routes
router.post('/register', registerValidation, validate, authController.register)
router.post('/login', loginValidation, validate, authController.login)
router.post('/refresh-token', refreshTokenValidation, validate, authController.refreshToken)

// Protected routes
router.post('/logout', authenticate, authController.logout)
router.get('/me', authenticate, authController.getMe)

export default router
