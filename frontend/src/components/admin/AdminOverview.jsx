function StatusDot({ status }) {
  const colors = {
    online: 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]',
    degraded: 'bg-amber-400',
    offline: 'bg-rose-500',
  }
  return <span className={`inline-block h-2 w-2 rounded-full ${colors[status] || colors.offline}`} />
}

function StatCard({ label, value, hint, accent = 'text-white' }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5">
      <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{label}</p>
      <p className={`mt-2 text-3xl font-semibold ${accent}`}>{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  )
}

export default function AdminOverview({ stats, funnel, topCareers, activity, services, intelligenceAvg }) {
  const strongest = [...intelligenceAvg].sort((a, b) => b.average - a.average)[0]

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Registered students" value={stats.studentCount} hint={`${stats.totalUsers} total accounts`} />
        <StatCard
          label="Assessment completion"
          value={`${stats.completionRate.toFixed(0)}%`}
          hint={`${stats.assessedCount} finished self-assessment`}
          accent="text-amber-200"
        />
        <StatCard
          label="Avg model confidence"
          value={stats.avgTopConfidence ? `${stats.avgTopConfidence.toFixed(1)}%` : '—'}
          hint="Top career match strength"
          accent="text-cyan-200"
        />
        <StatCard
          label="Student satisfaction"
          value={stats.reviewCount ? `${stats.satisfactionRate.toFixed(0)}%` : '—'}
          hint={stats.reviewCount ? `${stats.avgRating.toFixed(1)}/5 avg · ${stats.reviewCount} reviews` : 'No feedback yet'}
          accent="text-emerald-200"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 lg:col-span-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Student journey funnel</h2>
          <p className="mt-1 text-xs text-slate-500">From registration to leaving prediction feedback</p>
          <div className="mt-6 space-y-4">
            {funnel.map((step) => (
              <div key={step.label}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="text-slate-300">{step.label}</span>
                  <span className="font-medium text-white">{step.value}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all"
                    style={{ width: `${Math.max(step.pct, step.value > 0 ? 8 : 0)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          {strongest?.average > 0 && (
            <p className="mt-6 rounded-lg border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-400">
              Cohort leans toward <span className="font-medium text-amber-200">{strongest.label}</span>
              {' '}({strongest.average.toFixed(1)}/5 avg across assessed students).
            </p>
          )}
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">System health</h2>
          <div className="mt-5 space-y-4">
            {[
              { name: 'Express API', desc: 'Auth, users, assessments', status: services.api },
              { name: 'MongoDB', desc: services.database || 'User & assessment storage', status: services.api === 'online' ? 'online' : 'offline' },
              { name: 'SVM Classifier', desc: 'Career prediction engine', status: services.ai },
            ].map((svc) => (
              <div key={svc.name} className="flex items-start gap-3 rounded-lg border border-slate-800 bg-slate-950/50 p-4">
                <StatusDot status={svc.status} />
                <div>
                  <p className="text-sm font-medium text-white">{svc.name}</p>
                  <p className="text-xs text-slate-500">{svc.desc}</p>
                  <p className="mt-1 text-xs capitalize text-slate-400">{svc.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Hot career paths</h2>
          <p className="mt-1 text-xs text-slate-500">Weighted by rank in student Top-5 lists</p>
          <div className="mt-5 space-y-3">
            {topCareers.length === 0 && (
              <p className="text-sm text-slate-500">No predictions yet — waiting for assessments.</p>
            )}
            {topCareers.map((item, index) => {
              const max = topCareers[0]?.score || 1
              return (
                <div key={item.career}>
                  <div className="mb-1 flex items-center justify-between gap-2 text-sm">
                    <span className="truncate text-slate-300">
                      <span className="mr-2 text-xs text-slate-600">#{index + 1}</span>
                      {item.career}
                    </span>
                    <span className="shrink-0 text-xs text-slate-500">{item.score} pts</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400"
                      style={{ width: `${(item.score / max) * 100}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Live activity</h2>
          <div className="mt-5 space-y-3">
            {activity.length === 0 && (
              <p className="text-sm text-slate-500">No activity recorded yet.</p>
            )}
            {activity.map((event) => (
              <div key={event.id} className="flex gap-3 border-l-2 border-slate-800 pl-4">
                <span className="mt-0.5 text-lg leading-none">
                  {event.type === 'registration' && '👤'}
                  {event.type === 'assessment' && '🎯'}
                  {event.type === 'review' && '💬'}
                </span>
                <div>
                  <p className="text-sm text-slate-300">{event.label}</p>
                  <p className="text-xs text-slate-600">
                    {new Date(event.at).toLocaleString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
