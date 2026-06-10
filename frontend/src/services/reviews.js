import { API_URL } from '../config/api.js'

// Client for the Express review endpoints.

function authHeader() {
  const token = localStorage.getItem('accessToken')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function submitReview({ rating, satisfied, comment, predictions }) {
  const response = await fetch(`${API_URL}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeader(),
    },
    body: JSON.stringify({ rating, satisfied, comment, predictions }),
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || 'Failed to submit review')
  }
  return data.data
}

export async function getMyReviews() {
  const response = await fetch(`${API_URL}/reviews/mine`, {
    headers: authHeader(),
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch reviews')
  }
  return data.data
}

export async function fetchPublicReviews() {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch(`${API_URL}/reviews/public`)
      const data = await response.json()

      if (response.status === 503 && attempt < 2) {
        await new Promise((resolve) => setTimeout(resolve, 1500))
        continue
      }

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch reviews')
      }

      return data.data
    } catch (err) {
      if (attempt === 2) throw err
      await new Promise((resolve) => setTimeout(resolve, 1500))
    }
  }

  return []
}
