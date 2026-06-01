import { Link } from 'react-router-dom'
import AiBadge from './AiBadge.jsx'

export default function AiResultsHero({ report, topMatch }) {
  const firstName = report.studentName.split(' ')[0]
  return (
    <section className="ai-panel-dark p-6 sm:p-8">
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl" />
      <div className="relative">
        <AiBadge label="Analysis complete" pulse />
        <span className="ml-3 text-xs text-indigo-200">{report.modelVersion}</span>
        <h1 className="mt-4 text-2xl font-semibold sm:text-3xl">AI career report for {firstName}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-indigo-100/90">
          Model analyzed {report.dimensionsAssessed} dimensions against <strong className="text-white">72 professions</strong>.
          Top prediction: <strong className="text-cyan-300">{topMatch.name}</strong> at{' '}
          <strong className="text-cyan-300">{topMatch.confidence}%</strong>.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Top match', value: `${topMatch.confidence}%` },
            { label: 'Model accuracy', value: report.modelAccuracy },
            { label: 'Careers matched', value: report.careersMatched },
            { label: 'Profile score', value: `${report.overallConfidence}%` }
          ].map((s) => (
            <div key={s.label} className="ai-stat">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-indigo-300">{s.label}</p>
              <p className="mt-1 font-mono text-xl font-semibold">{s.value}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          <Link to="/results/intelligences" className="btn-ai-ghost border-white/20 bg-white/10 text-white hover:bg-white/20">Neural profile →</Link>
          <Link to={`/results/careers/${topMatch.id}`} className="btn-ai">Explore #1 match</Link>
        </div>
        <p className="mt-4 text-xs text-indigo-300/70">Generated {report.completedAt}</p>
      </div>
    </section>
  )
}
