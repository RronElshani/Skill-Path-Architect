export default function IntelligenceCard({ name, description, score, accent = 'brand' }) {
  const accentMap = {
    brand: { chip: 'bg-brand-50 text-brand-700', bar: 'bg-brand-600' },
    emerald: { chip: 'bg-emerald-50 text-emerald-700', bar: 'bg-emerald-600' },
    amber: { chip: 'bg-amber-50 text-amber-700', bar: 'bg-amber-500' },
    violet: { chip: 'bg-violet-50 text-violet-700', bar: 'bg-violet-600' },
    sky: { chip: 'bg-sky-50 text-sky-700', bar: 'bg-sky-600' },
    rose: { chip: 'bg-rose-50 text-rose-700', bar: 'bg-rose-600' },
    slate: { chip: 'bg-slate-100 text-slate-700', bar: 'bg-slate-600' },
    teal: { chip: 'bg-teal-50 text-teal-700', bar: 'bg-teal-600' }
  }
  const colors = accentMap[accent] || accentMap.brand

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className={`badge ${colors.chip}`}>{name}</span>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">{description}</p>
        </div>
        {typeof score === 'number' && (
          <div className="text-right">
            <p className="text-2xl font-semibold text-slate-900">{score}</p>
            <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">score</p>
          </div>
        )}
      </div>
      {typeof score === 'number' && (
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div className={`h-full rounded-full ${colors.bar}`} style={{ width: `${score}%` }} />
        </div>
      )}
    </div>
  )
}
