import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { API_URL } from '../config/api.js'
import { authFetch, setSessionExpiredHandler, restoreAccessToken } from '../utils/authFetch.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const clearSession = useCallback(() => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    setUser(null)
  }, [])

  useEffect(() => {
    setSessionExpiredHandler(clearSession)
    return () => setSessionExpiredHandler(null)
  }, [clearSession])

  useEffect(() => {
    async function checkSession() {
      const accessToken = localStorage.getItem('accessToken')
      const refreshToken = localStorage.getItem('refreshToken')

      if (!accessToken && !refreshToken) {
        setLoading(false)
        return
      }

      try {
        if (!accessToken && refreshToken) {
          await restoreAccessToken()
        }

        const response = await authFetch(`${API_URL}/auth/me`)

        if (response.ok) {
          const result = await response.json()
          setUser(result.data)
        } else if (response.status === 401) {
          clearSession()
        }
        // Keep tokens on 503/5xx so a brief server/DB startup blip does not log users out
      } catch (err) {
        console.error('Session check failed:', err)
      } finally {
        setLoading(false)
      }
    }

    checkSession()
  }, [clearSession])

  const login = async (email, password) => {
    const normalizedEmail = email.trim().toLowerCase()

    let response
    try {
      response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: normalizedEmail, password }),
      })
    } catch {
      throw new Error(
        `Cannot reach the API at ${API_URL}. Make sure the backend is running (npm run dev) and MongoDB has started.`
      )
    }

    const result = await response.json()

    if (!response.ok) {
      const hint =
        response.status === 401
          ? ' If you recently restarted the server, your account may have been cleared — try registering again.'
          : ''
      throw new Error((result.message || 'Login failed') + hint)
    }

    if (!result.user?.assessment?.completedAt) {
      localStorage.removeItem('career_predictions')
      localStorage.removeItem('summary_reviewed')
    }

    localStorage.setItem('accessToken', result.accessToken)
    localStorage.setItem('refreshToken', result.refreshToken)
    setUser(result.user)
    return { success: true, user: result.user }
  }

  const register = async (name, email, password) => {
    const normalizedEmail = email.trim().toLowerCase()

    let response
    try {
      response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email: normalizedEmail, password }),
      })
    } catch {
      throw new Error(
        `Cannot reach the API at ${API_URL}. Make sure the backend is running (npm run dev) and MongoDB has started.`
      )
    }

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || result.errors?.[0]?.message || 'Registration failed')
    }

    return await login(normalizedEmail, password)
  }

  const logout = async () => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      try {
        await authFetch(`${API_URL}/auth/logout`, {
          method: 'POST',
        })
      } catch (err) {
        console.error('Logout request to server failed:', err)
      }
    }

    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('career_predictions')
    setUser(null)
  }

  const updateUser = (updatedFields) => {
    setUser((prev) => (prev ? { ...prev, ...updatedFields } : null))
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    authFetch,
    apiUrl: API_URL,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
