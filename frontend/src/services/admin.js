import { API_URL, AI_URL } from '../config/api.js'
import { authFetch } from '../utils/authFetch.js'

async function parseResponse(response) {
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || 'Request failed')
  }
  return data
}

export async function fetchAllUsers() {
  const response = await authFetch(`${API_URL}/users`)
  const data = await parseResponse(response)
  return data.data
}

export async function fetchAllReviews() {
  const response = await authFetch(`${API_URL}/reviews`)
  const data = await parseResponse(response)
  return data.data
}

export async function deleteUser(userId) {
  const response = await authFetch(`${API_URL}/users/${userId}`, {
    method: 'DELETE',
  })
  return parseResponse(response)
}

export async function deleteReview(reviewId) {
  const response = await authFetch(`${API_URL}/reviews/${reviewId}`, {
    method: 'DELETE',
  })
  return parseResponse(response)
}

export async function updateUserRole(userId, role) {
  const response = await authFetch(`${API_URL}/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ role }),
  })
  const data = await parseResponse(response)
  return data.data
}

export async function checkServicesHealth() {
  const status = { api: 'offline', ai: 'offline', database: 'unknown' }

  try {
    const response = await fetch(`${API_URL}/health`)
    const data = await response.json()
    status.api = response.ok ? 'online' : 'degraded'
    const db = data.database
    if (db?.nameMatches === false) {
      status.database = `${db?.name} (expected ${db?.expectedName})`
    } else {
      status.database = db?.persistent ? `mongodb (${db?.expectedName || db?.name})` : db?.mode || 'unknown'
    }
  } catch {
    status.api = 'offline'
  }

  try {
    const response = await fetch(`${AI_URL}/api/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })
    status.ai = response.status === 500 || response.status === 400 ? 'online' : response.ok ? 'online' : 'degraded'
  } catch {
    status.ai = 'offline'
  }

  return status
}

export async function fetchAdminDashboard() {
  const [users, reviews, services] = await Promise.all([
    fetchAllUsers(),
    fetchAllReviews(),
    checkServicesHealth(),
  ])
  return { users, reviews, services }
}
