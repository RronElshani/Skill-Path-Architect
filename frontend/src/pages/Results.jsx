import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import AiResultsHero from '../components/ai/AiResultsHero.jsx'
import IntelligenceRadarChart from '../components/ai/IntelligenceRadarChart.jsx'
import AiSummaryPanel from '../components/ai/AiSummaryPanel.jsx'
import AiCareerCard from '../components/ai/AiCareerCard.jsx'
import AiBadge from '../components/ai/AiBadge.jsx'
import ReviewCard from '../components/ReviewCard.jsx'
import { loadPredictions, assessmentReport, careerRecommendations, radarSnapshot, personalizedSummary, nextSteps } from '../services/careerRecommendations.js'
import { loadScores } from '../services/intelligenceScores.js'
import { fetchLlmSummary, loadCachedSummary, saveCachedSummary } from '../services/aiSummary.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function Results() {
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const showSample = searchParams.get('sample') === 'true'

  // Dynamically load predictions and scores
  loadPredictions(user?.assessment, showSample)
  loadScores(user?.assessment, showSample, !!user)

  // Track if we have summary reviewed
  if (careerRecommendations.length > 0 && !showSample) {
    localStorage.setItem('summary_reviewed', 'true')
  }

  const topMatch = careerRecommendations[0]

  const [llmBody, setLlmBody] = useState(personalizedSummary.body)
  const [llmLoading, setLlmLoading] = useState(false)
  const [llmError, setLlmError] = useState(null)
  const [summarySource, setSummarySource] = useState(null)

  useEffect(() => {
    // Dynamically update llmBody if personalizedSummary changes (e.g. after loadPredictions completes)
    setLlmBody(personalizedSummary.body)
  }, [personalizedSummary.body])

  useEffect(() => {
    if (showSample) {
      setLlmBody(personalizedSummary.body)
      return
    }

    const raw = localStorage.getItem('career_predictions')
    if (!raw) return

    let stored
    try {
      stored = JSON.parse(raw)
    } catch {
      return
    }

    const { scores, predictions, timestamp, summary } = stored
    if (!scores || !Array.isArray(predictions) || predictions.length === 0) return

    if (summary) {
      setLlmBody(summary)
      return
    }

    const cached = loadCachedSummary(timestamp)
    if (cached) {
      setLlmBody(cached)
      return
    }

    let cancelled = false
    setLlmLoading(true)
    setLlmError(null)

    fetchLlmSummary(predictions, scores)
      .then(({ summary, source }) => {
        if (cancelled) return
        setLlmBody(summary)
        setSummarySource(source)
        saveCachedSummary(summary, timestamp)
      })
      .catch((err) => {
        if (cancelled) return
        setLlmError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLlmLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [showSample])

  const hasResults = showSample || careerRecommendations.length > 0

  if (!hasResults) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-600 mx-auto text-3xl">
          📊
        </div>
        <h2 className="mt-5 text-2xl font-semibold text-slate-900">No assessment found</h2>
        <p className="mt-3 text-sm text-slate-600">
          You haven't completed your Howard Gardner Multiple Intelligences self-assessment yet.
          Complete the assessment to generate your personalized career blueprint.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/assessment" className="btn-primary">
            Begin assessment
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="ai-mesh -mx-4 space-y-8 rounded-2xl px-4 py-2 sm:-mx-6 sm:px-6">
      {showSample && (
        <div className="rounded-xl border border-amber-200 bg-amber-50/80 backdrop-blur-sm p-4 text-sm text-amber-800">
          <div className="flex items-center gap-2">
            <span className="text-base">💡</span>
            <span className="font-semibold">Demo Mode:</span> You are viewing a sample report for Adelina Krasniqi.
          </div>
          <p className="mt-1 ml-6 text-xs text-amber-700">
            These recommendations do not reflect your own profile.
            <Link to="/assessment" className="ml-1 font-semibold underline text-amber-900 hover:text-amber-950">
              Take the assessment
            </Link> to build your custom blueprint.
          </p>
        </div>
      )}

      <AiResultsHero report={assessmentReport} topMatch={topMatch} />

      <section className="grid gap-6 lg:grid-cols-12 lg:items-start">
        <div className="ai-panel !overflow-visible p-6 lg:col-span-7">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Neural intelligence map</h2>
              <p className="mt-1 text-sm text-slate-600">8-dimension Gardner profile visualized by the model.</p>
            </div>
            <Link to="/results/intelligences" className="text-sm font-medium text-indigo-600 hover:text-violet-600">Deep analysis →</Link>
          </div>
          <IntelligenceRadarChart data={radarSnapshot} className="mt-4" />
          <div className="mt-4 flex flex-wrap gap-2">
            {assessmentReport.dominantIntelligences.map((n) => (
              <span key={n} className="rounded-lg border border-indigo-100 bg-indigo-50/50 px-3 py-1.5 text-xs font-medium text-indigo-800">↑ {n}</span>
            ))}
          </div>
        </div>
        <div className="lg:col-span-5">
          <AiSummaryPanel
            title={personalizedSummary.title}
            body={llmBody}
            highlights={llmLoading || llmError || llmBody !== personalizedSummary.body ? [] : personalizedSummary.highlights}
            loading={llmLoading}
            error={llmError}
            source={summarySource}
          />
        </div>
      </section>

      <section>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-slate-900">AI-ranked career matches</h2>
              <AiBadge label="Top 5" />
            </div>
            <p className="mt-1 text-sm text-slate-600">Output ranked by profile alignment. Click for model reasoning.</p>
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
            <h2 className="text-lg font-semibold text-slate-900">Suggested next steps</h2>
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

      <ReviewCard predictions={careerRecommendations} />
    </div>
  )
}
