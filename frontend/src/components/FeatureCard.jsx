export default function FeatureCard({ icon, title, description, accent = 'brand' }) {
  const accentMap = {
    brand: 'bg-brand-50 text-brand-700',
    emerald: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700',
    violet: 'bg-violet-50 text-violet-700',
    sky: 'bg-sky-50 text-sky-700',
    rose: 'bg-rose-50 text-rose-700'
  }

  return (
    <div className="card group p-6 transition hover:-translate-y-0.5 hover:shadow-md">
      <div className={`inline-flex h-11 w-11 items-center justify-center rounded-lg ${accentMap[accent] || accentMap.brand}`}>
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
    </div>
  )
}
