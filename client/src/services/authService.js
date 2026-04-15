import api from './api'

const TOKEN_KEY = 'accessToken'
const REFRESH_KEY = 'refreshToken'
const USER_KEY = 'user'

const authService = {
  async register(userData) {
    const response = await api.post('/auth/register', userData)
    return response.data
  },

  async login(credentials) {
    const response = await api.post('/auth/login', credentials)
    const { accessToken, refreshToken, user } = response.data

    localStorage.setItem(TOKEN_KEY, accessToken)
    localStorage.setItem(REFRESH_KEY, refreshToken)
    localStorage.setItem(USER_KEY, JSON.stringify(user))

    return response.data
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_KEY)
    localStorage.removeItem(USER_KEY)
  },

  getAccessToken() {
    return localStorage.getItem(TOKEN_KEY)
  },

  getRefreshToken() {
    return localStorage.getItem(REFRESH_KEY)
  },

  getCurrentUser() {
    const user = localStorage.getItem(USER_KEY)
    return user ? JSON.parse(user) : null
  },

  async refreshAccessToken() {
    const refreshToken = this.getRefreshToken()
    if (!refreshToken) return null

    try {
      const response = await api.post('/auth/refresh-token', { refreshToken })
      const { accessToken } = response.data

      localStorage.setItem(TOKEN_KEY, accessToken)
      return accessToken
    } catch {
      this.logout()
      return null
    }
  },
}

export default authService
