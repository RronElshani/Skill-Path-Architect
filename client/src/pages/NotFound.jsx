import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-indigo-500 mb-4">404</h1>
        <p className="text-xl text-gray-400 mb-8">Page not found</p>
        <Link
          to="/"
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}

export default NotFound
