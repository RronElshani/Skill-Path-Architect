export function getSavedCareers(userId) {
  const key = userId ? `saved_careers_user_${userId}` : 'saved_careers_guest'
  const raw = localStorage.getItem(key)
  return raw ? JSON.parse(raw) : []
}

export function isCareerSaved(userId, careerId) {
  const saved = getSavedCareers(userId)
  return saved.includes(careerId)
}

export function toggleSaveCareer(userId, careerId) {
  const key = userId ? `saved_careers_user_${userId}` : 'saved_careers_guest'
  const saved = getSavedCareers(userId)
  const idx = saved.indexOf(careerId)
  if (idx > -1) {
    saved.splice(idx, 1)
  } else {
    saved.push(careerId)
  }
  localStorage.setItem(key, JSON.stringify(saved))
  return saved.includes(careerId)
}
