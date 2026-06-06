import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import Logo from './Logo.jsx'
import { mainNavItems, navLinkClass } from '../config/navigation.js'
import { useAuth } from '../context/AuthContext.jsx'

function MenuIcon({ open }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {open ? (
        <>
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </>
      ) : (
        <>
          <path d="M4 7h16" />
          <path d="M4 12h16" />
          <path d="M4 17h16" />
        </>
      )}
    </svg>
  )
}

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const { user, logout } = useAuth()

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const displayName = user?.name || 'Guest User'
  const userInitials = displayName
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')

  // Filter nav items: if user is not logged in, hide private pages from top navbar.
  // If user is logged in, hide 'Home' and only show Dashboard, Assessment, Results, Profile (and Admin Users if admin).
  let filteredNavItems = []
  if (!user) {
    filteredNavItems = mainNavItems.filter((item) => item.to === '/')
  } else {
    filteredNavItems = mainNavItems.filter((item) => item.to !== '/')
    if (user.role === 'admin') {
      filteredNavItems.push({ to: '/admin/users', label: 'Admin Users' })
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="container-page flex h-16 items-center gap-3 sm:gap-4">
        <Logo className="shrink-0" />

        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 md:flex" aria-label="Main navigation">
          {filteredNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => navLinkClass(isActive)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-3">
          {user ? (
            <>
              <Link
                to="/profile"
                className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-slate-100"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-xs font-semibold text-white">
                  {userInitials}
                </span>
                <span className="hidden text-sm font-medium text-slate-700 sm:block">
                  {displayName.split(' ')[0]}
                </span>
              </Link>
              <button
                type="button"
                onClick={logout}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-soft transition-all hover:bg-slate-50 hover:text-slate-900 sm:text-sm"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="btn-primary rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-soft transition-all hover:bg-brand-700"
            >
              Sign in
            </Link>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-700 md:hidden"
            aria-label="Toggle navigation"
            aria-expanded={mobileMenuOpen}
          >
            <MenuIcon open={mobileMenuOpen} />
          </button>
        </div>
      </div>

      <div
        className={`overflow-hidden border-slate-200 bg-white transition-[max-height,opacity] duration-200 ease-out md:hidden ${
          mobileMenuOpen ? 'max-h-96 border-t opacity-100' : 'max-h-0 opacity-0'
        }`}
        aria-hidden={!mobileMenuOpen}
      >
        <div className="container-page flex flex-col gap-1 py-3">
          {filteredNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => navLinkClass(isActive)}
            >
              {item.label}
            </NavLink>
          ))}
          {user && (
            <button
              onClick={() => {
                setMobileMenuOpen(false)
                logout()
              }}
              className="w-full text-left rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors mt-2 pt-2 border-t border-slate-100"
            >
              Sign out
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
