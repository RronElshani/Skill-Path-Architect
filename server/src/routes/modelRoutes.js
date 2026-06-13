import { Router } from 'express'
import modelController from '../controllers/modelController.js'
import { authenticate, authorize } from '../middleware/auth.js'

const router = Router()

// All routes here require administrator permissions
router.use(authenticate, authorize('admin'))

router.get('/', modelController.getAllExperiments)
router.get('/train', modelController.trainModel) // GET used for SSE streaming
router.post('/promote/:id', modelController.promoteModel)

export default router
