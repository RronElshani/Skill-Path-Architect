import { Link } from 'react-router-dom'
import ProfileCard from '../components/ProfileCard.jsx'
import SectionTitle from '../components/SectionTitle.jsx'
import CareerCard from '../components/CareerCard.jsx'
import { currentUser } from '../services/users.js'
import { careerRecommendations } from '../services/careerRecommendations.js'

export default function Profile() {
  const saved = currentUser.savedRecommendations
    .map((entry) => careerRecommendations.find((career) => career.id === entry.id))
    .filter(Boolean)

  return (
    <div className="container-page py-12 lg:py-16">
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <ProfileCard
            name={currentUser.name}
            email={currentUser.email}
            role={currentUser.role}
            joined={currentUser.joined}
            location={currentUser.location}
            headline={currentUser.headline}
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
              {currentUser.strengths.map((strength, index) => (
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
              {saved.map((career, index) => (
                <CareerCard
                  key={career.id}
                  rank={index + 1}
                  name={career.name}
                  confidence={career.confidence}
                  summary={career.summary}
                  intelligences={career.intelligences}
                  outlook={career.outlook}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
