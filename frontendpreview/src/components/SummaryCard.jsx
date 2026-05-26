export default function SummaryCard({ title, body, highlights = [], footer }) {
  return (
    <section className="card relative overflow-hidden p-6">
      <div className="absolute right-0 top-0 h-32 w-32 -translate-y-12 translate-x-12 rounded-full bg-brand-100/70 blur-2xl" />
      <div className="relative">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2l2.39 4.84L20 8l-4 3.91.94 5.46L12 14.77 7.06 17.37 8 11.91 4 8l5.61-1.16L12 2z" />
            </svg>
          </span>
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-slate-600">{body}</p>

        {highlights.length > 0 && (
          <ul className="mt-5 space-y-2.5">
            {highlights.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-slate-700">
                <span className="mt-1 flex h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}

        {footer && <div className="mt-5 border-t border-slate-200 pt-4 text-xs text-slate-500">{footer}</div>}
      </div>
    </section>
  )
}
