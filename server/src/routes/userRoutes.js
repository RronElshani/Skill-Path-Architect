import { Router } from 'express'
import userController from '../controllers/userController.js'
import { authenticate, authorize } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import {
  assessmentValidation,
  adminUpdateUserValidation,
  updateMeValidation,
  changePasswordValidation,
} from '../validators/userValidator.js'

const router = Router()

// All user routes require authentication
router.use(authenticate)

// Self-service profile routes (must precede the admin "/:id" routes)
router.patch('/me', updateMeValidation, validate, userController.updateMe)
router.patch('/me/password', changePasswordValidation, validate, userController.changePassword)

// User assessment routes
router.post('/assessment', assessmentValidation, validate, userController.saveAssessment)
router.get('/assessment', userController.getAssessment)

// Admin-only routes
router.get('/', authorize('admin'), userController.getAllUsers)
router.get('/:id', authorize('admin'), userController.getUserById)
router.put('/:id', authorize('admin'), adminUpdateUserValidation, validate, userController.updateUser)
router.delete('/:id', authorize('admin'), userController.deleteUser)

export default router
