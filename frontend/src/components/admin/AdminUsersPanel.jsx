import { useState } from 'react'
import { getDimensionLabel } from '../../utils/adminAnalytics.js'

const roleStyles = {
  user: 'bg-brand-500/15 text-brand-200',
  admin: 'bg-amber-500/15 text-amber-200',
}

function formatDate(value) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function UserDetail({ user, onClose }) {
  const scores = user.assessment?.scores || {}
  const predictions = user.assessment?.predictions || []

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="h-full w-full max-w-lg overflow-y-auto border-l border-slate-800 bg-slate-950 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">Student profile</p>
            <h2 className="mt-1 text-xl font-semibold text-white">{user.name}</h2>
            <p className="text-sm text-slate-400">{user.email}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white">
            ✕
          </button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-3">
            <p className="text-xs text-slate-500">Joined</p>
            <p className="mt-1 text-sm font-medium text-white">{formatDate(user.createdAt)}</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-3">
            <p className="text-xs text-slate-500">Assessment</p>
            <p className="mt-1 text-sm font-medium text-white">
              {user.assessment?.completedAt ? formatDate(user.assessment.completedAt) : 'Not started'}
            </p>
          </div>
        </div>

        {user.assessment?.completedAt ? (
          <>
            <div className="mt-8">
              <h3 className="text-sm font-semibold text-slate-300">Intelligence profile</h3>
              <div className="mt-4 space-y-3">
                {Object.entries(scores).map(([key, value]) => (
                  <div key={key}>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="text-slate-400">{getDimensionLabel(key)}</span>
                      <span className="text-slate-300">{Number(value).toFixed(1)}/5</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-400"
                        style={{ width: `${(Number(value) / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {predictions.length > 0 && (
              <div className="mt-8">
                <h3 className="text-sm font-semibold text-slate-300">Top career matches</h3>
                <ul className="mt-4 space-y-2">
                  {predictions.map((p) => (
                    <li key={p.rank} className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900 px-3 py-2.5">
                      <span className="text-sm text-slate-200">
                        <span className="mr-2 text-xs text-slate-600">#{p.rank}</span>
                        {p.career}
                      </span>
                      <span className="text-xs font-medium text-cyan-300">{p.confidence}%</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {user.assessment?.summary && (
              <div className="mt-8">
                <h3 className="text-sm font-semibold text-slate-300">AI summary excerpt</h3>
                <p className="mt-3 rounded-lg border border-slate-800 bg-slate-900 p-4 text-sm leading-relaxed text-slate-400">
                  {user.assessment.summary.slice(0, 280)}
                  {user.assessment.summary.length > 280 ? '…' : ''}
                </p>
              </div>
            )}
          </>
        ) : (
          <p className="mt-8 text-sm text-slate-500">This student has not completed the Gardner assessment yet.</p>
        )}
      </div>
    </div>
  )
}

export default function AdminUsersPanel({
  users,
  loading,
  query,
  onQueryChange,
  filter,
  onFilterChange,
  currentUserId,
  actionId,
  onRefresh,
  onToggleRole,
  onDelete,
}) {
  const [selected, setSelected] = useState(null)

  const filtered = users.filter((user) => {
    const term = query.trim().toLowerCase()
    const matchesSearch =
      !term ||
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.role.toLowerCase().includes(term)

    const matchesFilter =
      filter === 'all' ||
      (filter === 'assessed' && user.assessment?.completedAt) ||
      (filter === 'pending' && !user.assessment?.completedAt) ||
      (filter === 'admin' && user.role === 'admin')

    return matchesSearch && matchesFilter
  })

  return (
    <>
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All' },
              { id: 'assessed', label: 'Assessed' },
              { id: 'pending', label: 'Needs assessment' },
              { id: 'admin', label: 'Admins' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onFilterChange(item.id)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  filter === item.id
                    ? 'bg-amber-500/20 text-amber-200'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="search"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search students..."
              className="input-field border-slate-700 bg-slate-950 text-white placeholder:text-slate-500 sm:w-64"
            />
            <button
              type="button"
              onClick={onRefresh}
              disabled={loading}
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-800"
            >
              Refresh
            </button>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          {loading ? (
            <p className="py-10 text-center text-sm text-slate-500">Loading students...</p>
          ) : (
            <table className="min-w-full divide-y divide-slate-800">
              <thead>
                <tr className="text-left">
                  <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Student</th>
                  <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Top match</th>
                  <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                  <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Joined</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filtered.map((user) => {
                  const isBusy = actionId === user._id
                  const topCareer = user.assessment?.predictions?.[0]

                  return (
                    <tr key={user._id} className="transition hover:bg-slate-800/40">
                      <td className="px-3 py-3">
                        <button type="button" onClick={() => setSelected(user)} className="flex items-center gap-3 text-left">
                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/20 text-xs font-semibold text-amber-200">
                            {user.name.split(' ').map((p) => p[0]).slice(0, 2).join('')}
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-white hover:text-amber-200">{user.name}</p>
                            <p className="text-xs text-slate-500">{user.email}</p>
                          </div>
                        </button>
                      </td>
                      <td className="px-3 py-3 text-sm text-slate-400">
                        {topCareer ? (
                          <span>
                            {topCareer.career}
                            <span className="ml-1 text-xs text-cyan-400/80">{topCareer.confidence}%</span>
                          </span>
                        ) : '—'}
                      </td>
                      <td className="px-3 py-3">
                        <span className={`badge ${roleStyles[user.role]}`}>{user.role}</span>
                        {user.assessment?.completedAt && (
                          <span className="ml-2 badge bg-emerald-500/10 text-emerald-300">Assessed</span>
                        )}
                      </td>
                      <td className="px-3 py-3 text-sm text-slate-400">{formatDate(user.createdAt)}</td>
                      <td className="px-3 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button type="button" className="rounded px-2 py-1 text-xs text-slate-400 hover:bg-slate-800 hover:text-white" onClick={() => setSelected(user)}>
                            View
                          </button>
                          <button
                            type="button"
                            className="rounded px-2 py-1 text-xs text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-40"
                            disabled={isBusy || user._id === currentUserId}
                            onClick={() => onToggleRole(user._id, user.role)}
                          >
                            {user.role === 'admin' ? 'Demote' : 'Promote'}
                          </button>
                          <button
                            type="button"
                            className="rounded px-2 py-1 text-xs text-rose-400 hover:bg-rose-500/10 disabled:opacity-40"
                            disabled={isBusy || user._id === currentUserId}
                            onClick={() => onDelete(user._id, user.name)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {selected && <UserDetail user={selected} onClose={() => setSelected(null)} />}
    </>
  )
}
