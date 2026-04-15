import axios from 'axios'
import authService from './authService'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor — attach access token
api.interceptors.request.use(
  (config) => {
    const token = authService.getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor — handle 401 and try refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const newToken = await authService.refreshAccessToken()
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return api(originalRequest)
      }
    }

    return Promise.reject(error)
  }
)

export default api
