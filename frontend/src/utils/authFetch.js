import { API_URL } from '../config/api.js'

let refreshPromise = null
let onSessionExpired = null

export function setSessionExpiredHandler(handler) {
  onSessionExpired = handler
}

async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refreshToken')
  if (!refreshToken) return { token: null, invalid: true }

  try {
    const response = await fetch(`${API_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })

    if (!response.ok) return { token: null, invalid: true }

    const data = await response.json()
    if (!data.accessToken) return { token: null, invalid: true }

    localStorage.setItem('accessToken', data.accessToken)
    return { token: data.accessToken, invalid: false }
  } catch {
    return { token: null, invalid: false }
  }
}

/** Restore access token on startup when only the refresh token remains. */
export async function restoreAccessToken() {
  if (localStorage.getItem('accessToken')) {
    return localStorage.getItem('accessToken')
  }
  const result = await refreshAccessToken()
  return result.token
}

/**
 * fetch wrapper that attaches the access token and retries once after refresh on 401.
 */
export async function authFetch(url, options = {}) {
  const accessToken = localStorage.getItem('accessToken')
  const headers = { ...options.headers }

  if (accessToken && !headers.Authorization) {
    headers.Authorization = `Bearer ${accessToken}`
  }

  let response = await fetch(url, { ...options, headers })

  const shouldRetry =
    response.status === 401 &&
    localStorage.getItem('refreshToken') &&
    !url.endsWith('/auth/refresh-token')

  if (shouldRetry) {
    if (!refreshPromise) {
      refreshPromise = refreshAccessToken().finally(() => {
        refreshPromise = null
      })
    }

    const { token: newToken, invalid } = await refreshPromise

    if (newToken) {
      response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${newToken}`,
        },
      })
    } else if (invalid) {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      onSessionExpired?.()
    }
  }

  return response
}
