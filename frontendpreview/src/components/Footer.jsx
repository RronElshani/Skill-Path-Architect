import { Link } from 'react-router-dom'
import Logo from './Logo.jsx'
import { footerSections } from '../config/navigation.js'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="container-page py-12">
        <div className="grid gap-10 lg:grid-cols-4">
          <div className="space-y-4">
            <Logo />
            <p className="text-sm leading-relaxed text-slate-600">
              A research-driven career guidance platform grounded in Howard Gardner&apos;s theory of Multiple Intelligences, designed for recent high school graduates.
            </p>
          </div>

          {footerSections.map((section) => (
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
            &copy; {year} AI Guidance Counselor. University capstone project. All rights reserved.
          </p>
          <p className="text-xs text-slate-500">
            Built with React, Vite and Tailwind CSS.
          </p>
        </div>
      </div>
    </footer>
  )
}
