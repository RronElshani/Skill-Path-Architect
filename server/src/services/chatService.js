import chatRepository from '../repositories/chatRepository.js'
import userRepository from '../repositories/userRepository.js'

// Flask AI service exposing the LLM-backed counselor endpoint.
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:5001'

// Only the most recent messages are sent to the LLM to keep the prompt lean.
const MAX_CONTEXT_MESSAGES = 12

/**
 * Service layer for the interactive career counseling chatbot.
 * Fetches the user's assessment, contextualizes the conversation, relays it
 * to the Flask LLM agent, and persists the dialogue history.
 */
const chatService = {
  buildSessionTitle(question, predictions) {
    if (Array.isArray(predictions) && predictions.length > 0 && predictions[0].career) {
      return `Career chat regarding ${predictions[0].career}`
    }
    const trimmed = (question || '').trim()
    if (!trimmed) return 'Career counseling chat'
    return trimmed.length > 60 ? `${trimmed.slice(0, 57)}...` : trimmed
  },

  async resolveSession(userId, sessionId, question, predictions) {
    if (sessionId) {
      const session = await chatRepository.findSessionById(sessionId)
      if (!session || session.userId.toString() !== userId.toString()) {
        const error = new Error('Chat session not found')
        error.statusCode = 404
        throw error
      }
      return session
    }

    return await chatRepository.createSession({
      userId,
      title: this.buildSessionTitle(question, predictions),
    })
  },

  async requestCompletion(messages, scores, predictions) {
    try {
      const response = await fetch(`${AI_SERVICE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages, scores, predictions }),
      })

      const data = await response.json()
      if (!response.ok) {
        const error = new Error(data.error || 'AI counselor service failed')
        error.statusCode = response.status
        throw error
      }
      return data.reply
    } catch (err) {
      if (err.statusCode) throw err
      const error = new Error(`Failed to connect to AI counselor service: ${err.message}`)
      error.statusCode = 502
      throw error
    }
  },

  async sendMessage(userId, { question, sessionId }) {
    const trimmed = (question || '').trim()
    if (!trimmed) {
      const error = new Error('Question is required')
      error.statusCode = 400
      throw error
    }

    const user = await userRepository.findById(userId)
    if (!user) {
      const error = new Error('User not found')
      error.statusCode = 404
      throw error
    }

    const assessment = user.assessment || {}
    const scores = assessment.scores || {}
    const predictions = Array.isArray(assessment.predictions) ? assessment.predictions : []

    const session = await this.resolveSession(userId, sessionId, trimmed, predictions)

    // Persist the student's message before contacting the LLM.
    await chatRepository.createMessage({
      sessionId: session._id,
      sender: 'user',
      content: trimmed,
    })

    // Build the conversation context (recent history + the new question).
    const history = await chatRepository.findMessagesBySession(session._id)
    const contextMessages = history
      .slice(-MAX_CONTEXT_MESSAGES)
      .map((m) => ({ role: m.sender, content: m.content }))

    const reply = await this.requestCompletion(contextMessages, scores, predictions)

    const assistantMessage = await chatRepository.createMessage({
      sessionId: session._id,
      sender: 'assistant',
      content: reply,
    })

    await chatRepository.touchSession(session._id)

    return {
      sessionId: session._id,
      reply: assistantMessage,
    }
  },

  async getSessions(userId) {
    return await chatRepository.findSessionsByUserId(userId)
  },

  async getMessages(userId, sessionId) {
    const session = await chatRepository.findSessionById(sessionId)
    if (!session || session.userId.toString() !== userId.toString()) {
      const error = new Error('Chat session not found')
      error.statusCode = 404
      throw error
    }
    return await chatRepository.findMessagesBySession(sessionId)
  },

  async deleteSession(userId, sessionId) {
    const session = await chatRepository.findSessionById(sessionId)
    if (!session || session.userId.toString() !== userId.toString()) {
      const error = new Error('Chat session not found')
      error.statusCode = 404
      throw error
    }
    await chatRepository.deleteMessagesBySession(sessionId)
    await chatRepository.deleteSessionById(sessionId)
    return session
  },
}

export default chatService
