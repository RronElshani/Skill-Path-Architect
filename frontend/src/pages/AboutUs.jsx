import { Link } from 'react-router-dom'
import SectionTitle from '../components/SectionTitle.jsx'

export default function AboutUs() {
  const members = [
    {
      name: 'Egion Xerxa',
      role: 'Software Architect / Product Design',
      initials: 'EX',
      desc: 'Designed the application and system architecture and integrated LLM counselor agents for personal summary.'
    },
    {
      name: 'Redon Brovina',
      role: 'ML Developer / Product Manager',
      initials: 'RB',
      desc: 'Trained the XGBoost classification models, processed dataset mapping, and managed project progress.'
    },
    {
      name: 'Rron Elshani',
      role: 'Full-Stack Developer',
      initials: 'RE',
      desc: 'Developed the frontend state management, integrated the API endpoints, and optimized application performance.'
    },
    {
      name: 'Rron Morina',
      role: 'Full-Stack Developer',
      initials: 'RM',
      desc: 'Designed the visual design system, created the brand identity, and built the interactive React layouts.'
    }
  ]

  return (
    <div className="mx-auto max-w-4xl space-y-16 py-6">
      <section className="text-center">
        <SectionTitle
          eyebrow="About Us"
          title="Designed by students, built for students."
          description="Meet the creators of Skill-Path-Architect, a capstone initiative helping high school graduates make confident, evidence-based academic decisions."
          align="center"
        />
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/assessment" className="btn-primary">Try the assessment</Link>
          <Link to="/methodology" className="btn-secondary">Read our methodology</Link>
        </div>
      </section>

      {/* Story Section */}
      <section className="card p-6 sm:p-8 space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">Why we built this project</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          As students ourselves, we remember the pressure of deciding what to study or do after high school. All too often, career guidance tests were either simple, outdated static tests or expensive, inaccessible consulting services. We wanted a better option.
        </p>
        <p className="text-sm text-slate-600 leading-relaxed">
          Our goal was to design a platform that combines established cognitive research (Howard Gardner's Multiple Intelligences) with modern machine learning classifiers (XGBoost) and Large Language Models.
        </p>
        <p className="text-sm text-slate-600 leading-relaxed">
          The result is **Skill-Path-Architect** — an intuitive counselor that maps a student\'s natural strengths to realistic career matches, complete with job market outlooks, academic roadmaps, and portfolio project ideas.
        </p>
      </section>

      {/* Team Grid */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-slate-900 text-center">Our Team</h2>
        <div className="grid gap-6 sm:grid-cols-2 mt-8">
          {members.map((member) => (
            <div key={member.name} className="card flex items-start gap-4 p-6 transition-all hover:border-brand-200">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-600 font-mono text-base font-bold text-white shadow-soft">
                {member.initials}
              </span>
              <div>
                <h3 className="font-semibold text-slate-900">{member.name}</h3>
                <p className="text-xs font-semibold text-brand-600">{member.role}</p>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">{member.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
