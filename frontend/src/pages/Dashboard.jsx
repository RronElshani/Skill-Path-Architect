import { Link } from 'react-router-dom'
import DashboardStats from '../components/DashboardStats.jsx'
import IntelligenceCard from '../components/IntelligenceCard.jsx'
import CareerCard from '../components/CareerCard.jsx'
import SummaryCard from '../components/SummaryCard.jsx'
import { intelligenceDimensions, progressMilestones } from '../services/intelligenceScores.js'
import { careerRecommendations, personalizedSummary } from '../services/careerRecommendations.js'
import { recentActivity } from '../services/users.js'
import { useAuth } from '../context/AuthContext.jsx'

const stats = [
  { label: 'Assessment progress', value: '78%', helper: 'Three of four milestones complete', change: '+12%', trend: 'up' },
  { label: 'Top career match', value: '94%', helper: 'Software Engineer leads the list', change: 'New', trend: 'up' },
  { label: 'Dimensions reviewed', value: '8 / 8', helper: 'All Gardner dimensions covered', change: 'Complete', trend: 'up' },
  { label: 'Saved careers', value: '3', helper: 'Ready to share with an advisor', change: '+1', trend: 'up' }
]

const toneMap = {
  brand: 'bg-brand-50 text-brand-700',
  emerald: 'bg-emerald-50 text-emerald-700',
  slate: 'bg-slate-100 text-slate-700',
  amber: 'bg-amber-50 text-amber-700'
}

export default function Dashboard() {
  const { user } = useAuth()
  const topThreeIntelligences = [...intelligenceDimensions]
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)

  const topThreeCareers = careerRecommendations.slice(0, 3)

  return (
    <div className="space-y-8">
          <section className="card relative overflow-hidden bg-gradient-to-r from-white to-brand-50/60 p-6 sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <span className="badge bg-brand-50 text-brand-700">Welcome back</span>
                <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                  Hello, {user?.name ? user.name.split(' ')[0] : 'Student'}.
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
                  Your latest report is ready. Review your dominant intelligences, revisit recommended careers and continue refining your direction.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link to="/assessment" className="btn-secondary">Retake assessment</Link>
                <Link to="/results" className="btn-primary">View full report</Link>
              </div>
            </div>
          </section>

          <DashboardStats stats={stats} />

          <section className="card p-6 sm:p-8">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Assessment progress</h2>
                <p className="mt-1 text-sm text-slate-600">Track each milestone toward a complete career blueprint.</p>
              </div>
              <span className="text-sm font-semibold text-slate-700">3 / 4 complete</span>
            </div>

            <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-brand-600" style={{ width: '75%' }} />
            </div>

            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {progressMilestones.map((step) => (
                <li
                  key={step.label}
                  className={`flex items-center gap-3 rounded-lg border px-4 py-3 ${
                    step.complete ? 'border-emerald-100 bg-emerald-50/50' : 'border-slate-200 bg-white'
                  }`}
                >
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                      step.complete ? 'bg-emerald-600 text-white' : 'border border-slate-300 bg-white text-slate-500'
                    }`}
                  >
                    {step.complete ? (
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12l5 5 9-11" />
                      </svg>
                    ) : (
                      ''
                    )}
                  </span>
                  <span className={`text-sm ${step.complete ? 'text-slate-800' : 'text-slate-600'}`}>{step.label}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Intelligence summary</h2>
                <p className="mt-1 text-sm text-slate-600">Your three strongest dimensions from the most recent assessment.</p>
              </div>
              <Link to="/results" className="text-sm font-medium text-brand-700 hover:text-brand-800">View all</Link>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {topThreeIntelligences.map((dim) => (
                <IntelligenceCard
                  key={dim.id}
                  name={dim.name}
                  description={dim.description}
                  score={dim.score}
                  accent={dim.accent}
                />
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Career recommendations</h2>
                <p className="mt-1 text-sm text-slate-600">Preview of your highest confidence matches.</p>
              </div>
              <Link to="/results" className="text-sm font-medium text-brand-700 hover:text-brand-800">Full report</Link>
            </div>
            <div className="mt-5 grid gap-4">
              {topThreeCareers.map((career, index) => (
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

          <section className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <SummaryCard
                title="Personalized summary preview"
                body={personalizedSummary.body}
                highlights={personalizedSummary.highlights.slice(0, 3)}
                footer="Generated from your latest assessment. Full report available in Results."
              />
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-semibold text-slate-900">Recent activity</h3>
              <ul className="mt-4 space-y-4">
                {recentActivity.map((item) => (
                  <li key={item.id} className="flex items-start gap-3">
                    <span className={`mt-1 flex h-2 w-2 shrink-0 rounded-full ${toneMap[item.tone] || toneMap.slate}`} />
                    <div className="min-w-0">
                      <p className="text-sm text-slate-800">{item.label}</p>
                      <p className="mt-0.5 text-xs text-slate-500">{item.timestamp}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>
    </div>
  )
}
