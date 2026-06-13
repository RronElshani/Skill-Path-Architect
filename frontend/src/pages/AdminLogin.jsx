import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Input from '../components/Input.jsx'
import Button from '../components/Button.jsx'
import { useAuth } from '../context/AuthContext.jsx'

import { loadRememberedEmail, saveRememberedEmail } from '../utils/rememberEmail.js'

export default function AdminLogin() {
  const { login, logout, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(location.state?.error || null)

  useEffect(() => {
    const savedEmail = loadRememberedEmail('admin')
    if (savedEmail) {
      setEmail(savedEmail)
      setRememberMe(true)
    }
  }, [])

  useEffect(() => {
    if (user?.role === 'admin') {
      navigate('/admin', { replace: true })
    }
  }, [user, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (user && user.role !== 'admin') {
        await logout()
      }

      const result = await login(email, password)

      if (result.user?.role !== 'admin') {
        await logout()
        setError('This account does not have admin access.')
        return
      }

      saveRememberedEmail(email, rememberMe, 'admin')
      navigate('/admin', { replace: true })
    } catch (err) {
      setError(err.message || 'Admin sign in failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="relative hidden bg-gradient-to-br from-slate-900 to-slate-800 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 -z-10">
          <div className="absolute right-1/4 top-1/4 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl" />
        </div>

        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/20 text-amber-300">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3 4 7v6c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V7l-8-4Z" />
            </svg>
          </span>
          <span className="text-base font-semibold tracking-tight">Admin Console</span>
        </div>

        <div className="max-w-md">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-200/80">Restricted access</p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight">
            Sign in to manage users and platform data.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-300">
            This area is not linked from the public site. Only administrator accounts can continue.
          </p>
        </div>

        <p className="text-xs text-slate-400">AI Guidance Counselor · Internal use only</p>
      </aside>

      <section className="flex items-center justify-center bg-slate-950 px-6 py-12 sm:px-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden">
            <div className="inline-flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/20 text-amber-300">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3 4 7v6c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V7l-8-4Z" />
                </svg>
              </span>
              <span className="text-base font-semibold tracking-tight text-white">Admin Console</span>
            </div>
          </div>

          <div className="mt-8 lg:mt-0">
            <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Admin sign in</h1>
            <p className="mt-2 text-sm text-slate-400">
              Use your administrator credentials to access `/admin`.
            </p>
          </div>

          {error && (
            <div className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 p-3.5 text-sm text-red-300">
              {error}
            </div>
          )}

          {user && user.role !== 'admin' && (
            <div className="mt-6 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3.5 text-sm text-amber-200">
              You are signed in as a regular user. Sign in below with an admin account.
            </div>
          )}

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <Input
              id="admin-email"
              label="Admin email"
              type="email"
              tone="dark"
              placeholder="admin@example.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              id="admin-password"
              label="Password"
              type="password"
              tone="dark"
              placeholder="Enter your password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <label className="flex items-center gap-2 text-sm text-slate-400">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-amber-500 focus:ring-amber-500"
              />
              Remember my email
            </label>

            <Button type="submit" fullWidth disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in to admin'}
            </Button>
          </form>

          <p className="mt-10 text-center text-xs text-slate-500">
            Dev admin: <span className="text-slate-400">admin@guidance-counselor.ai</span> / <span className="text-slate-400">Admin123!</span>
          </p>

          <p className="mt-3 text-center text-xs text-slate-500">
            <Link to="/" className="hover:text-slate-300">Return to public site</Link>
          </p>
        </div>
      </section>
    </div>
  )
}
