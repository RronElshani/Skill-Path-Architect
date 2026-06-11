import careerRepository from '../repositories/careerRepository.js'
import careers from '../../scripts/career-data.js'

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

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

  async seedCareersIfEmpty() {
    const count = await careerRepository.countCareers()
    if (count > 0) {
      return
    }

    console.log('Database contains no careers. Starting automatic seeding...')
    let seededCount = 0
    for (const entry of careers) {
      const code = slugify(entry.name)
      const [entrySalary, median, senior] = entry.salary || [0, 0, 0]

      await careerRepository.upsertCareer({
        code,
        name: entry.name,
        summary: entry.summary || '',
        description: entry.description || '',
        salaryBand: { entry: entrySalary, median, senior, currency: 'USD' },
        outlook: entry.outlook || 'Stable demand',
        workEnvironment: entry.workEnvironment || '',
        intelligences: entry.intelligences || [],
        skills: entry.skills || [],
        responsibilities: entry.responsibilities || [],
      })

      await careerRepository.upsertPathway({
        careerCode: code,
        degrees: entry.degrees || [],
        certifications: entry.certifications || [],
        courses: entry.courses || [],
      })

      seededCount += 1
    }

    console.log(`Successfully auto-seeded ${seededCount} careers on startup.`)
  },
}

export default careerService
