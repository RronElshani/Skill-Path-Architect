import SectionTitle from './SectionTitle.jsx'

function Stars({ rating }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          viewBox="0 0 24 24"
          className={`h-4 w-4 ${star <= rating ? 'text-amber-400' : 'text-slate-200'}`}
          fill="currentColor"
        >
          <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.7 7-6.3-3.8L5.7 21l1.7-7L2 9.2l7.1-.6L12 2z" />
        </svg>
      ))}
    </div>
  )
}

function PublicReviewCard({ review }) {
  const initials = review.displayName
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <article className="card flex h-full flex-col p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
            {initials}
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-900">{review.displayName}</p>
            <p className="text-xs text-slate-500">
              {new Date(review.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>
        <Stars rating={review.rating} />
      </div>

      {review.comment ? (
        <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-600">
          &ldquo;{review.comment}&rdquo;
        </p>
      ) : (
        <p className="mt-4 flex-1 text-sm italic text-slate-500">
          {review.satisfied
            ? 'Found the career recommendations helpful.'
            : 'Shared feedback on their prediction results.'}
        </p>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
        <span
          className={`badge ${review.satisfied ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
            }`}
        >
          {review.satisfied ? 'Satisfied' : 'Mixed feedback'}
        </span>
        {review.topCareer && (
          <span className="badge bg-brand-50 text-brand-700">Top match: {review.topCareer}</span>
        )}
      </div>
    </article>
  )
}

const HARDCODED_REVIEWS = [
  {
    id: 'rev-1',
    displayName: 'Alice Johnson',
    rating: 5,
    satisfied: true,
    comment: 'The career recommendations were spot on! It perfectly matched my passion for language and writing.',
    topCareer: 'Technical Writer',
    createdAt: '2026-06-12T10:00:00.000Z'
  },
  {
    id: 'rev-2',
    displayName: 'Bob Smith',
    rating: 5,
    satisfied: true,
    comment: 'Incredible accuracy. I am currently studying computer science, and this confirmed my path.',
    topCareer: 'Software Engineer',
    createdAt: '2026-06-12T11:00:00.000Z'
  },
  {
    id: 'rev-3',
    displayName: 'Charlie Brown',
    rating: 4,
    satisfied: true,
    comment: 'Very helpful overview. The suggestions highlighted my physical and collaboration skills well.',
    topCareer: 'Fitness Instructor',
    createdAt: '2026-06-12T12:00:00.000Z'
  }
]

function formatPublicName(name) {
  if (!name?.trim()) return 'A student'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0]
  return `${parts[0]} ${parts[parts.length - 1][0]}.`
}

export default function HomeReviewsSection() {
  const reviews = HARDCODED_REVIEWS.map(r => ({
    ...r,
    displayName: formatPublicName(r.displayName)
  }))

  const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
  const satisfiedPct = Math.round((reviews.filter((r) => r.satisfied).length / reviews.length) * 100)

  return (
    <section className="border-t border-slate-200 bg-slate-50 py-20">
      <div className="container-page">
        <SectionTitle
          eyebrow="Student voices"
          title="What graduates are saying"
          description="Real feedback from students who completed the assessment and reviewed their AI career matches."
          align="center"
        />

        {reviews.length > 0 && (
          <div className="mx-auto mt-8 flex max-w-xl flex-wrap items-center justify-center gap-6 text-center">
            <div>
              <p className="text-3xl font-semibold text-slate-900">{avgRating}</p>
              <p className="text-xs uppercase tracking-wider text-slate-500">Avg rating</p>
            </div>
            <div className="h-10 w-px bg-slate-200" />
            <div>
              <p className="text-3xl font-semibold text-slate-900">{satisfiedPct}%</p>
              <p className="text-xs uppercase tracking-wider text-slate-500">Satisfied</p>
            </div>
          </div>
        )}

        <div className="mt-12">
          {reviews.length === 0 ? (
            <div className="card mx-auto max-w-lg p-8 text-center">
              <p className="text-sm font-medium text-slate-900">No reviews yet</p>
              <p className="mt-2 text-sm text-slate-600">
                Be the first to complete the assessment and share how the recommendations worked for you.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {reviews.map((review) => (
                <PublicReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
