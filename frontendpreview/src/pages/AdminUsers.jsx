import { useState } from 'react'
import SectionTitle from '../components/SectionTitle.jsx'
import { adminUsers } from '../services/users.js'

const roleStyles = {
  Student: 'bg-brand-50 text-brand-700',
  Advisor: 'bg-violet-50 text-violet-700',
  Administrator: 'bg-amber-50 text-amber-700'
}

const statusStyles = {
  Active: 'bg-emerald-50 text-emerald-700',
  Invited: 'bg-sky-50 text-sky-700',
  Suspended: 'bg-rose-50 text-rose-700'
}

export default function AdminUsers() {
  const [query, setQuery] = useState('')

  const filtered = adminUsers.filter((user) => {
    const term = query.trim().toLowerCase()
    if (!term) return true
    return (
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.role.toLowerCase().includes(term)
    )
  })

  const totals = {
    all: adminUsers.length,
    students: adminUsers.filter((u) => u.role === 'Student').length,
    advisors: adminUsers.filter((u) => u.role === 'Advisor').length,
    administrators: adminUsers.filter((u) => u.role === 'Administrator').length
  }

  return (
    <div className="container-page py-12 lg:py-16">
      <div className="grid items-end gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <SectionTitle
            eyebrow="Administration"
            title="User directory"
            description="Manage accounts, review roles and onboard new members. This page is presented as a visual control panel for academic review."
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 lg:col-span-5 lg:justify-end">
          <button type="button" className="btn-secondary">Export CSV</button>
          <button type="button" className="btn-primary">Invite user</button>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total accounts', value: totals.all },
          { label: 'Students', value: totals.students },
          { label: 'Advisors', value: totals.advisors },
          { label: 'Administrators', value: totals.administrators }
        ].map((item) => (
          <div key={item.label} className="card p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{item.label}</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 card p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <svg viewBox="0 0 24 24" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, email or role"
              className="input-field pl-9"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span>{filtered.length} of {adminUsers.length} accounts</span>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead>
              <tr className="text-left">
                <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Name</th>
                <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Role</th>
                <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Registered</th>
                <th className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((user) => {
                const initials = user.name
                  .split(' ')
                  .map((part) => part[0])
                  .slice(0, 2)
                  .join('')

                return (
                  <tr key={user.id} className="transition hover:bg-slate-50">
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                          {initials}
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`badge ${roleStyles[user.role] || 'bg-slate-100 text-slate-700'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`badge ${statusStyles[user.status] || 'bg-slate-100 text-slate-700'}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-sm text-slate-600">{user.joined}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <button type="button" className="btn-ghost">View</button>
                        <button type="button" className="btn-ghost">Edit</button>
                        <button type="button" className="btn-ghost text-rose-600 hover:bg-rose-50 hover:text-rose-700">Suspend</button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-3 py-10 text-center text-sm text-slate-500">
                    No users match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
