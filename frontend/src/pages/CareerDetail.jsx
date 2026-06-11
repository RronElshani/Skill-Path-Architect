import { useEffect, useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import AiBadge, { AiSparkle } from '../components/ai/AiBadge.jsx'
import AiCareerCard, { AiMatchBreakdown } from '../components/ai/AiCareerCard.jsx'
import { loadPredictions, getCareerById, getRelatedCareers } from '../services/careerRecommendations.js'
import { fetchCareerByCode, formatSalary } from '../services/careers.js'
import { useAuth } from '../context/AuthContext.jsx'
import { isCareerSaved, toggleSaveCareer } from '../services/bookmarks.js'

function SalaryDashboard({ band }) {
  if (!band) return null
  const currency = band.currency || 'USD'
  const tiers = [
    { label: 'Entry', value: band.entry, accent: 'from-emerald-500 to-teal-500' },
    { label: 'Median', value: band.median, accent: 'from-indigo-500 to-violet-500' },
    { label: 'Senior', value: band.senior, accent: 'from-cyan-500 to-blue-500' },
  ]
  return (
    <section className="ai-panel p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Salary outlook</h2>
        <span className="text-xs uppercase tracking-wider text-slate-400">{currency} / year</span>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {tiers.map((t) => (
          <div key={t.label} className="rounded-xl border border-slate-100 bg-white p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{t.label}</p>
            <p className="mt-1 font-mono text-xl font-bold text-slate-900">{formatSalary(t.value, currency)}</p>
            <div className={`mt-3 h-1.5 rounded-full bg-gradient-to-r ${t.accent}`} />
          </div>
        ))}
      </div>
    </section>
  )
}

function EducationPanel({ education }) {
  if (!education) return null
  const { degrees = [], certifications = [], courses = [] } = education
  if (degrees.length === 0 && certifications.length === 0 && courses.length === 0) return null

  return (
    <section className="ai-panel p-6">
      <h2 className="text-lg font-semibold text-slate-900">Education & pathways</h2>

      {degrees.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Recommended degrees</p>
          <ul className="mt-2 space-y-2">
            {degrees.map((d) => (
              <li key={d} className="flex items-start gap-3 text-sm text-slate-700">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" />
                {d}
              </li>
            ))}
          </ul>
        </div>
      )}

      {certifications.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Certifications</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {certifications.map((c) => (
              <span key={c} className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700 ring-1 ring-violet-100">{c}</span>
            ))}
          </div>
        </div>
      )}

      {courses.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Suggested courses</p>
          <ul className="mt-2 space-y-2">
            {courses.map((course) => (
              <li key={course.title}>
                <a
                  href={course.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 bg-white px-3 py-2 text-sm transition hover:border-indigo-200 hover:bg-indigo-50/40"
                >
                  <span className="font-medium text-slate-800">{course.title}</span>
                  <span className="shrink-0 text-xs text-indigo-500">{course.provider} →</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}

export default function CareerDetail() {
  const { user } = useAuth()
  const { careerId } = useParams()

  // Load the user's predictions (confidence, match reasons) from their assessment.
  loadPredictions(user?.assessment)

  const career = getCareerById(careerId)
  const related = getRelatedCareers(career)

  // Dynamically fetch the rich profile (salary band, education) from MongoDB.
  const [profile, setProfile] = useState(null)
  const [loadingProfile, setLoadingProfile] = useState(true)

  useEffect(() => {
    let active = true
    setLoadingProfile(true)
    fetchCareerByCode(careerId)
      .then((data) => active && setProfile(data))
      .catch(() => active && setProfile(null))
      .finally(() => active && setLoadingProfile(false))
    return () => {
      active = false
    }
  }, [careerId])

  const [saved, setSaved] = useState(career ? isCareerSaved(user?.id, career.id) : false)

  const handleBookmark = () => {
    if (!career) return
    const newSaved = toggleSaveCareer(user?.id, career.id)
    setSaved(newSaved)
  }

  if (!career) return <Navigate to="/results" replace />

  // Prefer dynamic data from the registry, fall back to locally derived fields.
  const summary = profile?.summary || career.summary
  const description = profile?.description
  const outlook = profile?.outlook || career.outlook
  const workEnvironment = profile?.workEnvironment || career.workEnvironment
  const skills = profile?.skills?.length ? profile.skills : career.skills
  const responsibilities = profile?.responsibilities?.length ? profile.responsibilities : career.responsibilities

  return (
    <div className="ai-mesh -mx-4 space-y-8 rounded-2xl px-4 py-2 sm:-mx-6 sm:px-6">
      <nav className="text-sm text-slate-500">
        <Link to="/results" className="hover:text-indigo-600">Results</Link>
        <span className="mx-2">/</span>
        <span className="font-medium text-slate-800">{career.name}</span>
      </nav>

      <header className="ai-panel-dark p-6 sm:p-8">
        <AiBadge label="Career match analysis" pulse />
        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold sm:text-3xl">{career.name}</h1>
            <p className="mt-1 text-sm uppercase tracking-wider text-indigo-300">{outlook}</p>
          </div>
          <div className="text-right">
            <p className="font-mono text-4xl font-bold text-cyan-300">{career.confidence}%</p>
            <p className="text-xs text-indigo-300">model confidence</p>
          </div>
        </div>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-indigo-100">{summary}</p>
        {description && (
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-indigo-100/80">{description}</p>
        )}
        {career.aiReasoning && (
          <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase text-cyan-300">
              <AiSparkle className="h-3.5 w-3.5" /> Model reasoning
            </div>
            <p className="mt-2 text-sm text-indigo-100/90">{career.aiReasoning}</p>
          </div>
        )}
      </header>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <SalaryDashboard band={profile?.salaryBand} />
          <section className="ai-panel p-6">
            <h2 className="text-lg font-semibold text-slate-900">Intelligence alignment</h2>
            <div className="mt-5"><AiMatchBreakdown reasons={career.matchReasons} /></div>
          </section>
          <section className="ai-panel p-6">
            <h2 className="text-lg font-semibold text-slate-900">Role responsibilities</h2>
            <ul className="mt-4 space-y-3">
              {responsibilities.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-slate-700">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" />
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </div>
        <aside className="space-y-6 lg:col-span-5">
          <EducationPanel education={profile?.education} />
          {loadingProfile && !profile && (
            <div className="ai-panel p-6 text-sm text-slate-400">Loading career library data…</div>
          )}
          <div className="ai-panel p-6">
            <h2 className="font-semibold text-slate-900">At a glance</h2>
            <dl className="mt-4 space-y-4 text-sm">
              <div><dt className="text-slate-400">Outlook</dt><dd className="mt-1 text-slate-800">{outlook}</dd></div>
              <div><dt className="text-slate-400">Environment</dt><dd className="mt-1 text-slate-800">{workEnvironment}</dd></div>
            </dl>
          </div>
          <div className="ai-panel p-6">
            <h2 className="font-semibold text-slate-900">Key skills</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {skills.map((s) => (
                <span key={s} className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 ring-1 ring-indigo-100">{s}</span>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-slate-900">Similar AI matches</h2>
          <div className="mt-4 grid gap-4">
            {related.map((item, i) => <AiCareerCard key={item.id} rank={i + 1} career={item} />)}
          </div>
        </section>
      )}

      <div className="flex flex-wrap gap-2 pb-4">
        <Link to="/results" className="btn-ai-ghost">← Full report</Link>
        <button
          type="button"
          onClick={handleBookmark}
          className={`btn-ai-ghost flex items-center gap-2 ${
            saved ? 'text-indigo-600 border-indigo-200 bg-indigo-50 hover:bg-indigo-100/50' : 'hover:border-slate-300'
          }`}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
          </svg>
          {saved ? 'Saved' : 'Save Recommendation'}
        </button>
        <Link to="/assessment" className="btn-ai">Retake assessment</Link>
      </div>
    </div>
  )
}
