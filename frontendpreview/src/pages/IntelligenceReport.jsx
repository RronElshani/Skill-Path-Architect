import { Link } from 'react-router-dom'
import IntelligenceRadarChart from '../components/ai/IntelligenceRadarChart.jsx'
import { AiInsightRow } from '../components/ai/AiCareerCard.jsx'
import AiBadge from '../components/ai/AiBadge.jsx'
import { loadPredictions, assessmentReport, radarSnapshot, intelligenceInsights } from '../services/careerRecommendations.js'
import { loadScores, intelligenceDimensions } from '../services/intelligenceScores.js'

export default function IntelligenceReport() {
  loadPredictions()
  loadScores()
  const sorted = [...intelligenceInsights].sort((a, b) => b.score - a.score)

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
        <div className="ai-panel p-6 lg:col-span-5">
          <h2 className="font-semibold text-slate-900">Radar visualization</h2>
          <div className="mt-4"><IntelligenceRadarChart data={radarSnapshot} /></div>
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
