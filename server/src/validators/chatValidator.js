import { body } from 'express-validator'

/**
 * Validation rules for sending a message to the career counselor chatbot.
 */
export const sendMessageValidation = [
  body('question')
    .notEmpty()
    .withMessage('Question is required')
    .isString()
    .withMessage('Question must be a string')
    .isLength({ max: 4000 })
    .withMessage('Question cannot exceed 4000 characters')
    .trim(),
  body('sessionId')
    .optional({ nullable: true, checkFalsy: true })
    .isMongoId()
    .withMessage('sessionId must be a valid id'),
]
