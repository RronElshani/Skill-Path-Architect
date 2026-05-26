import { useNavigate } from 'react-router-dom'
import authService from '../services/authService'

const Dashboard = () => {
  const navigate = useNavigate()
  const user = authService.getCurrentUser()

  const handleLogout = () => {
    authService.logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-indigo-400">AI Guidance Counselor</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm">
              Welcome, <span className="text-white font-medium">{user?.name || 'User'}</span>
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition-colors cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
        <p className="text-gray-400 mb-8">Manage your learning paths and track your progress.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Placeholder cards */}
          <div className="p-6 bg-gray-900 border border-gray-800 rounded-xl hover:border-indigo-500/50 transition-colors">
            <h3 className="text-lg font-semibold mb-2">My Career Paths</h3>
            <p className="text-gray-400 text-sm">View and manage your custom learning paths.</p>
          </div>
          <div className="p-6 bg-gray-900 border border-gray-800 rounded-xl hover:border-indigo-500/50 transition-colors">
            <h3 className="text-lg font-semibold mb-2">Progress</h3>
            <p className="text-gray-400 text-sm">Track your learning progress across all paths.</p>
          </div>
          <div className="p-6 bg-gray-900 border border-gray-800 rounded-xl hover:border-indigo-500/50 transition-colors">
            <h3 className="text-lg font-semibold mb-2">Explore</h3>
            <p className="text-gray-400 text-sm">Discover new skills and learning resources.</p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
