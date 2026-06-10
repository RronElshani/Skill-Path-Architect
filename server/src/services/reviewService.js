import reviewRepository from '../repositories/reviewRepository.js'

/**
 * Service layer for user satisfaction reviews on model predictions.
 */
const reviewService = {
  async submitReview(userId, { rating, satisfied, comment, predictions }) {
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      const error = new Error('Rating must be a number between 1 and 5')
      error.statusCode = 400
      throw error
    }

    if (typeof satisfied !== 'boolean') {
      const error = new Error('Satisfied flag must be a boolean')
      error.statusCode = 400
      throw error
    }

    return await reviewRepository.create({
      user: userId,
      rating,
      satisfied,
      comment: comment || '',
      predictions: Array.isArray(predictions) ? predictions : [],
    })
  },

  async getMyReviews(userId) {
    return await reviewRepository.findByUserId(userId)
  },

  async getAllReviews() {
    return await reviewRepository.findAll()
  },

  formatPublicName(name) {
    if (!name?.trim()) return 'A student'
    const parts = name.trim().split(/\s+/)
    if (parts.length === 1) return parts[0]
    return `${parts[0]} ${parts[parts.length - 1][0]}.`
  },

  toPublicReview(review) {
    return {
      id: review._id,
      displayName: this.formatPublicName(review.user?.name),
      rating: review.rating,
      satisfied: review.satisfied,
      comment: review.comment || '',
      topCareer: review.predictions?.[0]?.career || null,
      createdAt: review.createdAt,
    }
  },

  async getPublicReviews() {
    const reviews = await reviewRepository.findAll()
    return reviews.map((review) => this.toPublicReview(review))
  },

  async deleteReview(id) {
    const review = await reviewRepository.deleteById(id)
    if (!review) {
      const error = new Error('Review not found')
      error.statusCode = 404
      throw error
    }
    return review
  },
}

export default reviewService
