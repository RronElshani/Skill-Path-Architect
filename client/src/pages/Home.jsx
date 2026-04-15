import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4">Skill Path Architect</h1>
        <p className="text-gray-400 mb-8 text-lg">
          Build your learning journey, one skill at a time.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/login"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition-colors"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-6 py-3 border border-indigo-600 text-indigo-400 hover:bg-indigo-600/10 rounded-lg font-medium transition-colors"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home
