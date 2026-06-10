import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import ProfileCard from '../components/ProfileCard.jsx'
import { loadPredictions, careerRecommendations } from '../services/careerRecommendations.js'
import { useAuth } from '../context/AuthContext.jsx'
import { updateProfile, changePassword, setTwoFactor } from '../services/users.js'

const DIMENSION_LABELS = {
  language_skills: 'Language',
  math_and_logic: 'Logic & math',
  spatial_awareness: 'Spatial',
  physical_prowess: 'Physical',
  musical_ability: 'Musical',
  collaboration_skills: 'Collaboration',
  self_awareness: 'Self-awareness',
  sustainability_focus: 'Naturalist',
}

/* ----------------------------- micro-interactions ----------------------------- */

// A small inline success tooltip that fades in next to a control.
function SuccessTip({ show, label = 'Saved' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 transition-all duration-300 ${
        show ? 'opacity-100 translate-y-0' : 'pointer-events-none opacity-0 translate-y-1'
      }`}
    >
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3">
        <path d="M20 6 9 17l-5-5" />
      </svg>
      {label}
    </span>
  )
}

// Inline-editable field: shows the value with an Edit affordance; on save it
// calls onSave and flashes a success tooltip.
function InlineField({ label, value, type = 'text', onSave, maxLength }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const [status, setStatus] = useState('idle') // idle | saving | saved | error
  const [error, setError] = useState('')

  useEffect(() => {
    if (!editing) setDraft(value)
  }, [value, editing])

  const start = () => {
    setDraft(value)
    setError('')
    setEditing(true)
  }
  const cancel = () => {
    setEditing(false)
    setError('')
  }

  const save = async () => {
    const trimmed = String(draft).trim()
    if (trimmed === value) {
      setEditing(false)
      return
    }
    setStatus('saving')
    setError('')
    try {
      await onSave(trimmed)
      setEditing(false)
      setStatus('saved')
      setTimeout(() => setStatus('idle'), 1800)
    } catch (err) {
      setStatus('error')
      setError(err.message || 'Could not save')
    }
  }

  return (
    <div className="border-b border-slate-100 py-3 last:border-b-0">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</span>
        <div className="flex items-center gap-2">
          <SuccessTip show={status === 'saved'} />
          {!editing && (
            <button type="button" onClick={start} className="text-xs font-semibold text-brand-600 hover:text-brand-700">
              Edit
            </button>
          )}
        </div>
      </div>

      {editing ? (
        <div className="mt-2 space-y-2">
          <input
            type={type}
            value={draft}
            maxLength={maxLength}
            autoFocus
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') save()
              if (e.key === 'Escape') cancel()
            }}
            className="input-field"
          />
          {error && <p className="text-xs text-red-600">{error}</p>}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={save}
              disabled={status === 'saving'}
              className="btn-primary px-3.5 py-1.5 text-xs disabled:opacity-60"
            >
              {status === 'saving' ? 'Saving…' : 'Save'}
            </button>
            <button type="button" onClick={cancel} className="btn-ghost px-3.5 py-1.5 text-xs">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="mt-1 truncate text-sm text-slate-800">{value || <span className="text-slate-400">—</span>}</p>
      )}
    </div>
  )
}

// Smooth animated toggle switch.
function Toggle({ checked, onChange, disabled }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-60 ${
        checked ? 'bg-brand-600' : 'bg-slate-300'
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-300 ${
          checked ? 'translate-x-5' : 'translate-x-1'
        }`}
      />
    </button>
  )
}

/* --------------------------------- cards --------------------------------- */

function StatTile({ value, label, accent }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-4">
      <p className={`font-mono text-2xl font-bold ${accent}`}>{value}</p>
      <p className="mt-1 text-xs text-slate-500">{label}</p>
    </div>
  )
}

/* --------------------------------- page --------------------------------- */

export default function Profile() {
  const { user, logout, updateUser } = useAuth()

  const [twoFA, setTwoFA] = useState(false)
  const [twoFAStatus, setTwoFAStatus] = useState('idle') // idle | saving | saved | error
  const [twoFAError, setTwoFAError] = useState('')

  // Change-password form
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' })
  const [pwStatus, setPwStatus] = useState('idle') // idle | saving | saved | error
  const [pwError, setPwError] = useState('')

  const savedCareersKey = user ? `saved_careers_user_${user.id}` : ''

  useEffect(() => {
    setTwoFA(Boolean(user?.twoFactorEnabled))
  }, [user?.twoFactorEnabled])

  const savedIds = useMemo(() => {
    if (!savedCareersKey) return []
    try {
      const raw = localStorage.getItem(savedCareersKey)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  }, [savedCareersKey])

  const topStrengths = useMemo(() => {
    if (!user?.assessment?.scores) return []
    return Object.entries(user.assessment.scores)
      .map(([id, score]) => ({ id, score: Number(score) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
  }, [user?.assessment?.scores])

  if (!user) return null

  loadPredictions(user?.assessment)

  const joinedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })
    : 'Recently'

  const hasAssessment = Boolean(user.assessment?.completedAt)
  const topPrediction = user.assessment?.predictions?.[0]

  const savedCareers = savedIds
    .map((id) =>
      careerRecommendations.find(
        (c) => c.id === id || c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === id
      )
    )
    .filter(Boolean)

  const readiness = [
    { label: 'Account created', done: true },
    { label: 'Assessment completed', done: hasAssessment },
    { label: 'Career matches generated', done: Boolean(topPrediction) },
    { label: 'Careers saved', done: savedCareers.length > 0 },
  ]
  const completedSteps = readiness.filter((r) => r.done).length
  const progressPct = Math.round((completedSteps / readiness.length) * 100)

  const handleToggle2FA = async (next) => {
    setTwoFA(next) // optimistic
    setTwoFAStatus('saving')
    setTwoFAError('')
    try {
      const updated = await setTwoFactor(next)
      updateUser({ twoFactorEnabled: updated.twoFactorEnabled })
      setTwoFAStatus('saved')
      setTimeout(() => setTwoFAStatus('idle'), 1800)
    } catch (err) {
      setTwoFA(!next) // revert
      setTwoFAStatus('error')
      setTwoFAError(err.message || 'Could not update 2FA')
    }
  }

  const handlePasswordSave = async (e) => {
    e.preventDefault()
    setPwError('')
    if (pw.next !== pw.confirm) {
      setPwError('New password and confirmation do not match')
      return
    }
    if (pw.next.length < 6) {
      setPwError('New password must be at least 6 characters')
      return
    }
    setPwStatus('saving')
    try {
      await changePassword({ currentPassword: pw.current, newPassword: pw.next })
      setPw({ current: '', next: '', confirm: '' })
      setPwStatus('saved')
      setTimeout(() => setPwStatus('idle'), 2200)
    } catch (err) {
      setPwStatus('error')
      setPwError(err.message || 'Could not change password')
    }
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-5">
      <ProfileCard
        name={user.name}
        email={user.email}
        role={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
        joined={joinedDate}
      />

      <div className="grid gap-5 lg:grid-cols-2">
        {/* ---------- Identity Details ---------- */}
        <section className="card p-5">
          <h2 className="text-sm font-semibold text-slate-900">Identity details</h2>
          <p className="mt-0.5 text-xs text-slate-500">Update your name, email and password.</p>

          <div className="mt-3">
            <InlineField
              label="Full name"
              value={user.name}
              maxLength={50}
              onSave={async (val) => {
                const updated = await updateProfile({ name: val })
                updateUser({ name: updated.name })
              }}
            />
            <InlineField
              label="Email"
              type="email"
              value={user.email}
              onSave={async (val) => {
                const updated = await updateProfile({ email: val })
                updateUser({ email: updated.email })
              }}
            />
          </div>

          {/* Password update */}
          <form onSubmit={handlePasswordSave} className="mt-4 border-t border-slate-100 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Password</span>
              <SuccessTip show={pwStatus === 'saved'} label="Password updated" />
            </div>
            <div className="mt-2 space-y-2">
              <input
                type="password"
                value={pw.current}
                onChange={(e) => setPw((p) => ({ ...p, current: e.target.value }))}
                placeholder="Current password"
                autoComplete="current-password"
                className="input-field"
              />
              <input
                type="password"
                value={pw.next}
                onChange={(e) => setPw((p) => ({ ...p, next: e.target.value }))}
                placeholder="New password"
                autoComplete="new-password"
                className="input-field"
              />
              <input
                type="password"
                value={pw.confirm}
                onChange={(e) => setPw((p) => ({ ...p, confirm: e.target.value }))}
                placeholder="Confirm new password"
                autoComplete="new-password"
                className="input-field"
              />
              {pwError && <p className="text-xs text-red-600">{pwError}</p>}
              <button
                type="submit"
                disabled={pwStatus === 'saving' || !pw.current || !pw.next}
                className="btn-primary px-3.5 py-1.5 text-xs disabled:opacity-60"
              >
                {pwStatus === 'saving' ? 'Updating…' : 'Update password'}
              </button>
            </div>
          </form>
        </section>

        {/* ---------- Security Hub ---------- */}
        <section className="card p-5">
          <h2 className="text-sm font-semibold text-slate-900">Security hub</h2>
          <p className="mt-0.5 text-xs text-slate-500">Manage how your account is protected.</p>

          <div className="mt-4 flex items-start justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50/60 p-4">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-slate-800">Two-factor authentication</p>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold transition-colors ${
                    twoFA ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {twoFA ? 'On' : 'Off'}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Saves your preference to your account. Enrollment at login is coming soon.
              </p>
              {twoFAError && <p className="mt-1 text-xs text-red-600">{twoFAError}</p>}
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <Toggle checked={twoFA} onChange={handleToggle2FA} disabled={twoFAStatus === 'saving'} />
              <SuccessTip show={twoFAStatus === 'saved'} />
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-slate-100 p-4">
            <p className="text-sm font-semibold text-slate-800">Active session</p>
            <p className="mt-1 text-xs text-slate-500">You are signed in on this device.</p>
            <button
              type="button"
              onClick={logout}
              className="mt-3 text-xs font-semibold text-slate-500 transition hover:text-red-600"
            >
              Sign out of this device
            </button>
          </div>
        </section>

        {/* ---------- Activity & Achievements ---------- */}
        <section className="card p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold text-slate-900">Activity &amp; achievements</h2>
          <p className="mt-0.5 text-xs text-slate-500">Your progress so far.</p>

          {/* progress bar */}
          <div className="mt-4">
            <div className="mb-1 flex justify-between text-xs">
              <span className="text-slate-600">Profile journey</span>
              <span className="font-semibold text-slate-900">{progressPct}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-brand-500 transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* stat tiles */}
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <StatTile value={hasAssessment ? 1 : 0} label="Assessments completed" accent="text-brand-600" />
            <StatTile value={savedCareers.length} label="Saved career benchmarks" accent="text-emerald-600" />
            <StatTile
              value={topPrediction ? `${topPrediction.confidence}%` : '—'}
              label="Top match confidence"
              accent="text-violet-600"
            />
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {/* saved benchmarks */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Saved benchmarks</p>
              {savedCareers.length > 0 ? (
                <ul className="mt-3 space-y-2">
                  {savedCareers.map((career) => (
                    <li key={career.id}>
                      <Link
                        to={`/results/careers/${career.id}`}
                        className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm transition hover:border-brand-200 hover:bg-brand-50/30"
                      >
                        <span className="font-medium text-slate-800">{career.name}</span>
                        <span className="text-xs text-slate-400">{career.confidence}% match</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-slate-500">
                  No saved careers yet.{' '}
                  <Link to="/results" className="font-medium text-brand-700 hover:text-brand-800">
                    Browse results
                  </Link>
                  .
                </p>
              )}
            </div>

            {/* strongest signals */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Strongest signals</p>
              {topStrengths.length > 0 ? (
                <div className="mt-3 space-y-3">
                  {topStrengths.map(({ id, score }) => (
                    <div key={id}>
                      <div className="mb-1 flex justify-between text-xs">
                        <span className="text-slate-600">{DIMENSION_LABELS[id]}</span>
                        <span className="font-medium text-slate-900">{score.toFixed(1)}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-brand-500 transition-all duration-500"
                          style={{ width: `${(score / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-sm text-slate-500">Complete the assessment to reveal your strengths.</p>
              )}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
            <Link
              to="/assessment"
              className="rounded-lg bg-brand-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-brand-700"
            >
              {hasAssessment ? 'Retake assessment' : 'Start assessment'}
            </Link>
            <Link
              to="/results"
              className="rounded-lg border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              View results
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
