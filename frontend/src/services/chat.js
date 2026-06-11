import { API_URL } from '../config/api.js'
import { authFetch } from '../utils/authFetch.js'

// Client for the Express counseling chatbot gateway (which relays to the Flask LLM agent).

export async function sendChatMessage({ question, sessionId }) {
  const response = await authFetch(`${API_URL}/chat/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, sessionId }),
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || data.error || 'Failed to send message')
  }
  return data.data
}

export async function fetchChatSessions() {
  const response = await authFetch(`${API_URL}/chat/sessions`)

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch chat sessions')
  }
  return data.data
}

export async function fetchChatMessages(sessionId) {
  const response = await authFetch(`${API_URL}/chat/sessions/${sessionId}/messages`)

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch chat history')
  }
  return data.data
}

export async function deleteChatSession(sessionId) {
  const response = await authFetch(`${API_URL}/chat/sessions/${sessionId}`, {
    method: 'DELETE',
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete chat session')
  }
  return true
}
