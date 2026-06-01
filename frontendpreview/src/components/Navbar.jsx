import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import Logo from './Logo.jsx'
import { publicNavItems, appNavItems, navLinkClass } from '../config/navigation.js'
import { currentUser } from '../services/users.js'

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

export default function Navbar({
  variant = 'marketing',
  sidebarOpen = false,
  onSidebarToggle,
  onSidebarClose
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const isApp = variant === 'app'
  const navItems = isApp ? appNavItems : publicNavItems

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const userInitials = currentUser.name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')

  const mobileNavOpen = isApp ? sidebarOpen : mobileMenuOpen
  const toggleMobileNav = isApp ? onSidebarToggle : () => setMobileMenuOpen((open) => !open)
  const closeMobileNav = isApp ? onSidebarClose : () => setMobileMenuOpen(false)

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="container-page flex h-16 items-center gap-3 sm:gap-4">
        {isApp && (
          <button
            type="button"
            onClick={toggleMobileNav}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-700 lg:hidden"
            aria-label="Toggle sidebar"
            aria-expanded={mobileNavOpen}
          >
            <MenuIcon open={mobileNavOpen} />
          </button>
        )}

        <Logo className="shrink-0" />

        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 md:flex" aria-label="Main navigation">
          {navItems.map((item) => (
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

        <div className="ml-auto flex shrink-0 items-center gap-2">
          {isApp ? (
            <Link
              to="/profile"
              className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-slate-100"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-xs font-semibold text-white">
                {userInitials}
              </span>
              <span className="hidden text-sm font-medium text-slate-700 sm:block">{currentUser.name.split(' ')[0]}</span>
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn-ghost hidden sm:inline-flex">Login</Link>
              <Link to="/register" className="btn-primary">Get started</Link>
            </>
          )}
        </div>

        {!isApp && (
          <button
            type="button"
            onClick={toggleMobileNav}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-700 md:hidden"
            aria-label="Toggle navigation"
            aria-expanded={mobileNavOpen}
          >
            <MenuIcon open={mobileNavOpen} />
          </button>
        )}
      </div>

      {!isApp && (
        <div
          className={`overflow-hidden border-slate-200 bg-white transition-[max-height,opacity] duration-200 ease-out md:hidden ${
            mobileMenuOpen ? 'max-h-96 border-t opacity-100' : 'max-h-0 opacity-0'
          }`}
          aria-hidden={!mobileMenuOpen}
        >
          <div className="container-page flex flex-col gap-1 py-3">
            {publicNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={closeMobileNav}
                className={({ isActive }) => navLinkClass(isActive)}
              >
                {item.label}
              </NavLink>
            ))}
            <div className="mt-2 flex gap-2">
              <Link to="/login" className="btn-secondary flex-1" onClick={closeMobileNav}>Login</Link>
              <Link to="/register" className="btn-primary flex-1" onClick={closeMobileNav}>Get started</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
