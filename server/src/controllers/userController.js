import userService from '../services/userService.js'

/**
 * Controller layer — handles HTTP requests/responses for user operations.
 * No business logic here; everything delegates to userService.
 */
const userController = {
  async getAllUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers()
      res.status(200).json({
        success: true,
        data: users,
      })
    } catch (error) {
      next(error)
    }
  },

  async getUserById(req, res, next) {
    try {
      const user = await userService.getUserById(req.params.id)
      res.status(200).json({
        success: true,
        data: user,
      })
    } catch (error) {
      next(error)
    }
  },

  async updateUser(req, res, next) {
    try {
      const user = await userService.updateUser(req.params.id, req.body)
      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: user,
      })
    } catch (error) {
      next(error)
    }
  },

  async updateMe(req, res, next) {
    try {
      const user = await userService.updateMe(req.user.id, req.body)
      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: user,
      })
    } catch (error) {
      next(error)
    }
  },

  async changePassword(req, res, next) {
    try {
      await userService.changePassword(req.user.id, req.body)
      res.status(200).json({
        success: true,
        message: 'Password updated successfully',
      })
    } catch (error) {
      next(error)
    }
  },

  async deleteUser(req, res, next) {
    try {
      await userService.deleteUser(req.params.id)
      res.status(200).json({
        success: true,
        message: 'User deleted successfully',
      })
    } catch (error) {
      next(error)
    }
  },

  async saveAssessment(req, res, next) {
    try {
      const assessment = await userService.saveAssessment(req.user.id, req.body)
      res.status(200).json({
        success: true,
        message: 'Assessment saved successfully',
        data: assessment,
      })
    } catch (error) {
      next(error)
    }
  },

  async getAssessment(req, res, next) {
    try {
      const assessment = await userService.getAssessment(req.user.id)
      res.status(200).json({
        success: true,
        data: assessment,
      })
    } catch (error) {
      next(error)
    }
  },
}

export default userController
