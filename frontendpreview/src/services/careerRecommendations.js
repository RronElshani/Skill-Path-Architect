export const careerRecommendations = [
  {
    id: 'software-engineer',
    name: 'Software Engineer',
    confidence: 94,
    summary:
      'Designs, builds and maintains software systems. Aligns strongly with logical reasoning, spatial visualization and structured problem solving.',
    intelligences: ['Logical-Mathematical', 'Spatial', 'Linguistic'],
    outlook: 'Strong growth outlook'
  },
  {
    id: 'architect',
    name: 'Architect',
    confidence: 88,
    summary:
      'Plans and designs functional, sustainable spaces. Combines spatial intelligence with logical structure and visual communication.',
    intelligences: ['Spatial', 'Logical-Mathematical', 'Bodily-Kinesthetic'],
    outlook: 'Stable demand'
  },
  {
    id: 'psychologist',
    name: 'Psychologist',
    confidence: 82,
    summary:
      'Studies cognitive, emotional and social behavior. Best suited for high interpersonal and intrapersonal awareness paired with strong reasoning.',
    intelligences: ['Interpersonal', 'Intrapersonal', 'Linguistic'],
    outlook: 'Growing field'
  },
  {
    id: 'data-analyst',
    name: 'Data Analyst',
    confidence: 79,
    summary:
      'Interprets data sets to inform decisions. Requires precise logical reasoning, attention to pattern and clear written communication.',
    intelligences: ['Logical-Mathematical', 'Linguistic', 'Intrapersonal'],
    outlook: 'Rapid growth'
  },
  {
    id: 'ux-designer',
    name: 'UX Designer',
    confidence: 76,
    summary:
      'Researches and designs user experiences. Blends interpersonal empathy with spatial design thinking and structured iteration.',
    intelligences: ['Spatial', 'Interpersonal', 'Linguistic'],
    outlook: 'Growing demand'
  }
]

export const radarSnapshot = [
  { axis: 'Logical', value: 92 },
  { axis: 'Spatial', value: 86 },
  { axis: 'Intrapersonal', value: 81 },
  { axis: 'Linguistic', value: 78 },
  { axis: 'Interpersonal', value: 74 },
  { axis: 'Bodily', value: 62 },
  { axis: 'Naturalistic', value: 58 },
  { axis: 'Musical', value: 54 }
]

export const personalizedSummary = {
  title: 'Personalized career insight',
  body:
    'Your profile reveals a learner who thinks systematically and visualizes solutions before acting. You combine analytic clarity with strong self-awareness, which positions you well for technical disciplines that require both rigor and reflection.',
  highlights: [
    'Logical and spatial reasoning are your dominant strengths, ideal for engineering and design work.',
    'A high intrapersonal score suggests independent study and long-form research projects suit you.',
    'Consider electives in human-computer interaction to channel your interpersonal awareness into product work.',
    'Strengthen bodily-kinesthetic and musical dimensions through extracurriculars to maintain a balanced profile.'
  ]
}

export const nextSteps = [
  {
    title: 'Shortlist two undergraduate programs',
    description:
      'Compare computer science and architecture programs at universities that emphasize project-based learning.'
  },
  {
    title: 'Build a portfolio project',
    description:
      'Pick a small problem in your community and design a solution using both logical and spatial reasoning.'
  },
  {
    title: 'Schedule a mentor conversation',
    description:
      'Talk with a professional in your top recommendation to validate day-to-day expectations and growth paths.'
  },
  {
    title: 'Re-take the assessment in three months',
    description:
      'Profiles evolve as you gain experience. Tracking growth helps refine long-term direction.'
  }
]
