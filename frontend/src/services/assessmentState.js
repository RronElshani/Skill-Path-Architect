/**
 * Logged-in users only count as assessed when completedAt is set.
 * Guest sessions rely on localStorage (default MongoDB scores are not a real assessment).
 */
export function hasCompletedAssessment(userAssessment, { isLoggedIn = false, showSample = false } = {}) {
  if (showSample) return true
  if (isLoggedIn) return Boolean(userAssessment?.completedAt)
  return Boolean(localStorage.getItem('career_predictions'))
}

export function hasCareerMatches(userAssessment, { isLoggedIn = false, showSample = false } = {}) {
  if (showSample) return true
  if (isLoggedIn) {
    return Boolean(
      userAssessment?.completedAt &&
        Array.isArray(userAssessment?.predictions) &&
        userAssessment.predictions.length > 0
    )
  }
  return Boolean(localStorage.getItem('career_predictions'))
}
