import chatService from '../services/chatService.js'

/**
 * Controller layer — handles HTTP requests/responses for the counseling chatbot.
 * No business logic here; everything delegates to chatService.
 */
const chatController = {
  async sendMessage(req, res, next) {
    try {
      const result = await chatService.sendMessage(req.user.id, req.body)
      res.status(201).json({
        success: true,
        data: result,
      })
    } catch (error) {
      next(error)
    }
  },

  async getSessions(req, res, next) {
    try {
      const sessions = await chatService.getSessions(req.user.id)
      res.status(200).json({
        success: true,
        data: sessions,
      })
    } catch (error) {
      next(error)
    }
  },

  async getMessages(req, res, next) {
    try {
      const messages = await chatService.getMessages(req.user.id, req.params.sessionId)
      res.status(200).json({
        success: true,
        data: messages,
      })
    } catch (error) {
      next(error)
    }
  },

  async deleteSession(req, res, next) {
    try {
      await chatService.deleteSession(req.user.id, req.params.sessionId)
      res.status(200).json({
        success: true,
        message: 'Chat session deleted successfully',
      })
    } catch (error) {
      next(error)
    }
  },
}

export default chatController
