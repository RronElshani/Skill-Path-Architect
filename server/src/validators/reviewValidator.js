import { body, validationResult } from 'express-validator'

/**
 * Middleware that checks validation results and returns errors if any.
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    })
  }
  next()
}

/**
 * Validation rules for submitting a satisfaction review on predictions.
 */
export const submitReviewValidation = [
  body('rating')
    .notEmpty()
    .withMessage('Rating is required')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be an integer between 1 and 5'),
  body('satisfied')
    .exists({ checkNull: true })
    .withMessage('Satisfied flag is required')
    .isBoolean()
    .withMessage('Satisfied must be a boolean'),
  body('comment')
    .optional()
    .isString()
    .withMessage('Comment must be a string')
    .isLength({ max: 1000 })
    .withMessage('Comment cannot exceed 1000 characters')
    .trim()
    .escape(),
  body('predictions')
    .optional()
    .isArray()
    .withMessage('Predictions must be an array'),
]
