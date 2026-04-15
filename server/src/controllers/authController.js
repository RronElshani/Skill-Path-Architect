import authService from '../services/authService.js'

/**
 * Controller layer — handles HTTP requests/responses only.
 * No business logic here; everything is delegated to the service layer.
 */
const authController = {
  async register(req, res, next) {
    try {
      const user = await authService.register(req.body)
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: user,
      })
    } catch (error) {
      next(error)
    }
  },

  async login(req, res, next) {
    try {
      const result = await authService.login(req.body)
      res.status(200).json({
        success: true,
        message: 'Login successful',
        ...result,
      })
    } catch (error) {
      next(error)
    }
  },

  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body
      const result = await authService.refreshToken(refreshToken)
      res.status(200).json({
        success: true,
        ...result,
      })
    } catch (error) {
      next(error)
    }
  },

  async logout(req, res, next) {
    try {
      await authService.logout(req.user.id)
      res.status(200).json({
        success: true,
        message: 'Logged out successfully',
      })
    } catch (error) {
      next(error)
    }
  },

  async getMe(req, res, next) {
    try {
      res.status(200).json({
        success: true,
        data: req.user,
      })
    } catch (error) {
      next(error)
    }
  },
}

export default authController
