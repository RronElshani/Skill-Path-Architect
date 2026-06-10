import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SectionTitle from '../components/SectionTitle.jsx'
import AssessmentSlider from '../components/AssessmentSlider.jsx'
import TransitionLoader, { TRANSITION_LOADER_MS } from '../components/TransitionLoader.jsx'
import { intelligenceDimensions } from '../services/intelligenceScores.js'
import { useAuth } from '../context/AuthContext.jsx'
import { AI_URL, API_URL } from '../config/api.js'

const FADE_OUT_MS = 350

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export default function Assessment() {
  const navigate = useNavigate()
  const { user, updateUser, authFetch } = useAuth()
  const [phase, setPhase] = useState('idle')
  const [error, setError] = useState(null)

  const [scores, setScores] = useState({
    language_skills: 3.0,
    math_and_logic: 3.0,
    spatial_awareness: 3.0,
    physical_prowess: 3.0,
    musical_ability: 3.0,
    collaboration_skills: 3.0,
    self_awareness: 3.0,
    sustainability_focus: 3.0,
  })

  useEffect(() => {
    if (user?.assessment?.scores) {
      setScores(user.assessment.scores)
    } else {
      const saved = localStorage.getItem('saved_scores') || localStorage.getItem('career_predictions')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          const loadedScores = parsed.scores || parsed
          if (loadedScores && typeof loadedScores === 'object') {
            setScores((prev) => {
              const updated = { ...prev }
              for (const key of Object.keys(prev)) {
                if (loadedScores[key] !== undefined) {
                  updated[key] = Number(loadedScores[key])
                }
              }
              return updated
            })
          }
        } catch (e) {
          console.error('Failed to parse saved scores:', e)
        }
      }
    }
  }, [user])

  const handleScoreChange = (id, value) => {
    setScores((prev) => ({
      ...prev,
      [id]: value,
    }))
    setError(null)
  }

  const submitAssessment = async () => {
    const preprocessedPayload = {
      language_skills: (scores.language_skills - 1.0) * 5.0,
      musical_ability: (scores.musical_ability - 1.0) * 5.0,
      physical_prowess: (scores.physical_prowess - 1.0) * 5.0,
      math_and_logic: (scores.math_and_logic - 1.0) * 5.0,
      spatial_awareness: (scores.spatial_awareness - 1.0) * 5.0,
      collaboration_skills: (scores.collaboration_skills - 1.0) * 5.0,
      self_awareness: (scores.self_awareness - 1.0) * 5.0,
      sustainability_focus: (scores.sustainability_focus - 1.0) * 5.0,
      is_preprocessed: true,
    }

    let predictions = []
    let timestamp = new Date().toISOString()
    let summary = undefined

    if (user) {
      const response = await authFetch(`${API_URL}/users/assessment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scores),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to save assessment to backend')
      }

      const resData = await response.json()
      predictions = resData.data.predictions
      timestamp = resData.data.completedAt
      summary = resData.data.summary
      updateUser({ assessment: resData.data })
    } else {
      const response = await fetch(`${AI_URL}/api/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preprocessedPayload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch predictions from AI service')
      }

      const data = await response.json()
      predictions = data.predictions
    }

    localStorage.setItem(
      'career_predictions',
      JSON.stringify({ scores, predictions, summary, timestamp })
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setPhase('fading')

    await delay(FADE_OUT_MS)
    setPhase('loading')

    try {
      await Promise.all([submitAssessment(), delay(TRANSITION_LOADER_MS)])
      navigate('/results', { state: { animateEntry: true } })
    } catch (err) {
      console.error('API Error:', err)
      setPhase('idle')
      setError(
        user
          ? `Could not connect to the backend server: ${err.message}`
          : `Could not connect to the Python AI service. Please make sure the Flask backend is running on ${AI_URL}`
      )
    }
  }

  const isBusy = phase !== 'idle'

  return (
    <>
      <TransitionLoader active={phase === 'loading'} />

      <div className={phase === 'fading' ? 'page-fade-out' : undefined}>
        <div className="mx-auto max-w-3xl">
          <SectionTitle
            eyebrow="Self-assessment"
            title="Reflect on each of the eight intelligence dimensions."
            description="Assess your preference on each dimension from 1 (low) to 5 (high). Honest reflection produces the most useful career recommendations."
            align="center"
            className="text-center"
          />
        </div>

        <div className="mx-auto mt-10 max-w-4xl">
          <div className="card flex flex-wrap items-center justify-between gap-4 p-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Estimated time</p>
              <p className="mt-1 text-base font-semibold text-slate-900">About 2 minutes</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Dimensions</p>
              <p className="mt-1 text-base font-semibold text-slate-900">8 of 8 covered</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Scale</p>
              <p className="mt-1 text-base font-semibold text-slate-900">1 to 5 (Integers/Decimals)</p>
            </div>
          </div>

          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <p className="font-semibold">Prediction Failed</p>
              <p className="mt-1">{error}</p>
            </div>
          )}

          <div className="mt-8 grid gap-4">
            {intelligenceDimensions.map((dim) => (
              <AssessmentSlider
                key={dim.id}
                name={dim.name}
                description={dim.description}
                value={scores[dim.id]}
                onChange={(val) => handleScoreChange(dim.id, val)}
                accent={dim.accent}
              />
            ))}
          </div>

          <div className="mt-10 card flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-base font-semibold text-slate-900">Ready to see your career matches?</h3>
              <p className="mt-1 text-sm text-slate-600">
                Submit your scores to generate your personalized career blueprint.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isBusy}
                className="btn-primary flex items-center gap-2 disabled:opacity-50"
              >
                {isBusy ? 'Submitting...' : 'Submit Assessment'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
