import { useEffect, useState } from 'react'

const STEPS = [
  'Calibrating Gardner intelligence metrics...',
  'Querying career classification network...',
  'Assembling personalized counselor report...',
]

const NODES = [
  { x: 50, y: 12 },
  { x: 82, y: 28 },
  { x: 88, y: 58 },
  { x: 68, y: 82 },
  { x: 32, y: 82 },
  { x: 12, y: 58 },
  { x: 18, y: 28 },
  { x: 50, y: 50 },
]

const EDGES = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 0],
  [0, 7], [1, 7], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7],
]

export default function TransitionLoader({ active = false }) {
  const [stepIndex, setStepIndex] = useState(0)

  useEffect(() => {
    if (!active) {
      setStepIndex(0)
      return undefined
    }

    const timers = STEPS.map((_, i) =>
      window.setTimeout(() => setStepIndex(i), i * 1000)
    )

    return () => timers.forEach(clearTimeout)
  }, [active])

  if (!active) return null

  const progress = ((stepIndex + 1) / STEPS.length) * 100

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-950 transition-loader-enter"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="transition-loader-ring absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-indigo-500/20" />
        <div className="transition-loader-ring transition-loader-ring-delay absolute left-1/2 top-1/2 h-[20rem] w-[20rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-400/25" />
        <div className="transition-loader-ring transition-loader-ring-delay-2 absolute left-1/2 top-1/2 h-[12rem] w-[12rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/30" />
      </div>

      <div className="relative mx-auto w-full max-w-md px-6 text-center">
        <div className="relative mx-auto mb-10 h-44 w-44">
          <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true">
            <defs>
              <linearGradient id="netStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#22d3ee" />
              </linearGradient>
            </defs>
            {EDGES.map(([a, b], i) => (
              <line
                key={`${a}-${b}`}
                x1={NODES[a].x}
                y1={NODES[a].y}
                x2={NODES[b].x}
                y2={NODES[b].y}
                stroke="url(#netStroke)"
                strokeWidth="0.6"
                strokeOpacity="0.45"
                className="transition-loader-edge"
                style={{ animationDelay: `${i * 80}ms` }}
              />
            ))}
            {NODES.map((node, i) => (
              <g key={i}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={i === 7 ? 5 : 3.5}
                  fill={i === 7 ? '#a5b4fc' : '#6366f1'}
                  className="transition-loader-node"
                  style={{ animationDelay: `${i * 120}ms` }}
                />
                {i === 7 && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="8"
                    fill="none"
                    stroke="#818cf8"
                    strokeWidth="0.8"
                    className="transition-loader-pulse"
                  />
                )}
              </g>
            ))}
          </svg>
        </div>

        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300">
          Neural network processing
        </p>
        <h2 className="mt-3 text-xl font-semibold text-white sm:text-2xl">
          Building your career blueprint
        </h2>

        <div className="mx-auto mt-8 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <ul className="mt-6 space-y-2 text-left text-sm">
          {STEPS.map((label, i) => {
            const done = i < stepIndex
            const current = i === stepIndex
            return (
              <li
                key={label}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-500 ${
                  current ? 'bg-white/10 text-white' : done ? 'text-indigo-200/80' : 'text-white/35'
                }`}
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                    done
                      ? 'bg-emerald-500/90 text-white'
                      : current
                        ? 'bg-indigo-500 text-white transition-loader-pulse'
                        : 'border border-white/20 bg-white/5'
                  }`}
                >
                  {done ? '✓' : i + 1}
                </span>
                <span className={current ? 'font-medium' : ''}>{label}</span>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

/** Minimum loader duration — one second per step. */
export const TRANSITION_LOADER_MS = STEPS.length * 1000
