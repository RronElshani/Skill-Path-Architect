const tabs = [
  { id: 'overview', label: 'Overview', icon: 'M4 19V5M4 9h6a4 4 0 0 1 4 4v6M14 5h6v6M20 5l-8 8' },
  { id: 'users', label: 'Users', icon: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M16 3.128a4 4 0 0 1 0 7.744M22 21v-2a4 4 0 0 0-3-3.87' },
  { id: 'feedback', label: 'Feedback', icon: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' },
  { id: 'insights', label: 'Career insights', icon: 'M12 3v18M3 12h18M6 6l12 12M18 6 6 18' },
  { id: 'models', label: 'Model management', icon: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z' },
]

export default function AdminTabs({ active, onChange }) {
  return (
    <nav className="flex flex-wrap gap-2 border-b border-slate-800 pb-4">
      {tabs.map((tab) => {
        const isActive = active === tab.id
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
              isActive
                ? 'bg-amber-500/15 text-amber-200 ring-1 ring-amber-500/30'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d={tab.icon} />
            </svg>
            {tab.label}
          </button>
        )
      })}
    </nav>
  )
}
