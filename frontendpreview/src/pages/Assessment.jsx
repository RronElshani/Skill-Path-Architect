import { Link } from 'react-router-dom'
import SectionTitle from '../components/SectionTitle.jsx'
import AssessmentSlider from '../components/AssessmentSlider.jsx'
import { intelligenceDimensions } from '../services/intelligenceScores.js'

export default function Assessment() {
  return (
    <div className="container-page py-12 lg:py-16">
      <div className="mx-auto max-w-3xl">
        <SectionTitle
          eyebrow="Self-assessment"
          title="Reflect on each of the eight intelligence dimensions."
          description="Move the slider on each card to indicate how strongly that intelligence describes you today. Honest reflection produces the most useful career recommendations."
          align="center"
          className="text-center"
        />
      </div>

      <div className="mx-auto mt-10 max-w-4xl">
        <div className="card flex flex-wrap items-center justify-between gap-4 p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Estimated time</p>
            <p className="mt-1 text-base font-semibold text-slate-900">About 12 minutes</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Dimensions</p>
            <p className="mt-1 text-base font-semibold text-slate-900">8 of 8 covered</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Privacy</p>
            <p className="mt-1 text-base font-semibold text-slate-900">For academic showcase</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4">
          {intelligenceDimensions.map((dim) => (
            <AssessmentSlider
              key={dim.id}
              name={dim.name}
              description={dim.description}
              initial={dim.score}
              accent={dim.accent}
            />
          ))}
        </div>

        <div className="mt-10 card flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Ready to see your career matches?</h3>
            <p className="mt-1 text-sm text-slate-600">
              Generate a ranked list of professions tailored to your responses.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/dashboard" className="btn-secondary">Save and return</Link>
            <Link to="/results" className="btn-primary">Generate Career Matches</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
