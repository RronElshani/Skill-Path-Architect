import { Link } from 'react-router-dom'
import Input from '../components/Input.jsx'
import Button from '../components/Button.jsx'

export default function Register() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <section className="flex items-center justify-center bg-white px-6 py-12 sm:px-10">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white shadow-soft">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19V5" />
                <path d="M4 9h6a4 4 0 0 1 4 4v6" />
                <path d="M14 5h6v6" />
                <path d="M20 5l-8 8" />
              </svg>
            </span>
            <span className="text-base font-semibold tracking-tight text-slate-900">AI Guidance Counselor</span>
          </Link>

          <div className="mt-8">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">Create your account</h1>
            <p className="mt-2 text-sm text-slate-600">
              Set up a profile to begin your assessment and unlock personalized career recommendations.
            </p>
          </div>

          <form className="mt-8 space-y-5" onSubmit={(e) => e.preventDefault()}>
            <Input
              id="fullName"
              label="Full name"
              type="text"
              placeholder="Adelina Krasniqi"
              autoComplete="name"
              required
            />
            <Input
              id="email"
              label="University email"
              type="email"
              placeholder="name@university.edu"
              autoComplete="email"
              required
            />
            <Input
              id="password"
              label="Password"
              type="password"
              placeholder="At least 8 characters"
              autoComplete="new-password"
              hint="Use a mix of letters, numbers and symbols."
              required
            />
            <Input
              id="confirmPassword"
              label="Confirm password"
              type="password"
              placeholder="Repeat your password"
              autoComplete="new-password"
              required
            />

            <label className="flex items-start gap-2.5 text-sm text-slate-600">
              <input type="checkbox" className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
              <span>
                I agree to the academic terms of use and understand this platform is presented for educational demonstration.
              </span>
            </label>

            <Button type="submit" fullWidth>
              Create account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-brand-700 hover:text-brand-800">
              Sign in
            </Link>
          </p>

          <p className="mt-10 text-center text-xs text-slate-500">
            <Link to="/" className="hover:text-slate-700">Return to homepage</Link>
          </p>
        </div>
      </section>

      <aside className="relative hidden bg-gradient-to-br from-brand-700 to-brand-900 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 -z-10">
          <div className="absolute right-1/4 top-1/2 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        </div>

        <div className="text-xs font-semibold uppercase tracking-wider text-brand-100">University capstone</div>

        <div className="max-w-md">
          <h2 className="text-3xl font-semibold leading-tight">A guided start to a thoughtful career decision.</h2>
          <p className="mt-4 text-sm leading-relaxed text-brand-100">
            AI Guidance Counselor combines academic research with a clear interface so that students can explore their strengths confidently and without pressure.
          </p>

          <ul className="mt-8 space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-white/20">
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
              </span>
              Eight intelligence dimensions covered in twelve minutes
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-white/20">
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
              </span>
              Ranked career matches with transparent reasoning
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-white/20">
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
              </span>
              Personalized written summary ready to share with advisors
            </li>
          </ul>
        </div>

        <div className="text-xs text-brand-100">Presented for academic review purposes only.</div>
      </aside>
    </div>
  )
}
