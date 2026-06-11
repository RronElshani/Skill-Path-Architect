import { Router } from 'express'
import careerController from '../controllers/careerController.js'

const router = Router()

// Public — the career library is browsable without login.
router.get('/', careerController.list)
router.get('/:code', careerController.getByCode)

export default router
