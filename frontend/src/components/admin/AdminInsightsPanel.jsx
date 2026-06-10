export default function AdminInsightsPanel({ intelligenceAvg, topCareers, users }) {
  const assessed = users.filter((u) => u.assessment?.completedAt)
  const maxIntel = Math.max(...intelligenceAvg.map((d) => d.average), 1)
  const maxCareer = topCareers[0]?.score || 1

  const confidenceBuckets = { high: 0, medium: 0, low: 0 }
  assessed.forEach((u) => {
    const c = u.assessment?.predictions?.[0]?.confidence
    if (c == null) return
    if (c >= 85) confidenceBuckets.high += 1
    else if (c >= 70) confidenceBuckets.medium += 1
    else confidenceBuckets.low += 1
  })

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-violet-500/20 bg-gradient-to-br from-violet-950/40 to-slate-900 p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-violet-300">Career guidance intelligence</p>
        <h2 className="mt-2 text-xl font-semibold text-white">What the cohort is telling us</h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          Aggregated Gardner scores and XGBoost outputs across {assessed.length} completed assessment{assessed.length === 1 ? '' : 's'}.
          Use this to spot trending paths and whether students feel confident in their matches.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Average intelligence scores</h3>
          <p className="mt-1 text-xs text-slate-500">Gardner&apos;s 8 dimensions (1–5 scale)</p>
          <div className="mt-6 space-y-4">
            {intelligenceAvg.map((dim) => (
              <div key={dim.key}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-slate-300">{dim.label}</span>
                  <span className="font-medium text-white">{dim.average > 0 ? dim.average.toFixed(2) : '—'}</span>
                </div>
                <div className="relative h-3 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-indigo-600 via-violet-500 to-fuchsia-400"
                    style={{ width: `${(dim.average / 5) * 100}%` }}
                  />
                  <div
                    className="absolute inset-y-0 w-0.5 bg-white/30"
                    style={{ left: `${(maxIntel / 5) * 100}%` }}
                    title="Highest dimension"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Match confidence spread</h3>
            <p className="mt-1 text-xs text-slate-500">How strongly the model backs its #1 pick</p>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { label: 'High (85%+)', value: confidenceBuckets.high, color: 'text-emerald-300' },
                { label: 'Medium', value: confidenceBuckets.medium, color: 'text-amber-300' },
                { label: 'Lower', value: confidenceBuckets.low, color: 'text-rose-300' },
              ].map((bucket) => (
                <div key={bucket.label} className="rounded-lg border border-slate-800 bg-slate-950 p-4 text-center">
                  <p className={`text-2xl font-semibold ${bucket.color}`}>{bucket.value}</p>
                  <p className="mt-1 text-xs text-slate-500">{bucket.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Most recommended careers</h3>
            <div className="mt-4 space-y-3">
              {topCareers.length === 0 && <p className="text-sm text-slate-500">No data yet.</p>}
              {topCareers.map((item, i) => (
                <div key={item.career} className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/15 text-xs font-bold text-violet-300">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-slate-200">{item.career}</p>
                    <div className="mt-1 h-1 rounded-full bg-slate-800">
                      <div className="h-full rounded-full bg-violet-500" style={{ width: `${(item.score / maxCareer) * 100}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
