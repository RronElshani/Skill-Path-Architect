function Stars({ rating }) {
  return (
    <span className="inline-flex gap-0.5 text-amber-400">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} viewBox="0 0 20 20" className={`h-4 w-4 ${star <= rating ? 'fill-current' : 'fill-slate-700'}`}>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  )
}

export default function AdminReviewsPanel({ reviews, loading, actionId, onDelete, onRefresh }) {
  const satisfied = reviews.filter((r) => r.satisfied).length
  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Total reviews', value: reviews.length },
          { label: 'Average rating', value: reviews.length ? avg.toFixed(1) : '—' },
          { label: 'Would recommend', value: reviews.length ? `${((satisfied / reviews.length) * 100).toFixed(0)}%` : '—' },
        ].map((item) => (
          <div key={item.label} className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-xs uppercase tracking-wider text-slate-500">{item.label}</p>
            <p className="mt-2 text-2xl font-semibold text-white">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Prediction feedback</h2>
            <p className="mt-1 text-xs text-slate-500">How students feel about their AI career matches</p>
          </div>
          <button type="button" onClick={onRefresh} className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-800">
            Refresh
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {loading && <p className="text-sm text-slate-500">Loading reviews...</p>}
          {!loading && reviews.length === 0 && (
            <p className="rounded-lg border border-dashed border-slate-800 py-12 text-center text-sm text-slate-500">
              No student feedback yet. Reviews appear after students rate their results.
            </p>
          )}
          {reviews.map((review) => (
            <article key={review._id} className="rounded-xl border border-slate-800 bg-slate-950/50 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">{review.user?.name || 'Unknown student'}</p>
                  <p className="text-xs text-slate-500">{review.user?.email}</p>
                </div>
                <div className="text-right">
                  <Stars rating={review.rating} />
                  <p className={`mt-1 text-xs font-medium ${review.satisfied ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {review.satisfied ? 'Satisfied with matches' : 'Not satisfied'}
                  </p>
                </div>
              </div>

              {review.comment && (
                <p className="mt-4 text-sm leading-relaxed text-slate-300">&ldquo;{review.comment}&rdquo;</p>
              )}

              {review.predictions?.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {review.predictions.slice(0, 3).map((p) => (
                    <span key={p.rank} className="rounded-full border border-slate-800 bg-slate-900 px-2.5 py-1 text-xs text-slate-400">
                      #{p.rank} {p.career}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-4 flex items-center justify-between text-xs text-slate-600">
                <span>{new Date(review.createdAt).toLocaleString()}</span>
                <button
                  type="button"
                  disabled={actionId === review._id}
                  onClick={() => onDelete(review._id)}
                  className="text-rose-400 hover:text-rose-300 disabled:opacity-50"
                >
                  Remove
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
