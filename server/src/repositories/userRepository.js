import User from '../models/User.js'

/**
 * Repository layer — isolates all database operations for Users.
 * Services never call Mongoose directly; they go through this layer.
 */
const userRepository = {
  async create(userData) {
    const user = new User(userData)
    return await user.save()
  },

  async findByEmail(email, includePassword = false) {
    const query = User.findOne({ email })
    if (includePassword) {
      query.select('+password')
    }
    return await query
  },

  async findById(id, includePassword = false) {
    const query = User.findById(id)
    if (includePassword) {
      query.select('+password')
    }
    return await query
  },

  async findByIdWithRefreshToken(id) {
    return await User.findById(id).select('+refreshToken')
  },

  async updateRefreshToken(id, refreshToken) {
    return await User.findByIdAndUpdate(id, { refreshToken }, { new: true })
  },

  async findAll() {
    return await User.find()
  },

  async updateById(id, updateData) {
    return await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
  },

  async updateAssessment(id, assessment) {
    return await User.findByIdAndUpdate(
      id,
      { assessment },
      { new: true, runValidators: true }
    )
  },

  async deleteById(id) {
    return await User.findByIdAndDelete(id)
  },
}

export default userRepository
