import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import IntelligenceRadarChart from '../components/ai/IntelligenceRadarChart.jsx'
import { AiInsightRow } from '../components/ai/AiCareerCard.jsx'
import AiBadge from '../components/ai/AiBadge.jsx'
import { loadPredictions, assessmentReport, radarSnapshot, intelligenceInsights } from '../services/careerRecommendations.js'
import { loadScores, intelligenceDimensions } from '../services/intelligenceScores.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function IntelligenceReport() {
  const { user, loading } = useAuth()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (loading) return

    loadPredictions(user?.assessment, false, !!user)
    loadScores(user?.assessment, false, !!user)
    setReady(true)
  }, [user, loading])

  if (loading || !ready) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-sm font-medium text-slate-500">Loading neural profile...</p>
      </div>
    )
  }

  const hasData = radarSnapshot.length > 0
  const sorted = [...intelligenceInsights].sort((a, b) => b.score - a.score)

  if (!hasData) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 mx-auto text-3xl">
          🧠
        </div>
        <h2 className="mt-5 text-2xl font-semibold text-slate-900">No assessment data yet</h2>
        <p className="mt-3 text-sm text-slate-600">
          Complete the Multiple Intelligences assessment to generate your cognitive neural map and dimension breakdown.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/assessment" className="btn-primary">Begin assessment</Link>
          <Link to="/results" className="btn-secondary">Back to results</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="ai-mesh -mx-4 space-y-8 rounded-2xl px-4 py-2 sm:-mx-6 sm:px-6">
      <nav className="text-sm text-slate-500">
        <Link to="/results" className="hover:text-indigo-600">Results</Link>
        <span className="mx-2">/</span>
        <span className="font-medium text-slate-800">Neural profile</span>
      </nav>

      <header className="ai-panel-dark p-6 sm:p-8">
        <AiBadge label="Deep profile analysis" pulse />
        <h1 className="mt-3 text-2xl font-semibold sm:text-3xl">Cognitive neural map</h1>
        <p className="mt-2 max-w-2xl text-sm text-indigo-100">
          Full Gardner breakdown for {assessmentReport.studentName} · {assessmentReport.modelVersion} · {assessmentReport.completedAt}
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-12">
        <div className="ai-panel !overflow-visible p-6 lg:col-span-5">
          <h2 className="font-semibold text-slate-900">Radar visualization</h2>
          <div className="mt-4 w-full">
            <IntelligenceRadarChart data={radarSnapshot} className="mt-2" />
          </div>
        </div>
        <div className="lg:col-span-7">
          <h2 className="font-semibold text-slate-900">Dimension matrix</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {intelligenceDimensions.map((dim) => (
              <div key={dim.id} className="ai-panel p-4">
                <div className="flex justify-between">
                  <h3 className="text-sm font-semibold text-slate-900">{dim.name}</h3>
                  <span className="font-mono text-lg font-bold ai-gradient-text">{dim.score}</span>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-indigo-50">
                  <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" style={{ width: `${dim.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center gap-2">
          <h2 className="text-lg font-semibold text-slate-900">AI dimension insights</h2>
          <AiBadge />
        </div>
        <div className="grid gap-4">
          {sorted.map((insight) => <AiInsightRow key={insight.id} insight={insight} />)}
        </div>
      </section>

      <div className="flex flex-wrap gap-2 pb-4">
        <Link to="/results" className="btn-ai-ghost">← Full report</Link>
        <Link to="/assessment" className="btn-ai">Retake assessment</Link>
      </div>
    </div>
  )
}
