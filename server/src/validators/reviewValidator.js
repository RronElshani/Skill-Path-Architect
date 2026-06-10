import { body } from 'express-validator'

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
