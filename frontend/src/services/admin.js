import { API_URL, AI_URL } from '../config/api.js'

function authHeader() {
  const token = localStorage.getItem('accessToken')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function parseResponse(response) {
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || 'Request failed')
  }
  return data
}

export async function fetchAllUsers() {
  const response = await fetch(`${API_URL}/users`, {
    headers: authHeader(),
  })
  const data = await parseResponse(response)
  return data.data
}

export async function fetchAllReviews() {
  const response = await fetch(`${API_URL}/reviews`, {
    headers: authHeader(),
  })
  const data = await parseResponse(response)
  return data.data
}

export async function deleteUser(userId) {
  const response = await fetch(`${API_URL}/users/${userId}`, {
    method: 'DELETE',
    headers: authHeader(),
  })
  return parseResponse(response)
}

export async function deleteReview(reviewId) {
  const response = await fetch(`${API_URL}/reviews/${reviewId}`, {
    method: 'DELETE',
    headers: authHeader(),
  })
  return parseResponse(response)
}

export async function updateUserRole(userId, role) {
  const response = await fetch(`${API_URL}/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...authHeader(),
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
    status.database = data.database?.persistent ? 'mongodb (persistent)' : data.database?.mode || 'unknown'
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
