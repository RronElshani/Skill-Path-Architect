import CareerPath from '../models/CareerPath.js'
import EducationalPathway from '../models/EducationalPathway.js'

/**
 * Repository layer — isolates all database operations for the career library.
 * Services never call Mongoose directly; they go through this layer.
 */
const careerRepository = {
  /**
   * List careers with optional case-insensitive name/summary search and an
   * optional intelligence filter.
   */
  async findCareers({ search, intelligence } = {}) {
    const query = {}

    if (search?.trim()) {
      const term = search.trim()
      query.$or = [
        { name: { $regex: term, $options: 'i' } },
        { summary: { $regex: term, $options: 'i' } },
      ]
    }

    if (intelligence?.trim()) {
      query.intelligences = { $regex: `^${intelligence.trim()}$`, $options: 'i' }
    }

    return await CareerPath.find(query).sort({ name: 1 }).lean()
  },

  async findByCode(code) {
    return await CareerPath.findOne({ code: code.toLowerCase() }).lean()
  },

  async findPathwayByCode(code) {
    return await EducationalPathway.findOne({ careerCode: code.toLowerCase() }).lean()
  },

  async upsertCareer(career) {
    return await CareerPath.findOneAndUpdate({ code: career.code }, career, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    })
  },

  async upsertPathway(pathway) {
    return await EducationalPathway.findOneAndUpdate(
      { careerCode: pathway.careerCode },
      pathway,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )
  },

  async countCareers() {
    return await CareerPath.countDocuments()
  },
}

export default careerRepository
