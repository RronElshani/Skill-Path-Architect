/**
 * Global error handling middleware.
 * Catches errors from controllers/services and returns a uniform JSON response.
 */
const errorHandler = (err, req, res, _next) => {
  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal Server Error'

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error(`[ERROR] ${statusCode} - ${message}`)
    console.error(err.stack)
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message)
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: messages,
    })
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]
    return res.status(409).json({
      success: false,
      message: `Duplicate value for field: ${field}`,
    })
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Invalid ${err.path}: ${err.value}`,
    })
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}

export default errorHandler
