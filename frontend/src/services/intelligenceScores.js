const defaultDimensions = [
  {
    id: 'language_skills',
    name: 'Language Skills',
    description:
      'Sensitivity to spoken and written language, including the ability to learn languages and use them to accomplish goals.',
    score: 78,
    accent: 'brand'
  },
  {
    id: 'math_and_logic',
    name: 'Math and Logic',
    description:
      'Capacity to analyze problems logically, carry out mathematical operations and investigate issues scientifically.',
    score: 92,
    accent: 'sky'
  },
  {
    id: 'spatial_awareness',
    name: 'Spatial Awareness',
    description:
      'Potential to recognize and manipulate patterns of wide space as well as the patterns of more confined areas.',
    score: 86,
    accent: 'violet'
  },
  {
    id: 'physical_prowess',
    name: 'Physical Prowess',
    description:
      'Use of one’s whole body or parts of the body to solve problems or fashion products with precision and skill.',
    score: 62,
    accent: 'amber'
  },
  {
    id: 'musical_ability',
    name: 'Musical Ability',
    description:
      'Skill in the performance, composition and appreciation of musical patterns, including pitch, rhythm and timbre.',
    score: 54,
    accent: 'rose'
  },
  {
    id: 'collaboration_skills',
    name: 'Collaboration Skills',
    description:
      'Capacity to understand the intentions, motivations and desires of other people and to work effectively with them.',
    score: 74,
    accent: 'emerald'
  },
  {
    id: 'self_awareness',
    name: 'Self Awareness',
    description:
      'Capacity to understand oneself, to appreciate one’s feelings, fears and motivations, and to use such information to regulate one’s life.',
    score: 81,
    accent: 'teal'
  },
  {
    id: 'sustainability_focus',
    name: 'Sustainability Focus',
    description:
      'Ability to recognize, categorize and draw upon features of the environment, both natural and human-made.',
    score: 58,
    accent: 'slate'
  }
]

const zeroDimensions = defaultDimensions.map(dim => ({ ...dim, score: 0 }))

export const intelligenceDimensions = [...zeroDimensions]

export const progressMilestones = [
  { label: 'Profile completed', complete: false },
  { label: 'Self-assessment finished', complete: false },
  { label: 'Career matches generated', complete: false },
  { label: 'Personalized summary reviewed', complete: false }
]

export function loadScores(userAssessment, showSample = false, hasProfile = false) {
  try {
    const isAssessmentFinished = showSample || !!(userAssessment && userAssessment.scores) || !!localStorage.getItem('career_predictions')
    const isCareersGenerated = showSample || !!(userAssessment && userAssessment.predictions && userAssessment.predictions.length > 0) || !!localStorage.getItem('career_predictions')
    const isSummaryReviewed = isCareersGenerated && (localStorage.getItem('summary_reviewed') === 'true')

    progressMilestones[0].complete = hasProfile
    progressMilestones[1].complete = isAssessmentFinished
    progressMilestones[2].complete = isCareersGenerated
    progressMilestones[3].complete = isSummaryReviewed

    if (showSample) {
      intelligenceDimensions.length = 0
      intelligenceDimensions.push(...defaultDimensions)
      return
    }

    let scores = null
    if (userAssessment && userAssessment.scores) {
      scores = userAssessment.scores
    } else {
      const raw = localStorage.getItem('career_predictions')
      if (raw) {
        const data = JSON.parse(raw)
        scores = data.scores
      }
    }

    if (!scores) {
      intelligenceDimensions.length = 0
      intelligenceDimensions.push(...zeroDimensions)
      return
    }
    
    const newDims = defaultDimensions.map(dim => {
      const rawScore = scores[dim.id] || 3.0
      // Map 1-5 scale to 0-100%
      const pct = Math.round(((rawScore - 1.0) / 4.0) * 100)
      return {
        ...dim,
        score: pct
      }
    })
    
    intelligenceDimensions.length = 0
    intelligenceDimensions.push(...newDims)
  } catch (err) {
    console.error('Error loading scores:', err)
  }
}

// Initial load
loadScores()
