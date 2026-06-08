import { Link } from 'react-router-dom'
import ProfileCard from '../components/ProfileCard.jsx'
import SectionTitle from '../components/SectionTitle.jsx'
import CareerCard from '../components/CareerCard.jsx'
import { careerRecommendations, loadPredictions } from '../services/careerRecommendations.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function Profile() {
  const { user, logout } = useAuth()

  if (!user) return null

  // Load user's predictions dynamically
  loadPredictions(user?.assessment)

  const joinedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'Recently'

  const userRole = user.role.charAt(0).toUpperCase() + user.role.slice(1)

  // Get bookmarked/saved careers from localStorage
  const savedCareersKey = `saved_careers_user_${user.id}`
  const savedCareersRaw = localStorage.getItem(savedCareersKey)
  const savedCareersList = savedCareersRaw ? JSON.parse(savedCareersRaw) : []

  const saved = savedCareersList
    .map((id) => careerRecommendations.find((career) => career.id === id || career.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === id))
    .filter(Boolean)

  const strengthsMapping = {
    language_skills: 'Clear written and verbal communication',
    math_and_logic: 'Structured analytical reasoning',
    spatial_awareness: 'Strong visual and spatial pattern recognition',
    physical_prowess: 'Excellent hands-on coordination and kinesthetic learning',
    musical_ability: 'Acoustic pattern recognition and auditory analysis',
    collaboration_skills: 'Strong team leadership and group collaboration',
    self_awareness: 'Independent self-reflection and goal orientation',
    sustainability_focus: 'High environmental awareness and ecological observation'
  }

  let strengths = []
  if (user.assessment?.scores) {
    const sortedScores = Object.entries(user.assessment.scores)
      .map(([id, score]) => ({ id, score: Number(score) }))
      .sort((a, b) => b.score - a.score)

    strengths = sortedScores
      .filter(item => item.score >= 3.0)
      .slice(0, 4)
      .map(item => strengthsMapping[item.id])
  }

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <div className="lg:col-span-4">
        <ProfileCard
          name={user.name}
          email={user.email}
          role={userRole}
          joined={joinedDate}
          location={user.location || ''}
          headline={user.headline || ''}
        />


      </div>

      <div className="space-y-8 lg:col-span-8">
        <section className="card p-6 sm:p-8">
          <SectionTitle
            eyebrow="Strengths overview"
            title="The themes that define your current profile."
            description="A concise list synthesized from your most recent self-assessment and saved recommendations."
          />

          {strengths.length > 0 ? (
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {strengths.map((strength, index) => (
                <div key={strength} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-sm font-semibold text-white">
                    {index + 1}
                  </span>
                  <p className="text-sm text-slate-700">{strength}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 card p-6 text-center text-slate-500 border border-dashed border-slate-200">
              No strengths calculated yet. Please take the self-assessment to identify your strengths.
            </div>
          )}
        </section>

        <section>
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Saved recommendations</h2>
              <p className="mt-1 text-sm text-slate-600">Careers you bookmarked from your most recent report.</p>
            </div>
            <Link to="/results" className="text-sm font-medium text-brand-700 hover:text-brand-800">Browse all</Link>
          </div>

          <div className="mt-5 grid gap-4">
            {saved.length > 0 ? (
              saved.map((career, index) => (
                <CareerCard
                  key={career.id}
                  rank={index + 1}
                  name={career.name}
                  confidence={career.confidence}
                  summary={career.summary}
                  intelligences={career.intelligences}
                  outlook={career.outlook}
                />
              ))
            ) : (
              <div className="card p-6 text-center text-slate-500">
                No saved careers yet. Fill out the assessment to view matches.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
