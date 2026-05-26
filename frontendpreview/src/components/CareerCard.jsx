export default function CareerCard({ rank, name, confidence, summary, intelligences = [], outlook }) {
  const confidenceTone =
    confidence >= 85
      ? { chip: 'bg-emerald-50 text-emerald-700', bar: 'bg-emerald-500' }
      : confidence >= 70
      ? { chip: 'bg-brand-50 text-brand-700', bar: 'bg-brand-600' }
      : { chip: 'bg-amber-50 text-amber-700', bar: 'bg-amber-500' }

  return (
    <article className="card p-6 transition hover:shadow-md">
      <div className="flex items-start gap-5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-base font-semibold text-slate-700">
          {String(rank).padStart(2, '0')}
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">{name}</h3>
              {outlook && <p className="mt-0.5 text-xs font-medium uppercase tracking-wider text-slate-500">{outlook}</p>}
            </div>
            <span className={`badge ${confidenceTone.chip}`}>{confidence}% match</span>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-slate-600">{summary}</p>

          <div className="mt-4">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div className={`h-full rounded-full ${confidenceTone.bar}`} style={{ width: `${confidence}%` }} />
            </div>
          </div>

          {intelligences.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {intelligences.map((tag) => (
                <span key={tag} className="badge bg-slate-100 text-slate-700">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
