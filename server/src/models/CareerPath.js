import mongoose from 'mongoose'

/**
 * career_paths — general profile metadata for each career the ML model can
 * predict. `code` is a URL-safe slug derived from the exact ML label and is the
 * stable identifier the frontend uses to look up a career.
 */
const careerPathSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Career code is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: [true, 'Career name is required'],
      trim: true,
    },
    summary: {
      type: String,
      default: '',
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    salaryBand: {
      entry: { type: Number, default: 0 },
      median: { type: Number, default: 0 },
      senior: { type: Number, default: 0 },
      currency: { type: String, default: 'USD' },
    },
    outlook: {
      type: String,
      default: 'Stable demand',
      trim: true,
    },
    workEnvironment: {
      type: String,
      default: '',
      trim: true,
    },
    intelligences: [{ type: String, trim: true }],
    skills: [{ type: String, trim: true }],
    responsibilities: [{ type: String, trim: true }],
  },
  {
    timestamps: true,
    collection: 'career_paths',
  }
)

const CareerPath = mongoose.model('CareerPath', careerPathSchema)

export default CareerPath
