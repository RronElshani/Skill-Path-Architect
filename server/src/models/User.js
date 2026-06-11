import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password by default in queries
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    refreshToken: {
      type: String,
      select: false,
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    resetPasswordCode: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
    assessment: {
      scores: {
        language_skills: { type: Number, default: 3.0 },
        math_and_logic: { type: Number, default: 3.0 },
        spatial_awareness: { type: Number, default: 3.0 },
        physical_prowess: { type: Number, default: 3.0 },
        musical_ability: { type: Number, default: 3.0 },
        collaboration_skills: { type: Number, default: 3.0 },
        self_awareness: { type: Number, default: 3.0 },
        sustainability_focus: { type: Number, default: 3.0 },
      },
      predictions: [
        {
          rank: Number,
          career: String,
          confidence: Number,
        }
      ],
      summary: { type: String },
      completedAt: { type: Date }
    },
  },
  {
    timestamps: true,
  }
)

const User = mongoose.model('User', userSchema)

export default User
