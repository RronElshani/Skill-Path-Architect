import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import AppSidebar from './AppSidebar.jsx'

const authRoutes = new Set(['/login', '/register'])

const appRoutes = [
  '/dashboard',
  '/assessment',
  '/results',
  '/profile',
  '/admin/users'
]

function isAppRoute(pathname) {
  return appRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))
}

export default function RootLayout() {
  const { pathname } = useLocation()
  const hideChrome = authRoutes.has(pathname)
  const isApp = isAppRoute(pathname)

  if (hideChrome) {
    return <Outlet />
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Navbar />

      {isApp ? (
        <div className="container-page flex-1 py-8 lg:py-10">
          <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
            <AppSidebar />
            <main className="min-w-0">
              <Outlet />
            </main>
          </div>
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
