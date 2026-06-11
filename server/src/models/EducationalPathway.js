import mongoose from 'mongoose'

/**
 * educational_pathways — degree suggestions, certifications and course links for
 * a career. Linked to a CareerPath by `careerCode` so a detail request can join
 * the two collections.
 */
const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    provider: { type: String, default: '', trim: true },
    url: { type: String, default: '', trim: true },
  },
  { _id: false }
)

const educationalPathwaySchema = new mongoose.Schema(
  {
    careerCode: {
      type: String,
      required: [true, 'careerCode is required'],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    degrees: [{ type: String, trim: true }],
    certifications: [{ type: String, trim: true }],
    courses: [courseSchema],
  },
  {
    timestamps: true,
    collection: 'educational_pathways',
  }
)

const EducationalPathway = mongoose.model('EducationalPathway', educationalPathwaySchema)

export default EducationalPathway
