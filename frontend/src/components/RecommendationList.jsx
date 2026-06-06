import CareerCard from './CareerCard.jsx'

export default function RecommendationList({ recommendations = [] }) {
  if (recommendations.length === 0) {
    return (
      <div className="card p-6 text-sm text-slate-600">
        No recommendations available yet. Complete the assessment to generate matches.
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {recommendations.map((career, index) => (
        <CareerCard
          key={career.id || career.name}
          rank={index + 1}
          name={career.name}
          confidence={career.confidence}
          summary={career.summary}
          intelligences={career.intelligences}
          outlook={career.outlook}
        />
      ))}
    </div>
  )
}
