import ChatSession from '../models/ChatSession.js'
import ChatMessage from '../models/ChatMessage.js'

/**
 * Repository layer — isolates all database operations for counseling chats.
 * Services never call Mongoose directly; they go through this layer.
 */
const chatRepository = {
  async createSession(sessionData) {
    const session = new ChatSession(sessionData)
    return await session.save()
  },

  async findSessionById(id) {
    return await ChatSession.findById(id)
  },

  async findSessionsByUserId(userId) {
    return await ChatSession.find({ userId }).sort({ lastMessageAt: -1 })
  },

  async touchSession(id) {
    return await ChatSession.findByIdAndUpdate(
      id,
      { lastMessageAt: new Date() },
      { new: true }
    )
  },

  async deleteSessionById(id) {
    return await ChatSession.findByIdAndDelete(id)
  },

  async createMessage(messageData) {
    const message = new ChatMessage(messageData)
    return await message.save()
  },

  async findMessagesBySession(sessionId) {
    return await ChatMessage.find({ sessionId }).sort({ createdAt: 1 })
  },

  async deleteMessagesBySession(sessionId) {
    return await ChatMessage.deleteMany({ sessionId })
  },
}

export default chatRepository
