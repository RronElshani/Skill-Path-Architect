import Review from '../models/Review.js'

/**
 * Repository layer — isolates all database operations for Reviews.
 * Services never call Mongoose directly; they go through this layer.
 */
const reviewRepository = {
  async create(reviewData) {
    const review = new Review(reviewData)
    return await review.save()
  },

  async findByUserId(userId) {
    return await Review.find({ user: userId }).sort({ createdAt: -1 })
  },

  async findAll() {
    return await Review.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
  },

  async deleteById(id) {
    return await Review.findByIdAndDelete(id)
  },
}

export default reviewRepository
