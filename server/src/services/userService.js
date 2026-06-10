import userRepository from '../repositories/userRepository.js'
import { ASSESSMENT_DIMENSIONS } from '../constants/assessmentDimensions.js'

const ADMIN_UPDATABLE_FIELDS = ['name', 'role']

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
    const allowed = {}
    for (const field of ADMIN_UPDATABLE_FIELDS) {
      if (updateData[field] !== undefined) {
        allowed[field] = updateData[field]
      }
    }

    if (Object.keys(allowed).length === 0) {
      const error = new Error('No valid fields to update. Allowed: name, role')
      error.statusCode = 400
      throw error
    }

    const user = await userRepository.updateById(id, allowed)
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

  async saveAssessment(userId, rawScores) {
    for (const dim of ASSESSMENT_DIMENSIONS) {
      if (rawScores[dim] === undefined) {
        const error = new Error(`Missing value for dimension: ${dim}`)
        error.statusCode = 400
        throw error
      }
    }

    const preprocessedPayload = {
      language_skills: (rawScores.language_skills - 1.0) * 5.0,
      musical_ability: (rawScores.musical_ability - 1.0) * 5.0,
      physical_prowess: (rawScores.physical_prowess - 1.0) * 5.0,
      math_and_logic: (rawScores.math_and_logic - 1.0) * 5.0,
      spatial_awareness: (rawScores.spatial_awareness - 1.0) * 5.0,
      collaboration_skills: (rawScores.collaboration_skills - 1.0) * 5.0,
      self_awareness: (rawScores.self_awareness - 1.0) * 5.0,
      sustainability_focus: (rawScores.sustainability_focus - 1.0) * 5.0,
      is_preprocessed: true
    }

    let predictions = []
    try {
      const response = await fetch('http://localhost:5001/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preprocessedPayload)
      })

      if (!response.ok) {
        const errorData = await response.json()
        const error = new Error(errorData.error || 'AI service prediction failed')
        error.statusCode = response.status
        throw error
      }

      const data = await response.json()
      predictions = data.predictions
    } catch (err) {
      const error = new Error(`Failed to connect to AI service: ${err.message}`)
      error.statusCode = 502
      throw error
    }

    let summary = null
    try {
      const summaryResponse = await fetch('http://localhost:5001/api/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ predictions, scores: rawScores })
      })

      if (summaryResponse.ok) {
        const summaryData = await summaryResponse.json()
        summary = summaryData.summary
      } else {
        console.error('Failed to generate summary from AI service:', await summaryResponse.text())
      }
    } catch (err) {
      console.error(`Failed to connect to AI summary service: ${err.message}`)
    }

    const assessment = {
      scores: rawScores,
      predictions,
      summary,
      completedAt: new Date()
    }

    const user = await userRepository.updateAssessment(userId, assessment)
    if (!user) {
      const error = new Error('User not found')
      error.statusCode = 404
      throw error
    }

    return user.assessment
  },

  async getAssessment(userId) {
    const user = await userRepository.findById(userId)
    if (!user) {
      const error = new Error('User not found')
      error.statusCode = 404
      throw error
    }
    return user.assessment || null
  },
}

export default userService
