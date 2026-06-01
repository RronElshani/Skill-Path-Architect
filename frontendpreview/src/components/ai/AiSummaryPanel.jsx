import AiBadge, { AiSparkle } from './AiBadge.jsx'

export default function AiSummaryPanel({ title, body, highlights = [] }) {
  return (
    <section className="ai-panel p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white">
            <AiSparkle className="h-4 w-4" />
          </span>
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        </div>
        <AiBadge />
      </div>
      <p className="mt-4 text-sm leading-relaxed text-slate-600">{body}</p>
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
      <p className="mt-5 border-t border-indigo-100 pt-4 text-xs text-slate-400">Powered by LLM summary engine</p>
    </section>
  )
}
