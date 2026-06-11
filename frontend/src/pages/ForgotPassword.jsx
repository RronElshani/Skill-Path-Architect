import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Input from '../components/Input.jsx'
import Button from '../components/Button.jsx'
import { API_URL } from '../config/api.js'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1) // 1: Send Code, 2: Reset Password
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const handleSendCode = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to send reset code. Please try again.')
      }

      setSuccess('Verification code has been sent to your email. (Please check your email/console logs)')
      setStep(2)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    if (code.trim().length !== 4 || isNaN(code)) {
      setError('Verification code must be exactly 4 numbers')
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          code: code.trim(),
          newPassword,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Reset password failed. Please check the code and try again.')
      }

      // Success, redirect to login page with success message
      navigate('/login', {
        state: { successMessage: 'Password reset successful! Please log in with your new password.' },
      })
    } catch (err) {
      setError(err.message)
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
            Recover your account in a few simple steps.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-brand-100">
            We will send a 4-digit code to your email. Enter the code and your new password to restore access to your career recommendation dashboard.
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
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              {step === 1 ? 'Forgot your password?' : 'Reset password'}
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              {step === 1
                ? 'Enter your registered email address and we will send you a 4-digit verification code.'
                : 'Enter the verification code sent to your email along with your new password.'}
            </p>
          </div>

          {success && (
            <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-3.5 text-sm text-emerald-700">
              {success}
            </div>
          )}

          {error && (
            <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-3.5 text-sm text-red-700">
              {error}
            </div>
          )}

          {step === 1 ? (
            <form className="mt-8 space-y-5" onSubmit={handleSendCode}>
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

              <Button type="submit" fullWidth disabled={loading}>
                {loading ? 'Sending Code...' : 'Send Verification Code'}
              </Button>
            </form>
          ) : (
            <form className="mt-8 space-y-5" onSubmit={handleResetPassword}>
              <Input
                id="code"
                label="Verification Code (4 digits)"
                type="text"
                placeholder="e.g. 1234"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />

              <Input
                id="newPassword"
                label="New Password"
                type="password"
                placeholder="Enter your new password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />

              <Input
                id="confirmPassword"
                label="Confirm New Password"
                type="password"
                placeholder="Confirm your new password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <Button type="submit" fullWidth disabled={loading}>
                {loading ? 'Resetting Password...' : 'Reset Password'}
              </Button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-center text-sm font-medium text-slate-500 hover:text-slate-700 mt-4"
              >
                Go back to email entry
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-slate-600">
            Remembered your password?{' '}
            <Link to="/login" className="font-medium text-brand-700 hover:text-brand-800">
              Sign in
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
