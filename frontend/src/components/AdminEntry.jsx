import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Admin from '../pages/Admin.jsx'
import AdminRoute from './AdminRoute.jsx'

export default function AdminEntry() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <p className="text-sm font-medium text-slate-400">Loading admin...</p>
      </div>
    )
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/admin/login" replace />
  }

  return (
    <AdminRoute>
      <Admin />
    </AdminRoute>
  )
}
