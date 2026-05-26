export default function ProfileCard({ name, email, role, joined, location, headline }) {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')

  return (
    <div className="card overflow-hidden">
      <div className="h-24 w-full bg-gradient-to-r from-brand-600 to-brand-800" />
      <div className="px-6 pb-6">
        <div className="-mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white bg-slate-900 text-xl font-semibold text-white shadow-card">
            {initials}
          </div>
          <span className="badge bg-brand-50 text-brand-700">{role}</span>
        </div>

        <div className="mt-4">
          <h3 className="text-xl font-semibold text-slate-900">{name}</h3>
          {headline && <p className="mt-1 text-sm text-slate-600">{headline}</p>}
        </div>

        <dl className="mt-5 grid gap-3 sm:grid-cols-3">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wider text-slate-500">Email</dt>
            <dd className="mt-1 text-sm font-medium text-slate-800 break-all">{email}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wider text-slate-500">Joined</dt>
            <dd className="mt-1 text-sm font-medium text-slate-800">{joined}</dd>
          </div>
          {location && (
            <div>
              <dt className="text-xs font-medium uppercase tracking-wider text-slate-500">Location</dt>
              <dd className="mt-1 text-sm font-medium text-slate-800">{location}</dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  )
}
