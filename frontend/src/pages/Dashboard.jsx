import { Link } from 'react-router-dom'
import DashboardStats from '../components/DashboardStats.jsx'
import IntelligenceCard from '../components/IntelligenceCard.jsx'
import CareerCard from '../components/CareerCard.jsx'
import SummaryCard from '../components/SummaryCard.jsx'
import { intelligenceDimensions, progressMilestones, loadScores } from '../services/intelligenceScores.js'
import { careerRecommendations, personalizedSummary, loadPredictions } from '../services/careerRecommendations.js'
import { hasCompletedAssessment, hasCareerMatches } from '../services/assessmentState.js'
import { useAuth } from '../context/AuthContext.jsx'

const toneMap = {
  brand: 'bg-brand-50 text-brand-700',
  emerald: 'bg-emerald-50 text-emerald-700',
  slate: 'bg-slate-100 text-slate-700',
  amber: 'bg-amber-50 text-amber-700'
}

export default function Dashboard() {
  const { user } = useAuth()

  // Dynamically load the user's predictions and scores
  loadPredictions(user?.assessment, false, !!user)
  loadScores(user?.assessment, false, !!user)

  const hasAssessment = hasCompletedAssessment(user?.assessment, { isLoggedIn: !!user })
  const hasCareers = hasCareerMatches(user?.assessment, { isLoggedIn: !!user })

  const topThreeIntelligences = [...intelligenceDimensions]
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)

  const topThreeCareers = careerRecommendations.slice(0, 3)

  // Get bookmarked/saved careers from localStorage
  const savedCareersKey = user ? `saved_careers_user_${user.id}` : 'saved_careers_guest'
  const savedCareersRaw = localStorage.getItem(savedCareersKey)
  const savedCareersList = savedCareersRaw ? JSON.parse(savedCareersRaw) : []
  const savedCount = savedCareersList.length

  // Calculate milestones
  const isAssessmentFinished = hasAssessment
  const isCareersGenerated = hasCareers
  const isSummaryReviewed = isCareersGenerated && (localStorage.getItem('summary_reviewed') === 'true')

  // Milestones count
  let milestonesCount = 1 // Profile completed is always true for logged in user
  if (isAssessmentFinished) milestonesCount++
  if (isCareersGenerated) milestonesCount++
  if (isSummaryReviewed) milestonesCount++
  const progressPercent = Math.round((milestonesCount / 4) * 100)

  // Top career match
  const topCareer = careerRecommendations[0]
  const topCareerName = topCareer ? topCareer.name : 'None'
  const topCareerConf = topCareer ? `${topCareer.confidence}%` : '0%'

  // Dimensions reviewed
  const dimensionsCount = isAssessmentFinished ? 8 : 0

  const stats = [
    { 
      label: 'Assessment progress', 
      value: `${progressPercent}%`, 
      helper: `${milestonesCount} of 4 milestones complete`, 
      change: isAssessmentFinished ? 'Complete' : 'Pending', 
      trend: isAssessmentFinished ? 'up' : 'down' 
    },
    { 
      label: 'Top career match', 
      value: topCareerConf, 
      helper: topCareer ? `${topCareerName} leads the list` : 'Take assessment to find matches', 
      change: topCareer ? 'New' : 'None', 
      trend: topCareer ? 'up' : 'down' 
    },
    { 
      label: 'Dimensions reviewed', 
      value: `${dimensionsCount} / 8`, 
      helper: isAssessmentFinished ? 'All Gardner dimensions covered' : 'No dimensions assessed yet', 
      change: isAssessmentFinished ? 'Complete' : 'Incomplete', 
      trend: isAssessmentFinished ? 'up' : 'down' 
    },
    { 
      label: 'Saved careers', 
      value: String(savedCount), 
      helper: savedCount > 0 ? 'Ready to share with an advisor' : 'Bookmark careers to view here', 
      change: savedCount > 0 ? `+${savedCount}` : '0', 
      trend: 'up' 
    }
  ]

  const dynamicActivities = []
  if (user) {
    dynamicActivities.push({
      id: 'act_reg',
      label: 'Created account and set up profile',
      timestamp: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently',
      tone: 'slate'
    })
  }
  if (isAssessmentFinished) {
    const completedAtDate = user?.assessment?.completedAt 
      ? new Date(user.assessment.completedAt).toLocaleDateString() 
      : 'Recently'
    dynamicActivities.push({
      id: 'act_assess',
      label: 'Completed Multiple Intelligences assessment',
      timestamp: completedAtDate,
      tone: 'brand'
    })
    dynamicActivities.push({
      id: 'act_career',
      label: `Generated AI career matches (Top match: ${topCareerName})`,
      timestamp: completedAtDate,
      tone: 'emerald'
    })
  }
  if (savedCount > 0) {
    dynamicActivities.push({
      id: 'act_save',
      label: `Bookmarked ${savedCount} career recommendation${savedCount > 1 ? 's' : ''}`,
      timestamp: 'Recently',
      tone: 'amber'
    })
  }

  return (
    <div className="space-y-8">
          <section className="card relative overflow-hidden bg-gradient-to-r from-white to-brand-50/60 p-6 sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <span className="badge bg-brand-50 text-brand-700">
                  {hasAssessment ? 'Welcome back' : 'Getting started'}
                </span>
                <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                  Hello, {user?.name ? user.name.split(' ')[0] : 'Student'}.
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
                  {hasAssessment
                    ? 'Your latest report is ready. Review your dominant intelligences, revisit recommended careers and continue refining your direction.'
                    : 'You are one step away from your personalized career blueprint. Take the 8-dimension Multiple Intelligences assessment to unlock AI-ranked career matches and your neural profile.'}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {hasAssessment ? (
                  <Link to="/results" className="btn-primary">View full report</Link>
                ) : (
                  <Link to="/assessment" className="btn-primary">Take assessment</Link>
                )}
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
              <span className="text-sm font-semibold text-slate-700">{milestonesCount} / 4 complete</span>
            </div>

            <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-brand-600" style={{ width: `${progressPercent}%` }} />
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
            {isAssessmentFinished ? (
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
            ) : (
              <div className="card mt-5 flex flex-col items-center gap-4 p-8 text-center sm:flex-row sm:text-left">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-2xl">
                  🧠
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-slate-900">No intelligence profile yet</h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Rate yourself across eight Gardner dimensions to see your strengths and AI career matches.
                  </p>
                </div>
                <Link to="/assessment" className="btn-primary shrink-0">Take assessment</Link>
              </div>
            )}
          </section>

          <section>
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Career recommendations</h2>
                <p className="mt-1 text-sm text-slate-600">Preview of your highest confidence matches.</p>
              </div>
              <Link to="/results" className="text-sm font-medium text-brand-700 hover:text-brand-800">Full report</Link>
            </div>
            {isAssessmentFinished ? (
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
            ) : (
              <div className="card mt-5 flex flex-col items-center gap-4 p-8 text-center sm:flex-row sm:text-left">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-2xl">
                  🎯
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-slate-900">Career matches not generated yet</h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Complete the assessment first — our model will rank careers aligned to your cognitive profile.
                  </p>
                </div>
                <Link to="/assessment" className="btn-primary shrink-0">Take assessment</Link>
              </div>
            )}
          </section>

          <section className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {isAssessmentFinished ? (
                <SummaryCard
                  title="Personalized summary preview"
                  body={personalizedSummary.body}
                  highlights={personalizedSummary.highlights.slice(0, 3)}
                  footer="Generated from your latest assessment. Full report available in Results."
                />
              ) : (
                <div className="card p-6 flex flex-col justify-between h-full min-h-[200px]">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Personalized summary preview</h3>
                    <p className="mt-3 text-sm text-slate-600">
                      Your personalized summary will appear here once you take the Howard Gardner Multiple Intelligences assessment.
                    </p>
                  </div>
                  <div className="mt-6">
                    <Link to="/assessment" className="btn-primary inline-block text-center">
                      Take assessment
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-semibold text-slate-900">Recent activity</h3>
              {dynamicActivities.length > 0 ? (
                <ul className="mt-4 space-y-4">
                  {dynamicActivities.map((item) => (
                    <li key={item.id} className="flex items-start gap-3">
                      <span className={`mt-1 flex h-2 w-2 shrink-0 rounded-full ${toneMap[item.tone] || toneMap.slate}`} />
                      <div className="min-w-0">
                        <p className="text-sm text-slate-800">{item.label}</p>
                        <p className="mt-0.5 text-xs text-slate-500">{item.timestamp}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm text-slate-500">No recent activity.</p>
              )}
            </div>

          </section>
    </div>
  )
}
