import { Link } from 'react-router-dom'

const sections = [
  {
    title: 'Platform',
    links: [
      { label: 'Home', to: '/' },
      { label: 'Dashboard', to: '/dashboard' },
      { label: 'Assessment', to: '/assessment' },
      { label: 'Results', to: '/results' }
    ]
  },
  {
    title: 'Resources',
    links: [
      { label: 'Profile', to: '/profile' },
      { label: 'Admin Users', to: '/admin/users' },
      { label: 'Login', to: '/login' },
      { label: 'Register', to: '/register' }
    ]
  },
  {
    title: 'Project',
    links: [
      { label: 'University Capstone', to: '/' },
      { label: 'Multiple Intelligences', to: '/assessment' },
      { label: 'Career Library', to: '/results' },
      { label: 'Methodology', to: '/' }
    ]
  }
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="container-page py-12">
        <div className="grid gap-10 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white shadow-soft">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19V5" />
                  <path d="M4 9h6a4 4 0 0 1 4 4v6" />
                  <path d="M14 5h6v6" />
                  <path d="M20 5l-8 8" />
                </svg>
              </span>
              <span className="text-base font-semibold tracking-tight text-slate-900">Skill Path Architect</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-600">
              A research-driven career guidance platform grounded in Howard Gardner&apos;s theory of Multiple Intelligences, designed for recent high school graduates.
            </p>
          </div>

          {sections.map((section) => (
            <div key={section.title}>
              <h4 className="text-sm font-semibold text-slate-900">{section.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-sm text-slate-600 transition hover:text-brand-700">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-slate-500">
            &copy; {year} Skill Path Architect. University capstone project. All rights reserved.
          </p>
          <p className="text-xs text-slate-500">
            Built with React, Vite and Tailwind CSS.
          </p>
        </div>
      </div>
    </footer>
  )
}
