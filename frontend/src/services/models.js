import { API_URL } from '../config/api.js'
import { authFetch } from '../utils/authFetch.js'

async function parseResponse(response) {
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || 'Request failed')
  }
  return data
}

export async function fetchAllModels() {
  const response = await authFetch(`${API_URL}/admin/models`)
  const data = await parseResponse(response)
  return data.data
}

export async function promoteModel(id) {
  const response = await authFetch(`${API_URL}/admin/models/promote/${id}`, {
    method: 'POST'
  })
  const data = await parseResponse(response)
  return data.data
}
