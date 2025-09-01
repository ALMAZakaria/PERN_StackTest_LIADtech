import { Routes, Route, Navigate } from 'react-router-dom'
import SimpleDashboard from '../components/dashboard/SimpleDashboard'
import UsersPage from '../pages/User/UsersPage'
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import MissionBoardPage from '../pages/missions/MissionBoardPage'
import SkillBridgeDashboardPage from '../pages/dashboard/SkillBridgeDashboardPage'
import ProtectedRoute from '../components/ProtectedRoute'
import { canAccessUsersManagement } from '../utils/roleUtils'

// Simple Home Page
const HomePage = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to SkillBridge Pro</h1>
      <p className="text-lg text-gray-600 mb-8">
        Connect with top talent or find your next opportunity
      </p>
      <div className="space-y-4">
        <div className="space-x-4">
          <a 
            href="/login" 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            Login
          </a>
          <a 
            href="/register" 
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            Register
          </a>
        </div>
        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-3">Or explore the platform:</p>
          <a 
            href="/missions" 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Browse Missions
          </a>
        </div>
      </div>
    </div>
  </div>
)

// Simple Protected Route component for basic auth
const SimpleProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // In a real app, you would check actual authentication state
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return <>{children}</>
}

// Main App Router
const AppRouter = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/missions" element={<MissionBoardPage />} />
      
      {/* Demo routes - no authentication required for testing */}
      <Route path="/demo" element={<SimpleDashboard />} />
      <Route path="/demo/users" element={<UsersPage />} />
      
      {/* Protected routes - require authentication */}
      <Route 
        path="/dashboard" 
        element={
          <SimpleProtectedRoute>
            <SkillBridgeDashboardPage />
          </SimpleProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard/users" 
        element={
          <ProtectedRoute requiredPermission={canAccessUsersManagement}>
            <UsersPage />
          </ProtectedRoute>
        } 
      />
      
      {/* SkillBridge Pro specific routes */}
      <Route 
        path="/missions/create" 
        element={
          <SimpleProtectedRoute>
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Create Mission</h2>
                <p className="text-gray-600">Mission creation form coming soon...</p>
              </div>
            </div>
          </SimpleProtectedRoute>
        } 
      />
      <Route 
        path="/missions/:id" 
        element={
          <SimpleProtectedRoute>
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Mission Details</h2>
                <p className="text-gray-600">Mission details page coming soon...</p>
              </div>
            </div>
          </SimpleProtectedRoute>
        } 
      />
      <Route 
        path="/applications" 
        element={
          <SimpleProtectedRoute>
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Applications</h2>
                <p className="text-gray-600">Applications management coming soon...</p>
              </div>
            </div>
          </SimpleProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <SimpleProtectedRoute>
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile</h2>
                <p className="text-gray-600">Profile management coming soon...</p>
              </div>
            </div>
          </SimpleProtectedRoute>
        } 
      />
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRouter 