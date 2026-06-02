import { Link } from 'react-router-dom'

export function LogoMark({ className = 'h-5 w-5' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 19V5" />
      <path d="M4 9h6a4 4 0 0 1 4 4v6" />
      <path d="M14 5h6v6" />
      <path d="M20 5l-8 8" />
    </svg>
  )
}

export default function Logo({ to = '/', className = '' }) {
  return (
    <Link to={to} className={`flex items-center gap-2.5 ${className}`}>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-white shadow-soft">
        <LogoMark />
      </span>
      <div className="hidden flex-col leading-none sm:flex">
        <span className="text-base font-semibold tracking-tight text-slate-900">AI Guidance Counselor</span>
        <span className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-slate-500">
          Career guidance platform
        </span>
      </div>
    </Link>
  )
}
