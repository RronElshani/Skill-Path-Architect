import { useCallback, useEffect, useMemo, useState } from 'react'
import AdminTabs from '../components/admin/AdminTabs.jsx'
import AdminOverview from '../components/admin/AdminOverview.jsx'
import AdminUsersPanel from '../components/admin/AdminUsersPanel.jsx'
import AdminReviewsPanel from '../components/admin/AdminReviewsPanel.jsx'
import AdminInsightsPanel from '../components/admin/AdminInsightsPanel.jsx'
import AdminModelOverview from './AdminModelOverview.jsx'
import {
  deleteReview,
  deleteUser,
  fetchAdminDashboard,
  updateUserRole,
} from '../services/admin.js'
import {
  buildFunnel,
  buildIntelligenceAverages,
  buildPlatformStats,
  buildRecentActivity,
  buildTopCareers,
} from '../utils/adminAnalytics.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function Admin() {
  const { user: currentUser } = useAuth()
  const [tab, setTab] = useState('overview')
  const [users, setUsers] = useState([])
  const [reviews, setReviews] = useState([])
  const [services, setServices] = useState({ api: 'offline', ai: 'offline' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')
  const [userFilter, setUserFilter] = useState('all')
  const [actionId, setActionId] = useState(null)

  const loadDashboard = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchAdminDashboard()
      setUsers(data.users)
      setReviews(data.reviews)
      setServices(data.services)
    } catch (err) {
      setError(err.message || 'Failed to load admin dashboard')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

  const stats = useMemo(() => buildPlatformStats(users, reviews), [users, reviews])
  const funnel = useMemo(() => buildFunnel(users, reviews), [users, reviews])
  const intelligenceAvg = useMemo(() => buildIntelligenceAverages(users), [users])
  const topCareers = useMemo(() => buildTopCareers(users, 6), [users])
  const activity = useMemo(() => buildRecentActivity(users, reviews, 8), [users, reviews])

  const handleDeleteUser = async (userId, name) => {
    if (userId === currentUser?.id) {
      window.alert('You cannot delete your own account while signed in.')
      return
    }
    if (!window.confirm(`Delete ${name}? This cannot be undone.`)) return

    setActionId(userId)
    try {
      await deleteUser(userId)
      setUsers((prev) => prev.filter((u) => u._id !== userId))
    } catch (err) {
      window.alert(err.message || 'Failed to delete user')
    } finally {
      setActionId(null)
    }
  }

  const handleToggleRole = async (userId, currentRole) => {
    if (userId === currentUser?.id) {
      window.alert('You cannot change your own role.')
      return
    }

    const nextRole = currentRole === 'admin' ? 'user' : 'admin'
    if (!window.confirm(`Change this account to "${nextRole}"?`)) return

    setActionId(userId)
    try {
      const updated = await updateUserRole(userId, nextRole)
      setUsers((prev) => prev.map((u) => (u._id === userId ? updated : u)))
    } catch (err) {
      window.alert(err.message || 'Failed to update role')
    } finally {
      setActionId(null)
    }
  }

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Remove this review?')) return
    setActionId(reviewId)
    try {
      await deleteReview(reviewId)
      setReviews((prev) => prev.filter((r) => r._id !== reviewId))
    } catch (err) {
      window.alert(err.message || 'Failed to delete review')
    } finally {
      setActionId(null)
    }
  }

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="inline-flex items-center rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-300">
            AI Guidance Counselor
          </span>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">Operations console</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            Monitor student assessments, model predictions, and satisfaction across the career guidance platform.
          </p>
        </div>
        <button
          type="button"
          onClick={loadDashboard}
          disabled={loading}
          className="self-start rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-800 lg:self-auto"
        >
          {loading ? 'Refreshing…' : 'Refresh all'}
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-3.5 text-sm text-red-300">
          {error}
        </div>
      )}

      <AdminTabs active={tab} onChange={setTab} />

      <div className="mt-8">
        {tab === 'overview' && (
          <AdminOverview
            stats={stats}
            funnel={funnel}
            topCareers={topCareers}
            activity={activity}
            services={services}
            intelligenceAvg={intelligenceAvg}
          />
        )}

        {tab === 'students' && (
          <AdminUsersPanel
            users={users}
            loading={loading}
            query={query}
            onQueryChange={setQuery}
            filter={userFilter}
            onFilterChange={setUserFilter}
            currentUserId={currentUser?.id}
            actionId={actionId}
            onRefresh={loadDashboard}
            onToggleRole={handleToggleRole}
            onDelete={handleDeleteUser}
          />
        )}

        {tab === 'feedback' && (
          <AdminReviewsPanel
            reviews={reviews}
            loading={loading}
            actionId={actionId}
            onDelete={handleDeleteReview}
            onRefresh={loadDashboard}
          />
        )}

        {tab === 'insights' && (
          <AdminInsightsPanel
            intelligenceAvg={intelligenceAvg}
            topCareers={buildTopCareers(users, 10)}
            users={users}
          />
        )}

        {tab === 'models' && (
          <AdminModelOverview />
        )}
      </div>
    </>
  )
}
