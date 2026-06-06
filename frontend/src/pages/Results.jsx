import { Link } from 'react-router-dom'
import AiResultsHero from '../components/ai/AiResultsHero.jsx'
import IntelligenceRadarChart from '../components/ai/IntelligenceRadarChart.jsx'
import AiSummaryPanel from '../components/ai/AiSummaryPanel.jsx'
import AiCareerCard from '../components/ai/AiCareerCard.jsx'
import AiBadge from '../components/ai/AiBadge.jsx'
import { loadPredictions, assessmentReport, careerRecommendations, radarSnapshot, personalizedSummary, nextSteps } from '../services/careerRecommendations.js'

export default function Results() {
  loadPredictions()
  const topMatch = careerRecommendations[0]

  return (
    <div className="ai-mesh -mx-4 space-y-8 rounded-2xl px-4 py-2 sm:-mx-6 sm:px-6">
      <AiResultsHero report={assessmentReport} topMatch={topMatch} />

      <section className="grid gap-6 lg:grid-cols-12">
        <div className="ai-panel p-6 lg:col-span-7">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Neural intelligence map</h2>
              <p className="mt-1 text-sm text-slate-600">8-dimension Gardner profile visualized by the model.</p>
            </div>
            <Link to="/results/intelligences" className="text-sm font-medium text-indigo-600 hover:text-violet-600">Deep analysis →</Link>
          </div>
          <div className="mt-4"><IntelligenceRadarChart data={radarSnapshot} /></div>
          <div className="mt-4 flex flex-wrap gap-2">
            {assessmentReport.dominantIntelligences.map((n) => (
              <span key={n} className="rounded-lg border border-indigo-100 bg-indigo-50/50 px-3 py-1.5 text-xs font-medium text-indigo-800">↑ {n}</span>
            ))}
          </div>
        </div>
        <div className="lg:col-span-5">
          <AiSummaryPanel title={personalizedSummary.title} body={personalizedSummary.body} highlights={personalizedSummary.highlights} />
        </div>
      </section>

      <section>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-slate-900">AI-ranked career matches</h2>
              <AiBadge label="Top 5" />
            </div>
            <p className="mt-1 text-sm text-slate-600">XGBoost output ranked by profile alignment. Click for model reasoning.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/assessment" className="btn-ai-ghost">Retake</Link>
            <Link to="/dashboard" className="btn-ai">Dashboard</Link>
          </div>
        </div>
        <div className="grid gap-4">
          {careerRecommendations.map((career, i) => (
            <AiCareerCard key={career.id} rank={i + 1} career={career} />
          ))}
        </div>
      </section>

      <section className="ai-panel p-6 sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">AI-suggested next steps</h2>
            <p className="mt-1 text-sm text-slate-600">Personalized action plan from your report.</p>
          </div>
          <AiBadge label={`${nextSteps.length} steps`} />
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {nextSteps.map((step, i) => (
            <div key={step.title} className="flex items-start gap-4 rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50/80 to-violet-50/40 p-5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 text-sm font-semibold text-white">{i + 1}</span>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">{step.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
