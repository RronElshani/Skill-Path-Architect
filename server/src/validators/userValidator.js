import { body, param } from 'express-validator'
import { ASSESSMENT_DIMENSIONS } from '../constants/assessmentDimensions.js'

export const mongoIdParam = [
  param('id')
    .isMongoId()
    .withMessage('Invalid user id'),
]

export const adminUpdateUserValidation = [
  ...mongoIdParam,
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .escape(),
  body('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Role must be user or admin'),
  body()
    .custom((value) => {
      if (value.name === undefined && value.role === undefined) {
        throw new Error('At least one of name or role is required')
      }
      return true
    }),
]

export const updateMeValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('twoFactorEnabled')
    .optional()
    .isBoolean()
    .withMessage('twoFactorEnabled must be a boolean')
    .toBoolean(),
  body().custom((value) => {
    if (value.name === undefined && value.email === undefined && value.twoFactorEnabled === undefined) {
      throw new Error('At least one of name, email or twoFactorEnabled is required')
    }
    return true
  }),
]

export const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters')
    .custom((value, { req }) => {
      if (value === req.body.currentPassword) {
        throw new Error('New password must be different from the current password')
      }
      return true
    }),
]

const dimensionRules = ASSESSMENT_DIMENSIONS.map((dim) =>
  body(dim)
    .exists({ checkNull: true })
    .withMessage(`${dim} is required`)
    .isFloat({ min: 1, max: 5 })
    .withMessage(`${dim} must be a number between 1 and 5`)
)

export const assessmentValidation = dimensionRules
