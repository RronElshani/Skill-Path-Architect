import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import ProfileCard from '../components/ProfileCard.jsx'
import { loadPredictions, careerRecommendations } from '../services/careerRecommendations.js'
import { useAuth } from '../context/AuthContext.jsx'

const DIMENSION_LABELS = {
  language_skills: 'Language',
  math_and_logic: 'Logic & math',
  spatial_awareness: 'Spatial',
  physical_prowess: 'Physical',
  musical_ability: 'Musical',
  collaboration_skills: 'Collaboration',
  self_awareness: 'Self-awareness',
  sustainability_focus: 'Naturalist',
}

function ReadinessBar({ label, done }) {
  return (
    <div className="flex items-center gap-3">
      <span className={`h-2 w-2 shrink-0 rounded-full ${done ? 'bg-emerald-500' : 'bg-slate-200'}`} />
      <span className={`text-sm ${done ? 'text-slate-700' : 'text-slate-400'}`}>{label}</span>
    </div>
  )
}

export default function Profile() {
  const { user, logout } = useAuth()
  const [northStar, setNorthStar] = useState('')
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)

  const northStarKey = user ? `profile_north_star_${user.id}` : ''
  const savedCareersKey = user ? `saved_careers_user_${user.id}` : ''

  useEffect(() => {
    if (!northStarKey) return
    setNorthStar(localStorage.getItem(northStarKey) || '')
  }, [northStarKey])

  const savedIds = useMemo(() => {
    if (!savedCareersKey) return []
    try {
      const raw = localStorage.getItem(savedCareersKey)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  }, [savedCareersKey])

  const topStrengths = useMemo(() => {
    if (!user?.assessment?.completedAt || !user?.assessment?.scores) return []
    return Object.entries(user.assessment.scores)
      .map(([id, score]) => ({ id, score: Number(score) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
  }, [user?.assessment?.scores])

  if (!user) return null

  loadPredictions(user?.assessment, false, true)

  const joinedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })
    : 'Recently'

  const hasAssessment = Boolean(user.assessment?.completedAt)
  const topPrediction = user.assessment?.predictions?.[0]

  const savedCareers = savedIds
    .map((id) =>
      careerRecommendations.find(
        (c) => c.id === id || c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === id
      )
    )
    .filter(Boolean)

  const readiness = [
    { label: 'Account created', done: true },
    { label: 'Assessment completed', done: hasAssessment },
    { label: 'Career matches generated', done: Boolean(topPrediction) },
    { label: 'Careers saved', done: savedCareers.length > 0 },
  ]

  const saveNorthStar = (value) => {
    setNorthStar(value)
    localStorage.setItem(northStarKey, value)
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  const copySnapshot = async () => {
    const lines = [
      `${user.name} — Career profile`,
      northStar ? `North star: ${northStar}` : null,
      topPrediction ? `Top match: ${topPrediction.career} (${topPrediction.confidence}%)` : 'Assessment not completed yet.',
      topStrengths.length
        ? `Strengths: ${topStrengths.map((s) => DIMENSION_LABELS[s.id]).join(', ')}`
        : null,
      savedCareers.length ? `Saved: ${savedCareers.map((c) => c.name).join(', ')}` : null,
    ].filter(Boolean)

    try {
      await navigator.clipboard.writeText(lines.join('\n'))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.alert('Could not copy to clipboard.')
    }
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-5">
      <ProfileCard
        name={user.name}
        email={user.email}
        role={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
        joined={joinedDate}
      />

      <div className="grid gap-5 lg:grid-cols-2">
      {/* North star — personal one-liner */}
      <section className="card p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">North star</p>
            <p className="mt-1 text-sm text-slate-500">One sentence about where you&apos;re headed.</p>
          </div>
          <span className="text-lg" aria-hidden="true">✦</span>
        </div>
        <input
          type="text"
          value={northStar}
          onChange={(e) => saveNorthStar(e.target.value)}
          placeholder="e.g. Explore UX design while finishing my gap year"
          maxLength={120}
          className="input-field mt-4"
        />
        <p className="mt-2 text-xs text-slate-400">
          {saved ? 'Saved' : 'Auto-saves on your device'}
        </p>
      </section>

      {/* Journey readiness */}
      <section className="card p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Your journey</p>
        <div className="mt-4 space-y-2.5">
          {readiness.map((step) => (
            <ReadinessBar key={step.label} {...step} />
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link to="/assessment" className="rounded-lg bg-brand-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-brand-700">
            {hasAssessment ? 'Retake assessment' : 'Start assessment'}
          </Link>
          <Link to="/results" className="rounded-lg border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
            View results
          </Link>
          <button
            type="button"
            onClick={copySnapshot}
            className="rounded-lg border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            {copied ? 'Copied!' : 'Copy snapshot'}
          </button>
        </div>

        <div className="mt-6 border-t border-slate-100 pt-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Saved favourites</p>
          {savedCareers.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {savedCareers.map((career) => (
                <li key={career.id}>
                  <Link
                    to={`/results/careers/${career.id}`}
                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm transition hover:border-brand-200 hover:bg-brand-50/30"
                  >
                    <span className="font-medium text-slate-800">{career.name}</span>
                    <span className="text-xs text-slate-400">{career.confidence}% match</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-slate-500">
              No favourites yet.{' '}
              <Link to="/results" className="font-medium text-brand-700 hover:text-brand-800">
                Browse results
              </Link>{' '}
              to save careers you like.
            </p>
          )}
        </div>
      </section>

      {/* Top strengths — minimal bars */}
      {topStrengths.length > 0 && (
        <section className="card p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Strongest signals</p>
          <div className="mt-4 space-y-3">
            {topStrengths.map(({ id, score }) => (
              <div key={id}>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-slate-600">{DIMENSION_LABELS[id]}</span>
                  <span className="font-medium text-slate-900">{score.toFixed(1)}</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-brand-500 transition-all"
                    style={{ width: `${(score / 5) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Top match + saved — compact */}
      <section className="card p-5 lg:col-span-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Careers</p>
        {topPrediction ? (
          <Link
            to="/results"
            className="mt-4 flex items-center justify-between rounded-xl border border-brand-100 bg-brand-50/50 px-4 py-3 transition hover:border-brand-200"
          >
            <div>
              <p className="text-xs text-brand-600">Top match</p>
              <p className="font-semibold text-slate-900">{topPrediction.career}</p>
            </div>
            <span className="text-sm font-semibold text-brand-700">{topPrediction.confidence}%</span>
          </Link>
        ) : (
          <p className="mt-4 text-sm text-slate-500">Complete the assessment to see your top career match.</p>
        )}
      </section>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={logout}
          className="text-sm font-medium text-slate-500 transition hover:text-red-600"
        >
          Sign out
        </button>
      </div>
    </div>
  )
}
