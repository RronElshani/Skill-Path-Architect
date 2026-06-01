import { useEffect, useState } from 'react'
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
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  if (hideChrome) {
    return <Outlet />
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Navbar
        variant={isApp ? 'app' : 'marketing'}
        sidebarOpen={sidebarOpen}
        onSidebarToggle={() => setSidebarOpen((open) => !open)}
        onSidebarClose={() => setSidebarOpen(false)}
      />

      {isApp ? (
        <div className="container-page flex-1 py-8 lg:py-10">
          <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
            <AppSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
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
