import { useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import AiBadge, { AiSparkle } from '../components/ai/AiBadge.jsx'
import AiCareerCard, { AiMatchBreakdown } from '../components/ai/AiCareerCard.jsx'
import { loadPredictions, getCareerById, getRelatedCareers } from '../services/careerRecommendations.js'
import { useAuth } from '../context/AuthContext.jsx'
import { isCareerSaved, toggleSaveCareer } from '../services/bookmarks.js'

export default function CareerDetail() {
  const { user } = useAuth()
  const { careerId } = useParams()

  // Load user's predictions dynamically
  loadPredictions(user?.assessment)

  const career = getCareerById(careerId)
  const related = getRelatedCareers(career)

  const [saved, setSaved] = useState(career ? isCareerSaved(user?.id, career.id) : false)

  const handleBookmark = () => {
    if (!career) return
    const newSaved = toggleSaveCareer(user?.id, career.id)
    setSaved(newSaved)
  }

  if (!career) return <Navigate to="/results" replace />

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
            <p className="mt-1 text-sm uppercase tracking-wider text-indigo-300">{career.outlook}</p>
          </div>
          <div className="text-right">
            <p className="font-mono text-4xl font-bold text-cyan-300">{career.confidence}%</p>
            <p className="text-xs text-indigo-300">model confidence</p>
          </div>
        </div>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-indigo-100">{career.summary}</p>
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
          <section className="ai-panel p-6">
            <h2 className="text-lg font-semibold text-slate-900">Intelligence alignment</h2>
            <div className="mt-5"><AiMatchBreakdown reasons={career.matchReasons} /></div>
          </section>
          <section className="ai-panel p-6">
            <h2 className="text-lg font-semibold text-slate-900">Role responsibilities</h2>
            <ul className="mt-4 space-y-3">
              {career.responsibilities.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-slate-700">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" />
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </div>
        <aside className="space-y-6 lg:col-span-5">
          <div className="ai-panel p-6">
            <h2 className="font-semibold text-slate-900">At a glance</h2>
            <dl className="mt-4 space-y-4 text-sm">
              <div><dt className="text-slate-400">Education</dt><dd className="mt-1 text-slate-800">{career.education}</dd></div>
              <div><dt className="text-slate-400">Salary</dt><dd className="mt-1 font-mono text-slate-800">{career.salaryRange}</dd></div>
              <div><dt className="text-slate-400">Environment</dt><dd className="mt-1 text-slate-800">{career.workEnvironment}</dd></div>
            </dl>
          </div>
          <div className="ai-panel p-6">
            <h2 className="font-semibold text-slate-900">Key skills</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {career.skills.map((s) => (
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
