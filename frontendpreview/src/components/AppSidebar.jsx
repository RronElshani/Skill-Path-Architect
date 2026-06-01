import { NavLink } from 'react-router-dom'
import { sidebarNavItems, sidebarLinkClass } from '../config/navigation.js'
import { currentUser } from '../services/users.js'

const icons = {
  '/': (
    <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V9.5z" />
    </svg>
  ),
  '/dashboard': (
    <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  ),
  '/assessment': (
    <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3 8-8" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  ),
  '/results': (
    <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" />
      <path d="M7 14l4-4 4 4 5-6" />
    </svg>
  ),
  '/profile': (
    <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  ),
  '/admin/users': (
    <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8" r="3.5" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M3 20a6 6 0 0 1 12 0" />
      <path d="M14 20a4 4 0 0 1 8 0" />
    </svg>
  )
}

export default function AppSidebar() {
  const initials = currentUser.name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')

  return (
    <aside className="card sticky top-20 hidden h-fit p-5 lg:block" aria-label="Sidebar">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900">{currentUser.name}</p>
          <p className="text-xs text-slate-500">{currentUser.role}</p>
        </div>
      </div>

      <nav className="mt-6 flex flex-col gap-1" aria-label="Secondary navigation">
        {sidebarNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => sidebarLinkClass(isActive)}
          >
            <span className="text-current">{icons[item.to]}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-6 rounded-lg border border-brand-100 bg-brand-50/60 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">Tip</p>
        <p className="mt-1 text-sm leading-relaxed text-slate-700">
          Retake the assessment each semester to track how your strengths evolve.
        </p>
      </div>
    </aside>
  )
}
