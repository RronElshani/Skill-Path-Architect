import { Navigate } from 'react-router-dom'
import authService from '../services/authService'

const ProtectedRoute = ({ children }) => {
  const token = authService.getAccessToken()

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
