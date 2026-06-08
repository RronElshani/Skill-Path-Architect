import { Routes, Route } from 'react-router-dom'
import RootLayout from './components/RootLayout.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Assessment from './pages/Assessment.jsx'
import Results from './pages/Results.jsx'
import CareerDetail from './pages/CareerDetail.jsx'
import IntelligenceReport from './pages/IntelligenceReport.jsx'
import Profile from './pages/Profile.jsx'
import AdminUsers from './pages/AdminUsers.jsx'
import Methodology from './pages/Methodology.jsx'
import AboutUs from './pages/AboutUs.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/methodology" element={<Methodology />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/assessment" element={<Assessment />} />
        <Route path="/results" element={<Results />} />
        <Route path="/results/intelligences" element={<IntelligenceReport />} />
        <Route path="/results/careers/:careerId" element={<CareerDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin/users" element={<AdminUsers />} />
      </Route>
    </Routes>
  )
}
