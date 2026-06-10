import AiBadge, { AiSparkle } from './AiBadge.jsx'

export default function AiSummaryPanel({ title, body, highlights = [], loading = false, error = null, source = null }) {
  const paragraphs = typeof body === 'string'
    ? body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
    : []

  return (
    <section className="ai-panel p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white">
            <AiSparkle className="h-4 w-4" />
          </span>
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        </div>
        <AiBadge pulse={loading} />
      </div>

      {loading ? (
        <div className="mt-4 space-y-2">
          <div className="h-3 w-full animate-pulse rounded bg-indigo-100/80" />
          <div className="h-3 w-11/12 animate-pulse rounded bg-indigo-100/80" />
          <div className="h-3 w-10/12 animate-pulse rounded bg-indigo-100/80" />
          <div className="h-3 w-9/12 animate-pulse rounded bg-indigo-100/80" />
          <p className="mt-4 text-xs text-slate-500">Generating personalized summary...</p>
        </div>
      ) : error ? (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          <p className="font-semibold">Couldn't generate a personalized summary.</p>
          <p className="mt-1 text-xs">{error}</p>
        </div>
      ) : (
        <>
          {paragraphs.length > 0 ? (
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm leading-relaxed text-slate-600">{body}</p>
          )}

          {highlights.length > 0 && (
            <ul className="mt-5 space-y-3">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-3 rounded-lg border border-indigo-100 bg-indigo-50/40 px-3 py-2.5 text-sm text-slate-700">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-[10px] text-white">✦</span>
                  {item}
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      <p className="mt-5 border-t border-indigo-100 pt-4 text-xs text-slate-400">
        {source === 'local'
          ? 'Summary generated from your assessment profile (add LLM_API_KEY in ai/.env for AI-written text)'
          : 'Powered by LLM summary engine'}
      </p>
    </section>
  )
}
