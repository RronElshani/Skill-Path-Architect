export default function DashboardStats({ stats = [] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">{stat.label}</span>
            <span className={`badge ${stat.trend === 'up' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
              {stat.change}
            </span>
          </div>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{stat.value}</p>
          <p className="mt-1 text-sm text-slate-600">{stat.helper}</p>
        </div>
      ))}
    </div>
  )
}
