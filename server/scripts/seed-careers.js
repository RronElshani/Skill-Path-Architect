/**
 * Seed the career library (career_paths + educational_pathways) from the 72
 * ML-predicted classes.
 *
 * Usage (from the server directory):
 *   npm run seed:careers
 *
 * Idempotent: careers are upserted by `code`, so re-running updates in place
 * rather than creating duplicates.
 */
import dotenv from 'dotenv'
import path from 'path'
import mongoose from 'mongoose'
import { fileURLToPath } from 'url'
import connectDB from '../src/config/db.js'
import careerRepository from '../src/repositories/careerRepository.js'
import careers from './career-data.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '..', '.env') })

/** URL-safe slug. Must match the frontend's slug rule so predictions link up. */
export function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function seed() {
  await connectDB()

  let count = 0
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

    count += 1
  }

  console.log(`Seeded ${count} careers into career_paths and educational_pathways.`)
  await mongoose.connection.close()
  process.exit(0)
}

seed().catch((error) => {
  console.error('Career seeding failed:', error.message)
  process.exit(1)
})
