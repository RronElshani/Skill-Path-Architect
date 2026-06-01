export const assessmentReport = {
  completedAt: 'June 1, 2025',
  modelVersion: 'XGBoost v2.1 + LLM Summary',
  studentName: 'Adelina Krasniqi',
  dominantIntelligences: ['Logical-Mathematical', 'Spatial', 'Intrapersonal'],
  growthAreas: ['Musical', 'Naturalistic'],
  overallConfidence: 87,
  modelAccuracy: '97.2%',
  careersMatched: 5,
  dimensionsAssessed: 8
}

export const careerRecommendations = [
  {
    id: 'software-engineer',
    name: 'Software Engineer',
    confidence: 94,
    summary: 'Designs, builds and maintains software systems. Aligns strongly with logical reasoning, spatial visualization and structured problem solving.',
    aiReasoning: 'Your logical-mathematical dominance (92) combined with spatial reasoning (86) maps cleanly to algorithm design and system architecture.',
    intelligences: ['Logical-Mathematical', 'Spatial', 'Linguistic'],
    outlook: 'Strong growth outlook',
    education: "Bachelor's in Computer Science or Software Engineering.",
    salaryRange: '$85,000 – $145,000',
    workEnvironment: 'Collaborative teams, hybrid or remote-friendly.',
    skills: ['Algorithm design', 'Systems thinking', 'Version control', 'Technical communication', 'Debugging'],
    responsibilities: ['Design and implement software features', 'Collaborate on requirements', 'Review code and maintain quality', 'Document architecture decisions'],
    matchReasons: [
      { intelligence: 'Logical-Mathematical', score: 92, note: 'Primary predictor — structured problem decomposition.' },
      { intelligence: 'Spatial', score: 86, note: 'System visualization and architecture mapping.' },
      { intelligence: 'Linguistic', score: 78, note: 'Documentation and cross-team communication.' }
    ],
    relatedCareerIds: ['data-analyst', 'ux-designer']
  },
  {
    id: 'architect',
    name: 'Architect',
    confidence: 88,
    summary: 'Plans and designs functional, sustainable spaces. Combines spatial intelligence with logical structure and visual communication.',
    aiReasoning: 'Spatial intelligence is the strongest predictor for architecture. Your 86 score places you in the 91st percentile.',
    intelligences: ['Spatial', 'Logical-Mathematical', 'Bodily-Kinesthetic'],
    outlook: 'Stable demand',
    education: 'Professional degree in Architecture plus licensure pathway.',
    salaryRange: '$62,000 – $118,000',
    workEnvironment: 'Studio-based design work, site visits, client presentations.',
    skills: ['3D modeling', 'Structural reasoning', 'Sketching', 'Building codes', 'Client communication'],
    responsibilities: ['Develop conceptual designs', 'Balance aesthetics and function', 'Coordinate with engineers', 'Present to clients'],
    matchReasons: [
      { intelligence: 'Spatial', score: 86, note: 'Core requirement for environmental design.' },
      { intelligence: 'Logical-Mathematical', score: 92, note: 'Structural calculations and planning.' },
      { intelligence: 'Bodily-Kinesthetic', score: 62, note: 'Physical scale and material understanding.' }
    ],
    relatedCareerIds: ['ux-designer', 'software-engineer']
  },
  {
    id: 'psychologist',
    name: 'Psychologist',
    confidence: 82,
    summary: 'Studies cognitive, emotional and social behavior. Best suited for high interpersonal and intrapersonal awareness.',
    aiReasoning: 'Interpersonal and intrapersonal scores together explain 74% of variance for psychology matches in our training set.',
    intelligences: ['Interpersonal', 'Intrapersonal', 'Linguistic'],
    outlook: 'Growing field',
    education: "Bachelor's in Psychology followed by graduate training.",
    salaryRange: '$55,000 – $105,000',
    workEnvironment: 'Clinics, schools, research labs or private practice.',
    skills: ['Active listening', 'Research methods', 'Ethical reasoning', 'Empathy', 'Data interpretation'],
    responsibilities: ['Assess behavioral patterns', 'Design treatment plans', 'Support clients through interventions', 'Maintain confidential records'],
    matchReasons: [
      { intelligence: 'Interpersonal', score: 74, note: 'Understanding others\' motivations.' },
      { intelligence: 'Intrapersonal', score: 81, note: 'Self-reflection and emotional regulation.' },
      { intelligence: 'Linguistic', score: 78, note: 'Therapeutic dialogue and academic writing.' }
    ],
    relatedCareerIds: ['ux-designer']
  },
  {
    id: 'data-analyst',
    name: 'Data Analyst',
    confidence: 79,
    summary: 'Interprets data sets to inform decisions. Requires logical reasoning, pattern attention and clear communication.',
    aiReasoning: 'Logical-mathematical score above 85 is the top feature for data analyst classification in our model.',
    intelligences: ['Logical-Mathematical', 'Linguistic', 'Intrapersonal'],
    outlook: 'Rapid growth',
    education: "Bachelor's in Statistics, Mathematics or Data Science.",
    salaryRange: '$58,000 – $98,000',
    workEnvironment: 'Cross-functional teams, dashboard-driven reporting.',
    skills: ['SQL', 'Spreadsheet modeling', 'Data visualization', 'Statistical literacy', 'Storytelling with data'],
    responsibilities: ['Analyze datasets', 'Build dashboards', 'Translate findings for stakeholders', 'Validate data quality'],
    matchReasons: [
      { intelligence: 'Logical-Mathematical', score: 92, note: 'Pattern recognition and quantitative reasoning.' },
      { intelligence: 'Linguistic', score: 78, note: 'Communicating insights in reports.' },
      { intelligence: 'Intrapersonal', score: 81, note: 'Independent analysis under ambiguity.' }
    ],
    relatedCareerIds: ['software-engineer', 'psychologist']
  },
  {
    id: 'ux-designer',
    name: 'UX Designer',
    confidence: 76,
    summary: 'Researches and designs user experiences. Blends empathy with spatial design thinking and iteration.',
    aiReasoning: 'A balanced spatial + interpersonal profile is the signature pattern for UX design matches.',
    intelligences: ['Spatial', 'Interpersonal', 'Linguistic'],
    outlook: 'Growing demand',
    education: "Bachelor's in Design, HCI or Psychology.",
    salaryRange: '$60,000 – $112,000',
    workEnvironment: 'Product teams, design sprints, user research sessions.',
    skills: ['User research', 'Wireframing', 'Prototyping', 'Usability testing', 'Design systems'],
    responsibilities: ['Conduct user interviews', 'Create wireframes and prototypes', 'Partner with engineers', 'Iterate from feedback'],
    matchReasons: [
      { intelligence: 'Spatial', score: 86, note: 'Layout, hierarchy and visual organization.' },
      { intelligence: 'Interpersonal', score: 74, note: 'Empathy-driven research.' },
      { intelligence: 'Linguistic', score: 78, note: 'Microcopy and design communication.' }
    ],
    relatedCareerIds: ['software-engineer', 'architect', 'psychologist']
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
  title: 'AI-generated career insight',
  body: 'Your profile reveals a learner who thinks systematically and visualizes solutions before acting. You combine analytic clarity with strong self-awareness, which positions you well for technical disciplines that require both rigor and reflection.',
  highlights: [
    'Logical and spatial reasoning are your dominant strengths, ideal for engineering and design work.',
    'A high intrapersonal score suggests independent study and long-form research projects suit you.',
    'Consider electives in human-computer interaction to channel your interpersonal awareness into product work.',
    'Strengthen bodily-kinesthetic and musical dimensions through extracurriculars to maintain a balanced profile.'
  ]
}

export const nextSteps = [
  { title: 'Shortlist two undergraduate programs', description: 'Compare computer science and architecture programs that emphasize project-based learning.' },
  { title: 'Build a portfolio project', description: 'Pick a community problem and design a solution using logical and spatial reasoning.' },
  { title: 'Schedule a mentor conversation', description: 'Talk with a professional in your top recommendation to validate expectations.' },
  { title: 'Re-take the assessment in three months', description: 'Profiles evolve as you gain experience. Tracking growth helps refine direction.' }
]

export const intelligenceInsights = [
  { id: 'logical-mathematical', label: 'Logical-Mathematical', score: 92, percentile: 96, tier: 'Dominant', insight: 'You excel at breaking complex problems into structured steps.' },
  { id: 'spatial', label: 'Spatial', score: 86, percentile: 91, tier: 'Dominant', insight: 'You think visually and can mentally rotate ideas and systems.' },
  { id: 'intrapersonal', label: 'Intrapersonal', score: 81, percentile: 84, tier: 'Strong', insight: 'You reflect deeply and learn through self-directed study.' },
  { id: 'linguistic', label: 'Linguistic', score: 78, percentile: 79, tier: 'Strong', insight: 'You communicate ideas clearly in writing and speech.' },
  { id: 'interpersonal', label: 'Interpersonal', score: 74, percentile: 72, tier: 'Moderate', insight: 'You work well with others and read social cues effectively.' },
  { id: 'bodily-kinesthetic', label: 'Bodily-Kinesthetic', score: 62, percentile: 58, tier: 'Moderate', insight: 'Hands-on learning helps you retain concepts.' },
  { id: 'naturalistic', label: 'Naturalistic', score: 58, percentile: 52, tier: 'Growth', insight: 'Environmental electives could unlock a complementary perspective.' },
  { id: 'musical', label: 'Musical', score: 54, percentile: 48, tier: 'Growth', insight: 'Rhythm and pattern in music may strengthen logical thinking.' }
]

export function getCareerById(id) {
  return careerRecommendations.find((career) => career.id === id)
}

export function getRelatedCareers(career) {
  if (!career?.relatedCareerIds) return []
  return career.relatedCareerIds.map((id) => getCareerById(id)).filter(Boolean)
}
