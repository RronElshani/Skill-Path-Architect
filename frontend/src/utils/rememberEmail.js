const EMAIL_KEY = 'remembered_login_email'
const REMEMBER_KEY = 'remember_login'
const ADMIN_EMAIL_KEY = 'remembered_admin_email'
const ADMIN_REMEMBER_KEY = 'remember_admin_login'

export function loadRememberedEmail(scope = 'login') {
  const rememberKey = scope === 'admin' ? ADMIN_REMEMBER_KEY : REMEMBER_KEY
  const emailKey = scope === 'admin' ? ADMIN_EMAIL_KEY : EMAIL_KEY

  if (localStorage.getItem(rememberKey) !== 'true') return ''
  return localStorage.getItem(emailKey) || ''
}

export function saveRememberedEmail(email, remember, scope = 'login') {
  const rememberKey = scope === 'admin' ? ADMIN_REMEMBER_KEY : REMEMBER_KEY
  const emailKey = scope === 'admin' ? ADMIN_EMAIL_KEY : EMAIL_KEY
  const normalized = email.trim().toLowerCase()

  if (remember && normalized) {
    localStorage.setItem(emailKey, normalized)
    localStorage.setItem(rememberKey, 'true')
  } else {
    localStorage.removeItem(emailKey)
    localStorage.removeItem(rememberKey)
  }
}
