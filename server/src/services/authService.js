import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import config from '../config/index.js'
import userRepository from '../repositories/userRepository.js'
import { sendResetCodeEmail } from './emailService.js'

/**
 * Service layer — contains all business logic for authentication.
 * Controllers never contain business logic; they delegate to services.
 */
const authService = {
  async register({ name, email, password }) {
    // Check if user already exists
    const existingUser = await userRepository.findByEmail(email)
    if (existingUser) {
      const error = new Error('User with this email already exists')
      error.statusCode = 409
      throw error
    }

    // Hash password (never store plain text)
    const salt = await bcrypt.genSalt(12)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create user via repository
    const user = await userRepository.create({
      name,
      email,
      password: hashedPassword,
      role: 'user',
    })

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    }
  },

  async login({ email, password }) {
    // Find user with password included
    const user = await userRepository.findByEmail(email, true)
    if (!user) {
      const error = new Error('Invalid email or password')
      error.statusCode = 401
      throw error
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      const error = new Error('Invalid email or password')
      error.statusCode = 401
      throw error
    }

    // Generate tokens
    const accessToken = this.generateAccessToken(user)
    const refreshToken = this.generateRefreshToken(user)

    // Store refresh token in DB
    await userRepository.updateRefreshToken(user._id, refreshToken)

    return {
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        assessment: user.assessment,
        twoFactorEnabled: user.twoFactorEnabled,
        createdAt: user.createdAt,
      },
    }
  },

  async refreshToken(refreshToken) {
    if (!refreshToken) {
      const error = new Error('Refresh token is required')
      error.statusCode = 400
      throw error
    }

    // Verify refresh token
    let decoded
    try {
      decoded = jwt.verify(refreshToken, config.jwt.refreshSecret)
    } catch {
      const error = new Error('Invalid or expired refresh token')
      error.statusCode = 401
      throw error
    }

    // Check if refresh token matches stored one
    const user = await userRepository.findByIdWithRefreshToken(decoded.id)
    if (!user || user.refreshToken !== refreshToken) {
      const error = new Error('Invalid refresh token')
      error.statusCode = 401
      throw error
    }

    // Generate new access token
    const accessToken = this.generateAccessToken(user)

    return { accessToken }
  },

  async logout(userId) {
    await userRepository.updateRefreshToken(userId, null)
  },

  async forgotPassword(email) {
    const normalizedEmail = email.trim().toLowerCase()
    const user = await userRepository.findByEmail(normalizedEmail)
    if (!user) {
      const error = new Error('User with this email does not exist')
      error.statusCode = 404
      throw error
    }

    // Generate random 4-digit code
    const code = Math.floor(1000 + Math.random() * 9000).toString()
    const expires = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

    await userRepository.updateById(user._id, {
      resetPasswordCode: code,
      resetPasswordExpires: expires,
    })

    await sendResetCodeEmail(user.email, code)
    return { success: true }
  },

  async resetPassword(email, code, newPassword) {
    const normalizedEmail = email.trim().toLowerCase()
    const user = await userRepository.findByEmail(normalizedEmail, true)
    if (!user) {
      const error = new Error('User with this email does not exist')
      error.statusCode = 404
      throw error
    }

    if (!user.resetPasswordCode || user.resetPasswordCode !== code) {
      const error = new Error('Invalid verification code')
      error.statusCode = 400
      throw error
    }

    if (new Date() > user.resetPasswordExpires) {
      const error = new Error('Verification code has expired')
      error.statusCode = 400
      throw error
    }

    // Hash new password
    const salt = await bcrypt.genSalt(12)
    const hashedPassword = await bcrypt.hash(newPassword, salt)

    // Update password and clear reset fields
    await userRepository.updateById(user._id, {
      password: hashedPassword,
      resetPasswordCode: null,
      resetPasswordExpires: null,
    })

    return { success: true }
  },

  generateAccessToken(user) {
    return jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      config.jwt.accessSecret,
      { expiresIn: config.jwt.accessExpiry }
    )
  },

  generateRefreshToken(user) {
    return jwt.sign(
      { id: user._id },
      config.jwt.refreshSecret,
      { expiresIn: config.jwt.refreshExpiry }
    )
  },
}

export default authService
