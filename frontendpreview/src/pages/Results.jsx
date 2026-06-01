import { Link } from 'react-router-dom'
import SectionTitle from '../components/SectionTitle.jsx'
import RecommendationList from '../components/RecommendationList.jsx'
import SummaryCard from '../components/SummaryCard.jsx'
import IntelligenceCard from '../components/IntelligenceCard.jsx'
import { nextSteps } from '../services/careerRecommendations.js'

// Define the 8 Gardner dimensions with descriptions and accents matching the theme
const dimensionDefinitions = [
  {
    id: 'language_skills',
    name: 'Language Skills',
    description: 'Sensitivity to spoken and written language, including the ability to learn languages and use them to accomplish goals.',
    accent: 'brand'
  },
  {
    id: 'math_and_logic',
    name: 'Math and Logic',
    description: 'Capacity to analyze problems logically, carry out mathematical operations and investigate issues scientifically.',
    accent: 'sky'
  },
  {
    id: 'spatial_awareness',
    name: 'Spatial Awareness',
    description: 'Potential to recognize and manipulate patterns of wide space as well as the patterns of more confined areas.',
    accent: 'violet'
  },
  {
    id: 'physical_prowess',
    name: 'Physical Prowess',
    description: 'Use of one’s whole body or parts of the body to solve problems or fashion products with precision and skill.',
    accent: 'amber'
  },
  {
    id: 'musical_ability',
    name: 'Musical Ability',
    description: 'Skill in the performance, composition and appreciation of musical patterns, including pitch, rhythm and timbre.',
    accent: 'rose'
  },
  {
    id: 'collaboration_skills',
    name: 'Collaboration Skills',
    description: 'Capacity to understand the intentions, motivations and desires of other people and to work effectively with them.',
    accent: 'emerald'
  },
  {
    id: 'self_awareness',
    name: 'Self Awareness',
    description: 'Capacity to understand oneself, to appreciate one’s feelings, fears and motivations, and to use such information to regulate one’s life.',
    accent: 'teal'
  },
  {
    id: 'sustainability_focus',
    name: 'Sustainability Focus',
    description: 'Ability to recognize, categorize and draw upon features of the environment, both natural and human-made.',
    accent: 'slate'
  }
]

// Database mapping of career titles from dataset to descriptions, tag alignments, and outlooks
const careerMetadataMap = {
  'Computer programmer': {
    summary: 'Writes, tests, and debugs code to build software applications. Aligns strongly with logical reasoning, syntax structures, and digital problem-solving.',
    intelligences: ['Logical-Mathematical', 'Spatial', 'Linguistic'],
    outlook: 'Rapid growth'
  },
  'Database designer': {
    summary: 'Designs, implements, and maintains database systems to organize and secure critical data. Requires high logical structure and pattern indexing.',
    intelligences: ['Logical-Mathematical', 'Spatial', 'Intrapersonal'],
    outlook: 'High demand'
  },
  'Computer analyst': {
    summary: 'Analyzes information systems and processes to recommend technical improvements and architecture. Integrates business logic with technical specs.',
    intelligences: ['Logical-Mathematical', 'Interpersonal', 'Linguistic'],
    outlook: 'Growing demand'
  },
  'Engineer': {
    summary: 'Applies scientific and mathematical principles to design structures, machines, or systems. Aligns with hands-on physical precision and logical testing.',
    intelligences: ['Logical-Mathematical', 'Spatial', 'Bodily-Kinesthetic'],
    outlook: 'Stable demand'
  },
  'Graphic Designer': {
    summary: 'Creates visual concepts to communicate ideas that inspire, inform, and captivate consumers. Blends spatial visualization with aesthetic design.',
    intelligences: ['Spatial', 'Linguistic', 'Bodily-Kinesthetic'],
    outlook: 'Stable demand'
  },
  'Fashion Designer': {
    summary: 'Designs clothing and fashion ranges. Combines spatial visualization, material appreciation, and creative personal expression.',
    intelligences: ['Spatial', 'Bodily-Kinesthetic', 'Intrapersonal'],
    outlook: 'Competitive field'
  },
  'Interior Decorator': {
    summary: 'Plans and decorates inner spaces to make them functional and aesthetically pleasing. Strongly aligned with spatial awareness and customer communication.',
    intelligences: ['Spatial', 'Interpersonal', 'Linguistic'],
    outlook: 'Stable demand'
  },
  'Psychologist': {
    summary: 'Studies cognitive, emotional, and social processes and behavior. Best suited for high interpersonal and self-reflection skills.',
    intelligences: ['Interpersonal', 'Intrapersonal', 'Linguistic'],
    outlook: 'Growing field'
  },
  'Mathematician': {
    summary: 'Conducts research to improve and apply mathematical theories and techniques to solve real-world problems in science and business.',
    intelligences: ['Logical-Mathematical', 'Intrapersonal', 'Spatial'],
    outlook: 'Stable demand'
  },
  'Physicist': {
    summary: 'Explores the fundamental laws governing space, time, energy, and matter. Integrates complex mathematical theories with empirical experiments.',
    intelligences: ['Logical-Mathematical', 'Spatial', 'Naturalistic'],
    outlook: 'Growing demand'
  },
  'Astronomer': {
    summary: 'Studies celestial bodies, space, and the physical universe. Blends naturalistic exploration of outer space with logical-mathematical physics.',
    intelligences: ['Logical-Mathematical', 'Naturalistic', 'Spatial'],
    outlook: 'Highly specialized'
  },
  'Writer': {
    summary: 'Develops original written content for books, articles, scripts, or marketing materials. Aligns with linguistic nuance and deep intrapersonal focus.',
    intelligences: ['Linguistic', 'Intrapersonal', 'Interpersonal'],
    outlook: 'Stable demand'
  },
  'Poet': {
    summary: 'Writes poetry to express emotions, ideas, and experiences. Focuses on linguistic phrasing, rhythm, and intrapersonal expression.',
    intelligences: ['Linguistic', 'Intrapersonal', 'Musical'],
    outlook: 'Creative niche'
  },
  'Journalist': {
    summary: 'Investigates and reports news stories. Combines active linguistic communication with interpersonal investigative research.',
    intelligences: ['Linguistic', 'Interpersonal', 'Intrapersonal'],
    outlook: 'Evolving field'
  },
  'Editor': {
    summary: 'Reviews and refines written content for clarity, accuracy, and structure. Demands sharp linguistic skills and intrapersonal focus.',
    intelligences: ['Linguistic', 'Intrapersonal', 'Logical-Mathematical'],
    outlook: 'Stable demand'
  },
  'Manager': {
    summary: 'Coordinates operations, projects, and people to achieve organizational targets. Requires strong emotional intelligence and leadership communication.',
    intelligences: ['Interpersonal', 'Intrapersonal', 'Linguistic'],
    outlook: 'High demand'
  },
  'Leader': {
    summary: 'Inspires teams, drives strategic visions, and guides organizational culture. Aligns with high emotional intelligence and active communication skills.',
    intelligences: ['Interpersonal', 'Intrapersonal', 'Linguistic'],
    outlook: 'High demand'
  },
  'Counselor': {
    summary: 'Helps clients navigate emotional, mental, and developmental challenges. Demands exceptional empathy, active listening, and self-awareness.',
    intelligences: ['Interpersonal', 'Intrapersonal', 'Linguistic'],
    outlook: 'Strong growth'
  },
  'Social Worker': {
    summary: 'Supports individuals and communities to overcome social and interpersonal challenges. Blends empathy with active problem-solving.',
    intelligences: ['Interpersonal', 'Intrapersonal', 'Linguistic'],
    outlook: 'Growing field'
  },
  'Primary Teacher': {
    summary: 'Teaches core subjects to young children, fostering cognitive growth, social integration, and basic linguistic and numeric skills.',
    intelligences: ['Interpersonal', 'Linguistic', 'Logical-Mathematical'],
    outlook: 'Stable demand'
  },
  'Music teacher': {
    summary: 'Instructs students in vocal or instrumental music performance, composition, and appreciation. Combines musical talent with interactive guidance.',
    intelligences: ['Musical', 'Interpersonal', 'Linguistic'],
    outlook: 'Stable demand'
  },
  'Artist': {
    summary: 'Creates original visual art using various mediums. Combines spatial visualization, hand-eye coordination, and deep personal expression.',
    intelligences: ['Spatial', 'Bodily-Kinesthetic', 'Intrapersonal'],
    outlook: 'Stable demand'
  },
  'Athlete': {
    summary: 'Competes in professional sports and maintains peak physical conditioning. Requires extraordinary physical coordination and bodily control.',
    intelligences: ['Bodily-Kinesthetic', 'Intrapersonal', 'Interpersonal'],
    outlook: 'Highly competitive'
  },
  'Dancer': {
    summary: 'Performs expressive movements choreographed to music. Blends bodily-kinesthetic timing with musical rhythm and emotional storytelling.',
    intelligences: ['Bodily-Kinesthetic', 'Musical', 'Spatial'],
    outlook: 'Stable demand'
  },
  'Recording engineer': {
    summary: 'Operates sound recording and mixing equipment to capture, edit, and master musical or spoken performances. Requires highly trained acoustic sensitivity.',
    intelligences: ['Musical', 'Logical-Mathematical', 'Spatial'],
    outlook: 'Growing field'
  },
  'Sound editor': {
    summary: 'Selects, syncs, and cuts sound effects, dialogue, and foley tracks for media productions. Demands high auditory focus and digital software proficiency.',
    intelligences: ['Musical', 'Spatial', 'Logical-Mathematical'],
    outlook: 'Growing field'
  },
  'Geologist': {
    summary: 'Studies the materials, processes, products, physical history, and structures of the Earth. Involves field research and environmental categorization.',
    intelligences: ['Naturalistic', 'Logical-Mathematical', 'Spatial'],
    outlook: 'Stable demand'
  },
  'Marine Biologist': {
    summary: 'Researches organisms, ecology, and behaviors within marine environments. Blends environmental science with spatial mapping and observation.',
    intelligences: ['Naturalistic', 'Logical-Mathematical', 'Bodily-Kinesthetic'],
    outlook: 'Growing field'
  },
  'Nature photographer': {
    summary: 'Captures high-quality images of wildlife, landscapes, and natural processes. Combines environmental knowledge with artistic spatial composition.',
    intelligences: ['Naturalistic', 'Spatial', 'Bodily-Kinesthetic'],
    outlook: 'Stable demand'
  },
  'Veterinarian': {
    summary: 'Diagnoses, treats, and cares for animals. Requires strong biological understanding, hands-on precision, and empathetic communication.',
    intelligences: ['Naturalistic', 'Logical-Mathematical', 'Interpersonal'],
    outlook: 'Strong growth'
  }
}

// Retrieves summary, alignment, and outlook for a career with dynamic fallback
function getCareerMetadata(careerName, dominantIntelligences) {
  const cleanName = careerName.replace(/\n/g, '').trim()
  if (careerMetadataMap[cleanName]) {
    return careerMetadataMap[cleanName]
  }

  const strengths = dominantIntelligences.map((dim) => dim.name)
  return {
    summary: `A career in ${cleanName} matches your cognitive profile. This profession relies on structure, critical assessment, and specialized domain knowledge.`,
    intelligences: strengths.slice(0, 3),
    outlook: 'Stable demand'
  }
}

export default function Results() {
  // Load data from localStorage
  const predictionsDataRaw = localStorage.getItem('career_predictions')
  const predictionsData = predictionsDataRaw ? JSON.parse(predictionsDataRaw) : null

  // If no data exists, prompt the user to take the assessment
  if (!predictionsData) {
    return (
      <div className="container-page py-16 text-center">
        <div className="mx-auto max-w-md card p-8">
          <div className="flex justify-center mb-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">No Assessment Found</h2>
          <p className="mt-2 text-sm text-slate-600">
            Please complete the self-assessment first to generate your AI career recommendations.
          </p>
          <div className="mt-6">
            <Link to="/assessment" className="btn-primary w-full inline-block">
              Take Assessment
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Calculate Dimension scores from raw scores (range 1.0 - 5.0) to percentages (range 0 - 100)
  const scoresObj = predictionsData.scores || {}
  const userDimensions = dimensionDefinitions.map((dim) => {
    const rawScore = scoresObj[dim.id] || 3.0
    const pct = Math.round(((rawScore - 1.0) / 4.0) * 100)
    return {
      ...dim,
      score: pct
    }
  })

  // Get dominant strengths (sorted descending by score)
  const dominant = [...userDimensions].sort((a, b) => b.score - a.score).slice(0, 4)

  // Map API predictions to UI recommendations
  const predictions = predictionsData.predictions || []
  const careerRecommendations = predictions.map((pred) => {
    const meta = getCareerMetadata(pred.career, dominant)
    return {
      id: pred.career.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: pred.career,
      confidence: Math.round(pred.confidence),
      summary: meta.summary,
      intelligences: meta.intelligences,
      outlook: meta.outlook
    }
  })

  // Build radar/bar snapshot values
  const radarSnapshot = userDimensions.map((d) => ({
    axis: d.name,
    value: d.score
  }))

  // Dynamic Personalized Insight
  const primaryStrength = dominant[0]?.name || 'Logical-Mathematical'
  const secondaryStrength = dominant[1]?.name || 'Spatial'
  const personalizedSummary = {
    title: 'Personalized career insight',
    body: `Your profile reveals a learner who excels in ${primaryStrength} and ${secondaryStrength}. You combine these strengths to process information systematically and construct solutions. This positions you well for careers that leverage these dimensions.`,
    highlights: [
      `${primaryStrength} is your primary strength, providing a solid foundation for analysis and structural reasoning.`,
      `Your strong alignment with ${secondaryStrength} helps you visualize patterns and organize projects effectively.`,
      `Consider electives or projects that blend both dimensions to maximize your profile potential.`,
      `Strengthen other aspects of your profile by engaging in a wide variety of collaborative and creative pursuits.`
    ]
  }

  return (
    <div className="container-page py-12 lg:py-16">
      <div className="grid items-end gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <SectionTitle
            eyebrow="Career report"
            title="Your top recommendations and personalized summary."
            description="Findings combine your self-assessment with the AI-backed career prediction model. Use them as a starting point for advisor conversations and further research."
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 lg:col-span-4 lg:justify-end">
          <Link to="/assessment" className="btn-secondary">Retake assessment</Link>
          <Link to="/dashboard" className="btn-primary">Back to dashboard</Link>
        </div>
      </div>

      <section className="mt-10">
        <div className="card p-6 sm:p-8">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Intelligence profile</h2>
              <p className="mt-1 text-sm text-slate-600">A visual snapshot across all eight Gardner dimensions.</p>
            </div>
            <span className="badge bg-brand-50 text-brand-700">
              Updated {new Date(predictionsData.timestamp).toLocaleDateString()}
            </span>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {radarSnapshot.map((row) => (
              <div key={row.axis} className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-700">{row.axis}</p>
                  <p className="text-sm font-semibold text-slate-900">{row.value}%</p>
                </div>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white">
                  <div className="h-full rounded-full bg-brand-600" style={{ width: `${row.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Top five career matches</h2>
              <p className="mt-1 text-sm text-slate-600">Ranked by alignment between your dominant intelligences and the prediction model.</p>
            </div>
          </div>
          <div className="mt-5">
            <RecommendationList recommendations={careerRecommendations} />
          </div>
        </div>

        <aside className="space-y-6 lg:col-span-4">
          <SummaryCard
            title={personalizedSummary.title}
            body={personalizedSummary.body}
            highlights={personalizedSummary.highlights}
            footer="Generated by the prediction engine based on your latest submission."
          />

          <div className="card p-6">
            <h3 className="text-base font-semibold text-slate-900">Dominant strengths</h3>
            <p className="mt-1 text-sm text-slate-600">Highest scoring dimensions from your assessment.</p>
            <div className="mt-4 grid gap-3">
              {dominant.map((dim) => (
                <IntelligenceCard
                  key={dim.id}
                  name={dim.name}
                  description={dim.description}
                  score={dim.score}
                  accent={dim.accent}
                />
              ))}
            </div>
          </div>
        </aside>
      </section>

      <section className="mt-12">
        <div className="card p-6 sm:p-8">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Actionable next steps</h2>
              <p className="mt-1 text-sm text-slate-600">A short plan to keep momentum after reading your report.</p>
            </div>
            <span className="badge bg-slate-100 text-slate-700">{nextSteps.length} suggestions</span>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {nextSteps.map((step, index) => (
              <div key={step.title} className="flex items-start gap-4 rounded-xl border border-slate-200 bg-slate-50/40 p-5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-sm font-semibold text-white">
                  {index + 1}
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">{step.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

