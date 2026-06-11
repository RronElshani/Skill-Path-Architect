import careerRepository from '../repositories/careerRepository.js'

/**
 * Service layer for the dynamic career library. Serves career profiles and
 * joins each detail with its linked educational pathway.
 */
const careerService = {
  async listCareers({ search, intelligence } = {}) {
    const careers = await careerRepository.findCareers({ search, intelligence })
    return careers.map((career) => this.toListItem(career))
  },

  async getCareerByCode(code) {
    const career = await careerRepository.findByCode(code)
    if (!career) {
      const error = new Error('Career not found')
      error.statusCode = 404
      throw error
    }

    const pathway = await careerRepository.findPathwayByCode(code)
    return {
      ...this.toDetail(career),
      education: pathway
        ? {
            degrees: pathway.degrees || [],
            certifications: pathway.certifications || [],
            courses: pathway.courses || [],
          }
        : { degrees: [], certifications: [], courses: [] },
    }
  },

  /** Compact shape for list/card rendering. */
  toListItem(career) {
    return {
      code: career.code,
      name: career.name,
      summary: career.summary,
      outlook: career.outlook,
      intelligences: career.intelligences || [],
      salaryBand: career.salaryBand,
    }
  },

  /** Full profile shape for the detail page. */
  toDetail(career) {
    return {
      code: career.code,
      name: career.name,
      summary: career.summary,
      description: career.description,
      outlook: career.outlook,
      workEnvironment: career.workEnvironment,
      salaryBand: career.salaryBand,
      intelligences: career.intelligences || [],
      skills: career.skills || [],
      responsibilities: career.responsibilities || [],
    }
  },
}

export default careerService
