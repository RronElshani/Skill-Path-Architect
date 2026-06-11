import { Router } from 'express'
import chatController from '../controllers/chatController.js'
import { authenticate } from '../middleware/auth.js'
import { sendMessageValidation } from '../validators/chatValidator.js'
import { validate } from '../middleware/validate.js'

const router = Router()

// All chat routes require authentication
router.use(authenticate)

// Send a message to the counselor (auto-creates a session when none is provided)
router.post('/messages', sendMessageValidation, validate, chatController.sendMessage)

// Session management & history
router.get('/sessions', chatController.getSessions)
router.get('/sessions/:sessionId/messages', chatController.getMessages)
router.delete('/sessions/:sessionId', chatController.deleteSession)

export default router
