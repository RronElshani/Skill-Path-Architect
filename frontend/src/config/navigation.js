export const mainNavItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/dashboard', label: 'Dashboard', end: true },
  { to: '/assessment', label: 'Assessment' },
  { to: '/results', label: 'Results' },
  { to: '/profile', label: 'Profile' }
]

/** @deprecated use mainNavItems */
export const publicNavItems = mainNavItems

/** Sidebar-only extras (not duplicated in the top navbar) */
export const sidebarNavItems = [
  ...mainNavItems,
  { to: '/admin/users', label: 'Admin Users' }
]

export const footerSections = [
  {
    title: 'Platform',
    links: [
      { label: 'Home', to: '/' },
      { label: 'Dashboard', to: '/dashboard' },
      { label: 'Assessment', to: '/assessment' },
      { label: 'Results', to: '/results' }
    ]
  },
  {
    title: 'Resources',
    links: [
      { label: 'Profile', to: '/profile' },
      { label: 'Admin Users', to: '/admin/users' },
      { label: 'Login', to: '/login' },
      { label: 'Register', to: '/register' }
    ]
  },
  {
    title: 'Project',
    links: [
      { label: 'University Capstone', to: '/' },
      { label: 'Multiple Intelligences', to: '/assessment' },
      { label: 'Career Library', to: '/results' },
      { label: 'Methodology', to: '/' }
    ]
  }
]

export function navLinkClass(isActive) {
  return `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
    isActive
      ? 'bg-brand-50 text-brand-700'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
  }`
}

export function sidebarLinkClass(isActive) {
  return `flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
    isActive
      ? 'bg-brand-50 text-brand-700'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
  }`
}
