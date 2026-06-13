import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Reveal from './Reveal.jsx'

const COUNT_DURATION = 2000 // ms

const stats = [
  { label: 'Intelligence dimensions', value: '8' },
  { label: 'Curated careers', value: '120+' },
  { label: 'Universities referenced', value: '40' },
  { label: 'Assessment minutes', value: '12' }
]

const sampleScores = [
  { name: 'Math and Logic', score: 92 },
  { name: 'Spatial Awareness', score: 86 },
  { name: 'Collaboration Skills', score: 74 },
  { name: 'Language Skills', score: 68 },
  { name: 'Sustainability Focus', score: 55 }
]

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/**
 * Animate a number from `start` to `target` over `duration` ms using an
 * ease-out curve. Respects the user's reduced-motion preference.
 */
function useCountUp(target, { start = 0, duration = COUNT_DURATION } = {}) {
  const [value, setValue] = useState(prefersReducedMotion() ? target : start)
  const rafRef = useRef()

  useEffect(() => {
    if (prefersReducedMotion()) {
      setValue(target)
      return
    }

    let startTs
    const tick = (ts) => {
      if (startTs === undefined) startTs = ts
      const progress = Math.min((ts - startTs) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // easeOutCubic
      setValue(start + (target - start) * eased)
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setValue(target)
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [target, start, duration])

  return value
}

// Animates a stat value from 1 → target, preserving a non-numeric suffix (e.g. "+").
function StatValue({ value }) {
  const match = String(value).match(/^(\d+)(.*)$/)
  const target = match ? parseInt(match[1], 10) : 0
  const suffix = match ? match[2] : ''
  const current = useCountUp(target, { start: 1 })
  return (
    <>
      {Math.round(current)}
      {suffix}
    </>
  )
}

// Animates the score (0 → target) and fills the bar in sync over the same 2s.
function IntelligenceBar({ name, score }) {
  const current = useCountUp(score, { start: 0 })
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-slate-700">{name}</span>
        <span className="font-semibold text-slate-900">{Math.round(current)}</span>
      </div>
      <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-brand-600" style={{ width: `${current}%` }} />
      </div>
    </div>
  )
}

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[480px] w-[820px] -translate-x-1/2 rounded-full bg-brand-100/60 blur-3xl" />
      </div>

      <div className="container-page grid items-center gap-12 py-20 lg:grid-cols-12 lg:py-28">
        <div className="lg:col-span-7">
          <Reveal as="span" delay={0} className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-700">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />
            University capstone project
          </Reveal>
          <Reveal as="h1" delay={100} className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Discover the career path that aligns with how you think.
          </Reveal>
          <Reveal as="p" delay={200} className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
            AI Guidance Counselor guides recent high school graduates through a structured self-assessment grounded in Howard Gardner&apos;s theory of Multiple Intelligences, then maps each profile to evidence-based career trajectories.
          </Reveal>

          <Reveal delay={300} className="mt-8 flex flex-wrap items-center gap-3">
            <Link to="/assessment" className="btn-primary px-6 py-3 text-base">
              Begin the assessment
            </Link>
          </Reveal>

          <Reveal as="dl" delay={400} className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="text-xs font-medium uppercase tracking-wider text-slate-500">{stat.label}</dt>
                <dd className="mt-1 text-2xl font-semibold text-slate-900">
                  <StatValue value={stat.value} />
                </dd>
              </div>
            ))}
          </Reveal>
        </div>

        <div className="lg:col-span-5">
          <Reveal delay={250} className="card relative p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Demo / Example Profile</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">Adelina K.</p>
              </div>
              <span className="badge bg-emerald-50 text-emerald-700">Strong match</span>
            </div>

            <div className="mt-6 space-y-4">
              {sampleScores.map((row) => (
                <IntelligenceBar key={row.name} name={row.name} score={row.score} />
              ))}
            </div>

            <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Top recommendation</p>
              <p className="mt-1.5 text-base font-semibold text-slate-900">Software Engineer</p>
              <p className="mt-1 text-sm text-slate-600">Confidence 94% based on logical reasoning and spatial pattern recognition.</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
