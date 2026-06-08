import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { submitReview } from '../services/reviews.js'

function Star({ filled, onClick, onMouseEnter, onMouseLeave }) {
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="p-0.5 transition hover:scale-110 focus:outline-none"
      aria-label={filled ? 'Filled star' : 'Empty star'}
    >
      <svg
        viewBox="0 0 24 24"
        className={`h-8 w-8 ${filled ? 'text-amber-400' : 'text-slate-300'}`}
        fill="currentColor"
      >
        <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.7 7-6.3-3.8L5.7 21l1.7-7L2 9.2l7.1-.6L12 2z" />
      </svg>
    </button>
  )
}

export default function ReviewCard({ predictions = [] }) {
  const { user } = useAuth()
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [satisfied, setSatisfied] = useState(null)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (rating < 1) {
      setError('Please select a star rating from 1 to 5.')
      return
    }
    if (satisfied === null) {
      setError('Please tell us if you are satisfied with the predictions.')
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        rating,
        satisfied,
        comment: comment.trim(),
        predictions: predictions.map((p, i) => ({
          rank: i + 1,
          career: p.name,
          confidence: p.confidence,
        })),
      }
      await submitReview(payload)
      setSubmitted(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (!user) {
    return (
      <section className="ai-panel p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Are you satisfied with these recommendations?</h2>
            <p className="mt-1 text-sm text-slate-600">Sign in to share feedback on your career predictions.</p>
          </div>
          <Link to="/login" className="btn-ai">Sign in</Link>
        </div>
      </section>
    )
  }

  if (submitted) {
    return (
      <section className="ai-panel p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-slate-900">Thanks for your feedback</h2>
        <p className="mt-1 text-sm text-slate-600">
          Your review helps us improve future career predictions.
        </p>
      </section>
    )
  }

  const displayRating = hoverRating || rating

  return (
    <section className="ai-panel p-6 sm:p-8">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Are you satisfied with these recommendations?</h2>
        <p className="mt-1 text-sm text-slate-600">
          Rate the quality of your career predictions. Your feedback helps the model improve.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <p className="text-sm font-medium text-slate-700">How accurate are the recommendations?</p>
          <div className="mt-2 flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <Star
                key={n}
                filled={n <= displayRating}
                onClick={() => setRating(n)}
                onMouseEnter={() => setHoverRating(n)}
                onMouseLeave={() => setHoverRating(0)}
              />
            ))}
            {rating > 0 && (
              <span className="ml-2 text-sm text-slate-500">{rating} / 5</span>
            )}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-slate-700">Are you satisfied with the predictions?</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSatisfied(true)}
              className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${
                satisfied === true
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                  : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              👍 Yes, satisfied
            </button>
            <button
              type="button"
              onClick={() => setSatisfied(false)}
              className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${
                satisfied === false
                  ? 'border-rose-500 bg-rose-50 text-rose-700'
                  : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              👎 Not really
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="review-comment" className="text-sm font-medium text-slate-700">
            Comments (optional)
          </label>
          <textarea
            id="review-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={1000}
            rows={3}
            placeholder="What did you like or what could be better?"
            className="input-field mt-2"
          />
          <p className="mt-1 text-xs text-slate-400">{comment.length} / 1000</p>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="btn-ai disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit feedback'}
          </button>
        </div>
      </form>
    </section>
  )
}
