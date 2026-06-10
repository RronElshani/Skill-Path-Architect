const VIEW_W = 158
const VIEW_H = 130
const CX = VIEW_W / 2
const CY = VIEW_H / 2
const RADIUS = 37
const LABEL_R = 43

const AXIS_SHORT = {
  Interpersonal: 'Social',
  Intrapersonal: 'Self',
  Naturalistic: 'Natural',
}

function polar(index, total, value, radius = RADIUS) {
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2
  const d = (value / 100) * radius
  return {
    x: CX + d * Math.cos(angle),
    y: CY + d * Math.sin(angle),
    angle,
  }
}

function labelOffsets(angle) {
  const x = Math.cos(angle)
  const y = Math.sin(angle)

  if (y < -0.45) {
    return {
      name: { textAnchor: 'middle', dx: 0, dy: -2 },
      value: { textAnchor: 'middle', dx: 0, dy: 5 },
    }
  }
  if (y > 0.45) {
    return {
      name: { textAnchor: 'middle', dx: 0, dy: 1 },
      value: { textAnchor: 'middle', dx: 0, dy: 8 },
    }
  }
  if (x > 0.35) {
    return {
      name: { textAnchor: 'start', dx: 2, dy: -1 },
      value: { textAnchor: 'start', dx: 2, dy: 5 },
    }
  }
  if (x < -0.35) {
    return {
      name: { textAnchor: 'end', dx: -2, dy: -1 },
      value: { textAnchor: 'end', dx: -2, dy: 5 },
    }
  }
  return {
    name: { textAnchor: 'middle', dx: 0, dy: -1 },
    value: { textAnchor: 'middle', dx: 0, dy: 5 },
  }
}

function axisLabel(name) {
  return AXIS_SHORT[name] || name
}

export default function IntelligenceRadarChart({ data = [], className = '' }) {
  if (!data.length) return null

  const total = data.length
  const polygon = data
    .map((item, i) => {
      const p = polar(i, total, item.value)
      return `${p.x},${p.y}`
    })
    .join(' ')

  return (
    <div
      className={`relative mx-auto w-full max-w-[360px] px-2 sm:max-w-[400px] lg:max-w-[440px] ${className}`.trim()}
    >
      <div className="relative aspect-[158/130] w-full">
        <div className="absolute inset-[8%] rounded-full bg-gradient-to-br from-indigo-400/15 to-violet-400/10 blur-xl" />
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="relative h-full w-full"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Intelligence radar chart"
        >
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

          {[25, 50, 75, 100].map((level) => (
            <circle
              key={level}
              cx={CX}
              cy={CY}
              r={(level / 100) * RADIUS}
              fill="none"
              stroke="#e0e7ff"
              strokeWidth="0.75"
            />
          ))}

          {data.map((item, i) => {
            const outer = polar(i, total, 100)
            return (
              <line
                key={item.axis}
                x1={CX}
                y1={CY}
                x2={outer.x}
                y2={outer.y}
                stroke="#e0e7ff"
                strokeWidth="0.75"
              />
            )
          })}

          <polygon
            points={polygon}
            fill="url(#aiRadarFill)"
            stroke="url(#aiRadarStroke)"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {data.map((item, i) => {
            const point = polar(i, total, item.value)
            const label = polar(i, total, 100, LABEL_R)
            const { name, value } = labelOffsets(label.angle)

            return (
              <g key={item.axis}>
                <title>{item.axis}: {item.value}</title>
                <circle cx={point.x} cy={point.y} r="2.5" fill="#6366f1" stroke="white" strokeWidth="1.25" />
                <text
                  x={label.x}
                  y={label.y}
                  {...name}
                  dominantBaseline="middle"
                  fill="#64748b"
                  fontSize="4.5"
                  fontWeight="500"
                >
                  {axisLabel(item.axis)}
                </text>
                <text
                  x={label.x}
                  y={label.y}
                  {...value}
                  dominantBaseline="middle"
                  fill="#4f46e5"
                  fontSize="5"
                  fontWeight="700"
                >
                  {item.value}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}
