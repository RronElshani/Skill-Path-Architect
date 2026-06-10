const DIMENSION_LABELS = {
  language_skills: 'Language',
  math_and_logic: 'Logic & Math',
  spatial_awareness: 'Spatial',
  physical_prowess: 'Physical',
  musical_ability: 'Musical',
  collaboration_skills: 'Collaboration',
  self_awareness: 'Self-awareness',
  sustainability_focus: 'Naturalist',
}

export function getDimensionLabel(key) {
  return DIMENSION_LABELS[key] || key
}

export function buildPlatformStats(users = [], reviews = []) {
  const assessed = users.filter((u) => u.assessment?.completedAt)
  const withSummary = assessed.filter((u) => u.assessment?.summary)
  const withPredictions = assessed.filter((u) => u.assessment?.predictions?.length > 0)

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0

  const satisfiedCount = reviews.filter((r) => r.satisfied).length
  const satisfactionRate = reviews.length > 0 ? (satisfiedCount / reviews.length) * 100 : 0

  const completionRate = users.length > 0 ? (assessed.length / users.length) * 100 : 0

  let confidenceSum = 0
  let confidenceCount = 0
  assessed.forEach((u) => {
    const top = u.assessment?.predictions?.[0]
    if (top?.confidence != null) {
      confidenceSum += top.confidence
      confidenceCount += 1
    }
  })

  return {
    totalUsers: users.length,
    studentCount: users.filter((u) => u.role === 'user').length,
    adminCount: users.filter((u) => u.role === 'admin').length,
    assessedCount: assessed.length,
    summaryCount: withSummary.length,
    predictionCount: withPredictions.length,
    reviewCount: reviews.length,
    completionRate,
    avgRating,
    satisfactionRate,
    avgTopConfidence: confidenceCount > 0 ? confidenceSum / confidenceCount : 0,
  }
}

export function buildIntelligenceAverages(users = []) {
  const keys = Object.keys(DIMENSION_LABELS)
  const totals = Object.fromEntries(keys.map((k) => [k, 0]))
  let count = 0

  users.forEach((user) => {
    const scores = user.assessment?.scores
    if (!user.assessment?.completedAt || !scores) return
    count += 1
    keys.forEach((key) => {
      totals[key] += Number(scores[key] ?? 0)
    })
  })

  return keys.map((key) => ({
    key,
    label: getDimensionLabel(key),
    average: count > 0 ? totals[key] / count : 0,
  }))
}

export function buildTopCareers(users = [], limit = 8) {
  const counts = new Map()

  users.forEach((user) => {
    const predictions = user.assessment?.predictions || []
    predictions.forEach((p, index) => {
      if (!p?.career) return
      const weight = index === 0 ? 3 : index === 1 ? 2 : 1
      counts.set(p.career, (counts.get(p.career) || 0) + weight)
    })
  })

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([career, score]) => ({ career, score }))
}

export function buildRecentActivity(users = [], reviews = [], limit = 8) {
  const events = []

  users.forEach((user) => {
    if (user.createdAt) {
      events.push({
        id: `reg-${user._id}`,
        type: 'registration',
        label: `${user.name} joined the platform`,
        at: user.createdAt,
      })
    }
    if (user.assessment?.completedAt) {
      const top = user.assessment.predictions?.[0]?.career
      events.push({
        id: `assess-${user._id}`,
        type: 'assessment',
        label: top
          ? `${user.name} completed assessment · top match: ${top}`
          : `${user.name} completed the self-assessment`,
        at: user.assessment.completedAt,
      })
    }
  })

  reviews.forEach((review) => {
    const name = review.user?.name || 'A student'
    events.push({
      id: `review-${review._id}`,
      type: 'review',
      label: `${name} rated predictions ${review.rating}/5${review.satisfied ? ' · satisfied' : ''}`,
      at: review.createdAt,
    })
  })

  return events
    .sort((a, b) => new Date(b.at) - new Date(a.at))
    .slice(0, limit)
}

export function buildFunnel(users = [], reviews = []) {
  const total = users.length
  const assessed = users.filter((u) => u.assessment?.completedAt).length
  const reviewed = reviews.length

  return [
    { label: 'Registered', value: total, pct: 100 },
    { label: 'Assessed', value: assessed, pct: total ? (assessed / total) * 100 : 0 },
    { label: 'Left feedback', value: reviewed, pct: total ? (reviewed / total) * 100 : 0 },
  ]
}
