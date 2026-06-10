import { API_URL } from '../config/api.js'
import { authFetch } from '../utils/authFetch.js'

/** Update the signed-in user's identity / preferences (name, email, twoFactorEnabled). */
export async function updateProfile(fields) {
  const response = await authFetch(`${API_URL}/users/me`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(fields),
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || data.errors?.[0]?.message || 'Failed to update profile')
  }
  return data.data
}

/** Change the signed-in user's password (verifies the current one server-side). */
export async function changePassword({ currentPassword, newPassword }) {
  const response = await authFetch(`${API_URL}/users/me/password`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ currentPassword, newPassword }),
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || data.errors?.[0]?.message || 'Failed to change password')
  }
  return true
}

/** Convenience wrapper for the 2FA preference toggle. */
export function setTwoFactor(enabled) {
  return updateProfile({ twoFactorEnabled: enabled })
}
