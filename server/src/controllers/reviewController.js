import reviewService from '../services/reviewService.js'

/**
 * Controller layer — handles HTTP requests/responses for reviews.
 * No business logic here; everything delegates to reviewService.
 */
const reviewController = {
  async submit(req, res, next) {
    try {
      const review = await reviewService.submitReview(req.user.id, req.body)
      res.status(201).json({
        success: true,
        message: 'Review submitted successfully',
        data: review,
      })
    } catch (error) {
      next(error)
    }
  },

  async getMine(req, res, next) {
    try {
      const reviews = await reviewService.getMyReviews(req.user.id)
      res.status(200).json({
        success: true,
        data: reviews,
      })
    } catch (error) {
      next(error)
    }
  },

  async getAll(req, res, next) {
    try {
      const reviews = await reviewService.getAllReviews()
      res.status(200).json({
        success: true,
        data: reviews,
      })
    } catch (error) {
      next(error)
    }
  },

  async getPublic(req, res, next) {
    try {
      const reviews = await reviewService.getPublicReviews()
      res.status(200).json({
        success: true,
        data: reviews,
      })
    } catch (error) {
      next(error)
    }
  },

  async deleteReview(req, res, next) {
    try {
      await reviewService.deleteReview(req.params.id)
      res.status(200).json({
        success: true,
        message: 'Review deleted successfully',
      })
    } catch (error) {
      next(error)
    }
  },
}

export default reviewController
