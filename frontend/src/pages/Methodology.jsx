import { Link } from 'react-router-dom'
import SectionTitle from '../components/SectionTitle.jsx'

export default function Methodology() {
  const steps = [
    {
      number: '01',
      title: 'Self-Assessment',
      description: 'The journey begins with an 8-dimension self-assessment based on Howard Gardner\'s Theory of Multiple Intelligences. You rate your skills and preferences on a scale from 1 to 5.'
    },
    {
      number: '02',
      title: 'ML Classification',
      description: 'Assessment scores are processed by an XGBoost classification model. This model has been trained on a highly curated dataset to identify patterns matching 72 distinct career pathways.'
    },
    {
      number: '03',
      title: 'AI Summarization',
      description: 'The top 5 career recommendations and your score profile are sent to our Large Language Model (LLM). It generates a comprehensive, personalized guidance plan explaining your strengths, the career match reasons, and job outlook.'
    }
  ]

  const dimensions = [
    { name: 'Linguistic', desc: 'Sensitivity to words, sounds, meanings, and functions of language.' },
    { name: 'Logical-Mathematical', desc: 'Analyzing problems logically, scientific investigation, and math calculations.' },
    { name: 'Spatial', desc: 'Visualizing, manipulating, and rotating 2D/3D shapes and database structures.' },
    { name: 'Bodily-Kinesthetic', desc: 'Physical coordination, motor skills, and hand-eye precision.' },
    { name: 'Musical', desc: 'Rhythm, pitch, melody, and appreciation of complex acoustic patterns.' },
    { name: 'Interpersonal', desc: 'Understanding others\' motivations, desires, and working collaboratively in teams.' },
    { name: 'Intrapersonal', desc: 'Self-reflection, emotional regulation, and self-directed target execution.' },
    { name: 'Naturalistic', desc: 'Identifying relationships with natural environments, sustainability, and ecology.' }
  ]

  return (
    <div className="mx-auto max-w-5xl space-y-16 py-6">
      <section className="text-center">
        <SectionTitle
          eyebrow="Methodology"
          title="How it actually works: Cognitive theory meets machine learning."
          description="Learn about the educational research, classification models, and generative AI pipelines powering your career recommendations."
          align="center"
        />
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/assessment" className="btn-primary">Try the assessment</Link>
          <Link to="/about" className="btn-secondary">Learn about our team</Link>
        </div>
      </section>

      {/* Process Pipeline */}
      <section className="card p-8 bg-slate-50/50">
        <h2 className="text-2xl font-semibold text-slate-900 mb-8 text-center">The Assessment Pipeline</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="relative flex flex-col items-start p-6 bg-white rounded-2xl shadow-soft border border-slate-100">
              <span className="font-mono text-4xl font-extrabold text-brand-600/20 absolute right-6 top-4">{step.number}</span>
              <h3 className="text-lg font-semibold text-slate-900 mt-4">{step.title}</h3>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Multiple Intelligences Breakdown */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold text-slate-900">Gardner's Multiple Intelligences</h2>
          <p className="mt-2 text-sm text-slate-600">
            Rather than defining intelligence as a single general ability, our platform measures performance across eight specialized cognitive profiles to discover where your natural styles lie.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 mt-8">
          {dimensions.map((dim) => (
            <div key={dim.name} className="card p-5 hover:border-brand-200 transition-all">
              <h3 className="font-semibold text-slate-900">{dim.name}</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">{dim.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* XGBoost and LLM Section */}
      <section className="grid gap-6 md:grid-cols-2">
        <div className="card p-6 sm:p-8 space-y-4">
          <span className="badge bg-indigo-50 text-indigo-700">Classification Model</span>
          <h3 className="text-xl font-semibold text-slate-900">XGBoost ML Classifier</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Our backend AI model runs on an optimized XGBoost classification framework. XGBoost excels at handling tabular data structures like questionnaire scores.
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            Instead of hardcoded rules, the model analyzes historical correlations between Gardner intelligence domains and successful professional trajectories to predict your top matching careers.
          </p>
        </div>

        <div className="card p-6 sm:p-8 space-y-4">
          <span className="badge bg-emerald-50 text-emerald-700">Generative AI</span>
          <h3 className="text-xl font-semibold text-slate-900">Empathetic LLM Guidance</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            While ML classifies your scores, Large Language Models (LLMs) compose the final context.
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            The LLM takes your matches and details how they align with your profile. It formulates a concrete next-steps roadmap, mapping out university pathways, target courses, and personal projects to bootstrap your transition.
          </p>
        </div>
      </section>
    </div>
  )
}
