import bcrypt from 'bcryptjs'
import config from '../config/index.js'
import userRepository from '../repositories/userRepository.js'
import reviewRepository from '../repositories/reviewRepository.js'
import modelExperimentService from './modelExperimentService.js'
import careerService from './careerService.js'

const seedStudents = [
  {
    name: 'Alice Johnson',
    email: 'alice@example.com',
    password: 'password123',
    assessment: {
      scores: {
        language_skills: 4.5,
        math_and_logic: 3.0,
        spatial_awareness: 2.5,
        physical_prowess: 1.5,
        musical_ability: 2.0,
        collaboration_skills: 4.0,
        self_awareness: 3.5,
        sustainability_focus: 3.0
      },
      predictions: [
        { rank: 1, career: 'Technical Writer', confidence: 88.8 },
        { rank: 2, career: 'Teacher', confidence: 75.4 }
      ],
      summary: 'Strong language and collaboration skills make Alice highly suited for a career in Technical Writing or Teaching.',
      completedAt: new Date()
    },
    review: {
      rating: 5,
      satisfied: true,
      comment: 'The career recommendations were spot on! It perfectly matched my passion for language and writing.',
      predictions: [
        { rank: 1, career: 'Technical Writer', confidence: 88.8 }
      ]
    }
  },
  {
    name: 'Bob Smith',
    email: 'bob@example.com',
    password: 'password123',
    assessment: {
      scores: {
        language_skills: 2.0,
        math_and_logic: 4.8,
        spatial_awareness: 4.5,
        physical_prowess: 1.0,
        musical_ability: 1.5,
        collaboration_skills: 3.0,
        self_awareness: 4.0,
        sustainability_focus: 2.5
      },
      predictions: [
        { rank: 1, career: 'Software Engineer', confidence: 94.4 },
        { rank: 2, career: 'Data Scientist', confidence: 85.2 }
      ],
      summary: 'Outstanding mathematical, logic, and spatial skills point Bob directly to Software Engineering or Data Science.',
      completedAt: new Date()
    },
    review: {
      rating: 5,
      satisfied: true,
      comment: 'Incredible accuracy. I am currently studying computer science, and this confirmed my path.',
      predictions: [
        { rank: 1, career: 'Software Engineer', confidence: 94.4 }
      ]
    }
  },
  {
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    password: 'password123',
    assessment: {
      scores: {
        language_skills: 3.5,
        math_and_logic: 2.0,
        spatial_awareness: 2.0,
        physical_prowess: 4.6,
        musical_ability: 3.0,
        collaboration_skills: 4.5,
        self_awareness: 3.0,
        sustainability_focus: 4.0
      },
      predictions: [
        { rank: 1, career: 'Fitness Instructor', confidence: 82 },
        { rank: 2, career: 'Social Worker', confidence: 78 }
      ],
      summary: 'Exceptional physical prowess and collaboration skills suggest a strong career fit as a Fitness Instructor or Social Worker.',
      completedAt: new Date()
    },
    review: {
      rating: 4,
      satisfied: true,
      comment: 'Very helpful overview. The suggestions highlighted my physical and collaboration skills well.',
      predictions: [
        { rank: 1, career: 'Fitness Instructor', confidence: 82 }
      ]
    }
  },
  {
    name: 'Diana Prince',
    email: 'diana@example.com',
    password: 'password123',
    assessment: {
      scores: {
        language_skills: 3.0,
        math_and_logic: 3.5,
        spatial_awareness: 4.8,
        physical_prowess: 2.0,
        musical_ability: 2.5,
        collaboration_skills: 3.0,
        self_awareness: 3.5,
        sustainability_focus: 4.5
      },
      predictions: [
        { rank: 1, career: 'Architect', confidence: 91 },
        { rank: 2, career: 'Landscape Designer', confidence: 83 }
      ],
      summary: 'High spatial awareness and sustainability focus make Diana an excellent candidate for Architecture or Landscape Design.',
      completedAt: new Date()
    },
    review: {
      rating: 5,
      satisfied: true,
      comment: 'The tool is beautiful and fast. The advice on spatial visualization helped me look into architecture.',
      predictions: [
        { rank: 1, career: 'Architect', confidence: 91 }
      ]
    }
  },
  {
    name: 'Evan Wright',
    email: 'evan@example.com',
    password: 'password123',
    assessment: {
      scores: {
        language_skills: 3.0,
        math_and_logic: 2.5,
        spatial_awareness: 3.0,
        physical_prowess: 3.5,
        musical_ability: 4.9,
        collaboration_skills: 3.5,
        self_awareness: 3.0,
        sustainability_focus: 2.0
      },
      predictions: [
        { rank: 1, career: 'Music Producer', confidence: 89 },
        { rank: 2, career: 'Sound Engineer', confidence: 80 }
      ],
      summary: 'With musical ability as a standout feature, Evan is recommended to explore Music Production or Sound Engineering.',
      completedAt: new Date()
    },
    review: {
      rating: 4,
      satisfied: true,
      comment: 'Fun assessment! I loved how it picked up on my musical intelligence and recommended music production.',
      predictions: [
        { rank: 1, career: 'Music Producer', confidence: 89 }
      ]
    }
  }
]

async function ensureDefaultAdmin() {
  const email = config.defaultAdminEmail?.trim().toLowerCase()
  const password = config.defaultAdminPassword

  if (!email || !password) return

  const existing = await userRepository.findByEmail(email)
  if (existing) {
    if (existing.role !== 'admin') {
      await userRepository.updateById(existing._id, { role: 'admin' })
      console.log(`Promoted ${email} to admin.`)
    }
    return
  }

  const salt = await bcrypt.genSalt(12)
  const hashedPassword = await bcrypt.hash(password, salt)

  await userRepository.create({
    name: config.defaultAdminName,
    email,
    password: hashedPassword,
    role: 'admin',
  })

  console.log(`Default admin account ready: ${email}`)
}

async function promoteConfiguredAdmin() {
  const adminEmail = config.adminEmail?.trim().toLowerCase()
  if (!adminEmail || adminEmail === config.defaultAdminEmail?.trim().toLowerCase()) return

  const user = await userRepository.findByEmail(adminEmail)
  if (!user) return

  if (user.role === 'admin') return

  await userRepository.updateById(user._id, { role: 'admin' })
  console.log(`Promoted ${adminEmail} to admin (ADMIN_EMAIL).`)
}

async function seedStudentsAndReviewsIfEmpty() {
  const salt = await bcrypt.genSalt(12)
  for (const studentData of seedStudents) {
    const existing = await userRepository.findByEmail(studentData.email)
    if (!existing) {
      const hashedPassword = await bcrypt.hash(studentData.password, salt)
      const user = await userRepository.create({
        name: studentData.name,
        email: studentData.email,
        password: hashedPassword,
        role: 'user',
        assessment: studentData.assessment
      })
      console.log(`Seeded student: ${studentData.email}`)

      // Seed the review for this student
      await reviewRepository.create({
        user: user._id,
        rating: studentData.review.rating,
        satisfied: studentData.review.satisfied,
        comment: studentData.review.comment,
        predictions: studentData.review.predictions
      })
      console.log(`Seeded review for student: ${studentData.email}`)
    }
  }
}

export async function bootstrapAdmin() {
  await ensureDefaultAdmin()
  await promoteConfiguredAdmin()
  await modelExperimentService.seedInitialExperimentIfEmpty()
  await careerService.seedCareersIfEmpty()
  await seedStudentsAndReviewsIfEmpty()
}
