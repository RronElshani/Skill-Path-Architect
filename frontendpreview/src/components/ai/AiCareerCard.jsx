import { Link } from 'react-router-dom'

function confidenceStyle(c) {
  if (c >= 85) return { chip: 'from-emerald-500 to-teal-500', ring: 'ring-emerald-200' }
  if (c >= 70) return { chip: 'from-indigo-500 to-violet-500', ring: 'ring-indigo-200' }
  return { chip: 'from-amber-400 to-orange-400', ring: 'ring-amber-200' }
}

export default function AiCareerCard({ rank, career }) {
  const style = confidenceStyle(career.confidence)
  const gradId = `grad-${career.id}`

  return (
    <Link to={`/results/careers/${career.id}`} className={`ai-panel ai-panel-interactive group block p-5 transition ${style.ring} hover:ring-2`}>
      <div className="flex items-start gap-4">
        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center">
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 56 56">
            <circle cx="28" cy="28" r="24" fill="none" stroke="#e0e7ff" strokeWidth="4" />
            <circle cx="28" cy="28" r="24" fill="none" stroke={`url(#${gradId})`} strokeWidth="4" strokeLinecap="round" strokeDasharray={`${(career.confidence / 100) * 150.8} 150.8`} />
            <defs>
              <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6366f1" /><stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
          <span className="font-mono text-sm font-bold text-indigo-700">{career.confidence}%</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">#{String(rank).padStart(2, '0')}</span>
              <h3 className="text-lg font-semibold text-slate-900 group-hover:ai-gradient-text">{career.name}</h3>
            </div>
            <span className={`rounded-full bg-gradient-to-r ${style.chip} px-2.5 py-0.5 text-xs font-semibold text-white`}>AI match</span>
          </div>
          <p className="mt-2 text-sm text-slate-600 line-clamp-2">{career.summary}</p>
          {career.aiReasoning && (
            <p className="mt-3 rounded-lg border border-indigo-100 bg-indigo-50/50 px-3 py-2 text-xs text-indigo-800">
              <span className="font-semibold">Model: </span>{career.aiReasoning}
            </p>
          )}
          <p className="mt-3 text-sm font-medium text-indigo-600 opacity-0 transition group-hover:opacity-100">View AI breakdown →</p>
        </div>
      </div>
    </Link>
  )
}

export function AiMatchBreakdown({ reasons = [] }) {
  return (
    <div className="space-y-3">
      {reasons.map((r) => (
        <div key={r.intelligence} className="ai-panel p-4">
          <div className="flex justify-between gap-3">
            <p className="text-sm font-semibold text-slate-900">{r.intelligence}</p>
            <span className="font-mono text-sm font-bold ai-gradient-text">{r.score}</span>
          </div>
          <p className="mt-1.5 text-sm text-slate-600">{r.note}</p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-indigo-50">
            <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" style={{ width: `${r.score}%` }} />
          </div>
        </div>
      ))}
    </div>
  )
}

const tierStyles = {
  Dominant: 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white',
  Strong: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white',
  Moderate: 'bg-gradient-to-r from-amber-400 to-orange-400 text-white',
  Growth: 'bg-slate-200 text-slate-700'
}

export function AiInsightRow({ insight }) {
  return (
    <article className="ai-panel p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-slate-900">{insight.label}</h3>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${tierStyles[insight.tier]}`}>{insight.tier}</span>
          </div>
          <p className="mt-2 text-sm text-slate-600">{insight.insight}</p>
        </div>
        <div className="text-right">
          <p className="font-mono text-2xl font-bold ai-gradient-text">{insight.score}</p>
          <p className="text-[11px] uppercase tracking-wider text-slate-400">{insight.percentile}th pct</p>
        </div>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-indigo-50">
        <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400" style={{ width: `${insight.score}%` }} />
      </div>
    </article>
  )
}
