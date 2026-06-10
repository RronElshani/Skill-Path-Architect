import { Router } from 'express'
import reviewController from '../controllers/reviewController.js'
import { authenticate, authorize } from '../middleware/auth.js'
import { submitReviewValidation, validate } from '../validators/reviewValidator.js'

const router = Router()

// Public — no login required
router.get('/public', reviewController.getPublic)

// Authenticated routes
router.use(authenticate)

// User actions
router.post('/', submitReviewValidation, validate, reviewController.submit)
router.get('/mine', reviewController.getMine)

// Admin-only actions
router.get('/', authorize('admin'), reviewController.getAll)
router.delete('/:id', authorize('admin'), reviewController.deleteReview)

export default router
