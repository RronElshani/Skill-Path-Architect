import { useState } from 'react'

export default function AssessmentSlider({ name, description, value: controlledValue, onChange, initial = 3, accent = 'brand' }) {
  const [localValue, setLocalValue] = useState(initial)
  
  const isControlled = controlledValue !== undefined
  const value = isControlled ? controlledValue : localValue

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

  // Define intensity label based on 1-5 scale
  const intensityLabel = value < 2.0 
    ? 'Emerging' 
    : value < 3.5 
      ? 'Developing' 
      : value < 4.5 
        ? 'Confident' 
        : 'Pronounced'

  const handleChange = (e) => {
    const val = Number(e.target.value)
    if (isControlled) {
      if (onChange) onChange(val)
    } else {
      setLocalValue(val)
    }
  }

  // Calculate percentage for progress fill: (value - min) / (max - min) * 100
  const progressPercent = ((value - 1) / 4) * 100

  return (
    <div className="card p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-xl">
          <span className={`badge ${accentMap[accent] || accentMap.brand}`}>{name}</span>
          <p className="mt-2.5 text-sm leading-relaxed text-slate-600">{description}</p>
        </div>
        <div className="flex shrink-0 items-baseline gap-2 sm:flex-col sm:items-end sm:gap-0">
          <span className="text-3xl font-semibold text-slate-900">{value.toFixed(1)}</span>
          <span className="text-xs font-medium uppercase tracking-wider text-slate-500">{intensityLabel}</span>
        </div>
      </div>

      <div className="mt-5">
        <input
          type="range"
          min="1"
          max="5"
          step="0.1"
          value={value}
          onChange={handleChange}
          className="slider-base"
          style={{ '--value': `${progressPercent}%` }}
          aria-label={`${name} score`}
        />
        <div className="mt-2 flex justify-between text-[11px] font-medium uppercase tracking-wider text-slate-400">
          <span>1.0 (Low)</span>
          <span>3.0 (Moderate)</span>
          <span>5.0 (High)</span>
        </div>
      </div>
    </div>
  )
}

