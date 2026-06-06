import { Link } from 'react-router-dom'
import ProfileCard from '../components/ProfileCard.jsx'
import SectionTitle from '../components/SectionTitle.jsx'
import CareerCard from '../components/CareerCard.jsx'
import { careerRecommendations } from '../services/careerRecommendations.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function Profile() {
  const { user, logout } = useAuth()

  if (!user) return null

  // Fallbacks for profile fields not yet fully saved in database
  const joinedDate = user.createdAt 
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'June 2026'

  const userRole = user.role.charAt(0).toUpperCase() + user.role.slice(1)

  const saved = (user.savedRecommendations || [
    { id: 'computer-programmer', name: 'Computer programmer', confidence: 94 },
    { id: 'database-designer', name: 'Database designer', confidence: 88 },
    { id: 'computer-analyst', name: 'Computer analyst', confidence: 79 }
  ])
    .map((entry) => careerRecommendations.find((career) => career.id === entry.id || career.name === entry.name))
    .filter(Boolean)

  const strengths = user.strengths || [
    'Structured analytical reasoning',
    'Strong visual and spatial pattern recognition',
    'Independent learning and reflection',
    'Clear written communication'
  ]

  return (
    <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <ProfileCard
            name={user.name}
            email={user.email}
            role={userRole}
            joined={joinedDate}
            location="Pristina, Kosovo"
            headline="Aspiring professional exploring career paths"
          />

          <div className="mt-6 card p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Account settings</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-center justify-between">
                <span className="text-slate-700">Notifications</span>
                <span className="badge bg-emerald-50 text-emerald-700">Enabled</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-slate-700">Profile visibility</span>
                <span className="badge bg-slate-100 text-slate-700">Advisors only</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-slate-700">Two-factor sign in</span>
                <span className="badge bg-amber-50 text-amber-700">Recommended</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-slate-700">Data export</span>
                <Link to="/profile" className="text-sm font-medium text-brand-700 hover:text-brand-800">Request</Link>
              </li>
              <li className="flex items-center justify-between border-t border-slate-100 pt-3">
                <span className="text-slate-700 font-semibold">Session</span>
                <button
                  onClick={logout}
                  className="text-sm font-semibold text-red-600 hover:text-red-700 transition-colors"
                >
                  Sign out
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="space-y-8 lg:col-span-8">
          <section className="card p-6 sm:p-8">
            <SectionTitle
              eyebrow="Strengths overview"
              title="The themes that define your current profile."
              description="A concise list synthesized from your most recent self-assessment and saved recommendations."
            />

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
