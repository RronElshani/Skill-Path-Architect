import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Assessment from './pages/Assessment.jsx'
import Results from './pages/Results.jsx'
import Profile from './pages/Profile.jsx'
import AdminUsers from './pages/AdminUsers.jsx'

const hideChromeRoutes = ['/login', '/register']

export default function App() {
  const location = useLocation()
  const hideChrome = hideChromeRoutes.includes(location.pathname)

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      {!hideChrome && <Navbar />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/assessment" element={<Assessment />} />
          <Route path="/results" element={<Results />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin/users" element={<AdminUsers />} />
        </Routes>
      </main>
      {!hideChrome && <Footer />}
    </div>
  )
}
