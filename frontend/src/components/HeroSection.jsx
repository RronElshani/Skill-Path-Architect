import { Link } from 'react-router-dom'

const stats = [
  { label: 'Intelligence dimensions', value: '8' },
  { label: 'Curated careers', value: '120+' },
  { label: 'Universities referenced', value: '40' },
  { label: 'Assessment minutes', value: '12' }
]

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[480px] w-[820px] -translate-x-1/2 rounded-full bg-brand-100/60 blur-3xl" />
      </div>

      <div className="container-page grid items-center gap-12 py-20 lg:grid-cols-12 lg:py-28">
        <div className="lg:col-span-7">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-700">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />
            University capstone project
          </span>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Discover the career path that aligns with how you think.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
            AI Guidance Counselor guides recent high school graduates through a structured self-assessment grounded in Howard Gardner&apos;s theory of Multiple Intelligences, then maps each profile to evidence-based career trajectories.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link to="/assessment" className="btn-primary px-6 py-3 text-base">
              Begin the assessment
            </Link>
          </div>

          <dl className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="text-xs font-medium uppercase tracking-wider text-slate-500">{stat.label}</dt>
                <dd className="mt-1 text-2xl font-semibold text-slate-900">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="lg:col-span-5">
          <div className="card relative p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Demo / Example Profile</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">Adelina K.</p>
              </div>
              <span className="badge bg-emerald-50 text-emerald-700">Strong match</span>
            </div>

            <div className="mt-6 space-y-4">
              {[
                { name: 'Math and Logic', score: 92 },
                { name: 'Spatial Awareness', score: 86 },
                { name: 'Collaboration Skills', score: 74 },
                { name: 'Language Skills', score: 68 },
                { name: 'Sustainability Focus', score: 55 }
              ].map((row) => (
                <div key={row.name}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">{row.name}</span>
                    <span className="font-semibold text-slate-900">{row.score}</span>
                  </div>
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-brand-600" style={{ width: `${row.score}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Top recommendation</p>
              <p className="mt-1.5 text-base font-semibold text-slate-900">Software Engineer</p>
              <p className="mt-1 text-sm text-slate-600">Confidence 94% based on logical reasoning and spatial pattern recognition.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
