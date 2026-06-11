import jwt from 'jsonwebtoken'
import config from '../config/index.js'
import userRepository from '../repositories/userRepository.js'

/**
 * Middleware to verify JWT access token and attach user to request.
 */
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    let token = null

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1]
    } else if (req.query && req.query.token) {
      // Fallback for SSE (EventSource) connections that cannot send custom headers
      token = req.query.token
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
      })
    }
    const decoded = jwt.verify(token, config.jwt.accessSecret)

    const user = await userRepository.findById(decoded.id)
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found.',
      })
    }

    req.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      assessment: user.assessment,
      twoFactorEnabled: user.twoFactorEnabled,
      createdAt: user.createdAt,
    }

    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired.',
      })
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid token.',
    })
  }
}

/**
 * Middleware to authorize based on user roles.
 * Usage: authorize('admin') or authorize('admin', 'user')
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action.',
      })
    }

    next()
  }
}
