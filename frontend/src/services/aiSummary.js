import { AI_URL } from '../config/api.js'

// Client for the Flask LLM summary endpoint.
const CACHE_KEY = 'llm_summary'

export async function fetchLlmSummary(predictions, scores) {
  const response = await fetch(`${AI_URL}/api/summary`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ predictions, scores })
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.error || 'Failed to generate summary')
  }
  return data.summary
}

export function loadCachedSummary(predictionsTimestamp) {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const cached = JSON.parse(raw)
    // Invalidate the cache when the user retakes the assessment
    if (predictionsTimestamp && cached.predictionsTimestamp !== predictionsTimestamp) {
      return null
    }
    return cached.summary || null
  } catch {
    return null
  }
}

export function saveCachedSummary(summary, predictionsTimestamp) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      summary,
      predictionsTimestamp,
      generatedAt: new Date().toISOString()
    }))
  } catch {
    // Ignore quota errors
  }
}

export function clearCachedSummary() {
  localStorage.removeItem(CACHE_KEY)
}
