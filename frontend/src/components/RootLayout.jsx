import { Outlet, useLocation, Navigate } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const authRoutes = new Set(['/login', '/register', '/admin/login'])

const appRoutes = [
  '/dashboard',
  '/assessment',
  '/results',
  '/profile',
]

function isAppRoute(pathname) {
  return appRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))
}

function isAdminRoute(pathname) {
  return pathname === '/admin' || pathname === '/admin/login'
}

export default function RootLayout() {
  const { pathname } = useLocation()
  const { user, loading } = useAuth()
  const hideChrome = authRoutes.has(pathname) || pathname === '/admin'
  const isApp = isAppRoute(pathname)

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <svg className="h-10 w-10 animate-spin text-brand-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-sm font-medium text-slate-500">Verifying session...</p>
        </div>
      </div>
    )
  }

  // Redirect unauthenticated users trying to access protected routes
  if (isApp && !user) {
    return <Navigate to="/login" replace />
  }

  if (pathname === '/admin/login' && user?.role === 'admin') {
    return <Navigate to="/admin" replace />
  }

  // Redirect authenticated users away from student login/register only
  if ((pathname === '/login' || pathname === '/register') && user) {
    return <Navigate to="/dashboard" replace />
  }

  if (hideChrome || isAdminRoute(pathname)) {
    return <Outlet />
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Navbar />

      {isApp ? (
        <div className="container-page flex-1 py-8 lg:py-10">
          <main className="min-w-0">
            <Outlet />
          </main>
        </div>
      ) : (
        <>
          <main className="flex-1">
            <Outlet />
          </main>
          <Footer />
        </>
      )}
    </div>
  )
}
