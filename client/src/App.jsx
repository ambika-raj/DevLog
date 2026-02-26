import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

// Pages
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import AddProject from './pages/AddProject'
import EditProject from './pages/EditProject'
import ProjectDetail from './pages/ProjectDetail'
import PublicProfile from './pages/PublicProfile'
import ProfileEdit from './pages/ProfileEdit'
import Notes from './pages/Notes'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#0a0f1e' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: '#00C9A7', borderTopColor: 'transparent' }}>
          </div>
          <p style={{ color: '#00C9A7', fontFamily: 'Syne' }}>Loading...</p>
        </div>
      </div>
    )
  }

  return user ? children : <Navigate to="/login" />
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/u/:username" element={<PublicProfile />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/projects" element={
          <ProtectedRoute><Projects /></ProtectedRoute>
        } />
        <Route path="/projects/add" element={
          <ProtectedRoute><AddProject /></ProtectedRoute>
        } />
        <Route path="/projects/edit/:id" element={
          <ProtectedRoute><EditProject /></ProtectedRoute>
        } />
        <Route path="/projects/:id" element={
          <ProtectedRoute><ProjectDetail /></ProtectedRoute>
        } />
        <Route path="/profile/edit" element={
          <ProtectedRoute><ProfileEdit /></ProtectedRoute>
        } />
        <Route path="/notes" element={
          <ProtectedRoute><Notes /></ProtectedRoute>
        } />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  )
}

export default App