const SIZE = 300
const CENTER = SIZE / 2
const RADIUS = 105

function polar(index, total, value) {
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2
  const d = (value / 100) * RADIUS
  return { x: CENTER + d * Math.cos(angle), y: CENTER + d * Math.sin(angle) }
}

export default function IntelligenceRadarChart({ data = [] }) {
  if (!data.length) return null
  const polygon = data.map((item, i) => { const p = polar(i, data.length, item.value); return `${p.x},${p.y}` }).join(' ')

  return (
    <div className="relative mx-auto w-full max-w-xs">
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-400/20 to-violet-400/10 blur-2xl" />
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="relative h-auto w-full" role="img" aria-label="Intelligence radar">
        <defs>
          <linearGradient id="aiRadarFill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="aiRadarStroke" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        {[25, 50, 75, 100].map((l) => (
          <circle key={l} cx={CENTER} cy={CENTER} r={(l / 100) * RADIUS} fill="none" stroke="#e0e7ff" strokeWidth="1" />
        ))}
        {data.map((item, i) => {
          const o = polar(i, data.length, 100)
          return <line key={item.axis} x1={CENTER} y1={CENTER} x2={o.x} y2={o.y} stroke="#e0e7ff" strokeWidth="1" />
        })}
        <polygon points={polygon} fill="url(#aiRadarFill)" stroke="url(#aiRadarStroke)" strokeWidth="2.5" strokeLinejoin="round" />
        {data.map((item, i) => {
          const p = polar(i, data.length, item.value)
          const l = polar(i, data.length, 122)
          return (
            <g key={item.axis}>
              <circle cx={p.x} cy={p.y} r="5" fill="#6366f1" stroke="white" strokeWidth="2" />
              <text x={l.x} y={l.y} textAnchor="middle" className="fill-slate-500 text-[9px] font-medium">{item.axis}</text>
              <text x={l.x} y={l.y + 11} textAnchor="middle" className="fill-indigo-600 text-[10px] font-bold">{item.value}</text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
