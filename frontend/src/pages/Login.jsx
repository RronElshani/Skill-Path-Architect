import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Input from '../components/Input.jsx'
import Button from '../components/Button.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="relative hidden bg-gradient-to-br from-brand-700 to-brand-900 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/4 top-1/3 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        </div>

        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 text-white">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19V5" />
              <path d="M4 9h6a4 4 0 0 1 4 4v6" />
              <path d="M14 5h6v6" />
              <path d="M20 5l-8 8" />
            </svg>
          </span>
          <span className="text-base font-semibold tracking-tight">AI Guidance Counselor</span>
        </Link>

        <div className="max-w-md">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-100">A research-driven companion</p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight">
            Sign in and continue mapping your next chapter.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-brand-100">
            Review your assessment, revisit recommendations and share your personalized blueprint with advisors.
          </p>
        </div>

        <div className="text-xs text-brand-100">
          University capstone project. All content presented for academic demonstration.
        </div>
      </aside>

      <section className="flex items-center justify-center bg-white px-6 py-12 sm:px-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden">
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
          </div>

          <div className="mt-8 lg:mt-0">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">Welcome back</h1>
            <p className="mt-2 text-sm text-slate-600">
              Enter your credentials to access your career dashboard.
            </p>
          </div>

          {error && (
            <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-3.5 text-sm text-red-700">
              {error}
            </div>
          )}

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <Input
              id="email"
              label="University email"
              type="email"
              placeholder="name@university.edu"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              id="password"
              label="Password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
                Remember me
              </label>
              <Link to="/login" className="text-sm font-medium text-brand-700 hover:text-brand-800">
                Forgot password
              </Link>
            </div>

            <Button type="submit" fullWidth disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            New to AI Guidance Counselor?{' '}
            <Link to="/register" className="font-medium text-brand-700 hover:text-brand-800">
              Create an account
            </Link>
          </p>

          <p className="mt-10 text-center text-xs text-slate-500">
            <Link to="/" className="hover:text-slate-700">Return to homepage</Link>
          </p>
        </div>
      </section>
    </div>
  )
}
