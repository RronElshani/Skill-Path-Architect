export default function ProfileCard({ name, email, role, joined }) {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')

  return (
    <div className="card p-6">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-lg font-semibold text-white">
          {initials}
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-xl font-semibold text-slate-900">{name}</h1>
          <p className="truncate text-sm text-slate-500">{email}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="badge bg-brand-50 text-brand-700">{role}</span>
            <span className="text-xs text-slate-400">Member since {joined}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
