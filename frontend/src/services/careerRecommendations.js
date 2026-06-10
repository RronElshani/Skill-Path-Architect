import { slugifyCareer } from './careers.js'

// Default mock data (fallback if no local assessment is found)
const defaultReport = {
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

const defaultCareers = [
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

const defaultRadar = [
  { axis: 'Logical', value: 92 },
  { axis: 'Spatial', value: 86 },
  { axis: 'Intrapersonal', value: 81 },
  { axis: 'Linguistic', value: 78 },
  { axis: 'Interpersonal', value: 74 },
  { axis: 'Bodily', value: 62 },
  { axis: 'Naturalistic', value: 58 },
  { axis: 'Musical', value: 54 }
]

const defaultSummary = {
  title: 'AI-generated career insight',
  body: 'Your profile reveals a learner who thinks systematically and visualizes solutions before acting. You combine analytic clarity with strong self-awareness, which positions you well for technical disciplines that require both rigor and reflection.',
  highlights: [
    'Logical and spatial reasoning are your dominant strengths, ideal for engineering and design work.',
    'A high intrapersonal score suggests independent study and long-form research projects suit you.',
    'Consider electives in human-computer interaction to channel your interpersonal awareness into product work.',
    'Strengthen bodily-kinesthetic and musical dimensions through extracurriculars to maintain a balanced profile.'
  ]
}

const defaultNextSteps = [
  { title: 'Shortlist two undergraduate programs', description: 'Compare computer science and architecture programs that emphasize project-based learning.' },
  { title: 'Build a portfolio project', description: 'Pick a community problem and design a solution using logical and spatial reasoning.' },
  { title: 'Schedule a mentor conversation', description: 'Talk with a professional in your top recommendation to validate expectations.' },
  { title: 'Re-take the assessment in three months', description: 'Profiles evolve as you gain experience. Tracking growth helps refine direction.' }
]

const defaultInsights = [
  { id: 'math_and_logic', label: 'Math and Logic', score: 92, percentile: 96, tier: 'Dominant', insight: 'You excel at breaking complex problems into structured steps.' },
  { id: 'spatial_awareness', label: 'Spatial Awareness', score: 86, percentile: 91, tier: 'Dominant', insight: 'You think visually and can mentally rotate ideas and systems.' },
  { id: 'self_awareness', label: 'Self Awareness', score: 81, percentile: 84, tier: 'Strong', insight: 'You reflect deeply and learn through self-directed study.' },
  { id: 'language_skills', label: 'Language Skills', score: 78, percentile: 79, tier: 'Strong', insight: 'You communicate ideas clearly in writing and speech.' },
  { id: 'collaboration_skills', label: 'Collaboration Skills', score: 74, percentile: 72, tier: 'Moderate', insight: 'You work well with others and read social cues effectively.' },
  { id: 'physical_prowess', label: 'Physical Prowess', score: 62, percentile: 58, tier: 'Moderate', insight: 'Hands-on learning helps you retain concepts.' },
  { id: 'sustainability_focus', label: 'Sustainability Focus', score: 58, percentile: 52, tier: 'Growth', insight: 'Environmental electives could unlock a complementary perspective.' },
  { id: 'musical_ability', label: 'Musical Ability', score: 54, percentile: 48, tier: 'Growth', insight: 'Rhythm and pattern in music may strengthen logical thinking.' }
]

// Expose constants that can be mutated in-place
export const assessmentReport = { ...defaultReport }
export const careerRecommendations = [...defaultCareers]
export const radarSnapshot = [...defaultRadar]
export const personalizedSummary = { ...defaultSummary }
export const nextSteps = [...defaultNextSteps]
export const intelligenceInsights = [...defaultInsights]

// Career metadata dictionary mapping predicted careers to details
const careerMetadataMap = {
  'Computer programmer': {
    summary: 'Writes, tests, and debugs code to build software applications. Aligns strongly with logical reasoning, syntax structures, and digital problem-solving.',
    aiReasoning: 'Your Logical-Mathematical score (92) combined with Spatial Reasoning (86) maps cleanly to software creation, logic optimization, and system design.',
    intelligences: ['Logical-Mathematical', 'Spatial', 'Linguistic'],
    outlook: 'Strong growth outlook',
    education: "Bachelor's in Computer Science or Software Engineering.",
    salaryRange: '$85,000 – $145,000',
    workEnvironment: 'Collaborative teams, hybrid or remote-friendly.',
    skills: ['Algorithm design', 'Systems thinking', 'Version control', 'Technical communication', 'Debugging'],
    responsibilities: [
      'Design and implement software features',
      'Collaborate on requirements and system specifications',
      'Review code and maintain code quality standards',
      'Document software design and architectural decisions'
    ],
    matchReasons: [
      { intelligence: 'Logical-Mathematical', score: 92, note: 'Primary predictor — structured logical decomposition.' },
      { intelligence: 'Spatial', score: 86, note: 'System visual representation and database schema mapping.' },
      { intelligence: 'Linguistic', score: 78, note: 'Writing clear documentation and active group coordination.' }
    ]
  },
  'Database designer': {
    summary: 'Designs, implements, and maintains database systems to organize and secure critical data. Requires high logical structure and pattern indexing.',
    aiReasoning: 'Your math and logic score (92) paired with high self-awareness predicts strong design capabilities in relational schemas and query modeling.',
    intelligences: ['Logical-Mathematical', 'Spatial', 'Intrapersonal'],
    outlook: 'High demand',
    education: "Bachelor's in Information Technology or Computer Science.",
    salaryRange: '$80,000 – $130,000',
    workEnvironment: 'Database administration units, security audits, remote-friendly.',
    skills: ['SQL', 'Data modeling', 'Query optimization', 'Performance tuning', 'Information security'],
    responsibilities: [
      'Design logical and physical database models',
      'Ensure data integrity and security compliance',
      'Optimize complex database queries',
      'Plan backup and disaster recovery processes'
    ],
    matchReasons: [
      { intelligence: 'Logical-Mathematical', score: 92, note: 'Database normalization and relational algebra.' },
      { intelligence: 'Spatial', score: 86, note: 'Visual schema planning and relationship indexing.' },
      { intelligence: 'Intrapersonal', score: 81, note: 'Focused independent testing and profiling.' }
    ]
  },
  'Computer analyst': {
    summary: 'Analyzes information systems and processes to recommend technical improvements and architecture. Integrates business logic with technical specs.',
    aiReasoning: 'A strong logical profile combined with collaboration skills fits the core tasks of mapping system specifications to business outcomes.',
    intelligences: ['Logical-Mathematical', 'Interpersonal', 'Linguistic'],
    outlook: 'Growing demand',
    education: "Bachelor's in Computer Information Systems or related field.",
    salaryRange: '$75,000 – $120,000',
    workEnvironment: 'Consulting agencies, corporate IT offices, stakeholder meetings.',
    skills: ['System analysis', 'Business analysis', 'Agile methodologies', 'Requirement gathering', 'UML modeling'],
    responsibilities: [
      'Analyze legacy IT systems and process flows',
      'Document requirements for development teams',
      'Coordinate between stakeholders and software developers',
      'Plan and oversee system integrations and migrations'
    ],
    matchReasons: [
      { intelligence: 'Logical-Mathematical', score: 92, note: 'Logical process flow mapping.' },
      { intelligence: 'Interpersonal', score: 74, note: 'Conducting stakeholder surveys and interviews.' },
      { intelligence: 'Linguistic', score: 78, note: 'Drafting structured specification documents.' }
    ]
  },
  'Engineer': {
    summary: 'Applies scientific and mathematical principles to design structures, machines, or systems. Aligns with hands-on physical precision and logical testing.',
    aiReasoning: 'The combination of high spatial visualization and mathematical logical structure maps directly to structural design and testing workflows.',
    intelligences: ['Logical-Mathematical', 'Spatial', 'Bodily-Kinesthetic'],
    outlook: 'Stable demand',
    education: "Professional Engineering (PE) license with Bachelor's in Engineering.",
    salaryRange: '$70,000 – $125,000',
    workEnvironment: 'Design studios, construction sites, manufacturing labs.',
    skills: ['CAD software', 'Thermodynamics', 'Material science', 'Prototyping', 'Safety codes'],
    responsibilities: [
      'Perform structural calculations and material evaluations',
      'Create 3D assembly models and engineering drawings',
      'Prototype and test physical components',
      'Coordinate project specifications on-site'
    ],
    matchReasons: [
      { intelligence: 'Logical-Mathematical', score: 92, note: 'Physical laws and mathematical computation.' },
      { intelligence: 'Spatial', score: 86, note: 'Blueprint assembly and 3D modeling.' },
      { intelligence: 'Bodily-Kinesthetic', score: 62, note: 'Material handling and hands-on calibration.' }
    ]
  },
  'Graphic Designer': {
    summary: 'Creates visual concepts to communicate ideas that inspire, inform, and captivate consumers. Blends spatial visualization with aesthetic design.',
    aiReasoning: 'Your dominant spatial score (86) represents a strong capacity for visual hierarchy, layout composition, and aesthetic planning.',
    intelligences: ['Spatial', 'Linguistic', 'Bodily-Kinesthetic'],
    outlook: 'Stable demand',
    education: "Bachelor's in Graphic Design, Fine Arts, or visual portfolio equivalent.",
    salaryRange: '$48,000 – $88,000',
    workEnvironment: 'Design agencies, marketing teams, freelance settings.',
    skills: ['Adobe Creative Suite', 'Typography', 'Visual branding', 'Vector illustration', 'Color theory'],
    responsibilities: [
      'Develop layouts and assets for brand campaigns',
      'Select typography, color palettes, and imagery',
      'Present design concepts to marketing teams',
      'Prepare print-ready and web-optimized files'
    ],
    matchReasons: [
      { intelligence: 'Spatial', score: 86, note: 'Visual composition, layout balance, and hierarchy.' },
      { intelligence: 'Linguistic', score: 78, note: 'Interpreting brand messages and copy.' },
      { intelligence: 'Bodily-Kinesthetic', score: 62, note: 'Hand-eye precision in digital illustration.' }
    ]
  },
  'Psychologist': {
    summary: 'Studies cognitive, emotional and social processes and behavior. Best suited for high interpersonal and self-reflection skills.',
    aiReasoning: 'Collaboration skills (74) and self-awareness (81) explain the majority of variance for psychology matches in our training set.',
    intelligences: ['Interpersonal', 'Intrapersonal', 'Linguistic'],
    outlook: 'Growing field',
    education: "Master's or PhD in Clinical or Counseling Psychology plus state license.",
    salaryRange: '$65,000 – $115,000',
    workEnvironment: 'Clinics, hospitals, private offices, research labs.',
    skills: ['Active listening', 'Behavioral assessment', 'Diagnosis', 'Therapeutic techniques', 'Patient empathy'],
    responsibilities: [
      'Conduct cognitive and personality assessments',
      'Provide individual and group counseling',
      'Formulate tailored behavioral diagnostics',
      'Collaborate on community mental health programs'
    ],
    matchReasons: [
      { intelligence: 'Interpersonal', score: 74, note: 'Understanding client motivations and empathy.' },
      { intelligence: 'Intrapersonal', score: 81, note: 'Self-reflection and counselor regulation.' },
      { intelligence: 'Linguistic', score: 78, note: 'Therapeutic conversation and record logging.' }
    ]
  },
  'Writer': {
    summary: 'Develops original written content for books, articles, scripts, or marketing materials. Aligns with linguistic nuance and deep intrapersonal focus.',
    aiReasoning: 'High language skills (78) combined with self-awareness (81) is the signature pattern for professional writing.',
    intelligences: ['Linguistic', 'Intrapersonal', 'Interpersonal'],
    outlook: 'Stable demand',
    education: "Bachelor's in Creative Writing, English, or journalism portfolio.",
    salaryRange: '$45,000 – $90,000',
    workEnvironment: 'Quiet study, publishing houses, remote editorial rooms.',
    skills: ['Creative writing', 'Storytelling', 'Copy editing', 'Researching', 'Audience targeting'],
    responsibilities: [
      'Draft and edit original manuscripts or copy',
      'Conduct research to support article themes',
      'Revise drafts based on editorial comments',
      'Collaborate with publishers and editors'
    ],
    matchReasons: [
      { intelligence: 'Linguistic', score: 78, note: 'Vocabulary selection and syntax structures.' },
      { intelligence: 'Intrapersonal', score: 81, note: 'Reflective theme conceptualization.' },
      { intelligence: 'Interpersonal', score: 74, note: 'Audience empathy and emotional connection.' }
    ]
  },
  'Counselor': {
    summary: 'Helps clients navigate emotional, mental, and developmental challenges. Demands exceptional empathy, active listening, and self-awareness.',
    aiReasoning: 'Collaboration skills combined with self-awareness aligns with client guidance and group counseling protocols.',
    intelligences: ['Interpersonal', 'Intrapersonal', 'Linguistic'],
    outlook: 'Strong growth',
    education: "Master's in Counseling or Marriage & Family Therapy (LMFT).",
    salaryRange: '$50,000 – $85,000',
    workEnvironment: 'Schools, community centers, rehabilitation facilities.',
    skills: ['Active listening', 'Crisis intervention', 'Group therapy', 'Empathy', 'Case management'],
    responsibilities: [
      'Assess clients during initial intake interviews',
      'Conduct crisis counseling sessions',
      'Formulate therapeutic recovery goals',
      'Coordinate care with psychiatrists'
    ],
    matchReasons: [
      { intelligence: 'Interpersonal', score: 74, note: 'Empathizing with client struggles.' },
      { intelligence: 'Intrapersonal', score: 81, note: 'Self-monitoring and counseling boundaries.' },
      { intelligence: 'Linguistic', score: 78, note: 'Verbal supportive expression.' }
    ]
  },
  'Business manager': {
    summary: 'Coordinates operations, projects, and people to achieve organizational targets. Requires strong emotional intelligence and leadership communication.',
    aiReasoning: 'Your strong math and logic skills (92) combined with collaboration skills (74) predict management capabilities.',
    intelligences: ['Logical-Mathematical', 'Interpersonal', 'Linguistic'],
    outlook: 'Stable demand',
    education: "Bachelor's in Business Administration (BBA) or MBA.",
    salaryRange: '$90,000 – $160,000',
    workEnvironment: 'Corporate offices, client boardrooms, team environments.',
    skills: ['Strategic planning', 'Financial analysis', 'Team leadership', 'Negotiation', 'Conflict resolution'],
    responsibilities: [
      'Establish team performance goals and budgets',
      'Analyze operational performance data',
      'Manage staff recruiting and department workflows',
      'Present progress to senior executives'
    ],
    matchReasons: [
      { intelligence: 'Logical-Mathematical', score: 92, note: 'Budget forecasting and financial auditing.' },
      { intelligence: 'Interpersonal', score: 74, note: 'Team leadership and stakeholder negotiation.' },
      { intelligence: 'Linguistic', score: 78, note: 'Strategic communications and reports.' }
    ]
  }
}

// Retrieves summary, alignment, and outlook for a career with dynamic fallback
function getCareerDetails(careerName, percentScores) {
  const cleanName = careerName.replace(/\n/g, '').trim()
  if (careerMetadataMap[cleanName]) {
    return careerMetadataMap[cleanName]
  }

  // Sort scores to get dominant dimensions
  const sorted = Object.entries(percentScores)
    .map(([key, score]) => {
      const names = {
        language_skills: 'Linguistic',
        math_and_logic: 'Logical-Mathematical',
        spatial_awareness: 'Spatial',
        physical_prowess: 'Bodily-Kinesthetic',
        musical_ability: 'Musical',
        collaboration_skills: 'Interpersonal',
        self_awareness: 'Intrapersonal',
        sustainability_focus: 'Naturalistic'
      }
      return { id: key, name: names[key], score }
    })
    .sort((a, b) => b.score - a.score)

  const top1 = sorted[0]?.name || 'Logical-Mathematical'
  const top2 = sorted[1]?.name || 'Spatial'
  const top3 = sorted[2]?.name || 'Linguistic'

  return {
    summary: `A career in ${cleanName} matches your cognitive profile. This profession relies on structure, critical assessment, and specialized domain knowledge.`,
    aiReasoning: `Your strong alignment with ${top1} (${sorted[0].score}) and ${top2} (${sorted[1].score}) aligns with the core requirements of this field.`,
    intelligences: [top1, top2, top3],
    outlook: 'Stable demand',
    education: "Bachelor's degree or equivalent technical certification.",
    salaryRange: '$55,000 – $95,000',
    workEnvironment: 'Collaborative team or hybrid workspace.',
    skills: ['Analytical skills', 'Problem solving', 'Critical thinking', 'Communication'],
    responsibilities: [
      'Analyze and evaluate requirements',
      'Coordinate with cross-functional partners',
      'Maintain design documentation and standards',
      'Perform system operations and enhancements'
    ],
    matchReasons: [
      { intelligence: top1, score: sorted[0].score, note: 'Primary predictor for this path.' },
      { intelligence: top2, score: sorted[1].score, note: 'Supporting cognitive alignment.' },
      { intelligence: top3, score: sorted[2].score, note: 'Secondary communication asset.' }
    ]
  }
}

// Load and populate predictions from localStorage or user context
export function loadPredictions(userAssessment, showSample = false) {
  try {
    let data = null

    if (showSample) {
      data = {
        scores: {
          language_skills: 3.5,
          math_and_logic: 4.68,
          spatial_awareness: 4.44,
          physical_prowess: 3.48,
          musical_ability: 3.16,
          collaboration_skills: 3.96,
          self_awareness: 4.24,
          sustainability_focus: 3.32
        },
        predictions: defaultCareers.map((c, i) => ({
          rank: i + 1,
          career: c.name,
          confidence: c.confidence
        })),
        timestamp: defaultReport.completedAt,
        studentName: defaultReport.studentName
      }
    } else if (userAssessment && userAssessment.scores && userAssessment.predictions && userAssessment.predictions.length > 0) {
      data = {
        scores: userAssessment.scores,
        predictions: userAssessment.predictions,
        summary: userAssessment.summary,
        timestamp: userAssessment.completedAt || new Date().toISOString(),
        studentName: userAssessment.name || 'Student Profile'
      }
    } else {
      const raw = localStorage.getItem('career_predictions')
      if (raw) {
        data = JSON.parse(raw)
      }
    }

    if (!data) {
      // Revert to empty/no assessment taken state (no fallbacks!)
      Object.assign(assessmentReport, {
        completedAt: '',
        modelVersion: '',
        studentName: '',
        dominantIntelligences: [],
        growthAreas: [],
        overallConfidence: 0,
        modelAccuracy: '',
        careersMatched: 0,
        dimensionsAssessed: 0
      })
      
      careerRecommendations.length = 0
      
      radarSnapshot.length = 0
      
      Object.assign(personalizedSummary, {
        title: '',
        body: '',
        highlights: []
      })
      
      nextSteps.length = 0
      
      intelligenceInsights.length = 0
      return
    }

    const scores = data.scores || {}
    const predictions = data.predictions || []
    const timestamp = data.timestamp ? new Date(data.timestamp).toLocaleDateString() : new Date().toLocaleDateString()

    // Map 1-5 scores to 0-100% scale
    const rawScores = {
      language_skills: scores.language_skills || 3.0,
      math_and_logic: scores.math_and_logic || 3.0,
      spatial_awareness: scores.spatial_awareness || 3.0,
      physical_prowess: scores.physical_prowess || 3.0,
      musical_ability: scores.musical_ability || 3.0,
      collaboration_skills: scores.collaboration_skills || 3.0,
      self_awareness: scores.self_awareness || 3.0,
      sustainability_focus: scores.sustainability_focus || 3.0
    }

    const percentScores = {}
    for (const [key, val] of Object.entries(rawScores)) {
      percentScores[key] = Math.round(((val - 1.0) / 4.0) * 100)
    }

    // Sort to find dominant and growth areas
    const sortedDims = Object.entries(percentScores)
      .map(([key, score]) => {
        const names = {
          language_skills: 'Linguistic',
          math_and_logic: 'Logical-Mathematical',
          spatial_awareness: 'Spatial',
          physical_prowess: 'Bodily-Kinesthetic',
          musical_ability: 'Musical',
          collaboration_skills: 'Interpersonal',
          self_awareness: 'Intrapersonal',
          sustainability_focus: 'Naturalistic'
        }
        return { id: key, name: names[key], score }
      })
      .sort((a, b) => b.score - a.score)

    const dominant = sortedDims.slice(0, 3).map(d => d.name)
    const growth = [...sortedDims].reverse().slice(0, 2).map(d => d.name)

    // Update assessmentReport
    Object.assign(assessmentReport, {
      completedAt: timestamp,
      modelVersion: 'XGBoost v2.1 + UI Calibration',
      studentName: data.studentName || 'Student Profile',
      dominantIntelligences: dominant,
      growthAreas: growth,
      overallConfidence: predictions.length > 0 ? Math.round(predictions[0].confidence) : 80,
      modelAccuracy: '97.2%',
      careersMatched: predictions.length,
      dimensionsAssessed: 8
    })

    // Update careerRecommendations
    const dynamicCareers = predictions.map((pred, index) => {
      const careerId = slugifyCareer(pred.career)
      const meta = getCareerDetails(pred.career, percentScores)
      
      return {
        id: careerId,
        name: pred.career,
        confidence: Math.round(pred.confidence),
        summary: meta.summary,
        aiReasoning: meta.aiReasoning || `Your matching score is primarily predicted by your high ${dominant[0]} and ${dominant[1]} alignment.`,
        intelligences: meta.intelligences,
        outlook: meta.outlook || 'Stable outlook',
        education: meta.education || "Bachelor's degree or equivalent technical certification.",
        salaryRange: meta.salaryRange || '$60,000 – $110,000',
        workEnvironment: meta.workEnvironment || 'Modern office or hybrid workspace.',
        skills: meta.skills || ['Analytical skills', 'Problem solving', 'Critical thinking', 'Communication'],
        responsibilities: meta.responsibilities || [
          'Analyze and evaluate requirements',
          'Coordinate with cross-functional partners',
          'Maintain design documentation and standards',
          'Perform system operations and enhancements'
        ],
        matchReasons: meta.matchReasons || [
          { intelligence: dominant[0], score: percentScores[sortedDims[0].id], note: 'Primary predictor for this path.' },
          { intelligence: dominant[1], score: percentScores[sortedDims[1].id], note: 'Strong supporting cognitive alignment.' }
        ],
        relatedCareerIds: predictions
          .filter((_, idx) => idx !== index)
          .slice(0, 2)
          .map(p => slugifyCareer(p.career))
      }
    })

    careerRecommendations.length = 0
    careerRecommendations.push(...dynamicCareers)

    // Update radarSnapshot
    const axisMapping = {
      language_skills: 'Linguistic',
      math_and_logic: 'Logical',
      spatial_awareness: 'Spatial',
      physical_prowess: 'Bodily',
      musical_ability: 'Musical',
      collaboration_skills: 'Interpersonal',
      self_awareness: 'Intrapersonal',
      sustainability_focus: 'Naturalistic'
    }

    const newRadar = Object.entries(percentScores).map(([key, val]) => ({
      axis: axisMapping[key],
      value: val
    }))
    
    radarSnapshot.length = 0
    radarSnapshot.push(...newRadar)

    // Update personalizedSummary
    const firstStr = dominant[0]
    const secondStr = dominant[1]
    Object.assign(personalizedSummary, {
      title: 'AI-generated career insight',
      body: data.summary || `Your profile reveals a learner who excels in ${firstStr} and ${secondStr}. You combine these cognitive strengths to process information systematically and construct solutions. This positions you well for careers that leverage these dimensions.`,
      highlights: [
        `${firstStr} is your primary strength, providing a solid foundation for analysis and structural reasoning.`,
        `Your strong alignment with ${secondStr} helps you visualize patterns and organize projects effectively.`,
        `Consider electives or projects that blend both dimensions to maximize your profile potential.`,
        `Strengthen other aspects of your profile by engaging in a wide variety of collaborative and creative pursuits.`
      ]
    })

    // Update nextSteps
    const newNextSteps = [
      { title: 'Compare academic paths', description: `Research training programs that align with your top match, ${predictions[0]?.career || 'predicted careers'}.` },
      { title: 'Build a profile project', description: `Create a small portfolio piece applying your ${firstStr} and ${secondStr} skills.` },
      { title: 'Schedule a mentor conversation', description: `Reach out to a professional in ${predictions[0]?.career || 'your top field'} to learn about their day-to-day work.` },
      { title: 'Track your growth', description: 'Re-take the assessment in three months to see how your cognitive profile evolves.' }
    ]
    nextSteps.length = 0
    nextSteps.push(...newNextSteps)

    // Update intelligenceInsights
    const newInsights = sortedDims.map((dim, idx) => {
      let tier = 'Growth'
      if (idx < 2) tier = 'Dominant'
      else if (idx < 4) tier = 'Strong'
      else if (idx < 6) tier = 'Moderate'

      const percentiles = {
        Dominant: 90 + (2 - idx) * 3,
        Strong: 80 + (4 - idx) * 2,
        Moderate: 60 + (6 - idx) * 5,
        Growth: 40 + (8 - idx) * 4
      }

      const customInsights = {
        language_skills: 'You communicate ideas clearly in writing and speech.',
        math_and_logic: 'You excel at breaking complex problems into structured steps.',
        spatial_awareness: 'You think visually and can mentally rotate ideas and systems.',
        physical_prowess: 'Hands-on learning helps you retain concepts.',
        musical_ability: 'Rhythm and pattern in music may strengthen logical thinking.',
        collaboration_skills: 'You work well with others and read social cues effectively.',
        self_awareness: 'You reflect deeply and learn through self-directed study.',
        sustainability_focus: 'Environmental electives could unlock a complementary perspective.'
      }

      return {
        id: dim.id,
        label: dim.name,
        score: dim.score,
        percentile: percentiles[tier] || 50,
        tier,
        insight: customInsights[dim.id] || 'You show steady development in this dimension.'
      }
    })

    intelligenceInsights.length = 0
    intelligenceInsights.push(...newInsights)

  } catch (err) {
    console.error('Error loading dynamic predictions:', err)
  }
}

// Initial load
loadPredictions()

export function getCareerById(id) {
  return careerRecommendations.find((career) => career.id === id)
}

export function getRelatedCareers(career) {
  if (!career?.relatedCareerIds) return []
  return career.relatedCareerIds.map((id) => getCareerById(id)).filter(Boolean)
}
