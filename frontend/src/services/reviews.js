// Client for the Express review endpoints.
// Reviews capture how satisfied the user was with the model's predictions.

const API_URL = 'http://localhost:5004/api'

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
