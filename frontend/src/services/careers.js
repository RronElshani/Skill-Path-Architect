import { API_URL } from '../config/api.js'

/**
 * URL-safe slug for a career name. Must match the backend seed slug rule
 * (server/scripts/seed-careers.js) so predicted career labels resolve to their
 * stored profile.
 */
export function slugifyCareer(name) {
  return String(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Fetch the career library list, with optional search / intelligence filter. */
export async function fetchCareers({ search, intelligence } = {}) {
  const qs = new URLSearchParams()
  if (search) qs.set('search', search)
  if (intelligence) qs.set('intelligence', intelligence)
  const suffix = qs.toString() ? `?${qs.toString()}` : ''

  const response = await fetch(`${API_URL}/careers${suffix}`)
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch careers')
  }
  return data.data
}

/** Fetch a single career profile (with linked educational pathway) by code. */
export async function fetchCareerByCode(code) {
  const response = await fetch(`${API_URL}/careers/${encodeURIComponent(code)}`)
  const data = await response.json()
  if (!response.ok) {
    const error = new Error(data.message || 'Failed to fetch career')
    error.status = response.status
    throw error
  }
  return data.data
}

/** Format a salary number as a clean currency string (e.g. "$105,000"). */
export function formatSalary(value, currency = 'USD') {
  if (value == null || Number.isNaN(Number(value))) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
    maximumFractionDigits: 0,
  }).format(Number(value))
}
