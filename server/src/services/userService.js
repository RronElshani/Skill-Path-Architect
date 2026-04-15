import userRepository from '../repositories/userRepository.js'

/**
 * Service layer for user-related business logic.
 */
const userService = {
  async getUserById(id) {
    const user = await userRepository.findById(id)
    if (!user) {
      const error = new Error('User not found')
      error.statusCode = 404
      throw error
    }
    return user
  },

  async getAllUsers() {
    return await userRepository.findAll()
  },

  async updateUser(id, updateData) {
    const user = await userRepository.updateById(id, updateData)
    if (!user) {
      const error = new Error('User not found')
      error.statusCode = 404
      throw error
    }
    return user
  },

  async deleteUser(id) {
    const user = await userRepository.deleteById(id)
    if (!user) {
      const error = new Error('User not found')
      error.statusCode = 404
      throw error
    }
    return user
  },
}

export default userService
