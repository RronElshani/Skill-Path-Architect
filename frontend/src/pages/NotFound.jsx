import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <div className="relative">
        <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-brand-600 to-indigo-500 opacity-30 blur-2xl" />
        <h1 className="relative font-mono text-8xl font-black tracking-widest text-brand-600 sm:text-9xl">
          404
        </h1>
      </div>

      <h2 className="mt-8 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
        Page not found
      </h2>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-600">
        The link you followed might be broken, or the page may have been removed. Let's get you back on track.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          to="/"
          className="btn-primary inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold shadow-soft"
        >
          Go to homepage
        </Link>
        <Link
          to="/dashboard"
          className="btn-secondary inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold shadow-soft"
        >
          View dashboard
        </Link>
      </div>
    </div>
  )
}
