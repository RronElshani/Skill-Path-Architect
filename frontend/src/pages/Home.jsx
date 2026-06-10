import { Link } from 'react-router-dom'
import HeroSection from '../components/HeroSection.jsx'
import SectionTitle from '../components/SectionTitle.jsx'
import FeatureCard from '../components/FeatureCard.jsx'
import HomeReviewsSection from '../components/HomeReviewsSection.jsx'

const whatItDoes = [
  {
    title: 'Maps your cognitive profile',
    description:
      "A structured questionnaire scores all eight of Gardner's intelligence dimensions and visualizes how they relate.",
    accent: 'brand',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 3v18" />
        <path d="M3 12h18" />
      </svg>
    )
  },
  {
    title: 'Recommends evidence-based careers',
    description:
      'Each intelligence profile is matched to curated career paths with confidence scores and clear reasoning.',
    accent: 'sky',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12l9-9 9 9" />
        <path d="M9 21V12h6v9" />
      </svg>
    )
  },
  {
    title: 'Generates a personalized summary',
    description:
      'Each report includes a written reflection that explains your strengths and suggests concrete next steps.',
    accent: 'emerald',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 6h16" />
        <path d="M4 12h10" />
        <path d="M4 18h16" />
      </svg>
    )
  }
]

const howItWorks = [
  {
    step: '01',
    title: 'Create your account',
    description: 'Register with your university email and confirm a few details about your educational background.'
  },
  {
    step: '02',
    title: 'Complete the self-assessment',
    description: 'Move through eight intelligence dimensions using guided sliders that take roughly twelve minutes.'
  },
  {
    step: '03',
    title: 'Review your career matches',
    description: 'Receive a ranked list of recommended professions with explanations rooted in your profile.'
  },
  {
    step: '04',
    title: 'Plan your next steps',
    description: 'Save favorites, share your report with an advisor and revisit the assessment as you grow.'
  }
]

const features = [
  {
    title: 'Academic foundation',
    description: "Grounded in Howard Gardner's theory of Multiple Intelligences with citations available for educators.",
    accent: 'violet',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 8l10-5 10 5-10 5L2 8z" />
        <path d="M6 10v5c0 1 3 2 6 2s6-1 6-2v-5" />
      </svg>
    )
  },
  {
    title: 'Career library',
    description: 'A growing catalog of professions with outlook data, required skills and recommended electives.',
    accent: 'brand',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M7 4v16" />
        <path d="M11 8h6" />
        <path d="M11 12h6" />
      </svg>
    )
  },
  {
    title: 'Advisor friendly',
    description: 'Shareable reports help counselors and advisors structure productive guidance conversations.',
    accent: 'emerald',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="8" r="3.5" />
        <path d="M3 20a6 6 0 0 1 12 0" />
        <path d="M16 11l2 2 4-4" />
      </svg>
    )
  },
  {
    title: 'Reflective dashboard',
    description: 'A clean overview lets students track progress, revisit summaries and continue planning.',
    accent: 'amber',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18" />
        <path d="M9 21V9" />
      </svg>
    )
  },
  {
    title: 'Inclusive language',
    description: 'Descriptions avoid jargon and translate intelligence research into accessible guidance for graduates.',
    accent: 'sky',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 5h7" />
        <path d="M9 3v2c0 4-3 6-5 6" />
        <path d="M5 9c0 4 4 5 8 5" />
        <path d="M14 11l4 10" />
        <path d="M18 21l4-10" />
        <path d="M14 17h8" />
      </svg>
    )
  },
  {
    title: 'Responsible by design',
    description: "Results are framed as guidance, not prescription, and respect the learner's autonomy.",
    accent: 'rose',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    )
  }
]

const technologies = [
  { name: 'React 18', detail: 'Declarative component model' },
  { name: 'Vite', detail: 'Modern build tooling' },
  { name: 'Tailwind CSS', detail: 'Utility-first styling' },
  { name: 'React Router', detail: 'Client-side navigation' },
  { name: 'Composable UI kit', detail: 'Reusable components' }
]

export default function Home() {
  return (
    <>
      <HeroSection />

      <section className="border-t border-slate-200 bg-white py-20">
        <div className="container-page">
          <SectionTitle
            eyebrow="Project overview"
            title="A research-informed companion for the first decision after high school."
            description="AI Guidance Counselor translates a respected cognitive framework into a clear, modern experience. Each interaction is designed to help graduates reflect, compare and decide with confidence."
          />

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {whatItDoes.map((item) => (
              <FeatureCard key={item.title} title={item.title} description={item.description} accent={item.accent} icon={item.icon} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-page">
          <SectionTitle
            eyebrow="How it works"
            title="Four steps from registration to a concrete plan."
            description="The flow keeps cognitive load low so that students can stay focused on reflection rather than navigation."
          />

          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map((item) => (
              <div key={item.step} className="card relative h-full p-6">
                <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">Step {item.step}</span>
                <h3 className="mt-2 text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white py-20">
        <div className="container-page">
          <SectionTitle
            eyebrow="Features"
            title="Designed to be useful for students, advisors and university programs."
          />

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <FeatureCard
                key={feature.title}
                title={feature.title}
                description={feature.description}
                accent={feature.accent}
                icon={feature.icon}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-page grid items-start gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionTitle
              eyebrow="Technology"
              title="Built on a focused, modern frontend stack."
              description="The showcase prioritizes clarity, performance and accessibility while staying easy for academic reviewers to read."
            />
          </div>
          <div className="lg:col-span-7">
            <div className="grid gap-4 sm:grid-cols-2">
              {technologies.map((tech) => (
                <div key={tech.name} className="card p-5">
                  <p className="text-sm font-semibold text-slate-900">{tech.name}</p>
                  <p className="mt-1 text-sm text-slate-600">{tech.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pb-12">
        <div className="container-page">
          <div className="card relative overflow-hidden bg-gradient-to-br from-brand-700 to-brand-900 p-10 text-white sm:p-14">
            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="relative grid items-center gap-8 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
                  Ready when you are
                </span>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                  Begin your career conversation with data, not guesswork.
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-brand-100">
                  Create your profile, complete the twelve-minute assessment and walk away with a personalized blueprint you can share with mentors and advisors.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 lg:col-span-4 lg:justify-end">
                <Link to="/register" className="btn-secondary bg-white text-brand-700 hover:bg-brand-50">
                  Create account
                </Link>
                <Link to="/assessment" className="btn-primary bg-white/15 text-white hover:bg-white/25">
                  Try the assessment
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <HomeReviewsSection />
    </>
  )
}
