import { useState } from 'react'

export default function AssessmentSlider({ name, description, initial = 50, accent = 'brand' }) {
  const [value, setValue] = useState(initial)

  const accentMap = {
    brand: 'bg-brand-50 text-brand-700',
    emerald: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700',
    violet: 'bg-violet-50 text-violet-700',
    sky: 'bg-sky-50 text-sky-700',
    rose: 'bg-rose-50 text-rose-700',
    slate: 'bg-slate-100 text-slate-700',
    teal: 'bg-teal-50 text-teal-700'
  }

  const intensityLabel = value < 25 ? 'Emerging' : value < 50 ? 'Developing' : value < 75 ? 'Confident' : 'Pronounced'

  return (
    <div className="card p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-xl">
          <span className={`badge ${accentMap[accent] || accentMap.brand}`}>{name}</span>
          <p className="mt-2.5 text-sm leading-relaxed text-slate-600">{description}</p>
        </div>
        <div className="flex shrink-0 items-baseline gap-2 sm:flex-col sm:items-end sm:gap-0">
          <span className="text-3xl font-semibold text-slate-900">{value}</span>
          <span className="text-xs font-medium uppercase tracking-wider text-slate-500">{intensityLabel}</span>
        </div>
      </div>

      <div className="mt-5">
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="slider-base"
          style={{ '--value': `${value}%` }}
          aria-label={`${name} score`}
        />
        <div className="mt-2 flex justify-between text-[11px] font-medium uppercase tracking-wider text-slate-400">
          <span>Low</span>
          <span>Moderate</span>
          <span>High</span>
        </div>
      </div>
    </div>
  )
}
