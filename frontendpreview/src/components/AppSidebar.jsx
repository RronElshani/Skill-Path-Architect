import { NavLink } from 'react-router-dom'
import { appNavItems, sidebarLinkClass } from '../config/navigation.js'
import { currentUser } from '../services/users.js'

const icons = {
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

function SidebarContent({ onNavigate }) {
  const initials = currentUser.name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')

  return (
    <>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900">{currentUser.name}</p>
          <p className="text-xs text-slate-500">{currentUser.role}</p>
        </div>
      </div>

      <nav className="mt-6 flex flex-col gap-1 lg:hidden" aria-label="App navigation">
        {appNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
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
    </>
  )
}

export default function AppSidebar({ open = false, onClose }) {
  return (
    <>
      <button
        type="button"
        className={`fixed inset-0 top-16 z-40 bg-slate-900/40 transition-opacity duration-200 lg:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-label="Close navigation"
        aria-hidden={!open}
        tabIndex={open ? 0 : -1}
        onClick={onClose}
      />

      <aside
        className={`card fixed bottom-0 left-0 top-16 z-50 flex w-[min(100%,280px)] flex-col overflow-y-auto p-5 transition-transform duration-200 ease-out lg:static lg:z-auto lg:h-fit lg:w-auto lg:translate-x-0 lg:overflow-visible lg:sticky lg:top-20 ${
          open ? 'translate-x-0' : '-translate-x-full pointer-events-none lg:pointer-events-auto'
        }`}
        aria-label="Sidebar"
      >
        <SidebarContent onNavigate={onClose} />
      </aside>
    </>
  )
}
