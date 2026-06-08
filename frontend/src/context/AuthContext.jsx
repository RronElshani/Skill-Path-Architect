import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

const API_URL = 'http://localhost:5004/api'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Fetch current user session from the backend on startup
  useEffect(() => {
    async function checkSession() {
      const token = localStorage.getItem('accessToken')
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (response.ok) {
          const result = await response.json()
          setUser(result.data) // result.data contains { id, name, email, role }
        } else {
          // Token is invalid or expired
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
        }
      } catch (err) {
        console.error('Session check failed:', err)
      } finally {
        setLoading(false)
      }
    }

    checkSession()
  }, [])

  // Login handler
  const login = async (email, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || 'Login failed')
    }

    localStorage.setItem('accessToken', result.accessToken)
    localStorage.setItem('refreshToken', result.refreshToken)
    setUser(result.user)
    return { success: true }
  }

  // Register handler
  const register = async (name, email, password) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password })
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || result.errors?.[0]?.message || 'Registration failed')
    }

    // Automatically log the user in after registration
    return await login(email, password)
  }

  // Logout handler
  const logout = async () => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      try {
        await fetch(`${API_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      } catch (err) {
        console.error('Logout request to server failed:', err)
      }
    }

    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    // Optionally clear local assessment data too:
    localStorage.removeItem('career_predictions')
    setUser(null)
  }

  const updateUser = (updatedFields) => {
    setUser(prev => prev ? { ...prev, ...updatedFields } : null)
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    apiUrl: API_URL
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
