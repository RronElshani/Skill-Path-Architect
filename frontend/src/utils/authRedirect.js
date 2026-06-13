const AUTH_ROUTES = new Set(['/login', '/register', '/admin/login', '/forgot-password'])

export function getSafeRedirectPath(from, fallback = '/dashboard') {
  if (!from || typeof from !== 'string') return fallback
  if (!from.startsWith('/') || from.startsWith('//')) return fallback

  const pathOnly = from.split('?')[0].split('#')[0]
  if (AUTH_ROUTES.has(pathOnly)) return fallback

  return from
}
